import styles from './NewsModal.module.css';

export default function NewsModal({ title, body, author, date, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.body}>{body}</p>
        <div className={styles.meta}>
          <span>{author}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}