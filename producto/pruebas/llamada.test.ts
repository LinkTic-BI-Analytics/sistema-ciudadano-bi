// Los casos de T066 · «Te llamamos». **Escritos antes de `registrarLlamada`.**
//
// Lo que se prueba no es que guarde: es **dónde** se vuelve imposible lo que no
// puede pasar. `AGENTS.md` §8 — una regla baja hasta donde se hace imposible, no
// hasta donde se valida. Por eso casi todos los casos van contra Postgres y no
// contra la acción de servidor: un `if` en el servidor lo rompe un `curl`.
//
// Y dos que no son del guardado y pesan igual:
//
//   · el contacto **no es alcanzable por la API**, ni con la llave del servidor;
//   · el webhook caído **no puede tumbar** una petición ya guardada.

import { test, after } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { createClient } from "@supabase/supabase-js";
import { registrarLlamada, CODIGO_PAIS_POR_DEFECTO } from "../src/llamada/registrar.ts";
import { avisarLlamada } from "../src/llamada/aviso.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const sb = clienteServidor();
const p = sb.schema("participacion");
const llamadas: string[] = [];

/** Guarda y anota el id, para llevárselo al terminar. */
async function pedir(entrada: { nombre: string; telefono: string; codigoPais?: string }) {
  const r = await registrarLlamada(entrada);
  llamadas.push(r.llamadaId);
  return r;
}

async function leer(id: string) {
  const { data, error } = await p.rpc("leer_llamada_de_prueba", { p_id: id });
  assert.equal(error, null, `no se pudo leer la llamada: ${error?.message}`);
  return (data as Record<string, unknown>[])[0]!;
}

after(async () => {
  if (llamadas.length) {
    await p.rpc("borrar_llamadas_de_prueba", { p_ids: llamadas });
    await p.from("auditoria").delete().in("entidad_id", llamadas);
  }
});


test("guarda el nombre y el teléfono, y el indicativo es 57 sin pedirlo", async () => {
  const r = await pedir({ nombre: "Marleny Quintero", telefono: "3114567890" });
  const fila = await leer(r.llamadaId);
  assert.equal(fila.nombre, "Marleny Quintero");
  assert.equal(fila.telefono, "3114567890");
  assert.equal(fila.codigo_pais, CODIGO_PAIS_POR_DEFECTO);
});

test("el teléfono se guarda TAL COMO lo escribió, sin formatear", async () => {
  // `I2` en su versión de contacto: si guardamos solo nuestra versión, el día
  // que el número no sirva nadie puede saber si lo escribió mal ella o lo
  // arreglamos mal nosotros.
  const r = await pedir({ nombre: "Don Efraín", telefono: "311 456 7890" });
  const fila = await leer(r.llamadaId);
  assert.equal(fila.telefono, "311 456 7890", "no se normaliza: se conserva lo que tecleó");
});

test("los espacios de los extremos sí se quitan", async () => {
  const r = await pedir({ nombre: "  Rosa  ", telefono: "  6015551234  " });
  const fila = await leer(r.llamadaId);
  assert.equal(fila.nombre, "Rosa");
  assert.equal(fila.telefono, "6015551234");
});

test("un nombre en blanco lo rechaza LA BASE, no el servidor", async () => {
  await assert.rejects(
    () => pedir({ nombre: "   ", telefono: "3114567890" }),
    /no se pudo registrar la llamada/,
    "un `if` en el servidor lo rompe un curl; la restricción no",
  );
});

test("un teléfono sin dígitos suficientes lo rechaza LA BASE", async () => {
  await assert.rejects(
    () => pedir({ nombre: "Quien sea", telefono: "llámenme" }),
    /no se pudo registrar la llamada/,
    "esta tabla existe para poder llamar: sin dígitos no se puede",
  );
});

test("un indicativo que no son dígitos lo rechaza LA BASE", async () => {
  await assert.rejects(
    () => pedir({ nombre: "Quien sea", telefono: "3114567890", codigoPais: "+57" }),
    /no se pudo registrar la llamada/,
    "el indicativo son dígitos: el `+` lo pone quien marca",
  );
});

