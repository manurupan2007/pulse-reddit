"use client";

import { ShieldAlert, Zap, Globe, Share2, Maximize2 } from "lucide-react";
import { CascadeView } from "@/components/dashboard/cascade-view";
import { ScenarioOutcome, PulseRuntimePayload } from "@/types";

type CascadePageProps = {
  outcome: ScenarioOutcome;
  runtime: PulseRuntimePayload;
};

export function CascadePage({ outcome, runtime }: CascadePageProps) {
  if (!outcome || !runtime || !outcome.cascadeMap) {
    return (
      <div className="flex h-96 items-center justify-center border-2 border-dashed border-border/40 rounded-3xl bg-muted/5 animate-pulse">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-xs font-black uppercase tracking-[0.4em]">Visualization Failure</div>
          <p className="text-muted-foreground text-sm font-medium">Unable to project propagation clusters. Check node telemetry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700 h-full flex flex-col text-foreground pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/40 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/80">Signature Visualization</div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-balance">
            Social <span className="text-muted-foreground font-light italic">Conflict Propagation</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-muted/20 px-6 py-3 rounded-xl border border-border/40 flex items-center gap-4">
              <Globe className="h-5 w-5 text-red-500 opacity-60" />
              <div className="text-right">
                 <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Active Cascades</div>
                 <div className="text-xl font-black tabular-nums">{outcome.cascadeMap.nodes.length} Clusters</div>
              </div>
           </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-[740px] glass-panel relative overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.5)] group">
        {/* Cinematic Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="p-8 border-b border-border/40 flex items-center justify-between bg-card/10 backdrop-blur-xl relative z-10">
          <div className="space-y-1">
            <div className="text-2xl font-black tracking-tighter text-foreground">{outcome.cascadeMap.headline}</div>
            <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-red-500/40 animate-pulse" />
               Live heuristic mapping of containment field vs spread velocity
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5 transition-all hover:bg-red-500/20">
              <Zap className="h-4 w-4" />
              Propagation Active
            </div>
            {Object.values(runtime.scenario).some(Boolean) && (
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-in slide-in-from-right-4">
                <ShieldAlert className="h-4 w-4" />
                Intervention Shield ON
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-10 p-10 overflow-hidden relative z-10">
          <div className="flex-1 glass-panel bg-card/5 p-12 flex items-center justify-center relative overflow-hidden border-primary/5 shadow-inner">
             {/* Centerpiece Visualization */}
             <div className="w-full h-full max-w-5xl transition-transform duration-1000 ease-out group-hover:scale-[1.02]">
               <CascadeView outcome={outcome} mode="full" />
             </div>
             
             {/* Tactical Overlays */}
             <div className="absolute bottom-8 left-8 flex flex-col gap-2">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Conflict Alpha
                </div>
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">
                   <div className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Containment Beta
                </div>
             </div>
          </div>

          <div className="w-full lg:w-[420px] space-y-8 overflow-y-auto custom-scrollbar shrink-0 pr-4">
            <div className="sticky top-0 bg-background/90 backdrop-blur-xl z-20 pb-6 border-b border-border/40 flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Node Analysis Stream</div>
              <Share2 className="h-4 w-4 text-muted-foreground/40 hover:text-primary transition-colors cursor-pointer" />
            </div>
            <div className="space-y-6 pt-4">
              {outcome.cascade.map((c) => (
                <div key={c.label} className="p-6 rounded-2xl border border-border/40 bg-card/40 space-y-5 transition-all hover:bg-card/60 hover:border-primary/20 hover:translate-x-1 group/node cursor-default shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                       <div className="text-base font-black tracking-tight group-hover/node:text-primary transition-colors">{c.label}</div>
                       <div className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">Heuristic Weight: {Math.round(c.after * 1.2)}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-xs font-black tabular-nums border ${
                      c.after < 40 
                        ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' 
                        : (c.after < 70 ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20')
                    }`}>
                      {c.after}%
                    </div>
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed font-medium opacity-80 line-clamp-2 group-hover/node:opacity-100 transition-opacity">{c.note}</p>
                  <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden shadow-inner">
                     <div 
                      className={`h-full transition-all duration-1000 ease-out ${c.after < 40 ? 'bg-emerald-500' : (c.after < 70 ? 'bg-amber-500' : 'bg-red-500')}`} 
                      style={{ width: `${c.after}%` }} 
                     />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
