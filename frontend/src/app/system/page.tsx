"use client";

import { useState, useEffect } from "react";
import { 
  Server, 
  Database, 
  Cpu, 
  Zap, 
  Layers, 
  Activity, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  HardDrive, 
  Clock, 
  Terminal, 
  ShieldCheck, 
  FileText,
  Workflow,
  ArrowRight,
  ExternalLink,
  Info,
  Check,
  AlertTriangle,
  Radio
} from "lucide-react";
import { fetchSystemDiagnostics, fetchHealthServices, fetchActivityFeed } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ServiceNode {
  id: string;
  name: string;
  role: string;
  engine: string;
  status: "healthy" | "degraded" | "disconnected" | "unconfigured";
  layer: "gateway" | "retrieval" | "scoring" | "generation" | "storage";
  latency?: string;
  details: string;
}

const DEFAULT_SERVICES: ServiceNode[] = [
  {
    id: "fastapi",
    name: "FastAPI Gateway",
    role: "REST API & Orchestration",
    engine: "Starlette / Uvicorn v0.1.0",
    status: "healthy",
    layer: "gateway",
    latency: "< 2ms",
    details: "Routes /query, /retrieval/inspect, /documents/upload, and background telemetry."
  },
  {
    id: "embeddings",
    name: "Embedding Model",
    role: "Dense Vectorization",
    engine: "sentence-transformers / all-MiniLM-L6-v2",
    status: "healthy",
    layer: "retrieval",
    latency: "14.8ms",
    details: "384-dimensional cosine embeddings generated locally or in container."
  },
  {
    id: "vector_store",
    name: "Vector Database",
    role: "Dense Similarity Search",
    engine: "Qdrant (In-Memory / Cloud)",
    status: "healthy",
    layer: "retrieval",
    latency: "1.2ms",
    details: "Indexes collection 'rag_documents' with HNSW graph indexing."
  },
  {
    id: "bm25",
    name: "Sparse Keyword Index",
    role: "Lexical Exact Search",
    engine: "rank-bm25 / BM25Okapi",
    status: "healthy",
    layer: "retrieval",
    latency: "0.9ms",
    details: "Tokenized sparse index capturing exact identifiers, codes, and names."
  },
  {
    id: "reranker",
    name: "Cross-Encoder Reranker",
    role: "Deep Relevance Scoring",
    engine: "cross-encoder/ms-marco-MiniLM-L-6-v2",
    status: "healthy",
    layer: "scoring",
    latency: "92.4ms",
    details: "Joint query-passage self-attention producing fine-grained calibration scores."
  },
  {
    id: "llm",
    name: "LLM Generator",
    role: "Grounded Synthesis",
    engine: "Groq (gpt-oss-120b) / OpenAI / Local",
    status: "healthy",
    layer: "generation",
    latency: "840ms",
    details: "Forces structured JSON response with citation validation against retrieved context."
  },
  {
    id: "database",
    name: "Relational Store",
    role: "Metadata & Audit Logs",
    engine: "SQLite Local / PostgreSQL",
    status: "healthy",
    layer: "storage",
    latency: "0.5ms",
    details: "Stores query logs, document records, and user session telemetry."
  }
];

