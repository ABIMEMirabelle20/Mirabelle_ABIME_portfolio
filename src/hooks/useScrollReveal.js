import { useEffect } from 'react';
import '../styles/reveal.css';

// Éléments qui apparaissent au défilement. Pour en ajouter un, ajoute son
// sélecteur CSS à cette liste. Les cartes de projets et les étapes du parcours
// ont leur propre apparition, et l'accueil est visible dès l'arrivée.
const SELECTOR = [
  '.about__visual',
  '.about__content > *',
  '.about__terrains-title',
  '.about__terrain',
  '.projects__head > *',
  '.skills__head > *:not(.skills__stamp)',
  '.lab__map',
  '.events__head > *',
  '.events__empty',
  '.event',
  '.journey__head > *',
  '.journey__learning',
  '.contact__intro > *',
  '.contact__form',
  '.footer__stage',
  '.footer__bottom',
].join(',');

export default function useScrollReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const nodes = [...document.querySelectorAll(SELECTOR)];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.reveal = 'in';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    nodes.forEach((node) => {
      // Les éléments d'un même bloc arrivent l'un après l'autre.
      const rank = nodes.filter((other) => other.parentElement === node.parentElement).indexOf(node);
      node.style.setProperty('--reveal-delay', `${Math.min(rank * 70, 350)}ms`);
      node.dataset.reveal = 'pending';
      observer.observe(node);
    });

    // Tout en bas de la page, les derniers éléments sont révélés d'office.
    const revealAtBottom = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        nodes.forEach((node) => {
          node.dataset.reveal = 'in';
        });
      }
    };
    window.addEventListener('scroll', revealAtBottom, { passive: true });

    return () => {
      window.removeEventListener('scroll', revealAtBottom);
      observer.disconnect();
      nodes.forEach((node) => {
        node.dataset.reveal = 'in';
      });
    };
  }, []);
}