"use client";

import { motion } from "framer-motion";

import { ScenarioOutcome } from "@/types";

type CascadeViewProps = {
  outcome: ScenarioOutcome;
};

export function CascadeView({ outcome }: CascadeViewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card/40 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Conflict Wave</div>
          <div className="text-sm font-bold">
            Backlash Risk: <span className="text-red-500">{outcome.backlashProbability}%</span>
          </div>
        </div>
        <ConflictWave outcome={outcome} />
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Propagation Map</div>
          <div className="text-sm font-bold text-foreground">{outcome.cascadeMap.headline}</div>
        </div>
        <PropagationMap outcome={outcome} />
        <div className="mt-4 flex flex-col gap-2">
          {outcome.cascadeMap.notes.map((note) => (
            <div key={note} className="text-xs text-muted-foreground leading-relaxed flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-border shrink-0" />
              {note}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {outcome.cascade.map((node, index) => (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="rounded-xl border border-border bg-card/40 p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold tracking-tight">{node.label}</div>
                <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{node.note}</div>
              </div>
              <div className="text-xl font-black tabular-nums">{node.after}</div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <Meter label="Before" value={node.before} tone="from-red-500 to-amber-500" />
              <div className="text-center text-[10px] font-black tracking-widest text-muted-foreground px-2">
                SHIFT
              </div>
              <Meter label="After" value={node.after} tone="from-sky-500 to-blue-500" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Meter({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted/20">
        <div className={`h-full rounded-full bg-gradient-to-r ${tone} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ConflictWave({ outcome }: { outcome: ScenarioOutcome }) {
  const pathBefore = "M0,84 C60,10 120,140 180,74 C240,16 300,136 360,70 C420,18 480,124 540,52";
  const pathAfter = `M0,88 C60,${100 - outcome.backlashProbability} 120,108 180,${80 - outcome.sentimentTrajectory} C240,54 300,${110 - outcome.backlashProbability} 360,70 C420,${62 - outcome.engagementChange} 480,96 540,${96 - outcome.toxicityReduction}`;

  return (
    <svg viewBox="0 0 540 140" className="h-32 w-full">
      <defs>
        <linearGradient id="waveBefore" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="waveAfter" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <path d={pathBefore} fill="none" stroke="url(#waveBefore)" strokeWidth="2" strokeOpacity="0.2" />
      <motion.path
        d={pathAfter}
        fill="none"
        stroke="url(#waveAfter)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );
}

function PropagationMap({ outcome }: { outcome: ScenarioOutcome }) {
  const nodeById = new Map(outcome.cascadeMap.nodes.map((node) => [node.id, node]));

  return (
    <svg viewBox="0 0 560 188" className="h-44 w-full overflow-visible">
      <defs>
        <linearGradient id="spreadLink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="containLink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {outcome.cascadeMap.links.map((link) => {
        const from = nodeById.get(link.from);
        const to = nodeById.get(link.to);
        if (!from || !to) {
          return null;
        }

        const controlX = (from.x + to.x) / 2;
        const path = `M${from.x},${from.y} C${controlX},${from.y} ${controlX},${to.y} ${to.x},${to.y}`;

        return (
          <motion.path
            key={`${link.from}-${link.to}`}
            d={path}
            fill="none"
            stroke={link.effect === "contain" ? "url(#containLink)" : "url(#spreadLink)"}
            strokeWidth={Math.max(1.5, link.strength / 25)}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        );
      })}

      {outcome.cascadeMap.nodes.map((node, index) => {
        const color =
          node.tier === "containment"
            ? "#0ea5e9"
            : node.tier === "amplifier"
              ? "#f59e0b"
              : node.tier === "reaction"
                ? "#d946ef"
                : "#ef4444";

        return (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={8 + node.intensity / 10}
              fill={color}
              fillOpacity="0.1"
              stroke={color}
              strokeWidth="1"
            />
            <circle cx={node.x} cy={node.y} r={2.5 + node.intensity / 20} fill={color} />
            <text x={node.x} y={node.y + 32} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold uppercase tracking-tight">
              {node.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
