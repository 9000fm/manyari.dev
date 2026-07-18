export const ME = {
  name: "Flavio Manyari",
  role: "Freelance Designer & Developer",
  location: "Lima, PE",
  email: "flavio@manyari.dev",
  phone: "+51 990 028 077",
  available: "Available",
  about:
    "I help brands and online shops sell more - end to end, from brand and design to code and launch. 4+ years, clients across three continents. One person, from concept to live.",
  socials: {
    github: "https://github.com/9000fm",
    linkedin: "https://www.linkedin.com/in/flavio-manyari-bab9a9215/",
    whatsapp: "https://wa.me/51990028077",
  },
} as const;

export type Project = {
  slug: string;
  title: string;
  year: number;
  role: string;
  url: string | null;
  tag: string;
  blurb: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "tonydecay",
    title: "Tony Decay",
    year: 2026,
    role: "End-to-end · Brand · Next.js · Supabase · PayPal",
    url: "https://tonydecay.com",
    tag: "client",
    blurb: "Limited-edition print store for illustrator Tony Decay - full brand plus a full-stack Next.js shop with live inventory and PayPal checkout.",
  },
  {
    slug: "silverback",
    title: "Silverback Stripes",
    year: 2026,
    role: "Site redesign · Shopify · Liquid",
    url: "https://silverbackstripes.com",
    tag: "client",
    blurb: "Shopify storefront redesign for a combat-sports apparel brand - rebuilt homepage, navigation, and brand pages on the Dawn/Liquid theme.",
  },
  {
    slug: "superself",
    title: "Superself.online",
    year: 2026,
    role: "End-to-end · Brand · Next.js · WebGL · Deploy",
    url: "https://superself.online",
    tag: "self",
    blurb: "A Windows-95-style desktop site for an electronic music label - WebGL visuals, generative particles, a live shoutbox, and a shop. Built end to end.",
  },
  {
    slug: "micaela",
    title: "Micaela Lucía",
    year: 2025,
    role: "End-to-end · Next.js · Sanity CMS · Deploy",
    url: "https://micaelalucia.com",
    tag: "client",
    blurb: "Portfolio for a Lima photographer and filmmaker - Next.js with a Sanity CMS she updates herself. Architecture to deploy.",
  },
  {
    slug: "brisol",
    title: "Brisol",
    year: 2026,
    role: "Redesign · WordPress",
    url: "https://brisol.pe",
    tag: "client",
    blurb: "Corporate website design and redesign for a Peruvian solar-energy company - rebuilt on WordPress with a lead-capture funnel.",
  },
  {
    slug: "digeart",
    title: "Digeart",
    year: 2026,
    role: "End-to-end · Next.js · Supabase · Deploy",
    url: "https://digeart.online",
    tag: "personal",
    blurb: "Personal project - a hand-curated discovery app for underground electronic music, with genre filters, YouTube playback, and saved likes.",
  },
];

export type Job = {
  title: string;
  company: string;
  location: string;
  period: string;
  blurb: string;
};

export const EXPERIENCE: Job[] = [
  {
    title: "Web Developer & IT Consultant",
    company: "Ecolution Industries Pty Ltd",
    location: "Sunshine Coast, QLD, Australia (Remote)",
    period: "May 2024 — 2026",
    blurb: "Led the full redesign of ecolution.com.au on WordPress. Implemented technical SEO and structured metadata. Configured SPF/DKIM/DMARC. Managed DNS migration, SSL, hosting infrastructure.",
  },
  {
    title: "Freelance Web Developer & Designer",
    company: "Independent",
    location: "Lima, PE",
    period: "Dec 2023 — Present",
    blurb: "Built superself.online (Next.js 16, p5.js, full brand identity) and Micaela Lucia's Portfolio (Next.js + Sanity + Framer Motion). Created graphic materials for clients — logos, brand manuals, social assets.",
  },
  {
    title: "Freelance Graphic Designer",
    company: "Independent",
    location: "Lima, PE",
    period: "Nov 2020 — Dec 2023",
    blurb: "Designed printed materials for a medical-sector company. Created event flyers and promotional materials for Lima's electronic music scene. Brand identities for small businesses.",
  },
  {
    title: "Community Manager",
    company: "T&IL Cleaning Services LLC",
    location: "Baltimore, MD (Remote)",
    period: "Dec 2021 — Oct 2023",
    blurb: "Created and managed content for Instagram, Facebook, TikTok. Coordinated client communications. Produced and edited social-media video.",
  },
];

