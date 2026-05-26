"use client";

import { ShieldAlert, Zap } from "lucide-react";
import { CascadeView } from "@/components/dashboard/cascade-view";
import { ScenarioOutcome, PulseRuntimePayload } from "@/types";

type CascadePageProps = {
  outcome: ScenarioOutcome;
  runtime: PulseRuntimePayload;
};

export function CascadePage({ outcome, runtime }: CascadePageProps) {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 h-full flex flex-col text-foreground">
      <div className="space-y-2 shrink-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">Signature Visualization</div>
        <h1 className="text-4xl font-extrabold tracking-tight">Social Conflict Propagation</h1>
      </div>
      
      <div className="flex-1 min-h-[700px] glass-panel relative overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between bg-card/20 relative z-10">
          <div className="space-y-1">
            <div className="text-xl font-bold tracking-tight">{outcome.cascadeMap.headline}</div>
            <div className="text-sm text-muted-foreground italic">Visualizing containment field vs spread velocity</div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
              <Zap className="h-3 w-3" />
              Spread Active
            </div>
            {Object.values(runtime.scenario).some(Boolean) && (
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <ShieldAlert className="h-3 w-3" />
                Containment Layer ON
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col md:flex-row gap-6 p-6">
          <div className="flex-1 glass-panel bg-card/5 p-4 flex items-center justify-center relative">
             {/* Large full-screen style cascade */}
             <div className="w-full h-full max-w-4xl max-h-4xl scale-125">
               <CascadeView outcome={outcome} />
             </div>
          </div>
          <div className="w-full md:w-80 space-y-4 overflow-y-auto custom-scrollbar shrink-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Signal Mapping</div>
            {outcome.cascade.map((c) => (
              <div key={c.label} className="p-4 rounded-xl border border-border bg-card/40 space-y-3 transition-colors hover:bg-card/60">
                <div className="flex justify-between items-start gap-2">
                  <div className="text-xs font-bold leading-tight">{c.label}</div>
                  <div className={`text-xs font-black ${c.after < 40 ? 'text-emerald-500' : (c.after < 70 ? 'text-amber-500' : 'text-red-500')}`}>
                    {c.after}%
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground leading-relaxed">{c.note}</div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                   <div 
                    className={`h-full transition-all duration-1000 ${c.after < 40 ? 'bg-emerald-500' : (c.after < 70 ? 'bg-amber-500' : 'bg-red-500')}`} 
                    style={{ width: `${c.after}%` }} 
                   />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
