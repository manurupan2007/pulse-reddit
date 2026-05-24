"use client";

import { Play, Radio, Sparkles } from "lucide-react";

import { ExperienceMode, StoryStep } from "@/lib/types";

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
    <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-2xl border border-accent/15 bg-accent/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4 text-accent" />
            Storytelling mode
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-muted">
            {experienceMode}
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() => onSetMode(experienceMode === "operator" ? "story" : "operator")}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white transition-transform duration-300 hover:-translate-y-0.5"
          >
            Toggle guided walkthrough
          </button>
          <button
            type="button"
            onClick={() => onToggleAutoplay(!autoplay)}
            className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white transition-transform duration-300 hover:-translate-y-0.5"
          >
            <Play className="h-4 w-4 text-accent" />
            {autoplay ? "Pause autoplay" : "Start autoplay"}
          </button>
          <div className="rounded-2xl border border-white/10 bg-[#081224]/80 p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-muted">Active beat</div>
            <div className="mt-3 font-display text-xl text-white">{activeStep?.title}</div>
            <p className="mt-3 text-sm leading-6 text-muted">{activeStep?.body}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => onJump(index)}
            className={`rounded-2xl border p-4 text-left transition-transform duration-300 hover:-translate-y-0.5 ${
              index === storyIndex
                ? "border-accent/35 bg-accent/10"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-white">{step.title}</div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted">
                <Radio className="h-3 w-3" />
                {step.focus}
              </div>
            </div>
            <div className="text-sm leading-6 text-muted">{step.body}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
