import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAuth } from '../../services/authService';
import styles from './Topbar.module.css';

const TITLES = {
  '/noticias': 'Noticias',
  '/reportes': 'Reportes',
};

export default function Topbar({ pathname, username }) {
  const [query, setQuery] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate();
  const initials = (username || 'U').slice(0, 2).toUpperCase();
  const title = TITLES[pathname] || 'HUB';

  useEffect(() => {
    fetchAuth(`/api/perfil/${username}`)
      .then(res => setAvatarUrl(res.data?.profile_picture || null))
      .catch(() => {});
  }, [username]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/perfil/${query.trim()}`);
      setQuery('');
    }
  };

  return (
    <div className={styles.topbar}>
      <span className={styles.title}>{title}</span>

      <div className={styles.actions}>
        <div className={styles.search}>
          <span className={styles.searchIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text-primary)',
              fontSize: 12, outline: 'none', width: '100%', fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        <div className={styles.notification}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>

        <Link to={`/perfil/${username}`} className={styles.avatar}>
          {avatarUrl ? (
            <img key={avatarUrl} src={avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            initials
          )}
        </Link>
      </div>
    </div>
  );
}