import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import projects from '../data/projects';
import { useLanguage } from '../i18n/LanguageContext';
import './Projects.css';

// Galerie : tous les projets ont la même importance et la même taille.
// Seule la composition varie (cadre de l'aperçu, place du texte, couleur).
// Sur mobile (<= 820 px), la galerie devient un carrousel horizontal.
const CAROUSEL_QUERY = '(max-width: 820px)';
const VARIANTS = ['a', 'b', 'c', 'b', 'c', 'a'];

const pad = (value) => String(value).padStart(2, '0');

function useIsCarousel() {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia(CAROUSEL_QUERY);
      query.addEventListener('change', notify);
      return () => query.removeEventListener('change', notify);
    },
    () => window.matchMedia(CAROUSEL_QUERY).matches,
    () => false
  );
}

// "Numera : jeu de devinette" -> nom court en grand, précision en petit.
function splitTitle(title) {
  const [name, ...rest] = title.split(' : ');
  return { name, kicker: rest.join(' : ') };
}

function Fact({ label, children }) {
  if (!children) return null;
  return (
    <div className="gp__fact">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Stage({ project, variant }) {
  const { name } = splitTitle(project.title);
  return (
    <div className="gp__stage">
      <div className="gp__frame">
        {variant !== 'b' && (
          <div className="gp__bar" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        )}
        {project.image ? (
          <img src={project.image} alt="" width="680" height="720" loading="lazy" decoding="async" />
        ) : (
          <div className="gp__placeholder" aria-hidden="true">
            <span>{name}</span>
          </div>
        )}
      </div>
      {project.year && <span className="gp__year">{project.year}</span>}
    </div>
  );
}

function Info({ project, index, copy, lang }) {
  const { name, kicker } = splitTitle(project.title);

  return (
    <div className="gp__info">
      <p className="gp__top">
        <span className="gp__num" aria-hidden="true">{pad(index + 1)}</span>
        {kicker && <span className="gp__kicker">{kicker}</span>}
      </p>
      <h3 className="gp__title">{name}</h3>
      <p className="gp__tagline">{project.tagline[lang]}</p>

      <dl className="gp__facts">
        <Fact label={copy.problem}>{project.problem?.[lang]}</Fact>
        <Fact label={copy.project}>{project.description[lang]}</Fact>
        <Fact label={copy.role}>{project.role?.[lang]}</Fact>
        <Fact label={copy.result}>{project.result?.[lang]}</Fact>
      </dl>

      <ul className="gp__stack" aria-label={copy.stack}>
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      <div className="gp__links">
        {project.demo && (
          <a className="btn btn--solid" href={project.demo} target="_blank" rel="noreferrer noopener" aria-label={copy.demoLabel(name)}>
            {copy.demo} <span aria-hidden="true">↗</span>
          </a>
        )}
        {project.github && (
          <a className="btn btn--line" href={project.github} target="_blank" rel="noreferrer noopener" aria-label={copy.codeLabel(name)}>
            {copy.code}
          </a>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const { t, lang } = useLanguage();
  const copy = t.projectsSection;
  const total = projects.length;
  const isCarousel = useIsCarousel();

  const trackRef = useRef(null);
  const itemRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [revealed, setRevealed] = useState(() => new Set());

  // La révélation au défilement n'est active que sur ordinateur, et seulement
  // si les animations ne sont pas réduites : sinon tout reste visible.
  const [armed] = useState(
    () =>
      typeof window !== 'undefined' &&
      'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (!armed || isCarousel) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setRevealed((previous) => new Set(previous).add(index));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    itemRefs.current.filter(Boolean).forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [armed, isCarousel]);

  // Carrousel mobile : quelle carte est devant, et où en est le défilement.
  const update = useCallback(() => {
    const track = trackRef.current;
    const items = itemRefs.current.filter(Boolean);
    if (!track || items.length === 0) return;

    const edge = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    let best = 0;
    let bestDistance = Infinity;
    items.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft - track.scrollLeft - edge);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });

    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    setActive(atEnd ? items.length - 1 : best);
    if (track.scrollLeft > 12) setHasScrolled(true);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!isCarousel || !track) return undefined;

    let frame = 0;
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
      }
    };
    const onScroll = schedule;
    schedule();
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', onScroll);
    };
  }, [isCarousel, update]);

  return (
    <section id="projects" className={`section projects band ${armed ? 'projects--armed' : ''}`}>
      <div className="container">
        <header className="projects__head">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p className="lead">{total ? copy.lead : copy.empty}</p>
        </header>

        {total > 0 && (
          <>
            {/* Mobile : compteur, progression et invitation à glisser. */}
            <div className="projects__controls">
              <p className="projects__counter" aria-live="polite">
                <span className="projects__current" key={active}>{pad(active + 1)}</span>
                <span className="projects__total"> / {pad(total)}</span>
              </p>
              <div className="projects__progress" aria-hidden="true">
                <span style={{ transform: `scaleX(${(active + 1) / total})` }} />
              </div>
            </div>
            <p className={`projects__hint ${hasScrolled ? 'is-gone' : ''}`} aria-hidden="true">
              {copy.swipe} <span>→</span>
            </p>

            <ul
              className="gallery"
              ref={trackRef}
              {...(isCarousel
                ? { tabIndex: 0, role: 'region', 'aria-roledescription': 'carousel', 'aria-label': copy.carousel }
                : {})}
            >
              {projects.map((project, index) => {
                const variant = VARIANTS[index % VARIANTS.length];
                const infoFirst = variant === 'b';
                return (
                  <li
                    key={project.id}
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                    data-index={index}
                    className={`gallery__item ${revealed.has(index) ? 'is-in' : ''}`}
                    {...(isCarousel
                      ? { role: 'group', 'aria-roledescription': 'slide', 'aria-label': copy.slide(index + 1, total) }
                      : {})}
                  >
                    <article className={`gp gp--${variant} band band--${project.theme}`}>
                      {infoFirst && <Info project={project} index={index} copy={copy} lang={lang} />}
                      <Stage project={project} variant={variant} />
                      {!infoFirst && <Info project={project} index={index} copy={copy} lang={lang} />}
                    </article>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
