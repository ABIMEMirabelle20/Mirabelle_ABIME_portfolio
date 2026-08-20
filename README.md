# Portfolio — Mirabelle ABIME

Portfolio personnel premium développé avec **React.js, JavaScript, HTML5 et CSS3**, sans Tailwind CSS ni framework CSS.
Le projet est construit avec **Vite** et met l'accent sur une interface moderne, responsive, accessible et animée.

## 🚀 Lancer le projet

```bash
npm install
npm run dev       # serveur de développement
npm run build     # build de production dans /dist
npm run preview   # prévisualiser le build de production
```

## 📁 Structure du projet

```text
src/
├── components/   → composants React (.jsx) et leurs styles (.css)
├── data/         → données éditables : projets, compétences, parcours, intérêts
├── hooks/        → hooks personnalisés pour les animations et la navigation
└── styles/       → variables de design, reset et styles globaux
```

### Hooks principaux

* `useReveal` → déclenche les animations lors de l'apparition des éléments à l'écran.
* `useActiveSection` → détecte la section actuellement visible afin d'adapter la navigation.

## ✏️ Personnaliser le contenu

### Informations personnelles

Les textes principaux peuvent être modifiés directement dans :

* `Hero.jsx`
* `About.jsx`
* `Contact.jsx`

### Projets

Les projets sont centralisés dans :

```text
src/data/projects.js
```

Il est également possible d'utiliser le bouton **"+ Ajouter un projet"** disponible dans la galerie pour ajouter temporairement un projet pendant la session.

### Compétences

Les compétences sont définies dans :

```text
src/data/skills.js
```

Chaque compétence peut notamment contenir :

* une branche ;
* un niveau de maîtrise de 0 à 100 ;
* une description.

### Parcours

Le parcours est défini dans :

```text
src/data/timeline.js
```

### Centres d'intérêt

Les centres d'intérêt sont définis dans :

```text
src/data/interests.js
```

### Design

Les couleurs, typographies et espacements sont centralisés dans :

```text
src/styles/variables.css
```

Cela permet de modifier facilement l'identité visuelle du portfolio.

## 🛠️ Technologies utilisées

* **React.js**
* **JavaScript**
* **HTML5**
* **CSS3**
* **Vite**
* **IntersectionObserver API**
* **CSS Animations & Transitions**

Aucun framework CSS et aucune bibliothèque d'animation externe n'ont été utilisés.

## ⚙️ Fonctionnalités

* Design responsive adapté aux différents écrans
* Navigation entre les différentes sections
* Navigation active selon la section consultée
* Animations au scroll
* Arbre interactif des compétences
* Timeline du parcours
* Galerie de projets
* Ajout temporaire de projets
* Formulaire de contact
* Support de `prefers-reduced-motion`
* Navigation au clavier
* Attributs `aria-label` pour améliorer l'accessibilité

## 📩 Formulaire de contact

Le formulaire utilise actuellement `mailto:` afin d'ouvrir un client de messagerie avec un e-mail pré-rempli.

Pour une véritable gestion des messages côté serveur, il pourra être connecté ultérieurement à une solution telle que **Formspree**, **Resend** ou à un backend personnalisé.

## ♿ Accessibilité

Une attention particulière a été portée à l'accessibilité :

* navigation au clavier ;
* éléments interactifs correctement identifiés ;
* utilisation d'`aria-label` lorsque nécessaire ;
* contraste des couleurs ;
* prise en compte de `prefers-reduced-motion`.

## 🤖 Utilisation de l'intelligence artificielle

L'intelligence artificielle a été utilisée comme **outil d'accompagnement durant le développement du projet**, notamment pour la réflexion, la génération de certaines idées, l'assistance au développement et la résolution de problèmes techniques.

La conception, les choix techniques, la personnalisation du portfolio, l'intégration et les modifications finales ont été réalisés et vérifiés par **Mirabelle ABIME**.

L'IA a donc été utilisée comme **outil d'aide au développement et d'apprentissage**, et non comme substitut au travail de développement.

## 👩🏽‍💻 Auteur

**Mirabelle ABIME**

Étudiante en informatique et développeuse web en apprentissage.

> Portfolio réalisé avec React.js et Vite, dans le cadre de mon parcours d'apprentissage et de développement de mes compétences en développement web.

