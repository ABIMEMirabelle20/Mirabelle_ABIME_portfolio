// Structure de l'arbre de compétences.
// Chaque branche part du tronc à une hauteur donnée (trunkY) et porte
// plusieurs feuilles (compétences). "level" va de 0 à 100.
// name/desc sont bilingues ({ fr, en }).

export const skillBranches = [
  {
    id: 'frontend',
    name: { fr: 'Frontend', en: 'Frontend' },
    trunkPoint: { x: 500, y: 706 },
    branchEnd: { x: 232, y: 632 },
    control: { x: 330, y: 700 },
    side: 'left',
    color: 'var(--color-primary)',
    leaves: [
      {
        id: 'react',
        name: 'React.js',
        level: 30,
        desc: { fr: 'Composants, hooks, architecture d’applications', en: 'Components, hooks, application architecture' },
        pos: { x: 118, y: 660 },
      },
      {
        id: 'js',
        name: 'JavaScript ES6+',
        level: 30,
        desc: { fr: 'Logique applicative, async, manipulation du DOM', en: 'App logic, async, DOM manipulation' },
        pos: { x: 150, y: 588 },
      },
      {
        id: 'html',
        name: 'HTML5 sémantique',
        level: 80,
        desc: { fr: 'Structure accessible et optimisée SEO', en: 'Accessible, SEO-friendly structure' },
        pos: { x: 232, y: 552 },
      },
    ],
  },
  {
    id: 'styling',
    name: { fr: 'Style & interface', en: 'Styling & interface' },
    trunkPoint: { x: 500, y: 616 },
    branchEnd: { x: 770, y: 546 },
    control: { x: 660, y: 610 },
    side: 'right',
    color: 'var(--color-secondary)',
    leaves: [
      {
        id: 'css',
        name: 'CSS3 & animations',
        level: 80,
        desc: { fr: 'Transitions, keyframes, mise en page fluide', en: 'Transitions, keyframes, fluid layout' },
        pos: { x: 884, y: 574 },
      },
      {
        id: 'design-system',
        name: 'Design system',
        level: 60,
        desc: { fr: 'Tokens, composants réutilisables, cohérence visuelle', en: 'Tokens, reusable components, visual consistency' },
        pos: { x: 852, y: 500 },
      },
      {
        id: 'ux',
        name: 'UX / Responsive',
        level: 60,
        desc: { fr: 'Parcours utilisateur, adaptabilité multi-écrans', en: 'User journeys, cross-device adaptability' },
        pos: { x: 770, y: 464 },
      },
    ],
  },
  {
    id: 'tools',
    name: { fr: 'Outils & workflow', en: 'Tools & workflow' },
    trunkPoint: { x: 500, y: 526 },
    branchEnd: { x: 214, y: 452 },
    control: { x: 320, y: 520 },
    side: 'left',
    color: 'var(--color-accent)',
    leaves: [
      {
        id: 'git',
        name: 'Git & GitHub',
        level: 60,
        desc: { fr: 'Versionning, revues de code, collaboration', en: 'Versioning, code reviews, collaboration' },
        pos: { x: 100, y: 478 },
      },
      {
        id: 'vite',
        name: 'Vite / Webpack',
        level: 30,
        desc: { fr: 'Bundling, optimisation, environnement de build', en: 'Bundling, optimisation, build environment' },
        pos: { x: 132, y: 406 },
      },
      {
        id: 'perf',
        name: 'Performance & a11y',
        level: 50,
        desc: { fr: 'Accessibilité, Core Web Vitals, audits', en: 'Accessibility, Core Web Vitals, audits' },
        pos: { x: 214, y: 372 },
      },
    ],
  },
  {
    id: 'backend',
    name: { fr: 'Backend & données', en: 'Backend & data' },
    trunkPoint: { x: 500, y: 442 },
    branchEnd: { x: 762, y: 372 },
    control: { x: 650, y: 436 },
    side: 'right',
    color: 'var(--color-text-faint)',
    leaves: [
      {
        id: 'node',
        name: 'Node.js & API',
        level: 30,
        desc: { fr: 'Consommation et création d’API REST', en: 'Consuming and building REST APIs' },
        pos: { x: 882, y: 410 },
      },
      {
        id: 'docker',
        name: 'Docker',
        level: 30,
        desc: { fr: 'Conteneurisation, environnements reproductibles', en: 'Containerization, reproducible environments' },
        pos: { x: 900, y: 358 },
      },
      {
        id: 'python',
        name: 'Python',
        level: 60,
        desc: { fr: 'Scripts, structures de données, bases pour l’IA', en: 'Scripting, data structures, foundations for AI work' },
        pos: { x: 862, y: 300 },
      },
      {
        id: 'mongodb',
        name: 'MongoDB',
        level: 30,
        desc: { fr: 'Bases de données NoSQL, modélisation de documents', en: 'NoSQL databases, document modelling' },
        pos: { x: 800, y: 264 },
      },
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        level: 40,
        desc: { fr: 'Bases de données relationnelles, requêtes SQL', en: 'Relational databases, SQL queries' },
        pos: { x: 726, y: 258 },
      },
      {
        id: 'tests',
        name: 'Tests (Jest)',
        level: 20,
        desc: { fr: 'Tests unitaires et fiabilité du code', en: 'Unit tests and code reliability' },
        pos: { x: 686, y: 302 },
      },
    ],
  },
];

export const levelLabel = (level, lang = 'fr') => {
  const labels = {
    fr: { expert: 'Expert', advanced: 'Avancé', intermediate: 'Intermédiaire', beginner: 'Débutant' },
    en: { expert: 'Expert', advanced: 'Advanced', intermediate: 'Intermediate', beginner: 'Beginner' },
  };
  const set = labels[lang] || labels.fr;
  if (level >= 88) return set.expert;
  if (level >= 72) return set.advanced;
  if (level >= 50) return set.intermediate;
  return set.beginner;
};