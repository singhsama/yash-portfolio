import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Headlines: Bricolage Grotesque · Accents: Instrument Serif italic · Body: Geist · Labels: Geist Mono
const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-bricolage", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic"], variable: "--font-instrument", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Yash Singh — Program Manager & Campaign Strategist",
  description:
    "Yash Singh is a Program Manager at Jarvis Consulting running end-to-end political campaigns across India. Product builder and former S2P/ERP consultant. Case studies, writing, bookshelf and 1:1 sessions.",
  openGraph: {
    title: "Yash Singh — Program Manager & Campaign Strategist",
    description: "Campaign operations, product strategy and rapid prototyping. Book a 1:1 strategy call.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#030304",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
