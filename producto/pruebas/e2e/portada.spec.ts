// La portada (`M06`, `RF10`).
//
// El caso de aceptación del módulo es literal —`AGE-01`: *«un ciudadano
// encuentra un encuentro virtual sobre agua desde portada y aporta sin
// inscribirse»*— y eso es lo primero que se recorre aquí.

import { test, expect } from "@playwright/test";

test("desde la portada se puede contar sin cuenta y sin esperar a un encuentro", async ({ page }) => {
  // `AGE-01`. Contar no depende de ningún encuentro: el módulo dice que una
  // convocatoria «puede recibir aportes por internet sin reunión».
  await page.goto("/");
  await expect(page.locator("h1")).toContainText(/necesita mejorar/i);
  await expect(page.locator("body")).toContainText(/no necesitas cuenta ni correo/i);

  await page.getByRole("link", { name: /contar una necesidad/i }).first().click();
  await expect(page).toHaveURL(/\/participar/);
  await expect(page.locator("#relato")).toBeVisible();
});

test("los próximos encuentros salen en la portada, con hora y zona horaria", async ({ page }) => {
  await page.goto("/");
  const agenda = page.locator("[data-prueba='agenda']");
  await expect(agenda).toBeVisible();
  await expect(agenda.locator(".pc-event-row").first()).toBeVisible();
  // Un encuentro «a las 9» no dice nada sin decir dónde son las 9: quien se
  // conecta desde otro huso llega tarde.
  await expect(agenda.locator(".pc-event-when").first()).toContainText(/Bogota/i);
});

test("un encuentro cancelado SIGUE en la lista y dice por qué", async ({ page }) => {
  // «Cancelación mantiene ficha informativa»: quitarlo es la forma más rápida
  // de que alguien se presente en la puerta de un salón cerrado.
  await page.goto("/");
  const cancelado = page.locator(".pc-event-row[data-status='cancelled']");
  await expect(cancelado).toHaveCount(1);
  await expect(cancelado).toContainText(/cancelado/i);
  await expect(cancelado).toContainText(/sede no estará disponible/i);
  // Y se le dice que igual puede contar lo suyo.
  await expect(cancelado).toContainText(/por internet/i);
});

test("un encuentro reprogramado muestra que cambió", async ({ page }) => {
  await page.goto("/");
  const agenda = page.locator("[data-prueba='agenda']");
  await expect(agenda).toContainText(/cambió de fecha/i);
  await expect(agenda).toContainText(/jornada de vacunación/i);
});

test("la portada no promete lo que no puede cumplir", async ({ page }) => {
  await page.goto("/");
  const cuerpo = page.locator("body");
  // Tres cosas que el módulo prohíbe, dichas donde se confundirían.
  await expect(cuerpo).toContainText(/no representa a la población/i);
  await expect(cuerpo).toContainText(/no significa que haya un compromiso de obra|no.*compromiso de obra/i);
  await expect(cuerpo).toContainText(/no es un canal de emergencias/i);
  // Y entrar a un encuentro no es haber aportado.
  await expect(cuerpo).toContainText(/aportar sin asistir/i);
});

test("la portada es usable en un teléfono", async ({ page }) => {
  await page.goto("/");
  // El ancho del cuerpo no se desborda: el sistema de diseño reordena la
  // rejilla, pero solo si se usa su estructura.
  const desborde = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(desborde, "la portada se sale de la pantalla a lo ancho").toBeLessThanOrEqual(1);
});
