import { expect, type Page } from "@playwright/test";

/**
 * Sale del paso del municipio sin dar ninguno.
 *
 * Existe para los recorridos que no van sobre la ubicación. **Que haga falta es
 * la señal de que el paso ya no se salta solo**: antes, escribir cualquier cosa
 * en «¿dónde ocurre?» —«en mi casa», «por allá»— se daba por contestado y el
 * aporte llegaba a la bandeja sin territorio al que sumarlo.
 */
export async function salirDelMunicipio(page: Page) {
  const m = page.locator("[data-prueba='municipio']");
  await expect(m).toBeVisible({ timeout: 20_000 });
  await m.getByRole("button", { name: /no sé en qué municipio/i }).click();
  await m.getByRole("button", { name: /prefiero no decirlo/i }).click();
}

/**
 * Dice dónde ocurre **con sus palabras**, en la misma pantalla del municipio.
 *
 * Se pregunta una sola vez: antes había una vuelta de texto libre y después el
 * selector, y para quien vive en una vereda dispersa esa era la misma pregunta
 * dos veces seguidas.
 */
export async function decirElLugar(page: Page, texto: string) {
  const m = page.locator("[data-prueba='municipio']");
  await expect(m).toBeVisible({ timeout: 20_000 });
  await m.locator("#con-sus-palabras").fill(texto);
}

/**
 * Escoge un municipio de lo macro a lo micro: departamento y luego municipio.
 *
 * Dentro de un departamento no hay dos con el mismo nombre, así que escoger es
 * escoger. Buscando por nombre sobre los 1.122, «RIO» devolvía ocho de ocho
 * departamentos distintos.
 */
export async function escogerMunicipio(page: Page, departamento: string, municipio: string) {
  const m = page.locator("[data-prueba='municipio']");
  await expect(m).toBeVisible({ timeout: 20_000 });
  await m.locator("#departamento").selectOption({ label: departamento });
  // 125 municipios en una lista no se recorren: se filtran.
  await m.locator("#filtro-municipio").fill(municipio);
  await m.getByRole("button", { name: new RegExp(`^${municipio}$`, "i") }).click();
  // **Escoger no confirma.** Hay que decir que sí.
  await confirmarMunicipio(page, municipio);
}

/** Confirma el municipio que la pantalla propone, o lo cambia. */
export async function confirmarMunicipio(page: Page, esperado?: string) {
  const c = page.locator("[data-prueba='confirmar-municipio']");
  await expect(c).toBeVisible({ timeout: 15_000 });
  if (esperado) await expect(c).toContainText(new RegExp(esperado, "i"));
  await c.getByRole("button", { name: /sí, es ahí/i }).click();
}

/**
 * Sale del paso de vocería sin declarar grupo, y del que viene detrás.
 *
 * **Pasa también por «desde dónde nos contactas»**, que es el último paso fijo
 * desde que existe. Las pruebas que solo querían llegar al comprobante no tienen
 * por qué enterarse de que en el medio hay una pregunta más: la que sí quiere
 * probar esa pregunta la contesta a mano.
 */
export async function hablarPorMi(page: Page) {
  const v = page.locator("[data-prueba='voceria']");
  await expect(v).toBeVisible({ timeout: 20_000 });
  await v.getByRole("button", { name: /hablo por mí/i }).click();
  await noDecirDesdeDonde(page);
}

/** Termina sin decir desde dónde escribe. `N02`: no contestar es una respuesta. */
export async function noDecirDesdeDonde(page: Page) {
  const c = page.locator("[data-prueba='contacto']");
  await expect(c).toBeVisible({ timeout: 20_000 });
  await c.locator("[data-prueba='contacto-no-decir']").click();
}
