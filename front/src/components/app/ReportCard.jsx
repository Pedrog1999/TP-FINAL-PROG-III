import { Link } from 'react-router-dom';
import styles from './ReportCard.module.css';

export default function ReportCard({ report, isAdmin, onDelete }) {
  const initials = (report.author_name || 'U').slice(0, 2).toUpperCase();
  const currentUser = localStorage.getItem('username');
  const canDelete = isAdmin || report.author_name === currentUser;

  const roleClass = report.author_role == 3 ? styles.avatarAdmin
    : report.author_role == 2 ? styles.avatarAuditor
    : '';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Link to={`/perfil/${report.author_name}`} className={styles.author}>
          <div className={`${styles.avatar} ${roleClass}`}>
            {report.author_avatar ? (
              <img src={report.author_avatar} alt="" />
            ) : (
              initials
            )}
          </div>
          <span className={styles.authorName}>@{report.author_name}</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={styles.date}>{report.created_at}</span>
          {canDelete && (
            <button
              className={styles.deleteBtn}
              onClick={(e) => { e.stopPropagation(); onDelete(report.id); }}
            >
              Borrar
            </button>
          )}
        </div>
      </div>
      <div className={styles.title}>{report.title}</div>
      <div className={styles.body}>
        {report.body?.length > 150 ? report.body.slice(0, 150) + '...' : report.body}
      </div>
      <div className={styles.footer}>
         {report.comment_count || 0} comentarios
      </div>
    </div>
  );
}