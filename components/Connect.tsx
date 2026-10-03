"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CalendarClock, Check, Coffee, Copy, Mail } from "lucide-react";
import { links, profile } from "@/lib/content";
import { GitHubIcon, LinkedInIcon, MediumIcon, XIcon } from "./BrandIcons";
import TopmateCard from "./TopmateCard";
import { Reveal, SectionHeader, cx, useCopy } from "./ui";

const socials = [
  { label: "LinkedIn", href: links.linkedin, Icon: LinkedInIcon, note: "Career & updates" },
  { label: "Medium", href: links.medium, Icon: MediumIcon, note: "Long-form writing" },
  { label: "X / Twitter", href: links.x, Icon: XIcon, note: "Short takes" },
  { label: "GitHub", href: links.github, Icon: GitHubIcon, note: "Code & side builds" },
];

function EmailRow() {
  const { copied, copy } = useCopy();
  const text = useRef<HTMLSpanElement>(null);
  return (
    <li className="rule border-b py-6">
      <p className="label flex items-center gap-2">
        <Mail size={13} aria-hidden /> Email Yash
      </p>
      <div className="mt-3 flex min-w-0 items-center gap-3">
        <span ref={text} className="min-w-0 flex-1 select-all break-all font-display text-lg font-bold tracking-[-0.02em] text-white sm:text-xl">
          {profile.email}
        </span>
        <button
          type="button"
          onClick={() => copy(profile.email, text.current)}
          className={cx(
            "press inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold",
            copied ? "bg-live/20 text-[#bbf7d0]" : "bg-white text-void hover:bg-neon-bright"
          )}
        >
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="mt-1 text-sm text-soft">Replies within two working days.</p>
      <p className="sr-only" aria-live="polite">{copied ? "Email address copied" : ""}</p>
    </li>
  );
}

export default function Connect() {
  return (
    <section id="connect" aria-labelledby="connect-title" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <SectionHeader
        id="connect-title"
        label="Connect & support"
        title={
          <>
            Running a campaign <span className="font-serif font-normal italic text-neon-bright">or</span> building a product?
          </>
        }
        lede="Book a 1:1, send a note, or buy Yash a coffee if something here helped you."
      />

      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <TopmateCard />
        </Reveal>

        <Reveal delay={80} className="lg:col-span-5">
          <ul className="rule border-t">
            <EmailRow />

            <li className="rule border-b">
              <a href={links.coffee} target="_blank" rel="noopener noreferrer" className="row-hover group flex items-center gap-4 px-2 py-6">
                <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber text-void transition-transform duration-500 ease-spring group-hover:-rotate-12 group-hover:scale-110">
                  <Coffee size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl font-bold tracking-[-0.02em] text-white">Buy me a coffee</span>
                  <span className="block text-sm text-soft">Tips keep the writing free and the side projects shipping.</span>
                </span>
                <ArrowUpRight size={20} aria-hidden className="arrow-nudge shrink-0 text-amber" />
                <span className="sr-only">(opens Buy Me a Coffee in a new tab)</span>
              </a>
            </li>

            {socials.map(({ label, href, Icon, note }) => (
              <li key={label} className="rule border-b">
                <a href={href} target="_blank" rel="noopener noreferrer" className="row-hover group flex items-center gap-4 px-2 py-4">
                  <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors group-hover:border-neon/60 group-hover:text-neon-bright">
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-white">{label}</span>
                    <span className="block text-sm text-soft">{note}</span>
                  </span>
                  <ArrowUpRight size={18} aria-hidden className="arrow-nudge shrink-0 text-white" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Floating dock */
export function Dock() {
  const [show, setShow] = useState(false);
  const { copied, copy } = useCopy();

  useEffect(() => {
    const connect = document.getElementById("connect");
    let near = false;
    const update = () => setShow(window.scrollY > window.innerHeight * 0.7 && !near);
    const io = connect
      ? new IntersectionObserver(([e]) => {
          near = e.isIntersecting;
          update();
        }, { threshold: 0.05 })
      : null;
    if (connect) io?.observe(connect);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      io?.disconnect();
    };
  }, []);

  const item = "press relative grid h-11 w-11 place-items-center rounded-full text-soft hover:bg-white/10 hover:text-white";

  return (
    <div
      className={cx(
        "fixed inset-x-0 z-40 flex justify-center px-4 transition-[transform,opacity] duration-500 ease-spring",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      )}
      style={{ bottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
      aria-hidden={!show}
      inert={!show ? true : undefined}
    >
      <nav aria-label="Quick actions" className="flex items-center gap-1 rounded-full border border-white/10 bg-black/75 p-1.5 shadow-[0_20px_60px_-15px_rgb(0_0_0/1)] backdrop-blur-2xl">
        <a href={links.topmate} target="_blank" rel="noopener noreferrer" className="press inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-void hover:bg-neon-bright">
          <CalendarClock size={16} aria-hidden /> Book a call
        </a>
        <a href={links.coffee} target="_blank" rel="noopener noreferrer" className={cx(item, "hover:text-amber")}>
          <Coffee size={18} aria-hidden />
          <span className="sr-only">Buy me a coffee</span>
        </a>
        <button type="button" onClick={() => copy(profile.email)} className={item}>
          {copied ? <Check size={18} aria-hidden className="text-live" /> : <Mail size={18} aria-hidden />}
          <span className="sr-only">{copied ? "Email copied" : "Copy email address"}</span>
          <span
            role="status"
            className={cx(
              "pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-surface px-2 py-1 text-xs text-white transition-all duration-300 ease-spring",
              copied ? "opacity-100" : "translate-y-1 opacity-0"
            )}
          >
            {copied ? "Copied!" : ""}
          </span>
        </button>
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className={item}>
          <LinkedInIcon size={17} />
          <span className="sr-only">LinkedIn</span>
        </a>
      </nav>
    </div>
  );
}
