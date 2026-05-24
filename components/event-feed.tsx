import { BellRing, Lock, ShieldBan, Sparkles, TriangleAlert } from "lucide-react";

import { CommunityEvent } from "@/lib/types";

type EventFeedProps = {
  events: CommunityEvent[];
};

const iconMap: Record<CommunityEvent["type"], React.ReactNode> = {
  app_install: <Sparkles className="h-4 w-4 text-accent" />,
  automod_filter: <ShieldBan className="h-4 w-4 text-magenta" />,
  comment_report: <TriangleAlert className="h-4 w-4 text-danger" />,
  comment_submit: <BellRing className="h-4 w-4 text-cyan" />,
  mod_action: <ShieldBan className="h-4 w-4 text-lime" />,
  post_report: <TriangleAlert className="h-4 w-4 text-danger" />,
  post_submit: <BellRing className="h-4 w-4 text-accent" />,
  settings_update: <Sparkles className="h-4 w-4 text-amber" />,
  thread_lock: <Lock className="h-4 w-4 text-cyan" />
};

export function EventFeed({ events }: EventFeedProps) {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              {iconMap[event.type]}
              {event.title}
            </div>
            <div className="text-xs uppercase tracking-[0.24em] text-muted">{event.at}</div>
          </div>
          <div className="mt-2 text-sm leading-6 text-muted">{event.detail}</div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-muted">
              {event.threadLabel}
            </span>
            {event.tags.map((tag) => (
              <span
                key={`${event.id}-${tag}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-muted"
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
