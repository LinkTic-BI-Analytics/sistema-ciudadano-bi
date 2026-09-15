// Los tokens, resueltos para meterlos dentro de una pieza descargable.
//
// Se prueba porque la alternativa era copiar los colores a mano, y este
// proyecto ya cometió tres veces el error de la copia que se queda quieta
// mientras el sistema de diseño se mueve.

import { test } from "node:test";
import assert from "node:assert/strict";
import { token } from "../src/producto/tokens/leer.ts";

test("un alias se resuelve hasta el color literal", () => {
  // `brand-ink` → `blue-900` → un hexadecimal. Si devolviera el `var(...)`, el
  // SVG saldría sin color y nadie lo notaría hasta imprimirlo.
  const tinta = token("--pc-semantic-color-brand-ink");
  assert.match(tinta, /^#[0-9A-Fa-f]{6}$/, `devolvió «${tinta}»`);
});

test("los colores de la pieza salen del sistema de diseño, no de una copia", () => {
  for (const t of [
    "--pc-semantic-color-surface-base",
    "--pc-semantic-color-text-default",
    "--pc-semantic-color-text-secondary",
    "--pc-semantic-color-text-inverse",
    "--pc-semantic-color-action-primary-default",
  ]) {
    assert.match(token(t), /^#[0-9A-Fa-f]{6}$/, `${t} no resuelve a un color`);
  }
});

test("un token que no existe falla en vez de salir sin color", () => {
  assert.throws(() => token("--pc-inventado"), /no existe o no resuelve/);
});
