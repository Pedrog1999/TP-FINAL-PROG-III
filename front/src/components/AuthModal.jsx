import { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authService';

export default function AuthModal({ initialTab = 'login', onClose }) {
  const [tab, setTab] = useState(initialTab);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { setTab(initialTab); setError(''); setSuccess(''); }, [initialTab]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const reset = () => {
    setForm({ username: '', email: '', password: '', confirm: '' });
    setError('');
    setSuccess('');
  };

  const switchTo = (t) => {
    setTab(t);
    reset();
  };

const handleLogin = async () => {
  if (!form.username.trim() || !form.password) {
    setError('Completá todos los campos');
    return;
  }
  setError('');
  setLoading(true);
  try {
    const data = await loginUser({ username: form.username, password: form.password });
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('username', form.username);
    setSuccess('¡Bienvenido! Redirigiendo...');
    setTimeout(() => {
      onClose();
      window.location.href = '/noticias';
    }, 800);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleRegister = async () => {
    if (!form.username.trim() || !form.email.trim() || !form.password) {
      setError('Completá todos los campos');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Email inválido');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await registerUser({ username: form.username, email: form.email, password: form.password });
      setSuccess('¡Cuenta creada! Ahora iniciá sesión');
      setTimeout(() => switchTo('login'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>

        {tab === 'login' ? (
          <>
            <h2 className="modal-title">Acceder</h2>
            <p className="modal-sub">// Introduce tus credenciales para continuar</p>

            <div className="form-group">
              <label className="form-label" htmlFor="login-username">Usuario</label>
              <input id="login-username" className="form-input" name="username"
                type="text" placeholder="h4ck3r_username"
                value={form.username} onChange={handleChange} autoComplete="off" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Contraseña</label>
              <input id="login-password" className="form-input" name="password"
                type="password" placeholder="••••••••••••"
                value={form.password} onChange={handleChange} />
            </div>

            {error && <p className="form-error">✕ {error}</p>}
            {success && <p className="form-success">✓ {success}</p>}

            <button className="form-submit" onClick={handleLogin} disabled={loading}>
              {loading ? '> Conectando...' : '> Acceder'}
            </button>

            <p className="form-footer-text">
              ¿No tenés cuenta?{' '}
              <button onClick={() => switchTo('register')}>Registrate</button>
            </p>
          </>
        ) : (
          <>
            <h2 className="modal-title">Registrarse</h2>
            <p className="modal-sub">// Crea tu cuenta en el foro</p>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">Usuario</label>
              <input id="reg-username" className="form-input" name="username"
                type="text" placeholder="h4ck3r_username"
                value={form.username} onChange={handleChange} autoComplete="off" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email</label>
              <input id="reg-email" className="form-input" name="email"
                type="email" placeholder="user@domain.com"
                value={form.email} onChange={handleChange} autoComplete="off" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Contraseña</label>
              <input id="reg-password" className="form-input" name="password"
                type="password" placeholder="••••••••••••"
                value={form.password} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirmar contraseña</label>
              <input id="reg-confirm" className="form-input" name="confirm"
                type="password" placeholder="••••••••••••"
                value={form.confirm} onChange={handleChange} />
            </div>

            {error && <p className="form-error">✕ {error}</p>}
            {success && <p className="form-success">✓ {success}</p>}

            <button className="form-submit" onClick={handleRegister} disabled={loading}>
              {loading ? '> Creando...' : '> Crear cuenta'}
            </button>

            <p className="form-footer-text">
              ¿Ya tenés cuenta?{' '}
              <button onClick={() => switchTo('login')}>Iniciá sesión</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}