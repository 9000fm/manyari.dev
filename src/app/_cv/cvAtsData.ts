import { getCvData, type CvLang } from "./cvData";

// ATS-specific language and structure. The editorial CV keeps its original data.
export function getCvAtsData(lang: CvLang) {
  const data = getCvData(lang);
  const es = lang === "es";
  const education = [
    {
      title: es ? "Certificado en Desarrollo Full Stack con Python" : "Full Stack Python Development Certificate",
      school: es ? "Coding Dojo LATAM (actualmente Skillnest)" : "Coding Dojo LATAM (now Skillnest)",
      period: "Feb 2023 - Jun 2023",
    },
    {
      title: es ? "Estudios en Producción Musical" : "Music Production Studies",
      school: "Universidad Peruana de Ciencias Aplicadas (UPC)",
      period: "2018 - 2023",
    },
    {
      title: es ? "Estudios en Ingeniería Industrial" : "Industrial Engineering Studies",
      school: "Universidad Peruana de Ciencias Aplicadas (UPC)",
      period: "2013 - 2017",
    },
  ];

  const jobs = [
    {
      title: data.jobs[0].title,
      company: es ? "Independiente" : "Self-employed",
      location: es ? "Lima, Perú / Remoto" : "Lima, Peru / Remote",
      period: data.jobs[0].period,
      context: es
        ? "Diseño independiente desde 2020; desarrollo web desde 2023."
        : "Independent design since 2020; web development since 2023.",
      bullets: es ? [
        "Diseño, desarrollo y mantenimiento de sitios web responsive, tiendas online y aplicaciones web para clientes internacionales.",
        "Entrega de proyectos desde el diseño UI/UX hasta el desarrollo, integración de APIs, despliegue y mantenimiento.",
        "Soporte técnico, resolución de incidencias en bases de datos y mejoras de seguridad web.",
      ] : [
        "Develop and maintain responsive websites, e-commerce platforms and web applications for international clients.",
        "Deliver projects from UI/UX design through development, API integration, deployment and maintenance.",
        "Provide technical support, database troubleshooting and website security improvements.",
      ],
    },
    {
      title: data.jobs[1].title,
      company: data.jobs[1].company,
      location: "",
      period: data.jobs[1].period,
      context: "",
      bullets: es ? [
        "Colaboración con equipos de la agencia en el diseño de interfaces responsive y prototipos web interactivos.",
        "Entrega de diseños preparados para desarrollo en proyectos digitales para clientes.",
      ] : [
        "Collaborated with agency teams to design responsive interfaces and interactive web prototypes.",
        "Delivered development-ready designs for client-facing digital projects.",
      ],
    },
  ];

  const skills = data.skills.map((skill, index) => {
    let items: string = skill.items;
    if (index === 0) {
      items = items.replace("React,", "React.js (React),")
        .replace(es ? "diseño responsive" : "Responsive design", es ? "Diseño web responsive" : "Responsive Web Design");
    } else if (index === 1) {
      items = items.replace(es ? "integración de APIs REST" : "REST API integration",
        es ? "APIs RESTful, integración de APIs" : "RESTful APIs, API Integration");
    } else if (index === 3) {
      items = items.replace("Git, GitHub", es ? "Control de versiones (Git, GitHub)" : "Version Control (Git, GitHub)");
    }
    return { ...skill, items };
  });

  const work = data.work.map((project) => project.slug === "digeart" ? {
    ...project,
    // Approximate scale previously reported by the author, not a live usage metric.
    blurb: es
      ? "Desarrollo de una plataforma de descubrimiento musical con Next.js, Supabase y la API de YouTube. Catálogo automatizado de más de 150 canales, con unos 1400 elementos procesados al día. Reproductor y playlists de usuarios."
      : "Developed a music discovery platform with Next.js, Supabase and the YouTube API, automating catalog updates across 150+ channels and processing approximately 1,400 items daily. Implemented an integrated player and user-created playlists.",
  } : es ? {
    ...project,
    blurb: ({
      tonydecay: "Diseño de identidad visual y desarrollo de tienda online de un artista con 15 impresiones artísticas, integración de pagos y panel personalizado para gestionar ventas y envíos.",
      civiclick: "Diseño responsive de landing page y prototipado frontend para una plataforma SaaS de participación ciudadana, con HTML, CSS y JavaScript para Design In DC.",
      silverback: "Diseño y desarrollo de tienda Shopify para una marca de ropa de artes marciales, con secciones personalizadas y navegación responsive.",
      brisol: "Recuperación y mantenimiento de WordPress, mejoras de seguridad, resolución de incidencias en bases de datos e integración de formularios de contacto.",
      ecolution: "Rediseño del sitio corporativo WordPress de una empresa australiana de energía solar, con reestructuración de páginas y contenidos.",
    } as Record<string, string>)[project.slug] ?? project.blurb,
  } : project);

  return {
    ...data,
    location: es ? "Lima, Perú" : "Lima, Peru",
    summary: es
      ? "Desarrollador web y diseñador con experiencia en sitios web, e-commerce y productos digitales para clientes en Perú, Estados Unidos y Australia. Trabajo independiente y con agencias en UI/UX, desarrollo frontend, integración de APIs y soporte técnico. Desarrollo de productos propios e interés por el arte generativo, la música electrónica y el diseño audiovisual."
      : "Web developer and designer delivering websites, e-commerce and digital products for clients in Peru, the US and Australia. Works independently and with agency teams across UI/UX, frontend development, API integration and technical troubleshooting. Also develops personal digital products and explores generative art, electronic music and audiovisual design.",
    jobs, skills, work, education,
    languages: data.languages.replace(es ? "inglés (fluido)" : "English (fluent)", es ? "inglés (fluido, oral y escrito)" : "English (fluent, written and spoken)"),
    headings: {
      ...data.headings,
      summary: es ? "Perfil profesional" : "Professional Summary",
      skills: es ? "Habilidades técnicas" : "Technical Skills",
      education: es ? "Formación académica" : "Education",
    },
  };
}
