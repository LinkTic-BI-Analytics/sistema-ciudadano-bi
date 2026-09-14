// Encontrar el municipio que la persona nombró, sin elegir por ella.
//
// Corre contra DIVIPOLA de verdad —1.122 municipios— porque lo que se prueba es
// justamente el roce con nombres reales: los que se repiten en varios
// departamentos, los de varias palabras y los que son también palabras comunes.

import { test } from "node:test";
import assert from "node:assert/strict";
import { buscarMunicipios } from "../src/territorio/emparejar.ts";

const nombres = (c: Awaited<ReturnType<typeof buscarMunicipios>>) =>
  c.map((x) => `${x.nombre} (${x.departamento})`);

test("encuentra el municipio aunque venga entre vereda y departamento", async () => {
  // El texto que escribió una persona de verdad probando la pantalla.
  const c = await buscarMunicipios("en la verede la martinita y rionegro antioquia");
  assert.ok(nombres(c)[0]?.startsWith("RIONEGRO"), `devolvió ${nombres(c).join(" · ")}`);
  assert.match(nombres(c)[0]!, /ANTIOQUIA/);
  // Y **solo** ese: nombró el departamento, así que ofrecerle el de Santander
  // es ruido, y el ruido en una lista de botones se toca por error.
  assert.equal(c.length, 1, `también ofreció ${nombres(c).slice(1).join(" · ")}`);
});

test("un nombre en dos departamentos devuelve los dos, no uno", async () => {
  // **Es la regla entera.** «Rionegro» existe en Antioquia y en Santander; si el
  // texto no distingue, elegir por la persona es la inferencia que `I2` prohíbe.
  const c = await buscarMunicipios("el problema es en rionegro");
  assert.ok(c.length >= 2, `solo devolvió ${nombres(c).join(" · ")}`);
  const deps = c.map((x) => x.departamento);
  assert.ok(deps.includes("ANTIOQUIA") && deps.includes("SANTANDER"));
});

test("el departamento desempata", async () => {
  const c = await buscarMunicipios("vivo en rionegro santander");
  assert.equal(c[0]?.departamento, "SANTANDER");
});

test("un nombre de varias palabras no coincide por azar", async () => {
  const c = await buscarMunicipios("subiendo por santa rosa de osos");
  assert.ok(nombres(c)[0]?.startsWith("SANTA ROSA DE OSOS"), nombres(c).join(" · "));
});

test("no inventa un municipio donde no hay ninguno", async () => {
  assert.deepEqual(await buscarMunicipios("en la vereda de arriba, subiendo por la escuela"), []);
  assert.deepEqual(await buscarMunicipios("no hay agua"), []);
});

test("un nombre que además es una frase común no coincide solo", async () => {
  // «La Paz» es municipio en Cesar y en Santander. En «queremos la paz» no está
  // nombrando ninguno, y proponérselo sería ruido que enseña a ignorar la
  // pregunta.
  assert.deepEqual(await buscarMunicipios("solo queremos la paz en el barrio"), []);
  // Pero con su departamento sí lo está nombrando.
  const c = await buscarMunicipios("en la paz cesar no hay agua");
  assert.equal(c[0]?.departamento, "CESAR");
});

test("las tildes no cambian el sitio", async () => {
  const conTilde = await buscarMunicipios("en medellin antioquia");
  assert.ok(conTilde.length > 0, "«medellin» sin tilde tiene que encontrar MEDELLÍN");
});
