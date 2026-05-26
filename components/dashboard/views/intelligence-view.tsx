"use client";

import { SectionCard } from "@/components/ui/section-card";
import { CommunityDna } from "@/components/dashboard/community-dna";
import { CommunityTwin } from "@/types";
import { Search, BrainCircuit, Activity } from "lucide-react";

type IntelligencePageProps = {
  twin: CommunityTwin;
};

export function IntelligencePage({ twin }: IntelligencePageProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 text-foreground pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/40 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/80">Behavioral Intelligence</div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-balance">
            Community <span className="text-muted-foreground font-light italic">DNA Analysis</span>
          </h1>
        </div>
        <div className="hidden lg:flex items-center gap-4 bg-muted/20 px-6 py-3 rounded-xl border border-border/40">
           <BrainCircuit className="h-5 w-5 text-primary opacity-60" />
           <div className="text-right">
              <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Model Complexity</div>
              <div className="text-xs font-black tabular-nums">48-Vector Heuristic</div>
           </div>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <SectionCard title="Behavioral Fingerprint" description="Interaction pattern mapping across core community dimensions.">
          <div className="pt-4 h-[440px]">
            <CommunityDna personality={twin.personality} />
          </div>
        </SectionCard>

        <div className="flex flex-col gap-10">
          <SectionCard title="Classification Profile" description="Automated community personality mapping.">
            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20 space-y-6 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="h-24 w-24" />
               </div>
               <div className="space-y-2 relative z-10">
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Dominant Persona</div>
                 <div className="text-4xl font-black tracking-tighter">{twin.personality.type}</div>
               </div>
               <p className="text-base text-muted-foreground leading-relaxed font-medium relative z-10">{twin.personality.rationale}</p>
            </div>
          </SectionCard>

          <SectionCard title="Metric Sensitivity" description="Heuristic weight distribution for current node.">
            <div className="grid grid-cols-2 gap-4 pt-2">
              {Object.entries(twin.signals).slice(0, 8).map(([key, val]) => (
                <div key={key} className="group p-4 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-between transition-all hover:border-primary/30 hover:bg-muted/40 cursor-default">
                  <span className="text-[10px] font-black uppercase text-muted-foreground/60 truncate mr-3 tracking-widest group-hover:text-primary transition-colors">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-sm font-black tabular-nums">{val}%</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
