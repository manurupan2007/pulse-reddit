export type CommunityPersonality =
  | "Tribal"
  | "Meme-Driven"
  | "Debate-Heavy"
  | "Highly Reactive"
  | "Support-Oriented"
  | "Stable"
  | "News-Cycle Driven";

export type DataMode = "simulated" | "live";

export type ExperienceMode = "operator" | "story";


export type DashboardView = 
  | "overview" 
  | "operations" 
  | "simulation" 
  | "cascade" 
  | "intelligence" 
  | "story" 
  | "devvit";

export type HorizonLabel = "6h" | "24h" | "3d";

export type ScenarioConfidence = "low" | "moderate" | "high";

export type ActionKey =
  | "slowMode"
  | "lockThreads"
  | "tightenAutomod"
  | "banKeywords"
  | "raiseKarma"
  | "temporaryTopicBan"
  | "limitMediaPosts"
  | "restrictPolitics";

export type CommunitySignal = {
  sentiment: number;
  toxicity: number;
  reports: number;
  removals: number;
  engagementDepth: number;
  postingVelocity: number;
  topicVolatility: number;
  memeSaturation: number;
  politicalHeat: number;
  supportIndex: number;
  commentAcceleration: number;
  replyChainIntensity: number;
  interventionFrequency: number;
  sentimentVolatility: number;
  churnRisk: number;
  controversyEmergence: number;
  crossThreadPropagation: number;
};

export type CommunityScores = {
  stability: number;
  conflictPressure: number;
  moderatorLoad: number;
  sentimentDrift: number;
  discussionQuality: number;
  healthIndex: number;
  moderatorFatigue: number;
  communityResilience: number;
  volatilityRadar: number;
  interventionEffectiveness: number;
  escalationProbability: number;
  communityPressure: number;
};

export type TopicCluster = {
  label: string;
  momentum: number;
  volatility: number;
  polarity: number;
  density: number;
  category: "politics" | "meme" | "support" | "news" | "gaming" | "meta" | "tech" | "culture";
};

export type Alert = {
  id: string;
  level: "info" | "watch" | "warning";
  title: string;
  detail: string;
  horizon: HorizonLabel;
  metric: string;
};

export type ActivityCell = {
  hour: string;
  day: string;
  intensity: number;
};

export type ForecastPoint = {
  label: string;
  toxicity: number;
  engagement: number;
  workload: number;
  sentiment: number;
  conflict: number;
  retention: number;
  quality: number;
  pressure: number;
};

export type PressurePoint = {
  label: string;
  pressure: number;
  volatility: number;
  interventionLoad: number;
};

export type CascadeNode = {
  label: string;
  before: number;
  after: number;
  note: string;
  delta: number;
};

export type ConflictMapNode = {
  id: string;
  label: string;
  tier: "source" | "reaction" | "amplifier" | "containment";
  intensity: number;
  x: number;
  y: number;
};

export type ConflictMapLink = {
  from: string;
  to: string;
  strength: number;
  effect: "spread" | "amplify" | "contain";
};

export type ConflictCascadeMap = {
  headline: string;
  nodes: ConflictMapNode[];
  links: ConflictMapLink[];
  notes: string[];
};

export type PersonalityBreakdown = {
  type: CommunityPersonality;
  scores: Array<{ trait: string; value: number }>;
  rationale: string;
};

export type ScenarioAction = {
  key: ActionKey;
  label: string;
  description: string;
  impactBias: "containment" | "strictness" | "culture";
};

export type ScenarioState = Record<ActionKey, boolean>;

export type ScenarioMetricShift = {
  label: string;
  before: number;
  after: number;
  delta: number;
};

export type ScenarioOutcome = {
  engagementChange: number;
  toxicityReduction: number;
  backlashProbability: number;
  moderatorLoadChange: number;
  sentimentTrajectory: number;
  retentionImpact: number;
  discussionQualityForecast: number;
  narrative: string;
  confidence: ScenarioConfidence;
  explanation: string[];
  shifts: ScenarioMetricShift[];
  cascade: CascadeNode[];
  cascadeMap: ConflictCascadeMap;
};

export type ModeratorWorkflow = {
  id: string;
  label: string;
  status: "healthy" | "watch" | "stressed";
  queueDepth: number;
  etaMinutes: number;
  owner: string;
};

export type SignalEventType =
  | "post_submit"
  | "comment_submit"
  | "comment_report"
  | "post_report"
  | "mod_action"
  | "automod_filter"
  | "thread_lock"
  | "settings_update"
  | "app_install";

export type CommunityEvent = {
  id: string;
  type: SignalEventType;
  at: string;
  title: string;
  detail: string;
  severity: "low" | "medium" | "high";
  actor: string;
  threadLabel: string;
  weight: number;
  tags: string[];
};

export type DevvitInstallStep = {
  id: string;
  label: string;
  status: "done" | "active" | "pending";
  detail: string;
};

export type InstallationSetting = {
  key: string;
  label: string;
  value: string;
  type: "string" | "boolean" | "number" | "list";
};

export type DevvitStatus = {
  appVersion: string;
  installed: boolean;
  mode: DataMode;
  subredditConnected: boolean;
  moderatorVerified: boolean;
  redisBacked: boolean;
  realtimeReady: boolean;
  lastSync: string;
  permissionChecks: Array<{
    label: string;
    granted: boolean;
  }>;
  installSteps: DevvitInstallStep[];
  settings: InstallationSetting[];
};

export type ExecutiveMetric = {
  label: string;
  value: number;
  tone: "accent" | "cyan" | "magenta" | "lime" | "amber" | "danger";
  detail: string;
};

export type StoryStep = {
  id: string;
  title: string;
  body: string;
  actionPreset: Partial<ScenarioState>;
  focus: "alerts" | "timeline" | "simulator" | "cascade" | "executive";
};

export type CommunityTwin = {
  subreddit: string;
  tagline: string;
  population: string;
  activeUsers: number;
  sentimentBias: string;
  mode: DataMode;
  sourceLabel: string;
  clockLabel: string;
  signals: CommunitySignal;
  scores: CommunityScores;
  personality: PersonalityBreakdown;
  alerts: Alert[];
  forecast: ForecastPoint[];
  heatmap: ActivityCell[];
  pressureHistory: PressurePoint[];
  topics: TopicCluster[];
  events: CommunityEvent[];
  workflows: ModeratorWorkflow[];
  devvit: DevvitStatus;
  executiveMetrics: ExecutiveMetric[];
  todayRisks: Alert[];
  cascadeMap: ConflictCascadeMap;
  storySteps: StoryStep[];
};

export type PulseRuntimePayload = {
  twin: CommunityTwin;
  outcome: ScenarioOutcome;
  scenario: ScenarioState;
  autoplaySuggestedAction: ActionKey | null;
};
