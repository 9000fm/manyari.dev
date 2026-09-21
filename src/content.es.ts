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
  role: "Diseñador y Desarrollador",
  available: "Disponible",
  about:
    "Hola, soy Flavio, diseñador y desarrollador con experiencia en proyectos web para marcas independientes y clientes de Estados Unidos, Europa y Latinoamérica. Trabajo tanto en diseño como en desarrollo, y suelo involucrarme en todo el proceso: desde definir la dirección visual y la interfaz hasta la publicación y mantenimiento del proyecto. Mi experiencia incluye e-commerce, sitios web para marcas y productos digitales. Este portafolio reúne una selección de proyectos para clientes junto con proyectos propios. Para proyectos, colaboraciones u oportunidades laborales, puedes ponerte en contacto conmigo.",
  aboutContactLabel: "contacto",
  // El perfil profesional del About, sin saludo, referencia al portafolio ni cierre.
  summary:
    "Diseñador y desarrollador con experiencia en proyectos web para marcas independientes y clientes de Estados Unidos, Europa y Latinoamérica. Trabajo tanto en diseño como en desarrollo, y suelo involucrarme en todo el proceso: desde definir la dirección visual y la interfaz hasta la publicación y mantenimiento del proyecto. Mi experiencia incluye e-commerce, sitios web para marcas y productos digitales.",
} as const;

/** Project role lines and blurbs, keyed by slug so a new project cannot be missed. */
export const PROJECTS_ES: BySlug<{ role: string; blurb: string; plateCap: string }> = {
  tonydecay: {
    role: "Tienda de ilustraciones impresas: marca, tienda y pagos",
    blurb:
      "Identidad visual y tienda de ilustraciones impresas para el ilustrador Tony Decay. Me encargué del diseño y del desarrollo, con pagos integrados y un panel desde el que el artista administra sus ventas y envíos.",
    plateCap: "Foundation Series, la página de la colección de quince ilustraciones impresas.",
  },
  silverback: {
    role: "Tienda Shopify: portada y páginas de producto",
    blurb:
      "Tienda Shopify de ropa para artes marciales. Diseño y desarrollo de la portada, las páginas de producto y la navegación móvil.",
    plateCap: "La portada.",
  },
  superself: {
    role: "Sello que cofundé: marca, sitio y tienda",
    blurb:
      "Sitio y marca para mi sello de música electrónica - una interfaz wireframe juguetona, visuales generativos y una tienda. Hecho de principio a fin, en tres idiomas.",
    plateCap: "La interfaz principal del sello, dibujada en perspectiva de un punto.",
  },
  micaela: {
    role: "Portafolio y archivo de fotografía: diseño y desarrollo",
    blurb:
      "Portafolio y archivo para una fotógrafa - fotografía documental a todo lo ancho, una interfaz mínima y una grilla que crece con su obra. Diseñado, construido y desplegado.",
    plateCap: "La grilla de fotos, de borde a borde.",
  },
  digeart: {
    role: "App de descubrimiento musical: proyecto propio, diseño, desarrollo y mantenimiento",
    blurb:
      "Plataforma de descubrimiento musical para oyentes y productores. Reúne música electrónica, mezclas y material para samplear en un catálogo curado a mano, y permite crear playlists. Diseñada, desarrollada y mantenida por mí.",
    plateCap: "Grilla de descubrimiento curada a mano.",
  },
};

/** Experience, keyed by company + period to match the React key used in Sections(). */
export const EXPERIENCE_ES: Record<string, { title: string; location: string; period: string; blurb: string; company?: string }> = {
  "Independent2023 - Present": {
    company: "Independiente",
    title: "Desarrollador y Diseñador Web Freelance",
    location: "",
    period: "2023 - Presente",
    blurb:
      "Diseño y desarrollo web para marcas independientes y equipos pequeños, de principio a fin: interfaz, tienda, checkout y el panel de administración del cliente. Hosting, dominios y mantenimiento después del lanzamiento.",
  },
  "Design In DC2025 - 2026": {
    title: "Diseñador UI",
    location: "Estados Unidos (remoto)",
    period: "2025 - 2026",
    blurb:
      "Diseño de interfaces por contrato para una agencia de Washington DC: layouts web y mockups para los proyectos de clientes de la agencia.",
  },
  "Independent2020 - Present": {
    company: "Independiente",
    title: "Diseñador Gráfico Freelance",
    location: "",
    period: "2020 - Presente",
    blurb:
      "Diseño gráfico desde 2020: identidad de marca, impresos corporativos y flyers de eventos.",
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

  // topline
  availableForWork: "Disponible para proyectos",

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
  contactBased: "Español e inglés. Disponible para freelance o tiempo completo.",

  // welcome banner
  bannerLead: "Disponible para trabajo freelance y remoto.",
  bannerRest1: "Ver",
  bannerWork: "proyectos seleccionados",
  bannerRest2: " ·",
  bannerContact: "Contacto",
  bannerEnd: ".",
  dismiss: "Cerrar aviso",

  // 404 (src/app/not-found.tsx)
  notFoundTitle: "Esta página no existe",
  notFoundBody: "No hay ningún artículo en esta dirección. Puede que se haya movido, o que el enlace esté mal escrito.",
  notFoundBack: "Volver a la portada",
} as const;
