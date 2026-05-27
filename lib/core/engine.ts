/**
 * Pulse Heuristic Engine (Core)
 * 
 * This module contains the primary business logic for the Pulse platform. 
 * It handles community state modeling, procedural subreddit generation, 
 * scoring heuristics, and scenario simulation.
 * 
 * Architecture:
 * - Deterministic Signal Modeling: Uses weighted heuristics instead of non-deterministic LLMs.
 * - Procedural Generation: Seed-based community profile generation for custom analysis.
 * - Scenario Simulation: Outcome forecasting based on moderation intervention vectors.
 */

import {
  ActionKey,
  ActivityCell,
  Alert,
  CommunityEvent,
  CommunitySignal,
  CommunityTwin,
  ConflictCascadeMap,
  CommunityScores,
  DataMode,
  DevvitStatus,
  ExecutiveMetric,
  ForecastPoint,
  ModeratorWorkflow,
  PersonalityBreakdown,
  PressurePoint,
  PulseRuntimePayload,
  ScenarioAction,
  ScenarioConfidence,
  ScenarioOutcome,
  ScenarioState,
  TopicCluster
} from "@/types";

import { getRuntimeState } from "@/devvit/events/pulse-event-store";

// --- Internal Types ---

type TwinPreset = {
  subreddit: string;
  tagline: string;
  population: string;
  activeUsers: number;
  sentimentBias: string;
  signals: CommunitySignal;
  topics: TopicCluster[];
  workflows: ModeratorWorkflow[];
  liveEvents: Array<{
    id: string;
    type: CommunityEvent["type"];
    title: string;
    detail: string;
    severity: CommunityEvent["severity"];
    actor: string;
    threadLabel: string;
    weight: number;
    tags: string[];
    delta: Partial<CommunitySignal>;
  }>;
};

type BuildTwinOptions = {
  subreddit?: string;
  mode?: DataMode;
  tick?: number;
};

type SimulateOptions = {
  subreddit?: string;
  mode?: DataMode;
  state?: Partial<ScenarioState>;
  tick?: number;
};

// --- Constants & Config ---

const SYSTEM_VERSION = "1.0.4-stable";
const DEFAULT_SUBREDDIT = "r/politics";
const CATEGORIES = ["politics", "news", "meme", "support", "meta", "gaming", "tech", "culture"] as const;

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Math.round(value)));

const orderedActionKeys: ActionKey[] = [
  "slowMode",
  "lockThreads",
  "tightenAutomod",
  "banKeywords",
  "raiseKarma",
  "temporaryTopicBan",
  "limitMediaPosts",
  "restrictPolitics"
];

// --- Utility Functions ---

function generateSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// --- Procedural Generation Engine ---

/**
 * Generates a unique behavioral profile for any subreddit name.
 * Uses a seed-based approach to ensure deterministic results for the same community.
 */
