import { appendRuntimeEvent, markRuntimeMode } from "@/devvit/events/pulse-event-store";
import { CommunityEvent, DataMode } from "@/types";

type RawDevvitEvent = Record<string, unknown> & {
  subreddit?: string;
  action?: string;
  postId?: string;
  commentId?: string;
  type?: string;
};

function normalizeType(type?: string): CommunityEvent["type"] {
  switch (type) {
    case "AppInstall":
      return "app_install";
    case "PostSubmit":
    case "PostCreate":
      return "post_submit";
    case "CommentSubmit":
    case "CommentCreate":
      return "comment_submit";
    case "CommentReport":
    case "PostReport":
      return "comment_report";
    case "AutomoderatorFilterPost":
    case "AutomoderatorFilterComment":
      return "automod_filter";
    case "ModAction":
      return "mod_action";
    default:
      return "settings_update";
  }
}

export function routeDevvitEvent(event: RawDevvitEvent, mode: DataMode = "live") {
  const subreddit = String(event.subreddit ?? "r/politics");
  const type = normalizeType(event.type);

  if (type === "app_install") {
    markRuntimeMode(subreddit, mode);
  }

  return appendRuntimeEvent(subreddit, mode, {
    id: `${type}-${Date.now()}`,
    type,
    at: "just now",
    title: String(event.action ?? event.type ?? "Pulse event"),
    detail: `Pulse normalized a ${type} trigger for ${subreddit}.`,
    severity: type === "comment_report" || type === "mod_action" ? "high" : "medium",
    actor: "devvit-trigger",
    threadLabel: String(event.postId ?? event.commentId ?? "subreddit scope"),
    weight: type === "comment_report" ? 12 : 7,
    tags: [type, "devvit"]
  });
}
