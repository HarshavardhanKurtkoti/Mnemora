"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Library, SearchCode, LineChart, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Ask", href: "/ask", icon: MessageSquare },
  { name: "Knowledge", href: "/knowledge", icon: Library },
  { name: "Retrieval", href: "/retrieval", icon: SearchCode },
  { name: "Evaluation", href: "/evaluation", icon: LineChart },
  { name: "System", href: "/system", icon: Server },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-56 flex-col border-r border-border/40 bg-background/30 backdrop-blur-xl">
      <div className="flex-1 px-3 py-6">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-accent" : "text-muted-foreground"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