test("NO pertenece a ningún proceso: se guarda aunque no haya ninguno vigente", async () => {
  // Decisión del negocio del 2026-09-18, y es lo contrario de lo que pide
  // `AGENTS.md` §9 para las tablas de `participacion`. Aquí se prueba el efecto
  // que se buscaba: **guardar el número de alguien no depende de nada más**.
  const r = await pedir({ nombre: "Sin proceso", telefono: "3114567890" });
  const fila = await leer(r.llamadaId);
  assert.equal(fila.nombre, "Sin proceso");
  assert.equal(Object.hasOwn(fila, "proceso_id"), false,
    "la columna se quitó: de qué proceso vino queda en la auditoría, no aquí");
});

test("created_up y updated_up nacen iguales, y updated_up se mueve sola al actualizar", async () => {
  const r = await pedir({ nombre: "Aníbal", telefono: "3009998877" });
  const antes = await leer(r.llamadaId);
  assert.equal(antes.created_up, antes.updated_up, "recién nacida, las dos fechas son la misma");

  // Un `update` cualquiera. El disparador es de la base: nadie le pasa la fecha.
  const { error } = await p.rpc("renombrar_llamada_de_prueba", {
    p_id: r.llamadaId, p_nombre: "Aníbal Restrepo",
  });
  assert.equal(error, null, error?.message);

  const despues = await leer(r.llamadaId);
  assert.equal(despues.nombre, "Aníbal Restrepo");
  assert.notEqual(despues.updated_up, despues.created_up,
    "una columna que dice «actualizado» y no se actualiza es una mentira");
  assert.equal(despues.created_up, antes.created_up, "la fecha de nacimiento no se reescribe");
});

test("el contacto NO es alcanzable por la API, ni con la llave del servidor", async () => {
  // `SEG-01`: los permisos aplican también por URL directa. `identidad` no está
  // en `config.toml`, así que esta puerta tiene que estar cerrada.
  const servidor = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );
  const { error } = await servidor.schema("identidad").from("llamadas").select("*").limit(1);
  assert.ok(error !== null, "identidad no se expone: se escribe por función, no por REST");
});

test("la llave del navegador tampoco la lee", async () => {
  const navegador = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
  const { data, error } = await navegador.schema("identidad").from("llamadas").select("*").limit(1);
  assert.ok(error !== null || (data?.length ?? 0) === 0);
});


// ── El aviso (`INT-02`) ──────────────────────────────────────────────────────
//
// Contra un servidor local, nunca contra n8n: una prueba que sale a internet
// falla por la red de quien la corre y no por el código.

function servidorFalso(responder: (cuerpo: unknown) => { estado: number }): Promise<{
  servidor: Server; url: string; recibido: () => unknown;
}> {
  let recibido: unknown = null;
  const servidor = createServer((req, res) => {
    let cuerpo = "";
    req.on("data", (t) => { cuerpo += t; });
    req.on("end", () => {
      recibido = { metodo: req.method, tipo: req.headers["content-type"], json: JSON.parse(cuerpo || "null") };
      res.writeHead(responder(recibido).estado, { "Content-Type": "application/json" });
      res.end("{}");
    });
  });
  return new Promise((listo) => {
    servidor.listen(0, "127.0.0.1", () => {
      const puerto = (servidor.address() as { port: number }).port;
      listo({ servidor, url: `http://127.0.0.1:${puerto}/webhook/dnp`, recibido: () => recibido });
    });
  });
}

