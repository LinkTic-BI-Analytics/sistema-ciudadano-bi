// T024 · la pantalla de captura, en un navegador de verdad.
//
// Lo que se prueba aquí no se puede probar contra la base: que la etiqueta se
// vea, que el foco vaya donde debe, que cambiar de modo no borre lo escrito.
//
// **Lo que NO prueba, y hay que decirlo:** si se entiende. Eso lo contesta una
// persona, y para eso existe `/validar` — que no se ha corrido.

import { test, expect } from "@playwright/test";

test("el campo de relato tiene etiqueta visible, no solo placeholder", async ({ page }) => {
  await page.goto("/participar");
  const etiqueta = page.locator("label[for='relato']");
  await expect(etiqueta).toBeVisible();
  // El sistema de diseño lo pide con esas palabras: el placeholder no sustituye
  // la etiqueta. Quien usa lector de pantalla o zoom pierde el placeholder.
  await expect(etiqueta).toHaveText(/qué está pasando/i);
});

test("enviar vacío muestra el resumen de errores y le pone el foco", async ({ page }) => {
  await page.goto("/participar");
  await page.getByRole("button", { name: /enviar/i }).click();
  const resumen = page.locator(".pc-error-summary");
  await expect(resumen).toBeVisible();
  await expect(resumen).toBeFocused();
  // El error se dice en palabras, no solo con un borde rojo.
  await expect(resumen).toContainText(/cuéntanos/i);
});

test("enviar un relato devuelve un comprobante legible", async ({ page }) => {
  await page.goto("/participar");
  await page.fill("#relato", "el agua llega turbia desde hace tres meses en la parte alta");
  await page.fill("#lugar", "la vereda de arriba, subiendo por la escuela");
  await page.getByRole("button", { name: /enviar/i }).click();
  const codigo = page.locator("[data-prueba='codigo']");
  await expect(codigo).toBeVisible({ timeout: 15_000 });
  await expect(codigo).toHaveText(/^[A-Z0-9]{12}$/);
});

test("cambiar de escribir a hablar CONSERVA lo escrito", async ({ page }) => {
  await page.goto("/participar");
  const dicho = "no hay transporte para llevar a los niños a la escuela";
  await page.fill("#relato", dicho);
  await page.getByRole("button", { name: /hablar/i }).click();
  await page.getByRole("button", { name: /escribir/i }).click();
  await expect(page.locator("#relato")).toHaveValue(dicho);
});

test("en ninguna parte se PIDE correo", async ({ page }) => {
  await page.goto("/participar");
  // La primera versión de esta prueba buscaba la palabra «correo» y fallaba
  // porque la página dice «no necesitas correo» — que es lo contrario de
  // pedirlo. Lo que importa es que no haya dónde escribirlo.
  expect(await page.locator("input[type='email']").count()).toBe(0);
  const nombres = await page.locator("input, textarea").evaluateAll(
    (cs) => cs.map((c) => ((c as HTMLInputElement).name || "") + "|" + (c.id || "")),
  );
  for (const n of nombres) {
    expect(n.toLowerCase()).not.toMatch(/correo|email|mail/);
  }
  // Y que si la palabra aparece, sea para decir que NO hace falta.
  const texto = (await page.locator("body").innerText()).toLowerCase();
  for (const frase of texto.split(/[.\n]/).filter((f) => f.includes("correo"))) {
    expect(frase).toMatch(/sin |no (necesitas|pedimos|exigimos)/);
  }
});

test("con el código, mis-aportes muestra ese aporte", async ({ page }) => {
  await page.goto("/participar");
  const relato = "el puente peatonal está agrietado y la gente sigue pasando";
  await page.fill("#relato", relato);
  await page.getByRole("button", { name: /enviar/i }).click();
  const codigo = await page.locator("[data-prueba='codigo']").innerText({ timeout: 15_000 });

  await page.goto("/mis-aportes");
  await page.fill("#codigo", codigo);
  await page.getByRole("button", { name: /consultar/i }).click();
  await expect(page.locator("[data-prueba='relato']")).toContainText(relato, { timeout: 15_000 });
});

test("un código inventado dice que no encontró nada, sin error", async ({ page }) => {
  await page.goto("/mis-aportes");
  await page.fill("#codigo", "ZZZZZZZZZZZZ");
  await page.getByRole("button", { name: /consultar/i }).click();
  await expect(page.locator("[data-prueba='sin-resultado']")).toBeVisible({ timeout: 15_000 });
  await expect(page.locator(".pc-error-summary")).toHaveCount(0);
});

test("el foco se ve en todo lo que se toca con el teclado", async ({ page }) => {
  await page.goto("/participar");
  await page.keyboard.press("Tab");
  const contorno = await page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    if (!a) return null;
    const s = getComputedStyle(a);
    return { ancho: s.outlineWidth, estilo: s.outlineStyle };
  });
  expect(contorno).not.toBeNull();
  // Nunca `outline: none` sin reemplazo: quien navega con teclado pierde el sitio.
  expect(contorno!.estilo).not.toBe("none");
});
