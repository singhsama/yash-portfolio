"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Clock, Rss } from "lucide-react";
import { fallbackArticles, fetchMediumPosts, mediumConfig, mediumProfileUrl, type Article, type FeedState } from "@/lib/articles";
import { MediumIcon } from "./BrandIcons";
import { Pill, Reveal, SectionHeader, cx } from "./ui";

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

function Meta({ a }: { a: Article }) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-soft">
      <time dateTime={a.date}>{fmt(a.date)}</time>
      <span aria-hidden className="h-1 w-1 rounded-full bg-white/40" />
      <span className="inline-flex items-center gap-1.5">
        <Clock size={12} aria-hidden /> {a.readMinutes} min read
      </span>
      {a.placeholder && <Pill tone="amber" className="normal-case">Topic slot</Pill>}
    </span>
  );
}

function Cover({ a, className }: { a: Article; className?: string }) {
  return (
    <span aria-hidden className={cx("relative block overflow-hidden rounded-2xl border border-white/10", className)}>
      {a.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={a.image}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
        />
      ) : (
        <span
          className="flex h-full w-full items-end p-6"
          style={{
            background:
              "radial-gradient(60% 90% at 25% 30%, rgb(124 108 255 / 0.55), transparent 70%), radial-gradient(50% 80% at 85% 85%, rgb(181 124 255 / 0.3), transparent 70%), #08080b",
          }}
        >
          <span className="font-serif text-5xl italic leading-none text-white">{a.tags[0] ?? "Essay"}</span>
        </span>
      )}
    </span>
  );
}

export default function Articles() {
  const [{ posts, state }, setFeed] = useState<{ posts: Article[]; state: FeedState }>(() =>
    mediumConfig.username ? { posts: [], state: "loading" } : { posts: fallbackArticles, state: "fallback" }
  );

  useEffect(() => {
    if (!mediumConfig.username) return;
    let cancelled = false;
    const ctrl = new AbortController();
    // A slow feed falls back to the topic cards instead of spinning forever.
    const timer = setTimeout(() => ctrl.abort(), mediumConfig.timeoutMs);
    fetchMediumPosts(ctrl.signal).then((r) => {
      if (!cancelled) setFeed(r);
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      ctrl.abort();
    };
  }, []);

  const [lead, ...rest] = posts;

  return (
    <section id="writing" aria-labelledby="writing-title" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <SectionHeader
        id="writing-title"
        label="Articles & views"
        title={
          <>
            Notes from <span className="font-serif font-normal italic text-neon-bright">the</span> field.
          </>
        }
        lede="Yash writes about campaign operations, analytics and building products on Medium."
        aside={
          <span
            className={cx(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px]",
              state === "live" ? "border-live/40 bg-live/10 text-[#bbf7d0]" : "border-white/15 text-soft"
            )}
          >
            <Rss size={14} aria-hidden />
            {state === "live" ? "Live from Medium" : state === "loading" ? "Loading from Medium…" : "Medium feed not connected yet"}
          </span>
        }
      />
      <p className="sr-only" aria-live="polite">{state === "live" ? `${posts.length} articles loaded from Medium` : ""}</p>

      {state === "loading" ? (
        <div aria-hidden className="grid gap-10 lg:grid-cols-12">
          <div className="h-[26rem] animate-pulse rounded-2xl bg-white/[0.04] lg:col-span-6" />
          <div className="space-y-4 lg:col-span-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-white/[0.04]" />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-12">
          {lead && (
            <Reveal className="lg:col-span-6">
              <a href={lead.href} target="_blank" rel="noopener noreferrer" className="group block">
                <Cover a={lead} className="aspect-[4/3]" />
                <span className="mt-6 block">
                  <Meta a={lead} />
                </span>
                <span className="mt-3 block font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-bold leading-[1.02] tracking-[-0.035em] text-white">
                  {lead.title}
                </span>
                <span className="mt-3 block text-[17px] leading-relaxed text-soft">{lead.excerpt}</span>
                <span className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-void transition-colors group-hover:bg-neon-bright">
                  <MediumIcon size={16} />
                  Read on Medium
                  <ArrowUpRight size={16} aria-hidden className="arrow-nudge" />
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Reveal>
          )}

          <Reveal delay={80} className="lg:col-span-6">
            <ul className="rule border-t">
              {rest.map((a) => (
                <li key={a.title} className="rule border-b">
                  <a href={a.href} target="_blank" rel="noopener noreferrer" className="row-hover group flex gap-5 px-2 py-6">
                    {a.image && <Cover a={a} className="h-20 w-20 shrink-0" />}
                    <span className="min-w-0 flex-1">
                      <Meta a={a} />
                      <span className="mt-2 block font-display text-xl font-bold leading-snug tracking-[-0.02em] text-white">{a.title}</span>
                      {a.tags.length > 0 && <span className="mt-1 block font-serif text-lg italic text-soft">{a.tags.join(" · ")}</span>}
                    </span>
                    <ArrowUpRight size={20} aria-hidden className="arrow-nudge mt-1 shrink-0 text-white" />
                    <span className="sr-only">Read on Medium (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={mediumProfileUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2.5 text-sm font-semibold text-white"
            >
              <MediumIcon size={18} /> All articles on Medium
              <ArrowUpRight size={16} aria-hidden className="arrow-nudge" />
            </a>
          </Reveal>
        </div>
      )}
    </section>
  );
}
