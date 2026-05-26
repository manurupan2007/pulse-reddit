"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts";

import { PressurePoint } from "@/lib/types";

type PressureRadarProps = {
  history: PressurePoint[];
};

export function PressureRadar({ history }: PressureRadarProps) {
  const current = history.at(-2) ?? history.at(-1) ?? history[0];
  const future = history.at(-1) ?? history[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <PressureStat label="Current pressure" value={current?.pressure ?? 0} color="text-sky-500" />
        <PressureStat label="Volatility field" value={current?.volatility ?? 0} color="text-fuchsia-500" />
        <PressureStat label="Forward load" value={future?.interventionLoad ?? 0} color="text-amber-500" />
      </div>
      <div className="h-[300px] rounded-xl border border-border bg-muted/10 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="pressureFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="volatilityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d946ef" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#d946ef" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis 
              dataKey="label" 
              tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}
            />
            <Area
              type="monotone"
              dataKey="pressure"
              name="Pressure"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#pressureFill)"
            />
            <Area
              type="monotone"
              dataKey="volatility"
              name="Volatility"
              stroke="#d946ef"
              strokeWidth={2}
              fill="url(#volatilityFill)"
            />
            <Area
              type="monotone"
              dataKey="interventionLoad"
              name="Intervention"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="transparent"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PressureStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-5 space-y-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-3xl font-black tabular-nums tracking-tight ${color}`}>{value}</div>
    </div>
  );
}
