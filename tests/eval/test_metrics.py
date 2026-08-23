import pytest
from langchain_core.documents import Document
from eval.retrieval_eval import calculate_metrics

def test_calculate_metrics():
    # Setup dummy docs
    docs = [
        Document(page_content="A", metadata={"chunk_id": "c1"}),
        Document(page_content="B", metadata={"chunk_id": "c2"}),
        Document(page_content="C", metadata={"chunk_id": "c3"}),
        Document(page_content="D", metadata={"chunk_id": "c4"}),
        Document(page_content="E", metadata={"chunk_id": "c5"}),
    ]
    
    # Hit at rank 1, missing others
    res = calculate_metrics(docs, ["c1", "c9"], k=5)
    assert res["hit_rate"] == 1
    assert res["recall"] == 0.5  # 1 out of 2 found
    assert res["mrr"] == 1.0     # rank 1
    
    # Hit at rank 3
    res2 = calculate_metrics(docs, ["c3"], k=5)
    assert res2["hit_rate"] == 1
    assert res2["recall"] == 1.0
    assert res2["mrr"] == 1/3
    
    # No hit
    res3 = calculate_metrics(docs, ["c9"], k=5)
    assert res3["hit_rate"] == 0
    assert res3["recall"] == 0.0
    assert res3["mrr"] == 0.0
    
    # Limit K
    res4 = calculate_metrics(docs, ["c5"], k=2)
    assert res4["hit_rate"] == 0 # c5 is at index 4, so it's not in top 2
