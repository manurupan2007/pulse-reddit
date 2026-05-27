"use client";

import { StoryModePanel } from "@/components/dashboard/story-mode-panel";
import { CommunityTwin, DashboardView, ExperienceMode } from "@/types";
import { PlayCircle, FastForward, Info } from "lucide-react";

type StoryPageProps = {
  twin: CommunityTwin;
  storyIndex: number;
  experienceMode: ExperienceMode;
  autoplay: boolean;
  jumpToStory: (index: number) => void;
  setAutoplay: (next: boolean) => void;
  setExperienceMode: (mode: ExperienceMode) => void;
  stepForward: () => void;
  stepBackward: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  primaryMetrics: Array<{ label: string; value: number; tone: any; detail: string }>;
};

export function StoryPage({
  twin,
  storyIndex,
  experienceMode,
  autoplay,
  jumpToStory,
  setAutoplay,
  setExperienceMode,
  stepForward,
  stepBackward,
  playbackSpeed,
  setPlaybackSpeed,
  primaryMetrics
}: StoryPageProps) {
  return (
    <div className="h-full flex flex-col animate-in fade-in duration-1000 text-foreground pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/40 pb-10 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Guided Demonstration</div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-balance">
            Operational <span className="text-muted-foreground font-light italic">Walkthrough</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-xl bg-muted/20 border border-border/40">
             <Info className="h-4 w-4 text-primary opacity-60" />
             <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">
                Interactive Narrative Mode
             </div>
          </div>
          <div className="h-10 w-[1px] bg-border/40 mx-2 hidden sm:block" />
          <div className="flex items-center gap-3">
            <select 
              value={playbackSpeed} 
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="h-12 rounded-xl border border-border bg-background text-[11px] px-4 font-black uppercase tracking-widest outline-none transition-all hover:bg-muted focus:ring-1 focus:ring-primary/40"
            >
              <option value={0.5}>0.5x Speed</option>
              <option value={1}>1.0x Speed</option>
              <option value={2}>2.0x Speed</option>
            </select>
            <button 
              onClick={() => setAutoplay(!autoplay)}
              className={`h-12 px-8 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 ${autoplay ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-primary text-primary-foreground shadow-primary/20 hover:brightness-110'}`}
            >
              {autoplay ? 'Halt Replay' : 'Launch Demo'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 glass-panel border-primary/20 bg-primary/[0.01] p-10 flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="flex-1 relative z-10">
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

        <div className="mt-12 grid grid-cols-5 gap-6 shrink-0 relative z-10 border-t border-border/40 pt-10">
          {primaryMetrics.map(m => (
            <div key={m.label} className="p-6 rounded-2xl border border-border/40 bg-background/40 backdrop-blur-xl space-y-3 transition-all hover:border-primary/20 hover:bg-background/60 shadow-inner group/item">
              <div className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.25em] group-hover/item:text-primary transition-colors">{m.label}</div>
              <div className="text-3xl font-black tracking-tighter tabular-nums">{m.value}%</div>
              <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden">
                 <div className="h-full bg-primary/40 w-full animate-pulse" style={{ width: `${m.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
