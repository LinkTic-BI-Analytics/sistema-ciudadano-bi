// La paleta extendida, contra WCAG, en los dos modos.
//
// El generador del paquete de diseño valida 108 pares de contraste **sobre su
// JSON**, y falla si alguno baja del umbral. Lo que este proyecto agregó en
// `globals.css` —el lienzo casi negro, los estados con hue, los ocho sectores,
// la barra lateral, los bloques de la bandera— no está en ese JSON, así que
// esa compuerta no lo ve.
//
// Esta es la misma compuerta para lo nuestro: recalcula cada par desde los hex
// que resuelve `leer.ts` (que ahora superpone `globals.css` como el navegador)
// y falla bajo 4.5:1 en texto y 3:1 en bordes y rieles. La Resolución 1519 de
// 2020 obliga WCAG 2.1 AA a un sitio del Estado; no es una recomendación.
//
// Se vio fallar bajando `--pc-x-sidebar-suave` a `#6B7280` (3.81:1).

import { test } from "node:test";
import assert from "node:assert/strict";
import { token, type Modo } from "../src/producto/tokens/leer.ts";

function luminancia(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const f = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r!) + 0.7152 * f(g!) + 0.0722 * f(b!);
}

function razon(a: string, b: string): number {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro! + 0.05) / (oscuro! + 0.05);
}

const TEXTO = 4.5;
const BORDE = 3;
const S = "--pc-semantic-color-";

/** [qué, sobre qué, umbral]. Los nombres son los de las variables. */
const PARES: [string, string, number][] = [
  // El texto sobre cada superficie: es lo que más píxeles ocupa.
  ...["canvas", "page", "base", "subtle", "editorial", "floating"].map(
    (s): [string, string, number] => [`${S}text-default`, `${S}surface-${s}`, TEXTO]),
  ...["canvas", "page", "base", "subtle", "editorial"].map(
    (s): [string, string, number] => [`${S}text-secondary`, `${S}surface-${s}`, TEXTO]),
  [`${S}text-link`, `${S}surface-base`, TEXTO],
  [`${S}border-control`, `${S}surface-base`, BORDE],
  // Los estados: cada texto sobre su fondo tintado, y suelto sobre la tarjeta.
  ...["success", "warning", "error", "info", "neutral"].flatMap(
    (e): [string, string, number][] => [
      [`${S}feedback-${e}-foreground`, `${S}feedback-${e}-background`, TEXTO],
      [`${S}feedback-${e}-foreground`, `${S}surface-base`, TEXTO],
    ]),
  ["--pc-x-remitido-fg", "--pc-x-remitido-bg", TEXTO],
  ["--pc-x-remitido-fg", `${S}surface-base`, TEXTO],
  [`${S}brand-accentText`, `${S}brand-accentSurface`, TEXTO],
  // Los sectores: texto sobre su tinte y sobre la tarjeta; el riel como borde.
  ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap((n): [string, string, number][] => [
    [`--pc-sector-${n}-fg`, `--pc-sector-${n}-bg`, TEXTO],
    [`--pc-sector-${n}-fg`, `${S}surface-base`, TEXTO],
    [`--pc-sector-${n}-rail`, `${S}surface-base`, BORDE],
  ]),
  // La barra lateral, que es navy en los dos modos.
  ["--pc-x-sidebar-texto", "--pc-x-sidebar", TEXTO],
  ["--pc-x-sidebar-suave", "--pc-x-sidebar", TEXTO],
  ["--pc-x-nav-activo-fg", "--pc-x-nav-activo-bg", TEXTO],
  // Los bloques de la bandera del calendario, con el texto que llevan encima.
  ...[1, 2, 3].map((n): [string, string, number] =>
    [`--pc-x-bandera-${n}-texto`, `--pc-x-bandera-${n}`, TEXTO]),
];

for (const modo of ["oscuro", "claro"] as Modo[]) {
  test(`la paleta extendida pasa WCAG en modo ${modo}`, () => {
    const fallos: string[] = [];
    for (const [fg, bg, umbral] of PARES) {
      const r = razon(token(fg, modo), token(bg, modo));
      if (r < umbral) fallos.push(`${fg} sobre ${bg}: ${r.toFixed(2)} < ${umbral}`);
    }
    assert.deepEqual(fallos, [], `pares por debajo del umbral en ${modo}:\n${fallos.join("\n")}`);
  });
}

test("el lienzo oscuro ya no es navy, y sigue leyéndose", () => {
  // Es la decisión de la ronda 2: casi negro neutro, con el texto por encima
  // de 15:1. Si alguien vuelve a poner el navy del paquete, esto lo dice.
  const lienzo = token(`${S}surface-canvas`, "oscuro");
  assert.notEqual(lienzo.toUpperCase(), "#06142A", "el lienzo volvió al navy del paquete");
  assert.ok(razon(token(`${S}text-default`, "oscuro"), lienzo) > 15);
});

test("tres estados que eran el mismo color ya no lo son", () => {
  // received, referred y draft resolvían los tres a #10264F / #B5D4F4.
  for (const modo of ["oscuro", "claro"] as Modo[]) {
    const fondos = ["received", "referred", "draft"]
      .map((e) => token(`${S}internal-${e}Background`, modo).toUpperCase());
    assert.equal(new Set(fondos).size, 3, `en ${modo} dos estados comparten fondo: ${fondos.join(", ")}`);
  }
});
