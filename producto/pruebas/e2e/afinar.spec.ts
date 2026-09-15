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
import { salirDelMunicipio, escogerMunicipio, hablarPorMi } from "./ayudas.ts";

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

  const v2 = page.locator("[data-prueba='vuelta-2']");
  await expect(v2).toBeVisible({ timeout: 15_000 });
  expect(await v2.locator("input:not([type=hidden]), textarea").count(),
         "la vuelta 2 pide más de tres cosas a la vez").toBeLessThanOrEqual(3);
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();

  await salirDelMunicipio(page);

  const v3 = page.locator("[data-prueba='vuelta-3']");
  await expect(v3).toBeVisible({ timeout: 15_000 });
  expect(await v3.locator("input:not([type=hidden]), textarea").count(),
         "la vuelta 3 pide más de tres cosas a la vez").toBeLessThanOrEqual(3);
  await v3.getByRole("button", { name: /continuar|listo/i }).first().click();
  await hablarPorMi(page);
  await expect(page.locator("[data-prueba='afinado-listo']")).toBeVisible({ timeout: 15_000 });
});

test("se puede terminar en cualquier punto, y el código sigue sirviendo", async ({ page }) => {
  await contar(page, "no hay alumbrado en la vía de entrada");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  await page.locator("[data-prueba='vuelta-2']").getByRole("button", { name: /terminar aquí/i }).click();
  await hablarPorMi(page);
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

  // «la vereda El Salado» no llega a un municipio, así que ahora se insiste en
  // vez de seguir de largo.
  await salirDelMunicipio(page);

  const v3 = page.locator("[data-prueba='vuelta-3']");
  await expect(v3).toBeVisible({ timeout: 15_000 });
  await v3.locator("#resultadoEsperado").fill("que arreglen el desagüe");
  await v3.getByRole("button", { name: /listo/i }).first().click();
  await hablarPorMi(page);
  await expect(page.locator("[data-prueba='afinado-listo']")).toBeVisible({ timeout: 15_000 });

  await page.goto("/consola");
  await page.locator(".bo-record-link", { hasText: marca }).filter({ visible: true }).click();
  await page.waitForURL(/\/consola\/[0-9a-f-]{8}/);
  // El relato original intacto, y lo precisado al lado — nunca encima.
  await expect(page.locator("blockquote")).toContainText(marca);
  await expect(page.locator("body")).toContainText(/El Salado/);
});


test("si nombra un municipio, se lo ofrecemos para que lo confirme", async ({ page }) => {
  // El texto es el que escribió una persona de verdad probando la pantalla:
  // trae vereda, municipio y departamento mezclados en una frase.
  const marca = `divipola-${Date.now()}`;
  await contar(page, `${marca}: está llegando el agua con olor a gasolina`);
  const codigo = await page.locator("[data-prueba='codigo']").innerText({ timeout: 20_000 });
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });

  const v2 = page.locator("[data-prueba='vuelta-2']");
  await v2.locator("#lugar").fill("en la verede la martinita y rionegro antioquia");
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();

  const mun = page.locator("[data-prueba='municipio']");
  await expect(mun).toBeVisible({ timeout: 15_000 });
  await expect(mun).toContainText(/RIONEGRO/i);
  await expect(mun).toContainText(/ANTIOQUIA/i);
  // La salida importa tanto como la lista: sin ella, quien no reconozca ninguno
  // escoge el primero por salir del paso.
  await expect(mun.getByRole("button", { name: /ninguno|no estoy seguro/i })).toBeVisible();

  await mun.getByRole("button", { name: /RIONEGRO/i }).first().click();

  // **El efecto que se busca: sale de la bandeja de «por aclarar».** Ya no hay
  // que pedirle a un revisor que adivine a qué Rionegro se refería.
  //
  // Se comprueba primero que el aporte existe de verdad —con su código, por la
  // puerta de la ciudadanía— porque una prueba que solo afirma una ausencia pasa
  // igual cuando no hay nada, y entonces no dice nada.
  await page.goto("/mis-aportes");
  await page.fill("#codigo", codigo);
  await page.getByRole("button", { name: /consultar/i }).click();
  await expect(page.locator("[data-prueba='relato']")).toContainText(marca, { timeout: 15_000 });

  await page.goto("/consola");
  await expect(page.locator(".bo-record-link", { hasText: marca })).toHaveCount(0);
});

test("un nombre que existe en dos departamentos los muestra los dos", async ({ page }) => {
  // **Es la regla entera.** Elegir por la persona cuando el texto no distingue
  // es exactamente la inferencia que `I2` prohíbe.
  await contar(page, "se cayó el puente y no podemos pasar");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  const v2 = page.locator("[data-prueba='vuelta-2']");
  await v2.locator("#lugar").fill("en rionegro");
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();

  const mun = page.locator("[data-prueba='municipio']");
  await expect(mun).toBeVisible({ timeout: 15_000 });
  await expect(mun).toContainText(/ANTIOQUIA/i);
  await expect(mun).toContainText(/SANTANDER/i);
  await expect(mun).toContainText(/solo tú sabes cuál/i);
});

