import { useEffect, useRef, useState } from 'react';
import useActiveSection from '../hooks/useActiveSection';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import './Navbar.css';

// ⚠️ Les libellés du menu (Accueil, À propos, Projets...) sont dans
// src/i18n/translations.js, clé "nav".

const LINK_IDS = ['about', 'skills', 'projects', 'timeline', 'certifications', 'contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const active = useActiveSection(LINK_IDS);
  const scrollLockY = useRef(0);

  const links = LINK_IDS.map((id) => ({ id, label: t.nav[id] }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  useEffect(() => {
    if (open) {
      scrollLockY.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollLockY.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo(0, scrollLockY.current);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
    };
  }, [open]);

  
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleClick = (id) => {
    setOpen(false);
  
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const toggleLang = () => setLang(lang === 'fr' ? 'en' : 'fr');

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__inner container">
        <a
          href="#home"
          className="nav__mark"
          onClick={(e) => { e.preventDefault(); handleClick('home'); }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" className="nav__mark-logo">
            {/* Accent décoratif : un arc fin, comme un trait de signature */}
            <path
              d="M3.5 17A12.5 12.5 0 0 1 12 4.8"
              fill="none"
              stroke="var(--color-line)"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            {/* Monogramme "M" au trait, arrondi, minimaliste */}
            <path
              d="M8.5 24.5V9.2h3l4.5 6.6 4.5-6.6h3v15.3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="nav__mark-text">
            <span className="nav__mark-first">Mirabelle</span>
            <span className="nav__mark-last">ABIME</span>
          </span>
        </a>

        <div className="nav__pill">
          <nav className="nav__links" aria-label="Navigation principale">
            {links.map((link) => (
              <button
                key={link.id}
                className={`nav__link ${active === link.id ? 'is-active' : ''}`}
                onClick={() => handleClick(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="nav__actions">
            <button
              type="button"
              className="nav__lang"
              onClick={toggleLang}
              aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
            >
              <span className={`nav__lang-indicator ${lang === 'en' ? 'is-en' : ''}`} aria-hidden="true" />
              <span className={`nav__lang-option ${lang === 'fr' ? 'is-active' : ''}`}>FR</span>
              <span className={`nav__lang-option ${lang === 'en' ? 'is-active' : ''}`}>EN</span>
            </button>

            <button
              type="button"
              className="nav__theme"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Passer en mode jour' : 'Passer en mode nuit'}
            >
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3a9 9 0 1 0 9 9c0-.35-.02-.7-.05-1.04A7 7 0 0 1 12 3Z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.2" fill="currentColor" />
                  <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
                  </g>
                </svg>
              )}
            </button>

            {/* Bouton "burger" à 3 barres : visible uniquement sur desktop
                (au cas où .nav__links déborderait) — sur mobile c'est le
                bouton texte .nav__menu-btn ci-dessous qui est utilisé. */}
            <button
              className="nav__toggle"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="nav__toggle-bar" />
              <span className="nav__toggle-bar" />
              <span className="nav__toggle-bar" />
            </button>
          </div>
        </div>

        {/* Pilule "Menu" / "Fermer" — mobile uniquement */}
        <button
          type="button"
          className="nav__menu-btn"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (t.nav.closeMenu || 'Fermer') : (t.nav.openMenu || 'Menu')}
        </button>
      </div>

      <div
        className="nav__mobile"
        role="dialog"
        aria-hidden={!open}
        aria-modal={open}
      >
        <button
          type="button"
          className="nav__mobile-close"
          onClick={() => setOpen(false)}
          aria-label={t.nav.closeMenu || 'Fermer le menu'}
        >
          ×
        </button>

        <nav className="nav__mobile-links" aria-label="Navigation mobile">
          {links.map((link, i) => (
            <button
              key={link.id}
              className={`nav__mobile-link ${active === link.id ? 'is-active' : ''}`}
              style={{ transitionDelay: open ? `${0.06 + i * 0.05}s` : '0s' }}
              onClick={() => handleClick(link.id)}
            >
              <span>{link.label}</span>
              <span className="nav__mobile-link-index">{String(i + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </nav>

        <div className="nav__mobile-actions">
          <button type="button" className="nav__mobile-lang" onClick={toggleLang}>
            {lang === 'fr' ? 'Switch to English' : 'Passer en français'}
          </button>
          <button type="button" className="nav__mobile-theme" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4.2" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
                </g>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3a9 9 0 1 0 9 9c0-.35-.02-.7-.05-1.04A7 7 0 0 1 12 3Z" fill="currentColor" />
              </svg>
            )}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </div>
    </header>
  );
}