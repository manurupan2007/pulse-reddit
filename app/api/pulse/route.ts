import { NextRequest, NextResponse } from "next/server";

import { routeDevvitEvent } from "@/devvit/events/event-router";
import { buildCommunityTwin } from "@/lib/pulse-engine";
import { DataMode } from "@/lib/types";

export async function GET(request: NextRequest) {
  const subreddit = request.nextUrl.searchParams.get("subreddit") ?? undefined;
  const mode = (request.nextUrl.searchParams.get("mode") as DataMode | null) ?? "simulated";
  const tick = Number(request.nextUrl.searchParams.get("tick") ?? 0);

  return NextResponse.json(
    buildCommunityTwin({
      subreddit,
      mode,
      tick
    })
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mode = (request.nextUrl.searchParams.get("mode") as DataMode | null) ?? "live";

    // Route and store the event in the runtime store
    const updatedState = routeDevvitEvent(body, mode);

    return NextResponse.json({
      success: true,
      message: "Event processed successfully",
      state: updatedState
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Invalid webhook payload"
      },
      { status: 400 }
    );
  }
}
