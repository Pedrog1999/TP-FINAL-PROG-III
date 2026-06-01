import { useState, useRef, useEffect, useCallback } from 'react';

// ─── DATA ───────────────────────────────────────────────────────────────────

const ENTITIES = [
  { name: 'roles',         fields: ['id', 'name'],                                                        note: 'USER · AUDITOR · ADMIN' },
  { name: 'users',         fields: ['id', 'username', 'email', 'password_hash', 'role_id', 'is_banned'],  note: 'FK → roles' },
  { name: 'user_profiles', fields: ['id', 'user_id', 'bio', 'avatar_path'],                               note: 'FULLTEXT: bio' },
  { name: 'news',          fields: ['id', 'author_id', 'title', 'body', 'status'],                        note: 'draft · published · deleted' },
  { name: 'reports',       fields: ['id', 'user_id', 'title', 'body', 'status', 'created_at'],            note: 'FULLTEXT: title + body — entidad central' },
  { name: 'suggestions',   fields: ['id', 'report_id', 'user_id', 'parent_id', 'body', 'status'],         note: 'self-ref → hilo anidado' },
];

const LAYERS = [
  { name: 'Entity',     desc: 'Mapeo directo de la tabla. Sin lógica.' },
  { name: 'Model',      desc: 'Queries, scopes y acceso a la BD.' },
  { name: 'DTO',        desc: 'Objeto de transferencia entre capas.' },
  { name: 'Converter',  desc: 'Transforma Entity ↔ DTO.' },
  { name: 'Request',    desc: 'Valida y encapsula la entrada HTTP.' },
  { name: 'Service',    desc: 'Lógica de negocio pura. Orquesta el flujo.' },
  { name: 'Response',   desc: 'Formatea la salida HTTP.' },
  { name: 'Controller', desc: 'Solo entrada/salida. Delega al Service.' },
];

const DECISIONS = [
  { title: 'Única responsabilidad por capa',            body: 'El Controller no conoce la BD, el Model no conoce HTTP. Si algo falla, el problema está acotado a una sola capa.' },
  { title: 'Soft delete en lugar de borrado físico',    body: 'News, reports y suggestions usan status="deleted". Los datos no se pierden y se pueden auditar.' },
  { title: 'user_profiles separado de users',           body: 'users maneja autenticación. user_profiles maneja presentación pública. Responsabilidades distintas.' },
  { title: 'FULLTEXT sobre reports y profiles',         body: 'LIKE es lento en tablas grandes. FULLTEXT indexa el contenido y devuelve resultados por pertinencia.' },
  { title: 'parent_id auto-referencial en suggestions', body: 'Un campo parent_id nullable sobre la misma tabla resuelve el hilo anidado sin tabla extra.' },
  { title: 'is_banned en users para auth rápida',       body: 'El login chequea is_banned sin joinear la tabla de bans. Rendimiento en el punto más crítico.' },
];

const ROLES = [
  { role: 'USER',    id: 1, perms: ['Leer noticias', 'Crear reportes', 'Buscar perfiles y reportes', 'Participar en hilos', 'Administrar perfil y avatar'] },
  { role: 'AUDITOR', id: 2, perms: ['Todo lo del USER', 'Publicar y editar noticias', 'Distintivo en avatar', 'Sus sugerencias se destacan visualmente'] },
  { role: 'ADMIN',   id: 3, perms: ['Todo lo del AUDITOR', 'Ascender usuarios a cualquier rol', 'Banear usuarios temporal o permanentemente', 'Eliminar reportes y noticias'] },
];

