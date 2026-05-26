"use client";

import { ChevronRight, Cpu, Globe, Radar, Search, Terminal, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";

import { usePulseRuntime } from "@/hooks/use-pulse-runtime";
import { buildRuntimePayload, listScenarioActions } from "@/lib/core/engine";

import { OverviewPage } from "./views/overview-view";
import { OperationsPage } from "./views/operations-view";
import { SimulationPage } from "./views/simulation-view";
import { CascadePage } from "./views/cascade-view";
import { IntelligencePage } from "./views/intelligence-view";
import { StoryPage } from "./views/story-view";
import { DevvitPage } from "./views/devvit-view";

const fallbackPayload = buildRuntimePayload();

export function PulseDashboard() {
  const {
    payload,
    loading,
    error,
    mode,
    experienceMode,
    view,
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
    playbackSpeed,
    setView
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

  const handleSetSubreddit = (name: string) => {
    setBootSequence(true);
    setSubreddit(name);
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Radar },
    { id: "operations", label: "Operations", icon: Terminal },
    { id: "simulation", label: "Sim Lab", icon: Cpu },
    { id: "cascade", label: "Cascade", icon: Globe },
    { id: "intelligence", label: "Intelligence", icon: Search },
    { id: "story", label: "Story", icon: ChevronRight },
    { id: "devvit", label: "Devvit", icon: Terminal },
  ] as const;

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
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Sidebar Navigation */}
      <aside className="w-18 md:w-64 border-r border-border bg-card/20 flex flex-col shrink-0 z-50">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Radar className="h-5 w-5" />
          </div>
          <div className="hidden md:block">
            <div className="text-base font-bold tracking-tight text-foreground">Pulse</div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Moderation Intelligence
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar text-foreground">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
                <span className="hidden md:block text-sm font-bold">{item.label}</span>
                {isActive && (
                  <div className="ml-auto hidden md:block">
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border bg-card/10 space-y-4">
           <div className="hidden md:block">
             <HealthCard twin={twin} />
           </div>
           <div className="flex items-center justify-between gap-2">
              <div className={`h-2 w-2 rounded-full ${mode === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`} />
              <div className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {mode === "live" ? "Live Node Active" : "Simulated Local"}
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-40">
          <div className="flex items-center flex-1 max-w-xl">
             <div className="relative w-full group text-foreground">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Analyze subreddit..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSetSubreddit(searchInput)}
                  className="w-full bg-muted/50 border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
                />
              </div>
          </div>

          <div className="flex items-center gap-4 ml-6">
            <select
              value={subreddit}
              onChange={(e) => handleSetSubreddit(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none text-foreground"
            >
              {presetOptions.map((option) => (
                <option key={option.subreddit} value={option.subreddit}>
                  {option.subreddit}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
           <div className="mx-auto max-w-[1400px]">
              {view === "overview" && (
                <OverviewPage subreddit={subreddit} twin={twin} outcome={outcome} setView={setView} />
              )}

              {view === "operations" && (
                <OperationsPage twin={twin} />
              )}

              {view === "simulation" && (
                <SimulationPage runtime={runtime} twin={twin} outcome={outcome} actions={actions} toggleAction={toggleAction} resetScenario={resetScenario} />
              )}

              {view === "cascade" && (
                <CascadePage outcome={outcome} runtime={runtime} />
              )}

              {view === "intelligence" && (
                <IntelligencePage twin={twin} />
              )}

              {view === "story" && (
                <StoryPage 
                  twin={twin} 
                  storyIndex={storyIndex} 
                  experienceMode={experienceMode} 
                  autoplay={autoplay} 
                  jumpToStory={jumpToStory} 
                  setAutoplay={setAutoplay} 
                  setExperienceMode={setExperienceMode} 
                  stepForward={stepForward} 
                  stepBackward={stepBackward} 
                  playbackSpeed={playbackSpeed} 
                  setPlaybackSpeed={setPlaybackSpeed}
                  primaryMetrics={primaryMetrics}
                />
              )}

              {view === "devvit" && (
                <DevvitPage twin={twin} workflows={twin.workflows} events={twin.events} />
              )}
           </div>
        </div>

        <footer className="h-10 border-t border-border bg-card/30 flex items-center justify-between px-6 shrink-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center gap-6">
            <span>© 2026 Pulse OS</span>
            <span>Version {twin.devvit.appVersion}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
              Nodes Synchronized
            </div>
            <span>Transport: {transport}</span>
          </div>
        </footer>
      </main>

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
    </div>
  );
}

function HealthCard({ twin }: { twin: any }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card/40 relative overflow-hidden">
      <div className="flex items-center gap-3 text-foreground">
        <div className="relative h-10 w-10 shrink-0">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle className="stroke-muted/10" strokeWidth="12" fill="transparent" r="40" cx="50" cy="50" />
            <circle
              className="stroke-primary transition-all duration-500"
              strokeWidth="12"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * twin.scores.healthIndex) / 100}
              strokeLinecap="round"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-black text-[10px]">
            {twin.scores.healthIndex}%
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-xs font-black truncate">{twin.subreddit}</div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">Health Level</div>
        </div>
      </div>
    </div>
  );
}
