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
import { CV_SKILLS } from "./app/_cv/cvSkills";

type BySlug<T> = Record<(typeof PROJECTS)[number]["slug"], T>;

export const ME_ES = {
  siteTitle: "Portafolio de Flavio Manyari",
  role: "Desarrollador web y diseñador",
  topline: "Desarrollo web · Diseño visual · E-commerce · Productos digitales · Remoto",
  available: "Disponible",
  about:
    "Hola, soy Flavio, programador y diseñador de Lima, Perú, con experiencia trabajando con clientes en Perú, Estados Unidos y Australia. Me especializo en el diseño y desarrollo de sitios web, tiendas online y aplicaciones web, con experiencia profesional tanto en programación como en diseño gráfico y UI/UX.\n\nAdemás del trabajo para clientes, dedico parte de mi tiempo a proyectos digitales propios. Mis intereses creativos incluyen la producción de música electrónica, el arte generativo y el diseño audiovisual.\n\nEste portafolio reúne una selección de mi trabajo profesional y personal. Para nuevos proyectos, colaboraciones u oportunidades laborales, no dudes en ponerte en contacto.",
  aboutContactLabel: "ponerte en contacto",
  // Resumen del CV, independiente de la sección Acerca de.
  summary:
    "Desarrollador web y diseñador con experiencia en el desarrollo de sitios web, plataformas de e-commerce y productos digitales para clientes en Perú, Estados Unidos y Australia. Trabajo de forma independiente y junto a equipos de agencias, abarcando diseño UI/UX, desarrollo frontend, integración de APIs y resolución de problemas técnicos. Además del trabajo para clientes, desarrollo mis propios productos digitales y dedico tiempo al arte generativo, la música electrónica y el diseño audiovisual.",
} as const;

/** Project role lines and blurbs, keyed by slug so a new project cannot be missed. */
export const PROJECTS_ES: BySlug<{ role: string; blurb: string; plateCap: string }> = {
  tonydecay: {
    role: "E-commerce e identidad visual",
    blurb:
      "Diseño y desarrollo de la identidad visual y tienda online del artista, con integración de pagos y un panel de administración personalizado para gestionar ventas y envíos.",
    plateCap: "Página de presentación de Foundation Series, una colección de ilustraciones impresas.",
  },
  silverback: {
    role: "E-commerce en Shopify",
    blurb:
      "Diseño y desarrollo e-commerce para una marca de ropa de artes marciales, con secciones personalizadas en Shopify y navegación responsive.",
    plateCap: "Tienda en Shopify de una marca de ropa de artes marciales.",
  },
  superself: {
    role: "Sello discográfico independiente: identidad visual, sitio web y catálogo",
    blurb:
      "Sitio y marca para mi sello de música electrónica. Una identidad digital inspirada en la estética de internet temprano, con visuales generativos, catálogo de lanzamientos y merchandising. Diseñado y desarrollado de principio a fin, en tres idiomas.",
    plateCap: "Portada del sello independiente de música electrónica.",
  },
  digeart: {
    role: "Aplicación web independiente",
    blurb:
      "Plataforma de descubrimiento musical desarrollada con Next.js, Supabase y la API de YouTube. Actualiza su catálogo automáticamente a partir de canales seleccionados e incluye un reproductor integrado y playlists creadas por usuarios.",
    plateCap: "Interfaz de descubrimiento musical con un catálogo de canciones y buscador.",
  },

  civiclick: {
    role: "Prototipado frontend",
    blurb: "Diseño de landing page y prototipado frontend para una plataforma SaaS de participación ciudadana. Desarrollado con HTML, CSS y JavaScript para Design In DC.",
    plateCap: "Prototipo de la página de inicio de la plataforma de participación ciudadana.",
  },
  brisol: {
    role: "Recuperación y seguridad web",
    blurb: "Mantenimiento y soporte técnico en WordPress, incluyendo recuperación del sitio, mejoras de seguridad, resolución de problemas en la base de datos e integración de formularios de contacto.",
    plateCap: "Servicios de instalación solar y formulario de consultas para clientes.",
  },
  ecolution: {
    role: "Rediseño web corporativo",
    blurb: "Rediseño y reestructuración del sitio web corporativo de una empresa australiana de energía solar, con énfasis en diseño de páginas y organización de contenidos.",
    plateCap: "Portada rediseñada de una empresa australiana de energía solar.",
  },
};

