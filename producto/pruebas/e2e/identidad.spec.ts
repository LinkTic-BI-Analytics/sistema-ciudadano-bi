// La línea gráfica, comprobada en el navegador.
//
// `interfaz.md` I5 dice por qué esto no es cosmética: **la línea gráfica cambia
// de qué habla la gente cuando mira.** Si el instrumento se ve como un boceto,
// quien lo mira comenta el boceto; si se ve como su producto, comenta lo que
// sirve. Y una línea gráfica que se rompe sola —un tema que no se guarda, una
// sección que se queda invisible— devuelve a la persona a comentar el boceto.
//
// Lo que se vigila aquí es lo que **ninguna prueba de nodo puede ver**: qué
// color acaba pintando el navegador después de resolver 374 variables, y qué
// pasa cuando alguien cambia de tema o pide no ver movimiento.

import { test, expect, type Page } from "@playwright/test";

/** La relación de contraste WCAG entre dos colores calculados por el navegador. */
const RAZON = `(function(a, b) {
  const lum = (c) => {
    const [r, g, bl] = c.match(/[\\d.]+/g).slice(0, 3).map(Number);
    const f = (x) => (x / 255 <= 0.04045 ? x / 255 / 12.92 : ((x / 255 + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => p - q);
  return (y + 0.05) / (x + 0.05);
})`;

async function tema(page: Page) {
  return page.evaluate(() => document.documentElement.dataset.tema);
}

test("el modo oscuro es el que sale por defecto, y es de verdad oscuro", async ({ page }) => {
  // La entrega dice cuál es el principal: «Modo por defecto: DARK». Si un día
  // alguien lo cambia, que sea una decisión y no un efecto de otra cosa.
  await page.goto("/");
  expect(await tema(page)).toBe("oscuro");

  const claridad = await page.evaluate(`${RAZON}(
    getComputedStyle(document.body).backgroundColor, 'rgb(255,255,255)')`);
  expect(claridad as number, "el fondo del modo oscuro no es oscuro").toBeGreaterThan(10);
});

test("el tema se cambia, se guarda, y sobrevive a navegar", async ({ page }) => {
  // **Se guarda o no sirve.** Quien escogió el claro porque está a pleno sol no
  // lo va a volver a escoger en cada pantalla: lo que hace es irse.
  await page.goto("/");
  await page.getByRole("button", { name: /modo claro/i }).click();
  expect(await tema(page)).toBe("claro");

  const fondoClaro = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const contraDelNegro = await page.evaluate(`${RAZON}(
    getComputedStyle(document.body).backgroundColor, 'rgb(0,0,0)')`);
  expect(contraDelNegro as number, `el modo claro pintó ${fondoClaro}`).toBeGreaterThan(10);

  // Y en la pantalla siguiente sigue puesto, sin destello: el guion del `<head>`
  // corre antes que React.
  await page.getByRole("link", { name: /contar una necesidad/i }).first().click();
  await expect(page).toHaveURL(/\/participar/);
  expect(await tema(page), "el tema no sobrevivió a la navegación").toBe("claro");
});

test("el titular del hero se lee sobre la bandera, en los dos modos", async ({ page }) => {
  // El fondo del hero es una fotografía de la bandera con un degradado navy
  // encima. **El degradado no es un filtro bonito: es lo que sostiene el
  // contraste** — sin él el titular cae sobre el amarillo de la bandera.
  //
  // Se comprueba contra el color declarado del hero y no contra la foto, que es
  // lo que se puede medir; la foto va debajo del degradado a propósito.
  for (const modo of ["oscuro", "claro"] as const) {
    await page.goto("/");
    if (modo === "claro") await page.getByRole("button", { name: /modo claro/i }).click();

    const razon = await page.evaluate(`${RAZON}(
      getComputedStyle(document.querySelector('.pc-hero h1')).color,
      getComputedStyle(document.querySelector('.pc-hero')).backgroundColor)`);
    expect(razon as number, `el titular del hero no se lee en modo ${modo}`).toBeGreaterThanOrEqual(4.5);
  }
});

