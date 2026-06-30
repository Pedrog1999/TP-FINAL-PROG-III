import { useState, useEffect } from 'react';
import Sidebar from '../components/app/Sidebar';
import Topbar from '../components/app/Topbar';
import NewsCard from '../components/app/NewsCard';
import NewsDetail from '../components/app/NewsDetail';
import { getNoticias } from '../services/newsService';
import styles from './Noticias.module.css';

export default function Noticias() {
  const [news, setNews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username') || 'user';

  useEffect(() => {
    getNoticias()
      .then(res => setNews(res.data))
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  if (selected) {
    return (
      <div className={styles.page}>
        <Sidebar />
        <div className={styles.main}>
          <Topbar pathname="/noticias" username={username} />
          <div className={styles.content}>
            <NewsDetail news={{
              ...selected,
              author: selected.author_name,
              date: selected.created_at,
            }} onBack={() => setSelected(null)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar pathname="/noticias" username={username} />
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              Últimas noticias
              {news.length > 0 && <span className={styles.badge}>{news.length}</span>}
            </div>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
              Cargando noticias...
            </p>
          ) : news.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
              No hay noticias aún.
            </p>
          ) : (
            <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {news.map((n, i) => (
                <NewsCard
                  key={n.id}
                  title={n.title}
                  body={n.body}
                  tag={n.category}
                  date={n.created_at}
                  featured={i === 0}
                  imageUrl={n.image_url}
                  onClick={() => setSelected(n)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}