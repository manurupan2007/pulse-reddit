import { NextRequest, NextResponse } from "next/server";

import { loadPulseRuntime } from "@/lib/pulse-adapters";
import { DataMode, ScenarioState } from "@/lib/types";

export async function GET(request: NextRequest) {
  const subreddit = request.nextUrl.searchParams.get("subreddit") ?? "r/politics";
  const mode = (request.nextUrl.searchParams.get("mode") as DataMode | null) ?? "simulated";
  const tick = Number(request.nextUrl.searchParams.get("tick") ?? 0);
  const scenario = request.nextUrl.searchParams.get("scenario");

  const parsedScenario = scenario
    ? (JSON.parse(scenario) as Partial<ScenarioState>)
    : {};

  return NextResponse.json(
    await loadPulseRuntime({
      subreddit,
      mode,
      tick,
      scenario: parsedScenario
    })
  );
}
