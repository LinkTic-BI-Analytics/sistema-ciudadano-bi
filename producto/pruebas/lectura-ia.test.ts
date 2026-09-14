// La lectura apoyada por Mistral, probada por donde puede hacer daño.
//
// Lo que se vigila no es que la IA acierte: es que **su fallo no se note**.
// `IA-01` dice que la captura no depende de la IA, y eso solo es cierto si
// todos los caminos de error terminan en la segmentación sin lanzar.
//
// No se prueba contra la red. La llamada real se ejercita a mano cuando hay
// llave; lo que se fija aquí es el contrato alrededor de ella, que es lo que
// se puede romper sin darse cuenta al refactorizar.

import { test } from "node:test";
import assert from "node:assert/strict";
import { leerConIA } from "../src/captura/lectura-ia.ts";
import { leer } from "../src/captura/lectura.ts";

const RELATO = "el agua llega turbia desde hace tres meses en la parte alta";

const LLAVES = ["OPENROUTER_API_KEY", "MISTRAL_API_KEY"] as const;

async function conEntorno<T>(puestas: Record<string, string>, f: () => Promise<T>): Promise<T> {
  const antes = Object.fromEntries(LLAVES.map((k) => [k, process.env[k]]));
  for (const k of LLAVES) delete process.env[k];
  Object.assign(process.env, puestas);
  try { return await f(); } finally {
    for (const k of LLAVES) {
      if (antes[k] === undefined) delete process.env[k];
      else process.env[k] = antes[k]!;
    }
    for (const k of Object.keys(puestas)) if (!LLAVES.includes(k as never)) delete process.env[k];
  }
}

const sinLlave = <T,>(f: () => Promise<T>) => conEntorno({}, f);

test("sin llave, la captura funciona exactamente igual", async () => {
  const l = await sinLlave(() => leerConIA(RELATO, "la parte alta"));
  assert.equal(l.fuente, "segmentacion");
  assert.deepEqual(l, leer(RELATO, "la parte alta"));
});

test("con una llave que no sirve, tampoco se rompe", async () => {
  // El proveedor va a responder 401. Nada de eso puede llegar a la persona:
  // su aporte ya está guardado y lo único que cambia es el corte que ve.
  const l = await conEntorno({ OPENROUTER_API_KEY: "no-sirve-esta-llave" },
                             () => leerConIA(RELATO));
  assert.equal(l.fuente, "segmentacion", "un 401 tiene que caer en la segmentación");
  assert.ok(l.problema.includes("turbia"));
});

test("manda OpenRouter cuando están las dos llaves", async () => {
  // Es el proveedor que este proyecto ya usó para analizar sus documentos.
  let pedido = "";
  const fetchReal = globalThis.fetch;
  globalThis.fetch = (async (u: string | URL | Request) => {
    pedido = String(u);
    return new Response(JSON.stringify({ choices: [{ message: { content: "{}" } }] }), { status: 200 });
  }) as typeof fetch;
  try {
    await conEntorno({ OPENROUTER_API_KEY: "a", MISTRAL_API_KEY: "b" }, () => leerConIA(RELATO));
  } finally { globalThis.fetch = fetchReal; }
  assert.match(pedido, /openrouter\.ai/);
});

test("el lugar que escribió la persona manda sobre el que encuentre la IA", async () => {
  // Uno lo puso ella en su campo; el otro es una lectura nuestra. `I2` no
  // admite que una lectura nuestra desplace lo que la persona declaró.
  const l = await sinLlave(() => leerConIA(RELATO, "vereda El Salado"));
  assert.equal(l.lugar, "vereda El Salado");
});


/** Pone a Mistral a responder lo que le digamos, sin salir a la red. */
async function conRespuesta<T>(json: unknown, f: () => Promise<T>): Promise<T> {
  const fetchReal = globalThis.fetch;
  const llaveReal = process.env.OPENROUTER_API_KEY;
  process.env.OPENROUTER_API_KEY = "llave-de-prueba";
  globalThis.fetch = (async () =>
    new Response(
      JSON.stringify({ choices: [{ message: { content: JSON.stringify(json) } }] }),
      { status: 200, headers: { "content-type": "application/json" } },
    )) as typeof fetch;
  try { return await f(); } finally {
    globalThis.fetch = fetchReal;
    if (llaveReal === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = llaveReal;
  }
}

test("un corte fiel se usa, y se nota que vino de la IA", async () => {
  const l = await conRespuesta({
    problema: "el agua llega turbia",
    resultadoEsperado: null,
    solucionSugerida: null,
    lugar: "la parte alta",
  }, () => leerConIA(RELATO));
  assert.equal(l.fuente, "ia");
  assert.equal(l.problema, "el agua llega turbia");
  assert.equal(l.lugar, "la parte alta");
});

test("si el modelo INVENTA una palabra, se descarta la respuesta entera", async () => {
  // «contaminada» y «acueducto» no están en el relato. Suenan bien, suenan
  // técnicas, y son exactamente lo que no puede pasar: la persona las leería
  // como suyas y las confirmaría, y el expediente quedaría diciendo algo que
  // ella nunca dijo.
  const l = await conRespuesta({
    problema: "el agua del acueducto llega contaminada",
    resultadoEsperado: null,
    solucionSugerida: null,
    lugar: null,
  }, () => leerConIA(RELATO));
  assert.equal(l.fuente, "segmentacion");
  assert.ok(!l.problema.includes("acueducto"));
});

test("basta con que invente en UNA parte para descartar las cuatro", async () => {
  // Un modelo que inventó en un campo no da motivo para creerle los otros.
  const l = await conRespuesta({
    problema: "el agua llega turbia",
    resultadoEsperado: "que la alcaldía instale una planta de tratamiento",
    solucionSugerida: null,
    lugar: "la parte alta",
  }, () => leerConIA(RELATO));
  assert.equal(l.fuente, "segmentacion");
  assert.equal(l.resultadoEsperado, null);
});

test("«null» como texto no se convierte en la palabra null en pantalla", async () => {
  const l = await conRespuesta({
    problema: "el agua llega turbia",
    resultadoEsperado: "null",
    solucionSugerida: "",
    lugar: "la parte alta",
  }, () => leerConIA(RELATO));
  assert.equal(l.resultadoEsperado, null);
  assert.equal(l.solucionSugerida, null);
});

test("una respuesta que no es JSON no se le muestra a nadie", async () => {
  const fetchReal = globalThis.fetch;
  process.env.OPENROUTER_API_KEY = "llave-de-prueba";
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ choices: [{ message: { content: "lo siento, no puedo" } }] }),
                 { status: 200 })) as typeof fetch;
  try {
    const l = await leerConIA(RELATO);
    assert.equal(l.fuente, "segmentacion");
  } finally {
    globalThis.fetch = fetchReal;
    delete process.env.OPENROUTER_API_KEY;
  }
});
