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
    problema: "el agua llega turbia", otrosProblemas: [], tema: "Vivienda, Ciudad y Territorio" as const, lugar: "la parte alta",
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

import { QUE_CUBRE, TEMAS, comoSector, type Tema } from "../src/captura/lectura.ts";

test("cada tema dice qué cubre, y en palabras de la gente", () => {
  // `QUE_CUBRE` no es documentación: va dentro del prompt. Con veinticuatro
  // sectores, el nombre solo no alcanza para decidir dónde cae «me toca
  // caminar dos horas para cobrar el subsidio», y una lista sin fronteras deja
  // el aporte sin tema o lo manda a cualquier sector.
  for (const tema of TEMAS) {
    assert.ok(QUE_CUBRE[tema], `el tema ${tema} no dice qué cubre`);
    assert.ok(QUE_CUBRE[tema].length > 12, `lo que cubre ${tema} es demasiado corto para servir`);
    // Nada de nombres propios ni de encuadre político: son sectores, no
    // capítulos de un programa. Un PND lo escribe quien gane.
    assert.doesNotMatch(
      `${tema} ${QUE_CUBRE[tema]}`,
      /patria|milagro|petro|gobierno|traici|presidente/i,
      `el tema ${tema} lleva encuadre político en el nombre o en lo que cubre`,
    );
  }
});

test("son los veinticuatro sectores, escritos como los guarda la base", () => {
  // **Esta lista es literal a propósito.** El tema que se guarda es esta misma
  // cadena, con sus tildes y sus comas: una letra distinta aquí y la base
  // rechaza el `update` con `violates check constraint "tema_de_la_lista"`, que
  // es exactamente lo que pasó en producción.
  assert.deepEqual([...TEMAS], [
    "Salud y Protección Social",
    "Vivienda, Ciudad y Territorio",
    "Transporte",
    "Educación",
    "Ambiente y Desarrollo Sostenible",
    "Defensa",
    "Agricultura y Desarrollo Rural",
    "Comercio, Industria y Turismo",
    "Minas y Energía",
    "Inclusión Social y Reconciliación",
    "Presidencia de la República",
    "Tecnologías de la Información y la Comunicación",
    "Deporte y Recreación",
    "Justicia",
    "Culturas",
    "Interior",
    "Relaciones Exteriores",
    "Función Pública",
    "Hacienda",
    "Ciencia, Tecnología e Innovación",
    "Planeación",
    "Trabajo",
    "Estadística",
    "Inteligencia",
  ]);
  // Y no hay un veinticinco. Lo que no se sabe clasificar queda sin tema.
  assert.equal(TEMAS.length, 24);
});

test("un sector escrito sin tildes se reconoce; uno inventado no", () => {
  // El tema es una frase larga y llega escrito a mano desde dos sitios: la
  // respuesta del modelo y una dirección que alguien pegó. Un modelo que
  // contesta «Educacion» acertó el sector, y descartarlo por la tilde deja sin
  // tema un aporte bien clasificado.
  assert.equal(comoSector("Educacion"), "Educación");
  assert.equal(comoSector("  minas y energia  "), "Minas y Energía");
  assert.equal(comoSector("FUNCIÓN PÚBLICA"), "Función Pública");
  // Pero no se aproxima por parecido: eso enruta un aporte a quien no le toca.
  assert.equal(comoSector("Vivienda"), null);
  assert.equal(comoSector("acueducto veredal"), null);
  assert.equal(comoSector(null), null);
});

test("lo que la gente cuenta llega al sector que responde", () => {
  // El costo de nombrar por sector es que nadie habla así: quien cuenta dice
  // «no llega el agua», no «Vivienda, Ciudad y Territorio». `QUE_CUBRE` es lo
  // único que traduce una cosa en la otra —va dentro del prompt y sostiene la
  // pantalla—, así que las traducciones que menos se adivinan se comprueban.
  const traduce = (palabra: string, tema: Tema) =>
    assert.match(QUE_CUBRE[tema], new RegExp(palabra, "i"),
      `«${palabra}» no aparece en lo que cubre ${tema}, y nadie va a acertar solo con el nombre`);

  traduce("agua", "Vivienda, Ciudad y Territorio");   // no en Ambiente
  traduce("basuras", "Vivienda, Ciudad y Territorio");
  traduce("alumbrado", "Minas y Energía");
  traduce("subsidios", "Inclusión Social y Reconciliación");
  traduce("sisbén", "Planeación");
  traduce("trámites", "Función Pública");
  traduce("pensiones", "Salud y Protección Social");
});