export function generateProceduralPreset(subredditName: string): TwinPreset {
  const normalized = subredditName.toLowerCase().trim().replace(/^r\//, "");
  const seed = generateSeed(normalized);
  const getVal = (offset: number, min = 10, max = 90) => 
    Math.round(min + pseudoRandom(seed + offset) * (max - min));

  // Keyword bias detection
  const isPolitics = /politics|news|election|world|court|gov|law|debate/.test(normalized);
  const isMeme = /meme|funny|humor|joke|wholesome|shitpost|pic|art/.test(normalized);
  const isGaming = /gaming|game|play|ps5|xbox|pc|nintendo|steam|rpg|mmo/.test(normalized);
  const isSupport = /support|help|advice|ask|mental|health|learn|teach/.test(normalized);
  const isChaotic = /wallstreet|chaos|riot|fight|drama|leak|crypto|stock/.test(normalized);

  const signals: CommunitySignal = {
    sentiment: isSupport ? getVal(1, 60, 95) : (isPolitics ? getVal(1, 20, 50) : getVal(1, 30, 80)),
    toxicity: isPolitics ? getVal(2, 50, 90) : (isMeme ? getVal(2, 10, 40) : getVal(2, 20, 60)),
    reports: isPolitics || isChaotic ? getVal(3, 60, 95) : getVal(3, 10, 50),
    removals: isPolitics || isChaotic ? getVal(4, 50, 85) : getVal(4, 5, 40),
    engagementDepth: isSupport || isGaming ? getVal(5, 60, 90) : getVal(5, 30, 70),
    postingVelocity: isPolitics || isMeme || isChaotic ? getVal(6, 70, 98) : getVal(6, 20, 60),
    topicVolatility: isPolitics || isChaotic ? getVal(7, 70, 95) : getVal(7, 10, 50),
    memeSaturation: isMeme ? getVal(8, 70, 98) : (isPolitics ? getVal(8, 5, 30) : getVal(8, 20, 60)),
    politicalHeat: isPolitics ? getVal(9, 80, 100) : getVal(9, 0, 30),
    supportIndex: isSupport ? getVal(10, 70, 95) : getVal(10, 5, 40),
    commentAcceleration: isPolitics || isChaotic ? getVal(11, 60, 95) : getVal(11, 20, 60),
    replyChainIntensity: isPolitics || isGaming ? getVal(12, 60, 95) : getVal(12, 20, 60),
    interventionFrequency: isPolitics || isChaotic ? getVal(13, 60, 90) : getVal(13, 10, 50),
    sentimentVolatility: isPolitics || isChaotic ? getVal(14, 60, 95) : getVal(14, 10, 50),
    churnRisk: isChaotic ? getVal(15, 50, 80) : getVal(15, 5, 40),
    controversyEmergence: isPolitics || isChaotic ? getVal(16, 70, 98) : getVal(16, 10, 50),
    crossThreadPropagation: isPolitics || isChaotic ? getVal(17, 60, 95) : getVal(17, 5, 40)
  };

  const population = `${(getVal(18, 1, 50) / 10).toFixed(1)}M members`;
  const activeUsers = getVal(19, 5000, 100000);

  const topicLabels = isPolitics 
    ? ["Policy debate", "Global headlines", "Legislative pulse", "Voter engagement"]
    : isMeme 
    ? ["Trending format", "Visual metadata", "Viral ripple", "Remix velocity"]
    : isGaming
    ? ["Balance updates", "Strategy meta", "Release window", "Guild coordination"]
    : isSupport
    ? ["Case triage", "Peer response", "Resource mapping", "Expert signal"]
    : ["Trending threads", "User engagement", "Activity burst", "Community focus"];

  const topics: TopicCluster[] = topicLabels.map((label, i) => ({
    label,
    momentum: getVal(20 + i, 40, 95),
    volatility: getVal(24 + i, 30, 90),
    polarity: getVal(28 + i, 10, 90),
    density: getVal(32 + i, 20, 80),
    category: CATEGORIES[getVal(36 + i, 0, CATEGORIES.length - 1)]
  }));

  const workflows: ModeratorWorkflow[] = [
    { id: "queue", label: "Signal Triage", status: signals.reports > 70 ? "stressed" : "healthy", queueDepth: getVal(40, 10, 300), etaMinutes: getVal(41, 2, 40), owner: "u/sys-admin" },
    { id: "appeals", label: "Meta Response", status: "watch", queueDepth: getVal(42, 5, 100), etaMinutes: getVal(43, 10, 60), owner: "u/sys-mod" }
  ];

  return {
    subreddit: `r/${normalized}`,
    tagline: isPolitics ? "News-cycle combustion chamber" : (isMeme ? "Entertainment meta-cluster" : (isSupport ? "Peer-to-peer response hub" : "Dynamic community node")),
    population,
    activeUsers,
    sentimentBias: isPolitics ? "combative" : (isSupport ? "empathetic" : "reactive"),
    signals,
    topics,
    workflows,
    liveEvents: [
      {
        id: "ev-1",
        type: "mod_action",
        title: "Heuristic Drift Detected",
        detail: "Pattern matching suggests a potential shift in interaction quality.",
        severity: "medium",
        actor: "Pulse Observer",
        threadLabel: "Active cluster",
        weight: 12,
        tags: ["signals", "drift"],
        delta: { reports: 5, commentAcceleration: 4 }
      }
    ]
  };
}

export const defaultScenarioState: ScenarioState = {
  slowMode: false,
  lockThreads: false,
  tightenAutomod: false,
  banKeywords: false,
  raiseKarma: false,
  temporaryTopicBan: false,
  limitMediaPosts: false,
  restrictPolitics: false
};

const scenarioActions: ScenarioAction[] = [
  {
    key: "slowMode",
    label: "Enable slow mode",
    description: "Stretches reply cadence to cool reply-chain intensity without freezing the conversation.",
    impactBias: "containment"
  },
  {
    key: "lockThreads",
    label: "Lock hot threads",
    description: "Rapidly stops cross-thread spillover, but fairness backlash can rise if used too broadly.",
    impactBias: "strictness"
  },
  {
    key: "tightenAutomod",
    label: "Stricter automod",
    description: "Increases first-pass filtration around slurs, repeated report reasons, and known conflict triggers.",
    impactBias: "containment"
  },
  {
    key: "banKeywords",
    label: "Ban keywords",
    description: "Suppresses recurring phrases that are accelerating low-signal arguments or bad-faith brigading.",
    impactBias: "strictness"
  },
  {
    key: "raiseKarma",
    label: "Raise karma requirements",
    description: "Filters drive-by accounts during unstable windows, at the cost of higher churn risk for newcomers.",
    impactBias: "strictness"
  },
  {
    key: "temporaryTopicBan",
    label: "Temporary topic ban",
    description: "Pauses a volatile subject long enough for pressure to dissipate across adjacent threads.",
    impactBias: "culture"
  },
  {
    key: "limitMediaPosts",
    label: "Limit media posts",
    description: "Reduces meme or screenshot amplification when entertainment content is overwhelming deeper discussion.",
    impactBias: "culture"
  },
  {
    key: "restrictPolitics",
    label: "Restrict political discussions",
    description: "Adds stronger friction to news-cycle threads when political heat is dominating moderation capacity.",
    impactBias: "culture"
  }
];

const presets: TwinPreset[] = [
  {
    subreddit: "r/politics",
    tagline: "News-cycle combustion chamber with rapid pressure accumulation",
    population: "8.4M members",
    activeUsers: 48120,
    sentimentBias: "combative but highly mobilized",
    signals: {
      sentiment: 44,
      toxicity: 73,
      reports: 81,
      removals: 76,
      engagementDepth: 69,
      postingVelocity: 86,
      topicVolatility: 91,
      memeSaturation: 28,
      politicalHeat: 97,
      supportIndex: 24,
      commentAcceleration: 88,
      replyChainIntensity: 92,
      interventionFrequency: 84,
      sentimentVolatility: 86,
      churnRisk: 57,
      controversyEmergence: 89,
      crossThreadPropagation: 93
    },
    topics: [
      { label: "Election rhetoric", momentum: 93, volatility: 96, polarity: 91, density: 88, category: "politics" },
      { label: "Court ruling", momentum: 75, volatility: 89, polarity: 82, density: 66, category: "news" },
      { label: "Campaign memes", momentum: 44, volatility: 61, polarity: 48, density: 41, category: "meme" },
      { label: "Moderator appeals", momentum: 58, volatility: 72, polarity: 63, density: 55, category: "meta" }
    ],
    workflows: [
      { id: "triage", label: "Report triage", status: "stressed", queueDepth: 147, etaMinutes: 18, owner: "u/mod-alpha" },
      { id: "appeals", label: "Appeals review", status: "watch", queueDepth: 36, etaMinutes: 47, owner: "u/mod-civic" },
      { id: "locks", label: "Thread containment", status: "stressed", queueDepth: 22, etaMinutes: 9, owner: "u/mod-east" }
    ],
    liveEvents: [
      {
        id: "pol-1",
        type: "comment_report",
        title: "Report burst detected",
        detail: "A single election thread added 34 new reports in 11 minutes.",
        severity: "high",
        actor: "mod-queue",
        threadLabel: "Election rhetoric megathread",
        weight: 18,
        tags: ["reports", "burst"],
        delta: { reports: 8, commentAcceleration: 6, interventionFrequency: 3 }
      },
      {
        id: "pol-2",
        type: "mod_action",
        title: "Emergency removals increased",
        detail: "Manual removals doubled after two brigading-linked comment clusters surfaced.",
        severity: "high",
        actor: "u/mod-alpha",
        threadLabel: "Court ruling reaction",
        weight: 16,
        tags: ["mod-log", "brigade"],
        delta: { removals: 6, interventionFrequency: 7, toxicity: 4 }
      },
      {
        id: "pol-3",
        type: "thread_lock",
        title: "Lock request threshold crossed",
        detail: "Three adjacent threads are now drawing the same escalation pattern.",
        severity: "high",
        actor: "Pulse observer",
        threadLabel: "Court ruling reaction",
        weight: 15,
        tags: ["propagation", "lock"],
        delta: { crossThreadPropagation: 7, topicVolatility: 6, replyChainIntensity: 4 }
      },
      {
        id: "pol-4",
        type: "post_submit",
        title: "Headline shock reignites posting velocity",
        detail: "A new external headline caused duplicate-post velocity to jump again.",
        severity: "medium",
        actor: "u/news-signal",
        threadLabel: "Breaking headline queue",
        weight: 11,
        tags: ["velocity", "news"],
        delta: { postingVelocity: 6, controversyEmergence: 5, politicalHeat: 4 }
      }
    ]
  },
  {
    subreddit: "r/wholesomememes",
    tagline: "Warm community with saturation fatigue and format drift",
    population: "16.2M members",
    activeUsers: 21430,
    sentimentBias: "warm, restorative, and novelty-sensitive",
    signals: {
      sentiment: 86,
      toxicity: 19,
      reports: 18,
      removals: 24,
      engagementDepth: 51,
      postingVelocity: 63,
      topicVolatility: 29,
      memeSaturation: 92,
      politicalHeat: 3,
      supportIndex: 82,
      commentAcceleration: 49,
      replyChainIntensity: 31,
      interventionFrequency: 27,
      sentimentVolatility: 24,
      churnRisk: 22,
      controversyEmergence: 18,
      crossThreadPropagation: 16
    },
    topics: [
      { label: "Pet joy", momentum: 83, volatility: 22, polarity: 8, density: 61, category: "meme" },
      { label: "Recovery stories", momentum: 56, volatility: 18, polarity: 12, density: 48, category: "support" },
      { label: "Repost fatigue", momentum: 39, volatility: 34, polarity: 41, density: 32, category: "meta" },
      { label: "Format spam", momentum: 61, volatility: 43, polarity: 38, density: 53, category: "meme" }
    ],
    workflows: [
      { id: "reposts", label: "Repost cleanup", status: "watch", queueDepth: 42, etaMinutes: 12, owner: "u/mod-sunrise" },
      { id: "approvals", label: "Positive queue", status: "healthy", queueDepth: 14, etaMinutes: 6, owner: "u/mod-spark" },
      { id: "formats", label: "Format moderation", status: "watch", queueDepth: 18, etaMinutes: 17, owner: "u/mod-harbor" }
    ],
    liveEvents: [
      {
        id: "wm-1",
        type: "post_submit",
        title: "Template spam wave detected",
        detail: "Near-identical image macros are beginning to dominate the new queue.",
        severity: "medium",
        actor: "Pulse observer",
        threadLabel: "Fresh media posts",
        weight: 9,
        tags: ["meme", "format"],
        delta: { memeSaturation: 7, engagementDepth: -3 }
      },
      {
        id: "wm-2",
        type: "mod_action",
        title: "Repost removals climbing",
        detail: "Volunteer mods are spending more time on duplicate cleanup than discussions.",
        severity: "medium",
        actor: "u/mod-sunrise",
        threadLabel: "Repost queue",
        weight: 8,
        tags: ["reposts", "fatigue"],
        delta: { removals: 4, interventionFrequency: 5, sentimentVolatility: 2 }
      },
      {
        id: "wm-3",
        type: "comment_submit",
        title: "Discussion depth slipping",
        detail: "Average comment length fell as more media-only posts took over the front page.",
        severity: "low",
        actor: "Pulse observer",
        threadLabel: "Front page mix",
        weight: 5,
        tags: ["depth", "quality"],
        delta: { engagementDepth: -5, sentimentVolatility: 3, churnRisk: 2 }
      }
    ]
  },
  {
    subreddit: "r/pcmasterrace",
    tagline: "Competitive enthusiast community with culture-war side currents",
    population: "9.9M members",
    activeUsers: 35740,
    sentimentBias: "playful, status-driven, and occasionally tribal",
    signals: {
      sentiment: 62,
      toxicity: 48,
      reports: 42,
      removals: 39,
      engagementDepth: 66,
      postingVelocity: 74,
      topicVolatility: 58,
      memeSaturation: 77,
      politicalHeat: 9,
      supportIndex: 41,
      commentAcceleration: 63,
      replyChainIntensity: 57,
      interventionFrequency: 45,
      sentimentVolatility: 49,
      churnRisk: 37,
      controversyEmergence: 52,
      crossThreadPropagation: 48
    },
    topics: [
      { label: "GPU pricing", momentum: 72, volatility: 59, polarity: 52, density: 64, category: "gaming" },
      { label: "Build flexing", momentum: 88, volatility: 64, polarity: 31, density: 77, category: "meme" },
      { label: "Console wars", momentum: 51, volatility: 77, polarity: 84, density: 53, category: "gaming" },
      { label: "Benchmark leaks", momentum: 79, volatility: 62, polarity: 27, density: 58, category: "news" }
    ],
    workflows: [
      { id: "queue", label: "Comment moderation", status: "watch", queueDepth: 61, etaMinutes: 11, owner: "u/mod-rig" },
      { id: "war", label: "Console war containment", status: "stressed", queueDepth: 24, etaMinutes: 14, owner: "u/mod-silicon" },
      { id: "media", label: "Screenshot review", status: "healthy", queueDepth: 9, etaMinutes: 4, owner: "u/mod-frame" }
    ],
    liveEvents: [
      {
        id: "pc-1",
        type: "comment_report",
        title: "Console-war flare-up crossing threads",
        detail: "Arguments from a benchmark leak thread are now spilling into unrelated build showcase posts.",
        severity: "high",
        actor: "mod-queue",
        threadLabel: "Benchmark leaks",
        weight: 12,
        tags: ["spillover", "gaming"],
        delta: { crossThreadPropagation: 6, reports: 5, controversyEmergence: 4 }
      },
      {
        id: "pc-2",
        type: "post_submit",
        title: "Build flexes drive meme amplification",
        detail: "High-volume screenshot posts are pushing discussion depth down this cycle.",
        severity: "medium",
        actor: "u/rigshowcase",
        threadLabel: "Build flexing",
        weight: 10,
        tags: ["media", "meme"],
        delta: { memeSaturation: 6, engagementDepth: -4, postingVelocity: 4 }
      }
    ]
  },
  {
    subreddit: "r/AskReddit",
    tagline: "Mass-scale conversation fabric with surge-prone attention loops",
    population: "45.7M members",
    activeUsers: 68210,
    sentimentBias: "curious, broad, and episodically chaotic",
    signals: {
      sentiment: 58,
      toxicity: 41,
      reports: 47,
      removals: 43,
      engagementDepth: 74,
      postingVelocity: 95,
      topicVolatility: 66,
      memeSaturation: 38,
      politicalHeat: 22,
      supportIndex: 47,
      commentAcceleration: 87,
      replyChainIntensity: 74,
      interventionFrequency: 52,
      sentimentVolatility: 54,
      churnRisk: 43,
      controversyEmergence: 63,
      crossThreadPropagation: 58
    },
    topics: [
      { label: "Confession threads", momentum: 82, volatility: 68, polarity: 49, density: 79, category: "meta" },
      { label: "Relationship bait", momentum: 77, volatility: 63, polarity: 56, density: 72, category: "meta" },
      { label: "Question repeats", momentum: 48, volatility: 37, polarity: 21, density: 55, category: "meta" },
      { label: "Story disbelief", momentum: 51, volatility: 58, polarity: 61, density: 42, category: "meta" }
    ],
    workflows: [
      { id: "new", label: "New queue triage", status: "stressed", queueDepth: 129, etaMinutes: 7, owner: "u/mod-open" },
      { id: "reports", label: "Report sweep", status: "watch", queueDepth: 58, etaMinutes: 15, owner: "u/mod-lens" },
      { id: "threads", label: "Thread locks", status: "watch", queueDepth: 17, etaMinutes: 10, owner: "u/mod-signal" }
    ],
    liveEvents: [
      {
        id: "ar-1",
        type: "post_submit",
        title: "Question duplicate cluster detected",
        detail: "A trend question pattern is causing near-simultaneous duplicates and faster report tagging.",
        severity: "medium",
        actor: "Pulse observer",
        threadLabel: "New queue",
        weight: 10,
        tags: ["duplicate", "velocity"],
        delta: { postingVelocity: 5, reports: 4, commentAcceleration: 5 }
      },
      {
        id: "ar-2",
        type: "comment_submit",
        title: "Reply chains deepening fast",
        detail: "High-traffic confession threads are entering unusually long nested arguments.",
        severity: "medium",
        actor: "u/top-commenter",
        threadLabel: "Confession threads",
        weight: 8,
        tags: ["reply-chain", "engagement"],
        delta: { replyChainIntensity: 6, topicVolatility: 4, sentimentVolatility: 4 }
      }
    ]
  }
];

function normalizeDelta(delta: Partial<CommunitySignal>) {
  return Object.entries(delta) as Array<[keyof CommunitySignal, number]>;
}

function applySignalDelta(signal: CommunitySignal, delta: Partial<CommunitySignal>) {
  const next = { ...signal };

  for (const [key, value] of normalizeDelta(delta)) {
    next[key] = clamp(next[key] + value);
  }

  return next;
}

function buildCommunityScores(signals: CommunitySignal): CommunityScores {
  const communityPressure = clamp(
    signals.commentAcceleration * 0.16 +
      signals.replyChainIntensity * 0.18 +
      signals.reports * 0.16 +
      signals.sentimentVolatility * 0.13 +
      signals.crossThreadPropagation * 0.19 +
      signals.controversyEmergence * 0.18
  );

  const conflictPressure = clamp(
    signals.toxicity * 0.22 +
      signals.topicVolatility * 0.19 +
      signals.replyChainIntensity * 0.16 +
      signals.reports * 0.14 +
      signals.politicalHeat * 0.11 +
      signals.crossThreadPropagation * 0.18
  );

  const moderatorLoad = clamp(
    signals.reports * 0.21 +
      signals.removals * 0.18 +
      signals.interventionFrequency * 0.16 +
      signals.postingVelocity * 0.14 +
      signals.commentAcceleration * 0.12 +
      signals.crossThreadPropagation * 0.19
  );

  const discussionQuality = clamp(
    42 +
      signals.engagementDepth * 0.25 +
      signals.supportIndex * 0.16 +
      signals.sentiment * 0.08 -
      signals.toxicity * 0.17 -
      signals.memeSaturation * 0.08 -
      signals.replyChainIntensity * 0.07
  );

  const stability = clamp(
    112 -
      conflictPressure * 0.42 -
      communityPressure * 0.26 +
      signals.supportIndex * 0.18 +
      discussionQuality * 0.11
  );

  const sentimentDrift = clamp(
    Math.abs(58 - signals.sentiment) * 1.1 + signals.sentimentVolatility * 0.38
  );

  const healthIndex = clamp(
    stability * 0.25 +
      discussionQuality * 0.21 +
      (100 - moderatorLoad) * 0.17 +
      signals.supportIndex * 0.12 +
      (100 - signals.churnRisk) * 0.12 +
      (100 - communityPressure) * 0.13
  );

  const moderatorFatigue = clamp(
    moderatorLoad * 0.41 +
      signals.interventionFrequency * 0.22 +
      signals.removals * 0.15 +
      signals.crossThreadPropagation * 0.12 +
      signals.sentimentVolatility * 0.1
  );

  const communityResilience = clamp(
    stability * 0.34 +
      (100 - signals.sentimentVolatility) * 0.17 +
      signals.supportIndex * 0.19 +
      (100 - signals.churnRisk) * 0.16 +
      discussionQuality * 0.14
  );

  const volatilityRadar = clamp(
    signals.topicVolatility * 0.29 +
      signals.sentimentVolatility * 0.24 +
      signals.controversyEmergence * 0.18 +
      signals.crossThreadPropagation * 0.17 +
      signals.commentAcceleration * 0.12
  );

  const interventionEffectiveness = clamp(
    72 +
      signals.supportIndex * 0.08 +
      signals.interventionFrequency * 0.05 -
      signals.crossThreadPropagation * 0.11 -
      signals.churnRisk * 0.08
  );

  const escalationProbability = clamp(
    conflictPressure * 0.34 +
      communityPressure * 0.23 +
      volatilityRadar * 0.17 +
      signals.churnRisk * 0.08 +
      signals.commentAcceleration * 0.09
  );

  return {
    stability,
    conflictPressure,
    moderatorLoad,
    sentimentDrift,
    discussionQuality,
    healthIndex,
    moderatorFatigue,
    communityResilience,
    volatilityRadar,
    interventionEffectiveness,
    escalationProbability,
    communityPressure
  };
}

function classifyPersonality(signals: CommunitySignal): PersonalityBreakdown {
  const scoreboard = [
    {
      type: "Tribal" as const,
      value:
        signals.toxicity * 0.18 +
        signals.politicalHeat * 0.22 +
        signals.crossThreadPropagation * 0.17 +
        signals.controversyEmergence * 0.12
    },
    {
      type: "Meme-Driven" as const,
      value: signals.memeSaturation * 0.38 + signals.postingVelocity * 0.14 + signals.engagementDepth * 0.05
    },
    {
      type: "Debate-Heavy" as const,
      value: signals.engagementDepth * 0.24 + signals.replyChainIntensity * 0.26 + signals.topicVolatility * 0.14
    },
    {
      type: "Highly Reactive" as const,
      value:
        signals.commentAcceleration * 0.24 +
        signals.sentimentVolatility * 0.19 +
        signals.postingVelocity * 0.17 +
        signals.controversyEmergence * 0.12
    },
    {
      type: "Support-Oriented" as const,
      value: signals.supportIndex * 0.38 + signals.sentiment * 0.11 - signals.toxicity * 0.06
    },
    {
      type: "Stable" as const,
      value:
        (100 - signals.topicVolatility) * 0.18 +
        (100 - signals.sentimentVolatility) * 0.16 +
        (100 - signals.churnRisk) * 0.14
    },
    {
      type: "News-Cycle Driven" as const,
      value:
        signals.politicalHeat * 0.29 +
        signals.postingVelocity * 0.16 +
        signals.controversyEmergence * 0.16 +
        signals.topicVolatility * 0.08
    }
  ].sort((left, right) => right.value - left.value);

  const type = scoreboard[0].type;

  const rationaleMap: Record<PersonalityBreakdown["type"], string> = {
    Tribal: "Identity signaling, controversy emergence, and cross-thread spillover suggest faction-style moderation pressure.",
    "Meme-Driven": "Entertainment loops and highly repostable formats are shaping attention more than depth.",
    "Debate-Heavy": "Long reply chains and persistent contention keep the discourse dense and moderator-visible.",
    "Highly Reactive": "Behavior shifts quickly when velocity, reports, and emotional tone move together.",
    "Support-Oriented": "Members reinforce social norms and reduce escalation through positive conversational recovery.",
    Stable: "The community self-corrects well, with volatility damping before it becomes moderator-visible.",
    "News-Cycle Driven": "External headlines reshape the community rhythm faster than internal culture can absorb."
  };

  return {
    type,
    rationale: rationaleMap[type],
    scores: [
      {
        trait: "Reactivity",
        value: clamp(signals.commentAcceleration * 0.44 + signals.postingVelocity * 0.29 + signals.sentimentVolatility * 0.12)
      },
      {
        trait: "Cohesion",
        value: clamp(signals.supportIndex * 0.48 + signals.sentiment * 0.12 - signals.churnRisk * 0.08 + 12)
      },
      {
        trait: "Volatility",
        value: clamp(signals.topicVolatility * 0.42 + signals.crossThreadPropagation * 0.24 + signals.controversyEmergence * 0.15)
      },
      {
        trait: "Humor Load",
        value: clamp(signals.memeSaturation * 0.78 + signals.postingVelocity * 0.06)
      },
      {
        trait: "Debate Depth",
        value: clamp(signals.replyChainIntensity * 0.42 + signals.engagementDepth * 0.28 + signals.politicalHeat * 0.09)
      },
      {
        trait: "Moderator Friction",
        value: clamp(signals.reports * 0.24 + signals.interventionFrequency * 0.28 + signals.crossThreadPropagation * 0.12)
      }
    ]
  };
}

function buildHeatmap(signals: CommunitySignal, mode: DataMode, tick: number) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["00", "04", "08", "12", "16", "20"];
  const modeLift = mode === "live" ? 8 : 2;

  return days.flatMap((day, dayIndex) =>
    hours.map((hour, hourIndex): ActivityCell => {
      const surge = tick % 3 === hourIndex % 3 ? 7 : 0;
      const intensity =
        signals.postingVelocity * 0.36 +
        signals.commentAcceleration * 0.21 +
        signals.topicVolatility * 0.12 +
        dayIndex * 2 +
        (hourIndex >= 3 ? 10 : 2) +
        modeLift +
        surge;

      return {
        day,
        hour,
        intensity: clamp(intensity)
      };
    })
  );
}

