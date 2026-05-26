import { DatabaseZap, RadioTower, Settings2, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

import { CommunityEvent, DevvitStatus, ModeratorWorkflow } from "@/types";

type DevvitOpsPanelProps = {
  devvit: DevvitStatus;
  workflows: ModeratorWorkflow[];
  events: CommunityEvent[];
};

export function DevvitOpsPanel({ devvit, workflows, events }: DevvitOpsPanelProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatusTile
            icon={<RadioTower className="h-4 w-4 text-sky-500" />}
            label="Signal Mode"
            value={devvit.mode === "live" ? "Live Stream" : "Simulated"}
            detail={`Last sync: ${devvit.lastSync}`}
          />
          <StatusTile
            icon={<DatabaseZap className="h-4 w-4 text-sky-500" />}
            label="Storage Layer"
            value={devvit.redisBacked ? "Redis-Backed" : "Ephemeral"}
            detail="Rolling event state is synchronized for heuristic analysis."
          />
        </div>

        <div className="rounded-xl border border-border bg-card/40 p-5 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Deployment Pipeline
          </div>
          <div className="grid gap-3">
            {devvit.installSteps.map((step) => (
              <div
                key={step.id}
                className="rounded-lg border border-border bg-muted/20 p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold tracking-tight">{step.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${
                      step.status === "done"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : step.status === "active"
                          ? "bg-sky-500/10 text-sky-500 border-sky-500/20"
                          : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-border bg-card/40 p-5 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Settings2 className="h-4 w-4 text-fuchsia-500" />
            Active Configuration
          </div>
          <div className="grid gap-2">
            {devvit.settings.map((setting) => (
              <div
                key={setting.key}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold tracking-tight">{setting.label}</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    {setting.type}
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-foreground px-2 py-1 rounded bg-background border border-border">
                  {setting.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/40 p-5 space-y-5">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Moderator Workflows</div>
          <div className="grid gap-3">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="rounded-lg border border-border bg-muted/20 p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-bold tracking-tight">{workflow.label}</div>
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Owner: {workflow.owner}</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-xl font-black tabular-nums">{workflow.queueDepth}</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-end gap-1">
                    <Clock className="h-3 w-3" />
                    {workflow.etaMinutes}m ETA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusTile({
  icon,
  label,
  value,
  detail
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-5 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-xl font-black tracking-tight">{value}</div>
      <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
    </div>
  );
}
