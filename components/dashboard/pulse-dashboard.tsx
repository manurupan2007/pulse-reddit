"use client";

import { AlertTriangle, BrainCircuit, Keyboard, Radar, RadioTower, Sparkles, Zap, ChevronRight, Activity, ShieldAlert, Search, Command, Cpu, Globe, Server, Terminal, LayoutDashboard, Activity as OpsIcon, PlayCircle, Network, Microscope, BookOpen, Settings, BarChart3, Clock, ArrowRight } from "lucide-react";
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
import { buildRuntimePayload, listScenarioActions } from "@/lib/core/engine";

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

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "operations", label: "Operations", icon: OpsIcon },
    { id: "simulation", label: "Sim Lab", icon: PlayCircle },
    { id: "cascade", label: "Cascade", icon: Network },
    { id: "intelligence", label: "Intelligence", icon: Microscope },
    { id: "story", label: "Story", icon: BookOpen },
    { id: "devvit", label: "Devvit", icon: Settings },
  ] as const;

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
        {/* Header Strip */}
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
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
            >
              {presetOptions.map((option) => (
                <option key={option.subreddit} value={option.subreddit}>
                  {option.subreddit}
                </option>
              ))}
            </select>

            <div className="hidden lg:flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary/50 px-4 py-2 rounded-md border border-border">
              <div className="flex items-center gap-1.5 border-r border-border pr-4">
                <Cpu className="h-3 w-3 text-primary" />
                <span>12ms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-sky-500" />
                <span>v2.4</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
           <div className="mx-auto max-w-[1400px]">
              {view === "overview" && (
                <div className="space-y-8 animate-in fade-in duration-500 text-foreground">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Executive Briefing</div>
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-balance">
                           {subreddit} <span className="text-muted-foreground font-light">Status Report</span>
                        </h1>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="text-right hidden sm:block">
                            <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Health Index</div>
                            <div className="text-2xl font-black">{twin.scores.healthIndex}%</div>
                         </div>
                         <div className="h-12 w-[1px] bg-border mx-2 hidden sm:block" />
                         <button 
                           onClick={() => setView("cascade")}
                           className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:brightness-110 transition-all"
                         >
                           Analyze Cascade
                           <ArrowRight className="h-4 w-4" />
                         </button>
                      </div>
                   </div>

                   <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                      <MetricCard label="Stability" value={twin.scores.stability} tone="accent" detail="Current resilience score." />
                      <MetricCard label="Conflict" value={twin.scores.conflictPressure} tone="danger" detail="Escalation potential." />
                      <MetricCard label="Mod Load" value={twin.scores.moderatorLoad} tone="amber" detail="Projected queue strain." />
                      <MetricCard label="Quality" value={twin.scores.discussionQuality} tone="lime" detail="Civility and depth." />
                   </div>

                   <div className="grid gap-8 lg:grid-cols-3">
                      <div className="lg:col-span-2">
                        <SectionCard
                          title="Strategic Preview"
                          description="High-fidelity model of emerging tension propagation."
                        >
                          <div className="h-[400px] flex flex-col">
                             <div className="flex-1">
                               <CascadeView outcome={outcome} />
                             </div>
                             <div className="pt-6 mt-6 border-t border-border flex justify-center">
                                <button 
                                  onClick={() => setView("cascade")}
                                  className="text-xs font-bold text-primary flex items-center gap-2 hover:underline"
                                >
                                  Open Full Screen Propagation Analysis <ChevronRight className="h-3 w-3" />
                                </button>
                             </div>
                          </div>
                        </SectionCard>
                      </div>
                      <div className="space-y-8">
                         <SectionCard title="Urgent Risks" description="Next 6 hour horizon.">
                            <AlertStack alerts={twin.alerts.slice(0, 2)} />
                         </SectionCard>
                         <SectionCard title="Forecast" description="Subreddit trajectory.">
                            <div className="space-y-4">
                               {twin.forecast.slice(0, 3).map((f) => (
                                 <div key={f.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                                    <span className="text-xs font-bold">{f.label}</span>
                                    <div className="flex items-center gap-3">
                                       <span className="text-[10px] uppercase text-muted-foreground font-bold">Conflict:</span>
                                       <span className={`text-sm font-black ${f.conflict > 70 ? 'text-red-500' : 'text-emerald-500'}`}>{f.conflict}%</span>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </SectionCard>
                      </div>
                   </div>
                </div>
              )}

              {view === "operations" && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 text-foreground">
                   <div className="space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500">Live Operations</div>
                      <h1 className="text-4xl font-extrabold tracking-tight">Real-time Monitoring Center</h1>
                   </div>
                   
                   <div className="grid gap-8 lg:grid-cols-3">
                      <div className="lg:col-span-2 space-y-8">
                        <SectionCard title="Pressure Radar" description="Rolling volatility and stress analysis.">
                           <PressureRadar history={twin.pressureHistory} />
                        </SectionCard>
                        <SectionCard title="Temporal Activity" description="Activity patterns and surge detection.">
                           <ActivityHeatmap heatmap={twin.heatmap} />
                        </SectionCard>
                      </div>
                      <div className="space-y-8">
                        <SectionCard title="Operational Stream" description="Live signal ingestion.">
                           <div className="h-[600px] overflow-hidden">
                              <EventFeed events={twin.events} />
                           </div>
                        </SectionCard>
                        <div className="glass-panel p-5 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shortcuts</span>
                              <Keyboard className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="grid gap-2">
                              <ShortcutItem label="D" action="Story" />
                              <ShortcutItem label="L" action="Toggle Live" />
                              <ShortcutItem label="R" action="Reset" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {view === "simulation" && (
                <div className="space-y-8 animate-in zoom-in-95 duration-500 text-foreground">
                   <div className="flex items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-fuchsia-500">Simulation Lab</div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Outcome Forecasting</h1>
                      </div>
                      <button
                        onClick={resetScenario}
                        className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg text-xs font-bold border border-border transition-all"
                      >
                        Reset Lab
                      </button>
                   </div>

                   <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                      <div className="space-y-8">
                         <SectionCard title="Intervention controls" description="Apply moderation vectors to forecast community impact.">
                            <SimulatorPanel actions={actions} state={runtime.scenario} onToggle={toggleAction} outcome={outcome} />
                         </SectionCard>
                         <SectionCard title="Impact Timeline" description="Projected shifts across the next 72 hours.">
                            <ForecastTimeline forecast={twin.forecast} />
                         </SectionCard>
                      </div>
                      <div className="space-y-8">
                         <SectionCard title="Heuristic Explanation" description="Reasoning engine output.">
                            <div className="space-y-4">
                               {outcome.explanation.map((line, i) => (
                                 <div key={i} className="text-sm text-muted-foreground leading-relaxed p-4 rounded-lg bg-card/50 border border-border text-foreground">
                                    {line}
                                 </div>
                               ))}
                               <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 italic text-sm text-foreground">
                                  &quot;{outcome.narrative}&quot;
                               </div>
                            </div>
                         </SectionCard>
                         <div className="glass-panel p-5 space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                               <span>Confidence</span>
                               <span className={outcome.confidence === 'high' ? 'text-emerald-500' : 'text-amber-500'}>{outcome.confidence}</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                               <div className={`h-full ${outcome.confidence === 'high' ? 'bg-emerald-500' : 'bg-amber-500'} w-3/4 animate-pulse`} />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {view === "cascade" && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 h-full flex flex-col text-foreground">
                   <div className="space-y-2 shrink-0">
                      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">Signature Visualization</div>
                      <h1 className="text-4xl font-extrabold tracking-tight">Social Conflict Propagation</h1>
                   </div>
                   
                   <div className="flex-1 min-h-[700px] glass-panel relative overflow-hidden flex flex-col">
                      <div className="p-6 border-b border-border flex items-center justify-between bg-card/20 relative z-10">
                         <div className="space-y-1">
                            <div className="text-xl font-bold tracking-tight">{outcome.cascadeMap.headline}</div>
                            <div className="text-sm text-muted-foreground italic">Visualizing containment field vs spread velocity</div>
                         </div>
                         <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                               <Zap className="h-3 w-3" />
                               Spread Active
                            </div>
                            {Object.values(runtime.scenario).some(Boolean) && (
                              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                 <ShieldAlert className="h-3 w-3" />
                                 Containment Layer ON
                              </div>
                            )}
                         </div>
                      </div>
                      <div className="flex-1 flex flex-col md:flex-row gap-6 p-6">
                         <div className="flex-1 glass-panel bg-card/5 p-4 flex items-center justify-center">
                            <CascadeView outcome={outcome} />
                         </div>
                         <div className="w-full md:w-80 space-y-4 overflow-y-auto custom-scrollbar">
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Signal Mapping</div>
                            {outcome.cascade.map((c) => (
                              <div key={c.label} className="p-4 rounded-xl border border-border bg-card/40 space-y-3">
                                 <div className="flex justify-between items-start gap-2">
                                    <div className="text-xs font-bold leading-tight">{c.label}</div>
                                    <div className={`text-xs font-black ${c.delta <= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                       {c.after}
                                    </div>
                                 </div>
                                 <div className="text-[10px] text-muted-foreground leading-relaxed">{c.note}</div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {view === "intelligence" && (
                <div className="space-y-8 animate-in fade-in duration-500 text-foreground">
                   <div className="space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500">Behavioral Research</div>
                      <h1 className="text-4xl font-extrabold tracking-tight">Community Intelligence</h1>
                   </div>

                   <div className="grid gap-8 lg:grid-cols-2">
                      <SectionCard title="Community DNA" description="Behavioral fingerprint based on interaction patterns.">
                        <CommunityDna personality={twin.personality} />
                      </SectionCard>
                      <div className="space-y-8">
                         <SectionCard title="Personality Profile" description="Automatic community classification.">
                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                               <div className="text-3xl font-black tracking-tighter">{twin.personality.type}</div>
                               <p className="text-sm text-muted-foreground leading-relaxed">{twin.personality.rationale}</p>
                            </div>
                         </SectionCard>
                         <SectionCard title="Signal Sensitivity" description="Heuristic weight distribution.">
                            <div className="grid grid-cols-2 gap-4">
                               {Object.entries(twin.signals).slice(0, 6).map(([key, val]) => (
                                 <div key={key} className="p-3 rounded-lg bg-muted/30 border border-border flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground truncate mr-2">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="text-xs font-black">{val}</span>
                                 </div>
                               ))}
                            </div>
                         </SectionCard>
                      </div>
                   </div>
                </div>
              )}

              {view === "story" && (
                <div className="h-full flex flex-col animate-in slide-in-from-top-4 duration-1000 text-foreground">
                   <div className="flex items-center justify-between mb-8">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Operational Guided Mode</div>
                        <h1 className="text-3xl font-black">Storytelling Experience</h1>
                      </div>
                      <div className="flex items-center gap-3">
                         <select 
                            value={playbackSpeed} 
                            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                            className="h-10 rounded-md border border-border bg-background text-xs px-3 font-bold uppercase tracking-widest outline-none"
                          >
                            <option value={0.5}>0.5x Speed</option>
                            <option value={1}>1.0x Speed</option>
                            <option value={2}>2.0x Speed</option>
                          </select>
                          <button 
                            onClick={() => setAutoplay(!autoplay)}
                            className={`h-10 px-6 rounded-md font-black text-xs uppercase tracking-widest transition-all ${autoplay ? 'bg-red-500 text-white' : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'}`}
                          >
                             {autoplay ? 'Halt Replay' : 'Launch Demo'}
                          </button>
                      </div>
                   </div>

                   <div className="flex-1 glass-panel border-primary/20 bg-primary/5 p-8 flex flex-col">
                      <div className="flex-1">
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
                      </div>
                      <div className="mt-8 grid grid-cols-5 gap-4 shrink-0">
                         {primaryMetrics.map(m => (
                            <div key={m.label} className="p-4 rounded-xl border border-border bg-background/50 backdrop-blur-sm space-y-2">
                               <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{m.label}</div>
                               <div className="text-xl font-black">{m.value}%</div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}

              {view === "devvit" && (
                <div className="space-y-8 animate-in fade-in duration-500 text-foreground">
                   <div className="space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Technical Infrastructure</div>
                      <h1 className="text-4xl font-extrabold tracking-tight">Platform Operations</h1>
                   </div>

                   <SectionCard title="Devvit Integration Layer" description="Native SDK architecture and deployment status.">
                      <DevvitOpsPanel devvit={twin.devvit} workflows={twin.workflows} events={twin.events} />
                   </SectionCard>
                   
                   <div className="grid gap-8 lg:grid-cols-3">
                      <div className="lg:col-span-2">
                        <SectionCard title="Ingestion Health" description="Real-time processing queue diagnostic.">
                           <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/10">
                              <div className="text-center space-y-4">
                                 <Terminal className="h-8 w-8 text-primary mx-auto opacity-50" />
                                 <div className="text-sm text-muted-foreground font-mono">SIGNAL_ENGINE: nominal_status [200 OK]</div>
                                 <div className="flex gap-2 justify-center">
                                    <div className="h-1.5 w-12 bg-emerald-500 rounded-full" />
                                    <div className="h-1.5 w-12 bg-emerald-500 rounded-full" />
                                    <div className="h-1.5 w-12 bg-emerald-500/30 rounded-full animate-pulse" />
                                 </div>
                              </div>
                           </div>
                        </SectionCard>
                      </div>
                      <SectionCard title="Redis State" description="Persistent state buffer.">
                         <div className="space-y-4">
                            <div className="flex justify-between text-xs font-mono">
                               <span className="text-muted-foreground">Uptime:</span>
                               <span>482h 12m</span>
                            </div>
                            <div className="flex justify-between text-xs font-mono">
                               <span className="text-muted-foreground">State Size:</span>
                               <span>1.4MB</span>
                            </div>
                            <div className="flex justify-between text-xs font-mono">
                               <span className="text-muted-foreground">Event Count:</span>
                               <span>24,812</span>
                            </div>
                         </div>
                      </SectionCard>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Footer Bar */}
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
