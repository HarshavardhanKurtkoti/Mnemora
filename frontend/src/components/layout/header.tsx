import { Activity } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/40 bg-background/60 px-6 backdrop-blur-md">
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">MNEMORA</h1>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-2"></span>
          </span>
          <span className="text-muted-foreground uppercase tracking-wider">System Operational</span>
        </div>
      </div>
    </header>
  );
}
