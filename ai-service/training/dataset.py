import random
import torch
from torch.utils.data import Dataset
import numpy as np

class SiamesePackageDataset(Dataset):
    """
    Dataset generating positive (same physical package under varied angles/lighting)
    and negative pairs (different packages / counterfeits).
    """
    def __init__(self, package_images_dict, transform=None):
        """
        package_images_dict: { 'package_id_1': [img1, img2, ...], 'package_id_2': [...] }
        """
        self.package_dict = package_images_dict
        self.package_ids = list(package_images_dict.keys())
        self.transform = transform

    def __len__(self):
        # Generates pairs dynamically
        return len(self.package_ids) * 100

    def __getitem__(self, idx):
        should_get_same_class = random.random() > 0.5
        
        if should_get_same_class:
            # Positive pair (label = 0)
            pkg_id = random.choice(self.package_ids)
            images = self.package_dict[pkg_id]
            img1 = random.choice(images)
            img2 = random.choice(images)
            label = torch.tensor(0.0, dtype=torch.float32)
        else:
            # Negative pair (label = 1)
            pkg_id1, pkg_id2 = random.sample(self.package_ids, 2)
            img1 = random.choice(self.package_dict[pkg_id1])
            img2 = random.choice(self.package_dict[pkg_id2])
            label = torch.tensor(1.0, dtype=torch.float32)

        if self.transform:
            img1 = self.transform(img1)
            img2 = self.transform(img2)

        return img1, img2, label
