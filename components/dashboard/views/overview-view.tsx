"use client";

import { ArrowRight, ChevronRight } from "lucide-react";
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
  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-foreground">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Executive Briefing</div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-balance">
            {subreddit} <span className="text-muted-foreground font-light">Status Report</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Health Index</div>
            <div className="text-2xl font-black">{twin.scores.healthIndex}%</div>
          </div>
          <div className="h-12 w-[1px] bg-border mx-2 hidden sm:block" />
          <button 
            onClick={() => setView("cascade")}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:brightness-110 transition-all"
          >
            Analyze Cascade
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Stability" value={twin.scores.stability} tone="accent" detail="Current resilience score." />
        <MetricCard label="Conflict" value={twin.scores.conflictPressure} tone="danger" detail="Escalation potential." />
        <MetricCard label="Mod Load" value={twin.scores.moderatorLoad} tone="amber" detail="Projected queue strain." />
        <MetricCard label="Quality" value={twin.scores.discussionQuality} tone="lime" detail="Civility and depth." />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard
            title="Strategic Preview"
            description="High-fidelity model of emerging tension propagation."
          >
            <div className="h-[400px] flex flex-col">
              <div className="flex-1">
                <CascadeView outcome={outcome} />
              </div>
              <div className="pt-6 mt-6 border-t border-border flex justify-center">
                <button 
                  onClick={() => setView("cascade")}
                  className="text-xs font-bold text-primary flex items-center gap-2 hover:underline"
                >
                  Open Full Screen Propagation Analysis <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
        <div className="space-y-8">
          <SectionCard title="Urgent Risks" description="Next 6 hour horizon.">
            <AlertStack alerts={twin.alerts.slice(0, 2)} />
          </SectionCard>
          <SectionCard title="Forecast" description="Subreddit trajectory.">
            <div className="space-y-4">
              {twin.forecast.slice(0, 3).map((f) => (
                <div key={f.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                  <span className="text-xs font-bold">{f.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold">Conflict:</span>
                    <span className={`text-sm font-black ${f.conflict > 70 ? 'text-red-500' : 'text-emerald-500'}`}>{f.conflict}%</span>
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
