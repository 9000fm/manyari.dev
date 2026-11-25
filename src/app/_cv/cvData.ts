import { PROJECTS, LANGUAGES, ME } from "../../content";
import { LANGUAGES_ES, ME_ES } from "../../content.es";
import { CV_SKILLS } from "./cvSkills";

export type CvLang = "en" | "es";
type Bilingual = { en: string; es: string };
type CvProjectCopy = { role: Bilingual; blurb: Bilingual };

// User-approved project reference months; not necessarily launch dates.
const PROJECT_MONTHS: Record<string, Bilingual> = {
  digeart: { en: "Feb 2026", es: "Feb 2026" },
  tonydecay: { en: "Feb 2026", es: "Feb 2026" },
  civiclick: { en: "Aug 2026", es: "Ago 2026" },
  silverback: { en: "Mar 2026", es: "Mar 2026" },
  brisol: { en: "Oct 2026", es: "Oct 2026" },
  ecolution: { en: "Mar 2025", es: "Mar 2025" },
};
const PROJECT_ORDER = ["digeart", "tonydecay", "civiclick", "silverback", "brisol", "ecolution"] as const;
const PROJECT_COPY: Record<(typeof PROJECT_ORDER)[number], CvProjectCopy> = {
  digeart: {
    role: { en: "Independent web application", es: "Aplicación web independiente" },
    blurb: {
      en: "Developed a music discovery platform using Next.js, Supabase and the YouTube API, automating catalog updates across selected channels. Implemented an integrated player and user-created playlists.",
      es: "Desarrollo de una plataforma de descubrimiento musical con Next.js, Supabase y la API de YouTube, automatizando la actualización del catálogo a partir de canales seleccionados. Implementación de un reproductor integrado y playlists creadas por usuarios.",
    },
  },
  tonydecay: {
    role: { en: "E-commerce and visual identity", es: "E-commerce e identidad visual" },
    blurb: {
      en: "Designed and developed an artist's visual identity and e-commerce platform featuring 15 art prints, with integrated payments and a custom dashboard for managing sales and shipments.",
      es: "Diseño y desarrollo de la identidad visual y plataforma e-commerce de un artista, con una colección de 15 impresiones artísticas, integración de pagos y un panel personalizado para gestionar ventas y envíos.",
    },
  },
  civiclick: {
    role: { en: "Frontend prototyping", es: "Prototipado frontend" },
    blurb: {
      en: "Responsive landing page design and frontend prototyping for a civic engagement SaaS platform. Developed in HTML, CSS, and JavaScript for Design In DC.",
      es: "Diseño de landing page y prototipado frontend para una plataforma SaaS de participación ciudadana. Desarrollado con HTML, CSS y JavaScript para Design In DC.",
    },
  },
  silverback: {
    role: { en: "Shopify e-commerce", es: "E-commerce en Shopify" },
    blurb: {
      en: "E-commerce design and development for a martial arts apparel brand, with custom Shopify layouts and responsive navigation.",
      es: "Diseño y desarrollo e-commerce para una marca de ropa de artes marciales, con secciones personalizadas en Shopify y navegación responsive.",
    },
  },
  brisol: {
    role: { en: "WordPress recovery and security", es: "Recuperación y seguridad web" },
    blurb: {
      en: "WordPress maintenance and technical support, covering website recovery, security improvements, database troubleshooting, and contact form integration.",
      es: "Mantenimiento y soporte técnico en WordPress, incluyendo recuperación del sitio, mejoras de seguridad, resolución de problemas en la base de datos e integración de formularios de contacto.",
    },
  },
  ecolution: {
    role: { en: "Corporate website redesign", es: "Rediseño web corporativo" },
    blurb: {
      en: "Redesigned and restructured a corporate WordPress website for an Australian solar energy company, focusing on page design and content organization.",
      es: "Rediseño y reestructuración del sitio web corporativo de una empresa australiana de energía solar, con énfasis en diseño de páginas y organización de contenidos.",
    },
  },
};

