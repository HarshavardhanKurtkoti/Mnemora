import pytest
from unittest.mock import patch, MagicMock
from src.observability.telemetry import TelemetryDispatcher


@patch("requests.post")
def test_telemetry_dispatcher_success(mock_post):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_post.return_value = mock_resp

    dispatcher = TelemetryDispatcher(monitoring_url="http://localhost:8000")
    success = dispatcher.emit_query_telemetry(
        query="What is Mnemora?",
        answer="Mnemora is a production RAG system.",
        citations=[{"document": "intro.md", "chunk_id": "chunk_0"}],
        retrieval={"vector_results": 5, "bm25_results": 5, "reranked_results": 3},
        performance={"retrieval_ms": 25.0, "generation_ms": 150.0, "total_ms": 175.0}
    )

    assert success is True
    assert mock_post.called
    endpoint = mock_post.call_args[0][0]
    assert endpoint == "http://localhost:8000/api/telemetry"


@patch("requests.post")
def test_telemetry_dispatcher_graceful_failure(mock_post):
    mock_post.side_effect = Exception("Connection refused")

    dispatcher = TelemetryDispatcher(monitoring_url="http://localhost:8000")
    # Should not throw exception
    success = dispatcher.emit_query_telemetry(
        query="Test query",
        answer="Test answer",
        citations=[],
        retrieval={},
        performance={}
    )

    assert success is False
