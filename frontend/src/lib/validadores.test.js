// frontend/src/lib/validadores.test.js
import { describe, expect, it, vi } from 'vitest';
import { validarPaciente } from './validadores.js';
import { registrarPaciente } from '../api/pacientesService.js';

describe('validadores y api de pacientes', () => {
  // --- 1. TEST PARAMETRIZADO (Lo exige el TP) ---
  it.each([
    ['vacío', '', ''],
    ['letras', 'abcdefg', ''],
    ['corto', '123456', '']
  ])('rechaza un DNI %s', (_caso, dni, tel) => {
    const resultado = validarPaciente(dni, tel);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('El DNI debe ser numérico y tener 7 u 8 dígitos.');
  });

  // --- 2. CASO DE ERROR ---
  it('rechaza teléfono con cantidad incorrecta de dígitos', () => {
    const resultado = validarPaciente('12345678', '12345');
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toContain('exactamente 10 números');
  });

  // --- 3. TEST CON MOCK ---
  it('llama a la API con los datos correctos sin tocar red', async () => {
    // Arrange: Creamos un impostor de Axios (clienteApiMock)
    const clienteApiMock = {
      // Configuramos el mock para que devuelva una promesa resuelta
      post: vi.fn().mockResolvedValue({ data: { id: 1, nombre: 'Juan' } })
    };
    const paciente = { nombre: 'Juan', dni: '12345678' };

    // Act: Ejecutamos pasándole el impostor en lugar del Axios real
    await registrarPaciente(paciente, clienteApiMock);

    // Assert: Verificamos la INTERACCIÓN (¿Se llamó a la API con la URL y los datos correctos?)
    expect(clienteApiMock.post).toHaveBeenCalledWith('/pacientes/', paciente);
  });
});