import { buildForecastPreview, buildRuntimePayload, simulateScenario } from "@/lib/pulse-engine";
import { DataMode, PulseRuntimePayload, ScenarioState } from "@/lib/types";

export type AdapterRequest = {
  subreddit: string;
  mode: DataMode;
  tick: number;
  scenario: Partial<ScenarioState>;
};

export type PulseAdapter = {
  id: DataMode;
  label: string;
  description: string;
  loadRuntime: (request: AdapterRequest) => Promise<PulseRuntimePayload>;
};

const adapters: Record<DataMode, PulseAdapter> = {
  simulated: {
    id: "simulated",
    label: "Simulated mode",
    description: "Scripted subreddit twin with deterministic event pressure and demo-safe behavior.",
    async loadRuntime(request) {
      return buildRuntimePayload({
        subreddit: request.subreddit,
        mode: "simulated",
        tick: request.tick,
        state: request.scenario
      });
    }
  },
  live: {
    id: "live",
    label: "Live subreddit mode",
    description: "Devvit-style rolling signal ingestion with live-ish event pressure and subreddit install metadata.",
    async loadRuntime(request) {
      return buildRuntimePayload({
        subreddit: request.subreddit,
        mode: "live",
        tick: request.tick,
        state: request.scenario
      });
    }
  }
};

export function getPulseAdapter(mode: DataMode) {
  return adapters[mode];
}

export function listPulseAdapters() {
  return Object.values(adapters);
}

export async function loadPulseRuntime(request: AdapterRequest) {
  return getPulseAdapter(request.mode).loadRuntime(request);
}

export async function runScenarioPreview(request: AdapterRequest) {
  return {
    outcome: simulateScenario({
      subreddit: request.subreddit,
      mode: request.mode,
      tick: request.tick,
      state: request.scenario
    }),
    forecast: buildForecastPreview({
      subreddit: request.subreddit,
      mode: request.mode,
      tick: request.tick,
      state: request.scenario
    })
  };
}
