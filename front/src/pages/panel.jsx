import { useState, useEffect } from 'react';
import Sidebar from '../components/app/Sidebar';
import Topbar from '../components/app/Topbar';
import { isAdmin } from '../services/authService';
import { getNoticias, crearNoticia, editarNoticia, eliminarNoticia } from '../services/newsService';
import styles from './Panel.module.css';

const TABS = [
  { key: 'news', label: 'Noticias' },
  { key: 'users', label: 'Usuarios', adminOnly: true },
  { key: 'terminal', label: 'Terminal', adminOnly: true },
];

const CLOUD_NAME = 'digxeqcff';
const UPLOAD_PRESET = 'access_denied';
const API = 'http://localhost:8080';

export default function Panel() {
  const [tab, setTab] = useState('news');
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [terminalCmds, setTerminalCmds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', body: '', category: 'news' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  const [terminalForm, setTerminalForm] = useState({
    command: '',
    description: '',
    output_type: 'plain',
    payload: '',
    is_active: true,
    sort_order: 0,
  });
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState(null);

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
      const res = await fetch(`${API}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const parsed = (data.data || []).map(u => ({
        ...u,
        role_id: parseInt(u.role_id),
        badge_id: parseInt(u.badge_id || 1),
        is_banned: parseInt(u.is_banned || 0),
        is_readonly: parseInt(u.is_readonly || 0),
      }));
      setUsers(parsed);
    } catch (e) {
      setUsers([]);
    }
    setLoading(false);
  };

  const loadTerminal = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/terminal-commands`);
      const data = await res.json();
      setTerminalCmds(data.data || []);
    } catch (e) {
      setTerminalCmds([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tab === 'news') loadNews();
    else if (tab === 'users') loadUsers();
    else if (tab === 'terminal') loadTerminal();
  }, [tab]);

  const resetForm = () => {
    setForm({ title: '', body: '', category: 'news' });
    setShowModal(false);
    setEditing(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const resetTerminalForm = () => {
    setTerminalForm({ command: '', description: '', output_type: 'plain', payload: '', is_active: true, sort_order: 0 });
    setShowTerminalModal(false);
    setEditingTerminal(null);
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) return null;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', imageFile);
    fd.append('upload_preset', UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: fd,
    });
    const data = await res.json();
    setUploading(false);
    return data.secure_url;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      alert('Título y contenido son obligatorios');
      return;
    }
    setSaving(true);
    try {
      let imageUrl = null;
      if (imageFile) imageUrl = await uploadToCloudinary();
      await crearNoticia({ ...form, image_url: imageUrl });
      resetForm();
      await loadNews();
    } catch (e) {
      alert(e.message || 'Error al crear');
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
      let imageUrl = editing?.image_url || null;
      if (imageFile) imageUrl = await uploadToCloudinary();
      await editarNoticia(editing.id, { ...form, image_url: imageUrl });
      resetForm();
      await loadNews();
    } catch (e) {
      alert(e.message || 'Solo podés editar tus propias noticias');
    }
    setSaving(false);
  };

  const handleDelete = async (id, authorName) => {
    if (!admin && authorName !== username) {
      alert('Solo podés eliminar tus propias noticias');
      return;
    }
    if (!confirm('¿Eliminar esta noticia?')) return;
    await eliminarNoticia(id);
    await loadNews();
  };

  const openEdit = (n) => {
    setEditing(n);
    setForm({ title: n.title, body: n.body, category: n.category });
    setImagePreview(n.image_url || null);
  };

  const handleRoleChange = async (userId, roleId) => {
    await fetch(`${API}/api/admin/usuarios/${userId}/rol`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role_id: roleId }),
    });
    await loadUsers();
  };

  const handleBadgeChange = async (userId, badgeId) => {
    await fetch(`${API}/api/admin/usuarios/${userId}/badge`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ badge_id: badgeId }),
    });
    await loadUsers();
  };

  const handleToggleBan = async (userId) => {
    await fetch(`${API}/api/admin/usuarios/${userId}/ban`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    await loadUsers();
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleTerminalSave = async () => {
    if (!terminalForm.command.trim() || !terminalForm.description.trim()) {
      alert('Comando y descripción son obligatorios');
      return;
    }
    setSaving(true);
    const isTextType = terminalForm.output_type === 'plain' || terminalForm.output_type === 'ascii';
    const payload = isTextType
      ? { text: terminalForm.payload }
      : JSON.parse(terminalForm.payload || '{}');

    const body = {
      command: terminalForm.command,
      description: terminalForm.description,
      output_type: terminalForm.output_type,
      payload,
      is_active: terminalForm.is_active,
      sort_order: terminalForm.sort_order,
    };

    const url = editingTerminal
      ? `${API}/api/terminal-commands/${editingTerminal.id}`
      : `${API}/api/terminal-commands`;
    const method = editingTerminal ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      resetTerminalForm();
      await loadTerminal();
    } catch (e) {
      alert('Error al guardar comando');
    }
    setSaving(false);
  };

  const handleTerminalDelete = async (id) => {
    if (!confirm('¿Eliminar este comando?')) return;
    await fetch(`${API}/api/terminal-commands/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await loadTerminal();
  };

  const openTerminalEdit = (cmd) => {
    setEditingTerminal(cmd);
    const payload = cmd.payload?.lines
      ? cmd.payload.lines.map(l => l.text).join('\n')
      : JSON.stringify(cmd.payload, null, 2);
    setTerminalForm({
      command: cmd.command,
      description: cmd.description,
      output_type: cmd.output_type,
      payload,
      is_active: parseInt(cmd.is_active) === 1,
      sort_order: parseInt(cmd.sort_order) || 0,
    });
    setShowTerminalModal(true);
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

          {/* ========== NOTICIAS ========== */}
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
                      <th>Autor</th>
                      <th>Categoría</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map(n => (
                      <tr key={n.id}>
                        <td>{n.title}</td>
                        <td style={{ color: 'var(--accent)', fontSize: 12 }}>{n.author_name}</td>
                        <td>{n.category}</td>
                        <td>{n.created_at}</td>
                        <td className={styles.actions}>
                          <button className={styles.btnSm} onClick={() => openEdit(n)}>Editar</button>
                          <button
                            onClick={() => handleDelete(n.id, n.author_name)}
                            className={`${styles.btnSm} ${styles.btnSmDanger}`}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* ========== USUARIOS ========== */}
          {tab === 'users' && admin && (
            <>
              <div style={{ marginBottom: 12, marginTop: 16 }}>
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', padding: '6px 12px', borderRadius: 4,
                    fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none', width: 200,
                  }}
                />
              </div>

              {loading ? (
                <p className={styles.empty}>Cargando...</p>
              ) : filteredUsers.length === 0 ? (
                <p className={styles.empty}>No hay usuarios.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Badge</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`${styles.badge} ${u.role_id === 3 ? styles.badgeAdmin : u.role_id === 2 ? styles.badgeAuditor : styles.badgeUser}`}>
                            {u.role_id === 3 ? 'Admin' : u.role_id === 2 ? 'Auditor' : 'User'}
                          </span>
                        </td>
                        <td>
                          <select
                            value={u.badge_id || 1}
                            onChange={(e) => handleBadgeChange(u.id, parseInt(e.target.value))}
                            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-sans)' }}
                          >
                            <option value={1}>Newbie</option>
                            <option value={2}>Hacker</option>
                            <option value={3}>Elite</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleBan(u.id)}
                            className={`${styles.btnSm} ${u.is_banned ? '' : styles.btnSmDanger}`}
                          >
                            {u.is_banned ? 'Desbanear' : 'Banear'}
                          </button>
                        </td>
                        <td className={styles.actions}>
                          <select
                            value={u.role_id}
                            onChange={(e) => handleRoleChange(u.id, parseInt(e.target.value))}
                            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-sans)' }}
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

          {/* ========== TERMINAL ========== */}
          {tab === 'terminal' && admin && (
            <>
              <div className={styles.header} style={{ marginTop: 16 }}>
                <span />
                <button className={styles.btnPrimary} onClick={() => {
                  resetTerminalForm();
                  setShowTerminalModal(true);
                }}>
                  + Nuevo comando
                </button>
              </div>

              {loading ? (
                <p className={styles.empty}>Cargando...</p>
              ) : terminalCmds.length === 0 ? (
                <p className={styles.empty}>No hay comandos en la terminal.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Comando</th>
                      <th>Descripción</th>
                      <th>Tipo</th>
                      <th>Activo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {terminalCmds.map(cmd => (
                      <tr key={cmd.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{cmd.command}</td>
                        <td>{cmd.description}</td>
                        <td>{cmd.output_type}</td>
                        <td>{parseInt(cmd.is_active) === 1 ? '✅' : '❌'}</td>
                        <td className={styles.actions}>
                          <button className={styles.btnSm} onClick={() => openTerminalEdit(cmd)}>Editar</button>
                          <button
                            className={`${styles.btnSm} ${styles.btnSmDanger}`}
                            onClick={() => handleTerminalDelete(cmd.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* ========== MODAL NOTICIAS ========== */}
          {(showModal || editing) && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={resetForm}>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, width: '100%', maxWidth: 500 }} onClick={e => e.stopPropagation()}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
                  {editing ? 'Editar noticia' : 'Nueva noticia'}
                </h2>
                <input placeholder="Título" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 13, marginBottom: 10, fontFamily: 'var(--font-sans)', outline: 'none' }} />
                <textarea placeholder="Contenido" value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={5}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 13, marginBottom: 10, fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical' }} />

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Imagen (opcional)</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ color: 'var(--text-secondary)', fontSize: 12 }} />
                  {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 4, marginTop: 8 }} />}
                </div>

                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 13, marginBottom: 16, fontFamily: 'var(--font-sans)', outline: 'none' }}>
                  <option value="news">Noticia</option>
                  <option value="critical">Crítico</option>
                  <option value="exploit">Exploit</option>
                  <option value="tool">Herramienta</option>
                  <option value="cve">CVE</option>
                </select>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button className={styles.btnSm} onClick={resetForm}>Cancelar</button>
                  <button className={styles.btnPrimary} onClick={editing ? handleEdit : handleCreate} disabled={saving || uploading} style={{ opacity: (saving || uploading) ? 0.6 : 1 }}>
                    {uploading ? 'Subiendo...' : saving ? 'Guardando...' : editing ? 'Guardar' : 'Crear'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========== MODAL TERMINAL ========== */}
          {showTerminalModal && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={resetTerminalForm}>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, width: '100%', maxWidth: 600 }} onClick={e => e.stopPropagation()}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
                  {editingTerminal ? 'Editar comando' : 'Nuevo comando'}
                </h2>

                <input placeholder="Comando (ej: show tables;)" value={terminalForm.command}
                  onChange={e => setTerminalForm(f => ({ ...f, command: e.target.value }))}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 13, marginBottom: 10, fontFamily: 'var(--font-mono)', outline: 'none' }} />

                <input placeholder="Descripción (ej: Lista las entidades)" value={terminalForm.description}
                  onChange={e => setTerminalForm(f => ({ ...f, description: e.target.value }))}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 13, marginBottom: 10, fontFamily: 'var(--font-sans)', outline: 'none' }} />

                <select value={terminalForm.output_type}
                  onChange={e => setTerminalForm(f => ({ ...f, output_type: e.target.value }))}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 13, marginBottom: 10, fontFamily: 'var(--font-sans)', outline: 'none' }}>
                  <option value="plain">Texto plano</option>
                  <option value="ascii">ASCII</option>
                  <option value="table">Tabla</option>
                  <option value="list">Lista</option>
                  <option value="keyval">Clave-Valor</option>
                </select>

                {(terminalForm.output_type === 'plain' || terminalForm.output_type === 'ascii') ? (
                  <textarea placeholder="Texto a mostrar" value={terminalForm.payload}
                    onChange={e => setTerminalForm(f => ({ ...f, payload: e.target.value }))}
                    rows={6}
                    style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono)', outline: 'none', resize: 'vertical', marginBottom: 10 }} />
                ) : (
                  <textarea placeholder="Payload (JSON)" value={terminalForm.payload}
                    onChange={e => setTerminalForm(f => ({ ...f, payload: e.target.value }))}
                    rows={8}
                    style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono)', outline: 'none', resize: 'vertical', marginBottom: 10 }} />
                )}

                <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={terminalForm.is_active}
                      onChange={e => setTerminalForm(f => ({ ...f, is_active: e.target.checked }))} />
                    Activo
                  </label>
                  <input type="number" placeholder="Orden" value={terminalForm.sort_order}
                    onChange={e => setTerminalForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                    style={{ width: 80, background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button className={styles.btnSm} onClick={resetTerminalForm}>Cancelar</button>
                  <button className={styles.btnPrimary} onClick={handleTerminalSave} disabled={saving}>
                    {saving ? 'Guardando...' : editingTerminal ? 'Guardar' : 'Crear'}
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