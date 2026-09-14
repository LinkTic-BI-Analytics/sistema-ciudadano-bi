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
import { leer } from "../src/captura/lectura.ts";

// Cada palabra de la lectura sale del relato. La comprobación es literal a
// propósito: es más fácil de leer que cualquier regla, y es la regla entera.
function todoSaleDelRelato(relato: string, problema: string) {
  const original = relato.toLowerCase();
  return problema
    .replace(/…$/, "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((palabra) => original.includes(palabra));
}

test("no agrega ni una palabra que la persona no haya dicho", () => {
  const casos = [
    "el agua llega turbia desde hace tres meses en la parte alta",
    "No hay agua. La bomba se dañó en enero y nadie ha venido.",
    "la ruta escolar no sube cuando llueve; los niños faltan dos días por semana",
  ];
  for (const relato of casos) {
    const { problema } = leer(relato);
    assert.ok(problema.length > 0, "una lectura vacía no se le muestra a nadie");
    assert.ok(todoSaleDelRelato(relato, problema), `inventó palabras en: ${problema}`);
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

test("el lugar se devuelve tal como lo dijo, o no se devuelve", () => {
  // `I2`: no se normaliza, no se le pone código, no se adivina. Que vuelva
  // `null` es una respuesta, y es la que impide inventar un municipio.
  assert.equal(leer("x", "  la vereda de arriba  ").lugar, "la vereda de arriba");
  assert.equal(leer("x", "").lugar, null);
  assert.equal(leer("x").lugar, null);
});
