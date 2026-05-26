import { BellRing, Lock, ShieldBan, Sparkles, TriangleAlert, Activity, Settings } from "lucide-react";

import { CommunityEvent } from "@/lib/types";

type EventFeedProps = {
  events: CommunityEvent[];
};

const iconMap: Record<CommunityEvent["type"], React.ReactNode> = {
  app_install: <Sparkles className="h-4 w-4 text-sky-500" />,
  automod_filter: <ShieldBan className="h-4 w-4 text-fuchsia-500" />,
  comment_report: <TriangleAlert className="h-4 w-4 text-red-500" />,
  comment_submit: <BellRing className="h-4 w-4 text-sky-500" />,
  mod_action: <Activity className="h-4 w-4 text-emerald-500" />,
  post_report: <TriangleAlert className="h-4 w-4 text-red-500" />,
  post_submit: <BellRing className="h-4 w-4 text-sky-500" />,
  settings_update: <Settings className="h-4 w-4 text-amber-500" />,
  thread_lock: <Lock className="h-4 w-4 text-sky-500" />
};

export function EventFeed({ events }: EventFeedProps) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="rounded-lg border border-border bg-card/40 p-4 transition-colors hover:bg-card/60"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold tracking-tight">
              {iconMap[event.type]}
              {event.title}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{event.at}</div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{event.detail}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-border bg-muted/20 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              {event.threadLabel}
            </span>
            {event.tags.map((tag) => (
              <span
                key={`${event.id}-${tag}`}
                className="rounded-md border border-border bg-muted/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
