"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ Reveal */
/** Fades content in on scroll. Anything on screen at load stays put, so the first frame is complete. */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    el.classList.add("reveal-armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add("reveal-in");
        el.classList.remove("reveal-armed");
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------- Tile */
/** Bento tile with a cursor-tracked border glow. */
export function Tile({
  className,
  children,
  hover = true,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; hover?: boolean }) {
  const onMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  }, []);
  return (
    <div {...rest} onPointerMove={onMove} className={cx("tile", hover && "tile-hover", className)}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------- SegmentedControl */
export type Segment<T extends string> = { id: T; label: string; count?: number };

/** WAI-ARIA tabs with a spring-animated thumb; arrows, Home and End move between segments. */
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  idBase,
  label,
  size = "md",
  className,
}: {
  segments: Segment<T>[];
  value: T;
  onChange: (v: T) => void;
  idBase: string;
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const btn = listRef.current?.querySelector<HTMLButtonElement>(`[data-seg="${value}"]`);
    if (btn) setThumb({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [value]);

  useIsoLayoutEffect(() => measure(), [measure]);
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [measure]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = segments.findIndex((s) => s.id === value);
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % segments.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + segments.length) % segments.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = segments.length - 1;
    if (n < 0) return;
    e.preventDefault();
    onChange(segments[n].id);
    listRef.current?.querySelector<HTMLButtonElement>(`[data-seg="${segments[n].id}"]`)?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cx(
        "no-scrollbar relative inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-xl",
        className
      )}
    >
      {thumb && (
        <span
          aria-hidden
          className="absolute top-1 bottom-1 rounded-full bg-white shadow-[0_0_30px_-4px_rgb(124_108_255/0.8)] transition-[left,width] duration-500 ease-spring"
          style={{ left: thumb.left, width: thumb.width }}
        />
      )}
      {segments.map((s) => {
        const active = s.id === value;
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            id={`${idBase}-tab-${s.id}`}
            data-seg={s.id}
            aria-selected={active}
            aria-controls={`${idBase}-panel`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(s.id)}
            className={cx(
              "press relative z-10 inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors",
              size === "sm" ? "px-3.5 py-1.5 text-[13px]" : "px-4 py-2 text-sm",
              active ? "text-void" : "text-soft hover:text-white"
            )}
          >
            {s.label}
            {typeof s.count === "number" && (
              <span className={cx("rounded-full px-1.5 font-mono text-[11px] tabular-nums", active ? "bg-void/10 text-void" : "bg-white/10 text-soft")}>
                {s.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------- SectionHeader */
export function SectionHeader({
  id,
  label,
  title,
  lede,
  aside,
}: {
  id: string;
  label: string;
  title: ReactNode;
  lede?: string;
  aside?: ReactNode;
}) {
  return (
    <Reveal className="mb-10 grid gap-6 md:mb-14 md:grid-cols-[1fr_auto] md:items-end">
      <div className="max-w-3xl">
        <p className="label mb-5 flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-neon to-transparent" />
          {label}
        </p>
        <h2 id={id} className="font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-bold leading-[0.98] tracking-[-0.03em]">
          {title}
        </h2>
        {lede && <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-soft">{lede}</p>}
      </div>
      {aside && <div className="min-w-0">{aside}</div>}
    </Reveal>
  );
}

/* -------------------------------------------------------------------- Pill */
export function Pill({ children, tone = "neon", className }: { children: ReactNode; tone?: "neon" | "plain" | "amber" | "live"; className?: string }) {
  const tones = {
    neon: "border-neon/40 bg-neon/15 text-neon-bright",
    plain: "border-white/15 bg-white/[0.06] text-soft",
    amber: "border-amber/35 bg-amber/10 text-amber",
    live: "border-live/35 bg-live/10 text-[#bbf7d0]",
  } as const;
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ Copy */
export function useCopy(timeout = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = useCallback(
    async (text: string, fallbackEl?: HTMLElement | null) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), timeout);
      } catch {
        if (fallbackEl) {
          const range = document.createRange();
          range.selectNodeContents(fallbackEl);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }
    },
    [timeout]
  );
  return { copied, copy };
}
