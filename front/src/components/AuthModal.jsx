import { useState, useEffect } from 'react';

export default function AuthModal({ initialTab = 'login', onClose }) {
  const [tab, setTab]   = useState(initialTab);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Sync tab when prop changes (open from different buttons)
  useEffect(() => { setTab(initialTab); setError(''); }, [initialTab]);

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    // ── CONECTAR AL BACK ───────────────────────────────────────
    // Reemplazar con tu endpoint real cuando el back esté listo.
    // Ejemplo:
    //
    // const endpoint = tab === 'login'
    //   ? 'http://localhost:8000/api/auth/login'
    //   : 'http://localhost:8000/api/auth/register';
    //
    // const body = tab === 'login'
    //   ? { email: form.email, password: form.password }
    //   : { username: form.username, email: form.email, password: form.password };
    //
    // try {
    //   const res  = await fetch(endpoint, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(body),
    //   });
    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data.message || 'Error desconocido');
    //   localStorage.setItem('token', data.token);
    //   onClose();
    //   // navigate('/foro');  ← cuando tengas react-router
    // } catch (err) {
    //   setError(err.message);
    // } finally {
    //   setLoading(false);
    // }
    // ──────────────────────────────────────────────────────────

    // Simulación temporal
    await new Promise(r => setTimeout(r, 1200));
    setError('Backend no conectado aún. Próximamente.');
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">
          {tab === 'login' ? 'Acceder' : 'Registrarse'}
        </h2>
        <p className="modal-sub">
          {tab === 'login'
            ? '// Introduce tus credenciales para continuar'
            : '// Crea tu cuenta en el foro'}
        </p>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Log_In
          </button>
          <button
            className={`modal-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        {tab === 'register' && (
          <div className="form-group">
            <label className="form-label" htmlFor="username">Usuario</label>
            <input
              id="username"
              className="form-input"
              name="username"
              type="text"
              placeholder="h4ck3r_username"
              value={form.username}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="form-input"
            name="email"
            type="email"
            placeholder="user@domain.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Contraseña</label>
          <input
            id="password"
            className="form-input"
            name="password"
            type="password"
            placeholder="••••••••••••"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {tab === 'register' && (
          <div className="form-group">
            <label className="form-label" htmlFor="confirm">Confirmar contraseña</label>
            <input
              id="confirm"
              className="form-input"
              name="confirm"
              type="password"
              placeholder="••••••••••••"
              value={form.confirm}
              onChange={handleChange}
            />
          </div>
        )}

        {error && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--red-alert)',
            marginBottom: '0.75rem',
            letterSpacing: '1px',
          }}>
            ✕ {error}
          </p>
        )}

        <button
          className="form-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '> Conectando...' : tab === 'login' ? '> Acceder' : '> Crear cuenta'}
        </button>

        <p className="form-footer-text">
          {tab === 'login'
            ? <>¿No tenés cuenta? <button onClick={() => setTab('register')}>Registrate</button></>
            : <>¿Ya tenés cuenta? <button onClick={() => setTab('login')}>Iniciá sesión</button></>
          }
        </p>
      </div>
    </div>
  );
}