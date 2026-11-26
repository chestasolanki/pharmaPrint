import numpy as np
from sklearn.cluster import DBSCAN

class CounterfeitFamilyDetector:
    """
    Groups suspicious packaging scans by recurring defect signatures using DBSCAN clustering.
    Identifies organized counterfeiting operations sharing common manufacturing defects.
    """
    def __init__(self, eps=0.28, min_samples=2):
        self.eps = eps
        self.min_samples = min_samples

    def cluster_defect_signatures(self, defect_feature_vectors, metadata_list):
        """
        Executes DBSCAN clustering on defect feature embeddings.
        - eps: Maximum cosine distance between two samples for one to be considered as in the neighborhood.
        - min_samples: Minimum number of samples in a neighborhood for a point to be considered a core point.
        """
        if len(defect_feature_vectors) < self.min_samples:
            return []

        X = np.array(defect_feature_vectors, dtype=np.float32)
        # Normalize vectors for cosine metric clustering
        norms = np.linalg.norm(X, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        X_norm = X / norms

        # DBSCAN with cosine metric
        clustering = DBSCAN(eps=self.eps, min_samples=self.min_samples, metric='cosine')
        labels = clustering.fit_predict(X_norm)

        clusters = {}
        unique_labels = set(labels)

        for label in unique_labels:
            if label == -1:
                # Noise points (isolated defects that don't belong to a family)
                continue

            indices = np.where(labels == label)[0]
            cluster_items = [metadata_list[i] for i in indices]
            cluster_vectors = X_norm[indices]

            # Compute centroid and intra-cluster similarity
            centroid = np.mean(cluster_vectors, axis=0)
            centroid = centroid / np.linalg.norm(centroid)
            sims = np.dot(cluster_vectors, centroid)
            intra_similarity = float(np.mean(sims))

            cluster_id = f"CF-DBSCAN-{label + 800}"
            clusters[cluster_id] = {
                "cluster_id": cluster_id,
                "label": int(label),
                "member_count": len(indices),
                "intra_cluster_similarity": round(intra_similarity, 3),
                "packages": cluster_items,
                "centroid_vector": centroid.tolist()
            }

        return list(clusters.values())
