export type DevvitModerationEvent = {
  subreddit: string;
  action: string;
  createdAt: string;
  moderator: string;
  metadata: Record<string, string | number | boolean>;
};

export type RedditTwinSnapshot = {
  subreddit: string;
  source: "mock" | "reddit-api" | "devvit-event-stream";
  capturedAt: string;
};

export async function collectRedditTwinSnapshot(
  subreddit: string
): Promise<RedditTwinSnapshot> {
  return {
    subreddit,
    source: "mock",
    capturedAt: new Date().toISOString()
  };
}

export async function ingestModerationEvent(
  event: DevvitModerationEvent
): Promise<{ accepted: boolean; mirroredAt: string }> {
  return {
    accepted: Boolean(event.subreddit && event.action),
    mirroredAt: new Date().toISOString()
  };
}
