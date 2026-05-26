"use client";

import { motion } from "framer-motion";

type MetricCardProps = {
  label: string;
  value: number;
  tone: "accent" | "cyan" | "magenta" | "lime" | "amber" | "danger";
  detail: string;
};

const toneColors = {
  accent: "text-sky-500 stroke-sky-500",
  cyan: "text-cyan-500 stroke-cyan-500",
  magenta: "text-fuchsia-500 stroke-fuchsia-500",
  lime: "text-lime-500 stroke-lime-500",
  amber: "text-amber-500 stroke-amber-500",
  danger: "text-red-500 stroke-red-500"
};

export function MetricCard({ label, value, tone, detail }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel p-5 border border-border bg-card/40 flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
          <div className="text-[10px] leading-relaxed text-muted-foreground/80 font-medium">{detail}</div>
        </div>
        
        <div className="relative h-14 w-14 shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="stroke-muted/10"
              strokeWidth="10"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className={`${toneColors[tone]} transition-all duration-700 ease-out`}
              strokeWidth="10"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * value) / 100}
              strokeLinecap="round"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold tracking-tight">
            {value}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
