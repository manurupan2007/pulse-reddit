"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { SectionCard } from "@/components/ui/section-card";
import { SimulatorPanel } from "@/components/dashboard/simulator-panel";
import { ForecastTimeline } from "@/components/dashboard/forecast-timeline";
import { ScenarioAction, ScenarioOutcome, ScenarioState, CommunityTwin, PulseRuntimePayload } from "@/types";

type SimulationPageProps = {
  runtime: PulseRuntimePayload;
  twin: CommunityTwin;
  outcome: ScenarioOutcome;
  actions: ScenarioAction[];
  toggleAction: (key: any) => void;
  resetScenario: () => void;
};

export function SimulationPage({ 
  runtime, 
  twin, 
  outcome, 
  actions, 
  toggleAction, 
  resetScenario 
}: SimulationPageProps) {
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    setSimulating(true);
    const timer = setTimeout(() => setSimulating(false), 800);
    return () => clearTimeout(timer);
  }, [runtime.scenario]);

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 text-foreground pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full bg-fuchsia-500 ${simulating ? 'animate-ping' : 'opacity-50'}`} />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-fuchsia-500/80 text-balance">Heuristic Simulation Lab</div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl">
            Outcome <span className="text-muted-foreground font-light italic">Forecasting</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
           {simulating && (
             <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-fuchsia-500/10 text-fuchsia-500 text-[10px] font-black uppercase tracking-widest animate-pulse border border-fuchsia-500/20">
                Calibrating Model...
             </div>
           )}
           <button
            onClick={resetScenario}
            className="group flex items-center gap-2 bg-muted hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 text-foreground px-6 py-3 rounded-xl text-xs font-black border border-border transition-all active:scale-95"
          >
            <Zap className="h-4 w-4" />
            Reset Lab
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <SectionCard 
            title="Intervention Control Array" 
            description="Apply moderation vectors to forecast community impact."
            className="border-fuchsia-500/10 bg-fuchsia-500/[0.02]"
          >
            <div className="pt-2">
              <SimulatorPanel actions={actions} state={runtime.scenario} onToggle={toggleAction} outcome={outcome} />
            </div>
          </SectionCard>
          
          <SectionCard title="Impact Trajectory" description="Projected shifts across the next 72 hours.">
            <div className="pt-4 h-[400px]">
              <ForecastTimeline forecast={twin.forecast} />
            </div>
          </SectionCard>
        </div>
        <div className="space-y-8 flex flex-col">
          <SectionCard title="Heuristic Explanation" description="Reasoning engine output." className="flex-1">
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {outcome.explanation.map((line, i) => (
                <div key={i} className="text-[13px] text-muted-foreground leading-relaxed p-4 rounded-xl bg-card/50 border border-border/40 text-foreground transition-colors hover:border-primary/20">
                  {line}
                </div>
              ))}
              <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 italic text-sm text-foreground text-center shadow-inner">
                &quot;{outcome.narrative}&quot;
              </div>
            </div>
          </SectionCard>
          <div className="glass-panel p-6 space-y-5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-muted-foreground/60">Sim Confidence</span>
              <span className={outcome.confidence === 'high' ? 'text-emerald-500' : 'text-amber-500'}>{outcome.confidence}</span>
            </div>
            <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden shadow-inner">
              <div className={`h-full ${outcome.confidence === 'high' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-amber-500'} w-3/4 animate-pulse`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
