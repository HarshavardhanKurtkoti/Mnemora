import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_system_diagnostics_endpoint():
    response = client.get("/api/v1/system/diagnostics")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "data" in data
    diag = data["data"]
    assert "status" in diag
    assert "uptime" in diag
    assert "environment" in diag
    assert "services" in diag
    assert "configuration" in diag

def test_retrieval_inspect_endpoint():
    response = client.post(
        "/api/v1/retrieval/inspect",
        json={"query": "test query", "top_k": 3}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "data" in data
    res = data["data"]
    assert "timings" in res
    assert "strategies" in res
    assert "vector" in res["strategies"]
    assert "bm25" in res["strategies"]
    assert "hybrid" in res["strategies"]
    assert "reranked" in res["strategies"]
