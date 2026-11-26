"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchHealthServices } from "@/lib/api";
import { Search, ExternalLink, Activity, Sparkles, Terminal } from "lucide-react";
import { CommandPalette } from "@/components/command-palette";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [healthStatus, setHealthStatus] = useState<"healthy" | "degraded" | "checking" | "disconnected">("checking");
  const [environment, setEnvironment] = useState<string>("");
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    fetchHealthServices()
      .then((data: any) => {
        const services = data?.services || [];
        const isAllHealthy = services.length === 0 || services.every((s: any) => s.status === "healthy");
        setHealthStatus(isAllHealthy ? "healthy" : "degraded");
        if (data?.environment) setEnvironment(data.environment);
      })
      .catch(() => {
        setHealthStatus("disconnected");
        setEnvironment(typeof window !== "undefined" && window.location.hostname.includes("localhost") ? "Local (Offline)" : "Disconnected");
      });
  }, []);

  const getActiveSectionInfo = () => {
    if (pathname.startsWith("/ask") || pathname === "/") {
      return { kicker: "01", name: "Ask", subtitle: "Grounded Retrieval & Answers" };
    }
    if (pathname.startsWith("/knowledge")) {
      return { kicker: "02", name: "Knowledge", subtitle: "Document Corpus & Chunks" };
    }
    if (pathname.startsWith("/retrieval")) {
      return { kicker: "03", name: "Retrieval", subtitle: "Multi-Stage Pipeline Inspector" };
    }
    if (pathname.startsWith("/evaluation")) {
      return { kicker: "04", name: "Evaluation", subtitle: "Ragas Quality Standards" };
    }
    if (pathname.startsWith("/system")) {
      return { kicker: "05", name: "System", subtitle: "Topology & Diagnostics" };
    }
    return { kicker: "00", name: "Workspace", subtitle: "RAG Platform" };
  };

  const section = getActiveSectionInfo();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-[#090f0e]/95 backdrop-blur-md px-5 sm:px-6">
        {/* Brand & Workspace Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link href="/ask" className="flex items-center gap-2 group">
            <span className="font-semibold text-sm tracking-tight text-foreground group-hover:text-accent transition-colors">
              Mnemora<span className="text-accent">.</span>
            </span>
          </Link>

          <span className="text-muted-foreground/40 text-xs font-mono">/</span>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground">Workspace</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-accent font-medium">{section.kicker}</span>
            <span className="text-foreground font-medium hidden sm:inline">{section.name}</span>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Search Button */}
          <button
            onClick={() => setCommandOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-muted-foreground hover:text-foreground hover:border-line transition-all group"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
            <span className="hidden md:inline text-[11px]">Command Palette</span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded border border-border bg-raised text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          {/* Operational Status Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-border text-xs">
            <span className="relative flex h-2 w-2">
              {healthStatus === "healthy" ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-signal" />
                </>
              ) : healthStatus === "degraded" ? (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              ) : healthStatus === "checking" ? (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground animate-pulse" />
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
              )}
            </span>
            <span className={cn(
              "text-[11px] font-mono font-medium",
              healthStatus === "healthy" ? "text-signal" :
              healthStatus === "degraded" ? "text-amber-400" :
              healthStatus === "checking" ? "text-muted-foreground" : "text-red-400"
            )}>
              {healthStatus === "healthy" ? "Operational" :
               healthStatus === "degraded" ? "Degraded" :
               healthStatus === "checking" ? "Checking..." : "Disconnected"}
            </span>
            {environment && (
              <span className="hidden sm:inline text-[10px] font-mono text-muted-foreground/60 border-l border-border pl-1.5">
                {environment}
              </span>
            )}
          </div>

          {/* Harsha Kurtkoti Link */}
          <a
            href="https://www.harshakurtkoti.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-accent transition-colors px-2 py-1 rounded bg-raised/40 hover:bg-raised border border-border/60"
            title="Harsha Kurtkoti — Backend, AI & Infrastructure"
          >
            <span className="font-semibold text-accent">HK</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </header>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
