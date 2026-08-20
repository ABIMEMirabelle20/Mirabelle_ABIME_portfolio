import {
  SiHtml5, SiCss, SiJavascript, SiReact, SiFirebase, SiFramer,
  SiNodedotjs, SiTailwindcss, SiTypescript, SiPostgresql, SiNextdotjs,
  SiExpress, SiMongodb, SiChartdotjs,
} from 'react-icons/si';

// Normalise le nom tel qu'écrit dans src/data/projects.js (insensible à la
// casse, aux espaces, aux points) vers une icône + une couleur de marque.
// Ajoute une entrée ici si tu utilises une techno qui n'y est pas encore.
const MAP = {
  html: { Icon: SiHtml5, color: '#E34F26' },
  css: { Icon: SiCss, color: '#663399' },
  css3: { Icon: SiCss, color: '#663399' },
  js: { Icon: SiJavascript, color: '#F7DF1E' },
  javascript: { Icon: SiJavascript, color: '#F7DF1E' },
  react: { Icon: SiReact, color: '#61DAFB' },
  firebase: { Icon: SiFirebase, color: '#FFCA28' },
  framermotion: { Icon: SiFramer, color: '#0055FF' },
  nodejs: { Icon: SiNodedotjs, color: '#5FA04E' },
  tailwindcss: { Icon: SiTailwindcss, color: '#38BDF8' },
  typescript: { Icon: SiTypescript, color: '#3178C6' },
  postgresql: { Icon: SiPostgresql, color: '#4169E1' },
  nextjs: { Icon: SiNextdotjs, color: '#FFFFFF' },
  express: { Icon: SiExpress, color: '#FFFFFF' },
  mongodb: { Icon: SiMongodb, color: '#47A248' },
  chartjs: { Icon: SiChartdotjs, color: '#FF6384' },
};

function normalize(name) {
  return name.toLowerCase().replace(/[.\s-]/g, '');
}

export default function TechIcon({ name }) {
  const entry = MAP[normalize(name)];

  if (!entry) {
    // Repli : pas de logo connu pour cette techno -> ses initiales dans un
    // petit badge, plutôt que de casser l'alignement de la rangée.
    return (
      <span className="tech-icon tech-icon--fallback" title={name} aria-label={name}>
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  const { Icon, color } = entry;
  return (
    <span className="tech-icon" style={{ '--tech-color': color }} title={name} aria-label={name}>
      <Icon />
    </span>
  );
}
