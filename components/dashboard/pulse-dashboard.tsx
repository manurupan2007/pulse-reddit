"use client";

import { AlertTriangle, BrainCircuit, Keyboard, Radar, RadioTower, Sparkles, Zap, ChevronRight, Activity, ShieldAlert } from "lucide-react";

import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { AlertStack } from "@/components/dashboard/alert-stack";
import { CascadeView } from "@/components/dashboard/cascade-view";
import { CommunityDna } from "@/components/dashboard/community-dna";
import { DevvitOpsPanel } from "@/components/dashboard/devvit-ops-panel";
import { EventFeed } from "@/components/dashboard/event-feed";
import { ExecutiveOverview } from "@/components/dashboard/executive-overview";
import { ForecastTimeline } from "@/components/dashboard/forecast-timeline";
import { MetricCard } from "@/components/ui/metric-card";
import { PressureRadar } from "@/components/dashboard/pressure-radar";
import { SectionCard } from "@/components/ui/section-card";
import { SimulatorPanel } from "@/components/dashboard/simulator-panel";
import { StoryModePanel } from "@/components/dashboard/story-mode-panel";
import { usePulseRuntime } from "@/hooks/use-pulse-runtime";
import { buildRuntimePayload, listScenarioActions } from "@/lib/pulse-engine";

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
      label: "Stability",
      value: twin.scores.stability,
      tone: "accent" as const,
      detail: "Composite resilience under current pressure."
    },
    {
      label: "Conflict",
      value: twin.scores.conflictPressure,
      tone: "danger" as const,
      detail: "Escalation potential across active threads."
    },
    {
      label: "Mod Load",
      value: twin.scores.moderatorLoad,
      tone: "amber" as const,
      detail: "Projected intervention demand this cycle."
    },
    {
      label: "Pressure",
      value: twin.scores.communityPressure,
      tone: "cyan" as const,
      detail: "Rolling pressure from reports and velocity."
    },
    {
      label: "Quality",
      value: twin.scores.discussionQuality,
      tone: "lime" as const,
      detail: "Depth, civility, and signal retention."
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Header / Hero Section */}
      <div className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-[1560px] px-4 py-3 md:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Radar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">Pulse</div>
              <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Moderation Intelligence
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary border border-border text-xs font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${mode === 'live' ? 'animate-ping bg-emerald-500' : 'bg-zinc-500'}`}></span>
                <span className={`relative inline-flex h-2 w-2 rounded-full ${mode === 'live' ? 'bg-emerald-500' : 'bg-zinc-500'}`}></span>
              </span>
              {mode === "live" ? "Live Stream" : "Simulation"}
            </div>
            <select
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {presetOptions.map((option) => (
                <option key={option.subreddit} value={option.subreddit}>
                  {option.subreddit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1560px] px-4 py-8 md:px-6 flex flex-col gap-8">
        {/* Main Overview Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-balance">
                Operational forecast for subreddit communities.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Pulse models community behavior by ingesting live signals and simulating intervention outcomes. 
                Identify emerging conflict dynamics before they impact your moderation capacity.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="glass-panel p-5 flex flex-col justify-between h-32">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Source</span>
                  <Activity className="h-4 w-4" />
                </div>
                <div className="text-sm font-medium mt-auto">{twin.sourceLabel}</div>
              </div>
              <div className="glass-panel p-5 flex flex-col justify-between h-32">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Sync Status</span>
                  <RadioTower className="h-4 w-4" />
                </div>
                <div className="text-sm font-medium mt-auto">{twin.devvit.lastSync}</div>
              </div>
              <div className="glass-panel p-5 flex flex-col justify-between h-32">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Active Users</span>
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold mt-auto">{twin.activeUsers.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
             <HealthCard twin={twin} />
             <div className="glass-panel p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shortcuts</span>
                  <Keyboard className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ShortcutItem label="D" action="Toggle Story" />
                  <ShortcutItem label="L" action="Toggle Live" />
                  <ShortcutItem label="Space" action="Autoplay" />
                  <ShortcutItem label="R" action="Reset" />
                </div>
             </div>
          </div>
        </div>

        {/* Primary Scores */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {primaryMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        {/* Dashboard Sections */}
        <div className="grid gap-6">
          <SectionCard
            title="Executive Overview"
            description="High-level health metrics and urgent operational risks."
          >
            <ExecutiveOverview metrics={twin.executiveMetrics} risks={twin.todayRisks} />
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="Forecast Timeline"
              description="Projected community trajectory over the next 72 hours."
            >
              <ForecastTimeline forecast={twin.forecast} />
            </SectionCard>

            <SectionCard
              title="Community DNA"
              description="Behavioral fingerprinting based on interaction patterns."
            >
              <CommunityDna personality={twin.personality} />
            </SectionCard>
          </div>

          <SectionCard
            title="Pressure Radar"
            description="Real-time monitoring of community volatility and stress points."
          >
            <PressureRadar history={twin.pressureHistory} />
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <SectionCard
              title="Scenario Simulator"
              description="Test moderation actions and forecast their community impact."
              rightSlot={
                <button
                  onClick={resetScenario}
                  className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                >
                  Reset
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
              title="Conflict Cascade"
              description="Visualization of how tension propagates across threads."
            >
              <CascadeView outcome={outcome} />
            </SectionCard>
          </div>

          <SectionCard
            title="Devvit Operations"
            description="Native integration layer for event ingestion and install flow."
          >
            <DevvitOpsPanel devvit={twin.devvit} workflows={twin.workflows} events={twin.events} />
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="Activity Heatmap"
              description="Temporal activity patterns for staffing optimization."
            >
              <ActivityHeatmap heatmap={twin.heatmap} />
            </SectionCard>

            <SectionCard
              title="Live Event Feed"
              description="Chronological stream of moderation triggers and incidents."
            >
              <EventFeed events={twin.events} />
            </SectionCard>
          </div>

          <SectionCard
            title="Alert Stream"
            description="Proactive warning system for emerging community risks."
          >
            <AlertStack alerts={twin.alerts} />
          </SectionCard>

          <SectionCard
            title="Storytelling Mode"
            description="Guided walkthrough for demonstration and incident review."
            rightSlot={
              <button
                onClick={() => setAutoplay(!autoplay)}
                className={`inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors h-8 px-3 ${autoplay ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-input bg-background hover:bg-accent'}`}
              >
                {autoplay ? "Stop Autoplay" : "Start Autoplay"}
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
        </div>
      </div>
      
      {/* Footer / Status Bar */}
      <footer className="border-t border-border bg-card/30 py-4 mt-8">
        <div className="mx-auto max-w-[1560px] px-4 md:px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>© 2026 Pulse Moderation OS</span>
            <span>Version {twin.devvit.appVersion}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
              System Operational
            </div>
            <span>Transport: {transport}</span>
          </div>
        </div>
      </footer>

      {error && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="rounded-lg border border-danger/50 bg-danger/10 p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-danger shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-danger">Runtime Error</h3>
                <p className="mt-1 text-xs text-danger/90 leading-relaxed">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ShortcutItem({ label, action }: { label: string; action: string }) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5 rounded bg-muted/30 border border-border/50 text-[10px] font-medium uppercase tracking-tight">
      <span className="text-muted-foreground">{action}</span>
      <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-foreground ml-2">
        {label}
      </kbd>
    </div>
  );
}

function HealthCard({ twin }: { twin: any }) {
  return (
    <div className="glass-panel p-5 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Community Health</span>
        <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-tight border border-emerald-500/20">
          Optimal
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative h-20 w-20 shrink-0">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle
              className="stroke-muted/10"
              strokeWidth="10"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="stroke-primary transition-all duration-500"
              strokeWidth="10"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * twin.scores.healthIndex) / 100}
              strokeLinecap="round"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
            {twin.scores.healthIndex}
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold truncate">{twin.subreddit}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {twin.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
