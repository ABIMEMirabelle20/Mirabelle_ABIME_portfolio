# Portfolio — Mirabelle ABIME

Portfolio personnel premium en **React.js + JavaScript + HTML5 + CSS3** (sans Tailwind, sans framework CSS). Réalisé avec Vite.

## Lancer le projet

```bash
npm install
npm run dev       # serveur de développement
npm run build     # build de production dans /dist
npm run preview   # prévisualiser le build
```

## Structure

```
src/
  components/   → un fichier .jsx + .css par section
  data/         → contenu éditable (projets, compétences, parcours, intérêts)
  hooks/        → useReveal (animations au scroll), useActiveSection (nav active)
  styles/       → variables.css (design tokens) + global.css (reset & utilitaires)
```

## Personnaliser le contenu

- **Textes (nom, accroche, à propos, contact)** : directement dans les composants
  `Hero.jsx`, `About.jsx`, `Contact.jsx`.
- **Projets** : ajoutez un objet dans `src/data/projects.js` — ou utilisez le
  bouton "+ Ajouter un projet" dans la galerie (ajout en session, pratique
  pour prévisualiser avant de l'ajouter au fichier de données).
- **Compétences** : `src/data/skills.js` (branches, niveau de 0 à 100, description).
- **Parcours** : `src/data/timeline.js`.
- **Centres d'intérêt** : `src/data/interests.js`.
- **Couleurs / typographies / espacements** : `src/styles/variables.css`.

## Notes techniques

- Aucune dépendance d'animation externe : tout est fait en CSS
  (transition, keyframes) et IntersectionObserver natif.
- Le formulaire de contact ouvre un e-mail pré-rempli (mailto:) ; à brancher
  sur un service d'envoi (Formspree, Resend, etc.) si besoin d'un vrai backend.
- Accessibilité : navigation au clavier, aria-label sur les éléments
  interactifs (arbre de compétences, anneaux de la timeline), contraste
  vérifié sur la palette imposée, prefers-reduced-motion respecté.