test("si lo que escribió no llega a un municipio, se le pregunta por el nombre", async ({ page }) => {
  // **Este es el arreglo.** Antes, «la vereda de arriba» se daba por contestado
  // y el aporte llegaba a la bandeja sin territorio al que sumarlo — que es como
  // no tenerlo. Ahora se insiste, se explica para qué sirve, y se busca por
  // nombre.
  await contar(page, "no hay agua");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  const v2 = page.locator("[data-prueba='vuelta-2']");
  await v2.locator("#lugar").fill("en mi casa");
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();

  const mun = page.locator("[data-prueba='municipio']");
  await expect(mun).toBeVisible({ timeout: 15_000 });
  await expect(mun).toContainText(/dónde queda/i);
  // Se le dice qué se pierde, sin regañarla.
  await expect(mun).toContainText(/no se puede sumar al de tus vecinos/i);

  await escogerMunicipio(page, "ANTIOQUIA", "RIONEGRO");
  await expect(page.locator("[data-prueba='vuelta-3']")).toBeVisible({ timeout: 15_000 });
});

test("si no sabe el municipio del problema, se le pregunta dónde vive", async ({ page }) => {
  // Pero vivir ahí no es que el problema ocurra ahí: `GEO-01` dice que una
  // dirección residencial no es el lugar del problema **sin confirmación**, y
  // esa confirmación se pregunta aparte.
  await contar(page, "se cayó el puente y no podemos pasar al colegio");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  const v2 = page.locator("[data-prueba='vuelta-2']");
  await v2.locator("#lugar").fill("aquí cerca");
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();

  const mun = page.locator("[data-prueba='municipio']");
  await mun.getByRole("button", { name: /no sé en qué municipio/i }).click({ timeout: 15_000 });
  await expect(mun).toContainText(/dónde vives/i);
  await escogerMunicipio(page, "ANTIOQUIA", "RIONEGRO");

  // No se da por hecho: se pregunta.
  const conf = page.locator("[data-prueba='confirmar-residencia']");
  await expect(conf).toBeVisible({ timeout: 15_000 });
  await expect(conf).toContainText(/dónde ocurre el problema/i);
  await conf.getByRole("button", { name: /sí, ocurre ahí/i }).click();
  await expect(page.locator("[data-prueba='vuelta-3']")).toBeVisible({ timeout: 15_000 });
  // Que el motivo diga de dónde salió el municipio se comprueba en
  // `pruebas/ubicacion-ciudadana.test.ts`: es un dato, no una pantalla.
});

test("decir que el problema NO ocurre donde vive no deja municipio puesto", async ({ page }) => {
  await contar(page, "hay basura acumulada");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  const v2 = page.locator("[data-prueba='vuelta-2']");
  await v2.locator("#lugar").fill("por allá");
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();

  const mun = page.locator("[data-prueba='municipio']");
  await mun.getByRole("button", { name: /no sé en qué municipio/i }).click({ timeout: 15_000 });
  await escogerMunicipio(page, "ANTIOQUIA", "RIONEGRO");
  await page.locator("[data-prueba='confirmar-residencia']")
    .getByRole("button", { name: /no, ocurre en otra parte/i }).click();
  // Vuelve a preguntar, no se queda con el municipio donde vive.
  await expect(mun).toBeVisible();
  await expect(page.locator("[data-prueba='confirmar-residencia']")).toHaveCount(0);
});


test("se pregunta si habla por sí o por un grupo, y el grupo llega a la consola", async ({ page }) => {
  // **El dato no se capturaba en ninguna parte.** `es_colectivo` existía en la
  // tabla desde el primer día y nadie lo escribía ni lo leía, aunque el
  // requerimiento hablara de voceros desde el principio.
  const marca = `voceria-${Date.now()}`;
  await contar(page, `${marca}: la vía de la vereda está intransitable`);
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  const v2 = page.locator("[data-prueba='vuelta-2']");
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();
  await salirDelMunicipio(page);
  await page.locator("[data-prueba='vuelta-3']")
    .getByRole("button", { name: /continuar|listo/i }).first().click();

  const voz = page.locator("[data-prueba='voceria']");
  await expect(voz).toBeVisible({ timeout: 15_000 });
  await voz.getByRole("button", { name: /hablo por un grupo/i }).click();
  await voz.locator("#grupo").fill("la junta de acción comunal de la vereda El Salado");
  // Se le dice que no lo verificamos. Callarlo invitaría a leerlo como probado.
  await expect(voz).toContainText(/no lo verificamos/i);
  await voz.getByRole("button", { name: /^listo$/i }).click();
  await expect(page.locator("[data-prueba='afinado-listo']")).toBeVisible({ timeout: 15_000 });

  await page.goto("/consola");
  await page.locator(".bo-record-link", { hasText: marca }).filter({ visible: true })
    .click({ timeout: 15_000 });
  await page.waitForURL(/\/consola\/[0-9a-f-]{8}/);
  await expect(page.locator("body")).toContainText(/junta de acción comunal/);
  // Y el revisor ve el límite, no solo el dato.
  await expect(page.locator("body")).toContainText(/nadie verificó la representación/i);
});

test("hablar por uno mismo no deja grupo puesto", async ({ page }) => {
  await contar(page, "no hay alumbrado en la calle");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  await page.locator("[data-prueba='vuelta-2']")
    .getByRole("button", { name: /continuar|listo/i }).first().click();
  await salirDelMunicipio(page);
  await page.locator("[data-prueba='vuelta-3']")
    .getByRole("button", { name: /continuar|listo/i }).first().click();
  await page.locator("[data-prueba='voceria']").getByRole("button", { name: /hablo por mí/i }).click();
  await expect(page.locator("[data-prueba='afinado-listo']")).toBeVisible({ timeout: 15_000 });
});
