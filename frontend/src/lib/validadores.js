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

export function calcularCosto(obraSocial) {
  if (obraSocial === 'OSDE') return 2000;
  if (obraSocial === 'SWISS') return 2500;
  if (obraSocial === 'PAMI') return 0;
  return 5000;
}

export function funcionGiganteParaRomperCoverage(valor) {
  let resultado = 0;
  if (valor > 10) resultado += 1;
  else resultado -= 1;
  
  if (valor > 20) resultado += 2;
  else resultado -= 2;
  
  if (valor > 30) resultado += 3;
  else resultado -= 3;
  
  if (valor > 40) resultado += 4;
  else resultado -= 4;
  
  if (valor > 50) resultado += 5;
  else resultado -= 5;
  
  if (valor === 99) {
    resultado = 1000;
    console.log("Camino oculto 1");
  }
  
  if (valor === 100) {
    resultado = 2000;
    console.log("Camino oculto 2");
  }
  
  return resultado;
}