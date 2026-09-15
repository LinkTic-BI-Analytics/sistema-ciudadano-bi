// La consola de revisión, en un navegador de verdad.
//
// Ejercita todo lo que estaba construido y no se podía ver: la bandeja de
// T027, el expediente de T028 y la prioridad de T035.

import { test, expect, type Page } from "@playwright/test";
import { escogerMunicipio } from "./ayudas.ts";

// Abre el aporte marcado, haciendo clic en **lo que una persona vería**.
//
// Cada fila se renderiza dos veces —tarjeta y tabla— porque el sistema de
// diseño alterna las dos formas en 36rem. Exactamente una se ve, y afirmarlo
// aquí es lo que delata que la hoja no cargó: sin CSS se ven las dos, y un
// clic ambiguo se lee como una prueba mal escrita cuando es la pantalla la que
// está sin estilos.
async function abrirAporte(page: Page, marca: string) {
  // **Se busca, no se confía en que esté entre los primeros.** La bandeja
  // muestra los más antiguos primero y las corridas acumulan: el aporte recién
  // creado se salía de la lista y la prueba fallaba sin que nada estuviera
  // roto. Además es como se usa de verdad.
  await page.goto(`/consola?ubicacion=todos&q=${encodeURIComponent(marca)}`);
  const visibles = page.locator(".bo-record-link", { hasText: marca }).filter({ visible: true });
  await expect(visibles).toHaveCount(1);
  await visibles.click();
  // **Y esperar a que el panel esté.** Sin esto el ayudante devuelve con la
  // navegación en curso, y lo que venga detrás corre contra la bandeja: una
  // prueba que recorría los campos del aporte los contaba sobre una página que
  // no tenía ninguno, y pasaba por vacía. Un falso verde no avisa.
  await page.waitForURL(/\/consola\/[0-9a-f-]{8}/);
  await expect(page.locator(".bo-inspector")).toBeVisible();
}

test("la bandeja muestra lo que llega y dice que no ordena por popularidad", async ({ page }) => {
  await page.goto("/participar");
  // El lugar ya no se pide aquí: se pregunta después y **solo si la persona no
  // lo contó** (ADR 0012). Este relato no lo dice, así que el aporte llega a la
  // bandeja sin ubicación, que es justo lo que esta pantalla existe para
  // resolver.
  await page.fill("#relato", "no hay agua en la vereda desde hace dos semanas");
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 20_000 });

  await page.goto("/consola");
  await expect(page.locator("h1")).toContainText(/bandeja de revisión/i);
  await expect(page.locator("body")).toContainText(/sin orden por popularidad/i);
  await expect(page.locator(".bo-record-link").filter({ visible: true }).first()).toBeVisible();
});

test("la consola trae su hoja de estilos puesta", async ({ page }) => {
  // `backoffice.css` se copia a `producto/src/producto/tokens/` y hay que
  // importarla aparte. **No estaba importada**, y la consola se construyó
  // entera sin estilos sin que ninguna prueba lo dijera: una pantalla sin CSS
  // muestra de más, no de menos.
  //
  // `.bo-shell` es `display:grid` en la hoja y `block` sin ella. No depende de
  // que haya datos, así que sirve igual con la bandeja vacía.
  await page.goto("/consola");
  await expect(page.locator(".bo-shell")).toHaveCSS("display", "grid");
});

test("la consola avisa que no tiene permisos", async ({ page }) => {
  // Una pantalla interna sin autorización en un servidor de desarrollo es
  // aceptable; que nadie se entere, no.
  await page.goto("/consola");
  await expect(page.locator(".bo-sidebar")).toContainText(/sin permisos/i);
  await expect(page.locator(".bo-sidebar")).toContainText(/no desplegar/i);
});

test("abrir un aporte muestra el relato original y dice que no se edita", async ({ page }) => {
  // Un relato único para poder encontrarlo: la bandeja muestra **el más antiguo
  // primero** —que es lo que pide `backoffice-especificacion.md`, sin puntaje de
  // prioridad— así que tomar «el primero» sería tomar el de otra prueba.
  const marca = `puente-${Date.now()}`;
  const relato = `${marca}: el puente peatonal está deteriorado`;
  await page.goto("/participar");
  await page.fill("#relato", relato);
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 15_000 });

  await page.goto("/consola");
  await abrirAporte(page, marca);
  await expect(page.locator("blockquote")).toContainText(relato);
  await expect(page.locator(".bo-source")).toContainText(/no se edita/i);
  // I2: la ubicación llega sin código, y la pantalla lo dice.
  await expect(page.locator(".bo-history-section").first()).toContainText(/no se infiere/i);
});

