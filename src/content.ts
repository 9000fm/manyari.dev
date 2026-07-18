export const ME = {
  name: "Flavio Manyari",
  role: "Freelance Designer & Developer",
  location: "Lima, PE",
  email: "flavio@manyari.dev",
  phone: "+51 990 028 077",
  available: "Available",
  about:
    "Web design and development, end to end. I build distinctive sites from identity to deployment for e-commerce, editorial portfolios, and independent products.",
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
    blurb: "Limited-edition print store for illustrator Tony Decay - brand, shop, and a live inventory counter, built end to end.",
  },
  {
    slug: "silverback",
    title: "Silverback Stripes",
    year: 2026,
    role: "Site redesign · Shopify · Liquid",
    url: "https://silverbackstripes.com",
    tag: "client",
    blurb: "Storefront redesign for a combat-sports apparel brand - rebuilt the homepage, navigation, and key brand pages.",
  },
  {
    slug: "superself",
    title: "Superself.online",
    year: 2025,
    role: "End-to-end · Brand · Next.js · WebGL · Deploy",
    url: "https://superself.online",
    tag: "self",
    blurb: "Site and brand for an electronic music label - a playful desktop-style interface, generative visuals, a live shoutbox, and a shop. Built end to end, in three languages.",
  },
  {
    slug: "micaela",
    title: "Micaela Lucía",
    year: 2025,
    role: "End-to-end · Next.js · Sanity CMS · Deploy",
    url: "https://micaelalucia.com",
    tag: "client",
    blurb: "Portfolio for a photographer and filmmaker - editorial layout, animated transitions, and a client-managed CMS. Designed, built, and deployed end to end.",
  },
  {
    slug: "brisol",
    title: "Brisol",
    year: 2026,
    role: "Redesign · WordPress",
    url: "https://brisol.pe",
    tag: "client",
    blurb: "Redesign of a Peruvian solar-energy company's corporate site, rebuilt with a working lead-capture funnel.",
  },
  {
    slug: "digeart",
    title: "Digeart",
    year: 2026,
    role: "End-to-end · Next.js · Supabase · Deploy",
    url: "https://digeart.online",
    tag: "personal",
    blurb: "Personal project - a hand-curated discovery app for underground electronic music, with genre filters and YouTube playback.",
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

// One line under the Tools heading - frames AI as an advantage under skilled control.
export const WORKFLOW =
  "I use modern development and AI-assisted workflows to prototype quickly, while keeping design, architecture, and final implementation under direct control.";

export const SKILLS: SkillGroup[] = [
  { label: "Design",        items: ["Adobe Suite", "Figma", "Brand Identity", "UI/UX"] },
  { label: "Frontend",      items: ["Next.js / React", "TypeScript", "Tailwind"] },
  { label: "Creative Code", items: ["p5.js", "WebGL", "Framer Motion", "Generative Art"] },
  { label: "E-commerce",    items: ["Shopify / Liquid", "PayPal"] },
  { label: "CMS & Backend", items: ["Sanity", "Supabase", "WordPress"] },
  { label: "Infra & SEO",   items: ["Vercel", "DNS / SSL / Hosting", "Technical SEO"] },
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
  "Website Design & Build",
  "Online Stores & E-commerce",
  "Content-managed Sites (CMS)",
  "SEO",
  "Hosting, DNS & Deployment",
  "Brand & Visual Identity",
] as const;

// Short tags for the top ticker - keep it simple / scannable.
export const TICKER = [
  "Web Design",
  "E-commerce",
  "CMS",
  "SEO",
  "Hosting",
  "Brand Identity",
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
