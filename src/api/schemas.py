from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SystemStatSchema(BaseModel):
    documents_indexed: int
    chunks_stored: int
    tokens_total: int
    
    class Config:
        from_attributes = True

class PerformanceMetricSchema(BaseModel):
    strategy_name: str
    recall_at_5: float
    recall_at_10: float
    hit_rate_at_5: float
    mrr_at_10: float
    p95_latency_ms: float
    color: str
    
    class Config:
        from_attributes = True

class QueryHistorySchema(BaseModel):
    id: int
    query_text: str
    strategy_type: str
    latency_ms: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class ActivityFeedSchema(BaseModel):
    id: int
    event_type: str
    title: str
    description: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class SystemHealthSchema(BaseModel):
    service_name: str
    status: str
    version_or_info: str
    
    class Config:
        from_attributes = True
