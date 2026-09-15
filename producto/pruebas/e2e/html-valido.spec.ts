// El navegador ya se queja; hasta ahora nadie lo escuchaba.
//
// Un `<div>` dentro de un `<p>` es HTML inválido: React lo canta como error de
// hidratación y el navegador cierra el párrafo por su cuenta, así que **lo que
// se ve no es lo que se escribió**. Ya pasó dos veces —un `<div>` dentro de un
// `<dl>` que mató los márgenes, y la celda «Dónde» dentro de un `<p>`— y las
// dos veces lo encontró una persona mirando la pantalla.
//
// Ninguna prueba lo atrapaba porque ninguna miraba la consola del navegador.

import { test, expect, type Page } from "@playwright/test";

function escuchar(page: Page): string[] {
  const quejas: string[] = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const texto = m.text();
    if (/cannot be a descendant|hydration|validateDOMNesting/i.test(texto)) quejas.push(texto);
  });
  return quejas;
}

for (const ruta of ["/", "/participar", "/mis-aportes", "/administracion", "/consola"]) {
  test(`${ruta} no mete bloques donde no caben`, async ({ page }) => {
    const quejas = escuchar(page);
    await page.goto(ruta);
    await expect(page.locator("body")).toBeVisible();
    // Se espera a que React hidrate: las quejas salen al comparar el HTML del
    // servidor con lo que el cliente dibuja, no al cargar.
    await page.waitForLoadState("networkidle");
    expect(quejas, `el navegador se queja del HTML de ${ruta}:\n${quejas.join("\n")}`).toEqual([]);
  });
}
