"use client";

import { startTransition, useEffect, useState } from "react";

import { defaultScenarioState, listPresetSubreddits } from "@/lib/pulse-engine";
import { ActionKey, DataMode, ExperienceMode, PulseRuntimePayload, ScenarioState } from "@/types";

type RuntimeState = {
  payload: PulseRuntimePayload | null;
  loading: boolean;
  error: string | null;
  mode: DataMode;
  experienceMode: ExperienceMode;
  autoplay: boolean;
  tick: number;
  subreddit: string;
  scenario: ScenarioState;
  storyIndex: number;
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
    experienceMode: "operator",
    autoplay: false,
    tick: 0,
    subreddit: presetOptions[0].subreddit,
    scenario: defaultScenarioState,
    storyIndex: 0,
    soundCue: null,
    transport: "polling"
  });

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
              : payload.autoplaySuggestedAction
                ? "story-advance"
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

  useEffect(() => {
    if (state.mode === "live") {
      return;
    }

    const intervalMs = state.autoplay ? 8500 : 12000;
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
  }, [state.mode, state.autoplay]);

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

  useEffect(() => {
    if (!state.autoplay || state.experienceMode !== "story" || !state.payload) {
      return;
    }

    const steps = state.payload.twin.storySteps;
    if (steps.length === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      startTransition(() => {
        setState((current) => {
          const nextIndex = (current.storyIndex + 1) % steps.length;
          const nextPreset = steps[nextIndex]?.actionPreset ?? {};

          return {
            ...current,
            storyIndex: nextIndex,
            scenario: {
              ...defaultScenarioState,
              ...nextPreset
            },
            tick: current.tick + 1,
            soundCue: "story-advance"
          };
        });
      });
    }, 9000);

    return () => window.clearInterval(interval);
  }, [state.autoplay, state.experienceMode, state.payload]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "d") {
        event.preventDefault();
        setExperienceMode(state.experienceMode === "operator" ? "story" : "operator");
      }

      if (event.key === "l") {
        event.preventDefault();
        setMode(state.mode === "simulated" ? "live" : "simulated");
      }

      if (event.key === " ") {
        event.preventDefault();
        setAutoplay(!state.autoplay);
      }

      if (event.key === "r") {
        event.preventDefault();
        resetScenario();
      }

      if (/^[1-4]$/.test(event.key)) {
        event.preventDefault();
        const index = Number(event.key) - 1;
        const option = presetOptions[index];
        if (option) {
          setSubreddit(option.subreddit);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [presetOptions, state.autoplay, state.experienceMode, state.mode]);

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

  function setExperienceMode(experienceMode: ExperienceMode) {
    startTransition(() => {
      setState((current) => ({
        ...current,
        experienceMode,
        autoplay: experienceMode === "story" ? current.autoplay : false
      }));
    });
  }

  function setAutoplay(autoplay: boolean) {
    startTransition(() => {
      setState((current) => ({
        ...current,
        autoplay,
        experienceMode: autoplay ? "story" : current.experienceMode
      }));
    });
  }

  function setSubreddit(subreddit: string) {
    startTransition(() => {
      setState((current) => ({
        ...current,
        subreddit,
        tick: 0,
        storyIndex: 0,
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
        },
        experienceMode: "operator",
        autoplay: false
      }));
    });
  }

  function resetScenario() {
    startTransition(() => {
      setState((current) => ({
        ...current,
        scenario: defaultScenarioState,
        storyIndex: 0,
        autoplay: false
      }));
    });
  }

  function jumpToStory(index: number) {
    const step = state.payload?.twin.storySteps[index];
    if (!step) {
      return;
    }

    startTransition(() => {
      setState((current) => ({
        ...current,
        storyIndex: index,
        experienceMode: "story",
        scenario: {
          ...defaultScenarioState,
          ...step.actionPreset
        }
      }));
    });
  }

  return {
    ...state,
    presetOptions,
    setMode,
    setExperienceMode,
    setAutoplay,
    setSubreddit,
    toggleAction,
    resetScenario,
    jumpToStory
  };
}
