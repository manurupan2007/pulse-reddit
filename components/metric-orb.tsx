"use client";

import { motion } from "framer-motion";

type MetricOrbProps = {
  label: string;
  value: number;
  tone: "accent" | "cyan" | "magenta" | "lime" | "amber" | "danger";
  detail: string;
};

const toneMap = {
  accent: "rgba(55,244,255,0.95)",
  cyan: "rgba(85,169,255,0.95)",
  magenta: "rgba(199,103,255,0.95)",
  lime: "rgba(141,255,149,0.95)",
  amber: "rgba(255,189,89,0.95)",
  danger: "rgba(255,111,145,0.95)"
};

export function MetricOrb({ label, value, tone, detail }: MetricOrbProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="glass-panel rounded-tile relative overflow-hidden p-4"
    >
      <div
        className="absolute inset-x-4 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${toneMap[tone]}, transparent)`
        }}
      />
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-muted">{label}</div>
          <div className="mt-2 text-sm leading-6 text-muted">{detail}</div>
        </div>
        <div
          className="metric-ring grid h-20 w-20 place-items-center rounded-full border border-white/10"
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.18), transparent 58%), conic-gradient(from 180deg, rgba(255,255,255,0.08), ${toneMap[tone]} ${value}%, rgba(255,255,255,0.08) 0)`
          }}
        >
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#071222]/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <span className="font-display text-lg text-white">{value}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
