"use client";

import { SectionCard } from "@/components/ui/section-card";
import { CommunityDna } from "@/components/dashboard/community-dna";
import { CommunityTwin } from "@/types";

type IntelligencePageProps = {
  twin: CommunityTwin;
};

export function IntelligencePage({ twin }: IntelligencePageProps) {
  return (
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
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4 shadow-inner">
              <div className="text-3xl font-black tracking-tighter">{twin.personality.type}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{twin.personality.rationale}</p>
            </div>
          </SectionCard>
          <SectionCard title="Signal Sensitivity" description="Heuristic weight distribution.">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(twin.signals).slice(0, 10).map(([key, val]) => (
                <div key={key} className="p-3 rounded-lg bg-muted/30 border border-border flex items-center justify-between transition-colors hover:bg-muted/50">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground truncate mr-2">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-xs font-black">{val}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
