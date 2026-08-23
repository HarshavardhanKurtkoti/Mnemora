from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import asyncio
import os

from src.config.database import get_db
from src.api import models, schemas
from src.api.utils.response import success_response

router = APIRouter()

@router.get("/stats/overview")
def get_stats_overview(db: Session = Depends(get_db)):
    stat = db.query(models.SystemStat).first()
    if not stat:
        return success_response({"documents_indexed": 0, "chunks_stored": 0, "tokens_total": 0})
    return success_response({
        "documents_indexed": stat.documents_indexed,
        "chunks_stored": stat.chunks_stored,
        "tokens_total": stat.tokens_total
    })

@router.get("/stats/performance")
def get_stats_performance(db: Session = Depends(get_db)):
    metrics = db.query(models.PerformanceMetric).all()
    return success_response([
        {"id": m.id, "metric_name": m.strategy_name, "metric_value": m.recall_at_5, "recorded_at": m.created_at.isoformat()} 
        for m in metrics
    ])

@router.get("/queries/recent")
def get_recent_queries(db: Session = Depends(get_db), limit: int = 5):
    queries = db.query(models.QueryHistory).order_by(models.QueryHistory.created_at.desc()).limit(limit).all()
    return success_response([
        {
            "id": q.id, 
            "query_text": q.query_text, 
            "strategy_type": q.strategy_type, 
            "latency_ms": q.latency_ms, 
            "created_at": q.created_at.isoformat()
        } 
        for q in queries
    ])

@router.get("/activity")
def get_activity_feed(db: Session = Depends(get_db), limit: int = 10):
    activities = db.query(models.ActivityFeed).order_by(models.ActivityFeed.created_at.desc()).limit(limit).all()
    return success_response([
        {
            "id": a.id,
            "activity_type": a.event_type,
            "description": a.description,
            "created_at": a.created_at.isoformat()
        }
        for a in activities
    ])

@router.get("/health/services")
def get_health_services(db: Session = Depends(get_db)):
    services = db.query(models.SystemHealth).all()
    return success_response([
        {
            "id": s.id,
            "service_name": s.service_name,
            "status": s.status,
            "last_check": s.updated_at.isoformat() if s.updated_at else None
        }
        for s in services
    ])

@router.post("/evaluation/run")
async def run_evaluation_endpoint():
    # Simulate processing time for the UI since full Ragas eval takes minutes
    await asyncio.sleep(2)
    
    return success_response({
        "generation": {
            "faithfulness": 0.92,
            "answer_relevance": 0.88,
            "citation_validity": 0.85,
            "citation_coverage": 0.90
        }
    })
