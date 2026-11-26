import { packages, generate128dVector } from '../data/seedData.js';

/**
 * Calculates dot product (inner product) between two unit-normalized vectors.
 * Equivalent to FAISS IndexFlatIP.
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return Math.max(0, Math.min(1.0, dotProduct));
}

/**
 * Queries FAISS Vector Database for Top-K nearest neighbors.
 */
export function queryFaissIndex(queryEmbedding, topK = 5) {
  const scores = packages.map(pkg => {
    const sim = cosineSimilarity(queryEmbedding, pkg.embedding);
    return {
      package: pkg,
      similarityScore: parseFloat((sim * 100).toFixed(2)),
      cosineRaw: sim
    };
  });

  scores.sort((a, b) => b.similarityScore - a.similarityScore);
  return scores.slice(0, topK);
}

/**
 * Simulates OpenCV & Siamese CNN Preprocessing Pipeline
 */
export function preprocessAndEmbed(imageUrl, expectedPackageId = '') {
  // Generate embedding vector
  const seed = expectedPackageId ? `${expectedPackageId}-scan` : `scan-${Date.now()}`;
  const embedding = generate128dVector(seed);

  return {
    embedding,
    preprocessing: {
      aspectRatioOk: true,
      lightingNormalized: true,
      boundaryDetected: true,
      blurLaplacianVariance: 294.6,
      glareIndexPct: 2.8
    }
  };
}
