"use client";

import { ChevronRight, Cpu, Globe, Radar, Search, Terminal, ShieldAlert, BarChart3, AlertTriangle, Activity, PlayCircle, RefreshCw, Zap } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import { usePulseRuntime } from "@/hooks/use-pulse-runtime";
import { buildRuntimePayload, listScenarioActions } from "@/lib/core/engine";

import { OverviewPage } from "./views/overview-view";
import { OperationsPage } from "./views/operations-view";
import { SimulationPage } from "./views/simulation-view";
import { CascadePage } from "./views/cascade-view";
import { IntelligencePage } from "./views/intelligence-view";
import { DevvitPage } from "./views/devvit-view";

export function PulseDashboard() {
  const {
    payload,
    loading,
    error,
    mode,
    view,
    subreddit,
    presetOptions,
    setMode,
    setSubreddit,
    toggleAction,
    resetScenario,
    transport,
    setView,
    refreshData
  } = usePulseRuntime();

  // Lazy-load fallback payload to avoid module-scope execution errors
  const fallback = useMemo(() => buildRuntimePayload(), []);

  const [searchInput, setSearchInput] = useState("");
  const [bootSequence, setBootSequence] = useState(true);
  const [bootText, setBootText] = useState("Initializing Signal Ingestion...");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const runtime = payload ?? fallback;
  const twin = runtime?.twin;
  const outcome = runtime?.outcome;
  const actions = listScenarioActions();

  const primaryMetrics = useMemo(() => {
    if (!twin?.scores) return [];
    return [
      {
        label: "Resilience",
        value: twin.scores.stability || 0,
        tone: "accent" as const,
        detail: "Community capability to absorb sudden report spikes."
      },
      {
        label: "Tension",
        value: twin.scores.conflictPressure || 0,
        tone: "danger" as const,
        detail: "Calculated probability of meta-thread escalation."
      },
      {
        label: "Queue Load",
        value: twin.scores.moderatorLoad || 0,
        tone: "amber" as const,
        detail: "Projected intervention demand this cycle."
      },
      {
        label: "Signals",
        value: twin.scores.communityPressure || 0,
        tone: "cyan" as const,
        detail: "Rolling pressure from reports and velocity."
      },
      {
        label: "Quality",
        value: twin.scores.discussionQuality || 0,
        tone: "lime" as const,
        detail: "Weighted substantive response metrics."
      }
    ];
  }, [twin?.scores]);

  if (!isMounted) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  if (bootSequence || !twin || !outcome) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono text-primary">
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
    if (!name) return;
    setBootSequence(true);
    setSubreddit(name);
  };

  const handleSearchSubmit = () => {
    if (searchInput.trim()) {
      handleSetSubreddit(searchInput.trim());
      setSearchInput("");
    }
  };

  const navItems = [
    { id: "overview", label: "Dashboard", icon: Radar },
    { id: "operations", label: "Live Ops", icon: Activity },
    { id: "simulation", label: "Scenario Lab", icon: BarChart3 },
    { id: "cascade", label: "Propagation", icon: Globe },
    { id: "intelligence", label: "Intelligence", icon: Search },
    { id: "devvit", label: "Infrastructure", icon: Terminal },
  ] as const;

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden selection:bg-primary/30 selection:text-white antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-80 border-r border-border/40 bg-card/10 backdrop-blur-3xl flex flex-col shrink-0 z-50 transition-all duration-500 ease-in-out">
        <div className="p-8 border-b border-border/40 flex items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-105 transition-transform cursor-pointer">
            <Radar className="h-7 w-7" />
          </div>
          <div className="hidden md:block space-y-1">
            <div className="text-xl font-black tracking-tighter text-foreground">Pulse <span className="text-primary font-light opacity-80">OS</span></div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 leading-none">
              Operational Intel
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-10 px-6 space-y-3 custom-scrollbar text-foreground">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={`w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-inner" 
                    : "text-muted-foreground/60 hover:bg-muted/30 hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : "group-hover:scale-110 transition-transform"}`} />
                <span className={`hidden md:block text-xs font-black uppercase tracking-[0.2em] ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-primary rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-8 border-t border-border/40 bg-card/5 space-y-8">
           <div className="hidden md:block">
             <HealthCard twin={twin} />
           </div>
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className={`h-2 w-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)] ${mode === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
                <div className="hidden md:block text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                  {mode === "live" ? "System Active" : "Offline Simulation"}
                </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header Strip */}
        <header className="h-24 border-b border-border/40 bg-card/10 backdrop-blur-2xl flex items-center justify-between px-12 shrink-0 relative z-40">
          <div className="flex items-center flex-1 max-w-2xl">
             <div className="relative w-full group text-foreground">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors opacity-40" />
                <input
                  type="text"
                  placeholder="Query community node..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  className="w-full bg-muted/10 border border-border/40 rounded-2xl pl-12 pr-32 py-4 text-sm font-medium tracking-tight placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:bg-background/40 transition-all shadow-inner"
                />
                {searchInput && (
                  <button
                    onClick={handleSearchSubmit}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all"
                  >
                    Load
                  </button>
                )}
              </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Quick Command Center */}
            <div className="hidden xl:flex items-center gap-2 bg-muted/10 p-1.5 rounded-2xl border border-border/40 mr-6">
              <button
                onClick={() => setMode(mode === "live" ? "simulated" : "live")}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  mode === "live" 
                    ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border-emerald-400" 
                    : "text-muted-foreground/60 hover:text-foreground border-transparent"
                } border`}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${mode === "live" ? "bg-white animate-pulse" : "bg-zinc-600"}`} />
                {mode === "live" ? "Live Node" : "Go Live"}
              </button>
              <button
                onClick={resetScenario}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
              >
                <Zap className="h-3.5 w-3.5" />
                Halt
              </button>
              <button
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Sync
              </button>
            </div>

            <div className="flex flex-col items-end gap-1.5 px-4 border-r border-border/40 mr-2">
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 leading-none">Target</div>
              <select
                value={subreddit}
                onChange={(e) => handleSetSubreddit(e.target.value)}
                className="bg-transparent text-base font-black tracking-tighter text-foreground focus:outline-none cursor-pointer hover:text-primary transition-colors text-right"
              >
                {presetOptions.map((option) => (
                  <option key={option.subreddit} value={option.subreddit} className="bg-[#050505] text-foreground font-sans">
                    {option.subreddit}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-10 w-[1px] bg-border/40" />

            <button 
              onClick={() => window.location.reload()}
              className="p-3 rounded-xl bg-muted/20 border border-border/40 text-muted-foreground/60 hover:text-primary hover:border-primary/40 transition-all active:rotate-180 duration-500"
            >
               <RefreshCw className="h-4 w-4" />
            </button>

            <div className="hidden lg:flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/80 bg-muted/10 px-8 py-3 rounded-2xl border border-border/40 shadow-sm">
              <div className="flex items-center gap-3 border-r border-border/60 pr-8">
                <Cpu className="h-3.5 w-3.5 text-primary opacity-40" />
                <span className="font-mono">12ms</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-3.5 w-3.5 text-sky-500 opacity-40" />
                <span className="font-mono">Heuristic v2.4</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-12 md:p-16 scroll-smooth">
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
            <span className="opacity-40 hover:opacity-100 transition-opacity text-[10px]">Transport: {transport}</span>
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

function HealthCard({ twin }: { twin: any }) {
  return (
    <div className="p-5 rounded-2xl border border-border/40 bg-card/40 relative overflow-hidden group shadow-inner text-foreground">
      <div className="flex items-center gap-4 relative z-10">
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
