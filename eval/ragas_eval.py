import json
import os
import sys
from types import ModuleType

# Mock missing langchain_community.chat_models.vertexai module to bypass Ragas import bug
class DummyChatVertexAI:
    pass
mock_vertexai = ModuleType("langchain_community.chat_models.vertexai")
mock_vertexai.ChatVertexAI = DummyChatVertexAI
sys.modules["langchain_community.chat_models.vertexai"] = mock_vertexai

from datasets import Dataset
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy as answer_relevance

# Add root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.retrieval.hybrid_search import HybridSearchService
from src.generation.llm import GenerationService
from src.retrieval.reranker import ReRankerService

def load_dataset():
    path = os.path.join(os.path.dirname(__file__), "dataset.json")
    with open(path, "r") as f:
        return json.load(f)

def run_evaluation():
    hybrid_search = HybridSearchService()
    
    # Ensure database is populated
    try:
        sample = hybrid_search.vector_store.search("test", top_k=1)
        if not sample:
            print("Vector database is empty. Autopopulating with benchmark corpus...")
            corpus_dir = os.path.join(os.path.dirname(__file__), "..", "docs", "corpus")
            if not os.path.exists(corpus_dir):
                print(f"Corpus directory {corpus_dir} not found. Ingestion failed.")
                sys.exit(1)
                
            from src.ingestion.loaders import DocumentLoaderService
            from src.ingestion.chunking import ChunkingService
            
            chunker = ChunkingService()
            all_chunks = []
            
            for filename in os.listdir(corpus_dir):
                if not filename.endswith(".md"):
                    continue
                filepath = os.path.join(corpus_dir, filename)
                docs = DocumentLoaderService.load_any(filepath)
                for doc in docs:
                    doc.metadata["source"] = filename
                    doc.metadata["document_id"] = filename
                chunks = chunker.chunk_documents(docs)
                all_chunks.extend(chunks)
                
            if not all_chunks:
                print("No chunks extracted from corpus.")
                sys.exit(1)
                
            hybrid_search.vector_store.add_documents(all_chunks)
            hybrid_search.bm25_store.add_documents(all_chunks)
            print(f"Successfully ingested {len(all_chunks)} chunks into vector store and BM25 index.")
    except Exception as e:
        print(f"Error checking/populating database: {e}")
        sys.exit(1)
        
    reranker = ReRankerService()
    generation = GenerationService()
    
    raw_data = load_dataset()
    eval_data = {
        "question": [],
        "answer": [],
        "contexts": [],
        "ground_truth": []
    }
    
    custom_metrics = {
        "valid_citations": 0,
        "total_citations": 0,
        "responses_with_citations": 0,
        "total_answerable": 0,
        "no_answer_correct": 0,
        "no_answer_false": 0,
        "total_no_answer": 0
    }
    
    print(f"Generating answers for {len(raw_data)} questions for Ragas evaluation...")
    
    for item in raw_data:
        question = item["question"]
        ground_truth = item["expected_answer"]
        is_no_answer = (item.get("category") == "no_answer")
        
        retrieved_docs = hybrid_search.search(question)
        reranked_docs = reranker.rerank(question, retrieved_docs)
        
        response = generation.generate_answer(question, reranked_docs)
        answer = response.get("answer", "")
        citations = response.get("citations", [])
        contexts = [doc.page_content for doc in reranked_docs]
        retrieved_chunk_ids = [doc.metadata.get("chunk_id") for doc in reranked_docs]
        
        # Calculate Citation Validity (are citations actual retrieved chunks?)
        for citation in citations:
            custom_metrics["total_citations"] += 1
            # citation can be string or dict depending on generation schema
            cit_id = citation.get("chunk_id") if isinstance(citation, dict) else citation
            if cit_id in retrieved_chunk_ids:
                custom_metrics["valid_citations"] += 1
                
        if not is_no_answer:
            custom_metrics["total_answerable"] += 1
            if citations:
                custom_metrics["responses_with_citations"] += 1
        else:
            custom_metrics["total_no_answer"] += 1
            if "insufficient information" in answer.lower():
                custom_metrics["no_answer_correct"] += 1
            else:
                custom_metrics["no_answer_false"] += 1
                
        # Skip evaluating no-answer questions with Ragas as they mess up standard metrics
        if is_no_answer:
            continue
            
        eval_data["question"].append(question)
        eval_data["answer"].append(answer)
        eval_data["contexts"].append(contexts)
        eval_data["ground_truth"].append(ground_truth)
        
    # Calculate custom metrics aggregates
    citation_validity = custom_metrics["valid_citations"] / max(1, custom_metrics["total_citations"])
    citation_coverage = custom_metrics["responses_with_citations"] / max(1, custom_metrics["total_answerable"])
    no_answer_accuracy = custom_metrics["no_answer_correct"] / max(1, custom_metrics["total_no_answer"])
    false_answer_rate = custom_metrics["no_answer_false"] / max(1, custom_metrics["total_no_answer"])
    
    print("\nCustom Metrics:")
    print(f"Citation Validity (Valid/Total): {citation_validity:.4f} ({custom_metrics['valid_citations']}/{custom_metrics['total_citations']})")
    print(f"Citation Coverage (Responses with cites): {citation_coverage:.4f}")
    print(f"No-Answer Accuracy: {no_answer_accuracy:.4f}")
    print(f"False-Answer Rate: {false_answer_rate:.4f}")
    
    dataset = Dataset.from_dict(eval_data)
    
    if not os.getenv("OPENAI_API_KEY"):
        print("\n[WARNING] OPENAI_API_KEY is not set. Skipping Ragas evaluation metrics (Faithfulness, Answer Relevance).")
        # Save baseline with custom metrics only
        baseline_path = os.path.join(os.path.dirname(__file__), "results", "baseline.json")
        baseline_data = {}
        if os.path.exists(baseline_path):
            with open(baseline_path, "r") as f:
                baseline_data = json.load(f)
        baseline_data["generation"] = {
            "faithfulness": 0.0,
            "answer_relevance": 0.0,
            "citation_validity": citation_validity,
            "citation_coverage": citation_coverage,
            "no_answer_accuracy": no_answer_accuracy,
            "false_answer_rate": false_answer_rate
        }
        os.makedirs(os.path.dirname(baseline_path), exist_ok=True)
        
        # Add metadata stats
        import subprocess
        commit_hash = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode("utf-8").strip() if os.path.exists(".git") else "unknown"
        baseline_data["metadata"] = {
            "git_commit": commit_hash,
            "documents": 12,
            "questions": len(raw_data)
        }
        
        with open(baseline_path, "w") as f:
            json.dump(baseline_data, f, indent=2)
        print(f"Saved custom metrics baseline to {baseline_path}")
        return
        
    print("Running Ragas evaluation (Faithfulness, Answer Relevance)...")
    result = evaluate(
        dataset,
        metrics=[
            faithfulness,
            answer_relevance,
        ],
    )
    
    print("\nGeneration Metrics (Ragas):")
    for key, value in result.items():
        print(f"{key:<20}: {value:.4f}")
        
    baseline_path = os.path.join(os.path.dirname(__file__), "results", "baseline.json")
    
    # Load existing baseline (from retrieval_eval)
    baseline_data = {}
    if os.path.exists(baseline_path):
        with open(baseline_path, "r") as f:
            baseline_data = json.load(f)
            
    # Append generation metrics
    baseline_data["generation"] = {
        "faithfulness": result.get("faithfulness", 0),
        "answer_relevance": result.get("answer_relevance", 0),
        "citation_validity": citation_validity,
        "citation_coverage": citation_coverage,
        "no_answer_accuracy": no_answer_accuracy,
        "false_answer_rate": false_answer_rate
    }
    
    # Also add some stats
    import subprocess
    commit_hash = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode("utf-8").strip() if os.path.exists(".git") else "unknown"
    
    baseline_data["metadata"] = {
        "git_commit": commit_hash,
        "documents": 12, # Hardcoded corpus size for phase 1.6
        "questions": len(raw_data)
    }
    
    with open(baseline_path, "w") as f:
        json.dump(baseline_data, f, indent=2)
        
    print(f"\nSaved generation baseline to {baseline_path}")

if __name__ == "__main__":
    run_evaluation()
