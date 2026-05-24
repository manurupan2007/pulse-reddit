import { DatabaseZap, RadioTower, Settings2, ShieldCheck } from "lucide-react";

import { CommunityEvent, DevvitStatus, ModeratorWorkflow } from "@/lib/types";

type DevvitOpsPanelProps = {
  devvit: DevvitStatus;
  workflows: ModeratorWorkflow[];
  events: CommunityEvent[];
};

export function DevvitOpsPanel({ devvit, workflows, events }: DevvitOpsPanelProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
      <div className="grid gap-3">
        <div className="grid gap-3 md:grid-cols-2">
          <StatusTile
            icon={<RadioTower className="h-4 w-4 text-accent" />}
            label="Signal mode"
            value={devvit.mode === "live" ? "Live subreddit mode" : "Simulated mode"}
            detail={`Last sync ${devvit.lastSync}`}
          />
          <StatusTile
            icon={<DatabaseZap className="h-4 w-4 text-cyan" />}
            label="Storage"
            value={devvit.redisBacked ? "Redis-backed rolling state" : "Ephemeral"}
            detail="Devvit event summaries retained for rolling pressure analysis."
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldCheck className="h-4 w-4 text-lime" />
            Installation and permission flow
          </div>
          <div className="grid gap-3">
            {devvit.installSteps.map((step) => (
              <div
                key={step.id}
                className="rounded-2xl border border-white/10 bg-[#081224]/80 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{step.label}</div>
                  <div
                    className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.24em] ${
                      step.status === "done"
                        ? "bg-lime/15 text-lime"
                        : step.status === "active"
                          ? "bg-accent/15 text-accent"
                          : "bg-white/5 text-muted"
                    }`}
                  >
                    {step.status}
                  </div>
                </div>
                <div className="mt-2 text-sm leading-6 text-muted">{step.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <Settings2 className="h-4 w-4 text-magenta" />
            Installation settings
          </div>
          <div className="grid gap-3">
            {devvit.settings.map((setting) => (
              <div
                key={setting.key}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#081224]/80 p-3"
              >
                <div>
                  <div className="text-sm font-semibold text-white">{setting.label}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.24em] text-muted">
                    {setting.type}
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-white">
                  {setting.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 text-sm font-semibold text-white">Moderator workflow health</div>
          <div className="grid gap-3">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="rounded-2xl border border-white/10 bg-[#081224]/80 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{workflow.label}</div>
                    <div className="mt-1 text-sm text-muted">Owner {workflow.owner}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl text-white">{workflow.queueDepth}</div>
                    <div className="text-xs uppercase tracking-[0.24em] text-muted">
                      {workflow.etaMinutes}m ETA
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 text-sm font-semibold text-white">Ingestion event stream</div>
          <div className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="rounded-2xl border border-white/10 bg-[#081224]/80 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{event.title}</div>
                  <div className="text-xs uppercase tracking-[0.24em] text-muted">{event.at}</div>
                </div>
                <div className="mt-2 text-sm leading-6 text-muted">{event.detail}</div>
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </div>
      <div className="font-display text-xl text-white">{value}</div>
      <div className="mt-2 text-sm leading-6 text-muted">{detail}</div>
    </div>
  );
}
