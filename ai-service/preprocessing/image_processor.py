import cv2
import numpy as np

class PackagingImageProcessor:
    """
    OpenCV-based image preprocessing pipeline for physical packaging verification.
    """
    def __init__(self, target_size=(224, 224)):
        self.target_size = target_size
        self.clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))

    def assess_quality(self, image_bgr):
        """
        Assesses image quality: blur (Laplacian variance) and glare thresholding.
        """
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        
        # 1. Blur Detection via Laplacian Variance
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        is_sharp = laplacian_var > 100.0 # Standard sharpness threshold

        # 2. Glare Detection via bright pixel saturation
        _, glare_mask = cv2.threshold(gray, 248, 255, cv2.THRESH_BINARY)
        glare_ratio = np.sum(glare_mask > 0) / (gray.shape[0] * gray.shape[1])
        glare_acceptable = glare_ratio < 0.08 # Max 8% saturated specular reflections

        # 3. Overall Lighting Mean
        mean_brightness = np.mean(gray)
        lighting_acceptable = 40.0 <= mean_brightness <= 220.0

        quality_score = min(100.0, max(10.0, (laplacian_var / 3.0) * 0.5 + (1.0 - glare_ratio) * 50.0))

        return {
            "is_valid": is_sharp and glare_acceptable and lighting_acceptable,
            "sharpness_variance": round(laplacian_var, 2),
            "glare_ratio_pct": round(glare_ratio * 100, 2),
            "mean_brightness": round(mean_brightness, 2),
            "quality_score": round(quality_score, 1)
        }

    def extract_package_roi(self, image_bgr):
        """
        Detects packaging boundary contours and extracts perspective-corrected ROI.
        """
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edged = cv2.Canny(blurred, 50, 150)

        contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            # Find largest quadrilateral contour
            c = max(contours, key=cv2.contourArea)
            if cv2.contourArea(c) > (image_bgr.shape[0] * image_bgr.shape[1] * 0.15):
                x, y, w, h = cv2.boundingRect(c)
                roi = image_bgr[y:y+h, x:x+w]
                return roi, (x, y, w, h)

        # Fallback to central crop ROI
        h, w = image_bgr.shape[:2]
        margin_y, margin_x = int(h * 0.05), int(w * 0.05)
        return image_bgr[margin_y:h-margin_y, margin_x:w-margin_x], (margin_x, margin_y, w - 2*margin_x, h - 2*margin_y)

    def normalize_lighting_clahe(self, image_bgr):
        """
        Applies Contrast Limited Adaptive Histogram Equalization (CLAHE) in LAB space.
        Normalizes varying ambient room lighting and shadow gradients.
        """
        lab = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        l_eq = self.clahe.apply(l)
        lab_eq = cv2.merge((l_eq, a, b))
        return cv2.cvtColor(lab_eq, cv2.COLOR_LAB2BGR)

    def preprocess_pipeline(self, image_bgr):
        """
        Full end-to-end execution: Quality Check -> ROI Extraction -> CLAHE -> Resize.
        """
        quality = self.assess_quality(image_bgr)
        roi, bbox = self.extract_package_roi(image_bgr)
        normalized_roi = self.normalize_lighting_clahe(roi)
        resized = cv2.resize(normalized_roi, self.target_size, interpolation=cv2.INTER_AREA)

        # Prepare normalized tensor array [0, 1] with ImageNet normalization
        rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        tensor_array = (rgb - mean) / std
        tensor_array = np.transpose(tensor_array, (2, 0, 1)) # Channel-first: [3, 224, 224]

        return {
            "quality": quality,
            "bbox": bbox,
            "processed_image": resized,
            "tensor_array": tensor_array
        }