function buildEvents(preset: TwinPreset, mode: DataMode, tick: number) {
  if (mode === "simulated") {
    return preset.liveEvents.slice(0, 2).map((event, index) => ({
      id: `${event.id}-sim`,
      type: event.type,
      at: `${18 - index}m ago`,
      title: event.title,
      detail: event.detail,
      severity: event.severity,
      actor: event.actor,
      threadLabel: event.threadLabel,
      weight: event.weight,
      tags: event.tags
    }));
  }

  const state = getRuntimeState(preset.subreddit);
  const realEvents = state.events;

  const baseEvents = preset.liveEvents.map((event, index) => ({
    id: `${event.id}-live-${tick}`,
    type: event.type,
    at: `${Math.max(1, tick * 3 + index + 1)}m ago`,
    title: event.title,
    detail: event.detail,
    severity: event.severity,
    actor: event.actor,
    threadLabel: event.threadLabel,
    weight: event.weight,
    tags: event.tags
  }));

  return [...realEvents, ...baseEvents];
}

function buildLiveSignals(preset: TwinPreset, mode: DataMode, tick: number) {
  if (mode === "simulated") {
    return preset.signals;
  }

  const eventCount = Math.min(preset.liveEvents.length, Math.max(1, (tick % preset.liveEvents.length) + 1));
  let next = { ...preset.signals };

  for (const event of preset.liveEvents.slice(0, eventCount)) {
    next = applySignalDelta(next, event.delta);
  }

  // Apply signal shifts from real webhook events
  const state = getRuntimeState(preset.subreddit);
  for (const event of state.events) {
    let delta: Partial<CommunitySignal> = {};
    if (event.type === "comment_report" || event.type === "post_report") {
      delta = { reports: 7, commentAcceleration: 4, controversyEmergence: 3 };
    } else if (event.type === "mod_action") {
      delta = { removals: 5, interventionFrequency: 6 };
    } else if (event.type === "post_submit") {
      delta = { postingVelocity: 5, controversyEmergence: 2 };
    } else if (event.type === "comment_submit") {
      delta = { commentAcceleration: 4, replyChainIntensity: 4 };
    }
    next = applySignalDelta(next, delta);
  }

  const drift = (tick % 4) * 2;
  next = applySignalDelta(next, {
    postingVelocity: drift,
    commentAcceleration: drift,
    sentimentVolatility: tick % 2 === 0 ? 2 : 0
  });

  return next;
}

