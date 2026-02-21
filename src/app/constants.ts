/* ── Site Constants ── */

export const SITE = {
  name: "SUPERSELF STUDIO",
  url: "https://studio.superself.online",
  email: "flavio@superself.online",
  github: "https://github.com/9000fm",
  instagram: "https://instagram.com/sqr.fm",
  linkedin: "https://linkedin.com/in/flavio-manyari",
} as const;

/* ── Color Palette ── */

export const COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  offWhite: "#E8E8E8",
  grey: "#888888",
  darkGrey: "#1A1A1A",
  accent: "#FF4D00",
} as const;

/* ── Projects ── */

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  tags: string[];
  description: string;
  url?: string;
  image?: string;
}

/* ── Services ── */

export const SERVICES = [
  "WEB DESIGN & CODE",
  "GRAPHIC DESIGN",
  "VISUAL IDENTITY",
  "BRANDING",
  "MUSIC",
] as const;

/* ── Projects ── */

export const PROJECTS: Project[] = [
  {
    slug: "superself-online",
    title: "superself.online",
    subtitle: "Music Label Platform",
    year: "2025",
    tags: ["Next.js", "React 19", "p5.js", "Tailwind 4"],
    description:
      "Music label website with generative art visuals, audio integration, and perfect Lighthouse scores. Built with Next.js 16 and React 19.",
    url: "https://superself.online",
  },
  {
    slug: "sqr-fm",
    title: "sqr.fm",
    subtitle: "Daily Generative Art",
    year: "2024–now",
    tags: ["p5.js", "Creative Coding", "Generative Art"],
    description:
      "Daily creative coding practice exploring perfect loops, iterative compositions, and algorithmic aesthetics. Published on Instagram @sqr.fm.",
    url: "https://instagram.com/sqr.fm",
  },
  {
    slug: "portafolio-micaela",
    title: "portafolio-micaela",
    subtitle: "Architect Portfolio",
    year: "2024",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    description:
      "Minimal portfolio for architect Micaela Manyari. Clean grid layouts, smooth transitions, Lighthouse 99/100.",
    url: "https://portafolio-micaela.vercel.app",
  },
  {
    slug: "ecolution",
    title: "Ecolution",
    subtitle: "Corporate Redesign",
    year: "2024",
    tags: ["WordPress", "Elementor", "UI/UX"],
    description:
      "Full redesign of ecolution.com.au — Australian environmental consultancy. Modernized branding, improved UX and page structure.",
    url: "https://ecolution.com.au",
  },
];
