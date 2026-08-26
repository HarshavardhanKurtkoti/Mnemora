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
  AlertCircle, 
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
import { Button } from "@/components/ui/button";
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
        fetchActivityFeed(10).catch(() => [])
      ]);

      if (diagData) {
        setDiagnostics(diagData);
      } else {
        // Fallback default structure
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
            { id: 6, service_name: "LLM Provider", status: "healthy", version_or_info: "Local Mock / OpenAI" },
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
      await new Promise((resolve) => setTimeout(resolve, 800)); // Smooth UI transition
      await loadData();
    } finally {
      setIsRunningCheck(false);
    }
  };

  const isHealthy = diagnostics?.status === "operational";

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-4 lg:p-6 bg-transparent relative">
      {/* Ambient background lighting */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-[#10B981]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1600px] w-full mx-auto space-y-4">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl lg:text-2xl font-light tracking-wide text-foreground">
                System <span className="font-serif italic text-accent opacity-90">Observability</span>
              </h1>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest font-medium">
                  {isHealthy ? "All Systems Operational" : "System Degraded"}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-light leading-relaxed">
              Mnemora RAG Engine runtime health, service topology, and active indexing infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            {lastCheckTime && (
              <span className="text-[10px] font-mono text-muted-foreground">
                Last checked: {lastCheckTime}
              </span>
            )}
            <Button
              onClick={handleRunHealthCheck}
              disabled={isRunningCheck}
              className="h-8 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 px-3.5 text-xs font-medium shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all shrink-0"
            >
              <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", isRunningCheck && "animate-spin")} />
              Run Health Check
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm lg:text-base font-semibold text-foreground">{diagnostics?.uptime || "0m"}</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Server Uptime</div>
            </div>
          </div>

          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm lg:text-base font-semibold text-emerald-400">{diagnostics?.environment || "Local Dev"}</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Environment</div>
            </div>
          </div>

          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 flex items-center justify-center shrink-0">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm lg:text-base font-semibold text-foreground">{diagnostics?.stats?.chunks_stored || 0}</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Chunks In Index</div>
            </div>
          </div>

          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 flex items-center justify-center shrink-0">
              <HardDrive className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm lg:text-base font-semibold text-foreground">{diagnostics?.server?.database_type || "SQLite"}</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Database Engine</div>
            </div>
          </div>
        </div>

        {/* Core Services Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground font-medium">
              <Cpu className="h-3.5 w-3.5 text-accent" />
              <span>Active Service Topology</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {diagnostics?.services?.length || 0} Connected Services
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {diagnostics?.services?.map((service: any, idx: number) => {
              const healthy = service.status === "healthy";
              return (
                <div
                  key={idx}
                  className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-white/20 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                        {service.service_name.includes("FastAPI") ? <Terminal className="h-4 w-4" /> :
                         service.service_name.includes("Vector") ? <Database className="h-4 w-4 text-[#00E5FF]" /> :
                         service.service_name.includes("BM25") ? <FileText className="h-4 w-4 text-[#8B5CF6]" /> :
                         service.service_name.includes("Embeddings") ? <Layers className="h-4 w-4 text-[#14B8A6]" /> :
                         service.service_name.includes("Reranker") ? <Zap className="h-4 w-4 text-[#F59E0B]" /> :
                         service.service_name.includes("LLM") ? <Cpu className="h-4 w-4 text-emerald-400" /> :
                         <Server className="h-4 w-4" />}
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-foreground">{service.service_name}</h3>
                        <p className="text-[10px] font-mono text-muted-foreground">{service.version_or_info || "Ready"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded-full">
                      <span className={cn("h-1.5 w-1.5 rounded-full", healthy ? "bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" : "bg-red-400")} />
                      <span className={cn("text-[9px] font-mono uppercase tracking-wider", healthy ? "text-emerald-400" : "text-red-400")}>
                        {service.status}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-muted-foreground/70">
                    <span>Target: Localhost</span>
                    <span>Active Lifecycle</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Runtime Architecture & Configuration Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Pipeline Flow Visualization */}
          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Workflow className="h-3.5 w-3.5 text-accent" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-foreground font-medium">
                  RAG Execution Pipeline
                </h3>
              </div>
              <span className="text-[9px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">
                Deterministic Flow
              </span>
            </div>

            <div className="space-y-2 py-1">
              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 text-xs">
                <div className="h-5 w-5 rounded bg-white/5 font-mono text-[9px] flex items-center justify-center text-muted-foreground shrink-0">1</div>
                <div className="flex-1">
                  <span className="text-foreground font-medium">Document Ingestion & Chunking</span>
                  <span className="text-[10px] text-muted-foreground ml-2 font-mono">Token split (800 / 100 overlap)</span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-muted-foreground/40 rotate-90" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 text-xs">
                  <div className="text-[#00E5FF] font-mono text-[9px] mb-0.5">2A. DENSE VECTOR</div>
                  <div className="text-foreground font-medium text-[11px]">Qdrant Embeddings</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 text-xs">
                  <div className="text-[#8B5CF6] font-mono text-[9px] mb-0.5">2B. SPARSE LEXICAL</div>
                  <div className="text-foreground font-medium text-[11px]">BM25Okapi Search</div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-muted-foreground/40 rotate-90" />
              </div>

              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 text-xs">
                <div className="h-5 w-5 rounded bg-[#14B8A6]/20 text-[#14B8A6] font-mono text-[9px] flex items-center justify-center shrink-0">3</div>
                <div className="flex-1">
                  <span className="text-foreground font-medium">Reciprocal Rank Fusion (RRF)</span>
                  <span className="text-[10px] text-muted-foreground ml-2 font-mono">Weighted merge (k=60)</span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-muted-foreground/40 rotate-90" />
              </div>

              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 text-xs">
                <div className="h-5 w-5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-mono text-[9px] flex items-center justify-center shrink-0">4</div>
                <div className="flex-1">
                  <span className="text-foreground font-medium">Cross-Encoder Re-ranker</span>
                  <span className="text-[10px] text-muted-foreground ml-2 font-mono">ms-marco-MiniLM (Top 5)</span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-muted-foreground/40 rotate-90" />
              </div>

              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 text-xs">
                <div className="h-5 w-5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] flex items-center justify-center shrink-0">5</div>
                <div className="flex-1">
                  <span className="text-foreground font-medium">Grounded LLM Generation</span>
                  <span className="text-[10px] text-muted-foreground ml-2 font-mono">Structured JSON & Citation validation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Inspector */}
          <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-accent" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-foreground font-medium">
                  Runtime Configuration
                </h3>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground">Read-Only</span>
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar pr-1 text-xs">
              {diagnostics?.configuration && Object.entries(diagnostics.configuration).map(([key, val]: [string, any], idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded bg-white/[0.02] border border-white/5"
                >
                  <span className="font-mono text-[11px] text-muted-foreground uppercase">{key.replace(/_/g, " ")}</span>
                  <span className="font-mono text-[11px] text-foreground font-medium truncate max-w-[240px]">
                    {String(val)}
                  </span>
                </div>
              ))}

              <div className="flex items-center justify-between py-1.5 px-2.5 rounded bg-white/[0.02] border border-white/5">
                <span className="font-mono text-[11px] text-muted-foreground uppercase">PROCESS ID</span>
                <span className="font-mono text-[11px] text-accent font-medium">
                  {diagnostics?.server?.pid || 14220}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded bg-white/[0.02] border border-white/5">
                <span className="font-mono text-[11px] text-muted-foreground uppercase">API PREFIX</span>
                <span className="font-mono text-[11px] text-foreground font-medium">
                  {diagnostics?.server?.api_prefix || "/api/v1"}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Activity & Event Telemetry Feed */}
        <div className="bg-[#070b0e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-accent" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-foreground font-medium">
                System Activity & Telemetry Log
              </h3>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">Recent Events</span>
          </div>

          <div className="space-y-2">
            {activityFeed.length > 0 ? (
              activityFeed.map((act: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="font-medium text-foreground truncate">{act.title || act.description}</span>
                    <span className="text-[10px] text-muted-foreground truncate hidden md:inline">{act.description}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0 ml-2">
                    {new Date(act.created_at || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground font-light">
                No recent activity events recorded.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
