/**
 * Site copy, links and case studies.
 * Books live in lib/books.ts. Medium settings live in lib/articles.ts.
 * Anything marked TODO is a placeholder you should replace.
 */

export const profile = {
  /** Used only in the nav brand and the hero title. */
  fullName: "Yash Singh",
  /** Used everywhere else. */
  name: "Yash",
  role: "Program Manager",
  company: "Jarvis Consulting",
  headline: { lead: "Program Manager", accent: "& Campaign Strategist" },
  status: "Open for select advisory & projects",
  location: "Hyderabad, India",
  timezone: "IST · UTC+5:30",
  education: "B.Tech, IIIT Bhubaneswar",
  email: "yashsingh.work.pm@gmail.com",
  campaignsLed: "4",
  campaignsLabel: "National campaigns led",
};

/** Topmate settings. Set `handle` and every booking button points at https://topmate.io/<handle>. */
export const topmate = {
  handle: "", // TODO: your Topmate handle, e.g. "yashsingh"
  /**
   * Optional: Topmate's popup/floating-button widget. Paste the script `src` and any
   * data-* attributes from Topmate's "Embed" snippet. Leave src "" to keep link-only booking.
   */
  widget: {
    src: "",
    attributes: {} as Record<string, string>,
  },
};

export const topmateUrl = topmate.handle ? `https://topmate.io/${topmate.handle}` : "https://topmate.io/";

export const links = {
  topmate: topmateUrl,
  coffee: "https://buymeacoffee.com/", // TODO
  linkedin: "https://www.linkedin.com/", // TODO
  medium: "https://medium.com/", // TODO: https://medium.com/@your-handle
  x: "https://x.com/", // TODO
  github: "https://github.com/", // TODO
};

/* ------------------------------------------------------------ Dynamic bio */

export type BioLens = "campaigns" | "product" | "transformation";

export const bio: Record<BioLens, { label: string; text: string }> = {
  campaigns: {
    label: "Campaigns",
    text: "I run end-to-end political campaigns for major parties across India at Jarvis Consulting. Strategy, ground-level analytics, voter outreach operations and digital execution, held together by one daily operating rhythm.",
  },
  product: {
    label: "Product",
    text: "I think like a product manager. I find the real job to be done, ship a working prototype in days, and measure whether people use it. EuroDrive and Master Prompt are two products I built end to end.",
  },
  transformation: {
    label: "Transformation",
    text: "Before campaigns, I digitised Source-to-Pay at Genpact on Coupa and Tungsten/Kofax, and supported Oracle ERP programmes at Deloitte USI. That is where I learned that adoption is the product.",
  },
};

export const career = [
  { org: "Jarvis Consulting", role: "Program Manager", note: "Political campaigns, end to end", current: true },
  { org: "Genpact", role: "Digital Transformation", note: "Source-to-Pay on Coupa, Tungsten/Kofax" },
  { org: "Deloitte USI", role: "Consultant", note: "Oracle ERP implementation" },
];

/* ----------------------------------------------------------- Capabilities */

export type Capability = {
  key: "campaign" | "product" | "prototype" | "tech";
  title: string;
  kicker: string;
  summary: string;
  skills: string[];
  proof: string;
};

export const capabilities: Capability[] = [
  {
    key: "campaign",
    title: "Campaign Operations",
    kicker: "Jarvis Consulting",
    summary:
      "Run the machine behind a campaign: the war-room cadence, the field data, the outreach engine and the reporting leadership reads every morning.",
    skills: [
      "Campaign strategy & planning",
      "Ground-level analytics",
      "Voter outreach operations",
      "Call-centre coordination",
      "Call-quality audits",
      "Daily MIS & closure reports",
      "Digital execution",
      "Multi-team program governance",
    ],
    proof: "3–4 national campaigns led",
  },
  {
    key: "product",
    title: "Product Strategy",
    kicker: "Discovery → roadmap",
    summary: "0→1 discovery to a sequenced roadmap: find the painful problem, size it, and ship what matters first.",
    skills: ["0→1 discovery", "Roadmaps & prioritisation", "PRDs & success metrics", "North-star metrics"],
    proof: "EuroDrive · Master Prompt",
  },
  {
    key: "prototype",
    title: "Rapid Prototyping",
    kicker: "Idea → deployed in days",
    summary: "Figma tokens to React components to a live Vercel URL, with realistic seed data so the demo convinces.",
    skills: ["Next.js · React", "Tailwind design systems", "AI tools & prompt engineering", "Python automation"],
    proof: "Next.js 14 on Vercel",
  },
  {
    key: "tech",
    title: "Tech Implementation",
    kicker: "ERP & Source-to-Pay",
    summary: "Requirements, configuration, testing and adoption for enterprise suites, without breaking month-end.",
    skills: ["Coupa", "Tungsten / Kofax", "Oracle ERP", "UAT & cutover", "Process mapping"],
    proof: "Genpact · Deloitte USI",
  },
];

