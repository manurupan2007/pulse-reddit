"use client";

import { Switch } from "./switch";

import { ScenarioAction, ScenarioOutcome, ScenarioState } from "@/lib/types";

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
      label: "Engagement change",
      value: `${outcome.engagementChange > 0 ? "+" : ""}${outcome.engagementChange}%`,
      tone: outcome.engagementChange >= 0 ? "text-accent" : "text-amber"
    },
    {
      label: "Toxicity reduction",
      value: `-${outcome.toxicityReduction}%`,
      tone: "text-lime"
    },
    {
      label: "Backlash probability",
      value: `${outcome.backlashProbability}%`,
      tone: outcome.backlashProbability > 45 ? "text-danger" : "text-cyan"
    },
    {
      label: "Moderator load",
      value: `${outcome.moderatorLoadChange > 0 ? "+" : ""}${outcome.moderatorLoadChange}%`,
      tone: outcome.moderatorLoadChange <= 0 ? "text-accent" : "text-danger"
    },
    {
      label: "Sentiment trajectory",
      value: `${outcome.sentimentTrajectory > 0 ? "+" : ""}${outcome.sentimentTrajectory}%`,
      tone: outcome.sentimentTrajectory >= 0 ? "text-lime" : "text-danger"
    },
    {
      label: "Retention impact",
      value: `${outcome.retentionImpact > 0 ? "+" : ""}${outcome.retentionImpact}%`,
      tone: outcome.retentionImpact >= 0 ? "text-accent" : "text-amber"
    },
    {
      label: "Quality forecast",
      value: `${outcome.discussionQualityForecast}`,
      tone: "text-lime"
    }
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-3">
        {actions.map((action) => (
          <label
            key={action.key}
            className="glass-panel rounded-2xl flex cursor-pointer items-start justify-between gap-4 p-4 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div>
              <div className="text-sm font-semibold text-white">{action.label}</div>
              <div className="mt-1 text-sm leading-6 text-muted">{action.description}</div>
            </div>
            <Switch checked={state[action.key]} onCheckedChange={() => onToggle(action.key)} />
          </label>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-[0.26em] text-muted">{stat.label}</div>
            <div className={`mt-3 font-display text-2xl ${stat.tone}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-accent/15 bg-accent/10 p-4 text-sm leading-7 text-[#d2eaff]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>{outcome.narrative}</span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-accent">
            {outcome.confidence} confidence
          </span>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {outcome.explanation.map((line) => (
          <div key={line} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-muted">
            {line}
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {outcome.shifts.map((shift) => (
          <div key={shift.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-muted">{shift.label}</div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="font-display text-2xl text-white">{shift.after}</div>
              <div className={shift.delta <= 0 ? "text-accent" : "text-danger"}>
                {shift.delta > 0 ? "+" : ""}
                {shift.delta}
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full ${
                  shift.delta <= 0
                    ? "bg-gradient-to-r from-accent to-cyan"
                    : "bg-gradient-to-r from-amber to-danger"
                }`}
                style={{ width: `${Math.max(8, Math.min(100, shift.after))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
