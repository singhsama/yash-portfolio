"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Code, Compass, Megaphone, ServerCog, type LucideIcon } from "lucide-react";
import { capabilities, type Capability } from "@/lib/content";
import { Pill, Reveal, SectionHeader, cx } from "./ui";

const icons: Record<Capability["key"], LucideIcon> = {
  campaign: Megaphone,
  product: Compass,
  prototype: Code,
  tech: ServerCog,
};

const rhythm = [
  ["Field data in", "Booth, call-centre and digital numbers land in one sheet"],
  ["Ground analytics", "Gaps by region, team and message, flagged before noon"],
  ["Leadership MIS", "A one-page brief leaders can act on in ninety seconds"],
  ["Outreach review", "Call-quality audits and team-lead check-ins"],
  ["Closure report", "What moved, what didn't, and tomorrow's targets"],
];

/** The extra illustration each capability gets in the detail panel. */
function Extra({ k }: { k: Capability["key"] }) {
  if (k === "campaign")
    return (
      <div>
        <p className="label mb-3">Daily operating rhythm</p>
        <ol className="rule border-t">
          {rhythm.map(([r, d], i) => (
            <li key={r} className="rule grid grid-cols-[2.25rem_1fr] items-baseline gap-3 border-b py-3">
              <span className="font-mono text-xs text-neon-bright">0{i + 1}</span>
              <span>
                <span className="font-semibold text-white">{r}</span>
                <span className="block text-sm text-soft">{d}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  if (k === "product")
    return (
      <div className="flex flex-wrap items-center gap-2 font-serif text-2xl italic text-white">
        {["Problem", "Bet", "Roadmap", "Metric"].map((w, i, a) => (
          <span key={w} className="flex items-center gap-2">
            {w}
            {i < a.length - 1 && <ArrowRight size={16} aria-hidden className="text-neon-bright" />}
          </span>
        ))}
      </div>
    );
  if (k === "prototype")
    return (
      <pre aria-hidden className="overflow-x-auto rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[12px] leading-relaxed text-soft">
        <span className="text-violet">$</span> npx create-next-app eurodrive{"\n"}
        <span className="text-violet">$</span> vercel --prod{"\n"}
        <span className="text-[#bbf7d0]">✓ Deployed to production</span>
      </pre>
    );
  return (
    <div aria-hidden className="flex flex-wrap items-center gap-2">
      {["Requisition", "PO", "Invoice", "Approval", "Payment"].map((s, i, a) => (
        <span key={s} className="flex items-center gap-2">
          <span className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-white">{s}</span>
          {i < a.length - 1 && <span className="h-px w-4 bg-neon/70" />}
        </span>
      ))}
    </div>
  );
}

export default function Capabilities() {
  const [active, setActive] = useState<Capability["key"]>("campaign");
  const list = useRef<HTMLDivElement>(null);
  const c = capabilities.find((x) => x.key === active) ?? capabilities[0];
  const Icon = icons[c.key];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = capabilities.findIndex((x) => x.key === active);
    let n = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % capabilities.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + capabilities.length) % capabilities.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = capabilities.length - 1;
    if (n < 0) return;
    e.preventDefault();
    setActive(capabilities[n].key);
    list.current?.querySelector<HTMLButtonElement>(`[data-key="${capabilities[n].key}"]`)?.focus();
  };

  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <SectionHeader
        id="capabilities-title"
        label="Kind of work I can do"
        title={
          <>
            From the war room <span className="font-serif font-normal italic text-neon-bright">to</span> the repo.
          </>
        }
        lede="Campaign operations is what Yash does every day. The other three are how he thinks and builds."
      />

      <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* index */}
        <div
          ref={list}
          role="tablist"
          aria-orientation="vertical"
          aria-label="Capabilities"
          onKeyDown={onKey}
          className="rule border-t lg:col-span-6"
        >
          {capabilities.map((x) => {
            const on = x.key === active;
            return (
              <button
                key={x.key}
                type="button"
                role="tab"
                data-key={x.key}
                id={`cap-tab-${x.key}`}
                aria-selected={on}
                aria-controls="cap-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(x.key)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(x.key)}
                className="row-hover rule group flex w-full items-center gap-4 border-b py-6 pl-2 pr-3 text-left sm:py-7"
              >
                <span className="min-w-0 flex-1">
                  <span className="label block !text-soft">{x.kicker}</span>
                  <span
                    className={cx(
                      "mt-2 block font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-none tracking-[-0.04em] transition-colors",
                      on ? "text-white" : "text-white/55 group-hover:text-white"
                    )}
                  >
                    {x.title}
                  </span>
                </span>
                <ArrowRight
                  size={22}
                  aria-hidden
                  className={cx("shrink-0 transition-all duration-500 ease-spring", on ? "translate-x-0 text-neon-bright opacity-100" : "-translate-x-3 opacity-0")}
                />
              </button>
            );
          })}
        </div>

        {/* detail */}
        <div
          key={c.key}
          id="cap-panel"
          role="tabpanel"
          aria-labelledby={`cap-tab-${c.key}`}
          className="animate-fade-up lg:sticky lg:top-28 lg:col-span-6 lg:self-start"
        >
          <span
            aria-hidden
            className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-gradient-to-b from-neon/35 to-neon/5 text-neon-bright shadow-[0_0_40px_-10px_rgb(124_108_255/0.9)]"
          >
            <Icon size={24} strokeWidth={1.75} />
          </span>
          <p className="mt-6 font-serif text-3xl italic leading-snug text-white">{c.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {c.skills.map((s) => (
              <li key={s} className="rounded-full border border-white/15 px-3 py-1.5 text-[13px] text-white">
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Extra k={c.key} />
          </div>
          <Pill tone="neon" className="mt-8">{c.proof}</Pill>
        </div>
      </Reveal>
    </section>
  );
}
