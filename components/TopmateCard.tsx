"use client";

import { useCallback, useState } from "react";
import { ArrowUpRight, CalendarClock, Check, MousePointerClick } from "lucide-react";
import { profile, sessions, topmate, topmateUrl } from "@/lib/content";

const SCRIPT_ID = "topmate-widget-script";

/** Loads Topmate's popup widget only when the visitor asks for it. Configure in lib/content.ts → topmate.widget. */
function useTopmateWidget() {
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const load = useCallback(() => {
    if (!topmate.widget.src || typeof document === "undefined") return;
    if (document.getElementById(SCRIPT_ID)) {
      setState("ready");
      return;
    }
    setState("loading");
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = topmate.widget.src;
    s.async = true;
    for (const [k, v] of Object.entries(topmate.widget.attributes)) s.setAttribute(k, v);
    s.onload = () => setState("ready");
    s.onerror = () => setState("error");
    document.body.appendChild(s);
  }, []);
  return { state, load, enabled: Boolean(topmate.widget.src) };
}

/** The one glass panel on the page: booking is the main action. */
export default function TopmateCard() {
  const widget = useTopmateWidget();
  const display = topmateUrl.replace(/^https:\/\//, "").replace(/\/$/, "");

  return (
    <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl sm:p-10">
      <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgb(124_108_255/0.4),transparent)]" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label">Topmate · 1:1 sessions</p>
        <span className="inline-flex items-center gap-2 rounded-full border border-live/35 bg-live/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#bbf7d0]">
          <span className="h-1.5 w-1.5 rounded-full bg-live" aria-hidden /> Booking open
        </span>
      </div>

      <h3 className="mt-6 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-extrabold leading-[0.98]">
        Book a strategy call <span className="font-serif font-normal italic text-neon-bright">with</span> {profile.name}
      </h3>
      <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-soft">
        Bring a campaign plan, a roadmap or a career question. You leave with a clear next step.
      </p>

      <ul className="rule mt-8 border-t">
        {sessions.map((s) => (
          <li key={s.name} className="rule flex items-baseline justify-between gap-4 border-b py-4">
            <span className="text-[17px] text-white">{s.name}</span>
            <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-soft">{s.len}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={topmateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group press inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[15px] font-bold text-void shadow-[0_0_50px_-10px_rgb(124_108_255/1)] hover:bg-neon-bright"
        >
          <CalendarClock size={17} aria-hidden />
          Book on Topmate
          <ArrowUpRight size={17} aria-hidden className="arrow-nudge" />
          <span className="sr-only">(opens topmate.io in a new tab)</span>
        </a>
        {widget.enabled && (
          <button
            type="button"
            onClick={widget.load}
            disabled={widget.state === "loading" || widget.state === "ready"}
            className="press inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-[15px] font-semibold text-white hover:border-neon/60 hover:bg-neon/10 disabled:cursor-default disabled:opacity-80"
          >
            {widget.state === "ready" ? <Check size={16} aria-hidden /> : <MousePointerClick size={16} aria-hidden />}
            {widget.state === "ready"
              ? "Quick-book enabled"
              : widget.state === "loading"
                ? "Loading…"
                : widget.state === "error"
                  ? "Retry quick-book"
                  : "Quick-book popup"}
          </button>
        )}
        <span className="font-mono text-xs text-soft">{display}</span>
      </div>
      {widget.state === "error" && <p className="mt-3 text-sm text-amber">The popup didn&apos;t load. Use the Topmate link instead.</p>}
      <p className="sr-only" aria-live="polite">{widget.state === "ready" ? "Topmate quick-book popup is ready" : ""}</p>
    </div>
  );
}
