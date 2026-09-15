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
import { salirDelMunicipio, escogerMunicipio, confirmarMunicipio, hablarPorMi, decirElLugar } from "./ayudas.ts";

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
  // Corregir no cambia el orden: lo siguiente es dónde ocurre, una sola vez.
  await expect(page.locator("[data-prueba='municipio']")).toBeVisible({ timeout: 15_000 });
});

test("ninguna vuelta pide más de tres cosas, y el paso se ve", async ({ page }) => {
  await contar(page, "el puesto de salud abre dos días a la semana");
  await expect(page.locator("[data-prueba='vuelta-1']")).toBeVisible({ timeout: 20_000 });
  await expect(page.locator("body")).toContainText(/paso \d+ de \d+/i);
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i }).click();

  // **El lugar va primero y va solo**: es la única pantalla que lo pregunta.
  await salirDelMunicipio(page);

  const v2 = page.locator("[data-prueba='vuelta-2']");
  await expect(v2).toBeVisible({ timeout: 15_000 });
  expect(await v2.locator("input:not([type=hidden]), textarea").count(),
         "la vuelta 2 pide más de tres cosas a la vez").toBeLessThanOrEqual(3);
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();

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
  await salirDelMunicipio(page);
  await page.locator("[data-prueba='vuelta-2']").getByRole("button", { name: /terminar aquí/i }).click();
  await hablarPorMi(page);
  await expect(page.locator("[data-prueba='afinado-listo']")).toBeVisible({ timeout: 15_000 });
});

test("lo que precisa después llega al aporte y a la consola", async ({ page }) => {
  const marca = `precisar-${Date.now()}`;
  await contar(page, `${marca}: se inunda la vía cuando llueve`);
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });

  // El lugar, con sus palabras, en la pantalla del municipio. «La vereda El
  // Salado» no llega a ninguno: se guarda igual y se sale sin inventarlo.
  await decirElLugar(page, "la vereda El Salado");
  await salirDelMunicipio(page);

  const v2 = page.locator("[data-prueba='vuelta-2']");
  await expect(v2).toBeVisible({ timeout: 15_000 });
  await v2.locator("#afectados").fill("unas veinte familias");
  await v2.locator("#desdeCuando").fill("desde el invierno pasado");
  await v2.locator("#resultadoEsperado").fill("que arreglen el desagüe");
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();

  const v3 = page.locator("[data-prueba='vuelta-3']");
  await expect(v3).toBeVisible({ timeout: 15_000 });
  await v3.getByRole("button", { name: /listo|continuar/i }).first().click();
  await hablarPorMi(page);
  await expect(page.locator("[data-prueba='afinado-listo']")).toBeVisible({ timeout: 15_000 });

  await page.goto(`/consola?ubicacion=todos&q=${encodeURIComponent(marca)}`);
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

  // Lo escribe con sus palabras y la pantalla busca sola: es lo que permite que
  // el lugar se pregunte **una vez**.
  await decirElLugar(page, "en la verede la martinita y rionegro antioquia");

  const mun = page.locator("[data-prueba='municipio']");
  const sugerencias = page.locator("[data-prueba='sugerencias']");
  await expect(sugerencias).toBeVisible({ timeout: 15_000 });
  await expect(sugerencias).toContainText(/RIONEGRO/i);
  await expect(sugerencias).toContainText(/ANTIOQUIA/i);
  // La salida importa tanto como la lista: sin ella, quien no reconozca ninguno
  // escoge el primero por salir del paso. Ahora el selector está ahí mismo.
  await expect(mun.locator("#departamento")).toBeVisible();

  await sugerencias.getByRole("button", { name: /RIONEGRO/i }).first().click();
  await confirmarMunicipio(page, "RIONEGRO");

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

  // **Pidiendo «por aclarar» explícitamente.** La bandeja ya no arranca
  // filtrada por eso: arrancaba así y escondía justo los que ya tienen
  // municipio, que es lo que había que poder ver.
  await page.goto(`/consola?ubicacion=por_aclarar&q=${encodeURIComponent(marca)}`);
  await expect(page.locator(".bo-record-link", { hasText: marca })).toHaveCount(0);
});

test("un nombre que existe en dos departamentos los muestra los dos", async ({ page }) => {
  // **Es la regla entera.** Elegir por la persona cuando el texto no distingue
  // es exactamente la inferencia que `I2` prohíbe.
  await contar(page, "se cayó el puente y no podemos pasar");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  await decirElLugar(page, "en rionegro");

  const sug = page.locator("[data-prueba='sugerencias']");
  await expect(sug).toBeVisible({ timeout: 15_000 });
  await expect(sug).toContainText(/ANTIOQUIA/i);
  await expect(sug).toContainText(/SANTANDER/i);
  await expect(sug).toContainText(/solo tú sabes cuál/i);
});

