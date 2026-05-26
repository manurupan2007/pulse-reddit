"use client";

import { ChevronRight, Cpu, Globe, Radar, Search, Terminal, ShieldAlert, BarChart3, AlertTriangle } from "lucide-react";
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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono">
        <div className="relative w-72 h-1 bg-muted/20 overflow-hidden rounded-full mb-10 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
          <div className="absolute inset-0 bg-primary animate-pulse w-full h-full" style={{ animationDuration: '1.2s' }} />
        </div>
        <div className="flex items-center gap-4 text-primary animate-pulse group">
          <Terminal className="h-5 w-5 opacity-70 group-hover:opacity-100" />
          <span className="text-sm tracking-[0.4em] uppercase font-black">{bootText}</span>
        </div>
      </div>
    );
  }

  const handleSetSubreddit = (name: string) => {
    setBootSequence(true);
    setSubreddit(name);
  };

  const navItems = [
    { id: "overview", label: "Dashboard", icon: Radar },
    { id: "operations", label: "Live Ops", icon: Activity },
    { id: "simulation", label: "Scenario Lab", icon: BarChart3 },
    { id: "cascade", label: "Propagation", icon: Globe },
    { id: "intelligence", label: "Intelligence", icon: Search },
    { id: "story", label: "Demo Mode", icon: PlayCircle },
    { id: "devvit", label: "Infrastructure", icon: Terminal },
  ] as const;

  const primaryMetrics = [
    {
      label: "Resilience",
      value: twin.scores.stability,
      tone: "accent" as const,
      detail: "Community capability to absorb sudden report spikes."
    },
    {
      label: "Tension",
      value: twin.scores.conflictPressure,
      tone: "danger" as const,
      detail: "Calculated probability of meta-thread escalation."
    },
    {
      label: "Queue Load",
      value: twin.scores.moderatorLoad,
      tone: "amber" as const,
      detail: "Projected intervention demand this cycle."
    },
    {
      label: "Signals",
      value: twin.scores.communityPressure,
      tone: "cyan" as const,
      detail: "Rolling pressure from reports and velocity."
    },
    {
      label: "Quality",
      value: twin.scores.discussionQuality,
      tone: "lime" as const,
      detail: "Weighted substantive response metrics."
    }
  ];

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden selection:bg-primary/30 selection:text-white antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-72 border-r border-border/40 bg-card/10 backdrop-blur-2xl flex flex-col shrink-0 z-50 transition-all duration-500 ease-in-out">
        <div className="p-6 border-b border-border/40 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-105 transition-transform cursor-pointer">
            <Radar className="h-6 w-6" />
          </div>
          <div className="hidden md:block space-y-0.5">
            <div className="text-lg font-black tracking-tighter text-foreground">Pulse <span className="text-primary font-light opacity-80">OS</span></div>
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 leading-none">
              Moderation Intelligence
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar text-foreground">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-inner" 
                    : "text-muted-foreground/70 hover:bg-muted/30 hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-primary shadow-sm" : "group-hover:scale-110 transition-transform"}`} />
                <span className={`hidden md:block text-[13px] font-black uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>{item.label}</span>
                {isActive && (
                  <div className="ml-auto hidden md:block">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border/40 bg-card/5 space-y-6">
           <div className="hidden md:block transition-all hover:scale-[1.02]">
             <HealthCard twin={twin} />
           </div>
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)] ${mode === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                <div className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                  {mode === "live" ? "System Live" : "Local Sync"}
                </div>
              </div>
              <div className="hidden md:block text-[9px] font-mono opacity-40">v1.0.4</div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative border-l border-white/[0.02]">
        {/* Header Strip */}
        <header className="h-20 border-b border-border/40 bg-card/20 backdrop-blur-xl flex items-center justify-between px-10 shrink-0 relative z-40">
          <div className="flex items-center flex-1 max-w-2xl">
             <div className="relative w-full group text-foreground">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors opacity-60" />
                <input
                  type="text"
                  placeholder="Analyze Community Node (r/)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSetSubreddit(searchInput)}
                  className="w-full bg-muted/20 border border-border/40 rounded-xl pl-12 pr-4 py-3 text-[13px] font-medium tracking-tight placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:bg-background/80 transition-all shadow-inner"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md border border-border/60 bg-muted/40 text-[9px] text-muted-foreground/60 hidden sm:block font-mono tracking-tighter">
                  ENTER
                </kbd>
              </div>
          </div>

          <div className="flex items-center gap-6 ml-10">
            <div className="flex flex-col items-end gap-1 px-4">
              <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Active Target</div>
              <select
                value={subreddit}
                onChange={(e) => handleSetSubreddit(e.target.value)}
                className="bg-transparent text-[15px] font-black tracking-tight text-foreground focus:outline-none cursor-pointer hover:text-primary transition-colors text-right"
              >
                {presetOptions.map((option) => (
                  <option key={option.subreddit} value={option.subreddit} className="bg-[#050505] text-foreground font-sans">
                    {option.subreddit}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-10 w-[1px] bg-border/40" />

            <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 bg-muted/20 px-6 py-2.5 rounded-xl border border-border/40 shadow-sm">
              <div className="flex items-center gap-2 border-r border-border/60 pr-6 group">
                <Cpu className="h-3.5 w-3.5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="font-mono">12ms</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Globe className="h-3.5 w-3.5 text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="font-mono">Heuristic v2.4</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 md:p-12 scroll-smooth bg-gradient-to-b from-transparent to-primary/[0.02]">
           <div className="mx-auto max-w-[1500px]">
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

        {/* Footer Bar */}
        <footer className="h-12 border-t border-border/40 bg-card/10 backdrop-blur-md flex items-center justify-between px-10 shrink-0 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 relative z-40">
          <div className="flex items-center gap-8">
            <span className="hover:text-primary transition-colors cursor-default">© 2026 Pulse Platform</span>
            <div className="flex items-center gap-2 border-l border-border/40 pl-8 group">
              <Terminal className="h-3 w-3 group-hover:text-primary transition-all" />
              <span className="font-mono lowercase opacity-70 group-hover:opacity-100">rev_{twin.devvit.appVersion}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 group">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 group-hover:animate-ping transition-all"></div>
              Nodes Synchronized
            </div>
            <span className="opacity-40 hover:opacity-100 transition-opacity">Transport: {transport}</span>
          </div>
        </footer>
      </main>

      {error && (
        <div className="fixed bottom-10 right-10 z-[100] max-w-md animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="rounded-2xl border border-danger/40 bg-danger/5 p-6 shadow-2xl backdrop-blur-3xl ring-1 ring-danger/20">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-danger shrink-0 animate-pulse" />
              <div className="space-y-1">
                <h3 className="text-[13px] font-black uppercase tracking-widest text-danger">Heuristic Runtime Failure</h3>
                <p className="text-[13px] text-danger/80 leading-relaxed font-medium">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Activity, PlayCircle } from "lucide-react";

function ShortcutItem({ label, action }: { label: string; action: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/10 border border-border/30 text-[10px] font-black uppercase tracking-wider transition-colors hover:border-primary/30 group">
      <span className="text-muted-foreground/60 group-hover:text-foreground">{action}</span>
      <kbd className="px-2 py-1 rounded border border-border/60 bg-muted/40 text-foreground/80 font-mono ml-3 shadow-inner">
        {label}
      </kbd>
    </div>
  );
}

function HealthCard({ twin }: { twin: any }) {
  return (
    <div className="p-5 rounded-2xl border border-border/40 bg-card/40 relative overflow-hidden group shadow-inner">
      <div className="flex items-center gap-4 text-foreground relative z-10">
        <div className="relative h-12 w-12 shrink-0 group-hover:scale-105 transition-transform duration-500">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle className="stroke-muted/10" strokeWidth="14" fill="transparent" r="40" cx="50" cy="50" />
            <circle
              className="stroke-primary transition-all duration-1000 ease-out"
              strokeWidth="14"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * twin.scores.healthIndex) / 100}
              strokeLinecap="round"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-black text-[11px] tabular-nums tracking-tighter">
            {twin.scores.healthIndex}%
          </div>
        </div>
        <div className="min-w-0 space-y-0.5">
          <div className="text-[13px] font-black truncate leading-tight group-hover:text-primary transition-colors">{twin.subreddit}</div>
          <div className="text-[9px] text-muted-foreground/60 uppercase tracking-[0.2em] font-black leading-none">Security Index</div>
        </div>
      </div>
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
}
