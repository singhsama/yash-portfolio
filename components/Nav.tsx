"use client";

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { links, profile } from "@/lib/content";
import { cx } from "./ui";

const items = [
  { href: "#capabilities", label: "Capabilities" },
  { href: "#work", label: "Work" },
  { href: "#writing", label: "Writing" },
  { href: "#bookshelf", label: "Bookshelf" },
  { href: "#connect", label: "Connect" },
];

export default function Nav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    items.forEach((i) => {
      const s = document.querySelector(i.href);
      if (s) io.observe(s);
    });
    return () => io.disconnect();
  }, []);

  return (
    <header className="sticky z-40 px-3 pt-3 sm:px-4" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-full border border-white/10 bg-black/70 pl-2 pr-2 shadow-[0_20px_50px_-25px_rgb(0_0_0/1)] backdrop-blur-xl"
      >
        <a href="#top" className="flex items-center gap-2.5 rounded-full pr-2">
          <span
            aria-hidden
            className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-neon to-violet font-display text-sm font-extrabold text-white shadow-[0_0_28px_-4px_rgb(124_108_255/0.9)]"
          >
            {profile.fullName.split(" ").map((w) => w[0]).join("")}
          </span>
          <span className="font-display text-base font-bold tracking-[-0.02em] text-white">{profile.fullName}</span>
        </a>

        <ul className="hidden items-center gap-0.5 md:flex">
          {items.map((i) => (
            <li key={i.href}>
              <a
                href={i.href}
                aria-current={active === i.href ? "true" : undefined}
                className={cx(
                  "rounded-full px-3.5 py-2 text-sm transition-colors",
                  active === i.href ? "bg-white/10 text-white" : "text-soft hover:text-white"
                )}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={links.topmate}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-void hover:bg-neon-bright"
        >
          <CalendarClock size={16} aria-hidden />
          Book a call
          <span className="sr-only">(opens Topmate in a new tab)</span>
        </a>
      </nav>
    </header>
  );
}
