"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchHealthServices } from "@/lib/api";
import { Search, ExternalLink } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [healthStatus, setHealthStatus] = useState<"healthy" | "degraded" | "checking">("healthy");
  const [environment, setEnvironment] = useState<string>("Local Dev");

  useEffect(() => {
    fetchHealthServices()
      .then((data: any) => {
        const services = data?.services || [];
        const isAllHealthy = services.length === 0 || services.every((s: any) => s.status === "healthy");
        setHealthStatus(isAllHealthy ? "healthy" : "degraded");
        if (data?.environment) setEnvironment(data.environment);
      })
      .catch(() => {
        setHealthStatus("healthy");
      });
  }, []);

  const getActiveSection = () => {
    if (pathname.startsWith("/ask") || pathname === "/") return "Ask";
    if (pathname.startsWith("/knowledge")) return "Knowledge";
    if (pathname.startsWith("/retrieval")) return "Retrieval";
    if (pathname.startsWith("/evaluation")) return "Evaluation";
    if (pathname.startsWith("/system")) return "System";
    return "Workspace";
  };

  return (
    <header className="sticky top-0 z-30 flex h-13 shrink-0 items-center justify-between border-b border-border bg-[#090f0e]/95 backdrop-blur-md px-5 sm:px-6">
      {/* Brand & Workspace Breadcrumb matching Section 3 */}
      <div className="flex items-center gap-3">
        <Link href="/ask" className="flex items-center gap-2 group">
          <span className="font-semibold text-sm tracking-tight text-foreground group-hover:text-accent transition-colors">
            Mnemora
          </span>
        </Link>

        <span className="text-muted-foreground/40 text-xs font-mono">/</span>

        <span className="text-xs text-muted-foreground font-mono">
          Workspace / <span className="text-foreground font-medium">{getActiveSection()}</span>
        </span>
      </div>

      {/* Right Operational Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary/80 border border-border text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          <span className="text-[11px] font-mono text-signal font-medium">
            Operational
          </span>
        </div>

        <a
          href="https://www.harshakurtkoti.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-accent transition-colors px-1.5 py-1 rounded"
          title="Harsha Kurtkoti Portfolio"
        >
          <span>HK</span>
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>
    </header>
  );
}
