/**
 * Medium settings, the client-side feed loader and the fallback cards.
 *
 * Posts load in the browser through rss2json (Medium's own feed has no CORS headers):
 *   https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@<username>
 * If the handle is empty or the request fails, the fallback cards below render instead.
 */

export const mediumConfig = {
  username: "", // TODO: your Medium handle without "@", e.g. "yashsingh"
  limit: 6,
  /** Optional rss2json API key (raises the free rate limit). Leave "" to use the anonymous tier. */
  rss2jsonApiKey: "",
  timeoutMs: 8000,
};

export type Article = {
  title: string;
  excerpt: string;
  date: string; // ISO date
  readMinutes: number;
  tags: string[];
  href: string;
  image?: string;
  /** True for fallback cards that are not real posts yet. */
  placeholder?: boolean;
};

export type FeedState = "loading" | "live" | "fallback";

export const mediumProfileUrl = () =>
  mediumConfig.username ? `https://medium.com/@${mediumConfig.username}` : "https://medium.com/";

export const feedUrl = () => {
  const rss = encodeURIComponent(`https://medium.com/feed/@${mediumConfig.username}`);
  const key = mediumConfig.rss2jsonApiKey ? `&api_key=${mediumConfig.rss2jsonApiKey}` : "";
  return `https://api.rss2json.com/v1/api.json?rss_url=${rss}${key}`;
};

type Rss2JsonItem = {
  title?: string;
  pubDate?: string;
  link?: string;
  thumbnail?: string;
  description?: string;
  content?: string;
  categories?: string[];
};

const stripHtml = (html: string) =>
  html
    .replace(/<figcaption[\s\S]*?<\/figcaption>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

const titleCase = (t: string) => t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Converts one rss2json item into an Article. Exported for testing. */
export function toArticle(item: Rss2JsonItem): Article {
  const html = item.content || item.description || "";
  const text = stripHtml(html);
  const words = text ? text.split(" ").length : 0;
  // Medium puts the cover as the first <img>; rss2json's thumbnail is often empty or a tracking pixel.
  const firstImg = html.match(/<img[^>]+src="([^"]+)"/i)?.[1];
  const thumb = item.thumbnail && !/stat\?event|\/_\/stat/.test(item.thumbnail) ? item.thumbnail : undefined;
  // rss2json returns "YYYY-MM-DD HH:mm:ss" in UTC.
  const iso = item.pubDate ? new Date(item.pubDate.replace(" ", "T") + "Z").toISOString() : new Date().toISOString();
  return {
    title: item.title?.trim() || "Untitled",
    href: (item.link || mediumProfileUrl()).split("?")[0],
    date: iso,
    excerpt: text.length > 170 ? text.slice(0, 170).replace(/\s\S*$/, "") + "…" : text,
    readMinutes: Math.max(1, Math.round(words / 230)),
    tags: (item.categories ?? []).slice(0, 3).map(titleCase),
    image: firstImg || thumb,
  };
}

/** Fetches the latest posts in the browser. Never throws: returns fallback cards on any failure. */
export async function fetchMediumPosts(signal?: AbortSignal): Promise<{ posts: Article[]; state: FeedState }> {
  if (!mediumConfig.username) return { posts: fallbackArticles, state: "fallback" };
  try {
    const res = await fetch(feedUrl(), { signal });
    if (!res.ok) throw new Error(`rss2json ${res.status}`);
    const json: { status?: string; items?: Rss2JsonItem[] } = await res.json();
    if (json.status !== "ok" || !json.items?.length) throw new Error("empty feed");
    return { posts: json.items.slice(0, mediumConfig.limit).map(toArticle), state: "live" };
  } catch (err) {
    if ((err as Error)?.name !== "AbortError") console.warn("[medium] showing fallback cards:", err);
    return { posts: fallbackArticles, state: "fallback" };
  }
}

// Topic cards shown until the live feed loads. Rename them to match what you publish.
export const fallbackArticles: Article[] = [
  {
    title: "Inside a campaign war room",
    excerpt: "How a daily operating rhythm turns field data, call-centre numbers and digital reach into decisions by 9 a.m.",
    date: "2026-09-15",
    readMinutes: 7,
    tags: ["Campaign Ops", "Program Management"],
    href: mediumProfileUrl(),
    placeholder: true,
  },
  {
    title: "Ground-level analytics that leaders actually read",
    excerpt: "Designing MIS reports for people who have ninety seconds and a decision to make.",
    date: "2026-08-20",
    readMinutes: 6,
    tags: ["Analytics", "Reporting"],
    href: mediumProfileUrl(),
    placeholder: true,
  },
  {
    title: "Auditing outreach quality at scale",
    excerpt: "A simple call-quality audit framework that makes outreach measurable across centres.",
    date: "2026-07-28",
    readMinutes: 5,
    tags: ["Outreach", "Quality"],
    href: mediumProfileUrl(),
    placeholder: true,
  },
  {
    title: "From ERP go-lives to campaign ops",
    excerpt: "What Source-to-Pay transformation taught me about running programs where adoption is everything.",
    date: "2026-06-30",
    readMinutes: 6,
    tags: ["Career", "Transformation"],
    href: mediumProfileUrl(),
    placeholder: true,
  },
  {
    title: "Building EuroDrive in public",
    excerpt: "Design tokens, NLP search and a depreciation model: shipping a marketplace prototype solo.",
    date: "2026-05-18",
    readMinutes: 8,
    tags: ["Product", "Next.js"],
    href: mediumProfileUrl(),
    placeholder: true,
  },
];
