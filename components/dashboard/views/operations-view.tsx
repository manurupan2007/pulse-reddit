"use client";

import { Keyboard } from "lucide-react";
import { SectionCard } from "@/components/ui/section-card";
import { PressureRadar } from "@/components/dashboard/pressure-radar";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { EventFeed } from "@/components/dashboard/event-feed";
import { CommunityTwin } from "@/types";

type OperationsPageProps = {
  twin: CommunityTwin;
};

export function OperationsPage({ twin }: OperationsPageProps) {
  return (
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
