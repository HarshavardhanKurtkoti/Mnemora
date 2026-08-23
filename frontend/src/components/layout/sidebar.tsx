"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Library, Search, LineChart, Server, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Ask", href: "/ask", icon: MessageSquare },
  { name: "Knowledge", href: "/knowledge", icon: Library },
  { name: "Retrieval", href: "/retrieval", icon: Search },
  { name: "Evaluation", href: "/evaluation", icon: LineChart },
  { name: "System", href: "/system", icon: Server },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[260px] flex-col border-r border-border/20 bg-[#070b0e]">
      {/* Brand Section */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-transparent border border-accent/40 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <div className="flex flex-col gap-1.5">
              <div className="h-[2px] w-5 bg-accent rounded-full"></div>
              <div className="h-[2px] w-5 bg-accent rounded-full"></div>
            </div>
          </div>
          <h1 className="text-2xl font-light tracking-wide text-foreground">MNEMORA</h1>
        </div>
        <p className="text-[10px] tracking-widest text-accent uppercase font-medium">Command Center</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-2">
        <nav className="flex flex-col gap-2">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href) || (pathname === '/' && item.name === 'Ask');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 relative rounded-lg px-4 py-3 text-sm transition-all duration-300",
                  isActive
                    ? "text-foreground bg-accent/5 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30 font-light"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full bg-accent shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
                )}
                
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] transition-colors",
                    isActive ? "text-accent drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "text-muted-foreground/70"
                  )}
                />
                <span className="tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto flex flex-col px-6 py-6 border-t border-border/10">
        <div className="mb-8">
          <h3 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-2">System Health</h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-500 text-xs font-medium">All systems operational</span>
          </div>
          
          {/* Circular Progress (Mock) */}
          <div className="relative h-28 w-28 mx-auto mt-6 mb-6 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-border/30" />
              {/* Progress circle */}
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="251.2" strokeDashoffset="0" className="text-accent drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-foreground">100%</span>
              <span className="text-[9px] text-muted-foreground tracking-widest uppercase">Uptime</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            Version 1.6.0
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground text-sm font-medium border border-border/20 group-hover:border-border/50 transition-colors">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Mnemora Engine</span>
              <span className="text-[10px] text-muted-foreground">Local Environment</span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
