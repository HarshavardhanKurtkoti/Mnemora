import { Settings } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-border/10 bg-[#070b0e] px-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-light tracking-wide">
        <span>/</span>
        <span className="uppercase">Command Center</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
          </span>
          <span className="text-emerald-500 text-xs font-medium tracking-widest uppercase">System Operational</span>
        </div>
        
        <button className="flex items-center justify-center h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