function buildAlerts(
  signals: CommunitySignal,
  topics: TopicCluster[],
  scores: CommunityScores
) {
  const sortedTopics = [...(topics || [])].sort((left, right) => (right.volatility || 0) - (left.volatility || 0));
  const highestVolatilityTopic = sortedTopics[0] || { label: "General Discourse", momentum: 0, volatility: 0 };

  const alerts: Alert[] = [
    {
      id: "risk-escalation",
      level: (scores.escalationProbability || 0) > 72 ? "warning" : "watch",
      title: "Tactical escalation risk rising",
      detail: "Conflict pressure and signal velocity are diverging from baseline patterns.",
      horizon: "6h",
      metric: "Escalation probability"
    },
    {
      id: "risk-meme",
      level: (signals.memeSaturation || 0) > 70 ? "watch" : "info",
      title: "Format saturation detected",
      detail: "High-volume content loops are beginning to flatten substantive reply depth.",
      horizon: "24h",
      metric: "Discussion quality"
    },
    {
      id: "risk-reports",
      level: (signals.reports || 0) > 60 ? "warning" : "watch",
      title: "Projected report surge",
      detail: "Velocity heuristics indicate a high probability of queue strain in the next cycle.",
      horizon: "6h",
      metric: "Moderator load"
    },
    {
      id: "risk-topic",
      level: (highestVolatilityTopic.volatility || 0) > 80 ? "warning" : "info",
      title: `Watch cluster: ${highestVolatilityTopic.label}`,
      detail: `${highestVolatilityTopic.momentum || 0}% momentum with ${highestVolatilityTopic.volatility || 0}% volatility is impacting the community model.`,
      horizon: "24h",
      metric: "Topic volatility"
    }
  ];

  return alerts;
}

