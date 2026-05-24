"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { PressurePoint } from "@/lib/types";

type PressureRadarProps = {
  history: PressurePoint[];
};

export function PressureRadar({ history }: PressureRadarProps) {
  const current = history.at(-2) ?? history.at(-1) ?? history[0];
  const future = history.at(-1) ?? history[0];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <PressureStat label="Current pressure" value={current?.pressure ?? 0} />
        <PressureStat label="Volatility field" value={current?.volatility ?? 0} />
        <PressureStat label="Forward load" value={future?.interventionLoad ?? 0} />
      </div>
      <div className="h-[300px] rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="pressureField" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#37f4ff" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#37f4ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="volatilityField" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c767ff" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#c767ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "rgba(236,245,255,0.72)", fontSize: 12 }} />
            <YAxis tick={{ fill: "rgba(236,245,255,0.58)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "rgba(6,12,26,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18
              }}
            />
            <Area
              type="monotone"
              dataKey="pressure"
              stroke="#37f4ff"
              strokeWidth={2}
              fill="url(#pressureField)"
            />
            <Area
              type="monotone"
              dataKey="volatility"
              stroke="#c767ff"
              strokeWidth={2}
              fill="url(#volatilityField)"
            />
            <Area
              type="monotone"
              dataKey="interventionLoad"
              stroke="#ffbd59"
              strokeWidth={2}
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PressureStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-[0.28em] text-muted">{label}</div>
      <div className="mt-3 font-display text-3xl text-white">{value}</div>
    </div>
  );
}
