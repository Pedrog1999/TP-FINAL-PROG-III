import { Link } from 'react-router-dom';
import styles from './Topbar.module.css';

const TITLES = {
  '/noticias': 'Noticias',
  '/reportes': 'Reportes',
};

export default function Topbar({ pathname, username }) {
  const initials = (username || 'U').slice(0, 2).toUpperCase();
  const title = TITLES[pathname] || 'HUB';

  return (
    <div className={styles.topbar}>
      <span className={styles.title}>{title}</span>

      <div className={styles.actions}>
        <div className={styles.search}>
          <span className={styles.searchIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          Buscar usuarios...
        </div>

        <div className={styles.notification}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>

        <Link to={`/perfil/${username}`} className={styles.avatar}>
          {initials}
        </Link>
      </div>
    </div>
  );
}