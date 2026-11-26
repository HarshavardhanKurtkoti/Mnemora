"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Library, Search, LineChart, Server } from "lucide-react";
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
    <aside className="flex h-full w-52 flex-col border-r border-border bg-[#0a1110] shrink-0 select-none">
      {/* Section 3 Header: WORKSPACE */}
      <div className="px-4 pt-5 pb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 font-medium">
          WORKSPACE
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href) || (pathname === "/" && item.name === "Ask");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-xs transition-colors",
                isActive
                  ? "bg-secondary text-foreground font-medium border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="tracking-tight">{item.name}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Section 3 Footer: Local environment v1.6.0 */}
      <div className="p-3 border-t border-border mt-auto bg-surface-subtle/40">
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground px-1">
          <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0" />
          <span className="truncate">Local environment <span className="text-foreground/80">v1.6.0</span></span>
        </div>
      </div>
    </aside>
  );
}
