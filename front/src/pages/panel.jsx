import { useState, useEffect } from 'react';
import Sidebar from '../components/app/Sidebar';
import Topbar from '../components/app/Topbar';
import { isAdmin } from '../services/authService';
import { getNoticias, crearNoticia, editarNoticia, eliminarNoticia } from '../services/newsService';
import styles from './Panel.module.css';

const TABS = [
  { key: 'news', label: 'Noticias' },
  { key: 'users', label: 'Usuarios', adminOnly: true },
];

export default function Panel() {
  const [tab, setTab] = useState('news');
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', body: '', category: 'news' });

  const username = localStorage.getItem('username') || 'user';
  const token = localStorage.getItem('token') || '';
  const admin = isAdmin();

  const loadNews = async () => {
    setLoading(true);
    const res = await getNoticias();
    setNews(res.data || []);
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.data || []);
    } catch (e) {
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tab === 'news') loadNews();
    else loadUsers();
  }, [tab]);

  const resetForm = () => {
    setForm({ title: '', body: '', category: 'news' });
    setShowModal(false);
    setEditing(null);
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      alert('Título y contenido son obligatorios');
      return;
    }
    setSaving(true);
    try {
      await crearNoticia(form);
      resetForm();
      await loadNews();
    } catch (e) {
      alert('Error al crear');
    }
    setSaving(false);
  };

  const handleEdit = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      alert('Título y contenido son obligatorios');
      return;
    }
    setSaving(true);
    try {
      await editarNoticia(editing.id, form);
      resetForm();
      await loadNews();
    } catch (e) {
      alert('Error al editar');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta noticia?')) return;
    await eliminarNoticia(id);
    await loadNews();
  };

  const openEdit = (n) => {
    setEditing(n);
    setForm({ title: n.title, body: n.body, category: n.category });
  };

  const handleRoleChange = async (userId, roleId) => {
    await fetch(`http://localhost:8080/api/admin/usuarios/${userId}/rol`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role_id: roleId }),
    });
    await loadUsers();
  };

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar pathname="/panel" username={username} />
        <div className={styles.content}>
          <h1 className={styles.title}>Panel de {admin ? 'Administrador' : 'Auditor'}</h1>

          <div className={styles.tabs}>
            {TABS.filter(t => !t.adminOnly || admin).map(t => (
              <button
                key={t.key}
                className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'news' && (
            <>
              <div className={styles.header} style={{ marginTop: 16 }}>
                <span />
                <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>
                  + Nueva noticia
                </button>
              </div>

              {loading ? (
                <p className={styles.empty}>Cargando...</p>
              ) : news.length === 0 ? (
                <p className={styles.empty}>No hay noticias.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Categoría</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map(n => (
                      <tr key={n.id}>
                        <td>{n.title}</td>
                        <td>{n.category}</td>
                        <td>{n.created_at}</td>
                        <td className={styles.actions}>
                          <button className={styles.btnSm} onClick={() => openEdit(n)}>Editar</button>
                          {admin && (
                            <button className={`${styles.btnSm} ${styles.btnSmDanger}`} onClick={() => handleDelete(n.id)}>
                              Eliminar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {tab === 'users' && admin && (
            <>
              {loading ? (
                <p className={styles.empty}>Cargando...</p>
              ) : users.length === 0 ? (
                <p className={styles.empty}>No hay usuarios.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`${styles.badge} ${u.role_id === 3 ? styles.badgeAdmin : u.role_id === 2 ? styles.badgeAuditor : styles.badgeUser}`}>
                            {u.role_id === 3 ? 'Admin' : u.role_id === 2 ? 'Auditor' : 'User'}
                          </span>
                        </td>
                        <td className={styles.actions}>
                          <select
                            value={u.role_id}
                            onChange={(e) => handleRoleChange(u.id, parseInt(e.target.value))}
                            style={{
                              background: 'var(--bg-tertiary)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-primary)',
                              padding: '3px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontFamily: 'var(--font-sans)',
                            }}
                          >
                            <option value={1}>User</option>
                            <option value={2}>Auditor</option>
                            <option value={3}>Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* MODAL */}
          {(showModal || editing) && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.85)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }} onClick={resetForm}>
              <div style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 8, padding: 24, width: '100%', maxWidth: 500,
              }} onClick={e => e.stopPropagation()}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
                  {editing ? 'Editar noticia' : 'Nueva noticia'}
                </h2>
                <input
                  placeholder="Título"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  style={{
                    width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 13,
                    marginBottom: 10, fontFamily: 'var(--font-sans)', outline: 'none',
                  }}
                />
                <textarea
                  placeholder="Contenido"
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  rows={5}
                  style={{
                    width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 13,
                    marginBottom: 10, fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical',
                  }}
                />
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={{
                    width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 13,
                    marginBottom: 16, fontFamily: 'var(--font-sans)', outline: 'none',
                  }}
                >
                  <option value="news">Noticia</option>
                  <option value="critical">Crítico</option>
                  <option value="exploit">Exploit</option>
                  <option value="tool">Herramienta</option>
                  <option value="cve">CVE</option>
                </select>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button className={styles.btnSm} onClick={resetForm}>Cancelar</button>
                  <button
                    className={styles.btnPrimary}
                    onClick={editing ? handleEdit : handleCreate}
                    disabled={saving}
                    style={{ opacity: saving ? 0.6 : 1 }}
                  >
                    {saving ? 'Guardando...' : editing ? 'Guardar' : 'Crear'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}