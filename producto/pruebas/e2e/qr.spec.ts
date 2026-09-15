// Del evento al QR, y del QR al aporte (`M06` · `QR-01` … `QR-04`).
//
// Se recorre el ejemplo del requerimiento entero: se crea un encuentro, se
// genera su material, alguien entra por ese enlace, **dice que en realidad está
// en otro evento**, y cuenta un problema.
//
// Tiene que quedar un solo aporte con tres contextos distinguibles y sin
// asistencia en ninguno de los dos eventos.

import { test, expect } from "@playwright/test";

const marca = () => `qr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

test("se puede crear un encuentro desde administración", async ({ page }) => {
  const titulo = `Mesa de prueba ${marca()}`;
  await page.goto("/administracion");
  await expect(page.locator("h1")).toContainText(/crear un encuentro/i);
  // Una pantalla interna sin autorización es aceptable en desarrollo; que nadie
  // se entere, no.
  await expect(page.locator(".bo-sidebar")).toContainText(/sin permisos/i);
  await expect(page.locator(".bo-sidebar")).toContainText(/no desplegar/i);

  await page.fill("#enc-titulo", titulo);
  await page.selectOption("#enc-modalidad", "presencial");
  await page.fill("#enc-fecha", "2026-12-15T09:00");
  await page.fill("#enc-lugar", "Caseta comunal de prueba");
  await page.getByRole("button", { name: /crear encuentro/i }).click();

  await expect(page.locator("body")).toContainText(titulo, { timeout: 20_000 });
  // Y sale en la portada: la agenda pública y la administración usan el mismo
  // registro.
  await page.goto("/");
  await expect(page.locator("[data-prueba='agenda']")).toContainText(titulo);
});

test("un encuentro produce un QR con dirección legible, sin servicio externo", async ({ page }) => {
  await page.goto("/administracion");
  const encuentro = page.locator("#enl-encuentro");
  await expect(encuentro).toBeVisible();
  await encuentro.selectOption({ index: 1 });
  await page.selectOption("#enl-pieza", "afiche");
  await page.fill("#enl-source", "afiche-parque");
  await page.getByRole("button", { name: /generar enlace y qr/i }).click();

  const material = page.locator(".bo-record-card").first();
  await expect(material).toBeVisible({ timeout: 20_000 });
  // El QR se dibuja aquí: `QR-01` prohíbe depender de un proveedor externo.
  await expect(material.locator("svg")).toBeVisible();
  // Y la dirección corta va al lado, porque quien no puede escanear teclea.
  await expect(material.locator("code")).toContainText(/\/e\/[A-Z0-9]{6,12}/);
  // Las UTMs se muestran diciendo lo que son.
  await expect(material).toContainText(/no dan permisos/i);
});

test("escanear el QR pregunta, no afirma que asististe", async ({ page }) => {
  await page.goto("/administracion");
  const url = (await page.locator(".bo-record-card code").first().innerText()).trim();

  await page.goto(url + "?utm_source=whatsapp&utm_medium=mensajeria");
  const confirmar = page.locator("[data-prueba='confirmar-evento']");
  await expect(confirmar).toBeVisible();
  await expect(confirmar).toContainText(/¿es este el encuentro/i);
  // La frase que el requerimiento obliga: abrir un QR no es haber asistido.
  await expect(confirmar).toContainText(/no te inscribe ni registra que hayas asistido/i);
  // Y siempre se puede aportar sin evento.
  await expect(confirmar.getByRole("button", { name: /sin estar en un evento/i })).toBeVisible();
});

test("un enlace que no existe NO inventa un evento", async ({ page }) => {
  // `QR-04`: «ante ID inexistente se muestra selector/agenda sin inventar
  // evento ni asociación».
  await page.goto("/e/NOEXISTE9");
  await expect(page.locator("h1")).toContainText(/no corresponde a ningún encuentro/i);
  await expect(page.locator("[data-prueba='confirmar-evento']")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /sin estar en un encuentro/i })).toBeVisible();
});

test("el caso completo: entra por el QR de A, dice que está en B, cuenta lo de C", async ({ page }) => {
  await page.goto("/administracion");
  const url = (await page.locator(".bo-record-card code").first().innerText()).trim();

  await page.goto(url);
  await page.locator("[data-prueba='confirmar-evento']")
    .getByRole("button", { name: /cambiar de evento/i }).click();

  const cambiar = page.locator("[data-prueba='cambiar-evento']");
  await expect(cambiar).toBeVisible();
  // Se escoge otro de la agenda publicada.
  await cambiar.locator("button.pc-action").first().click();

  await expect(page).toHaveURL(/\/participar/, { timeout: 20_000 });
  // Y el relato se cuenta normal: el contexto viaja aparte y **no se pregunta
  // otra vez**.
  await page.fill("#relato", "el agua llega turbia en una vereda del municipio C");
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 25_000 });
});
