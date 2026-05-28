// App.jsx — router principal
// Cuando instales react-router-dom, descomentar las rutas comentadas

import Landing from './pages/Landing';

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Forum  from './pages/Forum';
// import Profile from './pages/Profile';

function App() {
  // Con react-router (descomenta cuando lo instales):
  // return (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/"        element={<Landing />} />
  //       <Route path="/foro"    element={<Forum />}   />
  //       <Route path="/perfil"  element={<Profile />} />
  //     </Routes>
  //   </BrowserRouter>
  // );

  // Por ahora sólo el landing:
  return <Landing />;
}

export default App;