"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { books, statusLabels, type Book, type BookStatus } from "@/lib/books";
import { Pill, Reveal, SectionHeader, SegmentedControl, cx } from "./ui";

const hueOf = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);

function Cover({ b, active }: { b: Book; active: boolean }) {
  const hue = hueOf(b.title);
  return (
    <span
      aria-hidden
      className={cx(
        "relative block aspect-[2/3] w-28 overflow-hidden rounded-md shadow-[0_24px_40px_-14px_rgb(0_0_0/1)] transition-transform duration-500 ease-spring sm:w-32",
        active ? "-translate-y-4 rotate-0" : "group-hover:-translate-y-2 group-hover:-rotate-2"
      )}
      style={
        b.cover
          ? { background: `center / cover no-repeat url(${b.cover})` }
          : { background: `linear-gradient(160deg, hsl(${hue} 60% 42%), hsl(${hue + 30} 55% 18%) 60%, #030304)` }
      }
    >
      {!b.cover && (
        <>
          <span className="absolute inset-y-0 left-0 w-2 bg-black/35" />
          <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/25" />
          <span className="absolute inset-x-0 bottom-0 p-3 pl-4">
            <span className="block font-display text-[12px] font-bold leading-tight text-white">{b.title}</span>
            <span className="mt-1 block text-[10px] leading-tight text-white/85">{b.author}</span>
          </span>
        </>
      )}
      {active && <span className="absolute inset-0 rounded-md ring-2 ring-neon-bright" />}
    </span>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`Rated ${n} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={15} aria-hidden className={i < n ? "fill-amber text-amber" : "text-white/25"} />
      ))}
    </span>
  );
}

export default function Bookshelf() {
  const [tab, setTab] = useState<BookStatus>("reading");
  const [pick, setPick] = useState(0);
  const list = books.filter((b) => b.status === tab);
  const b = list[Math.min(pick, list.length - 1)];

  const changeTab = (t: BookStatus) => {
    setTab(t);
    setPick(0);
  };

  return (
    <section id="bookshelf" aria-labelledby="bookshelf-title" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <SectionHeader
        id="bookshelf-title"
        label="Interactive bookshelf"
        title={
          <>
            What Yash reads, <span className="font-serif font-normal italic text-neon-bright">and what stuck.</span>
          </>
        }
        lede="One takeaway per book. Pick a cover to read it."
        aside={
          <SegmentedControl
            idBase="books"
            label="Reading status"
            value={tab}
            onChange={changeTab}
            segments={(Object.keys(statusLabels) as BookStatus[]).map((k) => ({
              id: k,
              label: statusLabels[k],
              count: books.filter((x) => x.status === k).length,
            }))}
          />
        }
      />

      <Reveal>
        <div id="books-panel" role="tabpanel" aria-labelledby={`books-tab-${tab}`} className="grid gap-12 lg:grid-cols-12 lg:items-end">
          {!b ? (
            <p className="font-serif text-3xl italic text-soft lg:col-span-12">Nothing on this shelf yet. Check back soon.</p>
          ) : (
            <>
              {/* the shelf */}
              <div className="lg:col-span-7">
                <ul className="flex flex-wrap items-end gap-5 px-2 pt-6" aria-label={`${statusLabels[tab]} books`}>
                  {list.map((x, i) => (
                    <li key={`${x.title}-${i}`}>
                      <button
                        type="button"
                        aria-pressed={x === b}
                        onClick={() => setPick(i)}
                        className="group block rounded-md"
                      >
                        <Cover b={x} active={x === b} />
                        <span className="sr-only">
                          {x.title} by {x.author}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div aria-hidden className="mt-0 h-3 rounded-full bg-gradient-to-r from-neon/60 via-violet/40 to-transparent shadow-[0_10px_40px_-6px_rgb(124_108_255/0.8)]" />
              </div>

              {/* the reading card */}
              <div key={b.title} className="animate-fade-up lg:col-span-5" aria-live="polite">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={b.status === "reading" ? "neon" : b.status === "next" ? "amber" : "plain"}>{statusLabels[b.status]}</Pill>
                  {b.category && <Pill tone="plain">{b.category}</Pill>}
                  {b.example && <Pill tone="amber">Example</Pill>}
                </div>
                <h3 className="mt-4 font-display text-4xl font-bold leading-[1.02]">{b.title}</h3>
                <p className="mt-1 text-soft">{b.author}</p>
                {b.rating ? (
                  <div className="mt-3">
                    <Stars n={b.rating} />
                  </div>
                ) : null}
                <blockquote className="rule mt-6 border-l-2 !border-neon pl-5 font-serif text-[1.65rem] italic leading-snug text-white">
                  <span className="sr-only">{b.status === "next" ? "Why it's next: " : "Key takeaway: "}</span>
                  {b.takeaway}
                </blockquote>
                {typeof b.progress === "number" && (
                  <div className="mt-6">
                    <div className="mb-1.5 flex justify-between font-mono text-[11px] uppercase tracking-wider text-soft">
                      <span>Progress</span>
                      <span className="tabular-nums">{b.progress}%</span>
                    </div>
                    <div
                      className="h-1.5 overflow-hidden rounded-full bg-white/10"
                      role="progressbar"
                      aria-valuenow={b.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${b.title} progress`}
                    >
                      <div className="h-full rounded-full bg-gradient-to-r from-neon to-violet" style={{ width: `${b.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}
