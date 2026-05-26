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
  YAxis,
  LineChart
} from "recharts";

import { ForecastPoint } from "@/types";

type ForecastTimelineProps = {
  forecast: ForecastPoint[];
};

export function ForecastTimeline({ forecast }: ForecastTimelineProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Next 6h",
            value: forecast[1].conflict,
            detail: "Conflict Pressure",
            color: "text-red-500"
          },
          {
            label: "Next 24h",
            value: forecast[3].workload,
            detail: "Moderator Load",
            color: "text-amber-500"
          },
          {
            label: "Next 72h",
            value: forecast[5].engagement,
            detail: "User Retention",
            color: "text-sky-500"
          }
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-card/40 p-5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
            <div className="flex items-end justify-between">
              <span className={`text-3xl font-black tabular-nums tracking-tight ${item.color}`}>{item.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="h-[340px] rounded-xl border border-border bg-muted/10 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast}>
            <defs>
              <linearGradient id="primaryFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
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
              itemStyle={{ padding: "2px 0" }}
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
              dataKey="toxicity"
              name="Toxicity"
              stroke="#ef4444"
              strokeWidth={2}
              fill="rgba(239, 68, 68, 0.05)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="engagement"
              name="Engagement"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="rgba(14, 165, 233, 0.05)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="workload"
              name="Workload"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="rgba(245, 158, 11, 0.05)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="quality"
              name="Quality"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
