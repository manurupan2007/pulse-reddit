"use client";

import { Switch } from "@/components/ui/switch";

import { ScenarioAction, ScenarioOutcome, ScenarioState } from "@/types";

type SimulatorPanelProps = {
  actions: ScenarioAction[];
  state: ScenarioState;
  onToggle: (key: ScenarioAction["key"]) => void;
  outcome: ScenarioOutcome;
};

export function SimulatorPanel({
  actions,
  state,
  onToggle,
  outcome
}: SimulatorPanelProps) {
  const stats = [
    {
      label: "Engagement",
      value: `${outcome.engagementChange > 0 ? "+" : ""}${outcome.engagementChange}%`,
      tone: outcome.engagementChange >= 0 ? "text-emerald-500" : "text-amber-500"
    },
    {
      label: "Toxicity Reduction",
      value: `-${outcome.toxicityReduction}%`,
      tone: "text-red-500"
    },
    {
      label: "Backlash Prob.",
      value: `${outcome.backlashProbability}%`,
      tone: outcome.backlashProbability > 45 ? "text-red-500" : "text-emerald-500"
    },
    {
      label: "Workload Shift",
      value: `${outcome.moderatorLoadChange > 0 ? "+" : ""}${outcome.moderatorLoadChange}%`,
      tone: outcome.moderatorLoadChange <= 0 ? "text-emerald-500" : "text-red-500"
    },
    {
      label: "Retention",
      value: `${outcome.retentionImpact > 0 ? "+" : ""}${outcome.retentionImpact}%`,
      tone: outcome.retentionImpact >= 0 ? "text-emerald-500" : "text-amber-500"
    },
    {
      label: "Quality Score",
      value: `${outcome.discussionQualityForecast}`,
      tone: "text-emerald-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <label
            key={action.key}
            className="flex cursor-pointer items-start justify-between gap-4 p-4 rounded-xl border border-border bg-card/40 transition-colors hover:bg-card/60"
          >
            <div className="space-y-1">
              <div className="text-sm font-bold tracking-tight">{action.label}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{action.description}</div>
            </div>
            <Switch checked={state[action.key]} onCheckedChange={() => onToggle(action.key)} />
          </label>
        ))}
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-muted/10 p-3 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
            <div className={`text-xl font-black tabular-nums ${stat.tone}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-primary/10 bg-primary/5 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
            &quot;{outcome.narrative}&quot;
          </p>
          <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            {outcome.confidence} confidence
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {outcome.explanation.map((line) => (
          <div key={line} className="rounded-lg border border-border bg-muted/5 p-4 text-xs text-muted-foreground leading-relaxed flex items-center gap-3">
             <div className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
             {line}
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {outcome.shifts.map((shift) => (
          <div key={shift.label} className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{shift.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-black tabular-nums tracking-tight">{shift.after}</div>
              <div className={`text-xs font-bold tabular-nums ${shift.delta <= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {shift.delta > 0 ? "+" : ""}
                {shift.delta}
              </div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted/20">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  shift.delta <= 0 ? "bg-emerald-500" : "bg-red-500"
                }`}
                style={{ width: `${Math.max(5, Math.min(100, shift.after))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
