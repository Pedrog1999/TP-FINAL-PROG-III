import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Noticias from './pages/Noticias';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/noticias" element={<Noticias />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;