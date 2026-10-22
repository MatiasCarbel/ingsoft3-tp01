// frontend/src/api/pacientesService.js

// Recibe "clienteApi" por parámetro (Inyección de Dependencias) para poder mockearlo en los tests
export async function registrarPaciente(paciente, clienteApi) {
  const respuesta = await clienteApi.post('/pacientes/', paciente);
  return respuesta.data;
}