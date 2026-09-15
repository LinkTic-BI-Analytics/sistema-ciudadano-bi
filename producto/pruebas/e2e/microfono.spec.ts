// Contar hablando (ADR 0013).
//
// Se recorre con el micrófono falso de Chromium: no hay voz de verdad, pero sí
// un `MediaRecorder` de verdad, un permiso de verdad y un archivo que sube de
// verdad. Lo que se finge es lo mismo que en el resto: qué contesta el modelo.
//
// Lo que se vigila es la decisión del ADR: **el audio es el original**, y por
// eso queda guardado aunque la transcripción salga mal — que sale mal.

import { test, expect } from "@playwright/test";

test.use({
  launchOptions: {
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
  },
  permissions: ["microphone"],
});

test("se puede grabar, y se avisa que la voz se guarda ANTES de grabar", async ({ page }) => {
  await page.goto("/participar");
  await page.getByRole("button", { name: /^hablar$/i }).click();

  const micro = page.locator("[data-prueba='microfono']");
  await expect(micro).toHaveAttribute("data-estado", "listo");
  // Se le dice cuando aprieta el botón, no en una política que nadie lee.
  await expect(micro).toContainText(/tu voz es el original/i);

  await micro.getByRole("button", { name: /empezar a grabar/i }).click();
  await expect(micro).toHaveAttribute("data-estado", "grabando", { timeout: 15_000 });
  // Mientras graba no hay nada guardado, y callarlo sería prometerlo.
  await expect(micro).toContainText(/todavía no se ha guardado nada/i);
});

test("al terminar, lo que se oyó se puede revisar y corregir", async ({ page }) => {
  await page.goto("/participar");
  await page.getByRole("button", { name: /^hablar$/i }).click();
  const micro = page.locator("[data-prueba='microfono']");
  await micro.getByRole("button", { name: /empezar a grabar/i }).click();
  await expect(micro).toHaveAttribute("data-estado", "grabando", { timeout: 15_000 });
  await micro.getByRole("button", { name: /terminar y guardar/i }).click();

  await expect(micro).toHaveAttribute("data-estado", "revisando", { timeout: 30_000 });
  await expect(micro).toContainText(/esto fue lo que oímos/i);
  // Lo que más se equivoca al transcribir, dicho donde se revisa.
  await expect(micro).toContainText(/nombres de veredas/i);

  await micro.getByRole("button", { name: /añadir al relato/i }).click();
  // Vuelve a escribir con el texto puesto: la transcripción es un punto de
  // partida, no una decisión tomada.
  await expect(page.locator("#relato")).toHaveValue(/Martinica/);
});

test("lo escrito antes NO se pierde al añadir la transcripción", async ({ page }) => {
  // «Cambiar a escribir no elimina una transcripción pendiente» y al revés:
  // borrar lo tecleado castiga a quien empezó a escribir y se cansó, que es
  // justo quien más necesita hablar.
  await page.goto("/participar");
  await page.fill("#relato", "esto lo escribí yo");
  await page.getByRole("button", { name: /^hablar$/i }).click();
  const micro = page.locator("[data-prueba='microfono']");
  await micro.getByRole("button", { name: /empezar a grabar/i }).click();
  await expect(micro).toHaveAttribute("data-estado", "grabando", { timeout: 15_000 });
  await micro.getByRole("button", { name: /terminar y guardar/i }).click();
  await expect(micro).toHaveAttribute("data-estado", "revisando", { timeout: 30_000 });
  await micro.getByRole("button", { name: /añadir al relato/i }).click();

  const texto = await page.locator("#relato").inputValue();
  expect(texto, "se borró lo que la persona había escrito").toContain("esto lo escribí yo");
  expect(texto).toContain("Martinica");
});

test("el aporte hablado queda con su grabación y llega a la consola", async ({ page }) => {
  await page.goto("/participar");
  await page.getByRole("button", { name: /^hablar$/i }).click();
  const micro = page.locator("[data-prueba='microfono']");
  await micro.getByRole("button", { name: /empezar a grabar/i }).click();
  await expect(micro).toHaveAttribute("data-estado", "grabando", { timeout: 15_000 });
  await micro.getByRole("button", { name: /terminar y guardar/i }).click();
  await expect(micro).toHaveAttribute("data-estado", "revisando", { timeout: 30_000 });
  await micro.getByRole("button", { name: /añadir al relato/i }).click();

  // La persona corrige el nombre de la vereda antes de mandar: es el caso de la
  // especificación —«la persona corrige antes de validar»—.
  await page.fill("#relato", "el agua llega turbia en la vereda La Martinita de Rionegro Antioquia");
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 25_000 });
});

test("un aporte hablado se distingue en la bandeja de revisión", async ({ page }) => {
  // La transcripción puede estar mal y hay audio que oír: el revisor tiene que
  // saberlo **antes** de abrirlo, no al llegar al final de la ficha.
  const marca = `voz-bandeja-${Date.now()}`;
  await page.goto("/participar");
  await page.getByRole("button", { name: /^hablar$/i }).click();
  const micro = page.locator("[data-prueba='microfono']");
  await micro.getByRole("button", { name: /empezar a grabar/i }).click();
  await expect(micro).toHaveAttribute("data-estado", "grabando", { timeout: 15_000 });
  await micro.getByRole("button", { name: /terminar y guardar/i }).click();
  await expect(micro).toHaveAttribute("data-estado", "revisando", { timeout: 30_000 });
  await micro.getByRole("button", { name: /añadir al relato/i }).click();

  await page.fill("#relato", `${marca}: el agua llega turbia`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 25_000 });

  await page.goto(`/consola?q=${encodeURIComponent(marca)}`);
  const fila = page.locator(".bo-record-card, .bo-table-desktop tr")
    .filter({ hasText: marca }).filter({ visible: true }).first();
  await expect(fila).toBeVisible({ timeout: 15_000 });
  await expect(fila.locator(".bo-badge")).toContainText(/por voz/i);
  await expect(fila.locator(".bo-badge")).toContainText(/puede estar mal/i);
});
