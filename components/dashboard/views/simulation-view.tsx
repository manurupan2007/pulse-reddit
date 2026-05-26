"use client";

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
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 text-foreground">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-fuchsia-500">Simulation Lab</div>
          <h1 className="text-4xl font-extrabold tracking-tight">Outcome Forecasting</h1>
        </div>
        <button
          onClick={resetScenario}
          className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg text-xs font-bold border border-border transition-all"
        >
          Reset Lab
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <SectionCard title="Intervention controls" description="Apply moderation vectors to forecast community impact.">
            <SimulatorPanel actions={actions} state={runtime.scenario} onToggle={toggleAction} outcome={outcome} />
          </SectionCard>
          <SectionCard title="Impact Timeline" description="Projected shifts across the next 72 hours.">
            <ForecastTimeline forecast={twin.forecast} />
          </SectionCard>
        </div>
        <div className="space-y-8">
          <SectionCard title="Heuristic Explanation" description="Reasoning engine output.">
            <div className="space-y-4">
              {outcome.explanation.map((line, i) => (
                <div key={i} className="text-sm text-muted-foreground leading-relaxed p-4 rounded-lg bg-card/50 border border-border text-foreground">
                  {line}
                </div>
              ))}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 italic text-sm text-foreground text-center">
                &quot;{outcome.narrative}&quot;
              </div>
            </div>
          </SectionCard>
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
              <span>Confidence</span>
              <span className={outcome.confidence === 'high' ? 'text-emerald-500' : 'text-amber-500'}>{outcome.confidence}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${outcome.confidence === 'high' ? 'bg-emerald-500' : 'bg-amber-500'} w-3/4 animate-pulse`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