function buildPressureHistory(signals: CommunitySignal, scores: CommunityScores, mode: DataMode) {
  return ["-18h", "-12h", "-6h", "-3h", "Now", "+3h"].map((label, index): PressurePoint => {
    const direction = mode === "live" ? 1 : 0.55;
    const offset = (index - 3) * 4 * direction;

    return {
      label,
      pressure: clamp(scores.communityPressure + offset),
      volatility: clamp(scores.volatilityRadar + offset * 0.7),
      interventionLoad: clamp(scores.moderatorLoad + offset * 0.6)
    };
  });
}

function buildForecast(
  signals: CommunitySignal,
  scores: CommunityScores,
  mode: DataMode
) {
  const wave = mode === "live" ? 1.25 : 0.78;

  return ["Now", "+6h", "+12h", "+24h", "+48h", "+72h"].map((label, index): ForecastPoint => {
    const slope = index * 4 * wave;
    const dampener = index * (signals.supportIndex / 100) * 1.4;

    return {
      label,
      toxicity: clamp(signals.toxicity + slope * 0.6 - dampener),
      engagement: clamp(signals.engagementDepth * 0.42 + signals.postingVelocity * 0.36 + slope * 0.7),
      workload: clamp(scores.moderatorLoad + slope * 0.8),
      sentiment: clamp(signals.sentiment - slope * 0.32 + signals.supportIndex * 0.05),
      conflict: clamp(scores.conflictPressure + slope * 0.82),
      retention: clamp(76 - slope * 0.42 - signals.churnRisk * 0.14),
      quality: clamp(scores.discussionQuality - slope * 0.35 + signals.supportIndex * 0.04),
      pressure: clamp(scores.communityPressure + slope * 0.88)
    };
  });
}

