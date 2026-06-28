import Sidebar from '../components/app/Sidebar';
import Topbar from '../components/app/Topbar';

export default function Reportes() {
  const username = localStorage.getItem('username') || 'user';

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117' }}>
      <Sidebar />
      <div style={{ marginLeft: 220 }}>
        <Topbar pathname="/reportes" username={username} />
        <div style={{ padding: 20, color: '#7d8590' }}>Sección de reportes en construcción.</div>
      </div>
    </div>
  );
}