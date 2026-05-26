import { Inter } from "next/font/google";
import "./globals.css";

import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Pulse | Moderation Intelligence",
  description:
    "Pulse is an operational moderation forecast engine for Reddit communities, providing live pressure modeling and intervention simulation."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