test("la firma tricolor está en la página, y en el orden de la bandera", async ({ page }) => {
  // Amarillo, azul, rojo. Es la firma gráfica de la entrega y lo único que
  // afirma de dónde viene esto — **no el escudo**, que espera el manual
  // institucional (`Q34`). Un orden cambiado no es un detalle: es otra bandera.
  await page.goto("/");
  const colores = await page.locator(".pc-tricolor").first().evaluate((el) =>
    [...el.children].map((c) => getComputedStyle(c).backgroundColor));
  expect(colores).toEqual(["rgb(255, 200, 0)", "rgb(0, 49, 137)", "rgb(216, 0, 37)"]);

  // Y el escudo no está servido: ponerlo afirmaría una autoría que nadie confirmó.
  const respuesta = await page.request.get("/marca/escudo-colombia.png");
  expect(respuesta.status(), "el escudo nacional está servido y la Q34 sigue abierta").toBe(404);
});

test("la vista del harness NO toma la línea gráfica del negocio", async ({ page }) => {
  // `interfaz.md` I5, y es una regla dura sin excepción por proyecto: «/modulos
  // y /telemetria mantienen siempre su propia línea gráfica». Su valor está en
  // que se ven igual en todos los proyectos — quien llega de otro las sabe leer
  // sin que se las expliquen— y en que **se distingan del producto al primer
  // vistazo**: mirar la construcción no puede parecerse a mirar lo construido.
  //
  // Se sostiene porque el harness declara sus tokens sobre `.harness` y no sobre
  // `:root`. Esto lo comprueba desde fuera, que es lo que pide el documento.
  const mirar = () =>
    page.evaluate(() => {
      const h = document.querySelector(".harness") ?? document.body;
      const c = getComputedStyle(h);
      return { fondo: c.backgroundColor, letra: c.fontFamily };
    });

  await page.goto("/construccion");
  const oscuro = await mirar();

  // Y con el producto puesto en claro, la vista interna no se mueve.
  await page.goto("/");
  await page.getByRole("button", { name: /modo claro/i }).click();
  await page.goto("/construccion");
  const claro = await mirar();

  expect(claro, "la vista del harness siguió al tema del producto").toEqual(oscuro);
  expect(oscuro.letra, "la vista del harness tomó la tipografía del negocio").toMatch(/Mono/i);
});

test("con «menos movimiento» no queda nada invisible", async ({ page }) => {
  // `pc-revela` arranca en opacidad 0 y sube al entrar en cuadro. Es cómodo y es
  // peligroso: una animación que puede esconder contenido para siempre es peor
  // que no tener animación.
  //
  // Se vio fallar quitando la guarda `@media (prefers-reduced-motion:
  // no-preference)` de `estructura.css`: con la guarda fuera, las dos secciones
  // de abajo de la portada se quedan en opacidad 0 aunque el navegador tenga
  // pedido no ver movimiento.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(600);

  const opacidades = await page.locator(".pc-revela, .pc-entra").evaluateAll((els) =>
    els.map((e) => Number(getComputedStyle(e).opacity)));
  expect(opacidades.length, "no hay nada animado que comprobar").toBeGreaterThan(0);
  for (const o of opacidades) expect(o, "con «menos movimiento» algo quedó invisible").toBe(1);
});

test("una fila de encuentro sin recuadro de fecha usa el ancho entero", async ({ page }) => {
  // La fila es una rejilla de dos columnas: 3,5 rem para el recuadro del día y
  // el resto para el texto. La pantalla de «este enlace no corresponde a ningún
  // encuentro» lista los encuentros **sin** ese recuadro, y su único hijo caía
  // en la columna estrecha: el título salía en una tira de cuatro caracteres
  // —«Mesa / sobre / el / agua»— con dos tercios de la tarjeta vacíos.
  //
  // Se vio fallar quitando la regla `:not(:has(.pc-event-date))` de
  // `estructura.css`: el contenido pasa de ocupar el 90 % del ancho al 20 %.
  await page.goto("/e/NO-EXISTE-ESTE-ENLACE");
  const fila = page.locator(".pc-event-row").first();
  await expect(fila).toBeVisible();

  const proporcion = await fila.evaluate((f) => {
    const hijo = f.querySelector(":scope > div");
    return hijo!.getBoundingClientRect().width / f.getBoundingClientRect().width;
  });
  expect(proporcion, "el contenido de la fila está exprimido en la columna de la fecha")
    .toBeGreaterThan(0.6);
});

test("lo que entra al desplazar acaba visible, y nunca al revés", async ({ page }) => {
  await page.goto("/");
  const agenda = page.locator("[data-prueba='agenda']");
  await agenda.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await expect(agenda.locator(".pc-event-row").first()).toBeVisible();
  expect(Number(await agenda.evaluate((e) => getComputedStyle(e).opacity)))
    .toBeGreaterThan(0.9);
});
