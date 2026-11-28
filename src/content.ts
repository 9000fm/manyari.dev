import { CV_SKILLS } from "./app/_cv/cvSkills";

export const ME = {
  name: "Flavio Manyari",
  role: "Web Developer & Designer",
  topline: "Web Development · Visual Design · E-commerce · Digital Products · Remote",
  location: "Lima, PE",
  email: "flavio@manyari.dev",
  available: "Available",
  // Page metadata and the social share card (layout.tsx, opengraph-image.tsx)
  // read these, so a copy change here reaches link previews too.
  siteTitle: "Flavio Manyari's Portfolio",
  tagline: "Projects end to end - brand, design, code, deploy.",
  about:
    "Hello, I'm Flavio, a web developer and designer from Lima, Peru, with experience working with clients in Peru, the US, and Australia. I specialize in designing and developing websites, online stores, and web applications, with professional experience in programming, graphic design, and UI/UX.\n\nOutside of client work, I dedicate part of my time to my own digital projects. My creative interests include electronic music production, generative art, and audiovisual design.\n\nThis portfolio brings together a selection of my professional and personal work. For new projects, collaborations, or job opportunities, feel free to reach out.",
  aboutContactLabel: "reach out",
  // CV summary; independent of the website About.
  summary:
    "Web developer and designer with experience delivering websites, e-commerce platforms and digital products for clients in Peru, the US and Australia. I work independently and alongside agency teams, covering UI/UX, frontend development, API integration and technical troubleshooting. Outside of client work, I develop my own digital products and explore generative art, electronic music and audiovisual design.",
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
    role: "E-commerce and visual identity",
    url: "https://tonydecay.com",
    tag: "client",
    blurb: "Designed and developed the artist's visual identity and online store, including payment integration and a custom dashboard for managing sales and shipments.",
    technologies: ["Next.js", "TypeScript", "Supabase", "PayPal"],
    plate: "/plates/tonydecay.png",
    plateAlt: "The Foundation Series shop page of tonydecay.com, showing the grid of fifteen art prints beside the collection heading.",
    plateCap: "Landing page featuring the Foundation Series art print collection.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "digeart",
    title: "Digeart",
    year: 2026,
    role: "Independent web application",
    url: "https://digeart.online",
    tag: "personal",
    blurb: "Music discovery platform built with Next.js, Supabase, and the YouTube API. It automatically updates its catalog from selected channels and includes an integrated player and user-created playlists.",
    technologies: ["Next.js", "TypeScript", "Supabase", "YouTube API", "NextAuth"],
    plate: "/plates/digeart.png",
    plateAlt: "The digeart.online discovery grid, showing rows of underground record label artwork under a search field.",
    plateCap: "Music discovery interface with a searchable catalog of tracks.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "silverback",
    title: "Silverback Stripes",
    year: 2026,
    role: "Shopify e-commerce",
    url: "https://silverbackstripes.com",
    tag: "client",
    blurb: "E-commerce design and development for a martial arts apparel brand, with custom Shopify layouts and responsive navigation.",
    technologies: ["Shopify", "Liquid", "CSS", "JavaScript"],
    plate: "/plates/silverback.png",
    plateAlt: "The silverbackstripes.com homepage hero, with the headline Earn Your Stripes over a photograph of a grappling session.",
    plateCap: "Shopify storefront for a martial arts apparel brand.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "civiclick",
    title: "CiviClick",
    year: 2026,
    tag: "client",
    url: "https://civiclick.com",
    role: "Frontend prototyping",
    blurb: "Responsive landing page design and frontend prototyping for a civic engagement SaaS platform. Developed in HTML, CSS, and JavaScript for Design In DC.",
    technologies: ["HTML","CSS","JavaScript"],
    plate: "/plates/civiclick.png",
    plateAlt: "The CiviClick landing page prototype, with its headline and a circular composition of the US Capitol and product screens.",
    plateCap: "Landing page prototype for the civic engagement platform.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "brisol",
    title: "Brisol",
    year: 2026,
    tag: "client",
    url: "https://brisol.pe",
    role: "WordPress recovery and security",
    blurb: "WordPress maintenance and technical support, covering website recovery, security improvements, database troubleshooting, and contact form integration.",
    technologies: ["WordPress","cPanel"],
    plate: "/plates/brisol.png",
    plateAlt: "The Brisol homepage, with a solar installation headline and an inquiry form.",
    plateCap: "Solar installation services and the customer inquiry form.",
    plateW: 440,
    plateH: 275,
  },
  {
    slug: "ecolution",
    title: "Ecolution Industries",
    year: 2025,
    tag: "client",
    url: "https://ecolutionsolar.com.au",
    role: "Corporate website redesign",
    blurb: "Redesigned and restructured a corporate WordPress website for an Australian solar energy company, focusing on page design and content organization.",
    technologies: ["WordPress","Elementor"],
    plate: "/plates/ecolution.png",
    plateAlt: "The Ecolution Industries homepage, showing solar panels and an estimate request form.",
    plateCap: "Redesigned homepage for an Australian solar energy company.",
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
    plateCap: "Homepage of the independent electronic music label.",
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
    title: "Web Developer & Designer",
    company: "Independent",
    location: "",
    period: "2020 - Present",
    blurb: "Independent design work since 2020, expanding into web design and development in 2023. My work includes UI/UX, websites, e-commerce, third-party integrations, deployment, and maintenance.",
  },
  {
    title: "UI Designer",
    company: "Projects for Design In DC",
    location: "",
    period: "2025 - 2026",
    blurb: "Web design and prototyping for agency clients, including responsive layouts, UI design, and development handoff.",
  },

];

export type SkillGroup = { label: string; items: string[] };

// Website display labels; preserve the approved CV categories and shared skill items.
export const SKILL_LABELS: Record<string, string> = {
  "Frontend Development": "Web Development",
  "Backend, Databases & APIs": "Backend, Databases & APIs",
  "E-commerce & CMS": "E-commerce & CMS",
  "Development Tools": "Tools & Infrastructure",
  "Design & Creative Coding": "Design & Creative Technology",
  "Professional Skills": "Professional Skills",
};

export const SKILLS: SkillGroup[] = CV_SKILLS.map((group) => ({
  label: group.label,
  items: group.items.split(", "),
}));

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
  { lang: "French", level: "Basic" },
  { lang: "Portuguese", level: "Basic" },
] as const;
