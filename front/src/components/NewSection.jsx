const NEWS = [
  {
    tag: 'CRÍTICO',
    tagClass: 'tag-critical',
    title: 'Brecha masiva expone datos de 560 millones de usuarios de Ticketmaster',
    excerpt:
      'El grupo ShinyHunters filtró una base de datos de 1.3 TB con información personal y detalles de transacciones.',
    date: '2026-05-30',
    source: 'BleepingComputer',
    comments: [
      { user: 'root_null', text: 'La base ya está circulando en varios foros privados.' },
      { user: 'hexwave', text: 'El dump incluye hashes parcialmente salteados. Grave.' },
    ],
  },
  {
    tag: 'ALERTA',
    tagClass: 'tag-warning',
    title: 'Zero-day crítico en PAN-OS explotado activamente',
    excerpt:
      'La vulnerabilidad permite ejecución remota de comandos sin autenticación.',
    date: '2026-04-12',
    source: 'NIST NVD',
    comments: [
      { user: 'bytehunter', text: 'Detectamos actividad sospechosa en firewalls sin parchear.' },
      { user: 'ghostshell', text: 'El exploit ya apareció en GitHub hace horas.' },
    ],
  },
  {
    tag: 'INFO',
    tagClass: 'tag-info',
    title: 'OWASP actualiza el Top 10 con foco en APIs y LLMs',
    excerpt:
      'La edición 2026 incorpora nuevas categorías vinculadas a IA y autenticación distribuida.',
    date: '2026-06-01',
    source: 'OWASP Foundation',
    comments: [
      { user: 'nullbyte', text: 'La cantidad de apps vulnerables a IDOR sigue siendo absurda.' },
      { user: 's4murai', text: 'LLM prompt injection va a explotar fuerte este año.' },
    ],
  },
];

const REPORTS = [
  {
    user: 'kernelpanic',
    role: 'USER',
    roleClass: 'role-user',
    type: 'REPORTE',
    text: 'Usuarios reportan intentos de phishing usando clones visuales de Discord Nitro.',
    suggestions: [
      {
        user: 'cipher',
        role: 'AUDITOR',
        roleClass: 'role-auditor',
        text: 'Confirmado. Detecté tres dominios activos esta semana. Los paso por DM.',
        replies: [
          {
            user: 'kernelpanic',
            role: 'USER',
            roleClass: 'role-user',
            text: 'Gracias, los agrego al reporte.',
          },
        ],
      },
      {
        user: 'CarlosSQL',
        role: 'USER',
        roleClass: 'role-user',
        text: '¿Alguien tiene capturas del clon? Quiero comparar los headers HTTP.',
        replies: [],
      },
    ],
  },
  {
    user: 'ghostshell',
    role: 'USER',
    roleClass: 'role-user',
    type: 'REPORTE',
    text: 'Actividad de bots detectada en publicaciones relacionadas a malware Android.',
    suggestions: [
      {
        user: 'Pedro',
        role: 'ADMIN',
        roleClass: 'role-admin',
        text: 'Revisando. Si se confirma, se eliminan las publicaciones y se banea la cuenta.',
        replies: [],
      },
    ],
  },
  {
    user: '0xPedro',
    role: 'USER',
    roleClass: 'role-user',
    type: 'REPORTE',
    text: 'Alguien tiene recursos para empezar en pentesting web? Buscando por donde arrancar.',
    suggestions: [
      {
        user: 'hexwave',
        role: 'AUDITOR',
        roleClass: 'role-auditor',
        text: 'PortSwigger Web Academy es el mejor punto de entrada, gratuito y estructurado.',
        replies: [
          {
            user: '0xPedro',
            role: 'USER',
            roleClass: 'role-user',
            text: 'Gracias, ya lo tengo abierto.',
          },
        ],
      },
    ],
  },
];

const FEATURES = [
  {
    icon: '◈',
    title: 'Noticias verificadas',
    desc: 'Los auditores publican y editan noticias del mundo infosec. Podés filtrar por criticidad.',
  },
  {
    icon: '⬡',
    title: 'Reportes de la comunidad',
    desc: 'Cualquier usuario puede crear un reporte. Se filtran por fecha y se buscan por palabras clave.',
  },
  {
    icon: '↳',
    title: 'Hilos de sugerencias',
    desc: 'Cada reporte tiene su propio hilo anidado. Discutí, respondé y colaborá en tiempo real.',
  },
  {
    icon: '◎',
    title: 'Perfiles públicos',
    desc: 'Avatar, biografía y todos los reportes de un usuario visibles en su perfil. Buscalos por nombre.',
  },
  {
    icon: '⌖',
    title: 'Búsqueda full-text',
    desc: 'Buscá reportes por título o contenido, y perfiles por nombre de usuario o bio.',
  },
  {
    icon: '▣',
    title: 'Roles y permisos',
    desc: 'Tres roles: USER, AUDITOR y ADMIN. El admin asciende usuarios y modera todo el contenido.',
  },
];