function buildDevvitStatus(mode: DataMode, tick: number): DevvitStatus {
  return {
    appVersion: "0.3.0-hackathon",
    installed: true,
    mode,
    subredditConnected: true,
    moderatorVerified: true,
    redisBacked: true,
    realtimeReady: true,
    lastSync: mode === "live" ? `${Math.max(1, 8 - (tick % 4))}s ago` : "simulated replay",
    permissionChecks: [
      { label: "Read modqueue events", granted: true },
      { label: "Read modlog actions", granted: true },
      { label: "Store rolling signal state", granted: true },
      { label: "Launch moderator install flow", granted: true }
    ],
    installSteps: [
      {
        id: "install",
        label: "Install Pulse in subreddit",
        status: "done",
        detail: "App installation and subreddit binding completed."
      },
      {
        id: "permissions",
        label: "Verify moderator permissions",
        status: "done",
        detail: "Moderator capability and config access confirmed."
      },
      {
        id: "settings",
        label: "Configure thresholds",
        status: "active",
        detail: "Tuning queue thresholds, keyword bans, and forecast horizon."
      },
      {
        id: "sync",
        label: "Begin live ingestion",
        status: mode === "live" ? "done" : "pending",
        detail: "Reddit triggers mirrored into the Pulse signal engine."
      }
    ],
    settings: [
      { key: "forecast-window", label: "Forecast window", value: "72h", type: "number" },
      { key: "political-watchlist", label: "Political watchlist", value: "election, court, candidate", type: "list" },
      { key: "realtime-sync", label: "Realtime sync", value: "enabled", type: "boolean" },
      { key: "keyword-bans", label: "Keyword bans", value: "7 tracked", type: "number" }
    ]
  };
}

function buildExecutiveMetrics(scores: CommunityScores): ExecutiveMetric[] {
  return [
    {
      label: "Subreddit health index",
      value: scores.healthIndex,
      tone: "accent",
      detail: "Composite community condition across stability, churn, quality, and pressure."
    },
    {
      label: "Moderator fatigue score",
      value: scores.moderatorFatigue,
      tone: "amber",
      detail: "Operational strain across queue depth, intervention cadence, and spillover."
    },
    {
      label: "Community resilience",
      value: scores.communityResilience,
      tone: "lime",
      detail: "How well the subreddit can recover without heavy manual intervention."
    },
    {
      label: "Volatility radar",
      value: scores.volatilityRadar,
      tone: "magenta",
      detail: "Short-horizon instability derived from temporal variance and topic emergence."
    },
    {
      label: "Intervention effectiveness",
      value: scores.interventionEffectiveness,
      tone: "cyan",
      detail: "Estimated moderator leverage before backlash begins to outweigh containment gains."
    },
    {
      label: "Escalation probability",
      value: scores.escalationProbability,
      tone: "danger",
      detail: "Likelihood that current patterns accelerate into wider moderation incidents."
    }
  ];
}

function buildCascadeMap(
  signals: CommunitySignal,
  scenario?: ScenarioState
): ConflictCascadeMap {
  const containmentStrength =
    (scenario?.slowMode ? 10 : 0) +
    (scenario?.tightenAutomod ? 11 : 0) +
    (scenario?.lockThreads ? 13 : 0) +
    (scenario?.temporaryTopicBan ? 8 : 0);

  const baseIntensity = clamp(signals.crossThreadPropagation * 0.82 + signals.replyChainIntensity * 0.12 - containmentStrength);

  return {
    headline: containmentStrength > 18 ? "Containment field is damping multi-thread spread" : "Conflict is spreading from source threads into adjacent clusters",
    notes: [
      "Source nodes indicate initiating threads with unusual report growth.",
      "Amplifier nodes capture meme reposts, copycat prompts, or reaction posts.",
      "Containment nodes visualize moderator actions and automod friction."
    ],
    nodes: [
      { id: "source", label: "Source thread", tier: "source", intensity: baseIntensity, x: 70, y: 82 },
      { id: "replies", label: "Reply chain cluster", tier: "reaction", intensity: clamp(signals.replyChainIntensity - containmentStrength * 0.5), x: 198, y: 42 },
      { id: "meta", label: "Meta backlash", tier: "reaction", intensity: clamp(signals.controversyEmergence - containmentStrength * 0.3), x: 196, y: 130 },
      { id: "meme", label: "Meme amplification", tier: "amplifier", intensity: clamp(signals.memeSaturation * 0.84 - containmentStrength * 0.2), x: 344, y: 56 },
      { id: "spill", label: "Cross-thread spillover", tier: "amplifier", intensity: clamp(signals.crossThreadPropagation - containmentStrength * 0.7), x: 344, y: 122 },
      { id: "contain", label: "Moderator containment", tier: "containment", intensity: clamp(34 + containmentStrength * 2), x: 486, y: 88 }
    ],
    links: [
      { from: "source", to: "replies", strength: clamp(signals.replyChainIntensity), effect: "spread" },
      { from: "source", to: "meta", strength: clamp(signals.controversyEmergence), effect: "spread" },
      { from: "replies", to: "meme", strength: clamp(signals.memeSaturation), effect: "amplify" },
      { from: "meta", to: "spill", strength: clamp(signals.crossThreadPropagation), effect: "amplify" },
      { from: "contain", to: "meme", strength: clamp(containmentStrength * 4), effect: "contain" },
      { from: "contain", to: "spill", strength: clamp(containmentStrength * 4), effect: "contain" }
    ]
  };
}

