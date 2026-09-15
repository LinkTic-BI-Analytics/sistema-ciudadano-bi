// La síntesis se guarda como campos y se leía como prosa.
//
// «Problema: … / Lo que se espera: …» impreso con saltos de línea es lo que
// hacía que la ficha de la consola pareciera una transcripción y no una ficha
// de gestión. Aquí se prueba el corte, que es donde está toda la dificultad:
// una frase con dos puntos **no** es un campo.

import { test } from "node:test";
import assert from "node:assert/strict";
import { enPartes } from "../src/revision/sintesis-en-partes.ts";

test("parte la síntesis en sus campos", () => {
  const partes = enPartes("Problema: el agua llega turbia\nLo que se espera: que la limpien");
  assert.deepEqual(partes, [
    ["Problema", "el agua llega turbia"],
    ["Lo que se espera", "que la limpien"],
  ]);
});

test("una frase con dos puntos NO es un campo", () => {
  // Es el caso que rompe un corte ingenuo por «:». Quien escribe así no está
  // etiquetando nada, y partirlo le cambiaría el sentido a lo que dijo.
  const partes = enPartes("el problema es este: el agua llega turbia y nadie viene");
  assert.equal(partes.length, 1);
  assert.equal(partes[0]![0], "Lo que entendimos");
  assert.match(partes[0]![1], /el problema es este: el agua/);
});

test("un texto sin etiquetas sale entero, no vacío", () => {
  // 4 de las 235 síntesis de la base no traen la forma «Problema:». Devolver
  // una lista vacía las borraría de la pantalla.
  const partes = enPartes("no hay agua en la vereda");
  assert.deepEqual(partes, [["Lo que entendimos", "no hay agua en la vereda"]]);
});

test("una línea suelta continúa el campo de arriba", () => {
  const partes = enPartes("Problema: el agua llega turbia\ny además huele mal");
  assert.equal(partes.length, 1);
  assert.equal(partes[0]![1], "el agua llega turbia y además huele mal");
});

test("conserva el orden de los tres campos", () => {
  const partes = enPartes("Problema: a\nLo que se espera: b\nSolución sugerida: c");
  assert.deepEqual(partes.map(([k]) => k), ["Problema", "Lo que se espera", "Solución sugerida"]);
});

test("una etiqueta que no escribimos nosotros no parte nada", () => {
  // Si mañana alguien inventa «Urgencia: alta» dentro del texto, no se convierte
  // en un campo por su cuenta: los campos son los que compone `sintesis.ts`.
  const partes = enPartes("Problema: el agua llega turbia\nUrgencia: alta");
  assert.equal(partes.length, 1);
  assert.equal(partes[0]![1], "el agua llega turbia Urgencia: alta");
});
