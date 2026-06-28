import styles from './NewsDetail.module.css';

export default function NewsDetail({ news, onBack }) {
  return (
    <>
      <button className={styles.backBtn} onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al feed
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          <span className={`${styles.tag} ${styles.tagRed}`}>CRÍTICO · CVE-2024-8821</span>
          <div className={styles.image}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <h1 className={styles.title}>{news.title}</h1>
          <div className={styles.meta}>
            <span>{news.date}</span>
            <div className={styles.separator} />
            <span>{news.author}</span>
            <div className={styles.separator} />
            <span>{news.views?.toLocaleString()} lecturas</span>
          </div>
        </div>

        <div className={styles.body}>
          {news.body?.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </>
  );
}