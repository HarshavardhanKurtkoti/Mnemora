import json
import os
import sys
import time
import numpy as np
from typing import List, Dict, Any

# Add root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.retrieval.hybrid_search import HybridSearchService
from src.retrieval.reranker import ReRankerService
from src.config.settings import settings

def load_dataset():
    path = os.path.join(os.path.dirname(__file__), "dataset.json")
    with open(path, "r") as f:
        return json.load(f)

def calculate_metrics(results, expected_chunks, k):
    """Calculate HitRate@K, Recall@K, MRR@K."""
    if not expected_chunks:
        return None
        
    retrieved_chunks = [doc.metadata.get("chunk_id") for doc in results[:k]]
    
    # HitRate@K
    hit = any(chunk in retrieved_chunks for chunk in expected_chunks)
    
    # Recall@K
    hits = sum(1 for chunk in expected_chunks if chunk in retrieved_chunks)
    recall = hits / len(expected_chunks)
    
    # MRR@K
    mrr = 0.0
    for i, chunk in enumerate(retrieved_chunks):
        if chunk in expected_chunks:
            mrr = 1.0 / (i + 1)
            break
            
    return {"hit_rate": int(hit), "recall": recall, "mrr": mrr}

def evaluate_retrieval():
    hybrid_search = HybridSearchService()
    
    try:
        sample = hybrid_search.vector_store.search("test", top_k=1)
        if not sample:
            print("Evaluation failed: The Vector Database is empty.")
            sys.exit(1)
    except Exception as e:
        print(f"Evaluation failed: Error accessing database: {e}")
        sys.exit(1)
        
    reranker = ReRankerService()
    dataset = load_dataset()
    
    # We will track metrics per strategy, broken down by category, and latency
    strategies = ["Vector Search", "BM25", "Hybrid RRF", "Hybrid + Reranker"]
    
    # Prepare data structure
    results = {
        strategy: {
            "latency": [],
            "metrics": {"hit_rate@5": [], "recall@5": [], "recall@10": [], "mrr@10": []},
            "by_category": {}
        } for strategy in strategies
    }
    
    # Pre-populate categories
    categories = list(set(item.get("category", "unknown") for item in dataset))
    for strategy in strategies:
        for cat in categories:
            results[strategy]["by_category"][cat] = {"hit_rate@5": [], "recall@5": [], "recall@10": [], "mrr@10": []}
            
    print(f"Starting evaluation on {len(dataset)} questions...")
    
    for item in dataset:
        q = item["question"]
        expected_chunks = item.get("expected_chunks", [])
        cat = item.get("category", "unknown")
        
        # We skip no_answer for retrieval metrics as they don't have expected chunks
        if not expected_chunks:
            continue
            
        # 1. Vector Search
        start = time.perf_counter()
        vector_res = hybrid_search.vector_store.search(q, top_k=10)
        v_latency = time.perf_counter() - start
        
        v_metrics_5 = calculate_metrics(vector_res, expected_chunks, 5)
        v_metrics_10 = calculate_metrics(vector_res, expected_chunks, 10)
        
        results["Vector Search"]["latency"].append(v_latency)
        results["Vector Search"]["metrics"]["hit_rate@5"].append(v_metrics_5["hit_rate"])
        results["Vector Search"]["metrics"]["recall@5"].append(v_metrics_5["recall"])
        results["Vector Search"]["metrics"]["recall@10"].append(v_metrics_10["recall"])
        results["Vector Search"]["metrics"]["mrr@10"].append(v_metrics_10["mrr"])
        
        results["Vector Search"]["by_category"][cat]["hit_rate@5"].append(v_metrics_5["hit_rate"])
        results["Vector Search"]["by_category"][cat]["recall@5"].append(v_metrics_5["recall"])
        results["Vector Search"]["by_category"][cat]["recall@10"].append(v_metrics_10["recall"])
        results["Vector Search"]["by_category"][cat]["mrr@10"].append(v_metrics_10["mrr"])

        # 2. BM25 Search
        start = time.perf_counter()
        bm25_res = hybrid_search.bm25_store.search(q, top_k=10)
        b_latency = time.perf_counter() - start
        
        b_metrics_5 = calculate_metrics(bm25_res, expected_chunks, 5)
        b_metrics_10 = calculate_metrics(bm25_res, expected_chunks, 10)
        
        results["BM25"]["latency"].append(b_latency)
        results["BM25"]["metrics"]["hit_rate@5"].append(b_metrics_5["hit_rate"])
        results["BM25"]["metrics"]["recall@5"].append(b_metrics_5["recall"])
        results["BM25"]["metrics"]["recall@10"].append(b_metrics_10["recall"])
        results["BM25"]["metrics"]["mrr@10"].append(b_metrics_10["mrr"])
        
        results["BM25"]["by_category"][cat]["hit_rate@5"].append(b_metrics_5["hit_rate"])
        results["BM25"]["by_category"][cat]["recall@5"].append(b_metrics_5["recall"])
        results["BM25"]["by_category"][cat]["recall@10"].append(b_metrics_10["recall"])
        results["BM25"]["by_category"][cat]["mrr@10"].append(b_metrics_10["mrr"])

        # 3. Hybrid RRF
        start = time.perf_counter()
        hybrid_res = hybrid_search.rrf_fusion(vector_res, bm25_res, k=60)
        h_latency = (time.perf_counter() - start) + v_latency + b_latency # RRF includes vector + BM25 time
        
        h_metrics_5 = calculate_metrics(hybrid_res, expected_chunks, 5)
        h_metrics_10 = calculate_metrics(hybrid_res, expected_chunks, 10)
        
        results["Hybrid RRF"]["latency"].append(h_latency)
        results["Hybrid RRF"]["metrics"]["hit_rate@5"].append(h_metrics_5["hit_rate"])
        results["Hybrid RRF"]["metrics"]["recall@5"].append(h_metrics_5["recall"])
        results["Hybrid RRF"]["metrics"]["recall@10"].append(h_metrics_10["recall"])
        results["Hybrid RRF"]["metrics"]["mrr@10"].append(h_metrics_10["mrr"])
        
        results["Hybrid RRF"]["by_category"][cat]["hit_rate@5"].append(h_metrics_5["hit_rate"])
        results["Hybrid RRF"]["by_category"][cat]["recall@5"].append(h_metrics_5["recall"])
        results["Hybrid RRF"]["by_category"][cat]["recall@10"].append(h_metrics_10["recall"])
        results["Hybrid RRF"]["by_category"][cat]["mrr@10"].append(h_metrics_10["mrr"])

        # 4. Hybrid + Reranker
        start = time.perf_counter()
        reranked_res = reranker.rerank(q, hybrid_res, top_k=10)
        r_latency = (time.perf_counter() - start) + h_latency # Total time
        
        r_metrics_5 = calculate_metrics(reranked_res, expected_chunks, 5)
        r_metrics_10 = calculate_metrics(reranked_res, expected_chunks, 10)
        
        results["Hybrid + Reranker"]["latency"].append(r_latency)
        results["Hybrid + Reranker"]["metrics"]["hit_rate@5"].append(r_metrics_5["hit_rate"])
        results["Hybrid + Reranker"]["metrics"]["recall@5"].append(r_metrics_5["recall"])
        results["Hybrid + Reranker"]["metrics"]["recall@10"].append(r_metrics_10["recall"])
        results["Hybrid + Reranker"]["metrics"]["mrr@10"].append(r_metrics_10["mrr"])
        
        results["Hybrid + Reranker"]["by_category"][cat]["hit_rate@5"].append(r_metrics_5["hit_rate"])
        results["Hybrid + Reranker"]["by_category"][cat]["recall@5"].append(r_metrics_5["recall"])
        results["Hybrid + Reranker"]["by_category"][cat]["recall@10"].append(r_metrics_10["recall"])
        results["Hybrid + Reranker"]["by_category"][cat]["mrr@10"].append(r_metrics_10["mrr"])

    # Aggregate Data
    baseline_data = {"retrieval": {}}
    for strategy in strategies:
        strat_data = results[strategy]
        latencies = strat_data["latency"]
        baseline_data["retrieval"][strategy] = {
            "metrics": {
                "recall@5": np.mean(strat_data["metrics"]["recall@5"]) if strat_data["metrics"]["recall@5"] else 0,
                "recall@10": np.mean(strat_data["metrics"]["recall@10"]) if strat_data["metrics"]["recall@10"] else 0,
                "hit_rate@5": np.mean(strat_data["metrics"]["hit_rate@5"]) if strat_data["metrics"]["hit_rate@5"] else 0,
                "mrr@10": np.mean(strat_data["metrics"]["mrr@10"]) if strat_data["metrics"]["mrr@10"] else 0
            },
            "latency": {
                "mean_ms": np.mean(latencies) * 1000 if latencies else 0,
                "p50_ms": np.percentile(latencies, 50) * 1000 if latencies else 0,
                "p95_ms": np.percentile(latencies, 95) * 1000 if latencies else 0,
                "p99_ms": np.percentile(latencies, 99) * 1000 if latencies else 0
            },
            "by_category": {}
        }
        for cat, cat_metrics in strat_data["by_category"].items():
            if cat_metrics["recall@5"]:
                baseline_data["retrieval"][strategy]["by_category"][cat] = {
                    "recall@5": np.mean(cat_metrics["recall@5"]),
                    "mrr@10": np.mean(cat_metrics["mrr@10"])
                }
            
    # Output Results
    print("\n" + "="*50)
    print("RETRIEVAL EVALUATION REPORT")
    print("="*50)
    print(f"{'Method':<20} | {'Recall@5':<10} | {'Recall@10':<10} | {'HitRate@5':<10} | {'MRR@10':<10}")
    print("-" * 75)
    for strategy in strategies:
        m = baseline_data["retrieval"][strategy]["metrics"]
        print(f"{strategy:<20} | {m['recall@5']:<10.3f} | {m['recall@10']:<10.3f} | {m['hit_rate@5']:<10.3f} | {m['mrr@10']:<10.3f}")

    print("\n" + "="*50)
    print("LATENCY REPORT (ms)")
    print("="*50)
    print(f"{'Method':<20} | {'P50':<10} | {'P95':<10} | {'P99':<10}")
    print("-" * 55)
    for strategy in strategies:
        l = baseline_data["retrieval"][strategy]["latency"]
        print(f"{strategy:<20} | {l['p50_ms']:<10.1f} | {l['p95_ms']:<10.1f} | {l['p99_ms']:<10.1f}")
        
    os.makedirs("eval/results", exist_ok=True)
    baseline_path = "eval/results/baseline.json"
    
    # Load existing baseline if available to preserve Generation metrics
    if os.path.exists(baseline_path):
        with open(baseline_path, "r") as f:
            existing_baseline = json.load(f)
            existing_baseline["retrieval"] = baseline_data["retrieval"]
            baseline_data = existing_baseline
            
    with open(baseline_path, "w") as f:
        json.dump(baseline_data, f, indent=2)
    print(f"\nSaved retrieval baseline to {baseline_path}")

if __name__ == "__main__":
    evaluate_retrieval()
