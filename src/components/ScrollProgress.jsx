import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './ScrollProgress.css';

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollProgress() {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const pct =
        scrollHeight > 0
          ? Math.min(Math.max(scrollTop / scrollHeight, 0), 1)
          : 0;

      setProgress(pct);
      setVisible(scrollTop > 120);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const offset = CIRCUMFERENCE * (1 - progress);
  const percent = Math.round(progress * 100);

  return (
    <button
      type="button"
      className={`scroll-ring ${visible ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t.footer.top}
    >
      <span className="scroll-ring__halo" aria-hidden="true" />

      <svg viewBox="0 0 68 68" className="scroll-ring__svg">
        <defs>
          <linearGradient
            id="scroll-ring-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="55%" stopColor="var(--color-secondary)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>

        <circle
          className="scroll-ring__track"
          cx="34"
          cy="34"
          r={RADIUS}
        />

        <circle
          className="scroll-ring__value"
          cx="34"
          cy="34"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>

      <span className="scroll-ring__center">
        <span className="scroll-ring__percent">{percent}</span>
        <span className="scroll-ring__arrow" aria-hidden="true">
          ↑
        </span>
      </span>
    </button>
  );
}