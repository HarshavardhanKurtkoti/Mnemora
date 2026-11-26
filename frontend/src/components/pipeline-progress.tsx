"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  Database, 
  Layers, 
  Sparkles, 
  Workflow, 
  Zap,
  ArrowRight,
  Cpu,
  FileCode2,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineProgressProps {
  isActive: boolean;
  query?: string;
  mode?: "query" | "inspect" | "upload";
}

interface StepInfo {
  number: string;
  name: string;
  subtext: string;
  detail: string;
  badge: string;
  icon: any;
}

const QUERY_STEPS: StepInfo[] = [
  {
    number: "01",
    name: "Dual Search Ingress",
    subtext: "Querying dense vector space & sparse lexical index",
    detail: "Dispatching parallel requests to Qdrant (384d Cosine similarity) and BM25Okapi inverted index.",
    badge: "Parallel Search",
    icon: Database
  },
  {
    number: "02",
    name: "Model Cache & FastEmbed",
    subtext: "Fetching ONNX model weights & tokenizers",
    detail: "Resolving sentence-transformers & ONNX model files (config.json, tokenizer.json, model.onnx).",
    badge: "5 Model Files",
    icon: Cpu
  },
  {
    number: "03",
    name: "Reciprocal Rank Fusion",
    subtext: "Merging candidate rank distributions (k=60)",
    detail: "Computing reciprocal rank scores RRF(d) = Σ 1 / (60 + r(d)) to combine semantic and exact matches.",
    badge: "Rank Normalization",
    icon: Layers
  },
  {
    number: "04",
    name: "Cross-Encoder Reranking",
    subtext: "Scoring shortlisted passages with ms-marco-MiniLM",
    detail: "Executing joint query-passage cross-attention to score fine-grained relevance.",
    badge: "Self-Attention",
    icon: Zap
  },
  {
    number: "05",
    name: "Grounded Generation",
    subtext: "Synthesizing answer with verified citations",
    detail: "Generating response with Pydantic structured output and verifying cited chunk IDs against retrieved context.",
    badge: "Citation Validation",
    icon: ShieldCheck
  }
];

export function PipelineProgress({ isActive, query, mode = "query" }: PipelineProgressProps) {
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    if (!isActive) {
      setElapsed(0);
      setProgress(5);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const ms = Date.now() - startTime;
      setElapsed(ms / 1000);

      // Smooth progress curve approaching 95%
      setProgress((prev) => {
        if (ms < 1500) return 18;
        if (ms < 4000) return 38;
        if (ms < 8000) return 62;
        if (ms < 12000) return 82;
        if (prev >= 95) return 95;
        return prev + 0.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  // Calculate current active step based on elapsed time
  let activeStepIndex = 0;
  if (elapsed >= 1.5 && elapsed < 4.5) activeStepIndex = 1;
  else if (elapsed >= 4.5 && elapsed < 8.0) activeStepIndex = 2;
  else if (elapsed >= 8.0 && elapsed < 12.0) activeStepIndex = 3;
  else if (elapsed >= 12.0) activeStepIndex = 4;

  const currentStep = QUERY_STEPS[activeStepIndex];

  return (
    <div className="rounded-xl border border-accent/40 bg-[#081210] p-5 space-y-4 shadow-xl animate-in fade-in-0 duration-200 ring-1 ring-accent/20">
      {/* Header with Title and Elapsed Timer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-signal animate-ping" />
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>Pipeline Execution in Progress</span>
              <span className="text-[10px] text-accent lowercase font-normal">({mode})</span>
            </h3>
            {query && (
              <p className="text-[11px] text-muted-foreground truncate max-w-md mt-0.5">
                Query: "{query}"
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface border border-border text-foreground tabular-nums">
            <Clock className="h-3 w-3 text-accent" />
            <span>{elapsed.toFixed(1)}s elapsed</span>
          </div>
          <span className="text-accent font-semibold tabular-nums">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden border border-border/60">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-mint to-accent transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Active Step Highlight Card */}
      <div className="p-3.5 rounded-lg border border-line bg-surface/70 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-accent">
              Step {currentStep.number} / 05:
            </span>
            <span className="text-xs font-semibold text-foreground">
              {currentStep.name}
            </span>
          </div>
          <span className="text-[10px] font-mono text-signal bg-signal/10 border border-signal/20 px-2 py-0.5 rounded">
            {currentStep.badge}
          </span>
        </div>

        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          {currentStep.detail}
        </p>

        {/* Notice for FastEmbed cold start if taking > 2 seconds */}
        {elapsed >= 2.0 && activeStepIndex <= 1 && (
          <div className="pt-2 border-t border-border/60 flex items-center gap-2 text-[11px] font-mono text-amber-400">
            <Cpu className="h-3.5 w-3.5 shrink-0 animate-pulse" />
            <span>FastEmbed ONNX weights & tokenizer download / cache verification in progress...</span>
          </div>
        )}
      </div>

      {/* Step Progress Chain */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-mono text-[10px]">
        {QUERY_STEPS.map((st, i) => {
          const isDone = i < activeStepIndex;
          const isCurrent = i === activeStepIndex;
          return (
            <div
              key={st.number}
              className={cn(
                "p-2 rounded border transition-colors flex flex-col justify-between",
                isCurrent
                  ? "border-accent bg-accent/15 text-accent font-medium shadow-xs"
                  : isDone
                  ? "border-border/80 bg-surface/50 text-signal"
                  : "border-border/40 bg-surface/20 text-muted-foreground/60"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span>{st.number}</span>
                {isDone ? (
                  <CheckCircle2 className="h-3 w-3 text-signal" />
                ) : isCurrent ? (
                  <Activity className="h-3 w-3 text-accent animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                )}
              </div>
              <span className="truncate">{st.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
