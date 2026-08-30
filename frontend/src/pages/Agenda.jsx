import { useState, useEffect } from 'react';
import api from '../api';

export default function Agenda() {
  const [turnos, setTurnos] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState('');

  useEffect(() => {
    api.get('/medicos/').then(res => setMedicos(res.data));
  }, []);

  const cargarTurnos = async () => {
    try {
      const url = medicoSeleccionado ? `/medicos/${medicoSeleccionado}/turnos` : '/turnos/';
      const res = await api.get(url);
      setTurnos(res.data);
    } catch (err) { console.error("Error", err); }
  };

  useEffect(() => { cargarTurnos(); }, [medicoSeleccionado]);

  // Nueva función para eliminar el turno
  const eliminarTurno = async (id) => {
    if (!window.confirm('¿Estás seguro de que querés cancelar y eliminar este turno?')) return;
    
    try {
      await api.delete(`/turnos/${id}`);
      cargarTurnos(); // Recarga la tabla si se eliminó con éxito
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al eliminar el turno');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Agenda de Turnos</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Filtrar por Médico:</label>
        <select value={medicoSeleccionado} onChange={(e) => setMedicoSeleccionado(e.target.value)}>
          <option value="">Todos los médicos</option>
          {medicos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>ID</th><th>Paciente</th><th>Médico</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {turnos.map(turno => {
            // Evaluamos si el turno es en el futuro para mostrar el botón
            const esFuturo = new Date(turno.fecha_hora) > new Date();

            return (
              <tr key={turno.id}>
                <td>{turno.id}</td>
                <td>{turno.paciente.nombre} {turno.paciente.apellido}</td> 
                <td>{turno.medico.nombre}</td>
                <td>{new Date(turno.fecha_hora).toLocaleString()}</td>
                <td style={{ fontWeight: 'bold' }}>{turno.estado}</td>
                <td>
                  {esFuturo ? (
                    <button 
                      onClick={() => eliminarTurno(turno.id)} 
                      style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      Cancelar Turno
                    </button>
                  ) : (
                    <span style={{ color: 'gray', fontStyle: 'italic' }}>Turno pasado</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}