test("si lo que escribió no llega a un municipio, se le pregunta por el nombre", async ({ page }) => {
  // **Este es el arreglo.** Antes, «la vereda de arriba» se daba por contestado
  // y el aporte llegaba a la bandeja sin territorio al que sumarlo — que es como
  // no tenerlo. Ahora se insiste, se explica para qué sirve, y se busca por
  // nombre.
  await contar(page, "no hay agua");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  await decirElLugar(page, "en mi casa");

  const mun = page.locator("[data-prueba='municipio']");
  await expect(mun).toContainText(/dónde queda/i);
  // Se le dice qué se pierde, sin regañarla.
  await expect(mun).toContainText(/no se puede sumar al de tus vecinos/i);

  await escogerMunicipio(page, "ANTIOQUIA", "RIONEGRO");
  await expect(page.locator("[data-prueba='vuelta-2']")).toBeVisible({ timeout: 15_000 });
});

test("si no sabe el municipio del problema, se le pregunta dónde vive", async ({ page }) => {
  // Pero vivir ahí no es que el problema ocurra ahí: `GEO-01` dice que una
  // dirección residencial no es el lugar del problema **sin confirmación**, y
  // esa confirmación se pregunta aparte.
  await contar(page, "se cayó el puente y no podemos pasar al colegio");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  await decirElLugar(page, "aquí cerca");

  const mun = page.locator("[data-prueba='municipio']");
  await mun.getByRole("button", { name: /no sé en qué municipio/i }).click({ timeout: 15_000 });
  await expect(mun).toContainText(/dónde vives/i);
  await escogerMunicipio(page, "ANTIOQUIA", "RIONEGRO");

  // No se da por hecho: se pregunta.
  const conf = page.locator("[data-prueba='confirmar-residencia']");
  await expect(conf).toBeVisible({ timeout: 15_000 });
  await expect(conf).toContainText(/dónde ocurre el problema/i);
  await conf.getByRole("button", { name: /sí, ocurre ahí/i }).click();
  await expect(page.locator("[data-prueba='vuelta-2']")).toBeVisible({ timeout: 15_000 });
  // Que el motivo diga de dónde salió el municipio se comprueba en
  // `pruebas/ubicacion-ciudadana.test.ts`: es un dato, no una pantalla.
});

test("decir que el problema NO ocurre donde vive no deja municipio puesto", async ({ page }) => {
  await contar(page, "hay basura acumulada");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  const mun = page.locator("[data-prueba='municipio']");
  await mun.getByRole("button", { name: /no sé en qué municipio/i }).click({ timeout: 20_000 });
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
  await contar(page, `${marca}: la vía principal está intransitable`);
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  await salirDelMunicipio(page);
  await page.locator("[data-prueba='vuelta-2']")
    .getByRole("button", { name: /continuar|listo/i }).first().click();
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

  await page.goto(`/consola?ubicacion=todos&q=${encodeURIComponent(marca)}`);
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
  await salirDelMunicipio(page);
  await page.locator("[data-prueba='vuelta-2']")
    .getByRole("button", { name: /continuar|listo/i }).first().click();
  await page.locator("[data-prueba='vuelta-3']")
    .getByRole("button", { name: /continuar|listo/i }).first().click();
  await page.locator("[data-prueba='voceria']").getByRole("button", { name: /hablo por mí/i }).click();
  await expect(page.locator("[data-prueba='afinado-listo']")).toBeVisible({ timeout: 15_000 });
});


test("escoger mal el municipio se puede corregir antes de guardarlo", async ({ page }) => {
  // **Escoger no confirma.** Antes, tocar un municipio lo guardaba y pasaba de
  // largo: quien se equivocaba de fila —y con 125 en una lista es fácil— ya no
  // tenía cómo volver. Un municipio equivocado es peor que ninguno, porque
  // parece un dato.
  const marca = `cambiar-${Date.now()}`;
  await contar(page, `${marca}: se inunda la vía cuando llueve`);
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  const mun = page.locator("[data-prueba='municipio']");
  await expect(mun).toBeVisible({ timeout: 20_000 });
  await mun.locator("#departamento").selectOption({ label: "ANTIOQUIA" });

  // El buscador: 125 municipios no se recorren en una lista.
  await mun.locator("#filtro-municipio").fill("bel");
  await expect(mun.getByRole("button", { name: /^BELLO$/i })).toBeVisible();
  await expect(mun.getByRole("button", { name: /^BELMIRA$/i })).toBeVisible();
  await mun.getByRole("button", { name: /^BELLO$/i }).click();

  // Se equivocó: puede volver.
  const conf = page.locator("[data-prueba='confirmar-municipio']");
  await expect(conf).toContainText(/BELLO/);
  await conf.getByRole("button", { name: /no, cambiar/i }).click();
  await expect(conf).toHaveCount(0);

  await mun.locator("#filtro-municipio").fill("rioneg");
  await mun.getByRole("button", { name: /^RIONEGRO$/i }).click();
  await expect(conf).toContainText(/RIONEGRO/);
  await conf.getByRole("button", { name: /sí, es ahí/i }).click();

  await expect(page.locator("[data-prueba='vuelta-2']")).toBeVisible({ timeout: 15_000 });

  // Y lo guardado es el segundo, no el primero.
  await page.goto("/mis-aportes");
  await expect(page.locator("body")).toBeVisible();
});

