import { useState, useRef, useEffect, useCallback } from 'react';

// ─── STYLES ──────────────────────────────────────────────────────────────────

const S = {
  green:    'var(--green)',
  dim:      'rgba(255,255,255,0.38)',
  dimGreen: 'rgba(0,255,65,0.45)',
  red:      'rgba(255,100,100,0.9)',
  white:    'white',
  mono:     'var(--font-mono)',
};

const STYLE_MAP = {
  green:    S.green,
  dim:      S.dim,
  dimGreen: S.dimGreen,
  white:    S.white,
};

// ─── OUTPUT RENDERERS ────────────────────────────────────────────────────────

function Row({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', marginBottom: '0.25rem' }}>
      {children}
    </div>
  );
}

function Line({ color, italic, children }) {
  return (
    <span style={{
      color,
      fontStyle:   italic ? 'italic' : undefined,
      lineHeight:  1.7,
      display:     'block',
    }}>
      {children}
    </span>
  );
}

function buildOutput(cmd) {
  const { output_type, payload } = cmd;

  if (output_type === 'table') {
    return () => (
      <Row>
        {payload.rows.map((e, i) => (
          <span key={i} style={{ display: 'block', lineHeight: 1.8 }}>
            <span style={{ color: S.green }}>▸ </span>
            <span style={{ color: S.white, fontWeight: 'bold' }}>{e.name}</span>
            <span style={{ color: S.dim, fontSize: '0.8em' }}> [{e.fields.join(', ')}]</span>
            <span style={{ display: 'block', paddingLeft: '1.2rem', color: S.dimGreen, fontSize: '0.78em' }}>
              {e.note}
            </span>
          </span>
        ))}
      </Row>
    );
  }

  if (output_type === 'list') {
    return () => (
      <Row>
        {payload.items.map((item, i) => (
          <span key={i} style={{ display: 'block', fontFamily: S.mono, fontSize: '0.82rem', lineHeight: 1.8 }}>
            <span style={{ color: S.white, fontWeight: 'bold' }}>{item.label}</span>
            <span style={{ color: S.dim }}> → {item.desc}</span>
          </span>
        ))}
      </Row>
    );
  }

  if (output_type === 'keyval') {
    return () => (
      <Row>
        {payload.items.map((item, i) => (
          <span key={i} style={{ display: 'block', lineHeight: 1.7, marginBottom: '0.3rem' }}>
            <span style={{ color: S.green, fontWeight: 'bold' }}>{item.title}</span>
            <span style={{
              display:     'block',
              paddingLeft: '1.2rem',
              color:       S.dim,
              fontSize:    '0.8em',
              lineHeight:  1.7,
            }}>
              {item.body}
            </span>
          </span>
        ))}
      </Row>
    );
  }

  // ascii + plain
  return () => (
    <Row>
      {payload.lines.map((line, i) => (
        <Line key={i} color={STYLE_MAP[line.style] ?? S.dim}>
          {line.text}
        </Line>
      ))}
    </Row>
  );
}

function buildHelpOutput(data) {
  return () => (
    <Row>
      <Line color={S.dim}>Comandos disponibles:</Line>
      {data.map((cmd, i) => (
        <span key={i} style={{ display: 'block', fontFamily: S.mono, fontSize: '0.82rem', lineHeight: 1.8 }}>
          <span style={{ color: S.green }}>{cmd.command}</span>
          <span style={{ color: S.dim }}> — {cmd.description}</span>
        </span>
      ))}
      <span style={{ display: 'block', fontFamily: S.mono, fontSize: '0.82rem', lineHeight: 1.8 }}>
        <span style={{ color: S.green }}>clear</span>
        <span style={{ color: S.dim }}> — limpia la consola</span>
      </span>
    </Row>
  );
}

// ─── BOOT SEQUENCE ───────────────────────────────────────────────────────────

