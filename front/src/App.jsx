import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Noticias from './pages/Noticias';
import Perfil from './pages/Perfil';
import Reportes from './pages/Reportes';
import Panel from './pages/Panel';
import './styles/global.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/perfil/:username" element={<Perfil />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;