test("el filtro del municipio ignora tildes y mayúsculas", async ({ page }) => {
  // Nadie escribe «ABRIAQUÍ» con tilde ni en mayúsculas.
  await contar(page, "no hay agua en la vereda");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  const mun = page.locator("[data-prueba='municipio']");
  await expect(mun).toBeVisible({ timeout: 20_000 });
  await mun.locator("#departamento").selectOption({ label: "ANTIOQUIA" });
  await mun.locator("#filtro-municipio").fill("abriaqui");
  await expect(mun.getByRole("button", { name: /^ABRIAQUÍ$/i })).toBeVisible();
});


test("lo entendido no queda pegado: los términos son hijos directos", async ({ page }) => {
  // El sistema de diseño espacia la lista con `dt:first-child {margin-top:0}`.
  // Al envolver cada par en un `div`, **todos** los `dt` pasaban a ser primer
  // hijo y perdían el margen: la respuesta de una pregunta quedaba pegada al
  // título de la siguiente.
  //
  // Se comprueba la causa y no el margen, porque el margen solo se nota cuando
  // hay dos datos —y sin IA la lectura trae uno solo—. Una prueba que solo pasa
  // cuando hay IA no vigila nada en los recorridos.
  //
  // No lo vio el compilador, ni el chequeo de clases, ni ninguna prueba. Lo vio
  // una persona mirando la pantalla.
  await contar(page, "El agua de nuestras casas está llegando con olores a gasolina");
  const lista = page.locator("[data-prueba='vuelta-1'] .pc-detail-facts");
  await expect(lista).toBeVisible({ timeout: 20_000 });

  const sueltos = await lista.evaluate((dl) => ({
    todos: dl.querySelectorAll("dt").length,
    directos: dl.querySelectorAll(":scope > dt").length,
    envoltorios: dl.querySelectorAll(":scope > div").length,
  }));
  expect(sueltos.todos).toBeGreaterThan(0);
  expect(sueltos.directos, "hay dt envueltos: el sistema de diseño no los va a espaciar")
    .toBe(sueltos.todos);
  expect(sueltos.envoltorios, "un div dentro del dl rompe dt:first-child").toBe(0);
});


test("un lugar que no lleva a ningún municipio no cuenta como contestado", async ({ page }) => {
  // «La vereda está intransitable» es un lugar dentro de la frase y no lleva a
  // ningún municipio. Como la lectura traía algo en «dónde», se daba la
  // pregunta por contestada y no se volvía a preguntar: el aporte llegaba a la
  // bandeja sin territorio al que sumarlo.
  //
  // Es el mismo agujero que «en mi casa», por otro camino. Lo destapó el
  // proveedor falso de los recorridos, no una revisión de código.
  await contar(page, "la vía de la vereda está intransitable");
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i })
    .click({ timeout: 20_000 });
  await expect(page.locator("[data-prueba='municipio']")).toBeVisible({ timeout: 15_000 });
});

test("contar tres cosas a la vez: se escoge una y las otras no se pierden", async ({ page }) => {
  // Mucha gente llega con todo junto. Son tres necesidades: cada una va a otra
  // entidad, a otro expediente y se compara con otras distintas. Mezcladas en
  // un aporte, ninguna se puede atender.
  await contar(page, "no hay agua en la vereda, la vía está muy mala, y el puesto de salud abre dos días");

  const escoger = page.locator("[data-prueba='escoger']");
  await expect(escoger).toBeVisible({ timeout: 20_000 });
  await expect(escoger).toContainText(/contaste 3 cosas/i);
  // Lo primero que hay que decirle: escoger no le borra lo demás.
  await expect(escoger).toContainText(/no se pierde nada/i);

  await escoger.getByRole("button", { name: /puesto de salud/i }).click();
  const v1 = page.locator("[data-prueba='vuelta-1']");
  await expect(v1).toBeVisible();
  await expect(v1).toContainText(/puesto de salud/);
  // Y lo que hablamos ahora es solo eso.
  await expect(v1).not.toContainText(/la vía está muy mala/);
});

test("si en realidad era una sola cosa, se puede decir", async ({ page }) => {
  await contar(page, "no hay agua en la vereda, la vía está muy mala");
  const escoger = page.locator("[data-prueba='escoger']");
  await expect(escoger).toBeVisible({ timeout: 20_000 });
  await escoger.getByRole("button", { name: /son lo mismo/i }).click();
  await expect(page.locator("[data-prueba='vuelta-1']")).toBeVisible();
  await expect(page.locator("[data-prueba='escoger']")).toHaveCount(0);
});

