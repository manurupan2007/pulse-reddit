"use client";

import { AlertTriangle, BrainCircuit, Keyboard, Radar, RadioTower, Sparkles, Zap } from "lucide-react";

import { ActivityHeatmap } from "@/components/activity-heatmap";
import { AlertStack } from "@/components/alert-stack";
import { CascadeView } from "@/components/cascade-view";
import { CommunityDna } from "@/components/community-dna";
import { DevvitOpsPanel } from "@/components/devvit-ops-panel";
import { EventFeed } from "@/components/event-feed";
import { ExecutiveOverview } from "@/components/executive-overview";
import { ForecastTimeline } from "@/components/forecast-timeline";
import { MetricOrb } from "@/components/metric-orb";
import { PressureRadar } from "@/components/pressure-radar";
import { SectionCard } from "@/components/section-card";
import { SimulatorPanel } from "@/components/simulator-panel";
import { StoryModePanel } from "@/components/story-mode-panel";
import { buildRuntimePayload, listScenarioActions } from "@/lib/pulse-engine";
import { usePulseRuntime } from "@/lib/use-pulse-runtime";

const fallbackPayload = buildRuntimePayload();

export function PulseDashboard() {
  const {
    payload,
    loading,
    error,
    mode,
    experienceMode,
    autoplay,
    subreddit,
    storyIndex,
    presetOptions,
    setMode,
    setExperienceMode,
    setAutoplay,
    setSubreddit,
    toggleAction,
    resetScenario,
    jumpToStory,
    soundCue,
    transport
  } = usePulseRuntime();

  const runtime = payload ?? fallbackPayload;
  const twin = runtime.twin;
  const outcome = runtime.outcome;
  const actions = listScenarioActions();

  const primaryMetrics = [
    {
      label: "Community Stability",
      value: twin.scores.stability,
      tone: "accent" as const,
      detail: "Composite resilience under current pressure."
    },
    {
      label: "Conflict Pressure",
      value: twin.scores.conflictPressure,
      tone: "danger" as const,
      detail: "Escalation potential across active threads."
    },
    {
      label: "Moderator Load",
      value: twin.scores.moderatorLoad,
      tone: "amber" as const,
      detail: "Projected intervention demand this cycle."
    },
    {
      label: "Community Pressure",
      value: twin.scores.communityPressure,
      tone: "cyan" as const,
      detail: "Rolling pressure from reports, velocity, and spillover."
    },
    {
      label: "Discussion Quality",
      value: twin.scores.discussionQuality,
      tone: "lime" as const,
      detail: "Depth, civility, and signal retention."
    }
  ];

  return (
    <main className="relative overflow-hidden px-4 py-4 md:px-6 md:py-6" data-sound-cue={soundCue ?? "ambient"}>
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-5">
        <section className="glass-panel rounded-shell relative overflow-hidden px-6 py-6 shadow-pulse md:px-8 md:py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(55,244,255,0.14),transparent_22%),radial-gradient(circle_at_25%_15%,rgba(199,103,255,0.16),transparent_32%)]" />
          <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_50%_0,rgba(55,244,255,0.13),transparent_40%)]" />
          {loading ? (
            <div className="pointer-events-none absolute inset-0 animate-pulse bg-white/[0.03]" />
          ) : null}
          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-accent">
                      <Radar className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-display text-lg text-white">Pulse</div>
                      <div className="text-xs uppercase tracking-[0.28em] text-muted">
                        Moderation Operating System
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMode(mode === "simulated" ? "live" : "simulated")}
                    className="rounded-full border border-accent/15 bg-accent/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-accent transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    {mode === "live" ? "Live subreddit mode" : "Simulated mode"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setExperienceMode(experienceMode === "operator" ? "story" : "operator")}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.28em] text-muted transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    {experienceMode === "story" ? "Storytelling mode" : "Operator mode"}
                  </button>
                </div>

                <div className="max-w-3xl space-y-4">
                  <h1 className="font-display text-balance text-4xl leading-tight text-white md:text-6xl">
                    Forecast subreddit behavior before moderators touch the controls.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-[#bfd3f3] md:text-lg">
                    Pulse is a Devvit-powered moderation intelligence layer: a digital twin that
                    ingests live-ish Reddit signals, simulates intervention outcomes, and makes
                    conflict dynamics feel visible before they become operationally expensive.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                    {twin.sourceLabel}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                    {twin.clockLabel}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                    Transport: {transport}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                    Future of moderation command center
                  </span>
                </div>
              </div>

              <div className="grid gap-4 xl:w-[430px]">
                <div className="glass-panel rounded-tile p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-xs uppercase tracking-[0.28em] text-muted">
                      Deployment surface
                    </div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-accent">
                      <RadioTower className="h-3 w-3" />
                      {twin.devvit.lastSync}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3">
                    <select
                      value={subreddit}
                      onChange={(event) => setSubreddit(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent/40"
                    >
                      {presetOptions.map((option) => (
                        <option key={option.subreddit} value={option.subreddit}>
                          {option.subreddit} - {option.tagline}
                        </option>
                      ))}
                    </select>

                    <div className="grid gap-3 md:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setMode("simulated")}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm transition-transform duration-300 hover:-translate-y-0.5 ${
                          mode === "simulated"
                            ? "border-accent/30 bg-accent/10 text-white"
                            : "border-white/10 bg-white/[0.03] text-muted"
                        }`}
                      >
                        Simulated twin
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("live")}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm transition-transform duration-300 hover:-translate-y-0.5 ${
                          mode === "live"
                            ? "border-accent/30 bg-accent/10 text-white"
                            : "border-white/10 bg-white/[0.03] text-muted"
                        }`}
                      >
                        Live subreddit mode
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                  <HealthPulse twin={twin} />

                  <div className="glass-panel rounded-tile p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-xs uppercase tracking-[0.28em] text-muted">
                        Guided controls
                      </div>
                      <Keyboard className="h-4 w-4 text-magenta" />
                    </div>
                    <div className="grid gap-2 text-sm text-muted">
                      <Shortcut label="D" detail="toggle storytelling mode" />
                      <Shortcut label="L" detail="switch live/simulated adapter" />
                      <Shortcut label="Space" detail="autoplay demo walkthrough" />
                      <Shortcut label="R" detail="reset active scenario" />
                    </div>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm text-[#ffd7df]">
                    {error}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {primaryMetrics.map((metric) => (
                <MetricOrb key={metric.label} {...metric} />
              ))}
            </div>
          </div>
        </section>

        <SectionCard
          eyebrow="Executive Moderation View"
          title="Command center"
          description="A high-level operator layer for subreddit health, moderator fatigue, intervention effectiveness, and today's most urgent risks."
          rightSlot={
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted">
              <Zap className="h-4 w-4 text-accent" />
              Live command layer
            </div>
          }
        >
          <ExecutiveOverview metrics={twin.executiveMetrics} risks={twin.todayRisks} />
        </SectionCard>

        <SectionCard
          eyebrow="Devvit Integration Layer"
          title="Install flow, permissions, and event ingestion"
          description="Pulse is positioned as a subreddit-native decision support system, not a generic analytics dashboard. This layer shows how the app installs, syncs, and maintains rolling pressure state."
          rightSlot={
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted">
              <BrainCircuit className="h-4 w-4 text-cyan" />
              Deployable architecture
            </div>
          }
        >
          <DevvitOpsPanel devvit={twin.devvit} workflows={twin.workflows} events={twin.events} />
        </SectionCard>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <SectionCard
            eyebrow="Timeline Forecast"
            title="Future projection engine"
            description="Pulse projects likely swings in toxicity, engagement, moderator pressure, quality, and retention across the next 72 hours."
            rightSlot={
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted">
                <RadioTower className="h-4 w-4 text-accent" />
                Forecast simulation active
              </div>
            }
          >
            <ForecastTimeline forecast={twin.forecast} />
          </SectionCard>

          <SectionCard
            eyebrow="Community DNA"
            title="Personality classifier"
            description="A simulated behavioral fingerprint derived from discussion depth, volatility, humor load, cohesion, and moderator friction."
            rightSlot={
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted">
                <Sparkles className="h-4 w-4 text-magenta" />
                {twin.personality.type}
              </div>
            }
          >
            <CommunityDna personality={twin.personality} />
          </SectionCard>
        </div>

        <SectionCard
          eyebrow="Community Pressure"
          title="Rolling pressure radar"
          description="A live field view of community pressure, volatility, and intervention load. This is the operating heartbeat behind Pulse's forecast and alert layers."
          rightSlot={
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted">
              <RadioTower className="h-4 w-4 text-cyan" />
              Stream-aware pressure model
            </div>
          }
        >
          <PressureRadar history={twin.pressureHistory} />
        </SectionCard>

        <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <SectionCard
            eyebrow="Scenario Simulator"
            title="Moderation action lab"
            description="Simulate intervention packages and generate believable narratives, confidence indicators, and before-versus-after shifts before taking action."
            rightSlot={
              <button
                type="button"
                onClick={resetScenario}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted transition-transform duration-300 hover:-translate-y-0.5"
              >
                Reset scenario
              </button>
            }
          >
            <SimulatorPanel
              actions={actions}
              state={runtime.scenario}
              onToggle={toggleAction}
              outcome={outcome}
            />
          </SectionCard>

          <SectionCard
            eyebrow="Cascade View"
            title="How conflict spreads"
            description="This is Pulse's signature feature: thread-to-thread escalation, sentiment contamination, meme amplification, and moderation containment visualized as a live propagation system."
            rightSlot={
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted">
                <AlertTriangle className="h-4 w-4 text-danger" />
                Spread model active
              </div>
            }
          >
            <CascadeView outcome={outcome} />
          </SectionCard>
        </div>

        <SectionCard
          eyebrow="Storytelling Mode"
          title="Cinematic demo walkthrough"
          description="Pulse can shift from operator tooling into a guided cinematic demo flow with staged alerts, before-versus-after action presets, and auto-playing risk escalation."
          rightSlot={
            <button
              type="button"
              onClick={() => setAutoplay(!autoplay)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted transition-transform duration-300 hover:-translate-y-0.5"
            >
              {autoplay ? "Pause autoplay" : "Start autoplay"}
            </button>
          }
        >
          <StoryModePanel
            steps={twin.storySteps}
            storyIndex={storyIndex}
            experienceMode={experienceMode}
            autoplay={autoplay}
            onJump={jumpToStory}
            onToggleAutoplay={setAutoplay}
            onSetMode={setExperienceMode}
          />
        </SectionCard>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <SectionCard
            eyebrow="Community Heat"
            title="Engagement heatmap"
            description="A quick-read activity field for deciding when moderation staffing, automod strictness, and intervention windows should shift."
          >
            <ActivityHeatmap heatmap={twin.heatmap} />
          </SectionCard>

          <SectionCard
            eyebrow="Live Event Feed"
            title="Operational activity stream"
            description="Reports, automod catches, mod actions, and thread-level incidents flowing into Pulse's rolling pressure model."
          >
            <EventFeed events={twin.events} />
          </SectionCard>
        </div>

        <SectionCard
          eyebrow="Alert Stream"
          title="Moderator warning system"
          description="Pulse continuously translates score movement into concise operator-grade alerts for escalation, saturation, and attention shifts."
        >
          <AlertStack alerts={twin.alerts} />
        </SectionCard>
      </div>
    </main>
  );
}

function Shortcut({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-accent">
        {label}
      </span>
      <span>{detail}</span>
    </div>
  );
}

function HealthPulse({ twin }: { twin: typeof fallbackPayload.twin }) {
  return (
    <div className="glass-panel rounded-tile grid gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.28em] text-muted">Health pulse</div>
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-accent">
          {twin.activeUsers.toLocaleString()} active now
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[132px_1fr] md:items-center">
        <div
          className="metric-ring animate-pulse-glow grid h-32 w-32 place-items-center rounded-full border border-white/10"
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.18), transparent 58%), conic-gradient(from 200deg, rgba(255,255,255,0.08), rgba(55,244,255,0.94) ${twin.scores.healthIndex}%, rgba(255,255,255,0.08) 0)`
          }}
        >
          <div className="grid h-24 w-24 place-items-center rounded-full bg-[#07111e]/94 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <div className="text-center">
              <div className="font-display text-3xl text-white">{twin.scores.healthIndex}</div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-muted">Health</div>
            </div>
          </div>
        </div>
        <div>
          <div className="font-display text-xl text-white">{twin.subreddit}</div>
          <div className="mt-2 text-sm leading-6 text-muted">{twin.tagline}</div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-xs uppercase tracking-[0.24em] text-muted">Mode</div>
              <div className="mt-2 text-white">{twin.mode === "live" ? "Live sync" : "Simulation"}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-xs uppercase tracking-[0.24em] text-muted">Twin status</div>
              <div className="mt-2 text-white">Synchronized</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
