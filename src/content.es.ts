// Spanish mirror of content.ts.
//
// This file holds ONLY the strings that change between languages. Everything
// structural (slugs, urls, years, plate sizes, skill items, periods) stays in
// content.ts and is shared, so there is exactly one source for it and the two
// files cannot drift apart the way the CV and its printer page once did.
//
// Lookups are by slug / company / school. If an entry is missing here the
// element simply keeps its English text instead of breaking: the switch reads
// `data-es`, and React omits that attribute when the value is undefined. So a
// forgotten translation degrades to English rather than to an empty line.
//
// FIRST PASS. The register should match the English: plain and factual, close to
// a Wikipedia article, no promotional language, no agency storytelling.

import { PROJECTS, SKILLS } from "./content";

type BySlug<T> = Record<(typeof PROJECTS)[number]["slug"], T>;

export const ME_ES = {
  role: "Diseñador y Desarrollador Web",
  available: "Disponible",
  about:
    "Bienvenido. Aquí es donde guardo mi trabajo. Diseño y construyo experiencias de e-commerce y productos digitales, desde la dirección inicial hasta el lanzamiento. Me gusta estar cerca de todo el proyecto, sobre todo donde se cruzan el diseño y las decisiones técnicas. He construido tiendas, portafolios y plataformas para clientes y equipos en Estados Unidos, Europa y Latinoamérica. Escríbeme si tienes algo en mente.",
} as const;

/** Project role lines and blurbs, keyed by slug so a new project cannot be missed. */
export const PROJECTS_ES: BySlug<{ role: string; blurb: string; plateCap: string }> = {
  tonydecay: {
    role: "Integral · Marca · Next.js · Supabase · PayPal",
    blurb:
      "Tienda de láminas de edición limitada para el ilustrador Tony Decay - marca, tienda y un contador de stock en vivo, hecho de principio a fin.",
    plateCap: "Foundation Series, la página de la colección de quince láminas.",
  },
  silverback: {
    role: "Rediseño de sitio · Shopify · Liquid",
    blurb:
      "Rediseño de la tienda de una marca de ropa de deportes de combate - rehice la portada, la navegación y las páginas de marca.",
    plateCap: "La portada después del rediseño.",
  },
  superself: {
    role: "Integral · Marca · Next.js · WebGL · Despliegue",
    blurb:
      "Sitio y marca para un sello de música electrónica - una interfaz tipo escritorio, visuales generativos, un shoutbox en vivo y una tienda. En tres idiomas.",
    plateCap: "La interfaz principal del sello, dibujada en perspectiva de un punto.",
  },
  micaela: {
    role: "Integral · Next.js · Sanity CMS · Despliegue",
    blurb:
      "Portafolio para una fotógrafa y cineasta - grilla editorial, transiciones animadas, y ella misma actualiza todo desde Sanity.",
    plateCap: "Grilla editorial, gestionada por la clienta desde Sanity.",
  },
  digeart: {
    role: "Integral · Next.js · Supabase · Despliegue",
    blurb:
      "Una app de descubrimiento de música electrónica underground, catalogada a mano, con filtros por género y reproducción desde YouTube.",
    plateCap: "Grilla de descubrimiento curada a mano.",
  },
};

