
# Yash Singh · Personal Site

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Lucide icons. #030304 canvas, editorial layout (hairline rows, master-detail panels, cursor-follow previews); motion is pure CSS.
Fonts: Bricolage Grotesque (headlines) · Instrument Serif italic (accents) · Geist (body) · Geist Mono (labels). Text is #FFFFFF or #94A3B8 (AAA).

## Run

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```
Deploy by importing the repo into Vercel. No env vars needed.

## Where to edit

| What | File |
|---|---|
| Name ("Yash Singh" in nav + hero, "Yash" elsewhere), role, bio, career, capabilities, case studies, social links | `lib/content.ts` |
| Topmate handle and optional popup widget | `lib/content.ts` → `topmate` |
| Bookshelf (title, author, shelf, category, rating, progress, takeaway, cover) | `lib/books.ts` |
| Medium handle, post count, optional rss2json key | `lib/articles.ts` |

Every placeholder is marked `TODO`.

## Medium feed

Set `mediumConfig.username` in `lib/articles.ts`. The Articles section fetches, in the browser,
`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@<username>` and renders title, date, read time,
tags and the cover image (first image in the post). It times out after 8 s. With no handle, or on any error, the
fallback topic cards render, each tagged *Topic slot*. The anonymous rss2json tier is rate-limited; add a free API key in
`rss2jsonApiKey` if you expect traffic.

## Topmate

No iframes. Set `topmate.handle` and every booking button links to `https://topmate.io/<handle>` in a new tab.
Optional: paste the `src` and `data-*` attributes from Topmate's embed snippet into `topmate.widget`. A
"Quick-book popup" button then appears and loads Topmate's script only when a visitor clicks it.

## Bookshelf

The tabs (Currently Reading / Read / Up Next) render straight from `lib/books.ts`: covers stand on a shelf and the
selected book's takeaway shows beside them. Replace the three `example` entries; add `cover` URLs for real artwork.

## Build

Every component that uses hooks or event handlers starts with `"use client"`; `app/page.tsx`, `components/Site.tsx`
and `components/Footer.tsx` stay server components. No server-only packages or runtime env vars are required, so
`npm run build` works the same locally and on Vercel.

## Accessibility

#FFFFFF and #94A3B8 on #030304 (8:1 and up, AAA). Skip link, visible focus, ARIA tabs with arrow keys, focus-trapped
quick-view dialog with Esc, labelled form fields, reduced-motion support.

`preview/` only builds the single-file preview; it is not part of the app.
