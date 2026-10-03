"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CalendarClock } from "lucide-react";
import { bio, career, links, profile, type BioLens } from "@/lib/content";
import { SegmentedControl, cx } from "./ui";

const lenses: BioLens[] = ["campaigns", "product", "transformation"];
const ticker = [
  "Campaign strategy",
  "Ground-level analytics",
  "Voter outreach ops",
  "Digital execution",
  "Program governance",
  "Product strategy",
  "Rapid prototyping",
  "Source-to-Pay",
  "ERP implementation",
];

function IstClock() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums text-white">{t ?? "--:--"}</span>;
}

export default function Hero() {
  const [lens, setLens] = useState<BioLens>("campaigns");
  const strip = [
    { k: "Now", v: career[0].org, d: career[0].role },
    { k: "Before", v: career[1].org, d: "Source-to-Pay transformation" },
    { k: "Earlier", v: career[2].org, d: "Oracle ERP implementation" },
    { k: "Education", v: "IIIT Bhubaneswar", d: "B.Tech" },
  ];

  return (
    <section id="top" aria-labelledby="hero-title" className="relative">
      {/* violet wash behind the name */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[640px] w-[min(1200px,140vw)] -translate-x-1/2">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(124_108_255/0.38),rgb(181_124_255/0.12)_55%,transparent_80%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <a
            href="#connect"
            className="group inline-flex items-center gap-2.5 rounded-full border border-live/35 bg-live/10 py-1.5 pl-3 pr-4 text-[13px] font-medium text-[#bbf7d0] transition-colors hover:border-live/60"
          >
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-live" />
              <span className="relative h-2 w-2 rounded-full bg-live" />
            </span>
            {profile.status}
            <ArrowRight size={14} aria-hidden className="arrow-nudge-x" />
          </a>
          <p className="label !text-soft">
            {profile.location} · <IstClock /> IST
          </p>
        </div>

        <h1 id="hero-title" className="mt-10 md:mt-14">
          <span className="block font-display text-[clamp(4rem,14.5vw,12rem)] font-extrabold leading-[0.82] tracking-[-0.055em] text-white">
            {profile.fullName}
          </span>
          <span className="sr-only"> — </span>
          <span className="mt-5 block font-serif text-[clamp(1.9rem,4.6vw,3.6rem)] font-normal italic leading-[1.05] tracking-[-0.01em] text-white">
            {profile.headline.lead} <span className="text-neon-bright">&amp;</span> {profile.headline.accent.replace(/^&\s*/, "")}
          </span>
        </h1>

        <div className="rule mt-12 grid gap-10 border-t pt-10 md:mt-16 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <SegmentedControl
              idBase="bio"
              label="Read Yash's bio through a lens"
              size="sm"
              value={lens}
              onChange={setLens}
              segments={lenses.map((l) => ({ id: l, label: bio[l].label }))}
            />
            <p
              key={lens}
              id="bio-panel"
              role="tabpanel"
              aria-labelledby={`bio-tab-${lens}`}
              className="mt-6 min-h-[7rem] max-w-[58ch] animate-fade-up text-xl leading-relaxed text-white"
            >
              {bio[lens].text}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work"
                className="group press inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-void shadow-[0_0_40px_-8px_rgb(124_108_255/0.9)] hover:bg-neon-bright"
              >
                See the work
                <ArrowRight size={16} aria-hidden className="arrow-nudge-x" />
              </a>
              <a
                href={links.topmate}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-[15px] font-semibold text-white hover:border-white/40 hover:bg-white/[0.06]"
              >
                <CalendarClock size={16} aria-hidden />
                Book a strategy call
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-12">
            <p className="label">Track record</p>
            <p className="metric-glow mt-4 inline-block font-display text-[clamp(6rem,14vw,9rem)] font-extrabold leading-[0.85] tracking-[-0.06em] text-white">
              {profile.campaignsLed}
            </p>
            <p className="mt-4 font-serif text-3xl italic text-white">{profile.campaignsLabel.toLowerCase()}</p>
            <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-soft">
              High-stakes campaigns for major political parties across India, run end to end at {profile.company}.
            </p>
          </div>
        </div>

        <dl className="rule mt-14 grid grid-cols-2 border-y md:grid-cols-4">
          {strip.map((c, i) => (
            <div
              key={c.k}
              className={cx(
                "py-5 pr-4",
                i % 2 === 1 && "border-l border-white/10 pl-4 md:pl-6",
                i === 2 && "md:border-l md:border-white/10 md:pl-6",
                i >= 2 && "border-t border-white/10 md:border-t-0"
              )}
            >
              <dt className="label flex items-center gap-2">
                {i === 0 && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-neon-bright shadow-[0_0_10px_rgb(196_188_255)]" />}
                {c.k}
              </dt>
              <dd className="mt-2 font-display text-lg font-bold tracking-[-0.02em] text-white">{c.v}</dd>
              <dd className="text-sm text-soft">{c.d}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-14 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <p className="sr-only">Focus areas: {ticker.join(", ")}</p>
        <div aria-hidden className="flex w-max animate-marquee items-baseline gap-10 whitespace-nowrap motion-reduce:animate-none">
          {[...ticker, ...ticker].map((t, i) => (
            <span
              key={i}
              className={i % 2 === 0 ? "font-display text-3xl font-bold tracking-[-0.03em] text-white" : "font-serif text-3xl italic text-soft"}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
