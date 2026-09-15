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
  // Lo que decide si entra, en el primer pliegue: sin cédula, se puede hablar,
  // y qué es y qué no es registrar algo.
  const ayuda = page.locator(".pc-hero-help").first();
  await expect(ayuda).toContainText(/sin cuenta, sin correo y sin cédula/i);
  await expect(ayuda).toContainText(/hablando/i);
  await expect(ayuda).toContainText(/no es una promesa de obra/i);

  await page.getByRole("link", { name: /contar una necesidad/i }).first().click();
  await expect(page).toHaveURL(/\/participar/);
  await expect(page.locator("#relato")).toBeVisible();
});

test("los encuentros dicen el día completo, y no confunden la zona con el lugar", async ({ page }) => {
  await page.goto("/");
  const agenda = page.locator("[data-prueba='agenda']");
  await expect(agenda).toBeVisible();
  await expect(agenda.locator(".pc-event-row").first()).toBeVisible();

  // **El día del mes, en el texto.** El recuadro grande lleva `aria-hidden`, así
  // que quien usa lector de pantalla solo oía «dom»: no sabía qué día era.
  const cuando = agenda.locator(".pc-event-when").first();
  await expect(cuando).toContainText(/\b\d{1,2} de [a-z]{3}\b/i);
  await expect(cuando).toContainText(/\d{1,2}:\d{2}/);

  // **Y la zona solo si no es la del país.** Decía «(Bogota)» —sin tilde— justo
  // al lado de «Caseta comunal de la vereda El Salado», y se leía como el
  // lugar: «¿es en Bogotá o en El Salado?».
  await expect(cuando, "la zona horaria se está leyendo como el lugar del encuentro")
    .not.toContainText(/\(Bogota/i);
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

  // Que registrar algo no es un compromiso de obra, **en el primer pliegue**.
  // Estaba en `pc-how-note`, que el sistema de diseño oculta bajo 42rem: quien
  // entraba desde un teléfono no lo veía nunca.
  await expect(cuerpo).toContainText(/no es una promesa de obra|no.*compromiso de obra/i);
  await expect(cuerpo).toContainText(/no atiende emergencias|no es un canal de emergencias/i);
  // Y ir a un encuentro no es requisito para contar algo.
  await expect(cuerpo).toContainText(/ir a un encuentro no es obligatorio/i);

  // **Y no presenta la participación como representativa.** La forma de no
  // hacerlo no es una frase al pie —esa hablaba para el analista y desde la
  // vereda se lee como «lo tuyo no cuenta»—: es que aquí no se publica ningún
  // conteo. La advertencia va donde los conteos se consumen, y está copiada
  // textual en el diccionario del corte (`pruebas/corte.test.ts`).
  const texto = await cuerpo.innerText();
  expect(texto, "la portada está publicando un conteo de aportes")
    .not.toMatch(/\b\d+\s+(aportes|necesidades|personas)\b/i);
});

test("la portada es usable en un teléfono", async ({ page }) => {
  await page.goto("/");
  // El ancho del cuerpo no se desborda: el sistema de diseño reordena la
  // rejilla, pero solo si se usa su estructura.
  const desborde = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(desborde, "la portada se sale de la pantalla a lo ancho").toBeLessThanOrEqual(1);
});

test("en un teléfono pequeño el botón de contar se ve SIN bajar", async ({ page }) => {
  // **Es el hallazgo que más costaba.** Había un menú con dos enlaces que
  // llevaban a los mismos dos sitios que el botón y el enlace de abajo: cuatro
  // cosas tocables para dos destinos. En un Android de 360×560 eso empujaba el
  // botón principal fuera de la primera pantalla, y lo primero tocable eran dos
  // enlaces grises subrayados.
  //
  // La persona entra una vez, con datos caros, y puede no volver nunca. Si no
  // ve el botón, no cuenta nada.
  await page.setViewportSize({ width: 360, height: 560 });
  await page.goto("/");

  const boton = page.getByRole("link", { name: /contar una necesidad/i });
  await expect(boton).toHaveCount(1, { timeout: 15_000 });

  const caja = await boton.boundingBox();
  expect(caja, "no se encontró el botón de contar").not.toBeNull();
  expect(caja!.y + caja!.height,
         "el botón de contar queda debajo del pliegue en un teléfono de 360×560")
    .toBeLessThanOrEqual(560);
  // Y es un destino táctil de verdad.
  expect(caja!.height, "el botón mide menos de 44 px de alto").toBeGreaterThanOrEqual(44);
});

test("la portada dice hasta cuándo se puede contar", async ({ page }) => {
  // «Hasta cuándo» es lo que decide si lo hace ahora o «después» — y después no
  // vuelve. No estaba en ninguna parte, aunque la convocatoria lo tiene.
  await page.goto("/");
  await expect(page.locator("[data-prueba='plazo']"))
    .toContainText(/recibimos aportes hasta el \d{1,2} de [a-z]{3}/i);
});