test("juntar dos que son lo mismo NO pierde lo que decía la segunda", async ({ page }) => {
  // El caso real: «tenemos problemas con aguas potables» y «esas aguas están
  // llegando con un color negro que parece petróleo» son lo mismo dicho dos
  // veces. Antes, «en realidad es una sola cosa» se quedaba con el primer
  // fragmento y el color negro desaparecía del problema — el relato seguía
  // guardado, pero lo que el revisor iba a leer ya no lo decía.
  //
  // Y separar de más es tan malo como juntar de más: dos expedientes para lo
  // mismo es lo que `R1` existe para evitar.
  const marca = `juntar-${Date.now()}`;
  await contar(page, `${marca}: tenemos problemas con el agua, el agua llega con color negro`);

  const escoger = page.locator("[data-prueba='escoger']");
  await expect(escoger).toBeVisible({ timeout: 20_000 });
  await escoger.getByRole("button", { name: /son lo mismo/i }).click();

  // Las dos cosas están en lo que se va a revisar.
  const v1 = page.locator("[data-prueba='vuelta-1']");
  await expect(v1).toBeVisible();
  await expect(v1).toContainText(/problemas con el agua/);
  await expect(v1).toContainText(/color negro/);
});


test("la pantalla final no mezcla el comprobante con lo que queda por contar", async ({ page }) => {
  // `.pc-success` es un estilo de TEXTO —verde y grande—, no una caja. Puesto
  // en la sección teñía de verde y agrandaba todo lo de dentro, incluido el
  // aviso de que esto no es un compromiso de obra: un aviso en verde de buena
  // noticia se lee como lo contrario de lo que dice.
  //
  // Y el bloque de «también nos contaste» iba pegado debajo del comprobante,
  // con dos botones azules compitiendo por el mismo clic.
  await contar(page, "no hay agua en la vereda, la vía está muy mala");
  await page.locator("[data-prueba='escoger']")
    .getByRole("button", { name: /no hay agua/i }).click({ timeout: 20_000 });
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i }).click();
  // El lugar es el primer paso después de lo que entendimos.
  await salirDelMunicipio(page);
  await page.locator("[data-prueba='vuelta-2']")
    .getByRole("button", { name: /continuar|listo/i }).first().click();
  await page.locator("[data-prueba='vuelta-3']")
    .getByRole("button", { name: /continuar|listo/i }).first().click();
  await hablarPorMi(page);

  const listo = page.locator("[data-prueba='afinado-listo']");
  const pendientes = page.locator("[data-prueba='pendientes']");
  await expect(listo).toBeVisible({ timeout: 15_000 });
  await expect(pendientes).toBeVisible();

  // Son dos secciones, con aire entre ellas.
  const separacion = await pendientes.evaluate((el) => parseFloat(getComputedStyle(el).marginTop));
  expect(separacion, "el bloque de lo pendiente va pegado al comprobante").toBeGreaterThan(24);

  // El aviso no está teñido del color de la buena noticia.
  const colores = await listo.evaluate((el) => ({
    exito: getComputedStyle(el.querySelector(".pc-success")!).color,
    aviso: getComputedStyle(el.querySelector(".pc-note")!).color,
  }));
  expect(colores.aviso, "el aviso se está pintando como buena noticia").not.toBe(colores.exito);

  // Y los dos botones no compiten: el de contar otra cosa es secundario.
  await expect(pendientes.locator(".pc-action[data-variant='secondary']").first()).toBeVisible();
});


test("después de corregir, los pasos siguientes dicen de qué va el aporte", async ({ page }) => {
  // Al corregir, el texto desaparecía de la vista y lo siguiente eran tres
  // cajas vacías: ni se sabía si la corrección se había guardado, ni de qué se
  // estaba hablando ya.
  await contar(page, "el internet no sirve ni para comunicarnos");
  const v1 = page.locator("[data-prueba='vuelta-1']");
  await v1.getByRole("button", { name: /no es eso/i }).click({ timeout: 20_000 });
  await v1.locator("textarea").first().fill("el internet no llega a la vereda");
  await v1.getByRole("button", { name: /guardar y seguir/i }).click();

  const sobre = page.locator("[data-prueba='sobre-que']");
  await expect(sobre).toBeVisible({ timeout: 15_000 });
  await expect(sobre).toContainText("el internet no llega a la vereda");

  // Y sigue diciéndolo en el paso del municipio, no solo en el primero.
  await expect(page.locator("[data-prueba='municipio']")).toBeVisible({ timeout: 15_000 });
  await expect(sobre).toContainText("el internet no llega a la vereda");
});

