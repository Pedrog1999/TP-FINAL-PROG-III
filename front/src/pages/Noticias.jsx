import { useState } from 'react';
import Sidebar from '../components/app/Sidebar';
import Topbar from '../components/app/Topbar';
import NewsCard from '../components/app/NewsCard';
import NewsDetail from '../components/app/NewsDetail';
import styles from './Noticias.module.css';

const MOCK = [
  {
    id: 1,
    title: 'Zero-day en kernel de Linux expone millones de servidores a ejecución remota de código',
    body: 'Investigadores de Qualys descubrieron una vulnerabilidad crítica en el subsistema NFS del kernel de Linux que permite a atacantes no autenticados ejecutar código arbitrario con privilegios de root. La falla, catalogada como CVE-2024-8821, afecta a versiones 5.14 a 6.9. Red Hat ya publicó parches de emergencia para RHEL 8 y 9.',
    tag: 'critical',
    date: 'Hace 2 horas',
    featured: true,
    author: 'Redacción',
    views: 4821,
  },
  {
    id: 2,
    title: 'Nuevo ransomware BlackSuit ataca hospitales en Latinoamérica',
    body: 'El grupo opera con técnicas de doble extorsión y ya afectó a 14 instituciones de salud.',
    tag: 'exploit',
    date: 'Hace 5 horas',
    featured: false,
    author: 'SecurityNews',
    views: 1200,
  },
  {
    id: 3,
    title: 'APT29 usa nuevas técnicas de evasión en ataques contra Europa',
    body: 'El grupo ruso conocido como Cozy Bear incorporó esteganografía en documentos Word para C2.',
    tag: 'exploit',
    date: 'Hace 8 horas',
    featured: false,
    author: 'ThreatIntel',
    views: 890,
  },
  {
    id: 4,
    title: 'Campaña masiva de phishing suplanta al Banco Nación en Argentina',
    body: 'Más de 40.000 correos fraudulentos enviados en las últimas 48hs usando dominios .com.ar falsos.',
    tag: 'news',
    date: 'Ayer',
    featured: false,
    author: 'CSIRT Argentina',
    views: 3400,
  },
];

export default function Noticias() {
  const [selected, setSelected] = useState(null);
  const username = localStorage.getItem('username') || 'user';

  if (selected) {
    return (
      <div className={styles.page}>
        <Sidebar />
        <div className={styles.main}>
          <Topbar pathname="/noticias" username={username} />
          <div className={styles.content}>
            <NewsDetail news={selected} onBack={() => setSelected(null)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar pathname="/noticias" username={username} />
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
               Últimas noticias <span className={styles.badge}>12 nuevas</span>
            </div>
            <select className={styles.filter}>
              <option>Todas las categorías</option>
              <option>Exploit</option>
              <option>CVE</option>
              <option>Zero-day</option>
            </select>
          </div>

          <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {MOCK.map((n) => (
              <NewsCard
                key={n.id}
                title={n.title}
                body={n.body}
                tag={n.tag}
                date={n.date}
                featured={n.featured}
                onClick={() => setSelected(n)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}