import { SettingDefinition } from "@devvit/public-api";

export const pulseInstallationSettings: SettingDefinition[] = [
  {
    type: "number",
    name: "forecast-window-hours",
    label: "Forecast Window (hours)",
    helpText: "Controls how far Pulse projects subreddit pressure and workload shifts.",
    defaultValue: 72,
    scope: "installation"
  },
  {
    type: "boolean",
    name: "live-sync-enabled",
    label: "Enable live signal sync",
    helpText: "When enabled, Pulse uses Reddit triggers to maintain a rolling community state.",
    defaultValue: true,
    scope: "installation"
  },
  {
    type: "string",
    name: "pulse-dashboard-url",
    label: "Pulse Dashboard URL",
    helpText: "The URL where your Pulse dashboard is hosted (e.g. https://your-app.vercel.app).",
    defaultValue: "http://localhost:3000",
    scope: "installation"
  },
  {
    type: "string",
    name: "banned-keywords-seed",
    label: "Keyword risk watchlist",
    helpText: "Comma-separated keyword set for the scenario engine and trigger summaries.",
    defaultValue: "election, brigading, slur, repost",
    scope: "installation"
  },
  {
    type: "select",
    name: "demo-profile",
    label: "Demo profile",
    helpText: "Choose which scripted subreddit profile to open with during live demos.",
    defaultValue: "r/politics",
    options: [
      { label: "r/politics", value: "r/politics" },
      { label: "r/wholesomememes", value: "r/wholesomememes" },
      { label: "r/pcmasterrace", value: "r/pcmasterrace" },
      { label: "r/AskReddit", value: "r/AskReddit" }
    ],
    scope: "installation"
  }
];

export const pulseAppSettings: SettingDefinition[] = [
  {
    type: "string",
    name: "pulse-webhook-secret",
    label: "Pulse webhook secret",
    helpText: "Optional secret for forwarding Devvit events into external observability or demo pipelines.",
    scope: "app",
    isSecret: true
  }
];

export const pulseOnboardingChecklist = [
  "Install Pulse in the target subreddit.",
  "Verify moderator permissions and access to install settings.",
  "Enable live signal sync and choose the forecast window.",
  "Review the keyword risk watchlist and political routing rules.",
  "Open the dashboard in live mode and begin event ingestion."
];
