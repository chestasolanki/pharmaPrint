import torch
import torch.nn as nn
import torch.nn.functional as F

class TwinEncoderCNN(nn.Module):
    """
    Twin CNN Encoder branch for extracting microscopic packaging texture biometrics.
    Uses 4 convolutional blocks followed by adaptive pooling and a 128-d projection head.
    """
    def __init__(self, embedding_dim=128):
        super(TwinEncoderCNN, self).__init__()
        
        # Block 1: Micro-surface edge detection
        self.conv1 = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2) # 112x112
        )
        
        # Block 2: Texture pattern aggregation
        self.conv2 = nn.Sequential(
            nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2) # 56x56
        )
        
        # Block 3: High-level printing plate jitter features
        self.conv3 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2) # 28x28
        )
        
        # Block 4: Latent spatial invariance
        self.conv4 = nn.Sequential(
            nn.Conv2d(128, 256, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((4, 4))
        )
        
        # Biometric 128-dimensional Projection Head
        self.fc = nn.Sequential(
            nn.Linear(256 * 4 * 4, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.3),
            nn.Linear(512, embedding_dim)
        )

    def forward_one(self, x):
        out = self.conv1(x)
        out = self.conv2(out)
        out = self.conv3(out)
        out = self.conv4(out)
        out = out.view(out.size(0), -1)
        embedding = self.fc(out)
        # L2-normalize to lie on unit hypersphere (for direct Cosine / FAISS Inner Product search)
        normalized_embedding = F.normalize(embedding, p=2, dim=1)
        return normalized_embedding


class SiameseNetwork(nn.Module):
    """
    Twin Siamese Network sharing identical weights across branches.
    """
    def __init__(self, embedding_dim=128):
        super(SiameseNetwork, self).__init__()
        self.encoder = TwinEncoderCNN(embedding_dim=embedding_dim)

    def forward(self, input1, input2):
        embedding1 = self.encoder.forward_one(input1)
        embedding2 = self.encoder.forward_one(input2)
        return embedding1, embedding2

    def get_embedding(self, x):
        """Single-branch inference for indexing and verification"""
        return self.encoder.forward_one(x)


class ContrastiveLoss(nn.Module):
    """
    Contrastive Loss for Siamese Network metric learning.
    y = 0 for genuine pairs (minimizes distance d),
    y = 1 for different/counterfeit pairs (pushes distance past margin).
    """
    def __init__(self, margin=1.0):
        super(ContrastiveLoss, self).__init__()
        self.margin = margin

    def forward(self, embedding1, embedding2, label):
        euclidean_distance = F.pairwise_distance(embedding1, embedding2, keepdim=True)
        
        loss_contrastive = torch.mean(
            (1 - label) * torch.pow(euclidean_distance, 2) +
            (label) * torch.pow(torch.clamp(self.margin - euclidean_distance, min=0.0), 2)
        )
        return loss_contrastive