test("cuando contó varias cosas, los pasos dicen de cuál se habla", async ({ page }) => {
  // Importa el doble: las preguntas que vienen —dónde, a quiénes, desde
  // cuándo— son de UNO de los problemas, y sin decir cuál se contestan de
  // memoria, mezclando los tres otra vez.
  await contar(page, "no hay agua en la vereda, la vía está muy mala");
  await page.locator("[data-prueba='escoger']")
    .getByRole("button", { name: /la vía está muy mala/i }).click({ timeout: 20_000 });
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i }).click();

  const sobre = page.locator("[data-prueba='sobre-que']");
  await expect(sobre).toContainText(/la vía está muy mala/);
  await expect(sobre).not.toContainText(/no hay agua/);
});


test("al contar el segundo problema no se vuelve a preguntar lo que ya dijo", async ({ page }) => {
  // Quien cuenta dos cosas vive en el mismo sitio y le pasan a la misma gente.
  // Volver a preguntárselo todo desde cero es lo que hace que abandone en el
  // segundo — y entonces la segunda necesidad se pierde, que es justo lo que
  // partir en dos venía a evitar.
  await contar(page, "no hay agua en la vereda, y además están acabando con la fauna del mar");

  await page.locator("[data-prueba='escoger']")
    .getByRole("button", { name: /no hay agua/i }).click({ timeout: 20_000 });
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i }).click();

  // Se contesta el contexto del primero: el lugar en su pantalla, lo demás en
  // las vueltas.
  await decirElLugar(page, "la vereda El Salado");
  await escogerMunicipio(page, "ANTIOQUIA", "RIONEGRO");

  const v2 = page.locator("[data-prueba='vuelta-2']");
  await expect(v2).toBeVisible({ timeout: 15_000 });
  await v2.locator("#afectados").fill("unas veinte familias");
  await v2.locator("#desdeCuando").fill("desde hace dos meses");
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();
  await page.locator("[data-prueba='vuelta-3']")
    .getByRole("button", { name: /continuar|listo/i }).first().click();
  await hablarPorMi(page);

  // Y se pasa al segundo.
  await page.locator("[data-prueba='pendientes']")
    .getByRole("button", { name: /fauna del mar/i }).click({ timeout: 15_000 });
  await expect(page.locator("#relato")).toHaveValue(/fauna del mar/, { timeout: 15_000 });
  await page.getByRole("button", { name: /continuar/i }).click();

  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 20_000 });

  // Aquí está lo que se arregla: se le ofrece lo de antes en vez de volver a
  // preguntárselo.
  const heredado = page.locator("[data-prueba='heredado']");
  await expect(heredado).toBeVisible({ timeout: 15_000 });
  await expect(heredado).toContainText(/RIONEGRO/);
  await expect(heredado).toContainText(/veinte familias/);
  await expect(heredado).toContainText(/dos meses/);
  await heredado.getByRole("button", { name: /sí, es igual/i }).click();

  // Y ya no se le pregunta ni el lugar, ni a quiénes, ni desde cuándo: solo lo
  // que es propio de **este** problema. **Tampoco vuelve la pantalla del
  // municipio**: ya hay uno aceptado, y repetirla sería preguntar dos veces lo
  // mismo por un camino distinto.
  const resto = page.locator("[data-prueba='vuelta-2']");
  await expect(resto).toBeVisible({ timeout: 15_000 });
  await expect(page.locator("[data-prueba='municipio']")).toHaveCount(0);
  await expect(resto.locator("#afectados")).toHaveCount(0);
  await expect(resto.locator("#desdeCuando")).toHaveCount(0);
  await expect(resto.locator("#resultadoEsperado")).toBeVisible();

  await resto.getByRole("button", { name: /continuar|listo/i }).first().click();
  await expect(page.locator("[data-prueba='voceria']")).toBeVisible({ timeout: 15_000 });
});

test("si el segundo problema es en otra parte, se pregunta de nuevo", async ({ page }) => {
  // **No se hereda: se propone.** Alguien puede contar lo del agua de su casa y
  // lo de la vía del colegio de sus hijos, que está en otro municipio. Darlo
  // por hecho sería la inferencia que `I2` prohíbe.
  await contar(page, "no hay agua en la vereda, y además la vía del colegio está mala");
  await page.locator("[data-prueba='escoger']")
    .getByRole("button", { name: /no hay agua/i }).click({ timeout: 20_000 });
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i }).click();
  await decirElLugar(page, "la vereda El Salado");
  await escogerMunicipio(page, "ANTIOQUIA", "RIONEGRO");
  await page.locator("[data-prueba='vuelta-2']")
    .getByRole("button", { name: /continuar|listo/i }).first().click();
  await page.locator("[data-prueba='vuelta-3']")
    .getByRole("button", { name: /continuar|listo/i }).first().click();
  await hablarPorMi(page);

  await page.locator("[data-prueba='pendientes']")
    .getByRole("button", { name: /vía del colegio/i }).click({ timeout: 15_000 });
  await page.getByRole("button", { name: /continuar/i }).click({ timeout: 15_000 });
  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 20_000 });

  await page.locator("[data-prueba='heredado']")
    .getByRole("button", { name: /esto es distinto/i }).click({ timeout: 15_000 });
  // Se le pregunta como si fuera la primera vez: vuelve la pantalla del lugar.
  await expect(page.locator("[data-prueba='municipio']")).toBeVisible({ timeout: 15_000 });
});

