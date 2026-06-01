import { useState, useEffect, useRef } from 'react';

const STATS = [
  { value: 4200,  suffix: '+', label: 'Vulnerabilidades documentadas' },
  { value: 150000,    suffix: '+', label: 'Reportes'  },
  { value: 100,     suffix: '%', label: 'Discreción y confidencialidad'      },
  { value: 250000,  suffix: '+',  label: 'Usuarios registrados'               },
];

function useCountUp(target, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return val;
}

function StatItem({ value, suffix, label, animate }) {
  const count = useCountUp(value, 1600, animate);
  return (
    <div className="stat-item">
      <span className="stat-number">{animate ? count : 0}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function StatsBar() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="stats-bar" ref={ref}>
      <div className="stats-inner">
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} animate={visible} />
        ))}
      </div>
    </div>
  );
}