// tagline/description sont bilingues ({ fr, en }) pour suivre la langue
// active du site. title, stack et liens restent identiques dans les deux langues.

import smartCalculatorImg from '../assets/projects/smart-calculator.jpg.png';
import WeatherApp from '../assets/projects/weather.jpg.png';
import numera from '../assets/projects/numera.jpg.png';
import niceCréation from '../assets/projects/nice_création.jpg.png';

const projects = [
  {
    id: 'perso-1',
    title: 'Smart-Calculator',
    tagline: {
      fr: "Plus qu'une calculatrice, un outil intelligent.",
      en: 'More than a calculator — an intelligent tool.',
    },
    description: {
      fr: "Une calculatrice moderne développée avec HTML, CSS et JavaScript. Ce projet va bien au-delà d'une calculatrice classique en proposant une interface élégante, une expérience utilisateur fluide et de nombreuses fonctionnalités avancées.",
      en: 'A modern calculator built with HTML, CSS and JavaScript. It goes far beyond a classic calculator, with an elegant interface, a smooth user experience and many advanced features.',
    },
    year: '2025 · 2026',
    stack: ['Html', 'CSS', 'JS'],
    gradient: ['#2F6BFF', '#00D4FF'],
    image: smartCalculatorImg,
    github: 'https://github.com/ABIMEMirabelle20/Calculatrice_JS.git',
    demo: 'https://abimemirabelle20.github.io/Calculatrice_JS/',
  },

  {
    id: 'perso-2',
    title: 'Weather_app',
    tagline: {
      fr: 'La météo prend vie en 3D, en temps réel.',
      en: 'Weather comes alive in 3D, in real time.',
    },
    description: {
      fr: "Application météo React couplée à une scène 3D (react-three-fiber) qui réagit aux conditions réelles : soleil animé par ciel clair, nuages qui dérivent, pluie ou neige qui tombent selon la météo du moment. Géolocalisation automatique, prévisions horaires et journalières, sans clé API.",
      en: 'A React weather app paired with a live 3D scene (react-three-fiber) that reacts to real conditions: an animated sun on clear skies, drifting clouds, falling rain or snow depending on the weather. Automatic geolocation, hourly and daily forecasts, no API key required.',
    },
    year: '2026',
    stack: ['React', 'Three.js', 'React Three Fiber', 'Vite'],
    gradient: ['#2F6BFF', '#38BDF8'],
    image: WeatherApp,
    github: 'https://github.com/ABIMEMirabelle20/weather_app',
    demo: 'https://weatherapp-indol-nine.vercel.app/',
  },

  {
    id: 'perso-3',
    title: 'Numera — Jeu de devinette',
    tagline: {
      fr: 'Plus vous approchez, plus ça chauffe.',
      en: 'The closer you get, the hotter it gets.',
    },
    description: {
      fr: "Mini-jeu de devinette avec un radar de proximité animé (du cyan froid à l'or brûlant), 4 niveaux de difficulté, sons générés via Web Audio API et score persistant en local.",
      en: 'A number-guessing game with an animated proximity radar (cold cyan to hot gold), 4 difficulty levels, sounds generated via the Web Audio API, and a locally persisted score.',
    },
    year: '2026',
    stack: ['React', 'Vite', 'Web Audio API', 'CSS3'],
    gradient: ['#00D4FF', '#F5A623'],
    image: numera,
    github: 'https://github.com/ABIMEMirabelle20/number-guess-game',
    demo: 'https://number-guess-game-green-sigma.vercel.app/',
  },

 

  {
     id: 'pro-1',
    title: 'Nice Crochet — Site vitrine',
    tagline: {
      fr: 'Chaque maille a son mot à dire.',
      en: 'Every stitch has something to say.',
    },
    description: {
      fr: "Site vitrine conçu pour une marque de crochet artisanal, où chaque collection raconte une histoire : pièces en édition limitée, commandes sur-mesure suivies pas à pas, et un parcours de formation en ligne pensé pour transmettre le geste, pas seulement le vendre.",
      en: 'A showcase site built for a handmade crochet brand, where every collection tells a story: limited-edition pieces, made-to-order commissions tracked step by step, and an online training path designed to pass on the craft, not just sell it.',
    },
    year: '2026',
    stack: ['React', 'Node.js', 'Tailwind CSS'],
    gradient: ['#8B3DFF', '#00D4FF'],
    image: niceCréation,
    github: 'https://github.com/ABIMEMirabelle20/Site_Nice_Crochet.git',
    demo: 'https://site-nice-crochet.vercel.app/',
  },

  
];

export default projects;