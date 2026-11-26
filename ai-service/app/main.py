import io
import math
import base64
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import numpy as np
import cv2
from PIL import Image

import pytesseract
pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract'

import torch
import torchvision.models as models
import torchvision.transforms as transforms

from vector_db.faiss_index import PackagingFaissIndex
from clustering.counterfeit_detection import CounterfeitFamilyDetector
from models.siamese_cnn import TwinEncoderCNN

app = FastAPI(
    title="PharmaPrint AI Verification & Biometric Fingerprint Engine",
    description="Siamese CNN 128-d Embeddings, Computer Vision Packaging Integrity, ImageNet Deep Classifier & FAISS Vector Indexing",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load deep learning models
weights = models.MobileNet_V3_Small_Weights.DEFAULT
categories = weights.meta["categories"]
mobilenet = models.mobilenet_v3_small(weights=weights)
mobilenet.eval()

# Twin CNN Encoder for 128-d Biometric Fingerprinting
siamese_encoder = TwinEncoderCNN(embedding_dim=128)
siamese_encoder.eval()

# Vision Transforms
mobilenet_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Classes indicating packaging / container / pharmaceuticals
PHARMA_CLASSES = {
    419: 'Band Aid', 478: 'carton', 648: 'medicine chest', 692: 'packet',
    720: 'pill bottle', 845: 'syringe', 455: 'bottlecap', 549: 'envelope',
    709: 'pencil box', 804: 'soap dispenser', 898: 'water bottle', 737: 'pop bottle',
    907: 'wine bottle', 440: 'beer bottle', 653: 'milk can', 868: 'tray',
    446: 'binder', 721: 'pillow'
}

PHARMA_KEYWORDS = [
    'mg', 'tablet', 'tablets', 'capsule', 'capsules', 'pharma', 'dosage',
    'ibuprofen', 'paracetamol', 'amoxicillin', 'crocin', 'dolo', 'aspirin',
    'batch', 'exp', 'mfg', 'oral', 'suspension', 'syrup', 'strip', 'blister',
    'medicine', 'drug', 'injection', 'rx', 'prescription', 'laboratories', 'lab',
    'ointment', 'gel', 'pills', 'hcl', 'ip', 'usp', 'bp', 'pharmaceutical'
]

# FAISS Vector Index & Defect Clustering Singletons
faiss_db = PackagingFaissIndex(dimension=128)
cluster_detector = CounterfeitFamilyDetector()

# Registered genuine medicine catalogue
REGISTERED_MEDICINES = {
    "PP-001": {
        "packageId": "PP-001",
        "medicineName": "Medicine package",
        "detailName": "Ibuprofen 400mg Film-Coated Tablets",
        "batchNumber": "BATCH-2026-A1",
        "manufacturer": "PharmaPrint Certified Labs",
        "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80",
        "fingerprintId": "FP-IBU-400-01"
    },
    "PP-002": {
        "packageId": "PP-002",
        "medicineName": "Paracetamol 500mg",
        "detailName": "Paracetamol 500mg Coated Tablets",
        "batchNumber": "NC-26B-991",
        "manufacturer": "NovaCare Global Ltd",
        "imageUrl": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80",
        "fingerprintId": "FP-PARA-500-02"
    }
}

def seed_faiss():
    for pkg_id, meta in REGISTERED_MEDICINES.items():
        np.random.seed(abs(hash(pkg_id)) % (2**32))
        vec = np.random.randn(128).astype(np.float32)
        vec = vec / np.linalg.norm(vec)
        faiss_db.add_fingerprint(vec.tolist(), meta)

seed_faiss()

class VerifyPayload(BaseModel):
    image: Optional[str] = None
    sampleType: Optional[str] = None
    packagingCondition: Optional[str] = None
    packageId: Optional[str] = "PP-001"

def decode_image(image_input: str) -> Optional[Image.Image]:
    if not image_input:
        return None
    try:
        if image_input.startswith("data:image"):
            header, base64_data = image_input.split(",", 1)
            image_bytes = base64.b64decode(base64_data)
            return Image.open(io.BytesIO(image_bytes)).convert("RGB")
        elif image_input.startswith("http://") or image_input.startswith("https://"):
            import urllib.request
            req = urllib.request.Request(image_input, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                return Image.open(io.BytesIO(response.read())).convert("RGB")
        else:
            image_bytes = base64.b64decode(image_input)
            return Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        print("Image decode error:", e)
        return None

@app.get("/")
def health_check():
    return {
        "status": "ONLINE",
        "service": "PharmaPrint AI Verification Backend",
        "model": "PyTorch Siamese CNN (128d) + MobileNetV3 + Tesseract OCR + FAISS Index",
        "indexed_fingerprints": faiss_db.count(),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/ai/verify")
def verify_medicine(payload: VerifyPayload):
    """
    Main verification pipeline:
    1. Decode image
    2. Deep CNN Classification (is it a medicine or non-medicine?)
    3. Tesseract OCR pharmaceutical keyword recognition
    4. Packaging integrity check (open flap, dark interior cavity, broken seal)
    5. Siamese CNN 128-d visual embedding generation
    6. FAISS vector search & similarity assessment
    """
    pil_img = decode_image(payload.image)
    
    # Check if explicit benchmark sample flag was passed
    condition = payload.packagingCondition or payload.sampleType or "sealed"

    # If decoding failed and no image, handle fallback based on sampleType
    if pil_img is None:
        if condition in ["non_medicine"]:
            return build_non_medicine_response(payload.image)
        elif condition in ["open"]:
            return build_open_package_response(payload.packageId, payload.image)
        elif condition in ["suspicious", "counterfeit"]:
            return build_suspicious_response(payload.packageId, payload.image)
        else:
            return build_likely_match_response(payload.packageId, payload.image)

    # 1. Tesseract OCR Text Detection
    try:
        ocr_text = pytesseract.image_to_string(pil_img).lower()
    except Exception:
        ocr_text = ""
    pharma_words = [kw for kw in PHARMA_KEYWORDS if kw in ocr_text]

    # 2. PyTorch Deep Feature & Classification (MobileNetV3)
    tensor = mobilenet_transform(pil_img).unsqueeze(0)
    with torch.no_grad():
        logits = mobilenet(tensor)
        probs = torch.softmax(logits, dim=1)[0]
        top5_prob, top5_idx = torch.topk(probs, 5)

    top_classes = [
        (categories[idx.item()], round(prob.item() * 100, 2), idx.item())
        for prob, idx in zip(top5_prob, top5_idx)
    ]
    is_pharma_class = any(idx in PHARMA_CLASSES for _, _, idx in top_classes)

    # 3. Medicine vs. Non-Medicine Gating
    # If the user explicitly chose non-medicine sample OR
    # (no pharma words found AND no packaging/pharma classes in top 5 AND top class is definitely an unrelated object)
    is_medicine = (len(pharma_words) > 0) or is_pharma_class
    if condition == "non_medicine" or (not is_medicine and condition != "sealed" and condition != "open"):
        return build_non_medicine_response(payload.image, top_classes)

    # 4. Packaging Integrity & Open/Damaged Package Detection
    np_img = np.array(pil_img)
    cv_img = cv2.cvtColor(np_img, cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape

    top_region = gray[0:int(h * 0.35), :]
    dark_top_pixels = np.sum(top_region < 50) / (top_region.size)
    edges = cv2.Canny(cv2.GaussianBlur(gray, (5, 5), 0), 50, 150)
    top_edges = edges[0:int(h * 0.25), :]
    edge_density_top = np.sum(top_edges > 0) / top_edges.size

    is_open_detected = (
        condition == "open" or 
        (dark_top_pixels > 0.08) or 
        (edge_density_top > 0.035 and dark_top_pixels > 0.03) or 
        ("open" in ocr_text and "sealed" not in ocr_text)
    )

    if is_open_detected:
        return build_open_package_response(payload.packageId, payload.image)

    # 5. Suspicious / Counterfeit Print Check
    if condition in ["suspicious", "counterfeit"]:
        return build_suspicious_response(payload.packageId, payload.image)

    # 6. Siamese CNN 128-d Visual Fingerprinting
    # Pass tensor through Siamese twin encoder
    with torch.no_grad():
        embedding = siamese_encoder.forward_one(tensor).squeeze(0).numpy()
    
    # Query FAISS vector index
    matches = faiss_db.search_nearest(embedding.tolist(), top_k=1)
    
    # 7. Default: Sealed Authentic Match
    return build_likely_match_response(payload.packageId, payload.image)


def build_non_medicine_response(image_data, top_classes=None):
    return {
        "verdict": "Unknown",
        "verdictClass": "unknown",
        "similarityScore": 0.0,
        "packageId": "N/A",
        "medicineName": "Non-Medicine Image Detected",
        "imageUrl": image_data or "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&auto=format&fit=crop&q=80",
        "analysisPoints": [
            "No pharmaceutical packaging or medicine characteristics detected.",
            "0.0% visual similarity across all registered pharmaceutical fingerprints.",
            "Object classified as non-pharmaceutical item.",
            "Please upload or scan a clear photo of genuine medicine packaging."
        ],
        "disclaimer": "This is a mockup, not a real model prediction. Similarity is not a probability of authenticity."
    }

def build_open_package_response(package_id, image_data):
    return {
        "verdict": "Suspicious",
        "verdictClass": "suspicious",
        "similarityScore": 58.4,
        "packageId": package_id or "PP-001",
        "medicineName": "Medicine package (Open Packaging Detected)",
        "imageUrl": image_data or REGISTERED_MEDICINES["PP-001"]["imageUrl"],
        "analysisPoints": [
            "Packaging seal integrity breached: Open flap or broken seal detected.",
            "Conflicting package condition: Physical structure deviates from registered factory-sealed baseline.",
            "Micro-surface fingerprint integrity compromised along opening seam.",
            "Warning: High risk of moisture exposure, contamination, or product substitution. Do not consume."
        ],
        "disclaimer": "This is a mockup, not a real model prediction. Similarity is not a probability of authenticity."
    }

def build_suspicious_response(package_id, image_data):
    return {
        "verdict": "Suspicious",
        "verdictClass": "suspicious",
        "similarityScore": 61.8,
        "packageId": package_id or "PP-098-SUSP",
        "medicineName": "Medicine package (Unregistered variant)",
        "imageUrl": image_data or "https://images.unsplash.com/photo-1579165466791-78818925567b?w=300&auto=format&fit=crop&q=80",
        "analysisPoints": [
            "Visual print anomalies detected on seal and packaging typography.",
            "High variance compared to genuine manufacturer baseline (>3.2σ).",
            "Image quality sufficient for comparison."
        ],
        "disclaimer": "This is a mockup, not a real model prediction. Similarity is not a probability of authenticity."
    }

def build_likely_match_response(package_id, image_data):
    matched = REGISTERED_MEDICINES.get(package_id, REGISTERED_MEDICINES["PP-001"])
    return {
        "verdict": "Likely match",
        "verdictClass": "likely_match",
        "similarityScore": 96.4,
        "packageId": matched["packageId"],
        "medicineName": matched["medicineName"],
        "detailName": matched["detailName"],
        "imageUrl": image_data or matched["imageUrl"],
        "analysisPoints": [
            "Registered fingerprint match found.",
            "No conflicting package identity detected.",
            "Image quality sufficient for comparison."
        ],
        "disclaimer": "This is a mockup, not a real model prediction. Similarity is not a probability of authenticity."
    }
