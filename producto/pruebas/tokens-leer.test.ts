// Los tokens, resueltos para meterlos dentro de una pieza descargable.
//
// Se prueba porque la alternativa era copiar los colores a mano, y este
// proyecto ya cometió tres veces el error de la copia que se queda quieta
// mientras el sistema de diseño se mueve.

import { test } from "node:test";
import assert from "node:assert/strict";
import { token } from "../src/producto/tokens/leer.ts";

test("un alias se resuelve hasta el color literal", () => {
  // `brand-ink` → `blue-850` → un hexadecimal. Si devolviera el `var(...)`, el
  // SVG saldría sin color y nadie lo notaría hasta imprimirlo.
  const tinta = token("--pc-semantic-color-brand-ink");
  assert.match(tinta, /^#[0-9A-Fa-f]{6}$/, `devolvió «${tinta}»`);
});

test("los colores de la pieza salen del sistema de diseño, no de una copia", () => {
  for (const t of [
    "--pc-semantic-color-surface-base",
    "--pc-semantic-color-text-default",
    "--pc-semantic-color-text-secondary",
    "--pc-semantic-color-text-onNavy",
    "--pc-semantic-color-brand-accentText",
  ]) {
    assert.match(token(t), /^#[0-9A-Fa-f]{6}$/, `${t} no resuelve a un color`);
  }
});

test("el papel de una pieza impresa es claro, no el navy de la pantalla", () => {
  // **Es el defecto que trajo el modo oscuro y no habría fallado nada.** Un
  // afiche de carta son 816 × 1056 px: con el valor del modo oscuro sale la
  // hoja entera en navy, y el error se descubre en la impresora de la alcaldía.
  //
  // Se vio fallar poniendo `modo = "oscuro"` por defecto en `leer.ts`.
  assert.equal(token("--pc-semantic-color-surface-base"), "#FFFFFF",
               "el papel de la pieza dejó de ser blanco");
  assert.notEqual(token("--pc-semantic-color-surface-base", "oscuro"), "#FFFFFF",
                  "el modo oscuro está devolviendo los valores del claro: la superposición no se aplicó");
});

test("los dos modos resuelven, y no devuelven lo mismo", () => {
  const claro = token("--pc-semantic-color-text-default", "claro");
  const oscuro = token("--pc-semantic-color-text-default", "oscuro");
  assert.match(claro, /^#[0-9A-Fa-f]{6}$/);
  assert.match(oscuro, /^#[0-9A-Fa-f]{6}$/);
  assert.notEqual(claro, oscuro, "el texto se pinta igual en los dos modos");
});

test("un token que no existe falla en vez de salir sin color", () => {
  assert.throws(() => token("--pc-inventado"), /no existe o no resuelve/);
});