export type SkillGroup = { label: string; items: string[] };

export const SKILLS: SkillGroup[] = [
  { label: "Design",           items: ["Brand Identity", "UI/UX", "Adobe Suite"] },
  { label: "Development",      items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML / CSS", "Tailwind"] },
  { label: "E-commerce & CMS", items: ["Shopify", "Liquid", "WordPress", "Sanity"] },
  { label: "Infrastructure",   items: ["Git", "Vercel", "Linux / EC2", "Technical SEO"] },
];

export const EDUCATION = [
  {
    title: "Music Production",
    school: "Universidad Peruana de Ciencias Aplicadas (UPC)",
    period: "2018 — 2023",
    detail: "Synthesis, sound design, electronic composition, DAWs (Ableton, Logic, Pro Tools).",
  },
  {
    title: "Full Stack Python Developer Bootcamp",
    school: "Skillnest (ex Coding Dojo Latam)",
    period: "Feb — Jun 2023",
    detail: "HTML, CSS, JavaScript, Python, Flask, Django, MySQL. Final project: full-stack ecommerce.",
  },
] as const;

export const SERVICES = [
  "Web Design & Development",
  "E-commerce & Shopify",
  "Brand Identity",
  "Frontend (React / Next.js)",
  "Technical SEO",
  "Hosting & Deploy",
] as const;

export const LANGUAGES = [
  { lang: "Spanish", level: "Native" },
  { lang: "English", level: "Fluent" },
] as const;

export const VARIANTS = [
  { slug: "v11a-sidebar",   n: "A",  name: "Brutalist · Sidebar",  vibe: "Wikipedia left TOC (recommended)" },
  { slug: "v11b-wide",      n: "B",  name: "Brutalist · Wide",     vibe: "Zoomed single column" },
  { slug: "v11c-split",     n: "C",  name: "Brutalist · Split",    vibe: "Identity left, content right" },
  { slug: "v01-swiss",      n: "01", name: "Swiss Editorial",     vibe: "Grotesk + grid + hairline rules" },
  { slug: "v02-warm70s",    n: "02", name: "Warm 70s",            vibe: "Cream/rust, chunky display serif" },
  { slug: "v03-newspaper",  n: "03", name: "Newspaper",           vibe: "NYT-style broadsheet, masthead" },
  { slug: "v04-win95",      n: "04", name: "Windows 95",          vibe: "Teal desktop chrome, taskbar" },
  { slug: "v05-macos7",     n: "05", name: "Mac OS 7",            vibe: "Pixel chrome, 1-bit, dotted patterns" },
  { slug: "v06-terminal",   n: "06", name: "Terminal CRT",        vibe: "Green on black, blinking cursor" },
  { slug: "v07-y2k",        n: "07", name: "Y2K Chrome",          vibe: "Chrome gradient, electric blue" },
  { slug: "v08-riso",       n: "08", name: "Riso Zine",           vibe: "Pink + blue, off-register, halftone" },
  { slug: "v09-bauhaus",    n: "09", name: "Bauhaus",             vibe: "Primary shapes, geometric sans" },
  { slug: "v10-midcentury", n: "10", name: "Mid-Century Atomic",  vibe: "Mustard/teal, star dividers" },
  { slug: "v11-brutalist",  n: "11", name: "Brutalist Raw HTML",  vibe: "Times + blue underlined links" },
  { slug: "v12-cassette",   n: "12", name: "Cassette Futurism",   vibe: "Amber on black, ASCII frames" },
] as const;
