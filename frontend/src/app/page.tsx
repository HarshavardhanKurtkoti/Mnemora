import Link from "next/link";
import { ArrowRight, Search, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-3xl space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" /> RAG ENGINE
            </h1>
            <div className="h-px flex-1 bg-border/40"></div>
          </div>
          <p className="text-muted-foreground text-sm tracking-widest uppercase">
            Evidence-grounded knowledge retrieval
          </p>
        </div>

        {/* Hero Ask Box */}
        <div className="relative group cursor-pointer">
          {/* Subtle gradient glow behind the box */}
          <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-accent/20 via-border/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>
          
          <Link 
            href="/ask" 
            className="block relative bg-background/40 border border-border/40 backdrop-blur-2xl rounded-xl p-8 transition-all duration-300 hover:bg-surface/40 hover:border-border/80 shadow-2xl shadow-black/20"
          >
            <div className="space-y-8">
              <div className="flex items-center gap-4 text-muted-foreground">
                <Search className="h-6 w-6 text-accent/70" />
                <span className="text-xl font-light">Ask anything about your knowledge base...</span>
              </div>
              <div className="flex justify-end">
                <div className="inline-flex items-center gap-2 rounded-lg bg-surface/50 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-md transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground border border-border/50 group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                  Ask Mnemora <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-border/10 via-border/30 to-border/10 my-10"></div>

        {/* System Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Documents</span>
            <span className="text-xl font-mono text-foreground font-medium">12</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Eval Queries</span>
            <span className="text-xl font-mono text-foreground font-medium">60</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Chunk Size</span>
            <span className="text-xl font-mono text-foreground font-medium">
              800<span className="text-xs text-muted-foreground ml-1.5 font-sans">tokens</span>
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Strategy</span>
            <span className="text-sm font-mono text-accent mt-1 font-medium bg-accent/10 px-2 py-0.5 rounded border border-accent/20 w-fit">Hybrid + Reranker</span>
          </div>
        </div>
      </div>
    </div>
  );
}
