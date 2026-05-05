export const ME = {
  name: "Flavio Manyari",
  role: "Web Developer & Graphic Designer",
  location: "Lima, PE",
  email: "flavio@superself.online",
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
};

export const PROJECTS: Project[] = [
  {
    slug: "ecolution",
    title: "Ecolution Industries",
    year: 2024,
    role: "WordPress redesign · Technical SEO · DNS",
    url: "https://ecolution.com.au",
    tag: "client",
  },
  {
    slug: "superself",
    title: "Superself.online",
    year: 2024,
    role: "Next.js 16 · Brand identity · Generative ASCII",
    url: "https://superself.online",
    tag: "self",
  },
  {
    slug: "micaela",
    title: "Micaela Lucia's Portfolio",
    year: 2024,
    role: "Next.js 16 · Sanity CMS · Framer Motion",
    url: null,
    tag: "client",
  },
  {
    slug: "digeart",
    title: "Digeart",
    year: 2023,
    role: "Visual identity",
    url: null,
    tag: "brand",
  },
];

export const VARIANTS = [
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