test("el aviso llega con lo mínimo para llamar, y con nada más", async () => {
  const f = await servidorFalso(() => ({ estado: 200 }));
  process.env.LLAMADA_WEBHOOK_URL = f.url;
  try {
    const ok = await avisarLlamada({
      llamadaId: "11111111-1111-1111-1111-111111111111",
      nombre: "Marleny Quintero", codigoPais: "57", telefono: "311 456 7890",
    });
    assert.equal(ok, true);
    const r = f.recibido() as { metodo: string; tipo: string; json: Record<string, unknown> };
    assert.equal(r.metodo, "POST");
    assert.match(r.tipo, /application\/json/);
    assert.equal(r.json.evento, "llamada.solicitada");
    assert.equal(r.json.nombre, "Marleny Quintero");
    assert.equal(r.json.codigo_pais, "57", "el indicativo va aparte");
    assert.equal(r.json.telefono, "311 456 7890", "va el original, para poder ver qué tecleó");
    // Decisión del negocio del 2026-09-18: el número armado para marcar **no
    // va**. Quien marca junta indicativo y teléfono, porque armarlo es una
    // interpretación y este lado no sabe cómo marca el proveedor de telefonía.
    assert.equal(r.json.telefono_e164, undefined,
      "el número para marcar lo arma el flujo, no nosotros");
    // `I6`: no se divulga lo que no hace falta divulgar.
    assert.equal(r.json.relato, undefined, "el flujo que llama no necesita saber qué contó nadie");
    assert.equal(r.json.codigo, undefined, "ni el comprobante de nadie");
    assert.equal(r.json.proceso_id, undefined,
      "salió del cuerpo el 2026-09-18: la llamada no pertenece a ningún proceso");
  } finally {
    delete process.env.LLAMADA_WEBHOOK_URL;
    f.servidor.close();
  }
});

test("el registro del servidor dice qué pasó, y NO lleva el teléfono completo", async () => {
  // Un registro de servidor es un sitio público: en Vercel lo lee cualquiera del
  // equipo y se queda guardado. Volcar ahí un teléfono es la misma fuga que la
  // partición de `identidad` existe para impedir (`SEG-01`, `I6`), solo que por
  // la puerta de atrás y sin que nada falle.
  const f = await servidorFalso(() => ({ estado: 200 }));
  process.env.LLAMADA_WEBHOOK_URL = f.url;

  const dicho: string[] = [];
  const info = console.info, error = console.error;
  console.info = (...a: unknown[]) => { dicho.push(a.join(" ")); };
  console.error = (...a: unknown[]) => { dicho.push(a.join(" ")); };
  try {
    await avisarLlamada({
      llamadaId: "44444444-4444-4444-4444-444444444444",
      nombre: "Marleny Quintero", codigoPais: "57", telefono: "311 456 7890",
    });
  } finally {
    console.info = info; console.error = error;
    delete process.env.LLAMADA_WEBHOOK_URL;
    f.servidor.close();
  }

  const todo = dicho.join("\n");
  assert.match(todo, /\[llamada\] → POST/, "tiene que decir que lo intentó");
  assert.match(todo, /\[llamada\] ← 200 en \d+ ms/, "y qué contestó, y en cuánto");
  assert.match(todo, /\+57\*+7890/, "el número va tapado: indicativo y los cuatro últimos");

  assert.doesNotMatch(todo, /3114567890/, "el número completo NUNCA entra al registro");
  assert.doesNotMatch(todo, /311 456 7890/, "ni con espacios");
  assert.doesNotMatch(todo, /Marleny/, "ni el nombre de nadie");
});

test("si el webhook contesta 500, el aviso devuelve false y NO lanza", async () => {
  const f = await servidorFalso(() => ({ estado: 500 }));
  process.env.LLAMADA_WEBHOOK_URL = f.url;
  try {
    const ok = await avisarLlamada({
      llamadaId: "22222222-2222-2222-2222-222222222222",
      nombre: "Quien sea", codigoPais: "57", telefono: "3114567890",
    });
    assert.equal(ok, false, "un webhook caído no puede convertirse en «no pudimos guardar»");
  } finally {
    delete process.env.LLAMADA_WEBHOOK_URL;
    f.servidor.close();
  }
});

test("si el webhook no existe, el aviso devuelve false y NO lanza", async () => {
  // Puerto cerrado: es el caso de la red caída, y es el que importa — la
  // petición ya está guardada y la persona ya vio «te llamamos en breve».
  process.env.LLAMADA_WEBHOOK_URL = "http://127.0.0.1:1/webhook/dnp";
  try {
    const ok = await avisarLlamada({
      llamadaId: "33333333-3333-3333-3333-333333333333",
      nombre: "Quien sea", codigoPais: "57", telefono: "3114567890",
    });
    assert.equal(ok, false);
  } finally {
    delete process.env.LLAMADA_WEBHOOK_URL;
  }
});