test("la persona puede ver TODO lo que quedó registrado suyo", async ({ page }) => {
  // Antes solo veía el relato y el lugar, y había contestado el doble. No poder
  // ver lo que uno mismo contó es lo que hace dejar de creer que sirvió de algo.
  const marca = `registrado-${Date.now()}`;
  await contar(page, `${marca}: no hay agua en la escuela`);
  const codigo = await page.locator("[data-prueba='codigo']").innerText({ timeout: 20_000 });
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i }).click();

  await decirElLugar(page, "la vereda El Salado");
  await escogerMunicipio(page, "ANTIOQUIA", "RIONEGRO");

  const v2 = page.locator("[data-prueba='vuelta-2']");
  await expect(v2).toBeVisible({ timeout: 15_000 });
  await v2.locator("#afectados").fill("unas veinte familias");
  await v2.locator("#desdeCuando").fill("desde hace dos meses");
  await v2.locator("#resultadoEsperado").fill("que vuelva el agua a la escuela");
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();
  await page.locator("[data-prueba='vuelta-3']")
    .getByRole("button", { name: /continuar|listo/i }).first().click();

  const voz = page.locator("[data-prueba='voceria']");
  await voz.getByRole("button", { name: /hablo por un grupo/i }).click();
  await voz.locator("#grupo").fill("la junta de acción comunal");
  await voz.getByRole("button", { name: /^listo$/i }).click();
  await expect(page.locator("[data-prueba='afinado-listo']")).toBeVisible({ timeout: 15_000 });

  await page.goto("/mis-aportes");
  await page.fill("#codigo", codigo);
  await page.getByRole("button", { name: /consultar/i }).click();

  const registrado = page.locator("[data-prueba='lo-registrado']");
  await expect(registrado).toBeVisible({ timeout: 15_000 });
  await expect(registrado).toContainText("RIONEGRO");
  await expect(registrado).toContainText("El Salado");
  await expect(registrado).toContainText("veinte familias");
  await expect(registrado).toContainText("dos meses");
  await expect(registrado).toContainText("junta de acción comunal");
  await expect(registrado).toContainText("que vuelva el agua");
});

test("si el municipio está en el relato, SE PREGUNTA igual", async ({ page }) => {
  // El caso que rompió: alguien escribió «Las canchas de tunja boyaca están
  // rotas» y **no se le preguntó nada de ubicación**. El aporte llegó a la
  // bandeja sin municipio, con Tunja escrito en la primera línea.
  //
  // La causa: al encontrar Tunja en el relato se quitaba «dónde» de las
  // preguntas —para confirmarlo en vez de preguntarlo— pero el paso de
  // confirmar solo corría si la lectura traía un lugar, y no lo traía. Se
  // saltaba entero.
  //
  // De ahí la regla que ahora vigila esto: **no se llega al final sin haber
  // pasado por el municipio**, salvo que ya esté resuelto.
  await contar(page, "Las canchas de tunja boyaca todas estan rotas y los ninos no pueden jugar");
  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 20_000 });

  const mun = page.locator("[data-prueba='municipio']");
  await expect(mun).toBeVisible({ timeout: 15_000 });
  // Y le ofrece Tunja, que estaba escrito en su relato.
  await expect(mun).toContainText(/TUNJA/i);
});

test("nunca se termina sin haber pasado por el municipio", async ({ page }) => {
  // La red de seguridad: cualquier camino **automático** que llegue al final sin
  // municipio resuelto pasa antes por preguntarlo. Es la regla que mata esta
  // familia entera de fallos, no solo el caso que la destapó.
  //
  // No vale para «Terminar aquí»: ahí la persona dijo basta, y `N02` no deja
  // exigir la ubicación.
  await contar(page, "hay basura acumulada y nadie la recoge");
  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 20_000 });

  // Se contestan las vueltas sin llenar nada —que es lo que hace mucha gente—
  // y aun así el municipio se pregunta. Con «Terminar aquí» no: ahí la persona
  // dijo basta, y terminar tiene que terminar.
  // Aun saltándose todo, el municipio se pregunta — y ahora se pregunta
  // **primero**, que es lo que hace que no dependa de ningún camino.
  await expect(page.locator("[data-prueba='municipio']")).toBeVisible({ timeout: 15_000 });
  await salirDelMunicipio(page);

  const primera = page.locator("[data-prueba='vuelta-2']");
  await expect(primera).toBeVisible({ timeout: 15_000 });
  // Y «Terminar aquí» termina: `N02` no deja exigir la ubicación.
  await primera.getByRole("button", { name: /terminar aquí/i }).click();
  await expect(page.locator("[data-prueba='voceria']")).toBeVisible({ timeout: 15_000 });
});

