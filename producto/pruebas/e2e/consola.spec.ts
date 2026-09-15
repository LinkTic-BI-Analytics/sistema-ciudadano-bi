// La consola de revisión, en un navegador de verdad.
//
// Ejercita todo lo que estaba construido y no se podía ver: la bandeja de
// T027, el expediente de T028 y la prioridad de T035.

import { test, expect, type Page } from "@playwright/test";

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

  await panel.locator("input[name='motivo']").fill("afecta a menores y es una sola fuente");
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
  // Y quién lo tiene, que hoy no lo tiene nadie.
  await expect(fila).toContainText(/nadie/);
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
