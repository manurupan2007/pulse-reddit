"use client";

import { Terminal } from "lucide-react";
import { SectionCard } from "@/components/ui/section-card";
import { DevvitOpsPanel } from "@/components/dashboard/devvit-ops-panel";
import { CommunityTwin, CommunityEvent, ModeratorWorkflow } from "@/types";

type DevvitPageProps = {
  twin: CommunityTwin;
  workflows: ModeratorWorkflow[];
  events: CommunityEvent[];
};

export function DevvitPage({ twin, workflows, events }: DevvitPageProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-foreground">
      <div className="space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Technical Infrastructure</div>
        <h1 className="text-4xl font-extrabold tracking-tight">Platform Operations</h1>
      </div>

      <SectionCard title="Devvit Integration Layer" description="Native SDK architecture and deployment status.">
        <DevvitOpsPanel devvit={twin.devvit} workflows={workflows} events={events} />
      </SectionCard>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="Ingestion Health" description="Real-time processing queue diagnostic.">
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/10 transition-all hover:bg-muted/20 group">
              <div className="text-center space-y-4">
                <Terminal className="h-8 w-8 text-primary mx-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="text-sm text-muted-foreground font-mono">SIGNAL_ENGINE: nominal_status [200 OK]</div>
                <div className="flex gap-2 justify-center">
                  <div className="h-1.5 w-12 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <div className="h-1.5 w-12 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <div className="h-1.5 w-12 bg-emerald-500/30 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
        <SectionCard title="Redis State" description="Persistent state buffer.">
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-mono p-2 rounded bg-background/50 border border-border">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="text-primary">482h 12m</span>
            </div>
            <div className="flex justify-between text-xs font-mono p-2 rounded bg-background/50 border border-border">
              <span className="text-muted-foreground">State Size:</span>
              <span className="text-primary">1.4MB</span>
            </div>
            <div className="flex justify-between text-xs font-mono p-2 rounded bg-background/50 border border-border">
              <span className="text-muted-foreground">Event Count:</span>
              <span className="text-primary">24,812</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