test("abrir un expediente y priorizarlo, sin puntaje", async ({ page }) => {
  const marca = `escuela-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: la escuela se quedó sin agua y los niños no van`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 15_000 });

  await page.goto("/consola");
  await abrirAporte(page, marca);

  // Los selectores van acotados al panel: hay dos campos llamados `motivo` en la
  // página —uno en la ubicación y otro en el expediente— y sin acotar, el `fill`
  // va al de arriba. Lo descubrió esta prueba fallando.
  const panel = page.locator(".bo-inspector");
  await panel.locator("input[name='descripcion']").fill("sin agua en la escuela");
  await panel.locator("input[name='motivo']").fill("es el relato que la origina");
  await panel.getByRole("button", { name: /^abrir$/i }).click();
  await expect(panel).toContainText(/sin agua en la escuela/, { timeout: 15_000 });

  // **Se abre primero.** Los formularios de gestión van plegados: iban todos
  // abiertos a la vez y la ficha empezaba con un muro de listas —tres
  // desplegables de 1.122 municipios— antes del relato. Quien revisa también
  // tiene que abrirlos.
  await panel.locator("summary", { hasText: /registrar prioridad/i }).click();
  // Por su id: en el panel hay tres campos `motivo` —abrir, priorizar y
  // remitir— y sin acotar el `fill` va al primero que encuentre.
  await panel.locator("#pri-motivo").fill("afecta a menores y es una sola fuente");
  await panel.locator("select[name='afectacion']").selectOption("alta");
  await panel.getByRole("button", { name: /registrar prioridad/i }).click();
  await expect(panel).toContainText(/afecta a menores/, { timeout: 15_000 });
  // Los cinco factores salen por separado, que es el punto: juntarlos en un
  // número sería la fórmula que nadie acordó.
  await expect(panel).toContainText(/afectación: alta/i);
  await expect(panel).toContainText(/urgencia: —/i);
  await expect(panel).toContainText(/no hay puntaje ni ranking/i);
  // Que NO exista una puntuación se prueba donde de verdad importa: contra el
  // módulo y contra las columnas de la tabla, en pruebas/prioridad.test.ts.
  // Buscar la palabra aquí fallaba contra la propia frase que lo explica.
});

test("todo campo de la consola tiene etiqueta, no placeholder", async ({ page }) => {
  // La pantalla ciudadana tiene esta prueba desde el primer día. La consola no
  // la tenía, y se construyó entera con el nombre del campo metido en el
  // placeholder: desaparece al escribir, no lo anuncia un lector de pantalla
  // como nombre del campo, y en gris sobre blanco no pasa el contraste.
  //
  // Se recorre el panel de un aporte porque es donde están todos los campos
  // juntos: ubicación, expediente y prioridad.
  const marca = `etiquetas-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: la vía se inunda cada invierno`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 15_000 });

  await page.goto("/consola");
  await abrirAporte(page, marca);

  const sinEtiqueta = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("input, select, textarea")]
      .filter((c) => (c as HTMLInputElement).type !== "hidden" && c.offsetParent !== null)
      .filter((c) => !c.id || !document.querySelector(`label[for="${c.id}"]`))
      .map((c) => c.getAttribute("name") ?? c.tagName.toLowerCase()),
  );
  expect(sinEtiqueta, "campos sin <label for>: su nombre vive en el placeholder").toEqual([]);
});


test("la bandeja dice qué le falta a cada aporte", async ({ page }) => {
  // Se diseñó cuando el formulario capturaba tres cosas. Hoy captura diez, y el
  // revisor seguía viendo relato, lugar y fecha: no había cómo distinguir un
  // aporte de otro ni saber qué preguntar.
  const marca = `falta-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: no hay agua`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 25_000 });

  // Se busca, y se mira **lo que se ve**: en teléfono la tabla da paso a una
  // lista con los mismos datos, y los dos tienen que decir lo mismo.
  await page.goto(`/consola?q=${encodeURIComponent(marca)}`);
  const fila = page.locator(".bo-record-card, .bo-table-desktop tr")
    .filter({ hasText: marca }).filter({ visible: true }).first();
  await expect(fila).toBeVisible({ timeout: 15_000 });
  // Lo que falta se nombra en palabras: el revisor tiene que saber qué
  // preguntar, no qué columna está vacía.
  await expect(fila).toContainText(/municipio/);
  await expect(fila).toContainText(/a quiénes/);
  await expect(fila).toContainText(/desde cuándo/);
  // Y dónde va la gestión. **No «quién lo tiene»**: esa columna mostraba
  // `ubicacion.autor`, que es quien confirmó el municipio —«ciudadano»— y no un
  // revisor. Enseñarlo como responsable era inventarse uno; la asignación de
  // verdad está bloqueada por permisos (`T032`).
  await expect(fila).toContainText(/sin expediente/);
  await expect(fila).not.toContainText(/quién lo tiene/i);
});

