import styles from './NewsCard.module.css';

const TAGS = {
  critical: 'tagRed',
  exploit: 'tagRed',
  tool: 'tagBlue',
  news: 'tagGreen',
  cve: 'tagOrange',
};

const TAG_LABELS = {
  critical: 'Crítico',
  exploit: 'Exploit',
  tool: 'Herramienta',
  news: 'Noticia',
  cve: 'CVE',
};

export default function NewsCard({ title, body, tag, date, featured, imageUrl, onClick }) {
  const tagClass = TAGS[tag] || 'tagGreen';
  const tagLabel = TAG_LABELS[tag] || 'Noticia';
  const excerpt = body?.length > 100 ? body.slice(0, 100) + '...' : body;

  return (
    <div className={`${styles.card} ${featured ? styles.featured : ''}`} onClick={onClick}>
      {featured ? (
        <>
          <div className={`${styles.imagePlaceholder} ${styles.imageFeatured}`}>
            {imageUrl ? (
              <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            )}
          </div>
          <div className={styles.body}>
            <span className={`${styles.tag} ${styles[tagClass]}`}>{tagLabel}</span>
            <div className={styles.title}>{title}</div>
            <div className={styles.excerpt}>{excerpt}</div>
            <div className={styles.meta}>
              <span className={styles.date}>{date}</span>
              <button className={styles.readMore}>Leer más</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={`${styles.imagePlaceholder} ${styles.imageSmall}`}>
            {imageUrl ? (
              <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            )}
          </div>
          <div className={styles.body}>
            <span className={`${styles.tag} ${styles[tagClass]}`}>{tagLabel}</span>
            <div className={styles.title}>{title}</div>
            <div className={styles.meta}>
              <span className={styles.date}>{date}</span>
              <button className={styles.readMore}>Leer más</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}