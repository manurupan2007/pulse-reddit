import { Devvit } from "@devvit/public-api";

export function registerCommunityTriggers() {
  const events = [
    "AppInstall",
    "PostSubmit",
    "CommentSubmit",
    "CommentReport",
    "PostReport",
    "ModAction",
    "AutomoderatorFilterPost",
    "AutomoderatorFilterComment"
  ];

  for (const eventName of events) {
    Devvit.addTrigger({
      event: eventName,
      async onEvent(event, context) {
        try {
          const liveSyncEnabled = await context.settings.get("live-sync-enabled");
          if (!liveSyncEnabled) {
            return;
          }

          const baseUrl = await context.settings.get("pulse-dashboard-url");
          if (!baseUrl) {
            return;
          }

          const secret = await context.settings.get("pulse-webhook-secret");
          const targetUrl = `${String(baseUrl).replace(/\/$/, "")}/api/pulse`;

          const payload = {
            type: eventName,
            subreddit: event.subreddit?.name ?? "r/politics",
            postId: event.post?.id,
            commentId: event.comment?.id,
            actor: event.author?.name ?? "devvit-trigger",
            action: (event as Record<string, unknown>).action ?? eventName
          };

          const headers: Record<string, string> = {
            "Content-Type": "application/json"
          };
          if (secret) {
            headers["Authorization"] = `Bearer ${secret}`;
          }

          // Use Devvit HTTP fetch (standard fetch global is populated)
          await fetch(targetUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(payload)
          });
        } catch (error) {
          console.error(`Pulse failed to forward event ${eventName} to webhook:`, error);
        }
      }
    });
  }
}