test("se puede buscar, y el orden no cambia al filtrar", async ({ page }) => {
  const marca = `buscar-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: se cayó el puente de la vereda`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 25_000 });

  await page.goto("/consola");
  await page.fill("#q", marca);
  await page.getByRole("button", { name: /^filtrar$/i }).click();
  await expect(page.locator(".bo-record-link").filter({ visible: true })).toHaveCount(1, { timeout: 15_000 });
  await expect(page.locator("body")).toContainText(marca);

  // Sin resultados se explica y se ofrece limpiar, en vez de una lista vacía
  // que parece un error del sistema.
  await page.fill("#q", "esto-no-existe-en-ningun-relato");
  await page.getByRole("button", { name: /^filtrar$/i }).click();
  await expect(page.locator("[data-prueba='sin-resultados']")).toBeVisible();
  await expect(page.getByRole("link", { name: /ver todos/i })).toBeVisible();
});

test("«abrir siguiente» abre el más antiguo, no el más grave", async ({ page }) => {
  // No hay puntuación de prioridad, y no haberla es la decisión (`BI-02`).
  await page.goto("/participar");
  await page.fill("#relato", "el primero que llegó, hace rato");
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 25_000 });

  await page.goto("/consola");
  const primero = await page.locator(".bo-table-desktop .bo-record-link").first().getAttribute("href");
  const siguiente = await page.getByRole("link", { name: /abrir siguiente/i }).getAttribute("href");
  expect(siguiente).toBe(primero);
});

test("ningún campo de la consola lleva un ejemplo que parezca el dato", async ({ page }) => {
  // El campo «la afectación, en una frase» salía con «sin agua en la parte alta
  // desde hace tres meses» dentro, sobre un aporte de canchas rotas en Tunja.
  // Un `placeholder` en una pantalla de revisión se lee como contenido: quien
  // revisa deprisa puede creer que eso dice el aporte.
  const marca = `ejemplo-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: las canchas están rotas`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 25_000 });

  await abrirAporte(page, marca);
  const conEjemplo = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLInputElement>("input")]
      .filter((i) => i.type !== "hidden" && i.placeholder)
      .map((i) => `${i.name}: ${i.placeholder}`));
  expect(conEjemplo, "un ejemplo dentro del campo se lee como el dato del aporte").toEqual([]);
});

test("la bandeja dice cuántos hay y cuántos muestra", async ({ page }) => {
  // Diez aportes recién registrados se volvieron invisibles: estaban en las
  // posiciones 97 a 106 de 106 y la pantalla cortaba en 50 **sin decir nada**.
  // Es el mismo defecto silencioso que dejó 122 municipios fuera del buscador:
  // no falla, no avisa, y el dato simplemente no está.
  await page.goto("/consola?ubicacion=todos");
  const cuantos = page.locator("[data-prueba='cuantos']");
  await expect(cuantos).toBeVisible({ timeout: 15_000 });
  await expect(cuantos).toContainText(/mostrando \d+ de \d+/i);
});

test("se puede ver lo último que llegó, sin perder el orden de trabajo", async ({ page }) => {
  // Son dos preguntas distintas: «qué atiendo ahora» —el que lleva más
  // esperando— y «qué acaba de entrar». La primera manda por defecto.
  const marca = `reciente-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: acaba de pasar esto`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 25_000 });

  // Por defecto, el orden de trabajo.
  await page.goto("/consola?ubicacion=todos");
  await expect(page.locator("[data-prueba='cuantos']")).toContainText(/llevan más esperando/i);

  // Y el recién llegado se encuentra sin buscarlo, en el otro orden.
  await page.goto("/consola?ubicacion=todos&orden=recientes");
  await expect(page.locator("[data-prueba='cuantos']")).toContainText(/últimos que llegaron/i);
  const primero = page.locator(".bo-record-link").filter({ visible: true }).first();
  await expect(primero).toContainText(marca, { timeout: 15_000 });
});

