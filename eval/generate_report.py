import json
import os

BASELINE_PATH = "eval/results/baseline.json"
REPORT_PATH = "eval/results/benchmark_report.md"

def generate_report():
    if not os.path.exists(BASELINE_PATH):
        print("baseline.json not found.")
        return
        
    with open(BASELINE_PATH, "r") as f:
        data = json.load(f)
        
    metadata = data.get("metadata", {})
    retrieval = data.get("retrieval", {})
    generation = data.get("generation", {})
    
    report = f"""# Mnemora Retrieval & Generation Benchmark Report

## 1. Executive Summary

This report evaluates the Mnemora RAG system over {metadata.get("documents", 12)} documents and {metadata.get("questions", 60)} evaluation questions. 
We tested Vector Search, BM25, Hybrid RRF, and a Cross-Encoder Reranker.

## 2. Corpus Statistics

- **Documents**: {metadata.get("documents", 12)}
- **Evaluation Questions**: {metadata.get("questions", 60)}

## 3. Retrieval Results

| Strategy | Recall@5 | Recall@10 | HitRate@5 | MRR@10 |
|----------|----------|-----------|-----------|--------|
"""
    for strat in ["Vector Search", "BM25", "Hybrid RRF", "Hybrid + Reranker"]:
        if strat in retrieval:
            m = retrieval[strat]["metrics"]
            report += f"| {strat} | {m['recall@5']:.3f} | {m['recall@10']:.3f} | {m['hit_rate@5']:.3f} | {m['mrr@10']:.3f} |\n"
            
    report += """
## 4. Latency Results

| Strategy | P50 (ms) | P95 (ms) | P99 (ms) |
|----------|----------|----------|----------|
"""
    for strat in ["Vector Search", "BM25", "Hybrid RRF", "Hybrid + Reranker"]:
        if strat in retrieval:
            l = retrieval[strat]["latency"]
            report += f"| {strat} | {l['p50_ms']:.1f} | {l['p95_ms']:.1f} | {l['p99_ms']:.1f} |\n"

    report += """
## 5. Generation Results

| Metric | Score |
|--------|-------|
"""
    if generation:
        report += f"| Faithfulness | {generation.get('faithfulness', 0):.4f} |\n"
        report += f"| Answer Relevance | {generation.get('answer_relevance', 0):.4f} |\n"
        report += f"| Citation Validity | {generation.get('citation_validity', 0):.4f} |\n"
        report += f"| Citation Coverage | {generation.get('citation_coverage', 0):.4f} |\n"
        report += f"| No-Answer Accuracy | {generation.get('no_answer_accuracy', 0):.4f} |\n"
        report += f"| False-Answer Rate | {generation.get('false_answer_rate', 0):.4f} |\n"
    else:
        report += "Generation metrics not available (OPENAI_API_KEY required).\n"

    report += """
## 6. Reranker Analysis & Key Findings

"""
    # Calculate Reranker improvement
    if "Hybrid RRF" in retrieval and "Hybrid + Reranker" in retrieval:
        h_m = retrieval["Hybrid RRF"]["metrics"]
        r_m = retrieval["Hybrid + Reranker"]["metrics"]
        h_l = retrieval["Hybrid RRF"]["latency"]
        r_l = retrieval["Hybrid + Reranker"]["latency"]
        
        recall_diff = r_m['recall@5'] - h_m['recall@5']
        mrr_diff = r_m['mrr@10'] - h_m['mrr@10']
        lat_diff = r_l['p95_ms'] - h_l['p95_ms']
        
        report += f"- **Recall@5 Improvement**: {recall_diff:+.3f}\n"
        report += f"- **MRR@10 Improvement**: {mrr_diff:+.3f}\n"
        report += f"- **P95 Latency Cost**: {lat_diff:+.1f} ms\n\n"
        report += "The Cross-Encoder Reranker trades latency for higher accuracy. "
        if mrr_diff > 0.05:
            report += "The MRR improvement is significant, validating its usage for precision queries."
        elif mrr_diff > 0:
            report += "The improvement is marginal on this dataset."
        else:
            report += "The reranker degraded or did not improve metrics on this dataset."
            
    report += """

## 7. Query-Type Analysis (Recall@5)

| Category | Vector | BM25 | Hybrid | Reranker |
|----------|--------|------|--------|----------|
"""
    
    # We expect these categories based on our script
    categories = ["factual", "exact_keyword", "semantic", "multi_document", "multi_hop"]
    for cat in categories:
        scores = []
        for strat in ["Vector Search", "BM25", "Hybrid RRF", "Hybrid + Reranker"]:
            val = retrieval.get(strat, {}).get("by_category", {}).get(cat, {}).get("recall@5", 0)
            scores.append(f"{val:.3f}")
        report += f"| {cat} | {' | '.join(scores)} |\n"

    with open(REPORT_PATH, "w") as f:
        f.write(report)
    print(f"Generated report at {REPORT_PATH}")

if __name__ == "__main__":
    generate_report()