const RELATIONS = [
  { from: 'roles',       to: 'users',         type: '1 ──<', note: 'un rol tiene muchos usuarios' },
  { from: 'users',       to: 'user_profiles', type: '1 ──1', note: 'perfil público separado de auth' },
  { from: 'users',       to: 'reports',       type: '1 ──<', note: 'un usuario crea muchos reportes' },
  { from: 'users',       to: 'news',          type: '1 ──<', note: 'auditores y admins publican noticias' },
  { from: 'users',       to: 'suggestions',   type: '1 ──<', note: 'un usuario hace muchas sugerencias' },
  { from: 'reports',     to: 'suggestions',   type: '1 ──<', note: 'un reporte tiene muchas sugerencias' },
  { from: 'suggestions', to: 'suggestions',   type: '1 ──<', note: 'self-ref: hilo anidado' },
];



// ─── STYLES ─────────────────────────────────────────────────────────────────

const S = {
  green:    'var(--green)',
  dim:      'rgba(255,255,255,0.38)',
  dimGreen: 'rgba(0,255,65,0.45)',
  red:      'rgba(255,100,100,0.9)',
  white:    'white',
  mono:     'var(--font-mono)',
};

// ─── OUTPUT RENDERERS ────────────────────────────────────────────────────────

function Row({ children }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', marginBottom: '0.25rem' }}>{children}</div>;
}

function Line({ color, children, indent = false }) {
  return (
    <span style={{ color, paddingLeft: indent ? '1.2rem' : 0, fontSize: indent ? '0.8em' : undefined, lineHeight: 1.7, display: 'block' }}>
      {children}
    </span>
  );
}

