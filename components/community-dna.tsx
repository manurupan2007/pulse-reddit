"use client";

import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer
} from "recharts";

import { PersonalityBreakdown } from "@/lib/types";

type CommunityDnaProps = {
  personality: PersonalityBreakdown;
};

export function CommunityDna({ personality }: CommunityDnaProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="h-[280px] rounded-2xl border border-white/10 bg-white/[0.02] p-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={personality.scores} outerRadius="72%">
            <PolarGrid stroke="rgba(255,255,255,0.12)" />
            <PolarAngleAxis
              dataKey="trait"
              tick={{ fill: "rgba(236,245,255,0.76)", fontSize: 11, letterSpacing: 1 }}
            />
            <Radar
              dataKey="value"
              stroke="#37f4ff"
              strokeWidth={2}
              fill="rgba(55,244,255,0.24)"
              fillOpacity={1}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-accent/20 bg-accent/10 p-4"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-accent/80">Primary Type</div>
          <div className="mt-3 font-display text-2xl text-white">{personality.type}</div>
          <p className="mt-3 text-sm leading-6 text-[#c6dafb]">{personality.rationale}</p>
        </motion.div>

        <div className="grid gap-3">
          {personality.scores.map((trait) => (
            <div key={trait.trait}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted">{trait.trait}</span>
                <span className="font-display text-white">{trait.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${trait.value}%` }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className="h-full rounded-full bg-gradient-to-r from-accent via-cyan to-magenta"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