export const CV_PROJECTS_ES = PROJECTS_ES;

/** Experience, keyed by company + period to match the React key used in Sections(). */
export const EXPERIENCE_ES: Record<string, { title: string; location: string; period: string; blurb: string; company?: string }> = {
  "Independent2020 - Present": {
    company: "Independiente",
    title: "Desarrollador web y diseñador",
    location: "",
    period: "2020 - Presente",
    blurb:
      "Trabajo de diseño independiente desde 2020, al que incorporé el diseño y desarrollo web en 2023. Mi trabajo incluye UI/UX, sitios web, e-commerce, integración de servicios externos, despliegue y mantenimiento.",
  },
  "Projects for Design In DC2025 - 2026": {
    company: "Proyectos para Design In DC",
    title: "Diseñador UI",
    location: "",
    period: "2025 - 2026",
    blurb: "Diseño web y prototipado para clientes de la agencia, incluyendo UI, diseño responsive y entrega de proyectos al equipo de desarrollo.",
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

/** Website display labels, keyed by the shared CV categories. */
export const SKILLS_ES: Record<(typeof SKILLS)[number]["label"], string> = {
  "Frontend Development": "Desarrollo web",
  "Backend, Databases & APIs": "Backend, bases de datos y APIs",
  "E-commerce & CMS": "E-commerce y CMS",
  "Development Tools": "Herramientas e infraestructura",
  "Design & Creative Coding": "Diseño y tecnología creativa",
  "Professional Skills": "Habilidades profesionales",
};

export const SKILL_ITEMS_ES: Record<string, string> =
  Object.fromEntries(CV_SKILLS.map((group) => [group.label, group.itemsEs]));

export const LANGUAGES_ES: Record<string, { lang: string; level: string }> = {
  Spanish: { lang: "Español", level: "Nativo" },
  English: { lang: "Inglés", level: "Fluido" },
  French: { lang: "Francés", level: "Básico" },
  Portuguese: { lang: "Portugués", level: "Básico" },
};

/** UI chrome: headings, labels and the fixed strings written into the JSX. */
export const UI_ES = {
  // section headings
  about: "Sobre mí",
  work: "Proyectos seleccionados",
  projects: "Proyectos",
  experience: "Experiencia",
  education: "Formación",
  skills: "Habilidades",
  contact: "Contacto",
  references: "Referencias",

  // sidebar TOC labels (sentence case)
  tocAbout: "Sobre mí",
  tocWork: "Proyectos",
  tocExperience: "Experiencia",
  tocEducation: "Formación",
  tocSkills: "Habilidades",
  tocContact: "Contacto",

  // sidebar chrome
  contents: "Contenido",
  footIndex: "Índice",
  contentsLower: "contenido",
  hide: "[ocultar]",
  show: "[mostrar]",
  backToTop: "Volver arriba",
  toolbox: "Herramientas",
  otherLanguages: "Otros idiomas",
  downloadCv: "Descargar CV",
  email: "Correo",
  status: "Estado:",
  colophon: "Esta página se editó por última vez en",

  // work section
  fig: "Fig.",
  clientWork: "Proyecto para clientes",
  ownBrand: "Marca propia",
  personalProject: "Proyecto propio",

  // skills section
  languagesLabel: "Idiomas:",
  languages: "Idiomas", // CV heading

  // contact
  contactLead: "Disponible para proyectos independientes y puestos de trabajo remoto.",
  contactElsewhere: "Otros canales",
  contactResume: "Currículum",
  contactLocation: "Ubicación e idiomas",
  contactBased: "Lima, Perú · Español e inglés",

  // welcome banner
  bannerLead: "Actualmente disponible para trabajo freelance y remoto.",
  bannerContact: "Contacto →",
  dismiss: "Cerrar aviso",

  // 404 (src/app/not-found.tsx)
  notFoundTitle: "Esta página no existe",
  notFoundBody: "No hay ningún artículo en esta dirección. Puede que se haya movido, o que el enlace esté mal escrito.",
  notFoundBack: "Volver a la portada",
} as const;
