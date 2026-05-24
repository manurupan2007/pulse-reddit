# Pulse

Pulse is a hackathon-grade Reddit moderation platform prototype built as a subreddit digital twin.

It is not an AI moderator and it does not replace human judgment. Pulse is a moderation decision-support system that combines Devvit-style event ingestion, rolling heuristic signal analysis, and scenario simulation to help moderators understand how a community is behaving now and how it may react next.

## Why Pulse feels different

Most moderation dashboards explain what already happened.

Pulse is designed to feel like NASA mission control for Reddit communities:

- It turns subreddit behavior into a live community pressure model.
- It shows how conflict spreads across threads, clusters, and content formats.
- It lets moderators simulate actions before they enforce them.
- It presents moderation as an operational system, not just a queue.

## Product positioning

Pulse is not:

- an AI moderator
- a censorship tool
- a replacement for moderators

Pulse is:

- a moderation decision-support system
- a subreddit behavioral forecasting platform
- a community dynamics simulator
- a moderation intelligence layer

## What is in this prototype

- A polished Next.js mission-control dashboard with the original Pulse design system preserved
- Simulated and live-ish runtime adapters
- A richer heuristic engine for volatility, pressure, fatigue, resilience, and escalation
- A Devvit app structure with settings, triggers, event routing, and install flow architecture
- A scenario simulator with confidence indicators and explanation narratives
- A conflict cascade visualization engine
- A storytelling mode for judge demos with auto-playing scenario beats

## Core experience

### 1. Community state engine

Pulse tracks:

- sentiment
- toxicity
- reports
- removals
- engagement depth
- posting velocity
- topic volatility
- meme saturation
- comment acceleration
- reply-chain intensity
- moderator intervention frequency
- sentiment volatility
- user churn risk
- controversial-topic emergence
- cross-thread conflict propagation

These signals feed a rolling score layer:

- community stability
- conflict pressure
- moderator load
- discussion quality
- health index
- moderator fatigue
- community resilience
- volatility radar
- intervention effectiveness
- escalation probability
- community pressure

### 2. Scenario simulator

Moderators can simulate:

- slow mode
- thread locks
- stricter automod
- keyword bans
- higher karma requirements
- temporary topic bans
- limiting media posts
- restricting political discussions

Pulse then forecasts:

- engagement trajectory
- backlash probability
- moderator workload impact
- toxicity trend
- retention impact
- discussion quality forecast

### 3. Conflict cascade engine

Pulse visualizes how conflict spreads through:

- source threads
- reply-chain clusters
- meta backlash
- meme amplification
- cross-thread spillover
- moderator containment

### 4. Devvit architecture credibility

The repo includes a realistic Devvit prototype surface:

- [devvit/index.ts](</C:/Users/manur/Documents/Reddit hack/devvit/index.ts>)
- [devvit/config/settings.ts](</C:/Users/manur/Documents/Reddit hack/devvit/config/settings.ts>)
- [devvit/triggers/community-triggers.ts](</C:/Users/manur/Documents/Reddit hack/devvit/triggers/community-triggers.ts>)
- [devvit/events/event-router.ts](</C:/Users/manur/Documents/Reddit hack/devvit/events/event-router.ts>)
- [devvit/events/pulse-event-store.ts](</C:/Users/manur/Documents/Reddit hack/devvit/events/pulse-event-store.ts>)
- [devvit.json](</C:/Users/manur/Documents/Reddit hack/devvit.json>)

This layer models:

- subreddit install flow
- moderator permission checks
- installation settings
- event trigger ingestion
- live-ish rolling state retention
- handoff into the Pulse runtime adapter

## Runtime architecture

### Frontend

- Next.js App Router
- TypeScript
- TailwindCSS
- Framer Motion
- Recharts

### Backend and orchestration

- Next.js API routes for runtime payloads and simulation responses
- adapter layer for simulated vs live-ish subreddit modes
- heuristic scoring engine
- scripted event ingestion for demo-safe realtime behavior
- Devvit integration architecture and configuration surface

### Important files

- [components/pulse-dashboard.tsx](</C:/Users/manur/Documents/Reddit hack/components/pulse-dashboard.tsx>) - main dashboard and interaction shell
- [lib/pulse-engine.ts](</C:/Users/manur/Documents/Reddit hack/lib/pulse-engine.ts>) - signal model, scoring, forecast, scenario logic, cascade data
- [lib/pulse-adapters.ts](</C:/Users/manur/Documents/Reddit hack/lib/pulse-adapters.ts>) - simulated/live runtime adapter boundary
- [lib/use-pulse-runtime.ts](</C:/Users/manur/Documents/Reddit hack/lib/use-pulse-runtime.ts>) - loading states, fake realtime updates, keyboard shortcuts, story autoplay
- [app/api/runtime/route.ts](</C:/Users/manur/Documents/Reddit hack/app/api/runtime/route.ts>) - unified runtime payload endpoint
- [app/api/simulate/route.ts](</C:/Users/manur/Documents/Reddit hack/app/api/simulate/route.ts>) - scenario endpoint

## How it works

1. Pulse selects a subreddit profile or live-ish mode.
2. A runtime adapter assembles rolling community state.
3. Event pressure is converted into heuristic signals and weighted scores.
4. Forecast, executive widgets, alerts, and the cascade view update together.
5. Moderator actions can be simulated before enforcement.
6. Story mode can auto-play a dramatic demo scenario for judges.

## Demo controls

- `D` toggles storytelling mode
- `L` switches live/simulated mode
- `Space` starts or pauses autoplay
- `R` resets the current scenario
- `1-4` jumps between subreddit presets

## Installation

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production verification

```bash
npm run build
```

The current prototype builds successfully.

## Deployment notes

- The Next.js app is ready for static demo hosting or a standard Node deployment.
- The Devvit layer is structured as a believable prototype surface and compile-safe architecture, not a fully credentialed live Reddit deployment.
- To turn this into a real Devvit app, the next step would be replacing the mock event store with real Redis-backed state and wiring trigger payloads to Reddit production data.

## Submission docs

- [Architecture](</C:/Users/manur/Documents/Reddit hack/docs/architecture.md>)
- [Demo Script](</C:/Users/manur/Documents/Reddit hack/docs/demo-script.md>)
- [Judge Summary](</C:/Users/manur/Documents/Reddit hack/docs/judge-summary.md>)
