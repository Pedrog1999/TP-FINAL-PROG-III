import { useState, useEffect } from 'react';
import MatrixRain from './MatrixRain';

const TYPEWRITER_LINES = [
  'Exploring vulnerabilities in modern systems...',
  'Bypassing security protocols since 2026...',
  'The best offense is a good defense...',
  'Know the enemy. Know yourself...',
  'Every system has a weakness. Find yours first...',
];

export default function HeroSection({ onOpenModal }) {
  const [lineIndex, setLineIndex]   = useState(0);
  const [displayed, setDisplayed]   = useState('');
  const [charIndex, setCharIndex]   = useState(0);
  const [deleting, setDeleting]     = useState(false);

  // Typewriter effect — pure hooks, no extra libreriazsd
  
  useEffect(() => {
    const current = TYPEWRITER_LINES[lineIndex];
    let timeout;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      }, 45);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex(c => c - 1);
      }, 22);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setLineIndex(i => (i + 1) % TYPEWRITER_LINES.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, lineIndex]);

  return (
    <section className="hero">





      <div className="hero-overlay" />

      {/* Matrix rain canvas */}
      <MatrixRain opacity={0.22} />

      <div className="hero-content">
        <p className="hero-eyebrow">// UTN — Tecnicatura Universitaria en Programación</p>

        <h1 className="hero-title">
          <span className="line1">Access Denied</span>
          <span className="line2">Welcome.</span>
        </h1>

        <p className="hero-slogan">[ SECURITY_FORUM — v1.0.0 — CLASIFICADO ]</p>

        <div className="hero-typewriter">{displayed}</div>

        <div className="hero-cta">
          <button className="btn-hero-primary" onClick={() => onOpenModal('register')}>
            &gt; Crear cuenta
          </button>
          <button className="btn-hero-secondary" onClick={() => onOpenModal('login')}>
            &gt; Iniciar sesión
          </button>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-line" />
        <span>SCROLL</span>
      </div>
    </section>
  );
}