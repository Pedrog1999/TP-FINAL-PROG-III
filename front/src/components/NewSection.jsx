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
      {
        user: 'root_null',
        text: 'La base ya está circulando en varios foros privados.',
      },
      {
        user: 'hexwave',
        text: 'El dump incluye hashes parcialmente salteados. Grave.',
      },
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
      {
        user: 'bytehunter',
        text: 'Detectamos actividad sospechosa en firewalls sin parchear.',
      },
      {
        user: 'ghostshell',
        text: 'El exploit ya apareció en GitHub hace horas.',
      },
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
      {
        user: 'nullbyte',
        text: 'La cantidad de apps vulnerables a IDOR sigue siendo absurda.',
      },
      {
        user: 's4murai',
        text: 'LLM prompt injection va a explotar fuerte este año.',
      },
    ],
  },
];

const REPORTS = [
  {
    user: 'kernelpanic',
    type: 'REPORTE',
    text: 'Usuarios reportan intentos de phishing usando clones visuales de Discord Nitro.',
  },

  {
    user: '0xPedro',
    type: 'SUGERENCIA',
    text: 'Agregar sistema de reputación y validación para reportes técnicos.',
  },
    {
    user: 'EL_MAS_PERDIDO_99',
    type: 'REPORTE',
    text: 'Alguien me da una mano para centrar un div ??',
  },
  {
    user: 'cipher',
    type: 'REPORTE',
    text: 'Actividad de bots detectada en publicaciones relacionadas a malware Android.',
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

        <span className="section-tag">
          // inteligencia colectiva
        </span>

        <h2 className="section-title">
          Noticias, <span>reportes</span> y actividad
          <br />
          en tiempo real
        </h2>

        <div className="section-divider" />

        <p className="news-intro">
        Plataforma de intercambio donde la comunidad comparte noticias, reportes y análisis sobre ciberseguridad. Un espacio para mantenerse informado, colaborar en investigaciones y discutir las últimas tendencias del sector.

        </p>

        {/* NEWS */}
        <div className="news-grid">

          {NEWS.map((n, i) => (
            <article
              key={i}
              className="news-card fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >

              <div className="news-card-top">

                <span className={`news-card-tag ${n.tagClass}`}>
                  {n.tag}
                </span>

                <span className="news-card-source">
                  {n.source}
                </span>

              </div>

              <h3 className="news-card-title">
                {n.title}
              </h3>

              <p className="news-card-excerpt">
                {n.excerpt}
              </p>

              {/* COMMENTS */}
              <div className="news-comments">

                {n.comments.map((c, idx) => (
                  <div key={idx} className="news-comment">

                    <span className="comment-user">
                      @{c.user}
                    </span>

                    <span className="comment-text">
                      {c.text}
                    </span>

                  </div>
                ))}

              </div>

              <div className="news-card-meta">

                <span>{n.date}</span>

                <span>
                  {n.comments.length} comentarios
                </span>

              </div>

            </article>
          ))}

        </div>
          {/* COMMUNITY PREVIEW */}
<div className="community-preview">

  <div className="community-header">

    <span className="community-badge">
      SISTEMA DE ROLES
    </span>

    <h3 className="community-title">
      Comunidad moderada con perfiles,
      reputación y permisos dinámicos
    </h3>

    <p className="community-description">
      Cada usuario posee un rol dentro de la plataforma,
      permisos específicos y un perfil personalizable.
      Los administradores validan reportes, moderan contenido
      y destacan publicaciones relevantes para la comunidad.
    </p>

  </div>

  <div className="community-grid">

    {/* USER */}
    <div className="community-card">

      <div className="community-role role-user">
        USER
      </div>

      <div className="community-user">
        @kernelpanic
      </div>

      <ul className="community-features">
        <li>Publicar reportes</li>
        <li>Comentar noticias</li>
        <li>Editar perfil</li>
        <li>Seguir temas</li>
      </ul>

    </div>

    {/* USER */}
    <div className="community-card">

      <div className="community-role role-user">
        AUDITOR
      </div>

      <div className="community-user">
        @cipher
      </div>

      <ul className="community-features">
        <li>Publicar noticias</li>
        <li>Eliminar noticias</li>
        <li>Editar noticias</li>
        <li>Otorgar reputación</li>
        <li>Mantener el orden</li>
      </ul>

    </div>

    {/* ADMIN */}
    <div className="community-card admin-card">

      <div className="community-role role-admin">
        ADMIN
      </div>

      <div className="community-user admin-user">
        @Pedro
        <span className="admin-verified">
          VERIFIED
        </span>
      </div>

      <ul className="community-features">
        <li>Ascender usuarios</li>
        <li>Banear usuarios</li>
        <li>Gestionar usuarios</li>
        <li>Publicar alertas críticas</li>
        <li>Tener la última palabra  </li>
      </ul>

    </div>

  </div>
</div>

        {/* REPORTS */}
        <div className="reports-section">

          <div className="reports-header">
            REPORTES RECIENTES
          </div>

          <div className="reports-list">

            {REPORTS.map((r, i) => (
              <div
                key={i}
                className="report-item fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >

                <span className="report-type">
                  [{r.type}]
                </span>

                <span className="report-user">
                  @{r.user}
                </span>

                <span className="report-text">
                  {r.text}
                </span>

              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}