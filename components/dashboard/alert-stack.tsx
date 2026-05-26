import { memo } from "react";
import { ShieldAlert, Siren, Sparkles, AlertCircle } from "lucide-react";

import { Alert } from "@/types";

type AlertStackProps = {
  alerts: Alert[];
};

const iconMap = {
  info: Sparkles,
  watch: AlertCircle,
  warning: Siren
};

const toneMap = {
  info: "text-sky-500 bg-sky-500/10 border-sky-500/20",
  watch: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  warning: "text-red-500 bg-red-500/10 border-red-500/20"
};

export const AlertStack = memo(function AlertStack({ alerts }: AlertStackProps) {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const Icon = iconMap[alert.level];

        return (
          <div
            key={alert.id}
            className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card/40 transition-colors hover:bg-card/60"
          >
            <div className={`shrink-0 rounded-md border p-2 ${toneMap[alert.level]}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-foreground">{alert.title}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded border border-border">
                  {alert.horizon} Horizon
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{alert.detail}</p>
              <div className="pt-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Metric: <span className="text-foreground">{alert.metric}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