test("con la base en blanco, la bandeja lo dice sin mandar a revisar un filtro", async ({ page }) => {
  // «Ninguno coincide con lo que estás buscando» manda a alguien a revisar un
  // filtro cuando lo que pasa es que no ha llegado nada. Solo se ve probando en
  // blanco, y probar en blanco casi nunca se hace.
  //
  // Se comprueba sobre la búsqueda de algo que no existe, que es el mismo
  // camino: si hay aportes, el mensaje tiene que hablar de la búsqueda.
  await page.goto("/consola?ubicacion=todos&q=xxxxnoexistexxxx");
  const vacio = page.locator("[data-prueba='sin-resultados']");
  await expect(vacio).toBeVisible({ timeout: 15_000 });
  const texto = (await vacio.innerText()).toLowerCase();
  // O no ha llegado nada, o no coincide la búsqueda. Nunca las dos cosas ni
  // ninguna de las dos.
  expect(texto.includes("no ha llegado") !== texto.includes("coincide"),
    "el mensaje de vacío no distingue «no hay nada» de «no coincide»").toBe(true);
});

test("la ficha dice de qué, dónde y cuántos más, antes de leer el relato", async ({ page }) => {
  // `CLA-02`. Sin esto el revisor tenía que leerse cada aporte entero para
  // saber siquiera si hablaba de agua o de una vía, y no había con qué
  // clasificar ni priorizar nada.
  const marca = `cabecera-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: el agua llega turbia en la vereda`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 25_000 });

  await abrirAporte(page, marca);
  const cabecera = page.locator("[data-prueba='cabecera']");
  await expect(cabecera).toBeVisible({ timeout: 15_000 });
  await expect(cabecera).toContainText(/de qué/i);
  await expect(cabecera).toContainText(/dónde/i);
  await expect(cabecera).toContainText(/cuántos más como este/i);
  // Sin tema y sin municipio se dice que no se puede contar, en vez de un cero
  // que parecería «no hay ninguno más».
  await expect(cabecera).toContainText(/no se puede contar sin tema/i);
});

test("la gestión llega medio llena con lo que la persona confirmó", async ({ page }) => {
  // `CLA-04`. Rellenar no es decidir: el expediente se abre por un acto del
  // revisor, con su motivo, y lo propuesto se puede cambiar entero.
  const marca = `gestion-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: se cayó el puente de la vereda`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 25_000 });

  await abrirAporte(page, marca);
  // Llega con algo escrito, no en blanco.
  await expect(page.locator("#exp-descripcion")).not.toHaveValue("", { timeout: 15_000 });
  await expect(page.locator("#exp-descripcion")).toHaveValue(new RegExp(marca));
  // Y el motivo sigue siendo obligatorio: el acto es del revisor.
  await expect(page.locator("#exp-motivo")).toHaveAttribute("required", "");
});

test("escalar a una mesa: queda pendiente hasta que alguien confirme", async ({ page }) => {
  // Lo pidió el negocio con estas palabras: *«acá es como una gestión que
  // podría escalarla de una mejor forma a una mesa puntual o a un equipo que
  // pueda desagregarla un poco mejor»*. Faltaba entero: la ficha sabía abrir el
  // expediente y priorizarlo, pero no sacarlo de aquí.
  //
  // Y lo que se vigila es la mitad que se olvida: **remitir no es haber
  // atendido**. La especificación lo dice literal —*«remisión no aceptada sigue
  // pendiente»*, *«entidad sin responder no cierra por silencio»*— y una
  // pantalla que lo diera por resuelto convertiría el silencio en respuesta.
  const marca = `escalar-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: el agua, la vía y el puesto de salud, todo junto`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 20_000 });

  await abrirAporte(page, marca);

  const panel = page.locator(".bo-inspector");
  await panel.locator("input[name='descripcion']").fill("tres necesidades en un relato");
  await panel.locator("input[name='motivo']").fill("es el relato que las origina");
  await panel.getByRole("button", { name: /^abrir$/i }).click();

  const escalar = page.locator("[data-prueba='escalar']");
  await expect(escalar).toBeVisible({ timeout: 15_000 });
  // El formulario de remitir va plegado, como los demás.
  await escalar.locator("[data-prueba='remitir'] summary").click();
  await escalar.locator("#rem-destino").fill("mesa técnica de agua del Huila");
  await escalar.locator("#rem-motivo").fill("necesita desagregarse: son tres necesidades");
  await escalar.getByRole("button", { name: /^remitir$/i }).click();

  await expect(escalar).toContainText(/mesa técnica de agua del Huila/, { timeout: 15_000 });
  await expect(escalar).toContainText(/pendiente de aceptación/i);
  // Remitido no es respondido, y se ve en el estado derivado.
  await expect(escalar).toContainText(/estado de atención: remitido/i);

  // La bandeja lo dice sin abrir el aporte: si no, se remite dos veces.
  await page.goto(`/consola?ubicacion=todos&q=${encodeURIComponent(marca)}`);
  await expect(page.locator(".bo-record-card").first()).toContainText(/remitido · sin aceptar/i);

  // Aceptar es un acto aparte, de alguien.
  await abrirAporte(page, marca);
  // Acotado al formulario de aceptar: en esta sección hay dos campos `motivo`
  // —el de remitir y el de confirmar— y sin acotar el `fill` va al primero.
  await page.locator("[data-prueba='aceptar-remision'] input[name='motivo']")
    .fill("la secretaría lo radicó con el número 4471");
  await page.getByRole("button", { name: /confirmar recepción/i }).click();
  await expect(page.locator("[data-prueba='escalar']")).toContainText(/recibida/i, { timeout: 15_000 });
});

