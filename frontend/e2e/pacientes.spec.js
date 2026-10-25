import { expect, test } from '@playwright/test'

test('crear un paciente lo muestra en la lista, y borrarlo lo saca', async ({ page }) => {
  await page.goto('/')
  const nombreUnico = `e2e ${Date.now()}`
  const dniUnico = `${Date.now()}`.slice(-8)

  await page.getByLabel('Nombre del paciente').fill(nombreUnico)
  await page.getByLabel('Apellido del paciente').fill('UI Test')
  await page.getByLabel('DNI del paciente').fill(dniUnico)
  await page.getByLabel('Teléfono del paciente').fill('3511111111')
  
  await page.getByRole('button', { name: 'Guardar paciente' }).click()
  
  // Verificamos que aparezca
  await expect(page.getByText(nombreUnico)).toBeVisible()
  
  // Borramos
  await page.getByRole('button', { name: `Borrar ${nombreUnico}` }).click()
  
  // Verificamos que ya no esté
  await expect(page.getByText(nombreUnico)).toHaveCount(0)
})

test('un DNI corto muestra el error y no crea nada', async ({ page }) => {
  await page.goto('/')
  const nombreUnico = `fail ${Date.now()}`
  
  await page.getByLabel('Nombre del paciente').fill(nombreUnico)
  await page.getByLabel('Apellido del paciente').fill('UI Test')
  await page.getByLabel('DNI del paciente').fill('12') // Inválido
  
  await page.getByRole('button', { name: 'Guardar paciente' }).click()
  
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page.getByText(nombreUnico)).toHaveCount(0)
})

test('la carga inicial muestra el título de Gestión de Pacientes', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Gestión de Pacientes' })).toBeVisible()
})