export const ME = {
  name: "Flavio Manyari",
  role: "Web Developer & Designer",
  topline: "Design · Development · E-commerce · Digital Products · Independent & Remote",
  location: "Lima, PE",
  email: "flavio@manyari.dev",
  available: "Available",
  // Page metadata and the social share card (layout.tsx, opengraph-image.tsx)
  // read these, so a copy change here reaches link previews too.
  siteTitle: "Flavio Manyari's Portfolio",
  tagline: "Projects end to end - brand, design, code, deploy.",
  about:
    "Hi, I'm Flavio, a designer and web developer from Lima, Peru. I've worked with clients in Peru, the US, and Australia, designing interfaces, building websites, e-commerce stores, and applications, integrating APIs, and improving existing platforms.\n\nAlongside client work, I develop my own projects, including a music discovery application. My interest in music and design has also led me to explore generative art and real-time visuals.\n\nThis portfolio brings together a selection of my professional and personal work. For new projects, collaborations, or job opportunities, feel free to reach out.",
  aboutContactLabel: "reach out",
  // The professional profile from About. The printed CV uses it as
  // its summary (src/app/_cv/CvSheet.tsx). Keep it in step with `about`.
  summary:
    "Web developer and designer from Lima, Peru. I have worked with clients in Peru, the US, and Australia, building websites, online stores, and applications. My development experience builds on a background in graphic and interface design. Alongside client work, I design, launch, and maintain my own projects. My creative practice also includes generative art and real-time visuals.",
  socials: {
    github: "https://github.com/9000fm",
    linkedin: "https://www.linkedin.com/in/flavio-manyari-bab9a9215/",
    whatsapp: "https://wa.me/51990028077",
  },
} as const;

export const BANNER = {
  lead: "Currently available for freelance and remote work.",
  contact: "Contact →",
} as const;

