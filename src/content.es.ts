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
  role: "Diseñador y Desarrollador Web",
  available: "Disponible",
  about:
    "Bienvenido. Mi nombre es Flavio, y esta es mi página web. Diseño y desarrollo sitios de e-commerce y productos digitales, desde la primera versión hasta el lanzamiento. Mi trabajo está entre el diseño y el código, así que sigo cada proyecto de principio a fin. He lanzado tiendas e interfaces para clientes en Estados Unidos, Europa y Latinoamérica. Escríbeme si tienes algo en mente.",
  // El About sin el saludo ni el cierre: el resumen del CV impreso (src/app/_cv/CvSheet.tsx).
  summary:
    "Diseño y desarrollo sitios de e-commerce y productos digitales, desde la primera versión hasta el lanzamiento. Mi trabajo está entre el diseño y el código, así que sigo cada proyecto de principio a fin. He lanzado tiendas e interfaces para clientes en Estados Unidos, Europa y Latinoamérica.",
} as const;

/** Project role lines and blurbs, keyed by slug so a new project cannot be missed. */
export const PROJECTS_ES: BySlug<{ role: string; blurb: string; plateCap: string }> = {
  tonydecay: {
    role: "Tienda de láminas: marca, tienda y checkout",
    blurb:
      "Tienda de prints del ilustrador Tony Decay, hecha de principio a fin: marca, tienda, pago con PayPal, inventario y un panel de pedidos que el artista maneja solo.",
    plateCap: "Foundation Series, la página de la colección de quince láminas.",
  },
  silverback: {
    role: "Tienda Shopify: portada y páginas de producto",
    blurb:
      "Tienda Shopify de una marca de ropa de combate: portada, secciones, navegación y páginas de producto.",
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
      "Una app de descubrimiento de música electrónica underground que suena mientras navegas: catálogo curado a mano, cola, atajos de teclado, likes y playlists. Mantenida desde el lanzamiento.",
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
  work: "Trabajos seleccionados",
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
  availableForWork: "Disponible para trabajar",

  // work section
  fig: "Fig.",
  clientWork: "Trabajo de cliente",
  ownBrand: "Marca propia",
  personalProject: "Proyecto personal",

  // skills section
  languagesLabel: "Idiomas:",
  languages: "Idiomas", // CV heading

  // contact
  contactLead: "Cuéntame qué necesitas.",
  contactBased: "Español e inglés. Disponible para freelance o tiempo completo.",

  // welcome banner
  bannerLead: "Disponible",
  bannerRest1: "para trabajos de frontend, e-commerce y producto digital. Mira mi",
  bannerWork: "trabajo más reciente",
  bannerRest2: " en esta página, o",
  bannerContact: "escríbeme",
  bannerEnd: ".",
  dismiss: "Cerrar aviso",

  // 404 (src/app/not-found.tsx)
  notFoundTitle: "Esta página no existe",
  notFoundBody: "No hay ningún artículo en esta dirección. Puede que se haya movido, o que el enlace esté mal escrito.",
  notFoundBack: "Volver a la portada",
} as const;
