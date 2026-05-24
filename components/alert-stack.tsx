import { ShieldAlert, Siren, Sparkles } from "lucide-react";

import { Alert } from "@/lib/types";

type AlertStackProps = {
  alerts: Alert[];
};

const iconMap = {
  info: Sparkles,
  watch: ShieldAlert,
  warning: Siren
};

const toneMap = {
  info: "text-cyan",
  watch: "text-amber",
  warning: "text-danger"
};

export function AlertStack({ alerts }: AlertStackProps) {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const Icon = iconMap[alert.level];

        return (
          <div
            key={alert.id}
            className="glass-panel rounded-2xl flex items-start gap-3 p-3 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className={`mt-0.5 rounded-xl border border-white/10 p-2 ${toneMap[alert.level]}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{alert.title}</div>
              <div className="mt-1 text-sm leading-6 text-muted">{alert.detail}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