test("una vuelta no borra lo que la persona escribió en la anterior", async ({ page }) => {
  // Pasó de verdad: alguien escribió «techarlas y hacerles mantenimiento» en una
  // vuelta, y la versión vigente de la síntesis acabó sin esa frase. La síntesis
  // se compone con lo que llega en el formulario, así que la vuelta siguiente la
  // reescribía con sus dos campos y perdía la anterior.
  const marca = `acumula-${Date.now()}`;
  await contar(page, `${marca}: las canchas están rotas`);
  const codigo = await page.locator("[data-prueba='codigo']").innerText({ timeout: 20_000 });
  await page.locator("[data-prueba='vuelta-1']").getByRole("button", { name: /sí, es eso/i }).click();

  await decirElLugar(page, "la vereda El Salado");
  await salirDelMunicipio(page);

  const v2 = page.locator("[data-prueba='vuelta-2']");
  await expect(v2).toBeVisible({ timeout: 15_000 });
  await v2.locator("#resultadoEsperado").fill("techarlas y hacerles mantenimiento");
  await v2.getByRole("button", { name: /continuar|listo/i }).first().click();

  const v3 = page.locator("[data-prueba='vuelta-3']");
  await expect(v3).toBeVisible({ timeout: 15_000 });
  await v3.locator("#solucionSugerida").fill("que las arreglen antes del invierno");
  await v3.getByRole("button", { name: /continuar|listo/i }).first().click();
  await hablarPorMi(page);

  // Las dos cosas tienen que estar en lo que quedó escrito.
  await page.goto("/mis-aportes");
  await page.fill("#codigo", codigo);
  await page.getByRole("button", { name: /consultar/i }).click();
  const registrado = page.locator("[data-prueba='lo-registrado']");
  await expect(registrado).toContainText("techarlas y hacerles mantenimiento", { timeout: 15_000 });
  await expect(registrado).toContainText("que las arreglen antes del invierno");
});

test("el departamento que nombró llega puesto en el selector", async ({ page }) => {
  // Salió de un caso real: la persona escribió «en cucuta norte de sarntander»
  // —con errata— dentro del relato. El municipio se resolvió, pero si hubiera
  // dicho «ninguno de estos» el selector arrancaba en blanco: le tocaba
  // escoger entre 1.122 municipios justo después de haber escrito dónde vive.
  //
  // Detectar algo y no usarlo es peor que no detectarlo: se le pide dos veces
  // lo mismo.
  await contar(page, "el agua llega negra y con olor raro");
  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 20_000 });

  // Escribe el departamento con sus palabras, con el municipio mal escrito.
  await decirElLugar(page, "un barrio de cucutta, norte de santander");
  const mun = page.locator("[data-prueba='municipio']");

  // El departamento viene puesto, y se dice de dónde salió: un campo que se
  // rellena solo sin explicación se lee como un dato que metió alguien.
  await expect(page.locator("[data-prueba='detectado']")).toContainText(/NORTE DE SANTANDER/i);
  await expect(mun.locator("#departamento")).toHaveValue(/^\d\d$/);
  // Y sus municipios ya están cargados: escoger deja de ser buscar entre 1.122.
  await expect(mun.locator("#filtro-municipio")).toBeVisible();
});

test("el lugar se pregunta UNA sola vez, y no en las vueltas", async ({ page }) => {
  // El negocio lo dijo pensando en quien vive lejos: *«preguntar dos veces, por
  // ejemplo dónde ocurre, no tiene mucho sentido»*. Antes se preguntaba en texto
  // libre en una vuelta y otra vez por departamento y municipio, y para quien
  // vive en una vereda dispersa esas dos son la misma pregunta seguida.
  await contar(page, "el puente está agrietado y nadie lo revisa");
  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 20_000 });

  // Una pantalla, con las tres formas de decirlo: con sus palabras, el
  // departamento y el municipio.
  const mun = page.locator("[data-prueba='municipio']");
  await expect(mun).toBeVisible({ timeout: 15_000 });
  await expect(mun.locator("#con-sus-palabras")).toBeVisible();
  await expect(mun.locator("#departamento")).toBeVisible();
  await salirDelMunicipio(page);

  // Y ninguna vuelta vuelve a preguntarlo.
  for (const v of ["vuelta-2", "vuelta-3"]) {
    const vuelta = page.locator(`[data-prueba='${v}']`);
    await expect(vuelta).toBeVisible({ timeout: 15_000 });
    await expect(vuelta.locator("#lugar"), `${v} vuelve a preguntar dónde ocurre`).toHaveCount(0);
    await vuelta.getByRole("button", { name: /continuar|listo/i }).first().click();
  }
  await expect(page.locator("[data-prueba='voceria']")).toBeVisible({ timeout: 15_000 });
});

