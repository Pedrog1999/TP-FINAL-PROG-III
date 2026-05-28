

export default function ThanksSection() {
  return (
    <section className="video-section thanks-section" id="thanks">

      <video
        className="section-video"
        src="https://res.cloudinary.com/digxeqcff/video/upload/q_auto/f_auto/v1779860374/thanks_xwibji.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="section-video-overlay" />

      <div className="section-content">

        <span className="section-tag">
          // Deuda de honor
        </span>

        <h2
          className="section-title"
          style={{ textAlign: 'center' }}
        >
          Gracias, <span>soldados.</span>
        </h2>

        <div
          className="section-divider"
          style={{ margin: '1.5rem auto 3rem' }}
        />

        <div className="thanks-card">

          <div className="thanks-quote">"</div>

          <p className="thanks-text">
            Este proyecto no existiría sin la guía de
            <strong> Matías Schettino</strong> y
            <strong> Guillermo Casanova</strong>,
            que no solo enseñan a programar — enseñan a pensar, a diseñar y a escribir código con criterio.
          </p>

          <p
            className="thanks-text"
            style={{ fontSize: '0.95rem', opacity: 0.8 }}
          >
            Este foro es el resultado de aplicar todo lo aprendido:
            <strong> arquitectura limpia</strong>,
            <strong> seguridad real</strong>,
            <strong> código que escala</strong> y 
            <strong> diseño de interfaces</strong>.
          </p>

          <p className="thanks-sig">
            — Pedro Gianibelli 
          </p>

        </div>
      </div>
    </section>
  );
}