"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { ForecastPoint } from "@/lib/types";

type ForecastTimelineProps = {
  forecast: ForecastPoint[];
};

export function ForecastTimeline({ forecast }: ForecastTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {[
          {
            label: "Next 6h",
            value: forecast[1].conflict,
            detail: "Conflict pressure"
          },
          {
            label: "Next 24h",
            value: forecast[3].workload,
            detail: "Mod load"
          },
          {
            label: "Next 3d",
            value: forecast[5].engagement,
            detail: "Engagement hold"
          }
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-muted">{item.label}</div>
            <div className="mt-3 flex items-end justify-between">
              <div className="font-display text-3xl text-white">{item.value}</div>
              <div className="text-sm text-muted">{item.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-[320px] rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast}>
            <defs>
              <linearGradient id="toxicityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6f91" stopOpacity={0.36} />
                <stop offset="100%" stopColor="#ff6f91" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="engagementFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#37f4ff" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#37f4ff" stopOpacity={0} />
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
            <Legend />
            <Area
              type="monotone"
              dataKey="toxicity"
              stroke="#ff6f91"
              strokeWidth={2}
              fill="url(#toxicityFill)"
            />
            <Area
              type="monotone"
              dataKey="engagement"
              stroke="#37f4ff"
              strokeWidth={2}
              fill="url(#engagementFill)"
            />
            <Line
              type="monotone"
              dataKey="workload"
              stroke="#8dff95"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="#c767ff"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="quality"
              stroke="#ffbd59"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
