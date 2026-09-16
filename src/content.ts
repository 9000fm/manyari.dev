export const ME = {
  name: "Flavio Manyari",
  role: "Web Designer & Developer",
  location: "Lima, PE",
  email: "flavio@manyari.dev",
  available: "Available",
  // Page metadata and the social share card (layout.tsx, opengraph-image.tsx)
  // read these, so a copy change here reaches link previews too.
  siteTitle: "Flavio Manyari's Portfolio",
  tagline: "Projects end to end - brand, design, code, deploy.",
  about:
    "Welcome. My name is Flavio, and this is my website. I design and build e-commerce sites and digital products, from the first layout to launch. Most of my work sits between design and development, so I tend to stay involved in the whole process. I've shipped stores and interfaces for clients in the US, Europe, and Latin America. Get in touch if you have something in mind.",
  // The About minus its greeting and closing line. The printed CV uses it as
  // its summary (src/app/_cv/CvSheet.tsx). Keep it in step with `about`.
  summary:
    "I design and build e-commerce sites and digital products, from the first layout to launch. Most of my work sits between design and development, so I tend to stay involved in the whole process. I've shipped stores and interfaces for clients in the US, Europe, and Latin America.",
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
  // 1-bit Atkinson-dithered plate, shown as a figure in Selected Work.
  // plateW/plateH are the real pixel size so the box is reserved and nothing
  // shifts while it loads (same reasoning as .identSphere for the globe).
  plate?: string;
  plateAlt?: string;
  plateCap?: string;
  plateW?: number;
  plateH?: number;
};

export const PROJECTS: Project[] = [
  {
    slug: "digeart",
    title: "Digeart",
    year: 2026,
    role: "Music discovery app: own project, design, build, and maintenance",
    url: "https://digeart.online",
    tag: "personal",
    blurb: "A discovery app for underground electronic music that plays as you browse: a hand-curated catalog, queue, keyboard shortcuts, likes and playlists. Maintained since launch.",
    plate: "/plates/digeart.png",
    plateAlt: "The digeart.online discovery grid, showing rows of underground record label artwork under a search field.",
    plateCap: "Hand-curated discovery grid.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "tonydecay",
    title: "Tony Decay",
    year: 2026,
    role: "Print store: brand, store, and checkout",
    url: "https://tonydecay.com",
    tag: "client",
    blurb: "Print store for illustrator Tony Decay, built end to end: brand, shop, PayPal checkout, inventory, and an order panel the artist runs himself.",
    plate: "/plates/tonydecay.png",
    plateAlt: "The Foundation Series shop page of tonydecay.com, showing the grid of fifteen art prints beside the collection heading.",
    plateCap: "Foundation Series, the fifteen-print collection page.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "silverback",
    title: "Silverback Stripes",
    year: 2026,
    role: "Shopify store: storefront and product pages",
    url: "https://silverbackstripes.com",
    tag: "client",
    blurb: "Shopify store for a combat-sports apparel brand: homepage, sections, navigation, and product pages.",
    plate: "/plates/silverback.png",
    plateAlt: "The silverbackstripes.com homepage hero, with the headline Earn Your Stripes over a photograph of a grappling session.",
    plateCap: "Homepage.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "superself",
    title: "Superself.online",
    year: 2025,
    role: "Label I co-founded: brand, site, and shop",
    url: "https://superself.online",
    tag: "self",
    blurb: "Site and brand for an electronic music label I co-founded - a playful wireframe interface, generative visuals, and a shop. Built end to end, in three languages.",
    plate: "/plates/superself.png",
    plateAlt: "The superself.online interface, a white wireframe corridor drawn in one-point perspective on black, with a text menu at the top left.",
    plateCap: "The label's main interface, drawn in one-point perspective.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "micaela",
    title: "Micaela Lucía",
    year: 2025,
    role: "Photography portfolio and archive: design and build",
    url: "https://micaelalucia.com",
    tag: "client",
    blurb: "Portfolio and archive for a photographer - full-width documentary photography, a minimal interface, and a grid that grows with her archive. Designed, built, and deployed.",
    plate: "/plates/micaela.png",
    plateAlt: "The micaelalucia.com portfolio, an edge-to-edge masonry grid of documentary and archival photographs under a light header.",
    plateCap: "The photo grid, edge to edge.",
    plateW: 440,
    plateH: 275,
  },
];

export type Job = {
  title: string;
  company: string;
  location: string;
  period: string;
  blurb: string;
};

// Reverse chronological: the current role first, then by end date.
export const EXPERIENCE: Job[] = [
  {
    title: "Freelance Web Developer & Designer",
    company: "Independent",
    location: "",
    period: "2023 - Present",
    blurb: "Web design and development for independent brands and small teams, delivered end to end: interface, storefront, checkout, and the client's admin panel. Hosting, domains, and maintenance after launch.",
  },
  {
    title: "UI Designer",
    company: "Design In DC",
    location: "United States (remote)",
    period: "2025 - 2026",
    blurb: "Contract interface design for a Washington DC agency: web layouts and mockups for the agency's client projects.",
  },
  {
    title: "Freelance Graphic Designer",
    company: "Independent",
    location: "",
    period: "2020 - Present",
    blurb: "Graphic design since 2020: brand identity, corporate print, and event flyers.",
  },
];

export type SkillGroup = { label: string; items: string[] };

export const SKILLS: SkillGroup[] = [
  { label: "Frontend",          items: ["HTML", "CSS", "JavaScript", "TypeScript", "React / Next.js", "Tailwind"] },
  { label: "E-commerce",        items: ["Shopify / Liquid", "PayPal"] },
  { label: "CMS & Backend",     items: ["Sanity", "Supabase", "WordPress"] },
  { label: "Design",            items: ["Adobe Suite", "Brand Identity", "UI/UX"] },
  { label: "Infra & SEO",       items: ["Git", "Vercel", "DNS / SSL / Hosting", "Technical SEO"] },
  { label: "Motion & Graphics", items: ["p5.js", "WebGL", "Framer Motion", "Generative Art"] },
];

// He did not finish either UPC career (Industrial Engineering to 6th cycle,
// Music Production to 8th), so no degree is claimed - framed as "studies".
// The Skillnest bootcamp is the one completed, certified credential -> first.
export const EDUCATION = [
  {
    title: "Full Stack Python Developer",
    school: "Skillnest (ex Coding Dojo Latam)",
    period: "2023",
    detail: "Certified. HTML, CSS, JavaScript, Python, Flask, Django, MySQL.",
  },
  {
    title: "University studies - Engineering & Music Production",
    school: "Universidad Peruana de Ciencias Aplicadas (UPC)",
    period: "2018 - 2023",
    detail: "",
  },
] as const;

export const SERVICES = [
  "Website Design & Build",
  "Online Stores & E-commerce",
  "Web Apps & Custom Features",
  "Brand & Visual Identity",
  "Content-managed Sites (CMS)",
  "SEO & Performance",
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
