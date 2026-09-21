// La puerta de la zona interna: el login con el token compartido.
//
// Estos recorridos arrancan **sin sesión**: los demás heredan la que deja
// `sesion.setup.ts`, y aquí lo que se prueba es justamente no tenerla.

import { test, expect } from "@playwright/test";
import { TOKEN_RECORRIDOS } from "./acceso-recorridos.ts";

test.use({ storageState: { cookies: [], origins: [] } });

test("sin sesión, la consola y la administración mandan al login", async ({ page }) => {
  for (const ruta of ["/consola", "/administracion?seccion=materiales", "/consola/cualquiera"]) {
    await page.goto(ruta);
    await expect(page).toHaveURL(/\/ingresar/);
    expect(new URL(page.url()).searchParams.get("siguiente")).toBe(ruta);
  }
  // Lo ciudadano no pide nada.
  await page.goto("/participar");
  await expect(page).toHaveURL(/\/participar$/);
});

test("un token equivocado no entra, y lo dice", async ({ page }) => {
  await page.goto("/ingresar?siguiente=%2Fconsola");
  await page.getByLabel(/token de acceso/i).fill("no-es-el-token");
  await page.getByRole("button", { name: /ingresar/i }).click();
  // Por su id y no por `role=alert`: Next mete su propio anunciador de rutas
  // con ese rol, y serían dos.
  await expect(page.locator("#token-error")).toContainText(/no es el token/i);
  await expect(page.getByLabel(/token de acceso/i)).toHaveAttribute("aria-invalid", "true");
  await expect(page).toHaveURL(/\/ingresar/);
  await page.goto("/consola");
  await expect(page).toHaveURL(/\/ingresar/);
});

test("el token correcto entra, vuelve a donde iba y «Salir» cierra la sesión", async ({ page }) => {
  await page.goto("/administracion?seccion=materiales");
  await page.getByLabel(/token de acceso/i).fill(TOKEN_RECORRIDOS);
  await page.getByRole("button", { name: /ingresar/i }).click();
  await expect(page).toHaveURL(/\/administracion\?seccion=materiales$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/encuentros y materiales/i);

  // Con sesión, el login no se vuelve a mostrar: sigue de largo.
  await page.goto("/ingresar?siguiente=%2Fconsola");
  await expect(page).toHaveURL(/\/consola$/);

  await page.getByRole("button", { name: /^salir$/i }).click();
  await expect(page).toHaveURL(/\/ingresar$/);
  await page.goto("/consola");
  await expect(page).toHaveURL(/\/ingresar/);
});

test("un «siguiente» hacia otro sitio vuelve a la consola", async ({ page }) => {
  await page.goto(`/ingresar?siguiente=${encodeURIComponent("//otro.sitio/consola")}`);
  await page.getByLabel(/token de acceso/i).fill(TOKEN_RECORRIDOS);
  await page.getByRole("button", { name: /ingresar/i }).click();
  await expect(page).toHaveURL(/127\.0\.0\.1:3101\/consola$/);
});

test("el nombre nuevo y el escudo están en la portada y en la puerta", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".pc-header")).toContainText("Sistema de Escucha y Planeación Nacional");
  await expect(page.locator(".pc-header").getByRole("img", { name: /escudo de colombia/i })).toBeVisible();
  await expect(page).toHaveTitle(/Sistema de Escucha y Planeación Nacional/);

  await page.goto("/ingresar");
  await expect(page.getByRole("main")).toContainText("Sistema de Escucha y Planeación Nacional");
  await expect(page.getByRole("img", { name: /escudo de colombia/i })).toBeVisible();
});
