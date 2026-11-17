# Portfolio de Mirabelle ABIME

React 19, Vite, Three.js (introduction uniquement). Français et anglais, thème clair (ivoire) et sombre (prune).

```bash
npm install
npm run dev       # développement
npm run build     # production
npm run preview   # tester le build
```

Avant une mise en ligne, suis `DEPLOY_CHECKLIST.md`.

## Identité visuelle

Cinq couleurs seulement, définies dans `src/styles/variables.css` :
bordeaux `#581C35`, rose poudré `#F4C2D7`, jaune citron `#E8FF54`, ivoire `#FFF9F0`, prune `#24131F`.
Chaque section choisit sa couleur de fond avec une classe (`band--wine`, `band--pink`, `band--plum`, `band--lemon`),
et les couleurs de texte, de lignes et d'accent se recalculent toutes seules.

## Où modifier quoi

| Je veux changer... | Fichier | Comment |
|---|---|---|
| Un texte du site (français et anglais) | `src/i18n/translations.js` | Chaque section a son bloc (`hero`, `about`, `projectsSection`...). Modifie la phrase en `fr` et sa version en `en`. |
| Les phrases de la mascotte | `src/i18n/translations.js`, bloc `welcome`, liste `steps` | Une phrase par entrée, dans chaque langue. |
| Le chiffre « projets en ligne » de l'accueil | `src/data/projects.js` | Il compte les projets du tableau : ajoute ou retire un projet. |
| « certifications », « ans à coder », « + lignes de code » | `src/data/certifications.js` | Change les nombres `totalCertifications`, `yearsCoding` et `linesOfCode`. |
| Ajouter ou retirer un projet | `src/data/projects.js` | Copie un bloc `{ ... }`, change ses champs. L'ordre du tableau est l'ordre d'affichage. |
| L'aperçu (capture) d'un projet | `src/data/projects.js` | Dépose l'image (WebP ou PNG) dans `src/assets/projects/`, ajoute son `import` en haut du fichier, puis `image: monImage`. Elle s'affiche en entier, sans recadrage. |
| La composition d'une carte projet | `src/data/projects.js`, champ `layout` | `'a'` fenêtre inclinée, `'b'` aperçu en arche (pour une capture plutôt carrée), `'c'` volet qui chevauche. |
| La couleur d'une carte projet | `src/data/projects.js`, champ `theme` | `'wine'`, `'pink'`, `'plum'` ou `'lemon'`. |
| Ton rôle, le problème, le résultat d'un projet | `src/data/projects.js`, champs `role`, `problem`, `result` | Remplace `null` par `{ fr: '...', en: '...' }`. |
| Les compétences, leur territoire | `src/data/skills.js` | Change le champ `territory` (`daily`, `practice` ou `exploration`). Les liens avec les projets se calculent d'après la `stack`. |
| Les étapes du parcours | `src/data/timeline.js` | Ajoute une entrée : elle apparaît avec la composition suivante. |
| Les événements (« Au-delà du code ») | `src/data/events.js` | Ajoute un objet dans le tableau, le plus récent en premier. |
| Ta photo | `src/assets/portrait.webp` | Remplace le fichier (même nom, ou `portrait.jpg` / `.png`). |
| L'apparence de la mascotte | `src/data/mascot.js` | Teint, cheveux, coiffure, tenue, lunettes. |
| Les couleurs, les polices, les espaces | `src/styles/variables.css` | Les cinq couleurs de la charte sont tout en haut. |
| Les éléments qui apparaissent au défilement | `src/hooks/useScrollReveal.js` | Ajoute le sélecteur CSS de l'élément à la liste `SELECTOR`. |
| Le formulaire de contact | `src/components/Contact.jsx` | Adresse Formspree en haut du fichier. |
| Les réseaux sociaux du pied de page | `src/components/Footer.jsx` | Tableau `SOCIALS` en haut du fichier. |

Après chaque modification : `npm run dev` pour vérifier dans le navigateur, puis `git add .`, `git commit`, `git push`.

## L'introduction

Une porte fermée par un nœud papillon : le nœud se défait, les deux panneaux s'ouvrent, puis une mascotte accueille le visiteur
(`src/components/Intro.jsx`). Deux rendus, choisis automatiquement : 3D (Three.js) sur ordinateur avec WebGL ;
CSS/SVG sur mobile, sans WebGL, ou si la 3D échoue. Aucune intro si la personne préfère réduire les animations.
Bouton « Passer l'intro » et touche Échap dans tous les cas.

Les panneaux peuvent venir de Blender : `tools/blender/build_panels.py` génère `public/models/panels.glb`, que le site utilise s'il existe.
Le nœud papillon 3D est généré par le code (`src/components/intro/panelsScene.js`).

## La mascotte

Dessin 2D en SVG (`src/components/Mascot.jsx`), réglé dans `src/data/mascot.js` : teint, cheveux, coiffure, tenue, lunettes.
Une illustration déposée dans `src/assets/` sous le nom `mascot.png` (ou `.webp`, `.svg`, `.jpg`) remplace le dessin.

## Dépendances

Le site n'utilise plus que `react`, `react-dom` et `three`. Pour retirer les anciennes
dépendances devenues inutiles (et mettre à jour `package-lock.json`) :

```bash
npm uninstall @emailjs/browser @react-three/drei @react-three/fiber framer-motion gsap react-icons
```