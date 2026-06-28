import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Noticias from './pages/Noticias';
import Perfil from './pages/Perfil';
import Panel from './pages/Panel';
import './styles/global.css';
import Reportes from './pages/Reportes';
import ReporteDetalle from './pages/ReporteDetalle';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/perfil/:username" element={<Perfil />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/reportes/:id" element={<ReporteDetalle />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;