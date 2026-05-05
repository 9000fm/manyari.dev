export const ME = {
  name: "Flavio Manyari",
  role: "Web Developer & Graphic Designer",
  location: "Lima, PE",
  email: "flavio@superself.online",
  phone: "+51 990 028 077",
  available: "Available for contract — 2025",
  about:
    "Web developer and graphic designer with 4+ years building brands, websites, and visual systems for clients across three continents. Background in music production and generative art — I treat code as a craft and brand work as architecture.",
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
    slug: "ecolution",
    title: "Ecolution Industries",
    year: 2024,
    role: "WordPress redesign · Technical SEO · DNS",
    url: "https://ecolution.com.au",
    tag: "client",
    blurb: "Full WordPress redesign for an Australian renewable-energy contractor. Restructured site architecture, implemented technical SEO, and resolved corporate email deliverability via SPF/DKIM/DMARC.",
  },
  {
    slug: "superself",
    title: "Superself.online",
    year: 2024,
    role: "Next.js 16 · Brand identity · Generative ASCII",
    url: "https://superself.online",
    tag: "self",
    blurb: "Multilingual music label site (ES/EN/JP) with i18n routing, generative ASCII visuals, and full brand design — vector logo, palette, type system, brand manual. Lighthouse 100/100.",
  },
  {
    slug: "micaela",
    title: "Micaela Lucia's Portfolio",
    year: 2024,
    role: "Next.js 16 · Sanity CMS · Framer Motion",
    url: null,
    tag: "client",
    blurb: "Professional portfolio with headless CMS and animated page transitions. Lighthouse 99/100.",
  },
  {
    slug: "digeart",
    title: "Digeart",
    year: 2023,
    role: "Visual identity",
    url: null,
    tag: "brand",
    blurb: "Brand identity for an independent art project — logo, palette, type system, applications.",
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
    period: "May 2024 — Present",
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
  { label: "Design",          items: ["Adobe Illustrator", "Photoshop", "Premiere", "After Effects", "Canva", "Brand Identity", "UI/UX"] },
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
  { slug: "v01-swiss",     n: "01", name: "Swiss Editorial",    vibe: "Grotesk + grid + hairline rules" },
  { slug: "v05-macos7",    n: "02", name: "Mac OS 7",           vibe: "Pixel chrome, 1-bit, dotted patterns" },
  { slug: "v07-y2k",       n: "03", name: "Y2K Chrome",         vibe: "Chrome gradient, electric blue" },
  { slug: "v09-bauhaus",   n: "04", name: "Bauhaus",            vibe: "Primary shapes, geometric sans" },
  { slug: "v11-brutalist", n: "05", name: "Brutalist Raw HTML", vibe: "Times + blue underlined links" },
] as const;
