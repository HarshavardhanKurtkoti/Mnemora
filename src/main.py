import sys
import os

# Ensure project root is in sys.path when executed directly as python src/main.py
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging

from src.config.settings import settings
from src.config.database import engine, Base
from src.api import models
from src.api.controllers import rag_controller, stats_controller
from src.api.utils.response import error_response

logger = logging.getLogger(__name__)

# Ensure database tables exist with soft error handling
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    logger.error(f"Error during database table creation: {e}")

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return error_response(message=str(exc), status_code=500)

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTPException: {exc.detail}")
    return error_response(message=str(exc.detail), status_code=exc.status_code)

app.include_router(rag_controller.router, prefix=settings.API_V1_STR)
app.include_router(stats_controller.router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    from src.api.utils.response import success_response
    return success_response({"status": "healthy"})

@app.get("/metrics")
def prometheus_metrics():
    """
    Exposes Prometheus-formatted metrics directly from FastAPI backend
    for scraping by Prometheus or Grafana Agent.
    """
    from fastapi.responses import PlainTextResponse
    import time

    lines = [
        "# HELP mnemora_api_status Operational status of FastAPI backend (1=healthy)",
        "# TYPE mnemora_api_status gauge",
        "mnemora_api_status 1",
        "# HELP mnemora_service_info System metadata",
        "# TYPE mnemora_service_info gauge",
        f'mnemora_service_info{{version="1.0.0",app="{settings.APP_NAME}"}} 1',
    ]
    return PlainTextResponse(content="\n".join(lines) + "\n", media_type="text/plain; version=0.0.4; charset=utf-8")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
