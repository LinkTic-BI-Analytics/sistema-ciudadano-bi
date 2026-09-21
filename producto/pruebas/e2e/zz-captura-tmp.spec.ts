import { test, expect } from "@playwright/test";
test("captura del velo", async ({ page }) => {
  for (const modo of ["oscuro", "claro"]) {
    await page.goto("/consola");
    await page.evaluate((m) => { localStorage.setItem("pc-tema", m); document.documentElement.dataset.tema = m; }, modo);
    await page.route(/\/consola\?.*_rsc=/, async (r) => { await new Promise((l) => setTimeout(l, 4000)); await r.continue(); });
    const menu = page.getByRole("button", { name: /^menú$/i });
    if (await menu.isVisible()) await menu.click();
    await page.locator("#navegacion-interna").getByRole("link", { name: /falta el lugar/i }).click();
    await expect(page.locator(".bo-cargando")).toBeVisible();
    await page.waitForTimeout(400);
    await page.screenshot({ path: "/private/tmp/claude-503/-Users-johnhernandez-Documents-Linktic-Analitica-mvp-sistema-ciudadano-bi/61133d90-445f-4785-9da4-042b4c9949dc/scratchpad/velo-" + modo + "-" + test.info().project.name + ".png" });
    await page.unrouteAll({ behavior: "ignoreErrors" });
  }
});
