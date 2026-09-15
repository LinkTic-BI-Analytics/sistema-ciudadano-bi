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
  const ninguno = m.getByRole("button", { name: /ninguno de estos/i });
  if (await ninguno.isVisible().catch(() => false)) await ninguno.click();
  await m.getByRole("button", { name: /no sé en qué municipio/i }).click();
  await m.getByRole("button", { name: /prefiero no decirlo/i }).click();
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
  await expect(m.locator("#municipio")).toBeVisible();
  await m.locator("#municipio").selectOption({ label: municipio });
}

/** Sale del paso de vocería sin declarar grupo. */
export async function hablarPorMi(page: Page) {
  const v = page.locator("[data-prueba='voceria']");
  await expect(v).toBeVisible({ timeout: 20_000 });
  await v.getByRole("button", { name: /hablo por mí/i }).click();
}
