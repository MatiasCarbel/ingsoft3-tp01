import { useState, useEffect } from 'react';
import api from '../api';

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [nuevoPaciente, setNuevoPaciente] = useState({ nombre: '', apellido: '', dni: '', telefono: '' });
  const [error, setError] = useState('');

  useEffect(() => { cargarPacientes(); }, []);

  const cargarPacientes = async () => {
    const respuesta = await api.get('/pacientes/');
    setPacientes(respuesta.data);
  };

const registrarPaciente = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación Frontend: DNI y Teléfono
    const regexNumeros = /^[0-9]+$/;
    
    if (!regexNumeros.test(nuevoPaciente.dni) || nuevoPaciente.dni.length < 7 || nuevoPaciente.dni.length > 8) {
      setError('El DNI debe ser numérico y tener 7 u 8 dígitos.');
      return;
    }
    
    if (nuevoPaciente.telefono && (!regexNumeros.test(nuevoPaciente.telefono) || nuevoPaciente.telefono.length !== 10)) {
      setError('El teléfono debe tener exactamente 10 números (sin guiones ni espacios).');
      return;
    }

    try {
      await api.post('/pacientes/', nuevoPaciente);
      setNuevoPaciente({ nombre: '', apellido: '', dni: '', telefono: '' });
      cargarPacientes();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrar');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Pacientes</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>Nuevo Paciente</h3>
        <form onSubmit={registrarPaciente} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Nombre" required value={nuevoPaciente.nombre} onChange={(e) => setNuevoPaciente({...nuevoPaciente, nombre: e.target.value})} />
          <input type="text" placeholder="Apellido" required value={nuevoPaciente.apellido} onChange={(e) => setNuevoPaciente({...nuevoPaciente, apellido: e.target.value})} />
          <input type="number" placeholder="DNI" required value={nuevoPaciente.dni} onChange={(e) => setNuevoPaciente({...nuevoPaciente, dni: e.target.value})} />
          <input type="text" placeholder="Teléfono" value={nuevoPaciente.telefono} onChange={(e) => setNuevoPaciente({...nuevoPaciente, telefono: e.target.value})} />
          <button type="submit">Guardar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>ID</th><th>Nombre y Apellido</th><th>DNI</th><th>Teléfono</th></tr></thead>
        <tbody>
          {pacientes.map(pac => (
            <tr key={pac.id}>
              <td>{pac.id}</td>
              <td>{pac.nombre} {pac.apellido}</td>
              <td>{pac.dni}</td>
              <td>{pac.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}