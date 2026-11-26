# Project Progress

## Current Phase

Phase 1.8 - Final Premium UI/UX Refactor & Interactive Architecture Experience (HK Design System)

## Status

COMPLETE

## Completed

- [x] Initial PRD review and architectural planning
- [x] Implementing Document Ingestion
- [x] Setting up Project Structure and Environments
- [x] Implementing Vector Store
- [x] Implementing BM25 Keyword Search
- [x] Implementing Hybrid Search
- [x] Implementing Re-ranker
- [x] Implementing Generation and Citations
- [x] Building FastAPI API
- [x] Setting up Evaluation Pipeline
- [x] Setting up CI/CD Tests
- [x] Phase 1: Setup and Basic Ingestion
- [x] Phase 1.5: Production Hardening & Verification
- [x] Phase 1.6: Real Retrieval & Generation Benchmark
- [x] Frontend M1: Product UI (Next.js App Router, shadcn/ui, Dark theme)
- [x] Frontend Redesign: Match Dashboard Command Center Mockup
- [x] Full Environment Setup & Dependencies Installed (Python venv, PyTorch, Node.js 22, PNPM, DB Seeding, Verified Pytest suite)
- [x] Fix Vector Store collection auto-creation bug (404 collection not found when Qdrant collection is missing in cloud)
- [x] Configure automated CD deployment to Vercel and Render in GitHub Actions
- [x] Fix database path parent directory creation bug in CI/CD pipeline (unable to open database file error during tests)
- [x] Add version_or_info field serialization to `/health/services` endpoint to allow dynamic subtext rendering in frontend
- [x] Make system Uptime and Environment dynamic in System Status card (calculated via backend server start time and read from environment variables)
- [x] Fix ModuleNotFoundError in eval scripts in CI/CD pipeline (import resolution errors for src package)
- [x] Add auto-seeding of benchmark corpus inside evaluation scripts when vector database is empty (fixing empty database failure in CI/CD pipeline)
- [x] Fix VertexAI import crash in Ragas library by dynamically mocking `langchain_community.chat_models.vertexai` inside `eval/ragas_eval.py`
- [x] Fix Ragas metrics import name mismatch (aliased `answer_relevancy` as `answer_relevance` in `eval/ragas_eval.py`)
- [x] Gracefully skip Ragas LLM metrics (faithfulness, answer relevance) inside `eval/ragas_eval.py` if `OPENAI_API_KEY` is missing in CI/CD pipeline (saving custom metrics baseline only)
- [x] Fix Vercel deploy directory path in CI/CD pipeline (removed duplicate working-directory configuration)
- [x] Fix Vercel inspect scope in CI/CD pipeline (configured team scope 'harshavardhankurtkotis-projects')
- [x] Replace third-party Vercel action with standard Vercel CLI `npx vercel` deployment to fully bypass scoping/inspection bugs
- [x] Frontend M2: AI Observability (Retrieval Inspector, Multi-Strategy Comparison, Telemetry Trace)
- [x] Frontend M3: System Observability (Service Topology, Pipeline Visualizer, Diagnostics, Telemetry Log)
- [x] Add `/retrieval/inspect` and `/system/diagnostics` FastAPI endpoints and verified with Pytest suite
- [x] Harmonize typography, serif italic cyan accents, badge pills, and glassmorphic styling across all 5 pages (`/ask`, `/knowledge`, `/retrieval`, `/evaluation`, `/system`)
- [x] Add non-blocking background telemetry forwarder (`src/observability/telemetry.py`) on `/query` endpoint to stream live traces into `prod_rag_monitoring`
- [x] Upgrade Groq LLM integration to active non-deprecated models (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`) and verified with Pytest suite (15/15 tests passing)
- [x] Phase 1.7: Create dedicated branch `refactor/portfolio-design-system`
- [x] Phase 1.7: Initial token extraction and styling refactor
- [x] Phase 1.8: Refine Application Shell & Sidebar (stronger branding, proportional navigation, command palette `⌘K`, keyboard shortcuts `⌘1`–`⌘5`)
- [x] Phase 1.8: Redesign `/ask` page as centerpiece (editorial hierarchy, centerpiece question composer, suggested inquiries, interactive pipeline explainer, graceful error recovery & demo answer state)
- [x] Phase 1.8: Refine `/knowledge` page (improved table typography, row rhythm, format filter pills, human-readable metadata drawer replacing raw JSON-first previews)
- [x] Phase 1.8: Build flagship `/retrieval` inspector (Systems in Motion architecture visualization, interactive stage selection, split-pane results, and candidate rank shift indicators)
- [x] Phase 1.8: Refine `/evaluation` and `/system` observability pages (structured metric hierarchy, question-level benchmark inspection, interactive connected service dependency topology)
- [x] Add live multi-stage pipeline progress tracker component (`pipeline-progress.tsx`) displaying step-by-step FastEmbed model caching, vector & lexical search, RRF fusion, and cross-encoder scoring on `/ask`, `/retrieval`, and `/knowledge`
- [x] Phase 1.8: Verified Next.js production build (`pnpm build`) with zero errors across all 9 static routes
- [x] Phase 1.8: Verified backend pytest suite with 15/15 tests passing
- [x] Add `psycopg[binary]>=3.1.18` and PostgreSQL URI normalization in `src/config/database.py` to fix `ModuleNotFoundError: No module named 'psycopg'` in Docker container runtime
- [x] Configure `pull-requests: read` permission in `.github/workflows/ci.yml` to resolve `Error: Resource not accessible by integration` in `dorny/paths-filter@v3` on pull requests
- [x] Remove `deploy-render` curl deploy hook job from `.github/workflows/ci.yml` to decouple Render CD from unauthenticated background git clone failures on Render free tier
- [x] Normalize `NEXT_PUBLIC_API_URL` with `/api/v1` resolution in `frontend/src/lib/api.ts` and add automatic Render cloud environment detection (`os.getenv("RENDER")`) in `stats_controller.py`
- [x] Eliminate hardcoded mock fallbacks in `frontend/src/app/system/page.tsx` and `header.tsx`, surfacing accurate connection status (`Disconnected / Offline`) and configuration banners when backend is unreachable
- [x] Implement resilient database connection verification with automatic SQLite fallback in `src/config/database.py` and `main.py` to prevent container boot crash loops when remote Supabase/PostgreSQL is paused or unreachable
- [x] Install Neon CLI, link project `quiet-wave-46556808` (`production` branch) via `neon.ts`, deploy Neon PostgreSQL with `neon deploy`, and wire connection into FastAPI backend
- [x] Create dedicated database `mnemora` on Neon PostgreSQL and migrate application schemas from default `neondb`
- [x] Prove end-to-end functionality on Neon `mnemora` database: verified `npm run build` (9/9 routes), seeded database records via `populate_db.py`, and verified all 15 pytests passing against Neon
- [x] Add scheme normalization in `frontend/src/lib/api.ts` to automatically prepend `https://` when `NEXT_PUBLIC_API_URL` is set without protocol scheme, preventing relative URL resolution on Vercel
- [x] Remove `deploy-vercel` job from `.github/workflows/ci.yml` to rely on Vercel's native Git repository auto-deployment on push to `main`, eliminating expired CLI token failures

## In Progress

None

## Pending

- [ ] Advanced structure-aware parsing (e.g. LlamaParse integration) - See Backlog
- [ ] Semantic caching - See Backlog
- [ ] Distributed vector store environment (Qdrant) - See Backlog

## Current Task

Phase 1.8 completed: The Mnemora frontend has been thoroughly redesigned beyond color swapping into an authentic, interactive, portfolio-grade engineering workspace.

## Next Step

Submit branch `refactor/portfolio-design-system` for review and adopt the same design tokens in `prod_rag_monitoring` and `VisionBoard`.

## Blockers

None
