import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { totalCertifications, linesOfCode, yearsCoding } from '../data/certifications';
import useReveal from '../hooks/useReveal';
import { useLanguage } from '../i18n/LanguageContext';
import './Certifications.css';

// ⚠️ Le texte de cette section (titre, note, cartes highlights) est dans
// src/i18n/translations.js, clé "certifications". Les NOMBRES affichés
// viennent de src/data/certifications.js — à toi de les mettre à jour au
// fil de ton évolution (nouvelle certification obtenue, nouvelle année...).

// Anime un compteur de 0 jusqu'à `target` dès qu'il entre dans l'écran,
// puis s'arrête sur cette valeur (aucun défilement perpétuel).
function useCountUp(target, { duration = 1600 } = {}) {
  const [value, setValue] = useState(0);
  const nodeRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setValue(target);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();

            const tick = (now) => {
              const raw = Math.min((now - start) / duration, 1);
              const eased = 1 - (1 - raw) ** 3;
              setValue(Math.round(eased * target));
              if (raw < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration]);

  return [value, nodeRef];
}

function StatBlock({ target, label, note, delay }) {
  const [value, ref] = useCountUp(target);

  return (
    <motion.div
      className="certifications__stat"
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <span className="certifications__stat-number">{value.toLocaleString('fr-FR')}</span>
      <span className="certifications__stat-label">{label}</span>
      {note && <p className="certifications__stat-note">{note}</p>}
    </motion.div>
  );
}

export default function Certifications() {
  const ref = useReveal();
  const { t } = useLanguage();

  return (
    <section id="certifications" className="section certifications" ref={ref}>
      <div className="container certifications__inner">
        <div className="section-head reveal">
          <p className="eyebrow">{t.certifications.eyebrow}</p>
        </div>

        <div className="certifications__showcase">
          <StatBlock target={linesOfCode} label={t.certifications.linesLabel} delay={0} />
          <StatBlock
            target={totalCertifications}
            label={t.certifications.countLabel}
            note={t.certifications.note}
            delay={0.1}
          />
          <StatBlock target={yearsCoding} label={t.certifications.yearsLabel} delay={0.2} />
        </div>

        <ul className="certifications__highlights">
          {t.certifications.highlights.map((item, i) => (
            <motion.li
              key={item.title}
              className="certifications__highlight-card"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <span className="certifications__highlight-index">{String(i + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}