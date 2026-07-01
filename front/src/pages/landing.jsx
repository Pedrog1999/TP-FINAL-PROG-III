import { useState } from 'react';

import Navbar        from '../components/Navbar';
import HeroSection   from '../components/HeroSection';
import AboutSection  from '../components/AboutSection';
import Footer        from '../components/Footer';
import AuthModal     from '../components/AuthModal';

import '../styles/landing.css';

export default function Landing() {
  const [modal, setModal] = useState(null); 

  const openModal  = (tab) => setModal(tab);
  const closeModal = ()    => setModal(null);

  return (
    <>
    
      <div className="scanlines" aria-hidden="true" />

     
      <Navbar onOpenModal={openModal} />

  <main>
        <HeroSection   onOpenModal={openModal} />
        <AboutSection  />

</main>

      <Footer />

      {modal && (
        <AuthModal
          initialTab={modal}
          onClose={closeModal}
        />
      )}
    </>
  );
}