const BOOT_SEQUENCE = [
  { text: 'Iniciando sistema...',          color: 'rgba(255,255,255,0.45)' },
  { text: 'Conectando a base de datos...', color: 'rgba(255,255,255,0.45)' },
  { text: 'Cargando entidades [6/6]...',   color: 'rgba(255,255,255,0.45)' },
  { text: 'Verificando permisos...',       color: 'rgba(255,255,255,0.45)' },
  { text: 'Sistema listo.',                color: S.green },
  { text: '',                              color: undefined },
  { text: 'Escribí /help para ver los comandos disponibles.', color: S.dim, italic: true },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function AboutSection() {
  const [phase, setPhase]         = useState('idle');
  const [bootLines, setBootLines] = useState([]);
  const [history, setHistory]     = useState([]);
  const [input, setInput]         = useState('');
  const [cmdMap, setCmdMap]       = useState(null);   // null = cargando, {} = error/vacío
  const [fetchError, setFetchError] = useState(false);

  const bodyRef  = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch('/api/terminal-commands')
      .then(r => {
        if (!r.ok) throw new Error('Network error');
        return r.json();
      })
      .then(({ data }) => {
        const map = {};
        data.forEach(cmd => {
          map[cmd.command] = buildOutput(cmd);
        });
        map['/help'] = buildHelpOutput(data);
        setCmdMap(map);
      })
      .catch(() => {
        setFetchError(true);
        setCmdMap({});
      });
  }, []);

  // ── Auto-scroll ──
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [bootLines, history]);

  // ── Boot animado ──
  const runBoot = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('booting');
    setBootLines([]);
    let i = 0;
    const tick = () => {
      setBootLines(prev => [...prev, BOOT_SEQUENCE[i]]);
      i++;
      if (i < BOOT_SEQUENCE.length) {
        setTimeout(tick, i === BOOT_SEQUENCE.length - 1 ? 400 : 260);
      } else {
        setTimeout(() => setPhase('ready'), 200);
      }
    };
    tick();
  }, [phase]);

  // ── Input handler ──
  const handleKey = (e) => {
    if (e.key !== 'Enter') return;
    const raw = input.trim();
    const cmd = raw.toLowerCase();
    if (!cmd) return;

    // Estado idle: solo acepta /accessdeniedinit
    if (phase === 'idle') {
      if (cmd === '/accessdeniedinit') {
        setHistory([]);
        setBootLines([]);
        setInput('');
        runBoot();
      } else {
        setHistory(prev => [...prev,
          { type: 'cmd', content: raw },
          {
            type: 'err',
            content: (
              <>
                Acceso denegado. Iniciá el sistema con{' '}
                <span style={{ color: S.green }}>/AccessDeniedInit</span>
              </>
            ),
          },
        ]);
        setInput('');
      }
      return;
    }

    if (phase !== 'ready') return;

    // clear
    if (cmd === 'clear') {
      setHistory([]);
      setBootLines([...BOOT_SEQUENCE]);
      setInput('');
      return;
    }

    const newEntry = [{ type: 'cmd', content: raw }];

    // Todavía cargando
    if (cmdMap === null) {
      newEntry.push({
        type: 'err',
        content: <span style={{ color: S.dim }}>Cargando comandos...</span>,
      });
    } else if (fetchError) {
      newEntry.push({
        type: 'err',
        content: <span style={{ color: S.red }}>Error al conectar con el servidor.</span>,
      });
    } else if (cmdMap[cmd]) {
      newEntry.push({ type: 'out', content: cmdMap[cmd]() });
    } else {
      newEntry.push({
        type: 'err',
        content: (
          <>
            Comando no reconocido: <span style={{ color: S.white }}>{raw}</span>{' '}
            — escribí <span style={{ color: S.green }}>/help</span>
          </>
        ),
      });
    }

    setHistory(prev => [...prev, ...newEntry]);
    setInput('');
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────

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

      <div className="section-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>

        <div
          className="about-terminal"
          style={{
            width:     '100%',
            maxWidth:  '780px',
            display:   'flex',
            flexDirection: 'column',
            overflow:  'hidden',
          }}
        >
          {/* Barra superior */}
          <div className="terminal-bar">
            <span className="t-dot red" />
            <span className="t-dot yellow" />
            <span className="t-dot green" />
            <span className="terminal-title">PEDRO_CABJ@hackforum:~$</span>
          </div>

          {/* Body */}
          <div
            ref={bodyRef}
            className="terminal-body"
            style={{
              height:     '460px',
              overflowY:  'auto',
              overflowX:  'hidden',
              cursor:     'text',
              scrollBehavior: 'smooth',
            }}
            onClick={() => inputRef.current?.focus()}
          >

            {/* Idle: mensaje inicial */}
            {phase === 'idle' && history.length === 0 && (
              <span className="t-output" style={{ color: S.dim, fontStyle: 'italic' }}>
                Sistema en espera. Escribí{' '}
                <span style={{ color: S.green, fontStyle: 'normal' }}>/AccessDeniedInit</span>{' '}
                para continuar.
              </span>
            )}

            {/* Historial idle (errores pre-boot) */}
            {phase === 'idle' && history.map((e, i) => (
              <div key={i} style={{ marginBottom: '0.15rem' }}>
                {e.type === 'cmd'
                  ? <span><span className="t-prompt">db@hackforum:~$ </span><span className="t-cmd">{e.content}</span></span>
                  : <span className="t-output" style={{ color: S.red }}>{e.content}</span>
                }
              </div>
            ))}

            {/* Boot sequence */}
            {(phase === 'booting' || phase === 'ready') &&
              bootLines.filter(Boolean).map((line, i) => (
                <span
                  key={i}
                  className="t-output"
                  style={{
                    color:     line?.color,
                    fontStyle: line?.italic ? 'italic' : undefined,
                    paddingLeft: 0,
                  }}
                >
                  {line?.text}
                </span>
              ))
            }

            {/* Historial post-boot */}
            {phase === 'ready' && history.map((e, i) => (
              <div key={i} style={{ marginBottom: '0.15rem' }}>
                {e.type === 'cmd' && (
                  <span>
                    <span className="t-prompt">db@hackforum:~$ </span>
                    <span className="t-cmd">{e.content}</span>
                  </span>
                )}
                {e.type === 'out' && (
                  <div style={{ marginTop: '0.2rem', marginBottom: '0.4rem' }}>{e.content}</div>
                )}
                {e.type === 'err' && (
                  <span className="t-output" style={{ color: S.red }}>{e.content}</span>
                )}
              </div>
            ))}

            {/* Input activo */}
            {phase !== 'booting' && (
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.2rem' }}>
                <span className="t-prompt">db@hackforum:~$ </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="off"
                  spellCheck={false}
                  style={{
                    background: 'transparent',
                    border:     'none',
                    outline:    'none',
                    color:      S.green,
                    fontFamily: S.mono,
                    fontSize:   '0.82rem',
                    lineHeight: 2,
                    width:      '100%',
                    caretColor: S.green,
                  }}
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}