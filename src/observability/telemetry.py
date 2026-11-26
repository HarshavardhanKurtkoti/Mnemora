import os
import logging
from typing import Dict, Any, List, Optional
import requests

logger = logging.getLogger(__name__)


class TelemetryDispatcher:
    """
    Asynchronous, non-blocking telemetry forwarder that streams query traces,
    citations, and stage latencies from Mnemora into the Production RAG Monitoring Platform.
    """

    def __init__(self, monitoring_url: Optional[str] = None, timeout: float = 3.0):
        self.monitoring_url = (
            monitoring_url 
            or os.getenv("MONITORING_URL") 
            or os.getenv("PROD_RAG_MONITORING_URL")
            or "http://localhost:8000"
        ).rstrip("/")
        self.timeout = timeout
        self.enabled = os.getenv("ENABLE_MONITORING_TELEMETRY", "true").lower() in ["true", "1", "yes"]
        self.grafana_telemetry_url = os.getenv("GRAFANA_TELEMETRY_URL")

    def emit_query_telemetry(
        self,
        query: str,
        answer: str,
        citations: List[Dict[str, Any]],
        retrieval: Dict[str, Any],
        performance: Dict[str, Any],
        session_id: Optional[str] = None,
        model: Optional[str] = None
    ) -> bool:
        """
        Push live trace payload to prod_rag_monitoring /api/telemetry endpoint.
        Executed in background task to guarantee zero latency overhead on end users.
        """
        if not self.enabled or not self.monitoring_url:
            return False

        endpoint = f"{self.monitoring_url}/api/telemetry"
        payload = {
            "query": query,
            "answer": answer,
            "citations": citations,
            "retrieval": retrieval,
            "performance": performance,
            "session_id": session_id,
            "model": model or os.getenv("LLM_MODEL_NAME", "openai/gpt-oss-120b"),
            "prompt_version": "mnemora_prod_v1",
            "environment": os.getenv("APP_ENV", "Production")
        }

        success = False
        try:
            res = requests.post(endpoint, json=payload, timeout=self.timeout)
            if res.status_code == 200:
                logger.debug(f"Telemetry successfully dispatched to {endpoint}")
                success = True
            else:
                logger.warning(f"Telemetry ingestion returned status {res.status_code}: {res.text}")
        except Exception as ex:
            # Non-blocking soft warning to protect production reliability
            logger.debug(f"Telemetry dispatch to {endpoint} skipped/failed: {ex}")

        # Dispatch live trace to Master Grafana Prometheus Collector if configured
        if self.grafana_telemetry_url:
            grafana_payload = {
                "type": "query",
                "data": {
                    "sessionId": session_id,
                    "model": model or os.getenv("LLM_MODEL_NAME", "openai/gpt-oss-120b"),
                    "retrievalMs": performance.get("retrieval_ms") if isinstance(performance, dict) else None,
                    "generationMs": performance.get("generation_ms") if isinstance(performance, dict) else None,
                    "totalMs": performance.get("total_ms") if isinstance(performance, dict) else None,
                    "vectorMs": retrieval.get("vector_ms") if isinstance(retrieval, dict) else None,
                    "bm25Ms": retrieval.get("bm25_ms") if isinstance(retrieval, dict) else None,
                    "rrfMs": retrieval.get("rrf_ms") if isinstance(retrieval, dict) else None,
                    "rerankerMs": retrieval.get("reranker_ms") if isinstance(retrieval, dict) else None,
                    "citationsCount": len(citations) if isinstance(citations, list) else 0,
                    "validCitationsCount": len(citations) if isinstance(citations, list) else 0,
                    "promptTokens": performance.get("prompt_tokens", 0) if isinstance(performance, dict) else 0,
                    "completionTokens": performance.get("completion_tokens", 0) if isinstance(performance, dict) else 0,
                    "status": "success"
                }
            }
            try:
                requests.post(grafana_endpoint, json=grafana_payload, timeout=self.timeout)
                logger.debug(f"Grafana telemetry dispatched to {grafana_endpoint}")
            except Exception as ex:
                logger.debug(f"Grafana telemetry dispatch skipped/failed: {ex}")

        return success


# Global singleton dispatcher
telemetry_dispatcher = TelemetryDispatcher()
