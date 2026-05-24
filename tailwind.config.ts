import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        panel: "var(--panel)",
        "panel-strong": "var(--panel-strong)",
        line: "var(--line)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        cyan: "var(--cyan)",
        magenta: "var(--magenta)",
        lime: "var(--lime)",
        amber: "var(--amber)",
        danger: "var(--danger)"
      },
      boxShadow: {
        pulse: "0 0 0 1px rgba(255,255,255,0.05), 0 24px 80px rgba(0,0,0,0.38), 0 0 60px rgba(55,244,255,0.12)"
      },
      borderRadius: {
        shell: "30px",
        tile: "24px"
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
      },
      fontFamily: {
        display: ["Orbitron", "Segoe UI", "sans-serif"],
        body: ["Space Grotesk", "Segoe UI", "sans-serif"]
      },
      keyframes: {
        sweep: {
          "0%": { transform: "translateX(-20%)", opacity: "0.35" },
          "50%": { opacity: "0.9" },
          "100%": { transform: "translateX(120%)", opacity: "0.2" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(55,244,255,0.12)" },
          "50%": { boxShadow: "0 0 35px 8px rgba(55,244,255,0.22)" }
        }
      },
      animation: {
        sweep: "sweep 3.2s linear infinite",
        "pulse-glow": "pulseGlow 2.8s ease-in-out infinite"
      }
    }
  },
  plugins: [animate]
};

export default config;