/** Experience, keyed by company + period to match the React key used in Sections(). */
export const EXPERIENCE_ES: Record<string, { title: string; location: string; period: string; blurb: string }> = {
  "Independent2023 - Present": {
    title: "Desarrollador y Diseñador Web Freelance",
    location: "Perú",
    period: "2023 - Presente",
    blurb:
      "Diseño y construyo los sitios, y después los mantengo en pie: DNS, SSL, hosting, entregabilidad de correo. Remoto, normalmente trabajando dentro del propio equipo del cliente.",
  },
  "Design In DC2025 - 2026": {
    title: "Diseñador UI Junior",
    location: "Estados Unidos",
    period: "2025 - 2026",
    blurb:
      "Una agencia de Washington DC. Año y medio de trabajo de interfaz en proyectos web de clientes, en remoto desde Lima.",
  },
  "Independent2020 - 2023": {
    title: "Diseñador Gráfico Freelance",
    location: "Perú",
    period: "2020 - 2023",
    blurb:
      "Trabajo de impresión e identidad en Lima. Folletos, formularios y documentos institucionales para una empresa médica, flyers para la escena de música electrónica de la ciudad, y logos para negocios que recién empezaban.",
  },
  "T&IL Cleaning Services2021 - 2023": {
    title: "Community Manager",
    location: "Estados Unidos",
    period: "2021 - 2023",
    blurb:
      "Contenido social para una empresa de limpieza de Baltimore: publicaciones y video corto para Instagram, Facebook y TikTok. También llevaba los mensajes de clientes y la agenda.",
  },
};

/** Education, keyed by school. */
export const EDUCATION_ES: Record<string, { title: string; detail: string }> = {
  "Skillnest (ex Coding Dojo Latam)": {
    title: "Desarrollador Full Stack Python",
    detail: "Certificado. HTML, CSS, JavaScript, Python, Flask, Django, MySQL.",
  },
  "Universidad Peruana de Ciencias Aplicadas (UPC)": {
    title: "Estudios universitarios - Ingeniería y Producción Musical",
    detail: "",
  },
};

/** Skill group labels. The items themselves are product names and stay as they are. */
export const SKILLS_ES: Record<(typeof SKILLS)[number]["label"], string> = {
  Design: "Diseño",
  Frontend: "Frontend",
  "Creative Code": "Código Creativo",
  "E-commerce": "E-commerce",
  "CMS & Backend": "CMS y Backend",
  "Infra & SEO": "Infraestructura y SEO",
};

export const LANGUAGES_ES: Record<string, { lang: string; level: string }> = {
  Spanish: { lang: "Español", level: "Nativo" },
  English: { lang: "Inglés", level: "Fluido" },
};

/** UI chrome: headings, labels and the fixed strings written into the JSX. */
export const UI_ES = {
  // section headings
  about: "Sobre mí",
  work: "Trabajo Seleccionado",
  experience: "Experiencia",
  education: "Formación",
  skills: "Habilidades",
  contact: "Contacto",
  references: "Referencias",

  // sidebar TOC labels (lowercase, they render as-is)
  tocAbout: "sobre mí",
  tocWork: "trabajo",
  tocExperience: "experiencia",
  tocEducation: "formación",
  tocSkills: "habilidades",
  tocContact: "contacto",

  // sidebar chrome
  contents: "Contenido",
  contentsLower: "contenido",
  hide: "[ocultar]",
  show: "[mostrar]",
  backToTop: "Volver arriba",
  toolbox: "Herramientas",
  otherLanguages: "Otros idiomas",
  downloadCv: "Descargar CV",
  email: "Correo",
  status: "Estado:",
  colophon: "Esta página se actualizó por última vez en",

  // topline
  availableForWork: "Disponible para trabajar",

  // work section
  fig: "Fig.",
  clientWork: "Trabajo de cliente",
  ownBrand: "Marca propia",
  personalProject: "Proyecto personal",

  // skills section
  languagesLabel: "Idiomas:",

  // contact
  contactLead: "El correo es la forma más rápida de contactarme.",
  contactBased: "Radicado en Lima, PE. Trabajo en remoto con equipos de Estados Unidos y Europa. Abierto a tiempo completo o freelance.",

  // welcome banner
  bannerLead: "Abierto a trabajar.",
  bannerRest1: "Busco puestos de frontend, e-commerce y producto. Mira mi",
  bannerWork: "trabajo",
  bannerRest2: ", o",
  bannerContact: "escríbeme",
  bannerEnd: ".",
  dismiss: "Cerrar aviso",
} as const;
