import cv2
import numpy as np
import pytesseract
pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract'
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

# Initialize PyTorch MobileNetV3
weights = models.MobileNet_V3_Small_Weights.DEFAULT
categories = weights.meta["categories"]
mobilenet = models.mobilenet_v3_small(weights=weights)
mobilenet.eval()

# Transform for MobileNet
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

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
    'ointment', 'gel', 'pills', 'hcl', 'ip', 'usp', 'bp'
]

def analyze_image_stream(pil_img):
    # 1. OCR text detection
    try:
        ocr_text = pytesseract.image_to_string(pil_img).lower()
    except Exception as e:
        ocr_text = ""

    pharma_words_found = [kw for kw in PHARMA_KEYWORDS if kw in ocr_text]

    # 2. PyTorch Classification
    tensor = preprocess(pil_img).unsqueeze(0)
    with torch.no_grad():
        logits = mobilenet(tensor)
        probs = torch.softmax(logits, dim=1)[0]
        top5_prob, top5_idx = torch.topk(probs, 5)

    top_classes = [(categories[idx.item()], round(prob.item() * 100, 2), idx.item()) for prob, idx in zip(top5_prob, top5_idx)]
    
    # Check if any top prediction is packaging / container / medicine
    is_pharma_class = any(idx in PHARMA_CLASSES for _, _, idx in top_classes)
    
    # 3. OpenCV Open Packaging / Tamper Cavity Analysis
    np_img = np.array(pil_img.convert("RGB"))
    cv_img = cv2.cvtColor(np_img, cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape

    # Focus on top 35% where the box flap opens
    top_region = gray[0:int(h * 0.35), :]
    bottom_region = gray[int(h * 0.35):, :]
    
    mean_top = np.mean(top_region)
    mean_bottom = np.mean(bottom_region)
    dark_top_pixels = np.sum(top_region < 50) / (top_region.size)
    
    edges = cv2.Canny(cv2.GaussianBlur(gray, (5, 5), 0), 50, 150)
    top_edges = edges[0:int(h * 0.25), :]
    edge_density_top = np.sum(top_edges > 0) / top_edges.size

    # Open if dark cavity at top, or pronounced top edge roughness, or explicit open keyword
    is_open = (dark_top_pixels > 0.08) or (edge_density_top > 0.035 and dark_top_pixels > 0.03) or ("open" in ocr_text)

    # Medicine Determination:
    is_medicine = (len(pharma_words_found) > 0) or is_pharma_class

    return {
        "is_medicine": is_medicine,
        "is_open": is_open,
        "pharma_words": pharma_words_found,
        "top_classes": top_classes[:3],
        "dark_top_ratio": round(dark_top_pixels, 3),
        "edge_density_top": round(edge_density_top, 3)
    }
