import { Settings } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-[70px] shrink-0 items-center justify-between border-b border-border/10 bg-transparent backdrop-blur-sm px-8">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-8 w-8">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-accent drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold tracking-widest text-foreground bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 uppercase leading-none">MNEMORA</h1>
          <p className="text-[8px] font-mono tracking-widest text-accent/80 uppercase mt-0.5">Command Center</p>
        </div>
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
