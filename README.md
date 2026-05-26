# Pulse | Subreddit Digital Twin & Moderation Forecast Engine

[![Production Build](https://github.com/manurupan2007/pulse-reddit/actions/workflows/build.yml/badge.svg)](https://github.com/manurupan2007/pulse-reddit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)

**Pulse** is a professional-grade moderation decision-support platform designed for Reddit communities. It serves as a **digital twin** of a subreddit, providing live community pressure modeling, conflict propagation visualization, and intervention simulation.

> "Pulse is designed to feel like NASA mission control for Reddit communities, transforming moderation from a reactive queue into a proactive operational system."

---

## ⚡ Quick Links
- [Live Demo](https://pulse-reddit.vercel.app) (Coming Soon)
- [Architecture Deep Dive](./docs/architecture.md)
- [Judge's Summary](./docs/judge-summary.md)
- [Demo Script](./docs/demo-script.md)

---

## 🌟 Key Features

### 📡 1. Community State Digital Twin
Pulse tracks dozens of high-fidelity signals (sentiment velocity, meme saturation, comment acceleration, etc.) and transforms them into a unified community health model.
- **Stability Modeling:** Heuristic assessment of community resilience.
- **Conflict Pressure:** Real-time monitoring of escalation potential.
- **Moderator Load Forecasting:** Predicting intervention demand before the report queue spikes.

### 🧪 2. Intervention Simulator
Test moderation strategies in a sandboxed environment before applying them to the live community.
- **Policy Testing:** Simulate "Slow Mode," keyword bans, or thread locks.
- **Impact Analysis:** Forecast engagement trajectory, backlash probability, and retention impact.
- **Narrative Explanations:** Get heuristic-driven reasoning for forecasted outcomes.

### 🌊 3. Conflict Cascade Visualization
Visualize how tension propagates across threads and reply-chain clusters. 
- **Backlash Risk:** Probability modeling of meta-conflict.
- **Containment Analysis:** Visualizing the effectiveness of moderator interventions.

### 🕹️ 4. Storytelling & Training Mode
Built-in "Operator Story" mode for demonstration and moderator training, with auto-playing scenario beats that walk through a dramatic community incident.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS |
| **Animations** | Framer Motion |
| **Data Viz** | Recharts, Custom SVG Visualization Engines |
| **Language** | TypeScript (Strict Mode) |
| **Platform** | Devvit (Reddit Developer Platform Architecture) |

---

## 📂 Repository Structure

```text
├── app/               # Next.js App Router (Pages & API)
├── components/        # React Components
│   ├── dashboard/     # Domain-specific dashboard modules
│   └── ui/            # Reusable design system primitives
├── devvit/            # Reddit Devvit App Logic (Triggers & Events)
├── hooks/             # Custom React Hooks
├── lib/               # Core Heuristic Engine & Business Logic
│   └── services/      # Adapters and external integrations
├── types/             # Consolidated TypeScript definitions
└── docs/              # Detailed product and technical documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/manurupan2007/pulse-reddit.git
   cd pulse-reddit
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Operator Controls (Hotkeys)
- `D`: Toggle Storytelling Mode
- `L`: Switch between Live/Simulated data
- `Space`: Play/Pause Story Autoplay
- `R`: Reset current simulation
- `1-4`: Jump between subreddit presets

---

## 🛡️ Design Decisions & Scalability

- **Heuristic Engine:** Pulse uses a deterministic heuristic engine (`lib/pulse-engine.ts`) instead of non-deterministic LLMs for its core scoring. This ensures consistent, explainable results that moderators can trust.
- **Adapter Pattern:** The runtime uses an adapter pattern (`lib/services/pulse-adapters.ts`) to switch between simulated demo data and live event streams, making it easy to plug in real Reddit API data.
- **Atomic Design:** UI components are strictly separated between pure primitives (`ui/`) and feature-rich modules (`dashboard/`), ensuring a clean, maintainable component tree.

---

## 🛤️ Roadmap
- [ ] **Real-time Redis Persistence:** Move from ephemeral in-memory state to Redis-backed event stores.
- [ ] **Multi-Subreddit Aggregation:** Executive views for moderator teams managing dozens of subreddits.
- [ ] **Automated Intervention Hook:** Optional "Auto-Apply" for simulations that hit a certain confidence threshold.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 👥 Contributors
- **Manurupan** - *Lead Engineer & UI/UX Architect*

---
*Built for the Reddit Mod Tools Hackathon 2026*
