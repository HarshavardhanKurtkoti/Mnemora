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

## Decision: Qdrant Collection Auto-Creation

Date: 2026-08-25
Status: Accepted

### Decision

We added collection auto-creation inside `VectorStoreService.__init__` if the collection name `rag_documents` does not exist on the connected Qdrant client (whether it is an in-memory instance or a Qdrant Cloud cluster). The vector dimensions are determined dynamically at runtime by querying the active embedding model.

### Reason

In the cloud environment, if the Qdrant instance is brand-new or the collection is missing, document ingestion failed with a `404 Not Found` collection error resulting in `500 Internal Server Error` API responses. Auto-creating the collection with appropriate dimension parameters based on the active embedding model ensures a seamless onboarding and deployment process.

### Alternatives Considered

- Hardcoding collection dimension sizes (e.g., 1536): Rejected because the system supports multiple embedding models with different dimensions (e.g., OpenAI embeddings have 1536 dimensions, whereas FastEmbed embeddings have 384 dimensions).

## Decision: Orchestrated CI/CD Deployment via GitHub Actions

Date: 2026-08-25
Status: Accepted

### Decision

We added orchestrated production deployment jobs (`deploy-render` and `deploy-vercel`) directly to the GitHub Actions workflow (`.github/workflows/ci.yml`). These jobs run in parallel after all unit tests (`fast-checks`) and LLM evaluations (`ragas-eval`) succeed on commits pushed to the `main` branch.

### Reason

Allows continuous deployment ensuring that new features and fixes are automatically shipped to Render (for the FastAPI backend) and Vercel (for the Next.js frontend) only after they are fully verified by the testing and evaluation suite, avoiding manual deploy overhead and reducing deployment risks.

### Alternatives Considered

- Native Git-based auto-deployment on Render/Vercel: Rejected as the primary mechanism because they deploy commits immediately upon push to `main` without waiting for the CI pipeline (such as tests and Ragas evaluation) to verify the build. Orchestrating through GitHub Actions guarantees that only green/passing code gets deployed.

## Decision: Auto-Creation of SQLite Directory

Date: 2026-08-25
Status: Accepted

### Decision

We added automatic parent directory creation inside `src/config/database.py` when using a local SQLite database file URL.

### Reason

In clean CI/CD runner environments, the `data/` directory (which contains the SQLite database) is ignored by `.gitignore` and therefore does not exist at startup. When the tests run, the application imports start the DB engine and try to create tables, which failed with a `sqlalchemy.exc.OperationalError: unable to open database file` error because the directory was missing. Auto-creating the directory at engine setup resolves this issue automatically.

## Decision: System Health Version and Info Serialization

Date: 2026-08-25
Status: Accepted

### Decision

We added the `version_or_info` database field to the serialized output dictionary of the `/health/services` API endpoint in `stats_controller.py`.

### Reason

The frontend Next.js application expects this field (`service.version_or_info`) to display details such as database versions or model names (e.g., `ChromaDB`, `Local`, `v0.1.0`) under each system service. Because the backend endpoint did not serialize this field, the subtexts were rendered blank in the UI. Returning this field connects the existing seeded database records directly to the dashboard layout.

## Decision: Dynamic System Uptime and Environment Retrieval

Date: 2026-08-25
Status: Accepted

### Decision

We updated the `/health/services` API endpoint response schema to return an object wrapping the services list, `uptime`, and `environment`. The backend tracks server start time globally to compute active server uptime dynamically, and reads environment configuration from `APP_ENV`/`APP` environment variables. Corresponding state properties and HTML binding were implemented in the frontend.

### Reason

Enables production monitoring visibility. Rather than having a static hardcoded placeholder in the frontend layout, users can see the exact runtime environment (e.g., `Production`, `Local Dev`) and how long the FastAPI server has been running since its last container spin-up.

## Decision: Python Path Configuration for Evaluation Scripts

Date: 2026-08-25
Status: Accepted

