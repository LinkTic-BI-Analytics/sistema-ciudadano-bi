// La lectura que se le devuelve a la persona para que la confirme.
//
// Lo único que promete es **no agregar nada**. No interpreta, no clasifica, no
// adivina el lugar: corta el relato en la frase que lo resume y lo enseña.
//
// Se prueba con esa exigencia porque es una costura: `IA-01` deja la IA como
// ampliación, y el día que haya proveedor esta función es lo único que cambia.
// Si hoy se permitiera inventar una palabra, mañana nadie notaría la diferencia
// entre lo que dijo la persona y lo que dijo el modelo.

import { test } from "node:test";
import assert from "node:assert/strict";
import { leer, anclado, loQueFalta, PREGUNTABLES } from "../src/captura/lectura.ts";

// La comprobación es la misma función que usa el producto en caliente para
// decidir si acepta lo que devolvió la IA (`anclado`). Probar con una copia
// parecida dejaría que las dos se separaran sin que nadie lo notara.

test("no agrega ni una palabra que la persona no haya dicho", () => {
  const casos = [
    "el agua llega turbia desde hace tres meses en la parte alta",
    "No hay agua. La bomba se dañó en enero y nadie ha venido.",
    "la ruta escolar no sube cuando llueve; los niños faltan dos días por semana",
  ];
  for (const relato of casos) {
    const { problema } = leer(relato);
    assert.ok(problema.length > 0, "una lectura vacía no se le muestra a nadie");
    assert.ok(anclado(relato, problema), `inventó palabras en: ${problema}`);
  }
});

test("una primera frase demasiado corta no se toma sola", () => {
  // «No hay agua.» es cierto y no dice nada. Devolver eso como *lo que
  // entendimos* le pide a la persona que confirme un resumen que perdió el caso.
  const relato = "No hay agua. La bomba se dañó en enero y nadie ha venido a repararla.";
  assert.ok(leer(relato).problema.includes("bomba"));
});

test("un relato largo se recorta, y se ve que está recortado", () => {
  const relato = `${"el problema del agua se repite cada invierno ".repeat(20)}.`;
  const { problema } = leer(relato);
  assert.ok(problema.length <= 180);
  // Sin la marca, la persona confirma una frase cortada creyéndola completa.
  assert.ok(problema.endsWith("…"), "un recorte sin marca se lee como el texto entero");
});

test("sin IA no se separa nada más, y por eso se pregunta por todo", () => {
  // Sacarlas con reglas de texto sería adivinar cuál frase era el deseo y cuál
  // la propuesta. Equivocarse ahí le pone a la persona una opinión en la boca,
  // y `null` dice la verdad: no lo sabemos. La consecuencia es que se le
  // pregunta por las cinco, que es peor experiencia y la misma captura.
  const l = leer("el agua llega turbia y deberían arreglar la bomba");
  assert.equal(l.fuente, "segmentacion");
  assert.deepEqual(loQueFalta(l), [...PREGUNTABLES]);
});

test("solo se pregunta por lo que la persona NO dijo", () => {
  // Es la mitad del valor de leer con IA. Preguntarle por lo que ya contó la
  // castiga por haberlo contado bien, y es exactamente lo que hace que alguien
  // abandone a mitad de camino.
  const completa = {
    problema: "el agua llega turbia", otrosProblemas: [], lugar: "la parte alta",
    afectados: "unas veinte familias", desdeCuando: "hace tres meses",
    resultadoEsperado: "que llegue limpia", solucionSugerida: null,
    fuente: "ia" as const,
  };
  assert.deepEqual(loQueFalta(completa), ["solucionSugerida"]);
  assert.deepEqual(loQueFalta({ ...completa, lugar: null }), ["lugar", "solucionSugerida"]);
});

test("el orden de las preguntas va de lo más útil a lo menos", () => {
  // Si la persona se cansa y se va a mitad, lo que quedó sin preguntar tiene
  // que ser lo que menos falta hace.
  assert.equal(PREGUNTABLES[0], "lugar");
  assert.equal(PREGUNTABLES[PREGUNTABLES.length - 1], "solucionSugerida");
});

test("el guardián rechaza una palabra que la persona no dijo", () => {
  const relato = "el agua llega turbia desde hace tres meses";
  assert.ok(anclado(relato, "agua turbia"), "reordenar y quitar conectores es recortar");
  assert.ok(anclado(relato, "el AGUA llega Turbia"), "las tildes y mayúsculas no cambian lo dicho");
  assert.ok(!anclado(relato, "el acueducto está contaminado"), "eso ya es un diagnóstico");
  assert.ok(!anclado(relato, "el agua llega turbia por la mina"), "una sola palabra basta");
  // Una parte vacía no es una infracción: es que la persona no lo dijo.
  assert.ok(anclado(relato, "agua", null, undefined));
});

test("el lugar se devuelve tal como lo dijo, o no se devuelve", () => {
  // `I2`: no se normaliza, no se le pone código, no se adivina. Que vuelva
  // `null` es una respuesta, y es la que impide inventar un municipio.
  assert.equal(leer("x", "  la vereda de arriba  ").lugar, "la vereda de arriba");
  assert.equal(leer("x", "").lugar, null);
  assert.equal(leer("x").lugar, null);
});
