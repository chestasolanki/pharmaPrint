import numpy as np

try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False

class PackagingFaissIndex:
    """
    FAISS Vector Index wrapper for sub-millisecond physical packaging fingerprint retrieval.
    Uses Inner Product (IndexFlatIP) on L2-normalized 128d vectors (exact cosine similarity).
    """
    def __init__(self, dimension=128):
        self.dimension = dimension
        self.id_to_package = {}
        self.current_idx = 0

        if FAISS_AVAILABLE:
            self.index = faiss.IndexFlatIP(self.dimension)
        else:
            # Fallback pure NumPy vector storage if faiss-cpu is not installed in local environment
            self.index = None
            self.vectors = np.empty((0, self.dimension), dtype=np.float32)

    def add_fingerprint(self, embedding_vector, package_metadata):
        """
        Adds a 128-d normalized embedding vector to the index.
        """
        vec = np.array(embedding_vector, dtype=np.float32).reshape(1, -1)
        # Ensure L2 normalized
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm

        if FAISS_AVAILABLE and self.index is not None:
            self.index.add(vec)
        else:
            self.vectors = np.vstack([self.vectors, vec])

        self.id_to_package[self.current_idx] = package_metadata
        assigned_id = self.current_idx
        self.current_idx += 1
        return assigned_id

    def search_nearest(self, query_vector, top_k=5):
        """
        Queries index for top-k closest visual fingerprints by cosine similarity.
        """
        q = np.array(query_vector, dtype=np.float32).reshape(1, -1)
        norm = np.linalg.norm(q)
        if norm > 0:
            q = q / norm

        results = []

        if FAISS_AVAILABLE and self.index is not None:
            distances, indices = self.index.search(q, min(top_k, self.index.ntotal))
            for score, idx in zip(distances[0], indices[0]):
                if idx in self.id_to_package:
                    results.append({
                        "similarity_score": round(float(score) * 100, 2),
                        "cosine_raw": float(score),
                        "package_metadata": self.id_to_package[idx]
                    })
        else:
            # Pure NumPy cosine search fallback
            if len(self.vectors) > 0:
                sims = np.dot(self.vectors, q.T).flatten()
                top_indices = np.argsort(sims)[::-1][:top_k]
                for idx in top_indices:
                    results.append({
                        "similarity_score": round(float(sims[idx]) * 100, 2),
                        "cosine_raw": float(sims[idx]),
                        "package_metadata": self.id_to_package.get(idx, {})
                    })

        return results

    def count(self):
        if FAISS_AVAILABLE and self.index is not None:
            return self.index.ntotal
        return len(self.vectors)
