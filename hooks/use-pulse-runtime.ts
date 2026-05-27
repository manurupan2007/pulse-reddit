"use client";

import { startTransition, useEffect, useState } from "react";

import { defaultScenarioState, listPresetSubreddits } from "@/lib/core/engine";
import { ActionKey, DataMode, PulseRuntimePayload, ScenarioState, DashboardView } from "@/types";

type RuntimeState = {
  payload: PulseRuntimePayload | null;
  loading: boolean;
  error: string | null;
  mode: DataMode;
  view: DashboardView;
  tick: number;
  visualTick: number;
  subreddit: string;
  scenario: ScenarioState;
  soundCue: string | null;
  transport: "polling" | "stream";
};

async function fetchRuntimePayload(
  subreddit: string,
  mode: DataMode,
  tick: number,
  scenario: ScenarioState
) {
  const params = new URLSearchParams({
    subreddit,
    mode,
    tick: String(tick),
    scenario: JSON.stringify(scenario)
  });

  const response = await fetch(`/api/runtime?${params.toString()}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Runtime request failed with ${response.status}`);
  }

  return (await response.json()) as PulseRuntimePayload;
}

export function usePulseRuntime() {
  const presetOptions = listPresetSubreddits();
  const [state, setState] = useState<RuntimeState>({
    payload: null,
    loading: true,
    error: null,
    mode: "simulated",
    view: "overview",
    tick: 0,
    visualTick: 0,
    subreddit: presetOptions[0].subreddit,
    scenario: defaultScenarioState,
    soundCue: null,
    transport: "polling"
  });

  // Visual jitter interval
  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((current) => ({ ...current, visualTick: current.visualTick + 1 }));
    }, 2000);
    return () => window.clearInterval(interval);
  }, []);

  // Data fetching
  useEffect(() => {
    let active = true;

    setState((current) => ({
      ...current,
      loading: true,
      error: null
    }));

    fetchRuntimePayload(state.subreddit, state.mode, state.tick, state.scenario)
      .then((payload) => {
        if (!active) {
          return;
        }

        setState((current) => ({
          ...current,
          payload,
          loading: false,
          soundCue:
            payload.twin.events[0]?.severity === "high"
              ? "risk-spike"
              : "ambient"
        }));
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setState((current) => ({
          ...current,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown runtime error"
        }));
      });

    return () => {
      active = false;
    };
  }, [state.subreddit, state.mode, state.tick, state.scenario]);

  // Sim mode tick
  useEffect(() => {
    if (state.mode === "live") {
      return;
    }

    const intervalMs = 10000;
    const interval = window.setInterval(() => {
      startTransition(() => {
        setState((current) => ({
          ...current,
          tick: current.tick + 1,
          transport: "polling"
        }));
      });
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [state.mode]);

  // Live stream SSE
  useEffect(() => {
    if (state.mode !== "live") {
      return;
    }

    const params = new URLSearchParams({
      subreddit: state.subreddit,
      mode: state.mode
    });

    const stream = new EventSource(`/api/stream?${params.toString()}`);

    stream.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data) as {
          tick?: number;
          cue?: string;
        };

        startTransition(() => {
          setState((current) => ({
            ...current,
            tick: Math.max(current.tick + 1, data.tick ?? current.tick + 1),
            soundCue: data.cue ?? current.soundCue,
            transport: "stream"
          }));
        });
      } catch {
        startTransition(() => {
          setState((current) => ({
            ...current,
            tick: current.tick + 1,
            transport: "stream"
          }));
        });
      }
    };

    stream.onerror = () => {
      stream.close();
      startTransition(() => {
        setState((current) => ({
          ...current,
          transport: "polling"
        }));
      });
    };

    return () => {
      stream.close();
    };
  }, [state.mode, state.subreddit]);

  function setMode(mode: DataMode) {
    startTransition(() => {
        setState((current) => ({
          ...current,
          mode,
          tick: current.tick + 1,
          transport: mode === "live" ? "stream" : "polling"
        }));
    });
  }

  function setSubreddit(subreddit: string) {
    const name = subreddit.startsWith("r/") ? subreddit : `r/${subreddit}`;
    startTransition(() => {
      setState((current) => ({
        ...current,
        subreddit: name,
        tick: 0,
        scenario: defaultScenarioState
      }));
    });
  }

  function toggleAction(key: ActionKey) {
    startTransition(() => {
      setState((current) => ({
        ...current,
        scenario: {
          ...current.scenario,
          [key]: !current.scenario[key]
        }
      }));
    });
  }

  function resetScenario() {
    startTransition(() => {
      setState((current) => ({
        ...current,
        scenario: defaultScenarioState
      }));
    });
  }

  function setView(view: DashboardView) {
    startTransition(() => {
      setState((current) => ({ ...current, view }));
    });
  }

  function refreshData() {
    startTransition(() => {
      setState((current) => ({
        ...current,
        tick: current.tick + 1
      }));
    });
  }

  return {
    ...state,
    presetOptions,
    setMode,
    setSubreddit,
    toggleAction,
    resetScenario,
    setView,
    refreshData
  };
}
