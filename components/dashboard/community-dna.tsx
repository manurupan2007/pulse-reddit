"use client";

import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer
} from "recharts";

import { PersonalityBreakdown } from "@/types";

type CommunityDnaProps = {
  personality: PersonalityBreakdown;
};

export function CommunityDna({ personality }: CommunityDnaProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="h-[300px] rounded-xl border border-border bg-muted/10 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={personality.scores} outerRadius="80%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="trait"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 600 }}
            />
            <Radar
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="var(--primary)"
              fillOpacity={0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col justify-center gap-6">
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-border bg-card/60 p-5 space-y-3"
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Classification</div>
          <div className="text-2xl font-black tracking-tight">{personality.type}</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{personality.rationale}</p>
        </motion.div>

        <div className="grid gap-4">
          {personality.scores.map((trait) => (
            <div key={trait.trait} className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                <span className="text-muted-foreground">{trait.trait}</span>
                <span className="tabular-nums">{trait.value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${trait.value}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