function buildCurrentClock(mode: DataMode, tick: number) {
  return mode === "live" ? `Live sync window T+${tick * 3}m` : "Scenario replay buffer";
}

function pickPreset(subreddit?: string) {
  if (subreddit) {
    const existing = presets.find((entry) => entry.subreddit.toLowerCase() === subreddit.toLowerCase() || entry.subreddit.toLowerCase() === `r/${subreddit.toLowerCase()}`);
    if (existing) return existing;
    return generateProceduralPreset(subreddit);
  }
  return presets[0];
}

function buildTwinCore(options: BuildTwinOptions): CommunityTwin {
  const preset = pickPreset(options.subreddit);
  const mode = options.mode ?? "simulated";
  const tick = options.tick ?? 0;
  const signals = buildLiveSignals(preset, mode, tick);
  const scores = buildCommunityScores(signals);
  const alerts = buildAlerts(signals, preset.topics, scores);

  return {
    subreddit: preset.subreddit,
    tagline: preset.tagline,
    population: preset.population,
    activeUsers: preset.activeUsers + (mode === "live" ? tick * 184 : 0),
    sentimentBias: preset.sentimentBias,
    mode,
    sourceLabel: mode === "live" ? "Devvit trigger stream + rolling heuristics" : "Scripted scenario model",
    clockLabel: buildCurrentClock(mode, tick),
    signals,
    scores,
    personality: classifyPersonality(signals),
    alerts,
    forecast: buildForecast(signals, scores, mode),
    heatmap: buildHeatmap(signals, mode, tick),
    pressureHistory: buildPressureHistory(signals, scores, mode),
    topics: preset.topics,
    events: buildEvents(preset, mode, tick),
    workflows: preset.workflows,
    devvit: buildDevvitStatus(mode, tick),
    executiveMetrics: buildExecutiveMetrics(scores),
    todayRisks: alerts.slice(0, 3),
    cascadeMap: buildCascadeMap(signals)
  };
}

function buildScenarioConfidence(
  signals: CommunitySignal,
  activeCount: number
): ScenarioConfidence {
  if (signals.topicVolatility > 80 || activeCount >= 4) {
    return "moderate";
  }

  if (signals.commentAcceleration < 55 && signals.sentimentVolatility < 45) {
    return "high";
  }

  return activeCount === 0 ? "low" : "moderate";
}

function buildScenarioNarrative(
  state: ScenarioState,
  signals: CommunitySignal,
  outcome: Pick<
    ScenarioOutcome,
    | "engagementChange"
    | "toxicityReduction"
    | "backlashProbability"
    | "moderatorLoadChange"
    | "retentionImpact"
  >
) {
  const activeLabels = scenarioActions
    .filter((action) => state[action.key])
    .map((action) => action.label.toLowerCase());

  if (activeLabels.length === 0) {
    return "Pulse predicts the current moderation posture will preserve engagement, but conflict pressure remains unresolved and likely to widen if new triggers arrive.";
  }

  const opening =
    signals.sentimentVolatility > 65
      ? "Based on current volatility and recent subreddit behavior,"
      : "Based on current queue pressure and historical community response,";

  const actionPhrase =
    activeLabels.length === 1
      ? activeLabels[0]
      : `${activeLabels.slice(0, -1).join(", ")} and ${activeLabels.at(-1)}`;

  const middle =
    outcome.toxicityReduction > 24
      ? "is likely to meaningfully reduce conflict spread"
      : "should modestly reduce escalation pressure";

  const ending =
    outcome.backlashProbability > 45
      ? "while increasing visible backlash and fairness debate."
      : outcome.retentionImpact < -8
        ? "while slightly increasing churn risk among casual contributors."
        : "while keeping the moderation posture believable to regular members.";

  return `${opening} ${actionPhrase} ${middle} and rebalance moderator workload ${ending}`;
}

