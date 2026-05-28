

export default function AboutSection() {
  return (
    <section className="video-section about-section" id="about">

      <video
        className="section-video"
        src="https://res.cloudinary.com/digxeqcff/video/upload/q_auto/f_auto/v1779860063/about_rax9ia.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="section-video-overlay" />

      <div className="section-content">

        {/* Terminal izquierda */}
        <div className="about-terminal">
          <div className="terminal-bar">
            <span className="t-dot red" />
            <span className="t-dot yellow" />
            <span className="t-dot green" />
            <span className="terminal-title">pedro@utn:~$</span>
          </div>

          <div className="terminal-body">
            <span>
              <span className="t-prompt">pedro@utn:~$ </span>
              <span className="t-cmd">whoami</span>
            </span>

            <span className="t-output">Pedro Gianibelli</span>

            <span className="t-blank" />

            <span>
              <span className="t-prompt">pedro@utn:~$ </span>
              <span className="t-cmd">cat about.json</span>
            </span>

            <span className="t-output">{'{'}</span>

            <span className="t-output">
              &nbsp;&nbsp;
              <span className="t-comment">"carrera"</span>:
              <span className="t-val"> "Tecnicatura en Programación"</span>,
            </span>

            <span className="t-output">
              &nbsp;&nbsp;
              <span className="t-comment">"universidad"</span>:
              <span className="t-val"> "UTN"</span>,
            </span>

            <span className="t-output">
              &nbsp;&nbsp;
              <span className="t-comment">"materia"</span>:
              <span className="t-val"> "Programación III"</span>,
            </span>

            <span className="t-output">
              &nbsp;&nbsp;
              <span className="t-comment">"modalidad"</span>:
              <span className="t-val"> "Libre"</span>,
            </span>

            <span className="t-output">
              &nbsp;&nbsp;
              <span className="t-comment">"status"</span>:
              <span className="t-val"> "En desarrollo activo"</span>
            </span>

            <span className="t-output">{'}'}</span>

            <span className="t-blank" />

            <span>
              <span className="t-prompt">pedro@utn:~$ </span>
              <span className="t-cmd">cat proyecto.txt</span>
            </span>

            <span className="t-output">
              Front + API REST 
            </span>

            <span className="t-output">
              Estética clean + back robusto
            </span>

            <span className="t-output">
              Código liviano y modular.
            </span>

            <span className="t-blank" />

            <span>
              <span className="t-prompt">pedro@utn:~$ </span>
              <span className="t-cmd">
                _
                <span
                  style={{
                    animation: 'blink 0.8s infinite',
                    display: 'inline-block',
                  }}
                >
                  █
                </span>
              </span>
            </span>
          </div>
        </div>

        {/* Texto derecha */}
        <div className="about-text-block">

          <span className="section-tag">
            // Información de extrema confidencialidad
          </span>

          <h2 className="section-title">
            About the  
            <br />
            <span>Commander.</span>
          </h2>

          <div className="section-divider" />

          <p className="about-bio">
            Estudiante de la
            <strong> Tecnicatura Universitaria en Programación </strong>
            en la
            <strong> UTN</strong>.
            Este proyecto es el trabajo final de
            <strong> Programación III</strong>,
            una web full-stack completa tratando de lograr una arquitectura prolija,
            autenticación segura y despliegue containerizado.
          </p>

          <p className="about-bio">
            El objetivo es construir una
            <strong> comunidad de hacking y ciberseguridad </strong>
            donde los usuarios puedan compartir conocimiento,
            vulnerabilidades, writeups y noticias del mundo infosec.
            Todo con autenticación
            <strong> JWT</strong>,
            roles diferenciados y una API REST robusta.
          </p>


        </div>
      </div>
    </section>
  );
}