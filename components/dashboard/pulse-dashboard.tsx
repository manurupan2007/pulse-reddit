"use client";

import { AlertTriangle, BrainCircuit, Keyboard, Radar, RadioTower, Sparkles, Zap, ChevronRight, Activity, ShieldAlert, Search, Command, Cpu, Globe, Server, Terminal } from "lucide-react";
import { useState, useEffect } from "react";

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
    transport,
    stepForward,
    stepBackward,
    setPlaybackSpeed,
    playbackSpeed
  } = usePulseRuntime();

  const [searchInput, setSearchInput] = useState("");
  const [bootSequence, setBootSequence] = useState(true);
  const [bootText, setBootText] = useState("Initializing Signal Ingestion...");

  useEffect(() => {
    if (!bootSequence) return;
    const texts = [
      "Building behavioral model...",
      "Mapping controversy clusters...",
      "Calibrating heuristic engine...",
      "Syncing community DNA...",
      "Operational Readiness Confirmed."
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i >= texts.length) {
        clearInterval(interval);
        setTimeout(() => setBootSequence(false), 500);
      } else {
        setBootText(texts[i]);
        i++;
      }
    }, 600);
    return () => clearInterval(interval);
  }, [bootSequence]);

  const runtime = payload ?? fallbackPayload;
  const twin = runtime.twin;
  const outcome = runtime.outcome;
  const actions = listScenarioActions();

  if (bootSequence) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono">
        <div className="relative w-64 h-1 bg-muted overflow-hidden rounded-full mb-8">
          <div className="absolute inset-0 bg-primary animate-pulse w-full h-full" style={{ animationDuration: '1.5s' }} />
        </div>
        <div className="flex items-center gap-3 text-primary animate-pulse">
          <Terminal className="h-5 w-5" />
          <span className="text-sm tracking-widest uppercase">{bootText}</span>
        </div>
      </div>
    );
  }

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

  const handleSetSubreddit = (name: string) => {
    setBootSequence(true);
    setSubreddit(name);
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Header / Hero Section */}
      <div className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-[1560px] px-4 py-3 md:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Radar className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-bold tracking-tight">Pulse</div>
              <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Moderation Intelligence
              </div>
            </div>
          </div>

          <div className="flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Analyze subreddit (e.g. r/wallstreetbets)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetSubreddit(searchInput)}
                className="w-full bg-muted/50 border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] text-muted-foreground hidden sm:block">
                ENT
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-4 mr-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-r border-border pr-4">
              <div className="flex items-center gap-1.5">
                <Cpu className="h-3 w-3" />
                <span>Lat: 18ms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-3 w-3" />
                <span>Heuristic v2.4</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary border border-border text-xs font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${mode === 'live' ? 'animate-ping bg-emerald-500' : 'bg-zinc-500'}`}></span>
                <span className={`relative inline-flex h-2 w-2 rounded-full ${mode === 'live' ? 'bg-emerald-500' : 'bg-zinc-500'}`}></span>
              </span>
              {mode === "live" ? "Live Stream" : "Simulation"}
            </div>
            <select
              value={subreddit}
              onChange={(e) => handleSetSubreddit(e.target.value)}
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
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-balance max-w-4xl">
                The digital twin for <span className="text-primary">{subreddit}</span> communities.
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                Identify emerging conflict dynamics and simulate intervention outcomes. 
                Pulse models community behavior by ingesting live signals from Reddit triggers.
              </p>
            </div>

            {/* Top Primary Scores (Now shifted into the main flow) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {primaryMetrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>

            {/* Conflict Cascade Hero Section */}
            <SectionCard
              title="Conflict Cascade Engine"
              description="Real-time visualization of tension propagation and containment effectiveness."
              className="border-primary/20 bg-primary/5"
            >
              <CascadeView outcome={outcome} />
            </SectionCard>
          </div>

          <div className="flex flex-col gap-6">
             <HealthCard twin={twin} />
             <div className="glass-panel p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shortcuts</span>
                  <Keyboard className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="grid gap-2">
                  <ShortcutItem label="D" action="Toggle Story" />
                  <ShortcutItem label="L" action="Toggle Live" />
                  <ShortcutItem label="Space" action="Autoplay" />
                  <ShortcutItem label="R" action="Reset" />
                </div>
             </div>
             
             {/* Technical Credibility Widget */}
             <div className="glass-panel p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Model Status</span>
                  <Command className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Ingestion Queue</span>
                      <span className="font-mono text-emerald-500">Nominal</span>
                   </div>
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-mono">{outcome.confidence === 'high' ? '94%' : '78%'}</span>
                   </div>
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Latency</span>
                      <span className="font-mono text-primary">12ms</span>
                   </div>
                   <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-pulse w-3/4" />
                   </div>
                </div>
             </div>
          </div>
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
              stepForward={stepForward}
              stepBackward={stepBackward}
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
