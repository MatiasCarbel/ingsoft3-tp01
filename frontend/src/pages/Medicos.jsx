import { useState, useEffect } from 'react';
import api from '../api';

export default function Medicos() {
  const [medicos, setMedicos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', especialidad: '' });

  const cargarMedicos = async () => {
    const res = await api.get('/medicos/');
    setMedicos(res.data);
  };

  useEffect(() => { cargarMedicos(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    await api.post('/medicos/', nuevo);
    setNuevo({ nombre: '', especialidad: '' });
    cargarMedicos();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Médicos</h2>
      <form onSubmit={guardar} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <input type="text" placeholder="Nombre (Ej: Dr. García)" required value={nuevo.nombre} onChange={e => setNuevo({...nuevo, nombre: e.target.value})} style={{ marginRight: '10px' }} />
        <input type="text" placeholder="Especialidad (Ej: Pediatría)" required value={nuevo.especialidad} onChange={e => setNuevo({...nuevo, especialidad: e.target.value})} style={{ marginRight: '10px' }} />
        <button type="submit">Agregar Médico</button>
      </form>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>ID</th><th>Nombre</th><th>Especialidad</th></tr></thead>
        <tbody>
          {medicos.map(m => (<tr key={m.id}><td>{m.id}</td><td>{m.nombre}</td><td>{m.especialidad}</td></tr>))}
        </tbody>
      </table>
    </div>
  );
}