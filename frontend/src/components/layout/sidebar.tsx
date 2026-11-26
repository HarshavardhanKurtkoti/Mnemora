"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Library, 
  Search, 
  LineChart, 
  Server, 
  Sparkles,
  Command,
  Activity,
  ChevronRight,
  Database,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/command-palette";
import { fetchOverviewStats } from "@/lib/api";

const navigation = [
  { name: "Ask", href: "/ask", icon: MessageSquare, shortcut: "1", description: "Grounded Q&A" },
  { name: "Knowledge", href: "/knowledge", icon: Library, shortcut: "2", description: "Document corpus" },
  { name: "Retrieval", href: "/retrieval", icon: Search, shortcut: "3", description: "Pipeline inspector" },
  { name: "Evaluation", href: "/evaluation", icon: LineChart, shortcut: "4", description: "Ragas quality" },
  { name: "System", href: "/system", icon: Server, shortcut: "5", description: "Engine diagnostics" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const [stats, setStats] = useState({ documents_indexed: 12, chunks_stored: 423 });

  useEffect(() => {
    fetchOverviewStats()
      .then((res: any) => {
        if (res && res.documents_indexed) {
          setStats(res);
        }
      })
      .catch(() => {});
  }, []);

  // Keyboard shortcut listener for ⌘1 through ⌘5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && ["1", "2", "3", "4", "5"].includes(e.key)) {
        e.preventDefault();
        const index = parseInt(e.key, 10) - 1;
        if (navigation[index]) {
          window.location.href = navigation[index].href;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <aside className="flex h-full w-64 flex-col border-r border-border bg-[#080e0d] shrink-0 select-none">
        {/* Brand Header */}
        <div className="px-5 pt-5 pb-3 border-b border-border/60">
          <Link href="/ask" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent shadow-xs group-hover:border-accent/40 transition-colors">
              <span className="font-serif italic font-bold text-base leading-none">M</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-foreground group-hover:text-accent transition-colors">
                  Mnemora<span className="text-accent">.</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-border/80 bg-raised/80 text-muted-foreground">
                  v1.8
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
                Retrieval Workspace
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Search / Command Palette Trigger */}
        <div className="px-3.5 py-3">
          <button
            onClick={() => setCommandOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-subtle border border-border text-xs text-muted-foreground hover:text-foreground hover:border-line hover:bg-raised transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
              <span className="text-[11px]">Quick Jump...</span>
            </div>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-raised text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-1 space-y-4 overflow-y-auto custom-scrollbar">
          <div>
            <div className="px-2.5 pb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 font-medium">
              WORKSPACE
            </div>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href) || (pathname === "/" && item.name === "Ask");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all",
                      isActive
                        ? "bg-raised text-foreground font-medium border border-border shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-raised/40"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="tracking-tight text-xs font-medium leading-none mb-1">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground/70 leading-none">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-signal ring-2 ring-signal/20 animate-pulse" />
                      )}
                      <span className="text-[10px] font-mono text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                        ⌘{item.shortcut}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Corpus Telemetry Summary */}
          <div className="p-3 rounded-lg border border-border/80 bg-surface/80 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 font-medium">
              <span>INDEX STATUS</span>
              <span className="flex items-center gap-1 text-signal lowercase">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                ready
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50">
              <div>
                <span className="text-[10px] text-muted-foreground block">Documents</span>
                <span className="text-xs font-mono font-semibold text-foreground tabular-nums">
                  {stats.documents_indexed}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Chunks</span>
                <span className="text-xs font-mono font-semibold text-foreground tabular-nums">
                  {stats.chunks_stored}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-border mt-auto bg-surface-subtle/60 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0" />
              <span>Engine <span className="text-foreground/90">Online</span></span>
            </div>
            <span className="text-[10px] text-muted-foreground/60">p95 ~107ms</span>
          </div>

          <a
            href="https://www.harshakurtkoti.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-2 py-1 rounded bg-raised/50 hover:bg-raised text-[10px] font-mono text-muted-foreground hover:text-accent transition-colors border border-border/60"
          >
            <span>harshakurtkoti.in</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </aside>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
