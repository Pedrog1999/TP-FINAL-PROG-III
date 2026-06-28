import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/app/Sidebar';
import Topbar from '../components/app/Topbar';
import { fetchAuth } from '../services/authService';
import styles from './Perfil.module.css';

const CURRENT_USER = localStorage.getItem('username') || 'user';

const ROLE_MAP = {
  3: { label: 'Admin', css: 'roleAdmin' },
  2: { label: 'Auditor', css: 'roleAuditor' },
  1: { label: 'User', css: 'roleUser' },
};

export default function Perfil() {
  const { username } = useParams();
  const isOwn = username === CURRENT_USER;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ bio: '', signature: '', profile_picture: '' });

  const loadProfile = () => {
    setLoading(true);
    setError('');
    fetchAuth(`/api/perfil/${username}`)
      .then(res => {
        setProfile(res.data);
        setForm({
          bio: res.data.bio || '',
          signature: res.data.signature || '',
          profile_picture: res.data.profile_picture || '',
        });
      })
      .catch(() => setError('Perfil no encontrado'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setError('');
    setProfile(null);
    loadProfile();
  }, [username]);

  const handleSave = async () => {
    setSaving(true);
    await fetchAuth('/api/perfil', {
      method: 'PUT',
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowEdit(false);
    loadProfile();
  };

  const role = ROLE_MAP[profile?.role_id] || ROLE_MAP[1];
  const initials = (profile?.username || 'U').slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className={styles.page}>
        <Sidebar />
        <div className={styles.main}>
          <Topbar pathname={`/perfil/${username}`} username={CURRENT_USER} />
          <div className={styles.content}>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={styles.page}>
        <Sidebar />
        <div className={styles.main}>
          <Topbar pathname={`/perfil/${username}`} username={CURRENT_USER} />
          <div className={styles.content}>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>{error || 'Perfil no encontrado'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar pathname={`/perfil/${username}`} username={CURRENT_USER} />

        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.avatar}>
              {profile.profile_picture ? (
                <img src={profile.profile_picture} alt={profile.username} />
              ) : (
                initials
              )}
            </div>

            <div className={styles.info}>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>{profile.username}</h1>
                <span className={`${styles.roleBadge} ${styles[role.css]}`}>
                  <span className={styles.roleDot} />
                  {role.label}
                </span>
              </div>
              <div className={styles.username}>@{profile.username}</div>
              <p className={styles.bio}>{profile.bio || 'Sin biografía'}</p>
              {profile.signature && (
                <p className={styles.signature}>{profile.signature}</p>
              )}

              <div className={styles.badgeRow}>
                <span className={styles.levelBadge}>
                  <span className={styles.levelDot} />
                  {profile.badge || 'Newbie'}
                </span>
              </div>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{profile.stats?.reports || 0}</span>
                  Reportes
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{profile.stats?.points || 0}</span>
                  Puntos
                </div>
              </div>
            </div>

            {isOwn && (
              <button className={styles.editBtn} onClick={() => setShowEdit(true)}>
                Editar perfil
              </button>
            )}
          </div>

          <div className={styles.grid}>
            <div className={`${styles.card} ${styles.cardFull}`}>
              <h3 className={styles.cardTitle}>
                {isOwn ? 'Mis reportes' : 'Reportes públicos'}
              </h3>
              {(!profile.reports || profile.reports.length === 0) ? (
                <p className={styles.empty}>No hay reportes todavía.</p>
              ) : (
                profile.reports.map(r => (
                  <div key={r.id} className={styles.reportItem}>
                    <div className={styles.reportTitle}>{r.title}</div>
                    <div className={styles.reportMeta}>{r.date || r.created_at} · {r.status || 'Activo'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className={styles.modalOverlay} onClick={() => setShowEdit(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Editar perfil</h2>

            <input
              className={styles.input}
              placeholder="URL de foto de perfil"
              value={form.profile_picture}
              onChange={e => setForm(f => ({ ...f, profile_picture: e.target.value }))}
            />
            <input
              className={styles.input}
              placeholder="Biografía"
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            />
            <input
              className={styles.input}
              placeholder="Firma"
              value={form.signature}
              onChange={e => setForm(f => ({ ...f, signature: e.target.value }))}
            />

            <div className={styles.btnRow}>
              <button className={styles.btnCancel} onClick={() => setShowEdit(false)}>Cancelar</button>
              <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}