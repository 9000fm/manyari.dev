export const ME = {
  name: "Flavio Manyari",
  role: "Web Developer & Graphic Designer",
  location: "Lima, PE",
  email: "flavio@superself.online",
  phone: "+51 990 028 077",
  available: "Available for contract — 2026",
  about:
    "Web developer and graphic designer with 4+ years taking projects end-to-end — brand, design, code, deploy — for clients across three continents. Background in music production and generative art. I treat code as a craft and brand work as architecture.",
  socials: {
    github: "https://github.com/9000fm",
    linkedin: "https://www.linkedin.com/in/flavio-manyari-bab9a9215/",
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
    slug: "digeart",
    title: "Digeart",
    year: 2023,
    role: "End-to-end · Brand identity · Web · Deploy",
    url: "https://digeart.vercel.app",
    tag: "brand",
    blurb: "Solo build for an independent art project — brand identity, logo, palette, type system, web build, and deploy.",
  },
  {
    slug: "ecolution",
    title: "Ecolution Industries",
    year: 2024,
    role: "End-to-end · WordPress · SEO · DNS · Email infra",
    url: "https://ecolution.com.au",
    tag: "client",
    blurb: "Full redesign of an Australian renewable-energy contractor's site. Restructured architecture, implemented technical SEO, resolved corporate email deliverability (SPF/DKIM/DMARC), and managed DNS/SSL/hosting end-to-end.",
  },
  {
    slug: "superself",
    title: "Superself.online",
    year: 2024,
    role: "End-to-end · Brand · Next.js · Generative · Deploy",
    url: "https://superself.online",
    tag: "self",
    blurb: "Multilingual music label site (ES/EN/JP) — solo build from concept to deploy. Brand identity, vector logo, palette, type system, brand manual, i18n routing, and generative ASCII visuals. Lighthouse 100/100.",
  },
  {
    slug: "micaela",
    title: "Micaela Lucia's Portfolio",
    year: 2024,
    role: "End-to-end · Next.js · Sanity CMS · Motion · Deploy",
    url: "https://portafolio-micaela.vercel.app",
    tag: "client",
    blurb: "Solo build of a professional portfolio with headless CMS and animated page transitions. Architecture to deploy. Lighthouse 99/100.",
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
  { label: "Design",          items: ["Adobe Suite", "Canva", "Brand Identity", "UI/UX"] },
  { label: "Frontend",        items: ["JavaScript", "TypeScript", "React 19", "Next.js 16", "HTML5/CSS3", "Tailwind CSS 4"] },
  { label: "Creative Coding", items: ["p5.js", "Framer Motion", "TouchDesigner", "Blender", "Generative Art"] },
  { label: "Tools",           items: ["Git", "Vercel", "WordPress", "Linux/EC2", "Claude / Cursor"] },
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
  "Brand Identity",
  "Visual Systems",
  "Generative & Creative Coding",
  "Technical SEO",
  "Hosting & Infrastructure",
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