/* ------------------------------------------------------------------ Work */

export type Project = {
  id: string;
  title: string;
  org: string;
  role: string;
  period: string;
  visual: "campaign" | "listing" | "prompt" | "s2p";
  blurb: string;
  highlights: string[];
  bullets: string[];
  stack: string[];
  href: string;
  cta: string;
};

export const projects: Project[] = [
  {
    id: "jarvis",
    title: "Political Campaign Operations & Growth Strategy",
    org: "Jarvis Consulting",
    role: "Program Manager",
    period: "Current",
    visual: "campaign",
    blurb:
      "End-to-end program management of political campaigns for major parties across India, from strategy and field analytics to outreach operations and digital execution.",
    highlights: ["3–4 national campaigns led", "Multi-region outreach", "Daily leadership MIS"],
    bullets: [
      "Owned the campaign operating rhythm: plans, daily targets, reviews and closure reporting",
      "Built ground-level analytics from field and call-centre data into decision-ready reports",
      "Coordinated regional outreach centres and their team leads against shared KPIs",
      "Designed call-quality audits so outreach quality was measured, not assumed",
      "Ran digital execution alongside field programs so both told one story",
    ],
    stack: ["Program governance", "Field analytics", "Outreach ops", "Excel · Python", "Reporting"],
    href: "#connect",
    cta: "Discuss a campaign",
  },
  {
    id: "eurodrive",
    title: "EuroDrive",
    org: "Independent build",
    role: "Founder · PM · Builder",
    period: "2026",
    visual: "listing",
    blurb: "A marketplace for European luxury cars with natural-language search, a depreciation model and AI comparisons.",
    highlights: ["Next.js 14", "NLP search", "Depreciation model"],
    bullets: [
      "Figma design-system tokens carried straight into React and Tailwind components",
      "Natural-language search, e.g. “V8 coupés under €120k with low mileage”",
      "Depreciation curve model showing where each car sits on its value path",
      "AI comparison of shortlisted cars and a Founder's Dashboard",
      "Synthetic seed database so every demo looks like a live marketplace",
    ],
    stack: ["Next.js 14", "React", "Tailwind", "Figma", "Vercel"],
    href: "#", // TODO: live URL or case study
    cta: "Open case study",
  },
  {
    id: "master-prompt",
    title: "Master Prompt",
    org: "Side product",
    role: "Creator",
    period: "2026",
    visual: "prompt",
    blurb: "A sellable prompt product that writes human-sounding B2B cold emails from a prospect's LinkedIn data.",
    highlights: ["AI-detection testing", "Reply-rate benchmarks"],
    bullets: [
      "Structured prompt that reads a prospect profile and drafts peer-to-peer outreach",
      "Testing guide for AI-detection scores before anything is sent",
      "Reply-rate benchmarking so sales teams can measure lift",
    ],
    stack: ["Prompt engineering", "Copywriting", "B2B sales"],
    href: "#", // TODO
    cta: "See the product",
  },
  {
    id: "s2p",
    title: "ERP & Source-to-Pay Transformation",
    org: "Genpact · Deloitte USI",
    role: "Transformation & ERP consultant",
    period: "Before Jarvis",
    visual: "s2p",
    blurb: "Procurement and accounts-payable digitisation on Coupa and Tungsten/Kofax, and Oracle ERP implementation support.",
    highlights: ["Coupa", "Tungsten / Kofax", "Oracle ERP"],
    bullets: [
      "Mapped requisition → PO → invoice → payment flows to remove manual hand-offs",
      "Designed invoice capture and approval routing on Tungsten/Kofax",
      "Supported Coupa configuration and user adoption",
      "Fit-gap analysis, UAT and hypercare on Oracle ERP programmes",
    ],
    stack: ["Coupa", "Tungsten", "Kofax", "Oracle ERP", "UAT"],
    href: "#", // TODO
    cta: "Read the story",
  },
];

export const sessions = [
  { name: "Campaign & program ops review", len: "45 min" },
  { name: "Product idea → prototype plan", len: "45 min" },
  { name: "Career: consulting to PM / program roles", len: "30 min" },
];
