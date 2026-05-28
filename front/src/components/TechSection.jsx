import { useState } from 'react';
const TECHS = [
  {
    code: 'SYS-01',
    name: 'PHP',
    role: 'Backend Runtime',
    status: 'CORE',
    load: 92,
    sections: [
      { title: 'versión', tags: ['PHP 8.1'] },
      { title: 'responsabilidades', tags: ['Lógica de negocio', 'Validación', 'Respuestas JSON'] },
      { title: 'detalle', detail: 'Expone una API REST consumida por React. Manejo de sesiones via JWT, sin vistas renderizadas del lado servidor.' },
    ],
  },
  {
    code: 'SYS-02',
    name: 'CodeIgniter',
    role: 'MVC Framework',
    status: 'STABLE',
    load: 78,
    sections: [
      { title: 'versión', tags: ['CI 4.x'] },
      { title: 'patrón', tags: ['Controladores REST', 'Models + Query Builder', 'Filters (middleware)'] },
      { title: 'detalle', detail: 'Filters interceptan cada request para verificar el JWT antes de llegar al controlador. Un controlador por recurso: usuarios, posts, comentarios.' },
    ],
  },
  {
    code: 'SYS-03',
    name: 'React',
    role: 'UI Engine',
    status: 'ACTIVE',
    load: 85,
    sections: [
      { title: 'versión', tags: ['React 18'] },
      { title: 'herramientas', tags: ['React Router', 'Context API', 'Fetch / Axios'] },
      { title: 'detalle', detail: 'SPA completa con ruteo client-side. Estado global de autenticación via Context. Componentes por sección: feed, hilo, perfil, admin.' },
    ],
  },
  {
    code: 'SYS-04',
    name: 'Vite',
    role: 'Build System',
    status: 'FAST',
    load: 70,
    sections: [
      { title: 'plugins', tags: ['@vitejs/plugin-react'] },
      { title: 'config', tags: ['.env variables', 'Proxy dev → backend', 'HMR'] },
      { title: 'detalle', detail: 'VITE_API_URL apunta al backend CI en desarrollo. En producción, el build estático se sirve desde el contenedor Nginx.' },
    ],
  },
  {
    code: 'SYS-05',
    name: 'Docker',
    role: 'Container Layer',
    status: 'ISOLATED',
    load: 88,
    sections: [
      { title: 'servicios', tags: ['php-fpm', 'nginx', 'mysql'] },
      { title: 'orquestación', tags: ['docker-compose.yml', 'Volúmenes persistentes'] },
      { title: 'detalle', detail: 'Tres contenedores: Nginx como reverse proxy, php-fpm con CodeIgniter, MySQL 8. Red interna compartida. Solo puerto 80/443 expuesto.' },
    ],
  },
  {
    code: 'SYS-06',
    name: 'JWT',
    role: 'Auth System',
    status: 'SECURE',
    load: 95,
    sections: [
      { title: 'librería', tags: ['firebase/php-jwt'] },
      { title: 'flujo', tags: ['Login → token', 'Header Bearer', 'Filter CI'] },
      { title: 'detalle', detail: 'Access token en localStorage. Cada request privado envía Authorization: Bearer <token>. El Filter de CI valida firma y expiración.' },
    ],
  },
  {
    code: 'SYS-07',
    name: 'MySQL',
    role: 'Database Engine',
    status: 'ONLINE',
    load: 90,
    sections: [
      { title: 'versión', tags: ['MySQL 8'] },
      { title: 'entidades', tags: ['usuarios', 'posts', 'comentarios', 'tags', 'roles'] },
      { title: 'detalle', detail: 'Relaciones con FK definidas. Tabla pivot post_tags (N:M). Roles por tabla separada con FK en usuarios. Queries via Query Builder de CI.' },
    ],
  },
];

const STATUS_CLASS = {
  CORE:     'tech-s-core',
  STABLE:   'tech-s-stable',
  ACTIVE:   'tech-s-active',
  FAST:     'tech-s-fast',
  ISOLATED: 'tech-s-isolated',
  SECURE:   'tech-s-secure',
  ONLINE:   'tech-s-online',
};

const BAR_COLOR = {
  CORE:     '#185FA5',
  STABLE:   '#3B6D11',
  ACTIVE:   '#534AB7',
  FAST:     '#BA7517',
  ISOLATED: '#5F5E5A',
  SECURE:   '#A32D2D',
  ONLINE:   '#0F6E56',
};

function TechCard({ t, isOpen, onToggle }) {
  return (
    <div
      className={`tech-module ${isOpen ? 'tech-module--open' : ''}`}
      onClick={onToggle}
    >
      {/* header */}
      <div className="tech-top">
        <span className="tech-code">{t.code}</span>
        <span className={`tech-status ${STATUS_CLASS[t.status]}`}>{t.status}</span>
      </div>

      <div className="tech-name-row">
        <h3 className="tech-name">{t.name}</h3>
        <span className={`tech-chevron ${isOpen ? 'tech-chevron--open' : ''}`}>▾</span>
      </div>

      <p className="tech-role">{t.role}</p>

      <div className="tech-footer">
        <span className="tech-load-label">LOAD</span>
        <div className="tech-bar">
          <div
            className="tech-bar-fill"
            style={{ width: `${t.load}%`, background: BAR_COLOR[t.status] }}
          />
        </div>
        <span className="tech-load-value">{t.load}%</span>
      </div>

      {/* expandable */}
      <div className={`tech-expand ${isOpen ? 'tech-expand--open' : ''}`}>
        <div className="tech-expand-inner">
          {t.sections.map((s) => (
            <div key={s.title} className="tech-section-block">
              <div className="tech-section-title">{s.title}</div>
              {s.tags && (
                <div className="tech-tag-row">
                  {s.tags.map((tag) => (
                    <span key={tag} className="tech-tag">{tag}</span>
                  ))}
                </div>
              )}
              {s.detail && (
                <p className="tech-detail-line">{s.detail}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TechSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="video-section tech-section" id="tech">

      <video
        className="section-video"
        src="https://res.cloudinary.com/digxeqcff/video/upload/q_auto/f_auto/v1779860414/tech_tbujwi.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="section-video-overlay" />

      <div className="section-content">
        <span className="section-tag">// arsenal técnico</span>

        <h2 className="section-title">
          Stack <span>tecnológico</span>
        </h2>

        <div className="section-divider" />

        <div className="tech-grid">
          {TECHS.map((t, i) => (
            <TechCard
              key={t.code}
              t={t}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}