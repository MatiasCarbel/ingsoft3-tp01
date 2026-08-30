import { useState, useEffect } from 'react';
import api from '../api';

export default function Turnos() {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [nuevoTurno, setNuevoTurno] = useState({ paciente_id: '', medico_id: '', fecha_hora: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/pacientes/').then(res => setPacientes(res.data));
    api.get('/medicos/').then(res => setMedicos(res.data));
  }, []);

  const agendar = async (e) => {
    e.preventDefault();
    setMensaje(''); setError('');

    if (!nuevoTurno.paciente_id || !nuevoTurno.medico_id || !nuevoTurno.fecha_hora) {
      setError('Complete todos los campos.'); return;
    }

    try {
      await api.post('/turnos/', nuevoTurno);
      setMensaje('¡Turno agendado!');
      setNuevoTurno({ paciente_id: '', medico_id: '', fecha_hora: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al agendar');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Agendar Nuevo Turno</h2>
      <div style={{ padding: '15px', border: '1px solid #ccc', maxWidth: '500px' }}>
        <form onSubmit={agendar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <label>Paciente:</label>
          <select value={nuevoTurno.paciente_id} onChange={e => setNuevoTurno({...nuevoTurno, paciente_id: e.target.value})}>
            <option value="">-- Seleccione Paciente --</option>
            {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido} (DNI: {p.dni})</option>)}
          </select>

          <label>Médico:</label>
          <select value={nuevoTurno.medico_id} onChange={e => setNuevoTurno({...nuevoTurno, medico_id: e.target.value})}>
            <option value="">-- Seleccione Médico --</option>
            {medicos.map(m => <option key={m.id} value={m.id}>{m.nombre} ({m.especialidad})</option>)}
          </select>

          <label>Fecha y Hora:</label>
          <input type="datetime-local" required value={nuevoTurno.fecha_hora} onChange={e => setNuevoTurno({...nuevoTurno, fecha_hora: e.target.value})} />

          <button type="submit">Guardar Turno</button>
        </form>
        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}