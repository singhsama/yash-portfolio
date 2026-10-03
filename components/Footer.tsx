import { profile } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-32 pt-6 sm:px-6">
      <div className="flex flex-col gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-end sm:justify-between">
        <p className="font-display text-[clamp(3rem,10vw,7rem)] font-extrabold leading-none tracking-[-0.05em] text-white/90">
          {profile.name}<span className="text-neon">.</span>
        </p>
        <p className="text-sm text-soft">
          © {new Date().getFullYear()} {profile.name} · {profile.role}, {profile.company} · {profile.location}
        </p>
      </div>
    </footer>
  );
}
