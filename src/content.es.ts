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
  siteTitle: "Portafolio de Flavio Manyari",
  role: "Desarrollador web y diseñador",
  topline: "Diseño · Desarrollo · E-commerce · Productos digitales · Independiente y remoto",
  available: "Disponible",
  about:
    "Hola, soy Flavio, diseñador y desarrollador web de Lima, Perú. He trabajado con clientes de Perú, Estados Unidos y Australia, diseñando interfaces, desarrollando sitios web, tiendas online y aplicaciones, integrando APIs y mejorando plataformas existentes.\n\nAdemás del trabajo con clientes, desarrollo mis propios proyectos, como una aplicación para descubrir música. Mi interés por la música y el diseño también me ha llevado a explorar el arte generativo y los visuales en tiempo real.\n\nEste portafolio reúne una selección de mi trabajo profesional y personal. Para nuevos proyectos, colaboraciones u oportunidades laborales, no dudes en ponerte en contacto.",
  aboutContactLabel: "ponerte en contacto",
  // El perfil profesional del About, sin saludo, referencia al portafolio ni cierre.
  summary:
    "Desarrollador web y diseñador de Lima, Perú. He trabajado con clientes de Perú, Estados Unidos y Australia, desarrollando sitios web, tiendas online y aplicaciones. Mi experiencia en desarrollo se suma a una trayectoria en diseño gráfico e interfaces. Combino el trabajo para clientes con proyectos propios que diseño, publico y mantengo. Mi práctica creativa también abarca el arte generativo y los visuales en tiempo real.",
} as const;

/** Project role lines and blurbs, keyed by slug so a new project cannot be missed. */
export const PROJECTS_ES: BySlug<{ role: string; blurb: string; plateCap: string }> = {
  tonydecay: {
    role: "Tienda de ilustraciones impresas: identidad visual, tienda y pagos",
    blurb:
      "Identidad visual y tienda de ilustraciones impresas para el ilustrador Tony Decay. Me encargué del diseño y del desarrollo, con pagos integrados y un panel desde el que el artista administra sus ventas y envíos.",
    plateCap: "Foundation Series, la página de la colección de quince ilustraciones impresas.",
  },
  silverback: {
    role: "Sitio de e-commerce: diseño y desarrollo en Shopify",
    blurb:
      "Tienda Shopify de ropa para artes marciales. Diseño y desarrollo de la portada, las páginas de producto y la navegación móvil.",
    plateCap: "La portada.",
  },
  superself: {
    role: "Sello discográfico independiente: identidad visual, sitio web y catálogo",
    blurb:
      "Sitio y marca para mi sello de música electrónica. Una identidad digital inspirada en la estética de internet temprano, con visuales generativos, catálogo de lanzamientos y merchandising. Diseñado y desarrollado de principio a fin, en tres idiomas.",
    plateCap: "La interfaz principal del sello, dibujada en perspectiva de un punto.",
  },
  micaela: {
    role: "Portafolio de fotografía: diseño y desarrollo web",
    blurb:
      "Portafolio y archivo para una fotógrafa - fotografía documental a todo lo ancho, una interfaz mínima y una grilla que crece con su obra. Diseñado, construido y desplegado.",
    plateCap: "La grilla de fotos, de borde a borde.",
  },
  digeart: {
    role: "Plataforma de descubrimiento musical: diseño y desarrollo de producto",
    blurb:
      "Plataforma de descubrimiento musical para oyentes y productores. Reúne música electrónica, mezclas y material para samplear en un catálogo curado a mano, y permite crear playlists. Diseñada, desarrollada y mantenida de forma independiente.",
    plateCap: "Grilla de descubrimiento curada a mano.",
  },

  civiclick: {
    role: "Landing y prototipado web",
    blurb: "Diseño y prototipo de la landing en HTML/CSS/JS para una plataforma SaaS de participación ciudadana. Revisión responsive y entrega para su implementación en WordPress. Proyecto para Design In DC.",
    plateCap: "Prototipo de la portada preparado para su implementación en WordPress.",
  },
  brisol: {
    role: "Mantenimiento WordPress",
    blurb: "Mantenimiento y recuperación de un sitio WordPress: revisión de archivos y base de datos, actualización de plugins, copias de seguridad y corrección de contenido no autorizado.",
    plateCap: "El sitio WordPress de Brisol, en el que realicé mantenimiento.",
  },
  ecolution: {
    role: "Diseño y desarrollo WordPress",
    blurb: "Rediseño del sitio web de una empresa australiana de energía solar en WordPress. Reorganización de la estructura y los contenidos del sitio, y diseño de sus páginas.",
    plateCap: "Ecolution Industries, Australia. Rediseño web, 2025.",
  },
};

export const CV_PROJECTS_ES = PROJECTS_ES;

/** Experience, keyed by company + period to match the React key used in Sections(). */
export const EXPERIENCE_ES: Record<string, { title: string; location: string; period: string; blurb: string; company?: string }> = {
  "Independent2020 - Present": {
    company: "Independiente",
    title: "Diseñador y Desarrollador",
    location: "",
    period: "2020 - Presente",
    blurb:
      "Trabajo de diseño independiente desde 2020, al que incorporé el diseño y desarrollo web en 2023. Mi trabajo incluye identidad de marca, interfaces, e-commerce, publicación y mantenimiento continuo.",
  },
  "Projects for Design In DC2025 - 2026": {
    company: "Proyectos para Design In DC",
    title: "Diseñador UI freelance",
    location: "",
    period: "2025 - 2026",
    blurb: "Diseño de interfaces y prototipos web para clientes de la agencia. Preparación de propuestas y revisión responsive para su implementación.",
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
  "Motion & Graphics": "Motion y Gráficos",
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
  work: "Proyectos seleccionados",
  projects: "Proyectos",
  experience: "Experiencia",
  education: "Formación",
  skills: "Habilidades",
  contact: "Contacto",
  references: "Referencias",

  // sidebar TOC labels (lowercase, they render as-is)
  tocAbout: "sobre mí",
  tocWork: "proyectos",
  tocExperience: "experiencia",
  tocEducation: "formación",
  tocSkills: "habilidades",
  tocContact: "contacto",

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
  contactLead: "Cuéntame qué necesitas.",
  contactBased: "Español e inglés. Disponible para proyectos freelance y trabajo remoto.",

  // welcome banner
  bannerLead: "Actualmente disponible para trabajo freelance y remoto.",
  bannerContact: "Contacto →",
  dismiss: "Cerrar aviso",

  // 404 (src/app/not-found.tsx)
  notFoundTitle: "Esta página no existe",
  notFoundBody: "No hay ningún artículo en esta dirección. Puede que se haya movido, o que el enlace esté mal escrito.",
  notFoundBack: "Volver a la portada",
} as const;
