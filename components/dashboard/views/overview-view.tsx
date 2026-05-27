"use client";

import { ArrowRight, ChevronRight, BarChart3, Clock, AlertCircle } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import { CascadeView } from "@/components/dashboard/cascade-view";
import { AlertStack } from "@/components/dashboard/alert-stack";
import { CommunityTwin, ScenarioOutcome, DashboardView } from "@/types";

type OverviewPageProps = {
  subreddit: string;
  twin: CommunityTwin;
  outcome: ScenarioOutcome;
  setView: (view: DashboardView) => void;
};

export function OverviewPage({ subreddit, twin, outcome, setView }: OverviewPageProps) {
  if (!twin || !outcome || !twin.scores) {
    return (
      <div className="flex h-96 items-center justify-center border-2 border-dashed border-border/40 rounded-3xl bg-muted/5 animate-pulse">
        <div className="text-center space-y-4">
          <div className="text-primary text-xs font-black uppercase tracking-[0.4em]">Signal Interrupted</div>
          <p className="text-muted-foreground text-sm font-medium">Re-establishing link to community heuristics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 text-foreground pb-12">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/40 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Executive Briefing</div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-balance">
            {subreddit} <span className="text-muted-foreground font-light italic">Status</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block space-y-1">
            <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Health Index</div>
            <div className="text-3xl font-black tabular-nums">{twin.scores.healthIndex}%</div>
          </div>
          <div className="h-14 w-[1px] bg-border/60 mx-2 hidden sm:block" />
          <button 
            onClick={() => setView("cascade")}
            className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-black shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all group"
          >
            Launch Cascade Analysis
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Resilience" value={twin.scores.stability} tone="accent" detail="Community capability to absorb sudden report spikes." />
        <MetricCard label="Tension" value={twin.scores.conflictPressure} tone="danger" detail="Calculated probability of meta-thread escalation." />
        <MetricCard label="Operational Load" value={twin.scores.moderatorLoad} tone="amber" detail="Projected queue depth vs current staffing levels." />
        <MetricCard label="Signal Depth" value={twin.scores.discussionQuality} tone="lime" detail="Weighted civility and substantive response metrics." />
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-10 lg:grid-cols-3">
        {/* Cascade Preview */}
        <div className="lg:col-span-2 flex">
          <SectionCard
            title="Conflict Propagation Preview"
            description="Real-time heuristic mapping of tension movement across thread clusters."
            className="bg-card/20 backdrop-blur-sm border-primary/10 flex-1"
          >
            <div className="flex flex-col pt-4 h-full">
              <div className="flex-1 min-h-[300px]">
                <CascadeView outcome={outcome} mode="preview" />
              </div>
              <div className="pt-8 mt-6 border-t border-border/40 flex justify-center shrink-0">
                <button 
                  onClick={() => setView("cascade")}
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 hover:underline group"
                >
                  Enter Full Screen Tactical Mode <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar Intel */}
        <div className="flex flex-col gap-10">
          <SectionCard 
            title="High Priority Risks" 
            description="Immediate horizon (0-6h)."
            rightSlot={<AlertCircle className="h-4 w-4 text-danger opacity-60" />}
          >
            <div className="pt-2">
              <AlertStack alerts={twin.alerts.slice(0, 2)} />
            </div>
          </SectionCard>

          <SectionCard 
            title="Forecast Trajectory" 
            description="Operational projections."
            rightSlot={<BarChart3 className="h-4 w-4 text-muted-foreground opacity-60" />}
          >
            <div className="space-y-4 pt-2">
              {twin.forecast.slice(0, 3).map((f) => (
                <div key={f.label} className="group flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/40 hover:bg-muted/40 hover:border-primary/20 transition-all cursor-default">
                  <div className="flex items-center gap-3">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-black uppercase tracking-wider">{f.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[9px] uppercase text-muted-foreground font-bold tracking-widest">Tension</div>
                      <div className={`text-sm font-black tabular-nums ${f.conflict > 70 ? 'text-red-500' : 'text-emerald-500'}`}>{f.conflict}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
