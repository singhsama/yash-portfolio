"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import { projects, type Project } from "@/lib/content";
import Visual from "./Visuals";
import { Pill, Reveal, SectionHeader, cx } from "./ui";

function ActionLink({ p, primary }: { p: Project; primary?: boolean }) {
  const external = p.href.startsWith("http");
  return (
    <a
      href={p.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cx(
        "group press inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold",
        primary ? "bg-white text-void hover:bg-neon-bright" : "border border-white/20 text-white hover:border-neon/60 hover:bg-neon/10"
      )}
    >
      {p.cta}
      <span className="sr-only">: {p.title}</span>
      <ArrowUpRight size={16} aria-hidden className="arrow-nudge" />
    </a>
  );
}

function Drawer({ p, onClose }: { p: Project; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtn.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-stretch sm:justify-end">
      <div aria-hidden onClick={onClose} className="absolute inset-0 animate-fade-up bg-black/80 backdrop-blur-sm" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="relative flex max-h-[90vh] w-full animate-pop-in flex-col overflow-hidden rounded-t-[2rem] border border-white/10 bg-surface/95 backdrop-blur-2xl sm:m-3 sm:max-h-none sm:w-[min(560px,100%)] sm:rounded-[2rem]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
          <span className="label">Case study</span>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="press grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white hover:bg-white/10"
          >
            <X size={18} aria-hidden />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-wrap gap-2">
            <Pill tone="plain">{p.org}</Pill>
            <Pill>{p.role}</Pill>
            <Pill tone="plain">{p.period}</Pill>
          </div>
          <h3 id="drawer-title" className="mt-4 font-display text-3xl font-bold leading-tight">
            {p.title}
          </h3>
          <p className="mt-3 leading-relaxed text-soft">{p.blurb}</p>
          <div className="mt-6">
            <Visual kind={p.visual} size="lg" />
          </div>
          <h4 className="label mt-8">What Yash did</h4>
          <ul className="mt-4 space-y-3">
            {p.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[15px] leading-snug text-white">
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neon-bright shadow-[0_0_10px_rgb(196_188_255)]" />
                {b}
              </li>
            ))}
          </ul>
          <h4 className="label mt-8">Tools & methods</h4>
          <ul className="mt-4 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li key={s}>
                <Pill tone="plain">{s}</Pill>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end border-t border-white/10 px-6 py-4">
          <ActionLink p={p} primary />
        </div>
      </div>
    </div>
  );
}

/** A preview card that follows the cursor over the index rows (mouse only). */
function CursorPreview({ p, x, y }: { p: Project | null; x: number; y: number }) {
  return (
    <div
      aria-hidden
      className={cx(
        "pointer-events-none fixed left-0 top-0 z-30 hidden w-[340px] transition-[opacity,scale] duration-300 ease-out-expo lg:block",
        p ? "scale-100 opacity-100" : "scale-90 opacity-0"
      )}
      style={{ transform: `translate3d(${x + 28}px, ${y - 120}px, 0)` }}
    >
      {p && (
        <div className="rotate-[-3deg] rounded-[1.25rem] shadow-[0_40px_80px_-20px_rgb(0_0_0/1),0_0_60px_-20px_rgb(124_108_255/0.8)]">
          <Visual kind={p.visual} />
        </div>
      )}
    </div>
  );
}

export default function Work() {
  const [open, setOpen] = useState<Project | null>(null);
  const [hover, setHover] = useState<Project | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const opener = useRef<HTMLElement | null>(null);

  const onOpen = useCallback((p: Project, el: HTMLElement) => {
    opener.current = el;
    setHover(null);
    setOpen(p);
  }, []);
  const onClose = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => opener.current?.focus());
  }, []);
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "mouse") setPos({ x: e.clientX, y: e.clientY });
  };

  const [jarvis, ...rest] = projects;

  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <SectionHeader
        id="work-title"
        label="Work done"
        title={
          <>
            Campaigns, products <span className="font-serif font-normal italic text-neon-bright">&amp;</span> transformations.
          </>
        }
        lede="The program Yash runs today, two products he built himself, and the enterprise work that taught him how adoption really happens."
      />

      {/* Feature story */}
      <Reveal>
        <article className="relative grid gap-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl sm:p-10 lg:grid-cols-12 lg:gap-12">
          <div aria-hidden className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgb(124_108_255/0.35),transparent)]" />
          <div className="relative flex flex-col lg:col-span-5">
            <p className="label flex items-center gap-2">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-neon-bright" />
                <span className="relative h-2 w-2 rounded-full bg-neon-bright" />
              </span>
              Featured · {jarvis.org}
            </p>
            <h3 className="mt-5 font-display text-[clamp(2.2rem,4.4vw,3.4rem)] font-bold leading-[0.98]">{jarvis.title}</h3>
            <p className="mt-5 text-[17px] leading-relaxed text-soft">{jarvis.blurb}</p>
            <ul className="mt-6 space-y-2.5">
              {jarvis.bullets.slice(0, 3).map((b) => (
                <li key={b} className="flex gap-3 text-[15px] leading-snug text-white">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neon-bright" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-8">
              <ActionLink p={jarvis} primary />
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={(e) => onOpen(jarvis, e.currentTarget)}
                className="press inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-medium text-white hover:bg-white/[0.06]"
              >
                <Maximize2 size={14} aria-hidden /> Full case study
              </button>
            </div>
          </div>
          <div className="relative min-w-0 lg:col-span-7">
            <Visual kind="campaign" size="lg" />
            <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              {jarvis.highlights.map((h, i) => (
                <div key={h} className="bg-void p-4">
                  <dt className="label">{["Scale", "Reach", "Cadence"][i]}</dt>
                  <dd className="mt-1.5 text-sm font-semibold leading-snug text-white">{h}</dd>
                </div>
              ))}
            </dl>
          </div>
        </article>
      </Reveal>

      {/* Index of other work */}
      <Reveal className="mt-16">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h3 className="font-serif text-3xl font-normal italic tracking-normal">More work</h3>
          <span className="label !text-soft hidden sm:block">Select a row for the full story</span>
        </div>
        <ul className="rule border-t" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
          {rest.map((p) => (
            <li key={p.id} className="rule border-b">
              <div className="px-2 pt-6 lg:hidden">
                <Visual kind={p.visual} />
              </div>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={(e) => onOpen(p, e.currentTarget)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHover(p)}
                className="row-hover group grid w-full gap-4 px-2 py-8 text-left md:grid-cols-12 md:items-center md:gap-6"
              >
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-soft md:col-span-2">{p.period}</span>
                <span className="min-w-0 md:col-span-6">
                  <span className="block font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold leading-[1.02] tracking-[-0.04em] text-white">
                    {p.title}
                  </span>
                  <span className="mt-2 block max-w-[52ch] text-[15px] leading-relaxed text-soft">{p.blurb}</span>
                </span>
                <span className="flex flex-wrap gap-2 md:col-span-3">
                  <Pill tone="plain">{p.org}</Pill>
                  {p.highlights.slice(0, 2).map((h) => (
                    <Pill key={h} tone="amber">{h}</Pill>
                  ))}
                </span>
                <span className="hidden justify-end md:col-span-1 md:flex">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-all duration-500 ease-spring group-hover:rotate-45 group-hover:border-neon/60 group-hover:bg-neon/15">
                    <ArrowUpRight size={18} aria-hidden />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      <CursorPreview p={hover} x={pos.x} y={pos.y} />
      {open && <Drawer p={open} onClose={onClose} />}
    </section>
  );
}
