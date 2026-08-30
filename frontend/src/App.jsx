import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Pacientes from './pages/Pacientes';
import Medicos from './pages/Medicos';
import Turnos from './pages/Turnos';
import Agenda from './pages/Agenda';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ background: '#333', padding: '15px', color: 'white' }}>
          <h1 style={{ display: 'inline', marginRight: '30px', fontSize: '20px' }}>🏥 Clínica App</h1>
          <Link to="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Pacientes</Link>
          <Link to="/medicos" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Médicos</Link>
          <Link to="/turnos" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Agendar Turno</Link>
          <Link to="/agenda" style={{ color: 'white', textDecoration: 'none' }}>Panel del Día</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Pacientes />} />
          <Route path="/medicos" element={<Medicos />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/agenda" element={<Agenda />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;