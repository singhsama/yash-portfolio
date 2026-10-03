import type { Project } from "@/lib/content";

/** Coded illustrations for each case study. Decorative; replace with real imagery any time. */
export default function Visual({ kind, size = "md" }: { kind: Project["visual"]; size?: "md" | "lg" }) {
  return (
    <div aria-hidden className="relative overflow-hidden rounded-2xl border border-white/10 bg-void/90">
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-3 font-mono text-[10px] tracking-wider text-soft/80">{titles[kind]}</span>
      </div>
      <div className={size === "lg" ? "h-64 p-4 sm:h-72" : "h-40 p-3"}>{body(kind, size)}</div>
    </div>
  );
}

const titles: Record<Project["visual"], string> = {
  campaign: "war-room / daily view",
  listing: "eurodrive.app / search",
  prompt: "master-prompt.md",
  s2p: "source-to-pay / flow",
};

// Deterministic "heat" values so the grid is stable between renders.
const heat = Array.from({ length: 60 }, (_, i) => (Math.sin(i * 12.9898) * 43758.5453) % 1).map((v) => Math.abs(v));

function body(kind: Project["visual"], size: "md" | "lg") {
  switch (kind) {
    case "campaign":
      return (
        <div className="grid h-full grid-cols-[1.25fr_1fr] gap-4">
          <div className="flex min-w-0 flex-col">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-soft">Region coverage</span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#bbf7d0]">
                <span className="h-1.5 w-1.5 animate-blink rounded-full bg-live" /> live
              </span>
            </div>
            <div className="grid flex-1 grid-cols-10 gap-1">
              {heat.slice(0, size === "lg" ? 60 : 40).map((h, i) => (
                <span
                  key={i}
                  className="rounded-[3px]"
                  style={{ background: `rgb(124 108 255 / ${0.08 + h * 0.85})`, boxShadow: h > 0.85 ? "0 0 10px rgb(181 124 255 / 0.7)" : undefined }}
                />
              ))}
            </div>
          </div>
          <div className="flex min-w-0 flex-col justify-center gap-2.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-soft">Outreach funnel</span>
            {[
              ["Reached", 100],
              ["Connected", 74],
              ["Verified", 52],
              ["Mobilised", 33],
            ].map(([l, w]) => (
              <div key={l as string}>
                <span className="mb-1 block text-[11px] text-white">{l}</span>
                <span className="block h-2 rounded-full bg-gradient-to-r from-neon to-violet" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
      );
    case "listing":
      return (
        <div className="flex h-full flex-col gap-2.5">
          <div className="rounded-lg border border-neon/40 bg-neon/10 px-3 py-2 font-mono text-[10px] text-neon-bright">
            V8 coupés under €120k, low mileage
          </div>
          {[
            { h: 250, n: "911 Carrera S", p: "€118k" },
            { h: 300, n: "Vantage", p: "€96k" },
            { h: 20, n: "AMG GT", p: "€104k" },
          ]
            .slice(0, size === "lg" ? 3 : 2)
            .map((c) => (
              <div key={c.n} className="flex flex-1 items-center gap-3 rounded-lg border border-white/[0.08] bg-surface px-2">
                <span className="h-8 w-12 shrink-0 rounded-md" style={{ background: `linear-gradient(135deg, hsl(${c.h} 55% 40%), hsl(${c.h + 30} 40% 14%))` }} />
                <span className="truncate text-[11px] text-white">{c.n}</span>
                <span className="ml-auto font-mono text-[11px] text-amber">{c.p}</span>
              </div>
            ))}
          <svg viewBox="0 0 200 30" className="h-7 w-full">
            <path d="M0 4 C40 8 70 20 110 23 S170 27 200 28" fill="none" stroke="var(--color-neon-bright)" strokeWidth="1.5" />
            <circle cx="110" cy="23" r="3" fill="var(--color-amber)" />
          </svg>
        </div>
      );
    case "prompt":
      return (
        <div className="h-full space-y-1.5 font-mono text-[11px] leading-relaxed">
          <p className="text-violet">## ROLE</p>
          <p className="text-soft">Write like a peer, not a vendor.</p>
          <p className="text-violet">## INPUT</p>
          <p className="text-soft">{"{linkedin_profile} {offer}"}</p>
          <p className="text-amber">## TEST → AI-detect · reply rate</p>
        </div>
      );
    case "s2p":
      return (
        <div className="flex h-full flex-col justify-center gap-4">
          <div className="flex items-center gap-1.5">
            {["Req", "PO", "Invoice", "Approve", "Pay"].map((s, i, a) => (
              <span key={s} className="flex flex-1 items-center gap-1.5">
                <span className={`grid h-9 w-full place-items-center rounded-lg border text-[10px] ${i < 3 ? "border-neon/50 bg-neon/15 text-neon-bright" : "border-white/15 text-soft"}`}>{s}</span>
                {i < a.length - 1 && <span className="h-px w-2 shrink-0 bg-white/30" />}
              </span>
            ))}
          </div>
          <div className="flex gap-2 font-mono text-[10px] text-soft">
            <span className="rounded border border-white/10 px-1.5 py-0.5">Coupa</span>
            <span className="rounded border border-white/10 px-1.5 py-0.5">Tungsten/Kofax</span>
            <span className="rounded border border-white/10 px-1.5 py-0.5">Oracle</span>
          </div>
        </div>
      );
  }
}