function simulateScenarioCore(
  signals: CommunitySignal,
  state: ScenarioState
): ScenarioOutcome {
  let engagementChange = 0;
  let toxicityReduction = 0;
  let backlashProbability = 8;
  let moderatorLoadChange = 0;
  let sentimentTrajectory = 0;
  let retentionImpact = 0;
  let discussionQualityForecast = 0;
  const explanation: string[] = [];

  if (state.slowMode) {
    toxicityReduction += 14;
    engagementChange -= 5;
    moderatorLoadChange -= 9;
    sentimentTrajectory += 3;
    discussionQualityForecast += 4;
    explanation.push("Slow mode reduces reply-chain intensity, which is one of the strongest inputs in Pulse's conflict spread model.");
  }

  if (state.lockThreads) {
    toxicityReduction += 21;
    engagementChange -= 13;
    backlashProbability += 14;
    moderatorLoadChange -= 11;
    explanation.push("Locking high-pressure threads sharply reduces propagation, but it also increases fairness backlash inside meta discussions.");
  }

  if (state.tightenAutomod) {
    toxicityReduction += 13;
    moderatorLoadChange -= 15;
    sentimentTrajectory += 2;
    discussionQualityForecast += 3;
    explanation.push("Stricter automod catches repeated triggers earlier, shifting workload away from manual removals and toward review.");
  }

  if (state.banKeywords) {
    toxicityReduction += signals.controversyEmergence > 65 ? 11 : 6;
    engagementChange -= 4;
    backlashProbability += 9;
    explanation.push("Keyword bans dampen controversy emergence, especially when identical phrases are carrying conflict between threads.");
  }

  if (state.raiseKarma) {
    toxicityReduction += 8;
    engagementChange -= 7;
    retentionImpact -= 7;
    moderatorLoadChange -= 6;
    explanation.push("Higher karma thresholds reduce drive-by participation, but Pulse expects some newcomer churn in the short term.");
  }

  if (state.temporaryTopicBan) {
    toxicityReduction += signals.topicVolatility > 70 ? 18 : 10;
    engagementChange -= 8;
    backlashProbability += 12;
    moderatorLoadChange -= 7;
    sentimentTrajectory += 4;
    discussionQualityForecast += 5;
    explanation.push("Temporary topic bans are strongest when one flashpoint is creating cross-thread contamination across otherwise healthy discussions.");
  }

  if (state.limitMediaPosts) {
    toxicityReduction += signals.memeSaturation > 65 ? 7 : 3;
    engagementChange -= signals.memeSaturation > 65 ? 9 : 4;
    discussionQualityForecast += 8;
    sentimentTrajectory += 5;
    explanation.push("Limiting media posts reduces meme amplification and often recovers discussion depth faster than blanket removals.");
  }

  if (state.restrictPolitics) {
    toxicityReduction += signals.politicalHeat > 70 ? 17 : 8;
    engagementChange -= signals.politicalHeat > 70 ? 9 : 4;
    backlashProbability += signals.politicalHeat > 70 ? 18 : 9;
    moderatorLoadChange -= 10;
    explanation.push("Restricting political discussions has the highest upside when headlines are actively driving posting velocity and report spikes.");
  }

  if (state.slowMode && state.tightenAutomod) {
    toxicityReduction += 6;
    moderatorLoadChange -= 3;
    discussionQualityForecast += 2;
  }

  if (state.limitMediaPosts && state.temporaryTopicBan) {
    discussionQualityForecast += 5;
    retentionImpact -= 2;
  }

  if (signals.crossThreadPropagation > 70 && state.lockThreads) {
    toxicityReduction += 7;
  }

  const activeCount = Object.values(state).filter(Boolean).length;

  if (activeCount >= 4) {
    backlashProbability += 10;
    retentionImpact -= 4;
  }

  const confidence = buildScenarioConfidence(signals, activeCount);
  const narrative = buildScenarioNarrative(state, signals, {
    engagementChange,
    toxicityReduction,
    backlashProbability,
    moderatorLoadChange,
    retentionImpact
  });

  const beforeScores = buildCommunityScores(signals);
  const afterSignals = applySignalDelta(signals, {
    toxicity: -toxicityReduction,
    reports: moderatorLoadChange * 0.4,
    commentAcceleration: -toxicityReduction * 0.22,
    replyChainIntensity: -toxicityReduction * 0.25,
    engagementDepth: discussionQualityForecast * 0.7,
    sentiment: sentimentTrajectory,
    churnRisk: retentionImpact * -0.5,
    crossThreadPropagation: -toxicityReduction * 0.3
  });
  const afterScores = buildCommunityScores(afterSignals);

  const shifts = [
    { label: "Engagement trajectory", before: beforeScores.healthIndex, after: clamp(beforeScores.healthIndex + engagementChange), delta: engagementChange },
    { label: "Toxicity trend", before: signals.toxicity, after: afterSignals.toxicity, delta: afterSignals.toxicity - signals.toxicity },
    { label: "Moderator workload", before: beforeScores.moderatorLoad, after: afterScores.moderatorLoad, delta: afterScores.moderatorLoad - beforeScores.moderatorLoad },
    { label: "Retention outlook", before: 76 - signals.churnRisk * 0.2, after: clamp(76 - afterSignals.churnRisk * 0.2), delta: retentionImpact },
    { label: "Discussion quality", before: beforeScores.discussionQuality, after: afterScores.discussionQuality, delta: afterScores.discussionQuality - beforeScores.discussionQuality }
  ];

  const cascade = [
    {
      label: "Conflict propagation",
      before: beforeScores.conflictPressure,
      after: afterScores.conflictPressure,
      note: "How quickly hostile energy spreads between adjacent threads.",
      delta: afterScores.conflictPressure - beforeScores.conflictPressure
    },
    {
      label: "Moderator triage queue",
      before: beforeScores.moderatorLoad,
      after: afterScores.moderatorLoad,
      note: "Projected queue strain after the intervention lands.",
      delta: afterScores.moderatorLoad - beforeScores.moderatorLoad
    },
    {
      label: "Sentiment contamination",
      before: beforeScores.sentimentDrift,
      after: afterScores.sentimentDrift,
      note: "Whether tone instability keeps leaking across the community after intervention.",
      delta: afterScores.sentimentDrift - beforeScores.sentimentDrift
    },
    {
      label: "Community resilience",
      before: beforeScores.communityResilience,
      after: afterScores.communityResilience,
      note: "How well the community can recover without another manual containment step.",
      delta: afterScores.communityResilience - beforeScores.communityResilience
    }
  ];

  return {
    engagementChange: clamp(engagementChange + 50) - 50,
    toxicityReduction: clamp(toxicityReduction),
    backlashProbability: clamp(backlashProbability),
    moderatorLoadChange: clamp(moderatorLoadChange + 50) - 50,
    sentimentTrajectory: clamp(sentimentTrajectory + 50) - 50,
    retentionImpact: clamp(retentionImpact + 50) - 50,
    discussionQualityForecast: clamp(afterScores.discussionQuality),
    confidence,
    narrative,
    explanation,
    shifts,
    cascade,
    cascadeMap: buildCascadeMap(afterSignals, state)
  };
}

function mergeScenarioState(state?: Partial<ScenarioState>): ScenarioState {
  return {
    ...defaultScenarioState,
    ...state
  };
}

export function listScenarioActions() {
  return scenarioActions;
}

export function listPresetSubreddits() {
  return presets.map(({ subreddit, tagline }) => ({ subreddit, tagline }));
}

export function buildCommunityTwin(options?: BuildTwinOptions) {
  return buildTwinCore(options ?? {});
}

export function simulateScenario(options?: SimulateOptions) {
  const merged = mergeScenarioState(options?.state);
  const twin = buildTwinCore({
    subreddit: options?.subreddit,
    mode: options?.mode,
    tick: options?.tick
  });

  return simulateScenarioCore(twin.signals, merged);
}

export function buildForecastPreview(twin: CommunityTwin, outcome: ScenarioOutcome) {
  return twin.forecast.map((point, index) => ({
    ...point,
    toxicity: clamp(point.toxicity - outcome.toxicityReduction * (0.2 + index * 0.08)),
    workload: clamp(point.workload + outcome.moderatorLoadChange * 0.52),
    sentiment: clamp(point.sentiment + outcome.sentimentTrajectory * (0.36 + index * 0.08)),
    engagement: clamp(point.engagement + outcome.engagementChange * 0.68),
    retention: clamp(point.retention + outcome.retentionImpact * 0.74),
    quality: clamp(point.quality + (outcome.discussionQualityForecast - twin.scores.discussionQuality) * (0.32 + index * 0.07)),
    pressure: clamp(point.pressure - outcome.toxicityReduction * 0.42 + outcome.backlashProbability * 0.16),
    conflict: clamp(point.conflict - outcome.toxicityReduction * 0.38 + outcome.backlashProbability * 0.2)
  }));
}

export function buildRuntimePayload(options?: SimulateOptions): PulseRuntimePayload {
  const scenario = mergeScenarioState(options?.state);
  const twin = buildTwinCore({
    subreddit: options?.subreddit,
    mode: options?.mode,
    tick: options?.tick
  });
  
  const outcome = simulateScenarioCore(twin.signals, scenario);

  return {
    twin: {
      ...twin,
      forecast: buildForecastPreview(twin, outcome),
      cascadeMap: outcome.cascadeMap
    },
    outcome,
    scenario,
    autoplaySuggestedAction: null
  };
}
