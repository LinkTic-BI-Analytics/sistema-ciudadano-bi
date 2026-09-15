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

test("la caja de búsqueda completa lo que la persona teclea", async () => {
  const { buscarPorNombre } = await import("../src/territorio/emparejar.ts");
  // Quien teclea «rio» busca Rionegro, no Puerto Rico. Poner los que solo lo
  // contienen arriba obliga a leer una lista para encontrar lo obvio.
  const c = await buscarPorNombre("rione");
  assert.ok(c.every((x) => x.nombre.toUpperCase().startsWith("RIONE")), nombres(c).join(" · "));
  assert.ok(c.length >= 2, "Rionegro está en más de un departamento");

  // Como la gente lo dice y lo teclea: todo de corrido.
  const juntos = await buscarPorNombre("rionegro antioq");
  assert.equal(juntos[0]?.departamento, "ANTIOQUIA");

  // Menos de tres letras no busca: devolvería media Colombia.
  assert.deepEqual(await buscarPorNombre("ri"), []);
});

test("están TODOS los municipios, no los primeros mil", async () => {
  // PostgREST corta en 1.000 filas y responde `200` como si fueran todas. Hay
  // 1.122, así que faltaban 122 — y por el orden del código eran Amazonas,
  // Guainía, Vaupés, Vichada, Guaviare, Putumayo, Arauca, Casanare, San Andrés
  // y el Valle del Cauca entero. **La periferia.** Quien viviera ahí escribía
  // el nombre de su municipio y le decíamos que no existe.
  //
  // Nada fallaba: las otras pruebas usan Rionegro, Medellín y Soacha, que están
  // entre los primeros mil. Por eso esta cuenta contra la base.
  const { cuantosMunicipios } = await import("../src/territorio/emparejar.ts");
  const { clienteServidor } = await import("../src/datos/cliente.ts");
  const { count } = await clienteServidor().schema("participacion")
    .from("territorio").select("codigo", { count: "exact", head: true }).eq("nivel", "municipio");

  assert.equal(await cuantosMunicipios(), count,
    "el buscador tiene menos municipios que la base: alguien no aparece");
});

test("los municipios más lejanos también se encuentran", async () => {
  // Uno de cada departamento que se estaba perdiendo. Son los que menos otra
  // manera tienen de llegar a una mesa de planeación.
  for (const [texto, depto] of [
    ["vivo en leticia amazonas", "AMAZONAS"],
    ["en mitú vaupés", "VAUPÉS"],
    ["puerto carreño vichada", "VICHADA"],
    ["en inírida guainía", "GUAINÍA"],
    ["en buenaventura valle del cauca", "VALLE DEL CAUCA"],
  ] as const) {
    const c = await buscarMunicipios(texto);
    assert.equal(c[0]?.departamento, depto, `no encontró nada para «${texto}»`);
  }
});

test("de lo macro a lo micro: 33 departamentos y sus municipios", async () => {
  const { departamentos, municipiosDe } = await import("../src/territorio/emparejar.ts");
  const d = await departamentos();
  assert.equal(d.length, 33, "Colombia tiene 32 departamentos y Bogotá D.C.");

  const antioquia = d.find((x) => x.nombre === "ANTIOQUIA")!;
  const m = await municipiosDe(antioquia.codigo);
  assert.equal(m.length, 125, "Antioquia tiene 125 municipios");
  // **Dentro de un departamento no hay dos con el mismo nombre**, que es lo que
  // hace que escoger sea escoger y no adivinar.
  assert.equal(new Set(m.map((x) => x.nombre)).size, m.length);
  assert.ok(m.some((x) => x.nombre === "RIONEGRO"));

  // Y los lejanos también: son los que menos otra forma tienen de llegar.
  const amazonas = d.find((x) => x.nombre === "AMAZONAS")!;
  assert.ok((await municipiosDe(amazonas.codigo)).some((x) => x.nombre === "LETICIA"));
});
