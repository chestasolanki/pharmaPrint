import io
import base64
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import cv2

print("PyTorch Version:", torch.__version__)

# Load MobileNetV3
weights = models.MobileNet_V3_Small_Weights.DEFAULT
categories = weights.meta["categories"]
model = models.mobilenet_v3_small(weights=weights)
model.eval()

print("Categories count:", len(categories))
print("Model ready!")