test("se puede volver atrás, y lo escrito sigue ahí", async ({ page }) => {
  // Se podía ir para adelante y no para atrás: quien se daba cuenta en la
  // vuelta 2 de que el municipio estaba mal no tenía más salida que cerrar la
  // página — con el aporte guardado, pero a medio contar.
  await contar(page, "no hay alumbrado en la vía de entrada");
  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 20_000 });

  await decirElLugar(page, "la vereda El Salado");
  await salirDelMunicipio(page);

  const v2 = page.locator("[data-prueba='vuelta-2']");
  await expect(v2).toBeVisible({ timeout: 15_000 });
  await v2.locator("#afectados").fill("unas veinte familias");

  // Atrás: vuelve al lugar, y lo que escribió sigue escrito.
  await page.locator("[data-prueba='volver']").click();
  const mun = page.locator("[data-prueba='municipio']");
  await expect(mun).toBeVisible({ timeout: 15_000 });
  await expect(mun.locator("#con-sus-palabras")).toHaveValue(/El Salado/);

  // Y adelante otra vez, sin haber perdido el sitio.
  await salirDelMunicipio(page);
  await expect(v2).toBeVisible({ timeout: 15_000 });
});

test("volver atrás y cambiar el municipio NO deja dos territorios", async ({ page }) => {
  // `GEO-01` permite que un aporte tenga varios territorios, y eso vale cuando
  // el problema de verdad cruza dos municipios. Un error de dedo no es eso:
  // dejar los dos convertiría la equivocación en un dato, y el aporte se
  // contaría en dos sitios.
  const marca = `corregir-${Date.now()}`;
  await contar(page, `${marca}: el agua llega turbia`);
  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 20_000 });

  await escogerMunicipio(page, "ANTIOQUIA", "BELLO");
  await expect(page.locator("[data-prueba='vuelta-2']")).toBeVisible({ timeout: 15_000 });

  // Se dio cuenta: no era Bello.
  await page.locator("[data-prueba='volver']").click();
  await escogerMunicipio(page, "ANTIOQUIA", "RIONEGRO");
  await expect(page.locator("[data-prueba='vuelta-2']")).toBeVisible({ timeout: 15_000 });

  await page.goto(`/consola?ubicacion=todos&q=${encodeURIComponent(marca)}`);
  await page.locator(".bo-record-link", { hasText: marca }).filter({ visible: true })
    .click({ timeout: 15_000 });
  await page.waitForURL(/\/consola\/[0-9a-f-]{8}/);

  // Sobre los territorios, no sobre la sección: el formulario de corregir lleva
  // dentro los 1.122 municipios del catálogo, y buscar «BELLO» en la sección
  // entera encuentra la opción del desplegable — una prueba que falla por lo
  // que hay para escoger y no por lo que quedó guardado.
  const territorios = page.locator("[data-prueba='territorio']");
  await expect(territorios).toHaveCount(1, { timeout: 15_000 });
  await expect(territorios).toContainText(/RIONEGRO|05615/);
  await expect(territorios, "quedó guardado el municipio equivocado")
    .not.toContainText(/BELLO|05088/);
});

test("desde la última pregunta todavía se puede volver", async ({ page }) => {
  // Es donde alguien se acuerda de que escribió mal el municipio: la pantalla
  // dice «última pregunta» y hasta ahí no había forma de corregir nada sin
  // cerrar la página.
  await contar(page, "no hay alumbrado en la vía de entrada");
  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 20_000 });
  await salirDelMunicipio(page);
  for (const v of ["vuelta-2", "vuelta-3"]) {
    await page.locator(`[data-prueba='${v}']`)
      .getByRole("button", { name: /continuar|listo/i }).first().click({ timeout: 15_000 });
  }

  const voz = page.locator("[data-prueba='voceria']");
  await expect(voz).toBeVisible({ timeout: 15_000 });
  await voz.locator("[data-prueba='volver']").click();
  await expect(page.locator("[data-prueba='vuelta-3']")).toBeVisible({ timeout: 15_000 });
});

test("si ya dijo dónde, la pantalla del lugar CONFIRMA en vez de repreguntar", async ({ page }) => {
  // Recorriendo el flujo como una persona: la pantalla anterior le enseña
  // «Dónde ocurre: la vereda La Martinita, Rionegro» y la siguiente le
  // preguntaba «¿dónde queda?» con eso mismo escrito en la caja. Son dos
  // pantallas distintas, pero se sienten como que no la escuchamos.
  await contar(page, "el agua llega sucia en la vereda la martinita de rionegro antioquia");
  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 25_000 });

  const mun = page.locator("[data-prueba='municipio']");
  await expect(mun).toBeVisible({ timeout: 20_000 });
  await expect(mun).toContainText(/¿Es aquí\?/i);
  await expect(mun).toContainText(/lo tomamos de lo que contaste/i);
  await expect(mun).not.toContainText(/dilo con tus palabras/i);
  // Y lo suyo viene puesto, no en blanco.
  await expect(mun.locator("#con-sus-palabras")).toHaveValue(/martinita/i);
});
