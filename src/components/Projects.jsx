import { useCallback, useEffect, useRef, useState } from 'react';
import projects from '../data/projects';
import { useLanguage } from '../i18n/LanguageContext';
import TechIcon from './TechIcon';
import './Projects.css';

// ⚠️ Le titre/l'intro de section et les mots "Code"/"Démo" sont dans
// src/i18n/translations.js (clé "projectsSection"). Chaque projet (titre,
// description, technologies, liens, image) est dans src/data/projects.js.
//
// Particularité de cette section : UN SEUL système de galerie, qui défile
// horizontalement aussi bien sur PC (molette redirigée + glisser à la
// souris + flèches/points) que sur mobile/tablette (swipe tactile natif).
// On n'utilise plus de mise en page "plein écran" (100svh) : chaque carte
// a une hauteur naturelle, ce qui évite tout risque de contenu invisible/
// coupé quand la fenêtre est plus basse que prévu (petit laptop, barre
// d'adresse mobile, mode paysage...).

function GithubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProjectCard({ project, index, t, lang }) {
  const hasDemo = project.demo && project.demo !== '#';

  return (
    <article
      className="projects__card"
      style={{ '--card-a': project.gradient[0], '--card-b': project.gradient[1] }}
    >
      <div className="projects__card-media">
        <div className="projects__card-media-bar">
          <span /><span /><span />
          <span className="projects__card-index">
            {String(index + 1).padStart(2, '0')}/{String(projects.length).padStart(2, '0')}
          </span>
        </div>

        <div className="projects__card-media-body">
          {project.image ? (
            <img src={project.image} alt={project.title} loading="lazy" draggable="false" />
          ) : (
            <span className="projects__card-monogram">{project.title.charAt(0)}</span>
          )}
          {project.year && <span className="projects__card-year">{project.year}</span>}
        </div>
      </div>

      <div className="projects__card-body">
        <p className="projects__card-tagline">{project.tagline[lang]}</p>
        <h3 className="projects__card-title">{project.title}</h3>
        {project.description?.[lang] && (
          <p className="projects__card-desc">{project.description[lang]}</p>
        )}

        <div className="projects__card-stack">
          {project.stack.map((tech) => <TechIcon key={tech} name={tech} />)}
        </div>

        <div className="projects__card-actions">
          {project.github && (
            <a href={project.github} className="projects__link" target="_blank" rel="noreferrer">
              <GithubIcon /><span>{t.projectsSection.code}</span>
            </a>
          )}
          {hasDemo && (
            <a href={project.demo} className="projects__link projects__link--primary" target="_blank" rel="noreferrer">
              <span>{t.projectsSection.demo}</span><ArrowIcon />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const { t, lang } = useLanguage();
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const count = projects.length;

  // Molette verticale -> défilement horizontal (PC/trackpad). On attache
  // l'écouteur "à la main" via addEventListener({ passive: false }) plutôt
  // que par la prop React onWheel, car React attache onWheel en mode passif
  // par défaut — preventDefault() y est silencieusement ignoré. Sur mobile
  // il n'y a pas d'évènement "wheel" : le swipe tactile natif suffit et
  // n'est jamais intercepté ici.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    const onWheel = (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      const atStart = el.scrollLeft <= 1;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;

      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Glisser-déposer à la souris (desktop uniquement — le tactile défile
  // déjà nativement, donc on ignore les pointeurs "touch"/"pen" pour ne
  // pas interférer avec le swipe mobile).
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    const onPointerDown = (e) => {
      if (e.pointerType !== 'mouse') return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.classList.add('is-dragging');
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startScroll - dx;
    };

    const stopDrag = () => {
      dragging = false;
      el.classList.remove('is-dragging');
    };

    // Empêche le clic sur un lien juste après un glissement (évite
    // d'ouvrir accidentellement un projet en voulant simplement défiler).
    const onClickCapture = (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);
    el.addEventListener('click', onClickCapture, true);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDrag);
      window.removeEventListener('pointercancel', stopDrag);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  // Suit la position de scroll pour savoir quelle carte est "active"
  // (pour les points) et si les flèches prev/next doivent être actives.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    const update = () => {
      const cards = Array.from(el.querySelectorAll('.projects__card'));
      if (!cards.length) return;

      let closest = 0;
      let minDiff = Infinity;
      cards.forEach((card, i) => {
        const diff = Math.abs(card.offsetLeft - el.scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      });

      setActive(closest);
      setCanPrev(el.scrollLeft > 8);
      setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const goTo = useCallback((i) => {
    const el = trackRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.projects__card');
    const clamped = Math.max(0, Math.min(count - 1, i));
    const card = cards[clamped];
    if (card) {
      el.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    }
  }, [count]);

  const onTrackKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  return (
    <section id="projects" className="projects section">
      <div className="projects__head container">
        <p className="eyebrow">{t.projectsSection.eyebrow}</p>
        <h2>{t.projectsSection.title}</h2>
        {t.projectsSection.lead && <p className="projects__lead">{t.projectsSection.lead}</p>}
      </div>

      <div className="projects__gallery">
        <button
          type="button"
          className="projects__nav projects__nav--prev"
          onClick={() => goTo(active - 1)}
          disabled={!canPrev}
          aria-label="Projet précédent"
        >
          ←
        </button>

        <div
          className="projects__track"
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-label={t.projectsSection.title}
          onKeyDown={onTrackKeyDown}
        >
          {projects.map((project, i) => (
            <ProjectCard project={project} index={i} t={t} lang={lang} key={project.id} />
          ))}
          {/* Carte "espace" invisible en fin de piste pour permettre à la
              dernière vraie carte d'atteindre le bord gauche, comme les
              autres, quand on la centre/scrolle jusqu'au bout. */}
          <div className="projects__track-spacer" aria-hidden="true" />
        </div>

        <button
          type="button"
          className="projects__nav projects__nav--next"
          onClick={() => goTo(active + 1)}
          disabled={!canNext}
          aria-label="Projet suivant"
        >
          →
        </button>
      </div>

      <div className="projects__dots container">
        {projects.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`projects__dot ${i === active ? 'is-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Aller au projet ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
