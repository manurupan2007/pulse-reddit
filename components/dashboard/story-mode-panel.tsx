"use client";

import { Play, Pause, Radio, Sparkles, BookOpen } from "lucide-react";

import { ExperienceMode, StoryStep } from "@/types";

type StoryModePanelProps = {
  steps: StoryStep[];
  storyIndex: number;
  experienceMode: ExperienceMode;
  autoplay: boolean;
  onJump: (index: number) => void;
  onToggleAutoplay: (next: boolean) => void;
  onSetMode: (mode: ExperienceMode) => void;
};

export function StoryModePanel({
  steps,
  storyIndex,
  experienceMode,
  autoplay,
  onJump,
  onToggleAutoplay,
  onSetMode
}: StoryModePanelProps) {
  const activeStep = steps[storyIndex] ?? steps[0];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-primary/10 bg-primary/5 p-6 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-4 w-4" />
              Guided Walkthrough
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
              {experienceMode}
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onSetMode(experienceMode === "operator" ? "story" : "operator")}
              className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm font-bold transition-all hover:bg-muted/50"
            >
              <span>{experienceMode === "operator" ? "Enable" : "Disable"} guided mode</span>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => onToggleAutoplay(!autoplay)}
              className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-bold transition-all ${autoplay ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted/50'}`}
            >
              <span>{autoplay ? "Pause Autoplay" : "Resume Autoplay"}</span>
              {autoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </div>

          <div className="rounded-lg border border-border bg-background p-5 space-y-4 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Beat</div>
            <h3 className="text-xl font-black tracking-tight leading-tight">{activeStep?.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{activeStep?.body}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onJump(index)}
            className={`rounded-xl border p-5 text-left transition-all group ${
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
                Focus: {step.focus}
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{step.body}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
