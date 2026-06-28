import { useParams } from 'react-router-dom';
import Sidebar from '../components/app/Sidebar';
import Topbar from '../components/app/Topbar';
import styles from './Perfil.module.css';

const MOCK = {
  pedro: {
    username: 'pedro',
    bio: 'Security researcher enfocado en pentesting y bug bounty.',
    signature: 'Trust but verify',
    badge: 'Newbie',
    reports: [
      { id: 1, title: 'SQL Injection en panel de login', date: '24 jun 2026', status: 'Verificado' },
      { id: 2, title: 'XSS reflejado en campo de búsqueda', date: '15 jun 2026', status: 'Verificado' },
      { id: 3, title: 'IDOR en API de pedidos', date: '10 jun 2026', status: 'En revisión' },
    ],
    skills: ['Web Security', 'OSINT', 'Python', 'Burp Suite'],
    activity: [
      { text: 'Publicó reporte sobre SQL Injection', dot: 'green' },
      { text: 'Comentó en noticia sobre APT29', dot: 'blue' },
      { text: 'Subió de rango a Newbie', dot: 'orange' },
      { text: 'Publicó reporte XSS reflejado', dot: 'green' },
    ],
    stats: { reports: 47, cves: 12, points: 389, rank: 'Senior' },
  },
};

const CURRENT_USER = localStorage.getItem('username') || 'user';

export default function Perfil() {
  const { username } = useParams();
  const isOwn = username === CURRENT_USER;

  const profile = MOCK[username] || {
    username,
    bio: 'Perfil no encontrado.',
    signature: '',
    badge: 'Newbie',
    reports: [],
    skills: [],
    activity: [],
    stats: { reports: 0, cves: 0, points: 0, rank: 'Newbie' },
  };

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar pathname={`/perfil/${username}`} username={CURRENT_USER} />

        <div className={styles.content}>
          {/* HEADER */}
          <div className={styles.header}>
            <div className={styles.avatar}>
              {profile.username.slice(0, 2).toUpperCase()}
            </div>
            <div className={styles.info}>
              <h1 className={styles.name}>{profile.username}</h1>
              <div className={styles.username}>@{profile.username} · Miembro desde 2026</div>
              <p className={styles.bio}>{profile.bio}</p>
              {profile.signature && (
                <p className={styles.signature}>"{profile.signature}"</p>
              )}
              <div className={styles.badge}>
                <span className={styles.badgeDot} />
                {profile.badge}
              </div>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{profile.stats.reports}</span>
                  Reportes
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{profile.stats.cves}</span>
                  CVEs
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{profile.stats.points}</span>
                  Puntos
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue} style={{ color: '#ffa94d' }}>{profile.stats.rank}</span>
                  Rango
                </div>
              </div>
            </div>
            {isOwn && <button className={styles.editBtn}>Editar perfil</button>}
          </div>

          {/* GRID */}
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>{isOwn ? 'Mis reportes' : 'Reportes públicos'}</h3>
              {profile.reports.length === 0 ? (
                <p className={styles.empty}>No hay reportes.</p>
              ) : (
                profile.reports.map(r => (
                  <div key={r.id} className={styles.reportItem}>
                    <div className={styles.reportTitle}>{r.title}</div>
                    <div className={styles.reportMeta}>{r.date} · {r.status}</div>
                  </div>
                ))
              )}
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Actividad reciente</h3>
              {profile.activity.map((a, i) => (
                <div key={i} className={styles.activity}>
                  <div className={`${styles.dot} ${a.dot === 'blue' ? styles.dotBlue : a.dot === 'orange' ? styles.dotOrange : ''}`} />
                  {a.text}
                </div>
              ))}
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Especialidades</h3>
              {profile.skills.map(s => (
                <span key={s} className={styles.skill}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}