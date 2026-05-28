import { useState } from 'react';

import Navbar        from '../components/Navbar';
import HeroSection   from '../components/HeroSection';
import StatsBar      from '../components/StatsBar';
import NewsSection   from '../components/NewSection';
import AboutSection  from '../components/AboutSection';
import TechSection   from '../components/TechSection';
import ThanksSection from '../components/ThanksSection';
import Footer        from '../components/Footer';
import AuthModal     from '../components/AuthModal';

import '../styles/landing.css';

export default function Landing() {
  const [modal, setModal] = useState(null); // null | 'login' | 'register'

  const openModal  = (tab) => setModal(tab);
  const closeModal = ()    => setModal(null);

  return (
    <>
      {/* Scanlines persistentes */}
      <div className="scanlines" aria-hidden="true" />

      {/* Nav flotante */}
      <Navbar onOpenModal={openModal} />

      {/* Secciones */}
      <main>
        <HeroSection   onOpenModal={openModal} />
        <StatsBar      />
        <NewsSection   />
        <AboutSection  />
        <TechSection   />
        <ThanksSection />
      </main>

      <Footer />

      {/* Modal de auth (montado condicionalmente) */}
      {modal && (
        <AuthModal
          initialTab={modal}
          onClose={closeModal}
        />
      )}
    </>
  );
}