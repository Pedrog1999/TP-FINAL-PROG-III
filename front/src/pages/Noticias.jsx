export default function Noticias() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#00ff41',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Share Tech Mono', monospace",
    }}>
      <h1 style={{ fontSize: '2rem', letterSpacing: '4px', textShadow: '0 0 20px #00ff41' }}>
        [ACCESO CONCEDIDO]
      </h1>
      <p style={{ color: 'rgba(0,255,65,0.6)', marginTop: '1rem' }}>
        Bienvenido al foro. Sección en construcción.
      </p>
      <button
        onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}
        style={{
          marginTop: '1.5rem',
          padding: '0.5rem 1.5rem',
          background: 'transparent',
          border: '1px solid #00ff41',
          color: '#00ff41',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}