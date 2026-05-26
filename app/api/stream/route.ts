import { NextRequest } from "next/server";

import { getRuntimeState } from "@/devvit/events/pulse-event-store";
import { DataMode } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const subreddit = request.nextUrl.searchParams.get("subreddit") ?? "r/politics";
  const mode = (request.nextUrl.searchParams.get("mode") as DataMode | null) ?? "live";

  const encoder = new TextEncoder();
  let tick = 0;
  let interval: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      // Initialize with the current count
      let lastEventCount = getRuntimeState(subreddit).events.length;

      const send = () => {
        const state = getRuntimeState(subreddit);
        const currentCount = state.events.length;
        
        let cue = "ambient";
        if (currentCount > lastEventCount) {
          const newestEvent = state.events[0];
          cue = newestEvent && newestEvent.severity === "high" ? "risk-spike" : "story-advance";
          lastEventCount = currentCount;
        }

        tick += 1;
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              tick,
              mode,
              subreddit,
              cue,
              eventCount: currentCount
            })}\n\n`
          )
        );
      };

      send();
      // Poll the store every 1.5 seconds in live mode for fast UI updates, else 5 seconds
      interval = setInterval(send, mode === "live" ? 1500 : 5000);
    },
    cancel() {
      if (interval) {
        clearInterval(interval);
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
