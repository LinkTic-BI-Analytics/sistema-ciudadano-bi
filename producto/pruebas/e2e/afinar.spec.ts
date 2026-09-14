// Afinar lo que la persona contó, **después** de haberlo recibido.
//
// El orden es la regla, no una preferencia de pantalla: `N02` y `DAT-01` dicen
// que la recepción no depende de nada más. Primero queda registrado y con
// comprobante; afinar es opcional y se puede abandonar en cualquier punto sin
// perder nada.
//
// Y la última palabra sobre la síntesis es de la persona (`V14`). Por eso hay
// un camino para decir «no es eso» que no es rellenar el mismo campo otra vez.

import { test, expect, type Page } from "@playwright/test";

async function contar(page: Page, relato: string, lugar?: string) {
  await page.goto("/participar");
  await page.fill("#relato", relato);
  if (lugar) await page.fill("#lugar", lugar);
  await page.getByRole("button", { name: /enviar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 15_000 });
}

test("el comprobante se entrega ANTES de afinar, y afinar se puede abandonar", async ({ page }) => {
  await contar(page, "el agua llega turbia desde hace tres meses", "la parte alta");
  // El código está a la vista mientras se afina. Si solo saliera al final,
  // quien abandone en la segunda pantalla se queda sin poder consultar lo suyo.
  const codigo = (await page.locator("[data-prueba='codigo']").textContent())?.trim() ?? "";
  expect(codigo.length).toBeGreaterThan(8);
  await expect(page.locator("[data-prueba='afinar']")).toBeVisible();
  await expect(page.locator("body")).toContainText(/opcional|si quieres/i);

  // Abandonar: el aporte sigue consultable con el código.
  await page.goto("/mis-aportes");
  await page.fill("#codigo", codigo);
  await page.getByRole("button", { name: /consultar|buscar/i }).click();
  await expect(page.locator("body")).toContainText(/turbia/, { timeout: 15_000 });
});

test("primera vuelta: dice qué entendió y se puede confirmar", async ({ page }) => {
  await contar(page, "la ruta escolar no sube cuando llueve y los niños faltan", "vereda alta");
  const vuelta = page.locator("[data-prueba='vuelta-1']");
  await expect(vuelta).toBeVisible();
  // Devuelve lo que la persona dijo, no una interpretación inventada.
  await expect(vuelta).toContainText(/ruta escolar/);
  await expect(vuelta).toContainText(/vereda alta/);
  await vuelta.getByRole("button", { name: /sí, es eso/i }).click();
  await expect(page.locator("[data-prueba='vuelta-2']")).toBeVisible();
});

test("si no le hace sentido, puede reescribirlo con sus palabras", async ({ page }) => {
  await contar(page, "hay un hueco grande en la vía principal");
  const vuelta = page.locator("[data-prueba='vuelta-1']");
  await vuelta.getByRole("button", { name: /no es eso/i }).click();

  // Lo que ya estaba escrito se conserva: la especificación lo pide literal
  // —«conservar texto ya escrito»— y borrarlo castiga a quien corrige.
  const caja = vuelta.locator("textarea, input[type=text]").first();
  await expect(caja).toHaveValue(/hueco/);
  await caja.fill("la vía principal está intransitable para las motos");
  await vuelta.getByRole("button", { name: /guardar|listo|continuar/i }).first().click();
  await expect(page.locator("[data-prueba='vuelta-2']")).toBeVisible();
});

test("ninguna vuelta pide más de tres cajas", async ({ page }) => {
  await contar(page, "el puesto de salud abre dos días a la semana");
  for (const n of ["vuelta-1", "vuelta-2"]) {
    const cajas = page.locator(`[data-prueba='${n}']`).locator("textarea, input:not([type=hidden])");
    await expect(page.locator(`[data-prueba='${n}']`)).toBeVisible();
    expect(await cajas.count(), `${n} pide más de tres cosas a la vez`).toBeLessThanOrEqual(3);
    await page.locator(`[data-prueba='${n}']`)
      .getByRole("button", { name: /sí, es eso|listo|continuar|guardar/i }).first().click();
  }
});

test("lo afinado llega a la consola como síntesis con versión", async ({ page }) => {
  const marca = `afinar-${Date.now()}`;
  await contar(page, `${marca}: no hay alumbrado en la vía de entrada`);
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i }).click();
  const v2 = page.locator("[data-prueba='vuelta-2']");
  await v2.locator("textarea, input[type=text]").first().fill("que instalen luminarias en la vía");
  await v2.getByRole("button", { name: /listo|guardar|continuar/i }).first().click();
  await expect(page.locator("body")).toContainText(/gracias|listo|quedó/i, { timeout: 15_000 });

  await page.goto("/consola");
  const enlace = page.locator(".bo-record-link", { hasText: marca }).filter({ visible: true });
  await enlace.click();
  await page.waitForURL(/\/consola\/[0-9a-f-]{8}/);
  // El relato original sigue intacto, y la síntesis va aparte y con versión.
  await expect(page.locator("blockquote")).toContainText(marca);
  await expect(page.locator("body")).toContainText(/luminarias/);
});
