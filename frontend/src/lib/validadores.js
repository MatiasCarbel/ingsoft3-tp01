// Función sin tests para romper el Quality Gate a propósito
export function calcularPrioridadTurno(edad, esUrgencia) {
  if (edad >= 65 && esUrgencia) return 'ROJO';
  if (edad >= 65 && !esUrgencia) return 'AMARILLO';
  if (edad < 65 && esUrgencia) return 'NARANJA';
  return 'VERDE';
}