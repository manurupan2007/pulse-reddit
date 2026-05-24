import { NextRequest, NextResponse } from "next/server";

import { buildForecastPreview, simulateScenario } from "@/lib/pulse-engine";
import { DataMode, ScenarioState } from "@/lib/types";

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

  return NextResponse.json({
    outcome: simulateScenario({
      subreddit,
      mode,
      tick,
      state: actions
    }),
    forecast: buildForecastPreview({
      subreddit,
      mode,
      tick,
      state: actions
    })
  });
}