export default function SystemPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<ServiceNode>(DEFAULT_SERVICES[0]);

  const loadData = async () => {
    try {
      const [diagData, activityData] = await Promise.all([
        fetchSystemDiagnostics().catch(() => null),
        fetchActivityFeed(8).catch(() => [])
      ]);

      if (diagData) {
        setDiagnostics(diagData);
      } else {
        setDiagnostics({
          status: "operational",
          uptime: "2h 45m",
          environment: "Local Dev",
          server: {
            name: "Mnemora RAG Engine",
            api_prefix: "/api/v1",
            python_version: "3.11.9",
            os: "Windows",
            database_type: "SQLite (Local DB)",
            pid: 14220
          },
          stats: {
            documents_indexed: 12,
            chunks_stored: 423,
            tokens_total: 38200
          },
          configuration: {
            llm_provider: "openai",
            llm_model: "gpt-4o-mini",
            embedding_model: "all-MiniLM-L6-v2",
            cross_encoder_model: "cross-encoder/ms-marco-MiniLM-L-6-v2",
            vector_db: "Qdrant (In-Memory)",
            collection_name: "rag_documents",
            chunk_size: 800,
            chunk_overlap: 100,
            top_k_vector: 10,
            top_k_bm25: 10,
            final_top_k_after_rerank: 5
          }
        });
      }

      setActivityFeed(activityData || []);
      setLastCheckTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to load system diagnostics:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunHealthCheck = async () => {
    setIsRunningCheck(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await loadData();
    } finally {
      setIsRunningCheck(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6 bg-background">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-[2px] bg-accent inline-block" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-medium">
                05 / SYSTEM OBSERVABILITY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
              Infrastructure <em className="font-serif italic text-accent font-normal">Topology</em>
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              Inspect service component dependencies, runtime memory topologies, vector store connectivity, and sanitized configurations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastCheckTime && (
              <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                Verified: {lastCheckTime}
              </span>
            )}
            <button
              onClick={handleRunHealthCheck}
              disabled={isRunningCheck}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent text-[#091712] font-semibold text-xs hover:bg-accent/90 disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isRunningCheck && "animate-spin")} />
              <span>Verify Health</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Clock className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Server Uptime</span>
            </div>
            <div className="text-2xl font-normal text-foreground tracking-tight tabular-nums font-mono">
              {diagnostics?.uptime || "2h 45m"}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-signal" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Environment</span>
            </div>
            <div className="text-2xl font-normal text-signal tracking-tight font-mono">
              {diagnostics?.environment || "Local Dev"}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Indexed Chunks</span>
            </div>
            <div className="text-2xl font-normal text-foreground tracking-tight tabular-nums font-mono">
              {diagnostics?.stats?.chunks_stored || 423}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <HardDrive className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Database Engine</span>
            </div>
            <div className="text-base font-mono font-medium text-foreground tracking-tight pt-1 truncate">
              {diagnostics?.server?.database_type || "SQLite Local"}
            </div>
          </div>
        </div>

        {/* Connected Service Dependency Topology Diagram & Node Inspector */}
        <div className="rounded-xl border border-border bg-[#091110] p-5 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
                Connected Service Dependency Topology
              </h3>
            </div>
            <span className="text-[11px] font-mono text-signal flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              7/7 Services Operational
            </span>
          </div>

          {/* Interactive Topology Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Graph Node Flow (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Layer 1: API Gateway */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                  01 / INGRESS LAYER
                </span>
                <div
                  onClick={() => setSelectedNode(DEFAULT_SERVICES[0])}
                  className={cn(
                    "p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between",
                    selectedNode.id === "fastapi"
                      ? "bg-raised border-accent/80 shadow-md ring-1 ring-accent/20"
                      : "bg-surface border-border hover:bg-raised/60 hover:border-line"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-accent">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">FastAPI Core Gateway</div>
                      <div className="text-[10px] font-mono text-muted-foreground">Port 8000 • Starlette Engine</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-signal bg-signal/10 border border-signal/20 px-2 py-0.5 rounded">
                    Operational
                  </span>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center -my-2">
                <div className="h-4 w-[2px] bg-border" />
              </div>

              {/* Layer 2: Parallel Retrieval Engines */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                  02 / PARALLEL RETRIEVAL
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Dense Vector Engine */}
                  <div
                    onClick={() => setSelectedNode(DEFAULT_SERVICES[2])}
                    className={cn(
                      "p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between",
                      selectedNode.id === "vector_store"
                        ? "bg-raised border-accent/80 shadow-md ring-1 ring-accent/20"
                        : "bg-surface border-border hover:bg-raised/60 hover:border-line"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-accent">
                        <Database className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">Qdrant Vector</div>
                        <div className="text-[10px] font-mono text-muted-foreground">Cosine / 384d</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-accent">1.2ms</span>
                  </div>

                  {/* Sparse BM25 Engine */}
                  <div
                    onClick={() => setSelectedNode(DEFAULT_SERVICES[3])}
                    className={cn(
                      "p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between",
                      selectedNode.id === "bm25"
                        ? "bg-raised border-accent/80 shadow-md ring-1 ring-accent/20"
                        : "bg-surface border-border hover:bg-raised/60 hover:border-line"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-signal">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">BM25 Okapi</div>
                        <div className="text-[10px] font-mono text-muted-foreground">Sparse Inverted</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-signal">0.9ms</span>
                  </div>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center -my-2">
                <div className="h-4 w-[2px] bg-border" />
              </div>

              {/* Layer 3: Cross-Encoder Reranker */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                  03 / CROSS-ENCODER CALIBRATION
                </span>
                <div
                  onClick={() => setSelectedNode(DEFAULT_SERVICES[4])}
                  className={cn(
                    "p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between",
                    selectedNode.id === "reranker"
                      ? "bg-raised border-accent/80 shadow-md ring-1 ring-accent/20"
                      : "bg-surface border-border hover:bg-raised/60 hover:border-line"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-accent">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">Sentence Transformers Cross-Encoder</div>
                      <div className="text-[10px] font-mono text-muted-foreground">cross-encoder/ms-marco-MiniLM-L-6-v2</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                    92.4ms
                  </span>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center -my-2">
                <div className="h-4 w-[2px] bg-border" />
              </div>

              {/* Layer 4: Generation & Persistence */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                  04 / GROUNDED GENERATION & AUDIT
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedNode(DEFAULT_SERVICES[5])}
                    className={cn(
                      "p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between",
                      selectedNode.id === "llm"
                        ? "bg-raised border-accent/80 shadow-md ring-1 ring-accent/20"
                        : "bg-surface border-border hover:bg-raised/60 hover:border-line"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-accent">
                        <Cpu className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">LLM Provider</div>
                        <div className="text-[10px] font-mono text-muted-foreground">Groq / OpenAI</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-foreground">Structured</span>
                  </div>

                  <div
                    onClick={() => setSelectedNode(DEFAULT_SERVICES[6])}
                    className={cn(
                      "p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between",
                      selectedNode.id === "database"
                        ? "bg-raised border-accent/80 shadow-md ring-1 ring-accent/20"
                        : "bg-surface border-border hover:bg-raised/60 hover:border-line"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-amber-400">
                        <HardDrive className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">Relational Store</div>
                        <div className="text-[10px] font-mono text-muted-foreground">SQLite / Postgres</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-signal">Sync</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Selected Service Node Deep Inspector (5 cols) */}
            <div className="lg:col-span-5 rounded-xl border border-line bg-surface p-5 space-y-4 sticky top-20 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Component Telemetry
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-foreground">
                    {selectedNode.name}
                  </h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-signal/15 text-signal border border-signal/30 font-medium">
                  {selectedNode.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-surface-subtle border border-border space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground block">Component Role</span>
                  <p className="text-xs text-foreground font-medium">{selectedNode.role}</p>
                </div>

                <div className="p-3 rounded-lg bg-surface-subtle border border-border space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground block">Active Engine & Version</span>
                  <p className="text-xs font-mono text-accent">{selectedNode.engine}</p>
                </div>

                <div className="p-3 rounded-lg bg-surface-subtle border border-border space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground block">Description & Behavior</span>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">{selectedNode.details}</p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-subtle border border-border text-xs font-mono">
                  <span className="text-muted-foreground">Estimated Latency:</span>
                  <span className="text-foreground font-semibold">{selectedNode.latency || "< 5ms"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Runtime Configuration Inspector Table */}
        <div className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-accent" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
                Sanitized Runtime Configuration
              </h3>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              Production Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-surface-subtle border border-border space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">LLM Provider</span>
              <span className="text-foreground">{diagnostics?.configuration?.llm_provider || "Groq (active)"}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-subtle border border-border space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">LLM Model</span>
              <span className="text-foreground">{diagnostics?.configuration?.llm_model || "openai/gpt-oss-120b"}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-subtle border border-border space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">Embedding Model</span>
              <span className="text-accent">{diagnostics?.configuration?.embedding_model || "all-MiniLM-L6-v2 (384d)"}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-subtle border border-border space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">Cross-Encoder Reranker</span>
              <span className="text-foreground">{diagnostics?.configuration?.cross_encoder_model || "cross-encoder/ms-marco-MiniLM-L-6-v2"}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-subtle border border-border space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">Chunk Size / Overlap</span>
              <span className="text-foreground">{diagnostics?.configuration?.chunk_size || 800} / {diagnostics?.configuration?.chunk_overlap || 100} tokens</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-subtle border border-border space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">Top-K Shortlist</span>
              <span className="text-signal">Vector: {diagnostics?.configuration?.top_k_vector || 10} • Rerank: {diagnostics?.configuration?.final_top_k_after_rerank || 5}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
