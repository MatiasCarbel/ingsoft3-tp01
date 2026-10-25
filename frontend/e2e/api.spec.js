import { expect, test } from '@playwright/test'

const API = process.env.API_BASE_URL || 'http://localhost:8000'

async function listar(request) {
  const r = await request.get(`${API}/pacientes/`)
  expect(r.status()).toBe(200)
  return await r.json()
}

test('el alta guarda en la base de verdad, y el borrado la saca', async ({ request }) => {
  const dniUnico = `${Date.now()}`.slice(-8)
  const nombre = `api-${Date.now()}`
  
  // Alta
  const alta = await request.post(`${API}/pacientes/`, { data: { nombre, apellido: 'Test', dni: dniUnico, telefono: '3511234567' } })
  expect(alta.status()).toBe(200)
  const creada = await alta.json()

  // Verificación
  const lista = await listar(request)
  expect(lista.some(p => p.dni === dniUnico)).toBe(true)

  // Borrado
  const borrado = await request.delete(`${API}/pacientes/${creada.id}`)
  expect(borrado.status()).toBe(200)

  // Verificación final
  const despues = await listar(request)
  expect(despues.some(p => p.dni === dniUnico)).toBe(false)
})

test('un DNI corto es rechazado por la api, y no crea nada', async ({ request }) => {
  const antes = await listar(request)
  const alta = await request.post(`${API}/pacientes/`, { data: { nombre: 'Malo', apellido: 'Test', dni: '123', telefono: '3511234567' } })
  
  expect(alta.status()).toBe(400)
  const despues = await listar(request)
  expect(despues.length).toBe(antes.length)
})

test('la ruta health devuelve status ok', async ({ request }) => {
  const r = await request.get(`${API}/health`)
  expect(r.status()).toBe(200)
  const data = await r.json()
  expect(data.status).toBe('ok')
})