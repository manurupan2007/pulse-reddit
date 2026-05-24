import { CommunityEvent, DataMode } from "@/lib/types";

type SubredditRuntimeState = {
  subreddit: string;
  mode: DataMode;
  lastSync: string;
  events: CommunityEvent[];
};

const runtimeStore = new Map<string, SubredditRuntimeState>();

export function getRuntimeState(subreddit: string): SubredditRuntimeState {
  return (
    runtimeStore.get(subreddit) ?? {
      subreddit,
      mode: "simulated",
      lastSync: new Date().toISOString(),
      events: []
    }
  );
}

export function appendRuntimeEvent(subreddit: string, mode: DataMode, event: CommunityEvent) {
  const current = getRuntimeState(subreddit);
  const next: SubredditRuntimeState = {
    subreddit,
    mode,
    lastSync: new Date().toISOString(),
    events: [event, ...current.events].slice(0, 40)
  };

  runtimeStore.set(subreddit, next);
  return next;
}

export function markRuntimeMode(subreddit: string, mode: DataMode) {
  const current = getRuntimeState(subreddit);
  runtimeStore.set(subreddit, {
    ...current,
    mode,
    lastSync: new Date().toISOString()
  });
}
