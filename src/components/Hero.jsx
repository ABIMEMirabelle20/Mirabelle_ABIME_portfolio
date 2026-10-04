import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import ErrorBoundary from './ErrorBoundary';
import './Hero.css';

const HeroScene = lazy(() => import('./HeroScene'));

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Le Hero garde sa propre scène 3D (plus dense), en plus de l'environnement
// global (GlobalScene, monté une fois dans App.jsx) qui court derrière tout
// le site. Les deux coexistent : continuité visuelle partout, et le Hero
// reste le moment le plus spectaculaire.
export default function Hero() {
  const { t } = useLanguage();
  const [ready, setReady] = useState(false);
  const [allowScene, setAllowScene] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [typedGreeting, setTypedGreeting] = useState('');
  const [typedRole, setTypedRole] = useState('');
  const greetingTimer = useRef(null);
  const roleTimer = useRef(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
    setAllowScene(!reduced && !lowMemory);
    setIsMobile(window.innerWidth < 700);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Effet "machine à écrire" : la salutation s'écrit toute seule, lettre par
  // lettre, à l'arrivée sur le site (et se retape si la langue change).
  // Si l'utilisateur préfère une motion réduite, le texte s'affiche direct.
  useEffect(() => {
    const fullText = t.hero.greeting;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setTypedGreeting(fullText);
      return undefined;
    }

    setTypedGreeting('');
    let i = 0;
    const startDelay = setTimeout(() => {
      greetingTimer.current = setInterval(() => {
        i += 1;
        setTypedGreeting(fullText.slice(0, i));
        if (i >= fullText.length) clearInterval(greetingTimer.current);
      }, 45);
    }, 300);

    return () => {
      clearTimeout(startDelay);
      clearInterval(greetingTimer.current);
    };
  }, [t.hero.greeting]);

  // Même principe pour la ligne de rôle ("Développeuse Front-End...."),
  // qui démarre juste après la salutation.
  useEffect(() => {
    const fullText = t.hero.eyebrow;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setTypedRole(fullText);
      return undefined;
    }

    setTypedRole('');
    let i = 0;
    const startDelay = setTimeout(() => {
      roleTimer.current = setInterval(() => {
        i += 1;
        setTypedRole(fullText.slice(0, i));
        if (i >= fullText.length) clearInterval(roleTimer.current);
      }, 30);
    }, 1400);

    return () => {
      clearTimeout(startDelay);
      clearInterval(roleTimer.current);
    };
  }, [t.hero.eyebrow]);

  return (
    <section id="home" className={`hero ${ready ? 'is-ready' : ''}`}>
      {allowScene && (
        <ErrorBoundary name="hero-scene" silent>
          <Suspense fallback={null}>
            <HeroScene isMobile={isMobile} />
          </Suspense>
        </ErrorBoundary>
      )}
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__inner container">
        <motion.p
          className="hero__greeting"
          aria-label={t.hero.greeting}
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <span aria-hidden="true">{typedGreeting}</span>
          <span className="hero__greeting-cursor" aria-hidden="true" />
        </motion.p>

        <motion.h1
          className="hero__title"
          variants={fadeUp}
          custom={0.1}
          initial="hidden"
          animate="show"
        >
          <span className="hero__line"><span>{t.hero.titleLine1}</span></span>
          <span className="hero__line"><span className="hero__accent">{t.hero.titleAccent}</span></span>
          <span className="hero__line"><span>{t.hero.titleLine3}</span></span>
        </motion.h1>

        <motion.p
          className="hero__role"
          aria-label={t.hero.eyebrow}
          variants={fadeUp}
          custom={0.24}
          initial="hidden"
          animate="show"
        >
          <span aria-hidden="true">{typedRole}</span>
          <span className="hero__role-cursor" aria-hidden="true" />
        </motion.p>

        <motion.div
          className="hero__actions"
          variants={fadeUp}
          custom={0.36}
          initial="hidden"
          animate="show"
        >
          <button
            className="btn btn--primary"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t.hero.ctaProjects}
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t.hero.ctaContact}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
