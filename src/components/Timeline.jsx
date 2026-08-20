import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import timeline from '../data/timeline';
import useReveal from '../hooks/useReveal';
import { useLanguage } from '../i18n/LanguageContext';
import './Timeline.css';

// ⚠️ Le titre/l'intro de section sont dans src/i18n/translations.js (clé
// "timelineSection"). Chaque étape (année, titre, lieu, description) est
// dans src/data/timeline.js.

const cardVariants = {
  hidden: (side) => ({ opacity: 0, x: side === 'left' ? -60 : 60, rotate: side === 'left' ? -2 : 2 }),
  show: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] } },
};

export default function Timeline() {
  const ref = useReveal();
  const { t, lang } = useLanguage();
  const trackRef = useRef(null);

  // La ligne centrale se "remplit" progressivement au fil du scroll à
  // travers la section, plutôt que d'être visible d'un bloc dès l'arrivée.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.8', 'end 0.4'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="timeline" className="section timeline" ref={ref}>
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">{t.timelineSection.eyebrow}</p>
          <h2>{t.timelineSection.title}</h2>
          <p>{t.timelineSection.lead}</p>
        </div>

        <ol className="timeline__track" ref={trackRef}>
          <span className="timeline__track-base" aria-hidden="true" />
          <motion.span
            className="timeline__track-fill"
            aria-hidden="true"
            style={{ scaleY: lineScale }}
          />

          {timeline.map((entry, i) => {
            const side = i % 2 === 0 ? 'left' : 'right';
            return (
              <li key={entry.year + entry.title.fr} className={`timeline__row timeline__row--${side}`}>
                <motion.span
                  className="timeline__dot"
                  aria-hidden="true"
                  variants={dotVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.8 }}
                />

                <motion.div
                  className="timeline__card"
                  custom={side}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <span className="timeline__card-year">{entry.year}</span>
                  <h3>{entry.title[lang]}</h3>
                  <em>{entry.place[lang]}</em>
                  <p>{entry.description[lang]}</p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
