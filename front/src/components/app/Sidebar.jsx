import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  {
    path: '/noticias',
    label: 'Noticias',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
    ),
  },
  {
    path: '/reportes',
    label: 'Reportes',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    ),
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const roleId = localStorage.getItem('role_id') || '1';
  const isAuditor = roleId === '2';
  const isAdmin = roleId === '3';
  const showPanel = isAuditor || isAdmin;

  return (
    <aside className={styles.sidebar}>
      <Link to="/noticias" className={styles.logo}>
        <div className={styles.logoText}>[<span>ACCESS</span>_DENIED]</div>
        <div className={styles.logoSub}>SECURITY HUB</div>
      </Link>

      <div className={styles.divider} />
      <div className={styles.sectionLabel}>Principal</div>

      {NAV_ITEMS.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`${styles.navItem} ${pathname === item.path ? styles.navItemActive : ''}`}
        >
          <span className={styles.navIcon}>{item.icon}</span>
          {item.label}
        </Link>
      ))}

      <div className={styles.divider} />

      {showPanel && (
        <>
          <div className={styles.sectionLabel}>
            {isAdmin ? 'Administración' : 'Auditoría'}
          </div>
          <Link
            to="/panel"
            className={`${styles.navItem} ${pathname === '/panel' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </span>
            Panel {isAdmin ? 'Admin' : 'Auditor'}
          </Link>
        </>
      )}

      <div className={styles.bottom}>
        <button
          className={styles.navItem}
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          style={{ width: '100%' }}
        >
          <span className={styles.navIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}