import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/app/Sidebar';
import Topbar from '../components/app/Topbar';
import { fetchAuth } from '../services/authService';
import styles from './Perfil.module.css';

const CURRENT_USER = localStorage.getItem('username') || 'user';
const CLOUD_NAME = 'digxeqcff';
const UPLOAD_PRESET = 'access_denied';

const ROLE_MAP = {
  3: { label: 'Admin', css: 'roleAdmin' },
  2: { label: 'Auditor', css: 'roleAuditor' },
  1: { label: 'User', css: 'roleUser' },
};

export default function Perfil() {
  const { username } = useParams();
  const navigate = useNavigate();
  const isOwn = username === CURRENT_USER;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ bio: '', signature: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadProfile = () => {
    setLoading(true);
    setError('');
    fetchAuth(`/api/perfil/${username}`)
      .then(res => {
        setProfile(res.data);
        setForm({
          bio: res.data.bio || '',
          signature: res.data.signature || '',
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) return null;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    return data.secure_url;
  };

  const handleSave = async () => {
  setSaving(true);

  let profilePicture = profile?.profile_picture;
  if (imageFile) {
    profilePicture = await uploadToCloudinary();
  }

  await fetchAuth('/api/perfil', {
    method: 'PUT',
    body: JSON.stringify({
      bio: form.bio,
      signature: form.signature,
      profile_picture: profilePicture,
    }),
  });

  setSaving(false);
  setShowEdit(false);
  setImageFile(null);
  setImagePreview(null);
  loadProfile();
};

  const role = ROLE_MAP[profile?.role_id] || ROLE_MAP[1];
  const initials = (profile?.username || 'U').slice(0, 2).toUpperCase();
  const roleAvatarClass = profile?.role_id == 3 ? styles.avatarAdmin 
    : profile?.role_id == 2 ? styles.avatarAuditor 
    : '';

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
            <div className={`${styles.avatar} ${roleAvatarClass}`}>
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
                  <div
                    key={r.id}
                    className={styles.reportItem}
                    onClick={() => navigate(`/reportes/${r.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.reportTitle}>{r.title}</div>
                    <div className={styles.reportMeta}>{r.created_at} · {r.comment_count || 0} comentarios</div>
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

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Foto de perfil
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ color: 'var(--text-secondary)', fontSize: 12 }}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginTop: 8 }} />
              )}
            </div>

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
              <button className={styles.btnCancel} onClick={() => { setShowEdit(false); setImageFile(null); setImagePreview(null); }}>Cancelar</button>
              <button className={styles.btnSave} onClick={handleSave} disabled={saving || uploading}>
                {uploading ? 'Subiendo...' : saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}