const OUTPUTS = {
help: () => (
  <Row>
    <Line color={S.dim}>Comandos disponibles:</Line>

    {[
      ['show tables;', 'lista las 6 entidades'],
      ['describe architecture;', '8 capas del backend'],
      ['explain decisions;', 'decisiones técnicas y por qué'],
      ['show relations;', 'relaciones entre entidades'],
      ['show roles;', 'permisos por rol'],

      ['whoami', 'autor del proyecto'],


      ['/terminal', 'cómo funciona la consola'],
      ['/project', 'información del proyecto'],
      ['/security', 'resumen de seguridad'],
      ['/docker', 'infraestructura containerizada'],
      ['/hack', 'easter egg'],
      ['/matrix', 'acceso al mainframe'],
      ['/coffee', 'combustible del desarrollador'],
      ['/ghost', 'visitante anónimo'],
      ['/cat', 'cyber cat'],

      ['clear', 'limpia la consola'],
    ].map(([cmd, hint], i) => (
      <span
        key={i}
        style={{
          display: 'block',
          fontFamily: S.mono,
          fontSize: '0.82rem',
          lineHeight: 1.8,
        }}
      >
        <span style={{ color: S.green }}>{cmd}</span>
        <span style={{ color: S.dim }}> — {hint}</span>
      </span>
    ))}
  </Row>
),
  tables: () => (
    <Row>
      {ENTITIES.map((e, i) => (
        <span key={i} style={{ display: 'block', lineHeight: 1.8 }}>
          <span style={{ color: S.green }}>▸ </span>
          <span style={{ color: S.white, fontWeight: 'bold' }}>{e.name}</span>
          <span style={{ color: S.dim, fontSize: '0.8em' }}> [{e.fields.join(', ')}]</span>
          <span style={{ display: 'block', paddingLeft: '1.2rem', color: S.dimGreen, fontSize: '0.78em' }}>{e.note}</span>
        </span>
      ))}
    </Row>
  ),
   whoami: () => (
    <Row>
      <Line color={S.green}>{' +---------------------------+ '}</Line>
      <Line color={S.dimGreen}>{' |          U T N            | '}</Line>
      <Line color={S.green}>{' |   PROGRAMACION III        | '}</Line>
      <Line color={S.dimGreen}>{' +---------------------------+ '}</Line>
      <Line color={S.dim}>{'  by Pedro Gianibelli — UTN Tecnicatura Universitaria en Programación (Prog III)'}</Line>
    </Row>
  ),konami: () => (
  <Row>
    <Line color={S.green}>CHEAT CODE ACCEPTED</Line>
    <Line color={S.dim}>
      +30 puntos por revisar el proyecto completo.
    </Line>
    <Line color={S.dimGreen}>
      Achievement unlocked: Curious Professor
    </Line>
  </Row>
),
  terminal: () => (
  <Row>
    <Line color={S.green}>ACCESS DENIED TERMINAL v1.0</Line>
    <Line color={S.dim}>
      Esta consola es una simulación interactiva del backend del proyecto.
    </Line>
    <Line color={S.dim}>
      Los comandos muestran entidades, arquitectura, relaciones y
      decisiones técnicas implementadas.
    </Line>
    <Line color={S.dimGreen}>
      Tip: explorá los comandos ocultos además de /help.
    </Line>
  </Row>
),

project: () => (
  <Row>
    <Line color={S.green}>ACCESS DENIED</Line>
    <Line color={S.dim}>
      Proyecto final de Programación III.
    </Line>
    <Line color={S.dim}>
      Comunidad orientada a hacking ético y ciberseguridad.
    </Line>
    <Line color={S.dim}>
      React · CodeIgniter 4 · MySQL · JWT · Docker.
    </Line>
  </Row>
),

hack: () => (
  <Row>
    <Line color={S.green}>{'██╗  ██╗ █████╗  ██████╗██╗  ██╗'}</Line>
    <Line color={S.green}>{'██║  ██║██╔══██╗██╔════╝██║ ██╔╝'}</Line>
    <Line color={S.green}>{'███████║███████║██║     █████╔╝ '}</Line>
    <Line color={S.green}>{'██╔══██║██╔══██║██║     ██╔═██╗ '}</Line>
    <Line color={S.green}>{'██║  ██║██║  ██║╚██████╗██║  ██╗'}</Line>
    <Line color={S.green}>{'╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝'}</Line>
    <Line color={S.dim}>Hack the planet.</Line>
  </Row>
),

matrix: () => (
  <Row>
    <Line color={S.green}>01001000 01000001 01000011 01001011</Line>
    <Line color={S.dimGreen}>ACCESSING MAINFRAME...</Line>
    <Line color={S.green}>█ █ █ █ █ █ █ █ █ █ █ █ █</Line>
    <Line color={S.dim}>Access granted.</Line>
  </Row>
),

docker: () => (
  <Row>
    <Line color={S.green}>[services:]</Line>
    <Line color={S.dim}>frontend → React + Vite</Line>
    <Line color={S.dim}>backend → CodeIgniter 4</Line>
    <Line color={S.dim}>database → MySQL 8</Line>
    <Line color={S.dim}>phpmyadmin</Line>
  </Row>
),

coffee: () => (
  <Row>
    <Line color={S.green}>{' ( ('}</Line>
    <Line color={S.green}>{'  ) )'}</Line>
    <Line color={S.green}>{'........'}</Line>
    <Line color={S.green}>{'|      |]'}</Line>
    <Line color={S.green}>{'\\      /'}</Line>
    <Line color={S.green}>{' `----\''}</Line>
    <Line color={S.dim}>Developer fuel detected.</Line>
  </Row>
),

ghost: () => (
  <Row>
    <Line color={S.green}>{' .-. '}</Line>
    <Line color={S.green}>{'(o o)'}</Line>
    <Line color={S.green}>{'| O |'}</Line>
    <Line color={S.green}>{'|   |'}</Line>
    <Line color={S.green}>{'\'~~~\''}</Line>
    <Line color={S.dim}>Anonymous visitor detected.</Line>
  </Row>
),

cat: () => (
  <Row>
    <Line color={S.green}>{'/\\_/\\\\'}</Line>
    <Line color={S.green}>{'( o.o )'}</Line>
    <Line color={S.green}>{' > ^ <'}</Line>
    <Line color={S.dim}>Cyber cat online.</Line>
  </Row>
),

security: () => (
  <Row>
    <Line color={S.green}>[ SECURITY OVERVIEW ]</Line>
    <Line color={S.dim}>• JWT Authentication</Line>
    <Line color={S.dim}>• Roles & Permissions</Line>
    <Line color={S.dim}>• Soft Delete Strategy</Line>
    <Line color={S.dim}>• Input Validation</Line>
    <Line color={S.dim}>• Layered Architecture</Line>
  </Row>
),
  architecture: () => (
    <Row>
      {LAYERS.map((l, i) => (
        <span key={i} style={{ display: 'block', fontFamily: S.mono, fontSize: '0.82rem', lineHeight: 1.8 }}>
          <span style={{ color: S.dimGreen }}>{String(i + 1).padStart(2, '0')} </span>
          <span style={{ color: S.white }}>{l.name}</span>
          <span style={{ color: S.dim, fontSize: '0.88em' }}> → {l.desc}</span>
        </span>
      ))}
    </Row>
  ),
  decisions: () => (
    <Row>
      {DECISIONS.map((d, i) => (
        <span key={i} style={{ display: 'block', lineHeight: 1.7, marginBottom: '0.3rem' }}>
          <span style={{ color: S.green, fontSize: '0.8em' }}>▸ </span>
          <span style={{ color: S.white, fontWeight: 'bold' }}>{d.title}</span>
          <span style={{ display: 'block', paddingLeft: '1.2rem', color: S.dim, fontSize: '0.8em', lineHeight: 1.7 }}>{d.body}</span>
        </span>
      ))}
    </Row>
  ),

  relations: () => (
    <Row>
      {RELATIONS.map((r, i) => (
        <span key={i} style={{ display: 'block', fontFamily: S.mono, fontSize: '0.82rem', lineHeight: 1.8 }}>
          <span style={{ color: S.white }}>{r.from}</span>
          <span style={{ color: S.dimGreen }}> {r.type} </span>
          <span style={{ color: S.white }}>{r.to}</span>
          <span style={{ color: S.dim, fontSize: '0.85em' }}> — {r.note}</span>
        </span>
      ))}
    </Row>
  ),
  roles: () => (
    <Row>
      {ROLES.map((r, i) => (
        <span key={i} style={{ display: 'block', lineHeight: 1.7, marginBottom: '0.3rem' }}>
          <span style={{ color: S.green, fontWeight: 'bold' }}>{r.role}</span>
          <span style={{ color: S.dim, fontSize: '0.8em' }}> (id={r.id})</span>
          {r.perms.map((p, pi) => (
            <span key={pi} style={{ display: 'block', paddingLeft: '1.2rem', color: S.dim, fontSize: '0.8em' }}>
              <span style={{ color: S.dimGreen }}>▸ </span>{p}
            </span>
          ))}
        </span>
      ))}
    </Row>
  ),
};

