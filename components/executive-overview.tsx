import { AlertTriangle, Gauge, ShieldCheck } from "lucide-react";

import { Alert, ExecutiveMetric } from "@/lib/types";

type ExecutiveOverviewProps = {
  metrics: ExecutiveMetric[];
  risks: Alert[];
};

const toneMap = {
  accent: "from-accent/30 to-cyan/10 text-accent",
  cyan: "from-cyan/30 to-accent/10 text-cyan",
  magenta: "from-magenta/30 to-magenta/10 text-magenta",
  lime: "from-lime/30 to-lime/10 text-lime",
  amber: "from-amber/30 to-amber/10 text-amber",
  danger: "from-danger/30 to-danger/10 text-danger"
};

export function ExecutiveOverview({ metrics, risks }: ExecutiveOverviewProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.24em] text-muted">{metric.label}</div>
              <div className={`rounded-full bg-gradient-to-br px-3 py-1 text-xs ${toneMap[metric.tone]}`}>
                live
              </div>
            </div>
            <div className="font-display text-3xl text-white">{metric.value}</div>
            <div className="mt-3 text-sm leading-6 text-muted">{metric.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3">
        <div className="rounded-2xl border border-accent/15 bg-accent/10 p-4">
          <div className="flex items-center gap-2 text-sm text-accent">
            <ShieldCheck className="h-4 w-4" />
            Today&apos;s Risks
          </div>
          <p className="mt-3 text-sm leading-6 text-[#d6ebff]">
            Pulse converts signal drift into operator-grade risk calls so moderators can act
            earlier than the report queue.
          </p>
        </div>

        {risks.map((risk) => (
          <div
            key={risk.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                {risk.level === "warning" ? (
                  <AlertTriangle className="h-4 w-4 text-danger" />
                ) : (
                  <Gauge className="h-4 w-4 text-amber" />
                )}
                {risk.title}
              </div>
              <div className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-muted">
                {risk.horizon}
              </div>
            </div>
            <div className="text-sm leading-6 text-muted">{risk.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
