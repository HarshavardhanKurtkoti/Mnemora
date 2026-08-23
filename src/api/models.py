from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from src.config.database import Base

class SystemStat(Base):
    __tablename__ = "system_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    documents_indexed = Column(Integer, default=0)
    chunks_stored = Column(Integer, default=0)
    tokens_total = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    strategy_name = Column(String, index=True)
    recall_at_5 = Column(Float, default=0.0)
    recall_at_10 = Column(Float, default=0.0)
    hit_rate_at_5 = Column(Float, default=0.0)
    mrr_at_10 = Column(Float, default=0.0)
    p95_latency_ms = Column(Float, default=0.0)
    color = Column(String, default="#FFFFFF")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class QueryHistory(Base):
    __tablename__ = "query_history"
    
    id = Column(Integer, primary_key=True, index=True)
    query_text = Column(String, index=True)
    strategy_type = Column(String)
    latency_ms = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ActivityFeed(Base):
    __tablename__ = "activity_feed"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String) # "document_ingested", "benchmark_eval", "health_check"
    title = Column(String)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SystemHealth(Base):
    __tablename__ = "system_health"
    
    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String, unique=True, index=True)
    status = Column(String, default="healthy") # "healthy", "degraded", "down"
    version_or_info = Column(String)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
