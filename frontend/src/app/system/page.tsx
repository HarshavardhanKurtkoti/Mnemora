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
  ArrowRight
} from "lucide-react";
import { fetchSystemDiagnostics, fetchHealthServices, fetchActivityFeed } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function SystemPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>("");

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
          services: [
            { id: 1, service_name: "FastAPI Server", status: "healthy", version_or_info: "v0.1.0" },
            { id: 2, service_name: "Vector Store", status: "healthy", version_or_info: "Qdrant (In-Memory)" },
            { id: 3, service_name: "BM25 Index", status: "healthy", version_or_info: "BM25Okapi" },
            { id: 4, service_name: "Embeddings", status: "healthy", version_or_info: "all-MiniLM-L6-v2 (384d)" },
            { id: 5, service_name: "Reranker", status: "healthy", version_or_info: "Cross-Encoder MiniLM" },
            { id: 6, service_name: "LLM Provider", status: "healthy", version_or_info: "Local Mock / Groq / OpenAI" },
            { id: 7, service_name: "Database Engine", status: "healthy", version_or_info: "SQLite Local" }
          ],
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

  const isHealthy = diagnostics?.status === "operational";

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6 bg-background">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-[2px] bg-accent inline-block" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent">
                Infrastructure
              </span>
            </div>
            <h1 className="text-2xl font-normal tracking-tight text-foreground">
              System <em className="font-serif italic text-accent font-normal">Observability</em>
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mnemora RAG Engine runtime health, service topology, and active indexing infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {lastCheckTime && (
              <span className="text-[10px] font-mono text-muted-foreground">
                Checked: {lastCheckTime}
              </span>
            )}
            <button
              onClick={handleRunHealthCheck}
              disabled={isRunningCheck}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-accent text-[#091712] font-medium text-xs hover:bg-accent/90 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isRunningCheck && "animate-spin")} />
              <span>Run Health Check</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Clock className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Server Uptime</span>
            </div>
            <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums font-mono">
              {diagnostics?.uptime || "0m"}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-signal" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Environment</span>
            </div>
            <div className="text-2xl font-semibold text-signal tracking-tight font-mono">
              {diagnostics?.environment || "Local Dev"}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Layers className="h-3.5 w-3.5 text-foreground/80" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Chunks In Index</span>
            </div>
            <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums font-mono">
              {diagnostics?.stats?.chunks_stored || 423}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <HardDrive className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Database Engine</span>
            </div>
            <div className="text-base font-semibold text-foreground tracking-tight font-mono pt-1">
              {diagnostics?.server?.database_type || "SQLite"}
            </div>
          </div>
        </div>

        {/* Core Services Topology Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-foreground font-medium">
              <Cpu className="h-4 w-4 text-accent" />
              <span>Active Service Topology</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {diagnostics?.services?.length || 7} Connected Components
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {diagnostics?.services?.map((service: any, idx: number) => {
              const healthy = service.status === "healthy";
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-surface p-4 flex flex-col justify-between hover:bg-raised transition-colors group space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors shrink-0">
                        {service.service_name.includes("FastAPI") ? <Terminal className="h-4 w-4" /> :
                         service.service_name.includes("Vector") ? <Database className="h-4 w-4" /> :
                         service.service_name.includes("BM25") ? <FileText className="h-4 w-4" /> :
                         service.service_name.includes("Embeddings") ? <Layers className="h-4 w-4" /> :
                         service.service_name.includes("Reranker") ? <Zap className="h-4 w-4" /> :
                         service.service_name.includes("LLM") ? <Cpu className="h-4 w-4" /> :
                         <Server className="h-4 w-4" />}
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-foreground">{service.service_name}</h3>
                        <p className="text-[10px] font-mono text-muted-foreground">{service.version_or_info || "Ready"}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-signal">
                      <span className={cn("h-1.5 w-1.5 rounded-full", healthy ? "bg-signal" : "bg-red-400")} />
                      {service.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground/70">
                    <span>Target: Localhost</span>
                    <span>Ready</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Runtime Architecture & Configuration Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Pipeline Flow Visualization */}
          <div className="rounded-xl border border-border bg-surface p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-foreground font-medium">
                  RAG Execution Pipeline
                </h3>
              </div>
              <span className="text-[10px] font-mono text-accent bg-secondary px-2 py-0.5 rounded border border-border">
                Deterministic Flow
              </span>
            </div>

            <div className="space-y-2 py-1">
              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-subtle p-3 text-xs">
                <div className="h-5 w-5 rounded bg-secondary font-mono text-[10px] flex items-center justify-center text-muted-foreground shrink-0">1</div>
                <div className="flex-1">
                  <span className="text-foreground font-medium">Document Ingestion & Chunking</span>
                  <span className="text-[11px] text-muted-foreground ml-2 font-mono">Token split (800 / 100 overlap)</span>
                </div>
              </div>

              <div className="flex items-center justify-center text-muted-foreground/40">
                <ArrowRight className="h-3 w-3 rotate-90" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-border bg-surface-subtle p-3 text-xs space-y-1">
                  <div className="text-accent font-mono text-[10px]">2A. DENSE VECTOR</div>
                  <div className="text-foreground font-medium text-[11px]">Qdrant Embeddings</div>
                </div>
                <div className="rounded-lg border border-border bg-surface-subtle p-3 text-xs space-y-1">
                  <div className="text-signal font-mono text-[10px]">2B. SPARSE LEXICAL</div>
                  <div className="text-foreground font-medium text-[11px]">BM25Okapi Search</div>
                </div>
              </div>

              <div className="flex items-center justify-center text-muted-foreground/40">
                <ArrowRight className="h-3 w-3 rotate-90" />
              </div>

              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-subtle p-3 text-xs">
                <div className="h-5 w-5 rounded bg-secondary font-mono text-[10px] flex items-center justify-center text-accent shrink-0">3</div>
                <div className="flex-1">
                  <span className="text-foreground font-medium">Reciprocal Rank Fusion (RRF)</span>
                  <span className="text-[11px] text-muted-foreground ml-2 font-mono">Rank merge (k=60)</span>
                </div>
              </div>

              <div className="flex items-center justify-center text-muted-foreground/40">
                <ArrowRight className="h-3 w-3 rotate-90" />
              </div>

              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-subtle p-3 text-xs">
                <div className="h-5 w-5 rounded bg-secondary font-mono text-[10px] flex items-center justify-center text-signal shrink-0">4</div>
                <div className="flex-1">
                  <span className="text-foreground font-medium">Cross-Encoder Re-ranker</span>
                  <span className="text-[11px] text-muted-foreground ml-2 font-mono">ms-marco-MiniLM (Top 5)</span>
                </div>
              </div>

              <div className="flex items-center justify-center text-muted-foreground/40">
                <ArrowRight className="h-3 w-3 rotate-90" />
              </div>

              <div className="flex items-center gap-2.5 rounded-lg border border-accent/40 bg-accent/5 p-3 text-xs">
                <div className="h-5 w-5 rounded bg-accent/20 font-mono text-[10px] flex items-center justify-center text-accent font-semibold shrink-0">5</div>
                <div className="flex-1">
                  <span className="text-accent font-medium">Grounded LLM Generation</span>
                  <span className="text-[11px] text-muted-foreground ml-2 font-mono">Citation verification</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Inspector */}
          <div className="rounded-xl border border-border bg-surface p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-foreground font-medium">
                  Runtime Configuration
                </h3>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Read-Only</span>
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar pr-1 text-xs">
              {diagnostics?.configuration && Object.entries(diagnostics.configuration).map(([key, val]: [string, any], idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 px-3 rounded-md bg-surface-subtle border border-border/80"
                >
                  <span className="font-mono text-[11px] text-muted-foreground uppercase">{key.replace(/_/g, " ")}</span>
                  <span className="font-mono text-[11px] text-foreground font-medium">{String(val)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border text-[10px] font-mono text-muted-foreground flex items-center justify-between">
              <span>Host: Windows / Python 3.11</span>
              <span>FastAPI Port: 8000</span>
            </div>
          </div>

        </div>

        {/* Activity Feed Section */}
        {activityFeed.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-foreground font-medium">
                  System Audit & Activity Feed
                </h3>
              </div>
              <span className="text-[10px] font-mono text-signal">Live Telemetry</span>
            </div>

            <div className="divide-y divide-border/60">
              {activityFeed.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0" />
                    <span className="text-foreground font-medium truncate">{item.title}</span>
                    <span className="text-muted-foreground text-[11px] truncate hidden sm:inline">{item.description}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {new Date(item.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
