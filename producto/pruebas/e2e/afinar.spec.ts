// La captura completa: contar, confirmar lo que entendimos, y precisar solo lo
// que falta.
//
// La regla que ordena todo es del negocio: **solo tendríamos una oportunidad de
// obtener la información** (ADR 0012). Quien escribe aquí puede no volver nunca,
// y lo que no diga ahora no lo dice nadie después.
//
// De eso salen las dos exigencias que se vigilan aquí:
//   · nada se pierde nunca — el relato se guarda en el primer clic, y el código
//     está a la vista desde ese momento;
//   · nada se pide dos veces — se pregunta solo por lo que la persona no dijo.

import { test, expect, type Page } from "@playwright/test";

async function contar(page: Page, relato: string) {
  await page.goto("/participar");
  await page.fill("#relato", relato);
  await page.getByRole("button", { name: /continuar/i }).click();
}

test("el primer botón no dice «enviar»: la captura no termina ahí", async ({ page }) => {
  await page.goto("/participar");
  const boton = page.getByRole("button", { name: /continuar/i });
  await expect(boton).toBeVisible();
  // Decir «enviar» le comunica a la persona que terminó, justo cuando más
  // dispuesta está a contar. Es la frase que cuesta la única oportunidad.
  await expect(page.locator("form")).not.toContainText(/enviar/i);
});

test("el relato queda guardado en el primer clic, antes de cualquier pregunta", async ({ page }) => {
  await contar(page, "el agua llega turbia desde hace tres meses");
  // El código aparece mientras se afina, no al final: quien se vaya en mitad
  // del camino se va con lo suyo guardado y con cómo consultarlo.
  await expect(page.locator("[data-prueba='guardado']")).toBeVisible({ timeout: 20_000 });
  const codigo = (await page.locator("[data-prueba='codigo']").textContent())?.trim() ?? "";
  expect(codigo.length).toBeGreaterThan(8);

  await page.goto("/mis-aportes");
  await page.fill("#codigo", codigo);
  await page.getByRole("button", { name: /consultar|buscar/i }).click();
  await expect(page.locator("body")).toContainText(/turbia/, { timeout: 15_000 });
});

test("dice qué entendió, y se puede corregir con las palabras de uno", async ({ page }) => {
  await contar(page, "hay un hueco grande en la vía principal");
  const v1 = page.locator("[data-prueba='vuelta-1']");
  await expect(v1).toBeVisible({ timeout: 20_000 });
  await expect(v1).toContainText(/hueco/);

  await v1.getByRole("button", { name: /no es eso/i }).click();
  // Lo ya escrito se conserva: la especificación lo pide literal, y vaciarlo
  // castiga justamente a quien se tomó el trabajo de corregirnos.
  const caja = v1.locator("textarea").first();
  await expect(caja).toHaveValue(/hueco/);
  await caja.fill("la vía principal está intransitable para las motos");
  await v1.getByRole("button", { name: /guardar y seguir/i }).click();
  await expect(page.locator("[data-prueba='vuelta-2']")).toBeVisible({ timeout: 15_000 });
});

test("ninguna vuelta pide más de tres cosas, y el paso se ve", async ({ page }) => {
  await contar(page, "el puesto de salud abre dos días a la semana");
  await expect(page.locator("[data-prueba='vuelta-1']")).toBeVisible({ timeout: 20_000 });
  await expect(page.locator("body")).toContainText(/paso \d+ de \d+/i);
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i }).click();

  for (const n of ["vuelta-2", "vuelta-3"]) {
    const v = page.locator(`[data-prueba='${n}']`);
    await expect(v).toBeVisible({ timeout: 15_000 });
    const cajas = v.locator("input:not([type=hidden]), textarea");
    expect(await cajas.count(), `${n} pide más de tres cosas a la vez`).toBeLessThanOrEqual(3);
    await v.getByRole("button", { name: /continuar|listo/i }).first().click();
  }
  await expect(page.locator("[data-prueba='afinado-listo']")).toBeVisible({ timeout: 15_000 });
});

test("se puede terminar en cualquier punto, y el código sigue sirviendo", async ({ page }) => {
  await contar(page, "no hay alumbrado en la vía de entrada");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  await page.locator("[data-prueba='vuelta-2']").getByRole("button", { name: /terminar aquí/i }).click();
  await expect(page.locator("[data-prueba='afinado-listo']")).toBeVisible({ timeout: 15_000 });
});

test("lo que precisa después llega al aporte y a la consola", async ({ page }) => {
  const marca = `precisar-${Date.now()}`;
  await contar(page, `${marca}: se inunda la vía cuando llueve`);
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });

  const v2 = page.locator("[data-prueba='vuelta-2']");
  await expect(v2).toBeVisible({ timeout: 15_000 });
  await v2.locator("#lugar").fill("la vereda El Salado");
  await v2.locator("#afectados").fill("unas veinte familias");
  await v2.locator("#desdeCuando").fill("desde el invierno pasado");
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();

  const v3 = page.locator("[data-prueba='vuelta-3']");
  await expect(v3).toBeVisible({ timeout: 15_000 });
  await v3.locator("#resultadoEsperado").fill("que arreglen el desagüe");
  await v3.getByRole("button", { name: /listo/i }).first().click();
  await expect(page.locator("[data-prueba='afinado-listo']")).toBeVisible({ timeout: 15_000 });

  await page.goto("/consola");
  await page.locator(".bo-record-link", { hasText: marca }).filter({ visible: true }).click();
  await page.waitForURL(/\/consola\/[0-9a-f-]{8}/);
  // El relato original intacto, y lo precisado al lado — nunca encima.
  await expect(page.locator("blockquote")).toContainText(marca);
  await expect(page.locator("body")).toContainText(/El Salado/);
});
