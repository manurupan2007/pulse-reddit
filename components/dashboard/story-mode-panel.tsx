"use client";

import { Play, Pause, Radio, Sparkles, BookOpen, ChevronLeft, ChevronRight, FastForward } from "lucide-react";
import { memo } from "react";

import { ExperienceMode, StoryStep } from "@/types";

type StoryModePanelProps = {
  steps: StoryStep[];
  storyIndex: number;
  experienceMode: ExperienceMode;
  autoplay: boolean;
  onJump: (index: number) => void;
  onToggleAutoplay: (next: boolean) => void;
  onSetMode: (mode: ExperienceMode) => void;
  stepForward: () => void;
  stepBackward: () => void;
};

export const StoryModePanel = memo(function StoryModePanel({
  steps,
  storyIndex,
  experienceMode,
  autoplay,
  onJump,
  onToggleAutoplay,
  onSetMode,
  stepForward,
  stepBackward
}: StoryModePanelProps) {
  const activeStep = steps[storyIndex] ?? steps[0];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-primary/10 bg-primary/5 p-6 space-y-6 relative overflow-hidden">
          {/* Animated Background Pulse for Active Step */}
          {autoplay && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}
          
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              Guided Walkthrough
            </div>
            <div className="flex items-center gap-1.5">
               {steps.map((_, i) => (
                  <div key={i} className={`h-1 w-4 rounded-full transition-all ${i === storyIndex ? 'bg-primary w-8' : 'bg-muted'}`} />
               ))}
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="grid grid-cols-2 gap-2">
               <button
                  onClick={() => onSetMode(experienceMode === "operator" ? "story" : "operator")}
                  className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-xs font-bold transition-all hover:bg-muted/50"
                >
                  <BookOpen className="h-4 w-4" />
                  {experienceMode === "operator" ? "Enable" : "Disable"}
                </button>
                <button
                  onClick={() => onToggleAutoplay(!autoplay)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-xs font-bold transition-all ${autoplay ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted/50'}`}
                >
                  {autoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {autoplay ? "Pause" : "Resume"}
                </button>
            </div>
            
            <div className="flex items-center justify-between gap-2">
               <button onClick={stepBackward} className="flex-1 flex items-center justify-center h-10 rounded-md border border-border bg-background hover:bg-muted transition-colors">
                  <ChevronLeft className="h-4 w-4" />
               </button>
               <button onClick={stepForward} className="flex-1 flex items-center justify-center h-10 rounded-md border border-border bg-background hover:bg-muted transition-colors">
                  <ChevronRight className="h-4 w-4" />
               </button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background p-5 space-y-4 shadow-sm relative z-10 min-h-[160px] flex flex-col justify-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Beat</div>
            <h3 className="text-xl font-black tracking-tight leading-tight">{activeStep?.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{activeStep?.body}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onJump(index)}
            className={`rounded-xl border p-5 text-left transition-all group shrink-0 ${
              index === storyIndex
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "border-border bg-card/40 hover:bg-card/60"
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className={`text-sm font-bold tracking-tight ${index === storyIndex ? 'text-primary' : 'text-foreground'}`}>
                {step.title}
              </span>
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                <Radio className={`h-3 w-3 ${index === storyIndex ? 'text-primary' : ''}`} />
                {step.focus}
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">{step.body}</p>
          </button>
        ))}
      </div>
    </div>
  );
});
