import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/app/Sidebar';
import Topbar from '../components/app/Topbar';
import { getReporte, getComentarios, crearComentario, eliminarComentario, eliminarReporte } from '../services/reportService';
import { isAdmin } from '../services/authService';
import styles from './ReporteDetalle.module.css';

export default function ReporteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reporte, setReporte] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username') || 'user';
  const admin = isAdmin();

  const load = async () => {
    setLoading(true);
    try {
      const resReporte = await getReporte(id);
      const resComentarios = await getComentarios(id);
      const reporteData = resReporte.data || resReporte;
      const comentariosData = resComentarios.data || resComentarios || [];
      setReporte(reporteData);
      setComentarios(comentariosData);
    } catch {
      setReporte(null);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleComment = async () => {
    if (!commentBody.trim()) return;
    await crearComentario(id, commentBody);
    setCommentBody('');
    const resComentarios = await getComentarios(id);
    setComentarios(resComentarios.data || resComentarios || []);
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('¿Eliminar comentario?')) return;
    await eliminarComentario(commentId);
    const resComentarios = await getComentarios(id);
    setComentarios(resComentarios.data || resComentarios || []);
  };

  const handleDeleteReporte = async () => {
    if (!confirm('¿Eliminar este reporte y todos sus comentarios?')) return;
    await eliminarReporte(id);
    navigate('/reportes');
  };

  const canDeleteReporte = admin || (reporte && reporte.author_name === username);

  const getRoleClass = (roleId, base, adminClass, auditorClass) => {
    if (roleId == 3) return `${base} ${adminClass}`;
    if (roleId == 2) return `${base} ${auditorClass}`;
    return base;
  };

  if (loading) {
    return <div className={styles.page}><Sidebar /><div className={styles.main}><Topbar pathname="/reportes" username={username} /><div className={styles.content}><p className={styles.empty}>Cargando...</p></div></div></div>;
  }

  if (!reporte) {
    return <div className={styles.page}><Sidebar /><div className={styles.main}><Topbar pathname="/reportes" username={username} /><div className={styles.content}><p className={styles.empty}>Reporte no encontrado.</p></div></div></div>;
  }

  const initials = (reporte.author_name || 'U').slice(0, 2).toUpperCase();

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar pathname="/reportes" username={username} />
        <div className={styles.content}>
          <button className={styles.back} onClick={() => navigate('/reportes')}>← Volver</button>

          <div className={styles.card}>
            <div className={styles.author}>
              <Link
                to={`/perfil/${reporte.author_name}`}
                className={getRoleClass(reporte.author_role, styles.avatar, styles.avatarAdmin, styles.avatarAuditor)}
              >
                {reporte.author_avatar ? <img src={reporte.author_avatar} alt="" /> : initials}
              </Link>
              <span className={styles.authorName}>@{reporte.author_name}</span>
              <span className={styles.date}>{reporte.created_at}</span>
            </div>
            <h1 className={styles.title}>{reporte.title}</h1>
            <p className={styles.body}>{reporte.body}</p>

            {canDeleteReporte && (
              <button
                onClick={handleDeleteReporte}
                style={{
                  background: 'none', border: '1px solid var(--accent-red)', color: 'var(--accent-red)',
                  fontSize: 11, padding: '4px 12px', borderRadius: 4, cursor: 'pointer', marginTop: 12,
                }}
              >
                Borrar
              </button>
            )}
          </div>

          <h3 className={styles.sectionTitle}>Comentarios ({comentarios.length})</h3>

          {comentarios.length === 0 && <p className={styles.empty}>No hay comentarios.</p>}

          {comentarios.map(c => {
            const cInitials = (c.author_name || 'U').slice(0, 2).toUpperCase();
            const canDeleteComment = admin || c.author_name === username;
            return (
              <div key={c.id} className={styles.comment}>
                <Link
                  to={`/perfil/${c.author_name}`}
                  className={getRoleClass(c.author_role, styles.commentAvatar, styles.commentAvatarAdmin, styles.commentAvatarAuditor)}
                >
                  {c.author_avatar ? <img src={c.author_avatar} alt="" /> : cInitials}
                </Link>
                <div className={styles.commentBody}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>@{c.author_name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={styles.date}>{c.created_at}</span>
                      {canDeleteComment && (
                        <button className={styles.deleteBtn} onClick={() => handleDeleteComment(c.id)}>Borrar</button>
                      )}
                    </div>
                  </div>
                  <p className={styles.commentText}>{c.body}</p>
                </div>
              </div>
            );
          })}

          <div className={styles.commentForm}>
            <input
              className={styles.commentInput}
              placeholder="Escribí un comentario..."
              value={commentBody}
              onChange={e => setCommentBody(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleComment(); }}
            />
            <button className={styles.back} onClick={handleComment} style={{ background: 'var(--accent)', color: '#fff', border: 'none' }}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
}