const CMD_MAP = {
  '/help':                  OUTPUTS.help,
  'show tables;':           OUTPUTS.tables,
  'describe architecture;': OUTPUTS.architecture,
  'explain decisions;':     OUTPUTS.decisions,
  'show relations;':        OUTPUTS.relations,
  'show roles;':            OUTPUTS.roles,
  'whoami':  OUTPUTS.whoami,
  '/terminal': OUTPUTS.terminal,
'/project': OUTPUTS.project,
'/hack': OUTPUTS.hack,
'/matrix': OUTPUTS.matrix,
'/docker': OUTPUTS.docker,
'/coffee': OUTPUTS.coffee,
'/ghost': OUTPUTS.ghost,
'/cat': OUTPUTS.cat,
'/security': OUTPUTS.security,
'iddqd': OUTPUTS.konami,
};

// ─── BOOT SEQUENCE ───────────────────────────────────────────────────────────

const BOOT_SEQUENCE = [
  { text: 'Iniciando sistema...',         color: 'rgba(255,255,255,0.45)' },
  { text: 'Conectando a base de datos...', color: 'rgba(255,255,255,0.45)' },
  { text: 'Cargando entidades [6/6]...',  color: 'rgba(255,255,255,0.45)' },
  { text: 'Verificando permisos...',      color: 'rgba(255,255,255,0.45)' },
  { text: 'Sistema listo.',               color: S.green },
  { text: '',                             color: undefined },
  { text: 'Escribí /help para ver los comandos disponibles.', color: S.dim, italic: true },
];

