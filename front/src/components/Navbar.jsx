import { useState, useEffect } from 'react';

export default function Navbar({ onOpenModal }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a className="nav-logo" href="#">
        [<span>ACCESS</span>_DENIED]
      </a>

      <ul className="nav-links">
        <li><a href="#" onClick={() => scrollTo('news')}>// proyecto</a></li>
        <li><a href="#" onClick={() => scrollTo('about')}>// terminal</a></li>
        <li>
          <a
            href="https://github.com/Pedrog1999/TP-FINAL-PROG-III.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            // github ↗
          </a>
        </li>
      </ul>

      <div className="nav-actions">
        <button className="btn-ghost" onClick={() => onOpenModal('login')}>
          Log_In
        </button>
        <button className="btn-solid" onClick={() => onOpenModal('register')}>
          Register
        </button>
      </div>
    </nav>
  );
}