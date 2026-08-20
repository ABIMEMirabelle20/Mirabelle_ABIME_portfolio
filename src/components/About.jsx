import useReveal from '../hooks/useReveal';
import { useLanguage } from '../i18n/LanguageContext';
import portrait from '../assets/hero.png';
import Reveal from './motion/Reveal';
import './About.css';

// ⚠️ Le texte de cette section (eyebrow, title, lead, p2, p3, facts) ne se
// trouve PAS dans ce fichier : il vient de src/i18n/translations.js,
// sous la clé "about" (une fois pour le français, une fois pour l'anglais).
// Modifie le texte là-bas, pas ici.
export default function About() {
  const ref = useReveal();
  const { t } = useLanguage();

  return (
    <section id="about" className="section about" ref={ref}>
      <div className="container about__grid">
        {/* Le portrait n'est jamais soumis à une animation d'apparition :
            toujours visible immédiatement, sur mobile comme sur desktop. */}
        <div className="about__visual">
          <span className="about__glow" aria-hidden="true" />
          <div className="about__frame">
            <img className="about__photo" src={portrait} alt="Mirabelle ABIME" loading="eager" />
          </div>
          <span className="about__ring" aria-hidden="true" />
        </div>

        <div className="about__content">
          <Reveal as="p" className="eyebrow">{t.about.eyebrow}</Reveal>
          <Reveal as="h2" delay={0.08}>{t.about.title}</Reveal>

          <Reveal as="p" className="about__text about__text--lead" delay={0.16}>{t.about.lead}</Reveal>
          <Reveal as="p" className="about__text" delay={0.22}>{t.about.p2}</Reveal>
          <Reveal as="p" className="about__text" delay={0.28}>{t.about.p3}</Reveal>

          <Reveal as="ul" className="about__facts" delay={0.36}>
            {t.about.facts.map((fact) => (
              <li key={fact.label} className="about__fact-card">
                <span className="about__fact-label">{fact.label}</span>
                <span className="about__fact-value">{fact.value}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
