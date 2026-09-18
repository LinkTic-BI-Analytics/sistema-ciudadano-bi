// T066 · «Te llamamos», en un navegador de verdad.
//
// Lo que no se puede probar contra la base: que el botón esté donde se dijo,
// que abrir el formulario no borre lo que alguien ya escribió, y que la
// confirmación **se quede en pantalla** en vez de irse sola.
//
// **Lo que NO prueba, y hay que decirlo:** si se entiende, y si alguien que
// llega a pedir una llamada prefiere eso a escribir. Eso lo contesta una
// persona, y para eso existe `/validar` — que no se ha corrido.

import { test, expect } from "@playwright/test";

test("el selector ofrece los tres modos, y «Te llamamos» es uno de ellos", async ({ page }) => {
  await page.goto("/participar");
  const modos = page.getByRole("group", { name: /cómo quieres contarlo/i });
  await expect(modos.getByRole("button", { name: /^escribir$/i })).toBeVisible();
  await expect(modos.getByRole("button", { name: /^hablar$/i })).toBeVisible();
  await expect(modos.getByRole("button", { name: /te llamamos/i })).toBeVisible();
});

test("el formulario NO está antes de tocar el botón", async ({ page }) => {
  await page.goto("/participar");
  // Es la mitad del requisito: se abre **cuando la persona lo pide**. Tenerlo
  // siempre puesto convertiría la captura en un formulario que pide datos
  // personales a todo el mundo.
  await expect(page.locator("[data-prueba='llamada']")).toHaveCount(0);
  await expect(page.locator("#llamada-telefono")).toHaveCount(0);
});

test("tocar «Te llamamos» abre el formulario con nombre y teléfono", async ({ page }) => {
  await page.goto("/participar");
  await page.getByRole("button", { name: /te llamamos/i }).click();
  await expect(page.locator("[data-prueba='llamada']")).toBeVisible();
  // Etiquetas visibles, no solo placeholder: es lo que el sistema de diseño
  // pide y lo que hace que un lector de pantalla diga qué va en cada caja.
  await expect(page.locator("label[for='llamada-nombre']")).toBeVisible();
  await expect(page.locator("label[for='llamada-telefono']")).toBeVisible();
});

test("abrir «Te llamamos» CONSERVA lo que ya había escrito", async ({ page }) => {
  await page.goto("/participar");
  const dicho = "no hay transporte para llevar a los niños a la escuela";
  await page.fill("#relato", dicho);
  await page.getByRole("button", { name: /te llamamos/i }).click();
  await page.getByRole("button", { name: /^escribir$/i }).click();
  // El mismo hallazgo que con «Hablar»: perder lo escrito al tocar un botón es
  // la forma más rápida de que alguien abandone.
  await expect(page.locator("#relato")).toHaveValue(dicho);
});

test("guardar sin nada muestra los DOS errores y le pone el foco", async ({ page }) => {
  await page.goto("/participar");
  await page.getByRole("button", { name: /te llamamos/i }).click();
  await page.getByRole("button", { name: /^guardar$/i }).click();
  const resumen = page.locator("[data-prueba='llamada'] .pc-error-summary");
  await expect(resumen).toBeVisible();
  await expect(resumen).toBeFocused();
  // Los dos juntos: devolver uno y callar el otro obliga a enviar dos veces
  // para enterarse de las dos cosas.
  await expect(resumen).toContainText(/nombre/i);
  await expect(resumen).toContainText(/teléfono/i);
});

test("un teléfono que no sirve para llamar se rechaza, y se dice por qué", async ({ page }) => {
  await page.goto("/participar");
  await page.getByRole("button", { name: /te llamamos/i }).click();
  await page.fill("#llamada-nombre", "Marleny");
  await page.fill("#llamada-telefono", "311");
  await page.getByRole("button", { name: /^guardar$/i }).click();
  const resumen = page.locator("[data-prueba='llamada'] .pc-error-summary");
  await expect(resumen).toBeVisible();
  await expect(resumen).toContainText(/dígitos/i);
});

test("guardar con nombre y teléfono dice «te llamamos en breve», y se queda", async ({ page }) => {
  await page.goto("/participar");
  await page.getByRole("button", { name: /te llamamos/i }).click();
  await page.fill("#llamada-nombre", "Marleny Quintero");
  await page.fill("#llamada-telefono", "3114567890");
  await page.getByRole("button", { name: /^guardar$/i }).click();

  const guardada = page.locator("[data-prueba='llamada-guardada']");
  await expect(guardada).toBeVisible({ timeout: 20_000 });
  await expect(guardada).toContainText(/te llamamos en breve/i);

  // **Y sigue ahí.** `AGENTS.md` §10: una confirmación no es un aviso que se va
  // solo. Quien mire la pantalla medio minuto después tiene que poder ver que
  // sí quedó pedida.
  await page.waitForTimeout(5_000);
  await expect(guardada).toBeVisible();
  await expect(guardada).toContainText(/te llamamos en breve/i);
});

test("la orientación al 123 NO se pierde al cambiar a «Te llamamos»", async ({ page }) => {
  await page.goto("/participar");
  // Un relato con indicio: la orientación aparece mientras escribe (`V13`).
  await page.fill("#relato", "hubo un derrumbe y hay gente atrapada en la vía");
  await expect(page.locator("[data-prueba='orientacion']")).toBeVisible();
  await page.getByRole("button", { name: /te llamamos/i }).click();
  // Esta es la regresión que motivó sacar el aviso del formulario: quien pide
  // una llamada mientras algo se quema no puede perder el 123 de vista.
  await expect(page.locator("[data-prueba='orientacion']")).toBeVisible();
  await expect(page.getByRole("link", { name: /llamar al 123/i })).toBeVisible();
});