export default function NewsSection() {
  return (
    <section className="video-section news-section" id="news">

      <video
        className="section-video"
        src="https://res.cloudinary.com/digxeqcff/video/upload/q_auto/f_auto/v1779860285/news_fqrurk.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="section-video-overlay" />

      <div className="section-content">

        <span className="section-tag">// inteligencia colectiva</span>

        <h2 className="section-title">
          Noticias, <span>reportes</span> y actividad
          <br />
          en tiempo real
        </h2>

        <div className="section-divider" />

        <p className="news-intro">
          Plataforma de intercambio donde la comunidad comparte noticias, reportes
          y análisis sobre ciberseguridad. Un espacio para mantenerse informado,
          colaborar en investigaciones y discutir las últimas tendencias del sector.
        </p>

        {/* ── FEATURES ── */}
        <div className="community-grid" style={{ marginBottom: '3rem' }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="community-card fade-in-up" style={{ animationDelay: `${i * 0.07}s` }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', color: 'var(--green)', marginBottom: '0.8rem' }}>
                {f.icon}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--green)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                {f.title}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.7', margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── NEWS ── */}
        <div className="news-grid">
          {NEWS.map((n, i) => (
            <article
              key={i}
              className="news-card fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="news-card-top">
                <span className={`news-card-tag ${n.tagClass}`}>{n.tag}</span>
                <span className="news-card-source">{n.source}</span>
              </div>
              <h3 className="news-card-title">{n.title}</h3>
              <p className="news-card-excerpt">{n.excerpt}</p>
              <div className="news-comments">
                {n.comments.map((c, idx) => (
                  <div key={idx} className="news-comment">
                    <span className="comment-user">@{c.user}</span>
                    <span className="comment-text">{c.text}</span>
                  </div>
                ))}
              </div>
              <div className="news-card-meta">
                <span>{n.date}</span>
                <span>{n.comments.length} comentarios</span>
              </div>
            </article>
          ))}
        </div>

        {/* ── ROLES ── */}
        <div className="community-preview">
          <div className="community-header">
            <span className="community-badge">SISTEMA DE ROLES</span>
            <h3 className="community-title">
              Comunidad moderada con perfiles,
              reputación y permisos dinámicos
            </h3>
            <p className="community-description">
              Cada usuario posee un rol dentro de la plataforma con permisos específicos
              y un perfil personalizable. El admin asciende usuarios a auditor o admin.
              Por defecto todo usuario registrado entra como USER.
            </p>
          </div>

          <div className="community-grid">
            {/* USER */}
            <div className="community-card">
              <div className="community-role role-user">USER</div>
              <div className="community-user">@kernelpanic</div>
              <ul className="community-features">
                <li>Leer noticias</li>
                <li>Crear reportes propios</li>
                <li>Buscar reportes y perfiles</li>
                <li>Participar en hilos</li>
                <li>Administrar su perfil y avatar</li>
              </ul>
            </div>

            {/* AUDITOR */}
            <div className="community-card">
              <div className="community-role role-user">AUDITOR</div>
              <div className="community-user">@cipher</div>
              <ul className="community-features">
                <li>Todo lo que hace el USER</li>
                <li>Publicar y editar noticias</li>
                <li>Distintivo en avatar y sugerencias</li>
                <li>Sus sugerencias se destacan visualmente</li>
              </ul>
            </div>

            {/* ADMIN */}
            <div className="community-card admin-card">
              <div className="community-role role-admin">ADMIN</div>
              <div className="community-user admin-user">
                @Pedro
                <span className="admin-verified">VERIFIED</span>
              </div>
              <ul className="community-features">
                <li>Todo lo que hace el AUDITOR</li>
                <li>Ascender usuarios a cualquier rol</li>
                <li>Banear usuarios temporalmente o de forma permanente</li>
                <li>Eliminar reportes y noticias</li>
                <li>Tener la última palabra</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── REPORTES CON HILO ── */}
        <div className="reports-section">
          <div className="reports-header">REPORTES Y SUGERENCIAS — ASÍ FUNCIONA EL HILO</div>

          <div className="reports-list">
            {REPORTS.map((r, i) => (
              <div key={i} className="report-item fade-in-up" style={{ animationDelay: `${i * 0.1}s`, flexDirection: 'column', alignItems: 'flex-start', gap: '0.8rem' }}>

                {/* Reporte principal */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span className="report-type">[{r.type}]</span>
                  <span className="report-user">@{r.user}</span>
                  <span className={`community-role ${r.roleClass}`} style={{ fontSize: '0.55rem', padding: '0.15rem 0.5rem', marginBottom: 0 }}>{r.role}</span>
                </div>
                <span className="report-text">{r.text}</span>

                {/* Sugerencias */}
                {r.suggestions.length > 0 && (
                  <div style={{ paddingLeft: '1.5rem', borderLeft: '1px solid rgba(0,255,65,0.15)', display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
                    {r.suggestions.map((s, si) => (
                      <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(0,255,65,0.5)' }}>↳</span>
                          <span className="report-user">@{s.user}</span>
                          <span className={`community-role ${s.roleClass}`} style={{ fontSize: '0.55rem', padding: '0.15rem 0.5rem', marginBottom: 0 }}>{s.role}</span>
                        </div>
                        <span className="report-text" style={{ paddingLeft: '1rem' }}>{s.text}</span>

                        {/* Respuestas al hilo */}
                        {s.replies.length > 0 && (
                          <div style={{ paddingLeft: '1.5rem', borderLeft: '1px solid rgba(0,255,65,0.08)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {s.replies.map((rep, ri) => (
                              <div key={ri} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(0,255,65,0.3)' }}>↳</span>
                                  <span className="report-user">@{rep.user}</span>
                                  <span className={`community-role ${rep.roleClass}`} style={{ fontSize: '0.55rem', padding: '0.15rem 0.5rem', marginBottom: 0 }}>{rep.role}</span>
                                </div>
                                <span className="report-text" style={{ paddingLeft: '1rem' }}>{rep.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}