export function getCvData(lang: CvLang) {
  const es = lang === "es";
  const pick = (value: Bilingual) => value[lang];
  const work = PROJECT_ORDER.map((slug) => {
    const project = PROJECTS.find((item) => item.slug === slug);
    if (!project) throw new Error(`Missing CV project: ${slug}`);
    const url = project.url;
    return {
      slug, title: project.title, year: PROJECT_MONTHS[slug]?.[lang] ?? String(project.year), url,
      host: url ? new URL(url).host.replace(/^www\./, "") : "",
      role: pick(PROJECT_COPY[slug].role),
      blurb: pick(PROJECT_COPY[slug].blurb),
    };
  });
  const jobs = [
    {
      title: es ? "Desarrollador web y diseñador" : "Web Developer & Designer",
      company: es ? "Trabajo para clientes" : "Client work",
      period: es ? "2020 - Presente" : "2020 - Present",
      blurb: es
        ? "Diseño independiente desde 2020, con desarrollo web desde 2023. Diseño y desarrollo de sitios web, tiendas online y productos digitales, desde UI/UX hasta integración de servicios, despliegue y mantenimiento."
        : "Independent design since 2020, expanding into web development in 2023. Deliver websites, e-commerce platforms and digital products for clients, covering UI/UX, development, integrations, deployment and maintenance.",
    },
    {
      title: es ? "Diseñador UI" : "UI Designer",
      company: es ? "Trabajo para Design In DC" : "Client work for Design In DC",
      period: "2025 - 2026",
      blurb: es
        ? "Colaboración con el equipo de la agencia en proyectos web para clientes, entregando interfaces responsive, prototipos interactivos y diseños preparados para desarrollo."
        : "Collaborated with an agency team on client-facing web projects, delivering responsive interfaces, interactive prototypes and development-ready designs.",
    },
  ];
  const skills = CV_SKILLS.map((group) => ({ label: es ? group.labelEs : group.label, items: es ? group.itemsEs : group.items }));
  const education = [
    {
      title: es ? "Desarrollo Full Stack - Python" : "Full Stack Development - Python",
      school: es ? "Coding Dojo LATAM (actualmente Skillnest)" : "Coding Dojo LATAM (now Skillnest)",
      lines: [es ? "Feb 2023 - Jun 2023 · Certificado de finalización" : "Feb 2023 - Jun 2023 · Certificate of completion"],
    },
    {
      title: es ? "Estudios universitarios" : "University Studies",
      school: "Universidad Peruana de Ciencias Aplicadas (UPC)",
      lines: es ? ["Estudios en Producción Musical (2018 - 2023)", "Estudios en Ingeniería Industrial (2013 - 2017)"] : ["Studies in Music Production (2018 - 2023)", "Studies in Industrial Engineering (2013 - 2017)"],
    },
  ];
  const languages = LANGUAGES.map((entry, index) => {
    const translation = es ? LANGUAGES_ES[entry.lang] : undefined;
    const name = translation?.lang ?? entry.lang;
    return `${es && index > 0 ? name.toLowerCase() : name} (${(translation?.level ?? entry.level).toLowerCase()})`;
  }).join(", ") + ".";
  return {
    name: ME.name, email: ME.email, location: ME.location,
    phone: "+51 990 028 077", phoneHref: "+51990028077",
    role: es ? ME_ES.role : ME.role, summary: es ? ME_ES.summary : ME.summary,
    github: ME.socials.github, linkedin: ME.socials.linkedin,
    work, jobs, skills, education, languages,
    headings: {
      work: es ? "Proyectos seleccionados" : "Selected Projects",
      experience: es ? "Experiencia profesional" : "Professional Experience",
      skills: es ? "Habilidades" : "Skills", education: es ? "Formación" : "Education", languages: es ? "Idiomas" : "Languages",
    },
  };
}
