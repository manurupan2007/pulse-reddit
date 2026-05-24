import "@fontsource/orbitron/700.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pulse | Reddit Moderation OS",
  description:
    "Pulse is a futuristic subreddit simulation and forecasting dashboard for moderators, built for hackathon demos with heuristic intelligence."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