// ─── TERMINAL ────────────────────────────────────────────────────────────────

export default function AboutSection() {
  const [phase, setPhase]         = useState('idle');   // idle | booting | ready
  const [bootLines, setBootLines] = useState([]);
  const [history, setHistory]     = useState([]);
  const [input, setInput]         = useState('');
  const bodyRef  = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll solo dentro del body de la terminal
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [bootLines, history]);

  // Boot animado línea por línea
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

  const handleKey = (e) => {
    if (e.key !== 'Enter') return;
    const raw = input.trim();
    const cmd = raw.toLowerCase();
    if (!cmd) return;

if (phase === 'idle') {
  if (cmd === '/accessdeniedinit') {
    setHistory([]);
    setBootLines([]);
    setInput('');
    runBoot();
  } else {
        setHistory(prev => [...prev,
          { type: 'cmd', content: raw },
          { type: 'err', content: <>Acceso denegado. Iniciá el sistema con <span style={{ color: S.green }}>/AccessDeniedInit</span></> },
        ]);
        setInput('');
      }
      return;
    }

    if (phase !== 'ready') return;

    const newEntry = [{ type: 'cmd', content: raw }];

    if (cmd === 'clear') {
      setHistory([]);
      setBootLines([...BOOT_SEQUENCE]);
      setInput('');
      return;
    }

    if (CMD_MAP[cmd]) {
      newEntry.push({ type: 'out', content: CMD_MAP[cmd]() });
    } else {
      newEntry.push({
        type: 'err',
        content: <>Comando no reconocido: <span style={{ color: S.white }}>{raw}</span> — escribí <span style={{ color: S.green }}>/help</span></>,
      });
    }

    setHistory(prev => [...prev, ...newEntry]);
    setInput('');
  };

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

        {/* ── TERMINAL ── */}
        <div
          className="about-terminal"
          style={{
            width: '100%',
            maxWidth: '780px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',   // nunca se expande fuera
          }}
        >
          {/* Barra superior */}
          <div className="terminal-bar">
            <span className="t-dot red" />
            <span className="t-dot yellow" />
            <span className="t-dot green" />
            <span className="terminal-title">TPFINAL@hackforum:~$</span>
          </div>

          {/* Body con altura fija y scroll interno */}
          <div
            ref={bodyRef}
            className="terminal-body"
            style={{
              height: '460px',
              overflowY: 'auto',
              overflowX: 'hidden',
              cursor: 'text',
              scrollBehavior: 'smooth',
            }}
            onClick={() => inputRef.current?.focus()}
          >

            {/* Estado idle: solo mensaje de espera */}
            {phase === 'idle' && history.length === 0 && (
              <span className="t-output" style={{ color: S.dim, fontStyle: 'italic' }}>
                Sistema en espera. Escribí <span style={{ color: S.green, fontStyle: 'normal' }}>/AccessDeniedInit</span> para continuar.
              </span>
            )}

            {/* Historial idle (errores antes del boot) */}
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
  bootLines
    .filter(Boolean)
    .map((line, i) => (
      <span
        key={i}
        className="t-output"
        style={{
          color: line?.color,
          fontStyle: line?.italic ? 'italic' : undefined,
          paddingLeft: 0,
        }}
      >
        {line?.text}
      </span>
    ))}
            {/* Historial de comandos post-boot */}
            {phase === 'ready' && history.map((e, i) => (
              <div key={i} style={{ marginBottom: '0.15rem' }}>
                {e.type === 'cmd' && (
                  <span><span className="t-prompt">db@hackforum:~$ </span><span className="t-cmd">{e.content}</span></span>
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