export type Project = {
  slug: string;
  title: string;
  year: number;
  role: string;
  url: string | null;
  tag: string;
  blurb: string;
  technologies: string[];
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
    slug: "tonydecay",
    title: "Tony Decay",
    year: 2026,
    role: "Illustrator storefront: identity, shop, and checkout",
    url: "https://tonydecay.com",
    tag: "client",
    blurb: "Visual identity and online store for illustrator Tony Decay. I handled the design and development, with integrated payments and a panel where the artist manages sales and shipments.",
    technologies: ["Next.js", "TypeScript", "Supabase", "PayPal"],
    plate: "/plates/tonydecay.png",
    plateAlt: "The Foundation Series shop page of tonydecay.com, showing the grid of fifteen art prints beside the collection heading.",
    plateCap: "Foundation Series, the fifteen-print collection page.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "digeart",
    title: "Digeart",
    year: 2026,
    role: "Music discovery platform: product design and development",
    url: "https://digeart.online",
    tag: "personal",
    blurb: "Music discovery platform for listeners and producers. It brings together electronic music, mixes, and sampling material in a hand-curated catalog, and lets users create playlists. Designed, developed, and maintained independently.",
    technologies: ["Next.js", "TypeScript", "Supabase", "NextAuth"],
    plate: "/plates/digeart.png",
    plateAlt: "The digeart.online discovery grid, showing rows of underground record label artwork under a search field.",
    plateCap: "Hand-curated discovery grid.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "silverback",
    title: "Silverback Stripes",
    year: 2026,
    role: "E-commerce site: Shopify design and development",
    url: "https://silverbackstripes.com",
    tag: "client",
    blurb: "Shopify store for a martial arts apparel brand. Design and development of the homepage, product pages, and mobile navigation.",
    technologies: ["Shopify", "Liquid", "CSS", "JavaScript"],
    plate: "/plates/silverback.png",
    plateAlt: "The silverbackstripes.com homepage hero, with the headline Earn Your Stripes over a photograph of a grappling session.",
    plateCap: "Homepage.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "civiclick",
    title: "CiviClick",
    year: 2026,
    tag: "client",
    url: "https://civiclick.com",
    role: "Landing page design & prototyping",
    blurb: "Designed and prototyped a landing page in HTML/CSS/JS for a civic engagement SaaS platform. Responsive review and handoff for WordPress implementation. Project for Design In DC.",
    technologies: ["HTML","CSS","JavaScript"],
    plate: "/plates/civiclick.png",
    plateAlt: "The CiviClick landing page prototype, with its headline and a circular composition of the US Capitol and product screens.",
    plateCap: "Homepage prototype prepared for WordPress implementation.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "brisol",
    title: "Brisol",
    year: 2026,
    tag: "client",
    url: "https://brisol.pe",
    role: "WordPress maintenance",
    blurb: "WordPress site maintenance and recovery: file and database review, plugin updates, backups, and removal of unauthorized content.",
    technologies: ["WordPress","cPanel"],
    plate: "/plates/brisol.png",
    plateAlt: "The Brisol homepage, with a solar installation headline and an inquiry form.",
    plateCap: "The WordPress site maintained for Brisol.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "ecolution",
    title: "Ecolution Industries",
    year: 2025,
    tag: "client",
    url: "https://ecolutionsolar.com.au",
    role: "WordPress design & development",
    blurb: "Redesigned the WordPress website of an Australian solar energy company. Reorganized the site structure and content, and designed its pages.",
    technologies: ["WordPress","Elementor"],
    plate: "/plates/ecolution.png",
    plateAlt: "The Ecolution Industries homepage, showing solar panels and an estimate request form.",
    plateCap: "Ecolution Industries, Australia. Website redesign, 2025.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "superself",
    title: "Superself.online",
    year: 2025,
    role: "Independent record label: identity, website, and catalog",
    url: "https://superself.online",
    tag: "self",
    blurb: "Site and brand for my electronic music label. A digital identity inspired by the aesthetics of the early internet, with generative visuals, a release catalog, and merchandise. Designed and developed end to end, in three languages.",
    technologies: ["Next.js", "TypeScript", "Supabase", "Redis"],
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
    role: "Photography portfolio: website design and development",
    url: "https://micaelalucia.com",
    tag: "client",
    blurb: "Portfolio and archive for a photographer - full-width documentary photography, a minimal interface, and a grid that grows with her archive. Designed, built, and deployed.",
    technologies: ["Next.js", "TypeScript", "Sanity", "Tailwind"],
    plate: "/plates/micaela.png",
    plateAlt: "The micaelalucia.com portfolio, an edge-to-edge masonry grid of documentary and archival photographs under a light header.",
    plateCap: "The photo grid, edge to edge.",
    plateW: 440,
    plateH: 275,
  },
];

// The website shows all projects; the CV keeps its approved six-project selection.
const CV_PROJECT_SLUGS = ["tonydecay", "digeart", "silverback", "civiclick", "brisol", "ecolution"];

export type CvProject = Pick<Project, "slug" | "title" | "url" | "role" | "blurb"> & { context?: string };
const CV_CONTEXT: Record<string, string> = {
  civiclick: "2026",
  brisol: "brisol.pe · 2026",
  ecolution: "Australia · 2025",
};
export const CV_PROJECTS: CvProject[] = PROJECTS.filter((p) => CV_PROJECT_SLUGS.includes(p.slug)).map((p) => ({ ...p, context: CV_CONTEXT[p.slug] }));

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
    title: "Designer & Developer",
    company: "Independent",
    location: "",
    period: "2020 - Present",
    blurb: "Independent design work since 2020, expanding into web design and development in 2023. My work includes brand identity, interfaces, e-commerce, deployment, and ongoing maintenance.",
  },
  {
    title: "Freelance UI Designer",
    company: "Projects for Design In DC",
    location: "",
    period: "2025 - 2026",
    blurb: "Designed interfaces and web prototypes for agency client projects. Prepared design proposals and reviewed responsive layouts for implementation.",
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

export const LANGUAGES = [
  { lang: "Spanish", level: "Native" },
  { lang: "English", level: "Fluent" },
] as const;
