import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/app/Sidebar';
import Topbar from '../components/app/Topbar';
import ReportCard from '../components/app/ReportCard';
import { getReportes, crearReporte, eliminarReporte } from '../services/reportService';
import { isAdmin } from '../services/authService';
import styles from './Reportes.module.css';

export default function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const navigate = useNavigate();

  const username = localStorage.getItem('username') || 'user';
  const admin = isAdmin();

  const load = async () => {
    setLoading(true);
    try { const res = await getReportes(); setReportes(res.data || []); }
    catch { setReportes([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    await crearReporte(form);
    setSaving(false);
    setShowModal(false);
    setForm({ title: '', body: '' });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este reporte?')) return;
    await eliminarReporte(id);
    load();
  };

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar pathname="/reportes" username={username} />
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.title}>Reportes</span>
            <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>
              + Nuevo reporte
            </button>
          </div>

          {loading ? (
            <p className={styles.empty}>Cargando...</p>
          ) : reportes.length === 0 ? (
            <p className={styles.empty}>No hay reportes todavía.</p>
          ) : (
            <div className={styles.feed}>
              {reportes.map(r => (
                <div key={r.id} onClick={() => navigate(`/reportes/${r.id}`)}>
                  <ReportCard report={r} isAdmin={admin} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, width: '100%', maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Nuevo reporte</h2>
            <input placeholder="Título" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 13, marginBottom: 10, fontFamily: 'var(--font-sans)', outline: 'none' }} />
            <textarea placeholder="Descripción" value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={5}
              style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 4, fontSize: 13, marginBottom: 16, fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 12, padding: '6px 14px', borderRadius: 4, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleCreate} disabled={saving} className={styles.btnPrimary}>{saving ? 'Creando...' : 'Crear'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}