from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PreprocessRequest(BaseModel):
    image_base64: str

class QualityMetrics(BaseModel):
    is_valid: bool
    sharpness_variance: float
    glare_ratio_pct: float
    mean_brightness: float
    quality_score: float

class PreprocessResponse(BaseModel):
    quality: QualityMetrics
    bbox: List[int]
    roi_width: int
    roi_height: int

class EmbeddingRequest(BaseModel):
    image_base64: Optional[str] = None
    package_id: Optional[str] = None

class EmbeddingResponse(BaseModel):
    embedding_dim: int = 128
    vector: List[float]
    l2_norm: float
    version: str = "v1.4-siamese-128d"

class SearchRequest(BaseModel):
    query_vector: List[float]
    top_k: int = 5

class SearchResultItem(BaseModel):
    similarity_score: float
    cosine_raw: float
    package_metadata: Dict[str, Any]

class SearchResponse(BaseModel):
    top_matches: List[SearchResultItem]
    total_indexed: int

class ClusterRequest(BaseModel):
    feature_vectors: List[List[float]]
    metadata_list: List[Dict[str, Any]]
    eps: float = 0.28
    min_samples: int = 2

class GeoAnalysisRequest(BaseModel):
    lat1: float
    lng1: float
    time1_iso: str
    lat2: float
    lng2: float
    time2_iso: str
    velocity_limit_kmh: float = 800.0

class GeoAnalysisResponse(BaseModel):
    distance_km: float
    elapsed_minutes: float
    calculated_velocity_kmh: float
    is_impossible_travel: bool
    severity: str
    explanation: str
