import { NextRequest, NextResponse } from "next/server";

import { buildRuntimePayload } from "@/lib/core/engine";
import { DataMode, ScenarioState } from "@/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    subreddit?: string;
    actions?: Partial<ScenarioState>;
    mode?: DataMode;
    tick?: number;
  };

  const subreddit = body.subreddit ?? "r/politics";
  const actions = body.actions ?? {};
  const mode = body.mode ?? "simulated";
  const tick = body.tick ?? 0;

  const payload = buildRuntimePayload({
    subreddit,
    mode,
    tick,
    state: actions
  });

  return NextResponse.json({
    outcome: payload.outcome,
    forecast: payload.twin.forecast
  });
}