test("la ficha dice qué se puede corregir y qué no se toca", async ({ page }) => {
  // El techo de esta pantalla, dicho en la pantalla. Sin decirlo, «corregir» y
  // «reescribir» se parecen demasiado — y si la consola puede cambiar el
  // sentido de lo que alguien contó, lo que sube al sistema de planeación ya no
  // es lo que la gente dijo.
  const marca = `techo-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: el agua llega turbia desde hace meses`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 20_000 });

  await abrirAporte(page, marca);
  const techo = page.locator("[data-prueba='lo-que-no-se-toca']");
  await expect(techo).toContainText(/no se reescribe nada/i);
  await expect(techo).toContainText(/N03/);
  await expect(techo).toContainText(/V14/);

  // Y el relato sigue sin ser editable en ninguna parte.
  await expect(page.locator("textarea[name='relato'], textarea[name='relato_original']")).toHaveCount(0);
});

test("el departamento se ve y se puede filtrar por territorio", async ({ page }) => {
  // El dato estaba capturado y **no se veía en ninguna parte**: la ficha lo
  // traía de la base y no lo usaba; la bandeja ni lo cargaba. Para saber si un
  // aporte era de Antioquia había que saberse los municipios de memoria.
  //
  // Y peor: la bandeja arrancaba filtrada por «por aclarar», que esconde
  // exactamente los que ya tienen municipio.
  const marca = `territorio-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: el agua llega turbia`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 25_000 });
  await escogerMunicipio(page, "ANTIOQUIA", "RIONEGRO");
  // Se espera a la pantalla siguiente: confirmar el municipio escribe en el
  // servidor, y salir de la página antes deja la carrera abierta.
  await expect(page.locator("[data-prueba='vuelta-2']")).toBeVisible({ timeout: 15_000 });

  // Sin tocar ningún filtro: el que ya tiene municipio **se ve**.
  await page.goto(`/consola?q=${encodeURIComponent(marca)}`);
  const fila = page.locator(".bo-record-card, .bo-table-desktop tr")
    .filter({ hasText: marca }).filter({ visible: true }).first();
  await expect(fila).toBeVisible({ timeout: 15_000 });
  await expect(fila).toContainText(/RIONEGRO/);
  await expect(fila, "el departamento se captura y no se enseña").toContainText(/ANTIOQUIA/);

  // Y se puede filtrar por departamento, con lo que de verdad hay.
  const filtros = page.locator(".bo-filters");
  await expect(filtros.locator("#departamento")).toBeVisible();
  await filtros.locator("#departamento").selectOption({ label: "ANTIOQUIA" });
  await filtros.getByRole("button", { name: /filtrar/i }).click();
  await expect(page).toHaveURL(/departamento=05/);
  // Visible de verdad: cada fila se dibuja dos veces —tarjeta y tabla— y el
  // sistema de diseño enseña exactamente una según el ancho.
  await expect(page.locator(".bo-record-link", { hasText: marca })
    .filter({ visible: true })).toHaveCount(1, { timeout: 15_000 });

  // Un departamento sin aportes no está en la lista: el desplegable sale de lo
  // que hay, no del catálogo de 33.
  const opciones = await filtros.locator("#departamento option").allTextContents();
  expect(opciones.length, "el filtro trae departamentos donde no ha llegado nada")
    .toBeLessThan(10);
});

