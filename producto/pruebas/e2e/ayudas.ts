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
