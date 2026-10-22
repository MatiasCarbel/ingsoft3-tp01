// frontend/src/lib/validadores.js

export function validarPaciente(dni, telefono) {
  const regexNumeros = /^[0-9]+$/;
  
  if (!regexNumeros.test(dni) || dni.length < 7 || dni.length > 8) {
    return { valido: false, error: 'El DNI debe ser numérico y tener 7 u 8 dígitos.' };
  }
  
  if (telefono && (!regexNumeros.test(telefono) || telefono.length !== 10)) {
    return { valido: false, error: 'El teléfono debe tener exactamente 10 números.' };
  }

  return { valido: true, error: null };
}

// Función sin tests para romper el Quality Gate a propósito
export function calcularPrioridadTurno(edad, esUrgencia) {
  if (edad >= 65 && esUrgencia) return 'ROJO';
  if (edad >= 65 && !esUrgencia) return 'AMARILLO';
  if (edad < 65 && esUrgencia) return 'NARANJA';
  return 'VERDE';
}