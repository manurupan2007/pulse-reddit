"use client";

import { Keyboard, Activity, Radio, AlertTriangle } from "lucide-react";
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
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700 text-foreground pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/40 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-500/80">Operational Monitoring</div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-balance">
            Live <span className="text-muted-foreground font-light italic">Mission Control</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end gap-1">
              <div className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest">Ingestion Node</div>
              <div className="flex items-center gap-2">
                 <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
                 <span className="text-sm font-black tabular-nums">US-EAST-1</span>
              </div>
           </div>
           <div className="h-10 w-[1px] bg-border/40 mx-2" />
           <div className="bg-muted/20 px-6 py-3 rounded-xl border border-border/40 flex items-center gap-4">
              <Activity className="h-5 w-5 text-sky-500 opacity-60" />
              <div className="text-right">
                 <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Global Pressure</div>
                 <div className="text-xl font-black tabular-nums">{twin.scores.communityPressure}%</div>
              </div>
           </div>
        </div>
      </div>
      
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <SectionCard 
            title="Real-time Pressure Radar" 
            description="Rolling volatility and stress analysis with high-fidelity signal correlation."
            className="bg-card/20 backdrop-blur-sm border-sky-500/10"
          >
            <div className="pt-4 h-[440px]">
              <PressureRadar history={twin.pressureHistory} />
            </div>
          </SectionCard>

          <SectionCard 
            title="Temporal Activity Mapping" 
            description="Activity patterns and surge detection for staffing optimization."
          >
            <div className="pt-4 overflow-hidden rounded-xl">
              <ActivityHeatmap heatmap={twin.heatmap} />
            </div>
          </SectionCard>
        </div>

        <div className="flex flex-col gap-10">
          <SectionCard 
            title="Live Operational Stream" 
            description="Native event ingestion from Reddit triggers."
            className="flex-1"
          >
            <div className="h-[680px] overflow-y-auto custom-scrollbar pr-3 pt-2">
              <EventFeed events={twin.events} />
            </div>
          </SectionCard>

          <div className="glass-panel p-8 space-y-8 shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/50 to-transparent opacity-40" />
            <div className="flex items-center justify-between border-b border-border/40 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Overrides</span>
                <div className="text-[9px] text-muted-foreground/60 uppercase font-black">Authorized Personnel Only</div>
              </div>
              <Keyboard className="h-5 w-5 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="grid gap-3 pt-2">
              <ShortcutItem label="D" action="Launch Story" />
              <ShortcutItem label="L" action="Toggle Node" />
              <ShortcutItem label="R" action="Emergency Halt" />
            </div>
            
            <div className="mt-8 p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-start gap-4">
               <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 opacity-40" />
               <p className="text-[10px] text-red-500/70 leading-relaxed font-bold uppercase tracking-wider">
                  Caution: Manual signal overrides will distort historical heuristic modeling for 24 hours.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortcutItem({ label, action }: { label: string; action: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/20 border border-border/40 text-[10px] font-black uppercase tracking-wider transition-all hover:border-primary/40 hover:bg-muted/40 cursor-default group">
      <span className="text-muted-foreground/60 group-hover:text-foreground transition-colors">{action}</span>
      <kbd className="px-2.5 py-1 rounded-md border border-border/60 bg-background/80 text-foreground/80 font-mono shadow-inner">
        {label}
      </kbd>
    </div>
  );
}