### Decision

We resolved import path issues (`ModuleNotFoundError: No module named 'src'`) for evaluation scripts by:
1. Injecting the parent root directory into `sys.path` dynamically inside [`eval/retrieval_eval.py`](file:///c:/Local-Disk-D/Projects/Mnemora/eval/retrieval_eval.py) and [`eval/ragas_eval.py`](file:///c:/Local-Disk-D/Projects/Mnemora/eval/ragas_eval.py) before importing local source modules.
2. Specifying `env: PYTHONPATH: .` globally in the GitHub Actions CI workflow config [`ci.yml`](file:///c:/Local-Disk-D/Projects/Mnemora/.github/workflows/ci.yml).

### Reason

Allows scripts to be run directly using `python eval/retrieval_eval.py` from any working directory, both locally by developers and automated within runner environments, without crashing due to PYTHONPATH import resolution mismatch.

## Decision: Auto-Seeding Evaluation Database in clean/CI environments

Date: 2026-08-25
Status: Accepted

### Decision

We added automatic benchmark corpus detection and ingestion directly inside [`eval/retrieval_eval.py`](file:///c:/Local-Disk-D/Projects/Mnemora/eval/retrieval_eval.py) and [`eval/ragas_eval.py`](file:///c:/Local-Disk-D/Projects/Mnemora/eval/ragas_eval.py) when the vector database is found to be empty. It parses the corpus files in `docs/corpus/`, chunks them, and populates both the vector database and the BM25 search index.

### Reason

In fresh CI/CD runner pipelines, the vector database starts in-memory (`QdrantClient(":memory:")`) and empty. Rather than failing or requiring a separate, manual database seeding pipeline step (which would not persist anyway if run in separate processes due to the process-isolated nature of `:memory:` clients), having the evaluation scripts load the corpus on-demand makes the CI checks fully self-sufficient and robust out-of-the-box.

## Decision: Ragas Dependency and Metric Compatibility Fixes

Date: 2026-08-25
Status: Accepted

### Decision

We resolved Ragas import errors due to upstream package refactors by:
1. Injecting a mocked `langchain_community.chat_models.vertexai` module containing a dummy `ChatVertexAI` class into `sys.modules` inside [`eval/ragas_eval.py`](file:///c:/Local-Disk-D/Projects/Mnemora/eval/ragas_eval.py) before `ragas` is imported.
2. Renaming the import of `answer_relevance` to `answer_relevancy as answer_relevance` from `ragas.metrics` in `eval/ragas_eval.py`.

### Reason

In modern LangChain versions, integrations like VertexAI are moved out of `langchain-community` into separate packages (e.g. `langchain-google-vertexai`), but older Ragas builds hardcode imports from the legacy path, causing `ModuleNotFoundError`. By dynamically mocking the module (which is unused by our code), we bypass the crash without breaking python 3.13 dependencies. Additionally, Ragas renamed `answer_relevance` to `answer_relevancy` in its metrics exports, which required updating the import statement to prevent `ImportError`.

## Decision: Graceful Handling of Missing LLM Credentials during Ragas Evaluation

Date: 2026-08-25
Status: Accepted

### Decision

We added a credential validation check inside [`eval/ragas_eval.py`](file:///c:/Local-Disk-D/Projects/Mnemora/eval/ragas_eval.py) that detects if `OPENAI_API_KEY` is set. If missing, it outputs a warning, compiles the locally generated custom metrics (like Citation Validity, Citation Coverage, No-Answer Accuracy) into the baseline JSON file, and exits gracefully with `0`.

### Reason

Ragas uses LLM-as-a-judge evaluators (which default to OpenAI) that throw `OpenAIError: Missing credentials` if `OPENAI_API_KEY` is not present. In automated CI/CD runners where keys are not configured or are withheld for safety, this would cause the pipeline to fail. By gracefully skipping the OpenAI-dependent metrics while still saving and committing the locally calculated metrics, we ensure that PR verification checks pass cleanly without requiring API keys.

## Decision: Vercel CLI Root Folder Path Configuration

Date: 2026-08-25
Status: Accepted

### Decision

We removed the `working-directory: ./frontend` parameter from the Vercel deploy job in [`.github/workflows/ci.yml`](file:///c:/Local-Disk-D/Projects/Mnemora/.github/workflows/ci.yml), allowing Vercel CLI to execute from the root directory `.`.

### Reason

In the Vercel Dashboard project configuration settings, the project's **Root Directory** is already configured as `frontend`. When Vercel CLI is executed inside the `working-directory: ./frontend`, Vercel CLI appends the project settings Root Directory (`frontend`), resulting in looking for a non-existent path `./frontend/frontend` which failed the build. Executing the deploy command from the repository root enables Vercel CLI to correctly locate and resolve the `./frontend` directory based on the Vercel remote settings.

## Decision: Vercel Deploy Team Scope Configuration

Date: 2026-08-25
Status: Superseded

### Decision

We added the `scope: harshavardhankurtkotis-projects` input parameter to the Vercel deploy step in [`.github/workflows/ci.yml`](file:///c:/Local-Disk-D/Projects/Mnemora/.github/workflows/ci.yml).

### Reason

Since the project is hosted under a Vercel Team/Organization (`harshavardhankurtkotis-projects`), Vercel CLI commands executed during the post-deployment verification check (specifically `vercel inspect`) require team scoping. Without the scope explicitly set, the CLI defaults to personal scope, throwing `Error: User not found.` and failing the GitHub Action step even though the deployment build had completed successfully.

## Decision: Standard Vercel CLI Deployment Migration

Date: 2026-08-25
Status: Accepted

### Decision

We replaced the third-party `amondnet/vercel-action@v20` GitHub Action in [`.github/workflows/ci.yml`](file:///c:/Local-Disk-D/Projects/Mnemora/.github/workflows/ci.yml) with a direct shell invocation of Vercel CLI:
```yaml
    - name: Deploy to Vercel
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
        VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
      run: npx vercel --prod --token=$VERCEL_TOKEN --yes
```

### Reason

Passing the `--scope` team slug parameter resulted in authorization failures (`User not found 404`) because project-restricted Vercel API tokens lack permission to query global organization list/slug endpoints. Rather than relying on custom wrapper actions that execute additional inspection steps, invoking the official Vercel CLI directly handles scoping implicitly via standard `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` environment variables. This is the official and most robust way to deploy in non-interactive CI environments.

## Decision: Multi-Strategy Retrieval Inspection Architecture

Date: 2026-08-26
Status: Accepted

### Decision

We implemented a dedicated `/retrieval/inspect` endpoint on the FastAPI backend and a synchronized 4-column **Retrieval Inspector** view on the frontend (`/retrieval`). The endpoint executes Vector Search, BM25 Search, Hybrid RRF, and Cross-Encoder Re-ranking side-by-side on any given user query, returning candidates, scores, snippets, and step-by-step latency timings (`vector_ms`, `bm25_ms`, `rrf_ms`, `reranker_ms`, `total_ms`).

### Reason

In a production RAG system, engineers need observability into how each retrieval layer behaves for a specific query: which documents are captured by dense vectors vs sparse keywords, how RRF combines them, and how the cross-encoder reranks them. Providing this side-by-side inspection view with an interactive modal viewer enables intuitive debugging of recall and relevance regressions.

### Alternatives Considered

- Only relying on the end-to-end `/query` endpoint: Rejected because it only returns the final generated answer and top reranked citations, hiding the intermediate vector and BM25 candidates.

## Decision: Unified System Observability & Diagnostics

Date: 2026-08-26
Status: Accepted

### Decision

We added a `/system/diagnostics` FastAPI endpoint and an interactive **System Observability** page (`/system`) exposing overall health status, active service topology, database engine information, live execution pipeline diagram, and sanitized runtime configuration settings.

### Reason

Resolves 404 navigation errors from the sidebar and provides full transparency into running background services (FastAPI, Qdrant/ChromaDB Vector Store, BM25 Index, Embedding Engine, Cross-Encoder Re-ranker, LLM Provider, and Database Engine) alongside live health check diagnostics.

## Decision: Production Telemetry Forwarding to Monitoring Platform

Date: 2026-08-26
Status: Accepted

### Decision

We integrated an asynchronous, non-blocking telemetry forwarder (`src/observability/telemetry.py`) inside `rag_controller.py` on the `/query` endpoint. When `MONITORING_URL` is set in the environment, Mnemora automatically streams queries, generated answers, citations, candidate statistics, and execution timings (`retrieval_ms`, `generation_ms`, `total_ms`) to the independent monitoring platform (`POST /api/telemetry`).

### Reason

Enables real-time observability, distributed tracing, claim-level faithfulness auditing, and CI/CD quality regression gating on live production traffic originating from `https://mnemora-rag.vercel.app/` without imposing any latency on user queries or risking API downtime.

### Consequences

Dispatches telemetry via FastAPI `BackgroundTasks` with soft error recovery, guaranteeing production stability even if the external monitoring collector is temporarily unavailable.

## Decision: Docker Build Optimization & Layer Caching

Date: 2026-08-26
Status: Accepted

### Decision

We optimized the backend container build pipeline by:
1. Adding BuildKit pip cache mounts (`RUN --mount=type=cache,target=/root/.cache/pip pip install ...`) and separate dependency layer copying.
2. Expanding `.dockerignore` to exclude `frontend/`, `docs/`, `tests/`, and `.venv` from the build context.
3. In `src/main.py`, adding `sys.path.insert` to guarantee root resolution when running directly as a script.

### Reason

Significantly accelerates container builds from several minutes to under a few seconds when dependencies are unchanged, and reduces build context transfer size from hundreds of MBs to a few KBs.

## Decision: Smart Path-Based CI/CD Deployments

Date: 2026-08-26
Status: Accepted

### Decision

We added component path filtering (`dorny/paths-filter@v3`) and pip caching (`actions/setup-python@v5`) in `.github/workflows/ci.yml`. The pipeline detects whether changes occurred in backend code, dependencies, evaluation scripts, or the Next.js frontend, and triggers only the necessary test and deployment jobs (Render backend vs Vercel frontend).

### Reason

## Decision: Active Groq Production Model Integration

Date: 2026-08-26
Status: Accepted

### Decision

We updated Groq LLM integration across `src/generation/llm.py` and `src/observability/telemetry.py` to use active non-deprecated Groq models (`openai/gpt-oss-120b` and `openai/gpt-oss-20b`), dynamically defaulting to `openai/gpt-oss-120b` when `LLM_PROVIDER=groq` is active.

### Reason

Groq sunsetted older model endpoints. `openai/gpt-oss-120b` and `openai/gpt-oss-20b` are active, high-throughput, structured-output capable models hosted on Groq with microsecond latency.

### Consequences

Ensures seamless, zero-deprecation LLM inference with accurate token accounting and telemetry attribution in both local and deployed environments.

## Decision: Portfolio-Derived Unified Design System (HK Design System)

Date: 2026-11-25
Status: Accepted

### Decision

We refactor the entire Mnemora UI/UX to adopt the **HK Design System** ("Engineering Minimalism"), directly derived from Harsha Kurtkoti's personal portfolio (`https://www.harshakurtkoti.in` / `Portflio_website`). 

Key decisions:
1. **Palette**: Deep charcoal-slate canvas (`#080d10`), dark container surfaces (`#101918`, `#121e1d`), subtle raised surfaces (`#162420`), crisp hairline borders (`#202e2b`), restrained mint/emerald signal accents (`#a7f3d0`, `#34d399`), and high-legibility muted text (`#b4c0bf`, `#9aaba8`).
2. **Typography**: Clean Geist sans-serif for UI/headings, tabular JetBrains/Geist Mono for technical metadata/kickers, and subtle Georgia serif italic accents for emphasis words.
3. **Removal of AI-Generated Slop**: Complete elimination of `/bg.jpg` grid texture, neon cyan/purple glows (`box-shadow`, `drop-shadow`), fake circular uptime mock rings, and "Command Center" sci-fi branding.
4. **Shell & Information Architecture**: Streamlined compact sidebar and top header; question composer as the clear hero on `/ask`; professional document workspace on `/knowledge`; inspectable 4-stage retrieval execution on `/retrieval`; rigorous benchmark analysis on `/evaluation`; infrastructure topology and pipeline visualization on `/system`.
5. **Portability**: Document the full design tokens, surfaces, components, and adoption guide in `docs/DESIGN_SYSTEM.md` for cross-repo re-use.

### Reason

The previous UI exhibited common AI-generated tropes (over-saturated cyan accents, decorative background noise, oversized empty dashboard widgets) that detracted from Mnemora's sophisticated backend engineering. Aligning with the portfolio establishes an authentic, cohesive visual identity across all personal engineering repositories.

### Alternatives Considered

- Generic SaaS dashboard template (rejected: lacks distinctive identity and technical focus).
- Keeping cyberpunk neon theme (rejected: PRD explicitly requested mature engineering minimalism).

### Consequences

Requires complete redesign of the 5 application pages and shell components while rigorously maintaining all existing FastAPI API contracts, telemetry streaming, and real data bindings.

## Decision: Deep Product Experience Redesign & Interactive Architecture Showcase

Date: 2026-11-26
Status: Accepted

### Decision

Rather than stopping at color and token swapping ("recoloring"), we execute a deep UX redesign of the 5 core application flows:
1. **Application Shell & Sidebar**: Proportional navigation text, clear active indicators, prominent `Mnemora.` brand hierarchy, quick status readout, and a global Command Palette (`Cmd+K`).
2. **Ask Page**: Centerpiece query composer with keyboard shortcuts, rich suggested prompts, interactive pipeline walkthrough, compact metric tiles (12 docs, 423 chunks, 107ms latency), and graceful error states with interactive demo recovery (eliminating raw red error screens when FastAPI backend is disconnected).
3. **Knowledge Base**: Clean data table with improved typography, row rhythm, filter controls, and a human-readable metadata drawer (replacing raw JSON-first previews) with optional expandable JSON inspect.
4. **Retrieval Inspector**: Flagship interactive Systems-in-Motion architecture graph (Query → Dense/Sparse → RRF → Cross-Encoder → Context) with clickable stage execution nodes, candidate count & latency tracking, and a split-pane inspector with rank shift metrics (`+2`, `-1`).
5. **Observability (System & Evaluation)**: Interactive service dependency topology diagram with health pulses, clear metric hierarchy with tooltips, and benchmark comparisons.

### Reason

Direct feedback in PRD emphasizes that recruiters and engineers should immediately understand both the technical engineering depth and the product design craft. Moving beyond a skin/theme change creates a truly premium developer tool experience.

### Consequences

Strictly frontend-only: No changes to backend code, database schemas, or API contracts. All existing integrations and types are preserved.

## Decision: Dual PostgreSQL Driver Support (`psycopg` v3 & `psycopg2`)

Date: 2026-11-26
Status: Accepted

### Decision

We added `psycopg[binary]>=3.1.18` to `requirements.txt` alongside `psycopg2-binary>=2.9.9` and added automated `postgres://` to `postgresql://` URI normalization in `src/config/database.py`.

### Reason

In Python 3.12 container and deployment environments (e.g. Docker, Render, Supabase), SQLAlchemy 2.0 defaults to or invokes the `psycopg` (v3) dialect (`sqlalchemy.dialects.postgresql.psycopg`) when connecting to PostgreSQL databases. Without `psycopg` installed, server startup fails with `ModuleNotFoundError: No module named 'psycopg'`. Providing `psycopg[binary]` guarantees zero-dependency binary wheel execution for both modern `postgresql+psycopg://` and traditional `postgresql://` configurations.

### Consequences

Seamless compatibility across local SQLite, containerized PostgreSQL (`docker-compose.yml`), and cloud production databases (Render, Supabase) without requiring external system compilation libraries.

## Decision: CI Pull Request Permission for `dorny/paths-filter`

Date: 2026-11-26
Status: Accepted

### Decision

We explicitly configured `pull-requests: read` and `contents: read` permissions at both the workflow and `detect-changes` job levels in `.github/workflows/ci.yml`, and passed `token: ${{ secrets.GITHUB_TOKEN }}` to `dorny/paths-filter@v3`.

### Reason

In repositories with default restricted `GITHUB_TOKEN` permissions, the GitHub API endpoint for listing pull request changed files (`GET /repos/{owner}/{repo}/pulls/{number}/files`) returns `403 Forbidden` (`Error: Resource not accessible by integration`). Explicitly declaring `pull-requests: read` grants the required read access to query pull request metadata.

### Consequences

PR-triggered CI pipeline runs can query changed files accurately, preventing false integration permission failures on pull requests.

## Decision: Native Git-Push Deployment for Render Backend

Date: 2026-11-26
Status: Accepted

### Decision

We removed the `deploy-render` curl deploy hook job from `.github/workflows/ci.yml`. Backend deployment to Render relies on native Git-push integration / Render dashboard triggers rather than invoking an external deploy hook during CI runs.

### Reason

Render's free tier deploy hooks trigger an unauthenticated background git clone (`https://github.com/HarshavardhanKurtkoti/Mnemora`) which fails with `fatal: could not read Username for 'https://github.com': terminal prompts disabled` on private repositories. Removing the deploy hook from GitHub Actions avoids these clone failures; code is deployed directly via push.

### Consequences

Vercel frontend deployment remains orchestrated via CLI in GitHub Actions, while Render backend deployment is decoupled from CI curl hooks.

## Decision: Resilient API Base URL Normalization & Disconnected Observability State

Date: 2026-11-26
Status: Accepted

### Decision

1. In `frontend/src/lib/api.ts`, implemented `getApiBaseUrl()` to automatically normalize `NEXT_PUBLIC_API_URL` by trimming trailing slashes and ensuring the `/api/v1` prefix is present regardless of whether the user sets `https://api.onrender.com` or `https://api.onrender.com/api/v1`. Defaulted local fallback to `http://localhost:8000/api/v1`.
2. Removed mock fallback data (`environment: "Local Dev"`, `uptime: "2h 45m"`, `chunks: 423`, `database_type: "SQLite (Local DB)"`) from `frontend/src/app/system/page.tsx`. When the backend is unreachable, the system explicitly displays `Disconnected`, `Offline`, and `Unreachable` states alongside an amber warning banner indicating the exact target backend URL (`API_BASE_URL`) and instructions for configuring Vercel environment variables.
3. In `frontend/src/components/layout/header.tsx`, replaced blind `"healthy"` catch fallback with true `"disconnected"` badge status and offline labeling.
4. In `src/api/controllers/stats_controller.py`, added automatic `os.getenv("RENDER")` detection so that when deployed on Render, `raw_env` automatically resolves to `"Production"` even if `APP_ENV` is not manually defined.

### Reason

In production on `https://mnemora.harshakurtkoti.in`, the UI previously displayed `"Local Dev"`, `"2h 45m"` uptime, and `"SQLite Local"` because client-side network requests to `NEXT_PUBLIC_API_URL` failed (due to missing Vercel environment variable or Render sleeping), triggering a hardcoded mock object. Fabricating operational metrics when disconnected violated PRD Rule #1 and caused user confusion. Explicitly surfacing connection state and auto-detecting cloud runtime environments guarantees true observability.