test("la tabla de expedientes no hereda los anchos de la de aportes", async ({ page }) => {
  // «El último cuadro está descuadrado»: la tabla de expedientes tiene tres
  // columnas y heredaba las reglas de una de cuatro —el `last-child` a 20 %—,
  // así que su tercera columna se quedaba con el ancho de una cuarta que no
  // existe. Se comprueba la causa, no el aspecto.
  await page.goto("/consola");
  const tablas = page.locator(".bo-table-desktop");
  const cuantas = await tablas.count();
  for (let i = 0; i < cuantas; i++) {
    const tabla = tablas.nth(i);
    const columnas = await tabla.locator("thead th").count();
    const declaradas = await tabla.getAttribute("data-columnas");
    if (columnas !== 4) {
      expect(declaradas, `una tabla de ${columnas} columnas sin declararlo hereda anchos ajenos`)
        .toBe(String(columnas));
    }
  }
});

test("se puede poner el tema desde la consola, y queda quién y por qué", async ({ page }) => {
  // `GES-02` la lista entre las correcciones permitidas y **no existía**: 114 de
  // 115 aportes estaban sin tema y no había forma de ponérselo. Sin tema no se
  // puede enrutar nada a una mesa, y el filtro por tema nacía vacío.
  const marca = `tema-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: el acueducto lleva semanas dañado`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await expect(page.locator("[data-prueba='codigo']")).toBeVisible({ timeout: 25_000 });

  await abrirAporte(page, marca);
  const bloque = page.locator("[data-prueba='corregir-tema']");
  await bloque.locator("summary").click();
  await bloque.locator("#tema-codigo").selectOption("agua");
  await bloque.locator("#tema-motivo").fill("habla del acueducto, no de la vía");
  await bloque.getByRole("button", { name: /guardar el tema/i }).click();

  // La cabecera lo dice, y la bandeja permite filtrar por él.
  await expect(page.locator("[data-prueba='cabecera']"))
    .toContainText(/Agua y saneamiento/i, { timeout: 15_000 });
  await page.goto(`/consola?tema=agua&q=${encodeURIComponent(marca)}`);
  await expect(page.locator(".bo-record-link", { hasText: marca }).filter({ visible: true }))
    .toHaveCount(1, { timeout: 15_000 });
});

test("ninguna pantalla mete bloques donde no caben", async ({ page }) => {
  // **El navegador ya lo estaba diciendo y nadie lo escuchaba.** Un `<div>`
  // dentro de un `<p>` —lo que hacía la celda «Dónde» en la lista de tarjetas—
  // es HTML inválido: React lo canta como error de hidratación y el navegador
  // cierra el párrafo por su cuenta, así que lo que se ve no es lo que se
  // escribió.
  //
  // Ninguna prueba lo atrapó porque ninguna miraba la consola del navegador.
  // Es el mismo fallo que el `<div>` dentro del `<dl>`, por otro camino, y ya
  // van dos: por eso se vigila la clase entera y no el caso.
  const quejas: string[] = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const texto = m.text();
    if (/cannot be a descendant|hydration|validateDOMNesting/i.test(texto)) quejas.push(texto);
  });

  // **Con municipio confirmado**, y esto no es un detalle del montaje: la
  // línea que llevaba el `<div>` es la del departamento, y sin municipio esa
  // rama no se dibuja. La primera versión de esta prueba pasaba con el fallo
  // puesto porque su aporte no tenía ubicación — un verde que no vigilaba nada.
  const marca = `anidado-${Date.now()}`;
  await page.goto("/participar");
  await page.fill("#relato", `${marca}: el agua llega turbia`);
  await page.getByRole("button", { name: /continuar/i }).click();
  await page.locator("[data-prueba='vuelta-1']")
    .getByRole("button", { name: /sí, es eso/i }).click({ timeout: 25_000 });
  await escogerMunicipio(page, "ANTIOQUIA", "RIONEGRO");
  await expect(page.locator("[data-prueba='vuelta-2']")).toBeVisible({ timeout: 15_000 });

  for (const ruta of ["/consola", `/consola?q=${encodeURIComponent(marca)}`]) {
    await page.goto(ruta);
    await expect(page.locator(".bo-main")).toBeVisible({ timeout: 15_000 });
  }
  await abrirAporte(page, marca);

  expect(quejas, `el navegador se queja del HTML:\n${quejas.join("\n")}`).toEqual([]);
});
