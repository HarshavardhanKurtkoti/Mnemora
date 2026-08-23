## Decision: RAG Architecture & Technology Stack

Date: 2026-08-23
Status: Accepted

### Decision

We will use the following technology stack for the Production-Grade RAG system:
- **Backend Framework:** FastAPI (Python 3.11+)
- **Orchestration:** LangChain
- **Vector Database:** ChromaDB (due to ease of local setup while supporting metadata filtering)
- **Keyword Search:** BM25 (via `rank_bm25` library)
- **Re-ranker:** Local Sentence Transformers Cross-Encoder (`cross-encoder/ms-marco-MiniLM-L-6-v2`)
- **Evaluation:** Ragas
- **Testing:** Pytest

### Reason

This stack allows for a robust, fully local-capable deployment (if using local embeddings/LLM) or API-based deployment, fulfilling the PRD requirements for hybrid search, metadata support, and rigorous evaluation.

### Alternatives Considered

- Qdrant for Vector DB (rejected for initial phase to minimize Docker dependencies, but architecture will keep it abstract).
- Cohere Rerank (rejected as default to prevent hard dependency on external API keys initially, though can be configured).

### Consequences

Using local cross-encoders may slightly increase CPU usage/latency, but this tradeoff is acceptable for a robust portfolio project.

## Decision: File-based Prompt Management

Date: 2026-08-23
Status: Accepted

### Decision

Prompts will be stored in versioned text files under `src/generation/prompts/` rather than hardcoded in Python files.

### Reason

Required by PRD. Prompts are configuration and should be treated as such, allowing them to be versioned and modified independently of application logic.

## Decision: Vector Database & Re-ranker Architecture
Date: 2026-08-23
Status: Accepted

### Decision
We will retain ChromaDB for the vector store and a local Sentence Transformers Cross-Encoder (`cross-encoder/ms-marco-MiniLM-L-6-v2`) for the re-ranker in Phase 1.5.

### Reason
ChromaDB is functional and abstracted properly behind `VectorStoreService`. Migrating to Qdrant is unnecessary for this hardening phase but remains an option for future distributed deployments.
The local Cross-Encoder is cost-effective and sufficient for current latency requirements. It acts as a singleton via FastAPI's dependency/instance lifecycle.

## Decision: Citation Validation via Structured Output
Date: 2026-08-23
Status: Accepted

### Decision
LLM generation forces structured JSON output (Pydantic `LLMResponse`) using LangChain's `.with_structured_output`. The backend explicitly validates that citations output by the LLM exist in the retrieved chunks.

### Reason
Prompting alone is insufficient to prevent hallucinated chunk IDs. Backend validation guarantees grounded responses.

## Decision: Deterministic Evaluation & Chunk IDs
Date: 2026-08-23
Status: Accepted

### Decision
The Phase 1.6 benchmark uses synthetic MD documents deterministically chunked based on the original upload filename (e.g., `filename.md_0`). `LLM_PROVIDER=local` is heavily leveraged for integration test evaluations, falling back to HuggingFace embeddings when `OPENAI_API_KEY` is not present, avoiding credential dependencies for basic retrieval testing.

### Reason
FastAPI `UploadFile` utilizes random temporary filenames which previously broke evaluation mappings. Overriding the parsed source metadata with the original filename preserves reproducibility. A benchmark script generates the dataset dynamically, maintaining a static baseline ground truth against which system adjustments can be regression-tested.

## Decision: Dual Database Support (PostgreSQL and SQLite Fallback)
Date: 2026-08-23
Status: Accepted

### Decision
`src/config/database.py` defaults to `sqlite:///./data/mnemora.db` when `DATABASE_URL` is omitted, while retaining full PostgreSQL compatibility when configured (e.g. in Docker Compose).

### Reason
Allows instant local execution, testing, and development without requiring external database services or elevated privileges to be running on the host, while remaining 100% production-compatible with PostgreSQL.

### Alternatives Considered
- Hard dependency on PostgreSQL only: Requires users/developers to have PostgreSQL installed and running locally with matching credentials.

### Consequences
SQLite connection options require `check_same_thread=False` for multi-threaded FastAPI access.

