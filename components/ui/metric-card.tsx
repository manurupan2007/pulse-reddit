"use client";

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

type MetricCardProps = {
  label: string;
  value: number;
  tone: "accent" | "cyan" | "magenta" | "lime" | "amber" | "danger";
  detail: string;
};

const toneColors = {
  accent: "text-sky-500 stroke-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.1)]",
  cyan: "text-cyan-500 stroke-cyan-500",
  magenta: "text-fuchsia-500 stroke-fuchsia-500",
  lime: "text-lime-500 stroke-lime-500",
  amber: "text-amber-500 stroke-amber-500",
  danger: "text-red-500 stroke-red-500"
};

export const MetricCard = memo(function MetricCard({ label, value, tone, detail }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
    const interval = setInterval(() => {
      const jitter = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      setDisplayValue(prev => {
         const next = value + jitter;
         return Math.max(0, Math.min(100, next));
      });
    }, 2000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel p-5 border border-border/60 bg-card/40 flex flex-col justify-between min-h-[140px] hover:scale-[1.02] transition-transform cursor-default group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">{label}</div>
          <div className="text-[11px] leading-relaxed text-muted-foreground/90 font-medium line-clamp-2">{detail}</div>
        </div>
        
        <div className="relative h-14 w-14 shrink-0">
          <svg className="h-full w-full -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
            <circle
              className="stroke-muted/10"
              strokeWidth="10"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <motion.circle
              className={`${toneColors[tone]}`}
              strokeWidth="10"
              strokeDasharray={251.2}
              animate={{ strokeDashoffset: 251.2 - (251.2 * displayValue) / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-black tracking-tighter tabular-nums text-foreground group-hover:text-primary-foreground group-hover:scale-110 transition-all">
            {displayValue}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
