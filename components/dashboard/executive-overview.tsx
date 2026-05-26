import { AlertTriangle, Gauge, ShieldCheck, Activity } from "lucide-react";

import { Alert, ExecutiveMetric } from "@/types";

type ExecutiveOverviewProps = {
  metrics: ExecutiveMetric[];
  risks: Alert[];
};

const toneMap = {
  accent: "text-sky-500 border-sky-500/20 bg-sky-500/5",
  cyan: "text-cyan-500 border-cyan-500/20 bg-cyan-500/5",
  magenta: "text-fuchsia-500 border-fuchsia-500/20 bg-fuchsia-500/5",
  lime: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
  amber: "text-amber-500 border-amber-500/20 bg-amber-500/5",
  danger: "text-red-500 border-red-500/20 bg-red-500/5"
};

export function ExecutiveOverview({ metrics, risks }: ExecutiveOverviewProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-border bg-card/40 p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{metric.label}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${toneMap[metric.tone]}`}>
                Live
              </span>
            </div>
            <div className="text-3xl font-black tabular-nums tracking-tight">{metric.value}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">{metric.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <ShieldCheck className="h-4 w-4" />
            Operational Risk Radar
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Pulse prioritizes emerging risks by cross-referencing signal velocity with historical patterns, allowing you to intercept conflict before the manual report queue spikes.
          </p>
        </div>

        {risks.map((risk) => (
          <div
            key={risk.id}
            className="rounded-xl border border-border bg-card/40 p-5 transition-colors hover:bg-card/60"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-bold tracking-tight">
                {risk.level === "warning" ? (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                ) : (
                  <Activity className="h-4 w-4 text-amber-500" />
                )}
                {risk.title}
              </div>
              <span className="rounded-md border border-border bg-muted/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                {risk.horizon}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{risk.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
