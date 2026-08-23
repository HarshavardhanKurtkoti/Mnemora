import os
import sys

# Add root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.config.database import engine, Base, SessionLocal
from src.api import models

def init_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

def seed_db():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(models.SystemStat).first():
            print("Database already seeded.")
            return

        print("Seeding data...")
        
        # 1. System Stat
        stat = models.SystemStat(documents_indexed=12, chunks_stored=423, tokens_total=38200)
        db.add(stat)
        
        # 2. Performance Metrics
        metrics = [
            models.PerformanceMetric(strategy_name="Vector Search", recall_at_5=51.7, color="#00E5FF"),
            models.PerformanceMetric(strategy_name="BM25", recall_at_5=42.7, color="#8B5CF6"),
            models.PerformanceMetric(strategy_name="Hybrid RRF", recall_at_5=48.7, color="#14B8A6"),
            models.PerformanceMetric(strategy_name="Hybrid + Reranker", recall_at_5=49.0, color="#F59E0B")
        ]
        db.add_all(metrics)
        
        # 3. Query History
        queries = [
            models.QueryHistory(query_text="How does authentication work for checkout?", strategy_type="Hybrid RRF", latency_ms=2100),
            models.QueryHistory(query_text="Explain payment processing architecture", strategy_type="Hybrid RRF", latency_ms=1800),
            models.QueryHistory(query_text="What database is used for storing orders?", strategy_type="Vector Search", latency_ms=1400),
            models.QueryHistory(query_text="How does inventory synchronization work?", strategy_type="Hybrid RRF", latency_ms=2600),
            models.QueryHistory(query_text="What is the retry policy for failed payments?", strategy_type="BM25", latency_ms=1200)
        ]
        db.add_all(queries)
        
        # 4. Activity Feed
        activities = [
            models.ActivityFeed(event_type="document_ingested", title="Document ingested", description="api-reference.md"),
            models.ActivityFeed(event_type="benchmark_eval", title="Benchmark eval completed", description="60 questions • 4 strategies"),
            models.ActivityFeed(event_type="health_check", title="System health check", description="All systems operational"),
            models.ActivityFeed(event_type="document_ingested", title="New document uploaded", description="checkout-flow.md")
        ]
        db.add_all(activities)
        
        # 5. System Health
        health_services = [
            models.SystemHealth(service_name="FastAPI Server", status="healthy", version_or_info="v0.1.0"),
            models.SystemHealth(service_name="Vector Store", status="healthy", version_or_info="ChromaDB"),
            models.SystemHealth(service_name="BM25 Index", status="healthy", version_or_info="In-Memory"),
            models.SystemHealth(service_name="Embeddings", status="healthy", version_or_info="BGE-M3"),
            models.SystemHealth(service_name="Reranker", status="healthy", version_or_info="Cross-Encoder"),
            models.SystemHealth(service_name="LLM Provider", status="healthy", version_or_info="Local")
        ]
        db.add_all(health_services)
        
        db.commit()
        print("Seeding completed successfully.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    seed_db()
