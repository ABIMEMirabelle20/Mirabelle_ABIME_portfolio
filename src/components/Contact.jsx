import { useState } from 'react';
import useReveal from '../hooks/useReveal';
import { useLanguage } from '../i18n/LanguageContext';
import './Contact.css';

// ⚠️ Les labels du formulaire (Nom, Email, Sujet, Message, bouton, messages
// d'erreur) sont dans src/i18n/translations.js, clé "contact".

const FORMSPREE_URL = 'https://formspree.io/f/maqrjvqq'; 

export default function Contact() {
  const ref = useReveal();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section contact" ref={ref}>
      <span className="contact__glow" aria-hidden="true" />

      <div className="container contact__grid">
        <div className="reveal">
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h2 className="contact__title">{t.contact.title}</h2>
          <p className="contact__lead">{t.contact.lead}</p>
        </div>

        <form className="contact__form reveal reveal-delay-1" onSubmit={handleSubmit}>
          <label>
            <span>{t.contact.name}</span>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t.contact.namePlaceholder}
            />
          </label>
          <label>
            <span>{t.contact.email}</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t.contact.emailPlaceholder}
            />
          </label>
          <label>
            <span>{t.contact.subject}</span>
            <input
              required
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder={t.contact.subjectPlaceholder}
            />
          </label>
          <label>
            <span>{t.contact.message}</span>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={t.contact.messagePlaceholder}
            />
          </label>
          <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
            {status === 'sending' ? t.contact.sending : status === 'success' ? t.contact.sent : t.contact.send}
          </button>

          {status === 'error' && <p className="contact__form-error">{t.contact.error}</p>}
        </form>
      </div>
    </section>
  );
}
