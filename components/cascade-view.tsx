"use client";

import { motion } from "framer-motion";

import { ScenarioOutcome } from "@/lib/types";

type CascadeViewProps = {
  outcome: ScenarioOutcome;
};

export function CascadeView({ outcome }: CascadeViewProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.28em] text-muted">Conflict Wave</div>
          <div className="font-display text-sm text-white">
            Backlash risk {outcome.backlashProbability}%
          </div>
        </div>
        <ConflictWave outcome={outcome} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.28em] text-muted">Propagation Map</div>
          <div className="font-display text-sm text-white">{outcome.cascadeMap.headline}</div>
        </div>
        <PropagationMap outcome={outcome} />
        <div className="mt-4 grid gap-2">
          {outcome.cascadeMap.notes.map((note) => (
            <div key={note} className="text-sm leading-6 text-muted">
              {note}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {outcome.cascade.map((node, index) => (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06, duration: 0.45 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">{node.label}</div>
                <div className="mt-1 text-sm leading-6 text-muted">{node.note}</div>
              </div>
              <div className="font-display text-xl text-white">{node.after}</div>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <Meter label="Before" value={node.before} tone="from-danger to-amber" />
              <div className="text-center font-display text-sm tracking-[0.24em] text-accent">
                SHIFT
              </div>
              <Meter label="After" value={node.after} tone="from-accent to-cyan" />
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
    <div>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/5">
        <div className={`h-full rounded-full bg-gradient-to-r ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ConflictWave({ outcome }: { outcome: ScenarioOutcome }) {
  const before = 72;
  const after = Math.max(18, before - outcome.toxicityReduction * 0.8 + outcome.backlashProbability * 0.22);
  const pathBefore = "M0,84 C60,10 120,140 180,74 C240,16 300,136 360,70 C420,18 480,124 540,52";
  const pathAfter = `M0,88 C60,${110 - after} 120,108 180,${80 - outcome.sentimentTrajectory} C240,54 300,${110 - after} 360,70 C420,${62 - outcome.engagementChange} 480,96 540,${96 - outcome.toxicityReduction}`;

  return (
    <svg viewBox="0 0 540 140" className="h-32 w-full">
      <defs>
        <linearGradient id="waveBefore" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff6f91" />
          <stop offset="100%" stopColor="#ffbd59" />
        </linearGradient>
        <linearGradient id="waveAfter" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#37f4ff" />
          <stop offset="100%" stopColor="#55a9ff" />
        </linearGradient>
      </defs>
      <path d={pathBefore} fill="none" stroke="url(#waveBefore)" strokeWidth="3" strokeOpacity="0.32" />
      <motion.path
        d={pathAfter}
        fill="none"
        stroke="url(#waveAfter)"
        strokeWidth="4"
        initial={{ pathLength: 0.1, opacity: 0.2 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1 }}
      />
    </svg>
  );
}

function PropagationMap({ outcome }: { outcome: ScenarioOutcome }) {
  const nodeById = new Map(outcome.cascadeMap.nodes.map((node) => [node.id, node]));

  return (
    <svg viewBox="0 0 560 188" className="h-44 w-full">
      <defs>
        <linearGradient id="spreadLink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff6f91" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffbd59" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="containLink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#37f4ff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#55a9ff" stopOpacity="0.85" />
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
            strokeWidth={Math.max(2, link.strength / 20)}
            strokeLinecap="round"
            initial={{ pathLength: 0.1, opacity: 0.15 }}
            animate={{ pathLength: 1, opacity: 0.88 }}
            transition={{ duration: 0.8 }}
          />
        );
      })}

      {outcome.cascadeMap.nodes.map((node, index) => {
        const fill =
          node.tier === "containment"
            ? "rgba(55,244,255,0.95)"
            : node.tier === "amplifier"
              ? "rgba(255,189,89,0.95)"
              : node.tier === "reaction"
                ? "rgba(199,103,255,0.95)"
                : "rgba(255,111,145,0.95)";

        return (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04, duration: 0.35 }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={10 + node.intensity / 9}
              fill={fill}
              fillOpacity="0.16"
              stroke={fill}
              strokeWidth="1.5"
            />
            <circle cx={node.x} cy={node.y} r={3 + node.intensity / 18} fill={fill} />
            <text x={node.x} y={node.y + 38} textAnchor="middle" className="fill-[#e8f2ff] text-[11px]">
              {node.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
