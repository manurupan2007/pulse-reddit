"use client";

import { StoryModePanel } from "@/components/dashboard/story-mode-panel";
import { CommunityTwin, DashboardView, ExperienceMode } from "@/types";

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
            className="h-10 rounded-md border border-border bg-background text-xs px-3 font-bold uppercase tracking-widest outline-none transition-all hover:bg-muted"
          >
            <option value={0.5}>0.5x Speed</option>
            <option value={1}>1.0x Speed</option>
            <option value={2}>2.0x Speed</option>
          </select>
          <button 
            onClick={() => setAutoplay(!autoplay)}
            className={`h-10 px-6 rounded-md font-black text-xs uppercase tracking-widest transition-all ${autoplay ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:brightness-110'}`}
          >
            {autoplay ? 'Halt Replay' : 'Launch Demo'}
          </button>
        </div>
      </div>

      <div className="flex-1 glass-panel border-primary/20 bg-primary/5 p-8 flex flex-col shadow-2xl">
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
            <div key={m.label} className="p-4 rounded-xl border border-border bg-background/50 backdrop-blur-sm space-y-2 transition-transform hover:scale-105">
              <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{m.label}</div>
              <div className="text-xl font-black">{m.value}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
