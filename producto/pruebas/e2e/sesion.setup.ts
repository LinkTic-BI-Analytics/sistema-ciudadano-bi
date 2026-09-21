// Entra una vez con el token y guarda la sesión para el resto de la suite.
//
// Sin esto, cada recorrido que abre `/consola` o `/administracion` caería en
// el login. Pasa por el formulario de verdad y no fabrica las cookies: si la
// puerta se rompe, se rompe aquí primero y con un mensaje que dice por qué.

import { test as setup, expect } from "@playwright/test";
import { SESION, TOKEN_RECORRIDOS } from "./acceso-recorridos.ts";

setup("entrar con el token del equipo", async ({ page }) => {
  await page.goto("/consola");
  await expect(page).toHaveURL(/\/ingresar\?siguiente=%2Fconsola$/, { timeout: 60_000 });
  await page.getByLabel(/token de acceso/i).fill(TOKEN_RECORRIDOS);
  await page.getByRole("button", { name: /ingresar/i }).click();
  await expect(page).toHaveURL(/\/consola$/, { timeout: 60_000 });
  await page.context().storageState({ path: SESION });
});
