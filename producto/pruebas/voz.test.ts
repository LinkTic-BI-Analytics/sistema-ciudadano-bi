// Aportes hablados (ADR 0013).
//
// La decisión que se prueba aquí es una sola: **el audio es el original**. De
// ella salen las tres reglas que se vigilan:
//
//   · un aporte por voz sin grabación no puede existir —sería un aporte cuyo
//     original se perdió—, y lo impide la base, no una convención;
//   · una transcripción es una versión firmada por quien la hizo, no un hecho;
//   · corregir no borra: la versión del modelo se queda diciendo lo que dijo.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { guardarGrabacion, corregirTranscripcion, transcripcionesDe } from "../src/captura/voz.ts";
import { recibirAporte } from "../src/captura/recibir.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const sb = clienteServidor();
const p = sb.schema("participacion");
let procesoId = "";
const creados: string[] = [];

// Un webm mínimo. No se transcribe —`SIN_IA` está puesto— y no hace falta: lo
// que se prueba es el modelo de datos, no el oído del proveedor.
const AUDIO = new Uint8Array([0x1a, 0x45, 0xdf, 0xa3, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x23]);

before(async () => {
  process.env.SIN_IA = "1";
  const { data } = await p.from("proceso")
    .insert({ nombre: "ESCENARIO DE PRUEBA — voz", compromiso: "consulta" })
    .select("id").single();
  procesoId = data!.id;
});

after(async () => {
  delete process.env.SIN_IA;
  const { data: gs } = await p.from("grabacion").select("id, ruta").eq("proceso_id", procesoId);
  await p.from("transcripcion").delete().eq("proceso_id", procesoId);
  await p.from("aporte").delete().in("id", creados);
  await p.from("grabacion").delete().eq("proceso_id", procesoId);
  if (gs?.length) await sb.storage.from("grabaciones").remove(gs.map((g) => g.ruta));
  await p.from("proceso").update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
    .eq("id", procesoId);
});

/** El recorrido completo: se graba, y después se crea el aporte con ella. */
async function hablar() {
  const g = await guardarGrabacion({
    procesoId, audio: AUDIO, tipoMime: "audio/webm;codecs=opus", segundos: 7,
  });
  const r = await recibirAporte({
    procesoId, claveEnvio: `voz-${crypto.randomUUID()}`,
    relato: g.transcripcion ?? "(no se entendió la grabación)",
    canal: "voz_transcrita", grabacionId: g.grabacionId,
  });
  creados.push(r.aporteId);
  return { ...r, ...g };
}

test("hablar deja el audio guardado, y el audio es el original", async () => {
  const r = await hablar();
  const { data: a } = await p.from("aporte").select("grabacion_id").eq("id", r.aporteId).single();
  const { data: g } = await p.from("grabacion")
    .select("ruta, tipo_mime, bytes, segundos").eq("id", a!.grabacion_id).single();
  assert.ok(g, "sin grabación, el original se perdió");
  assert.equal(g!.bytes, AUDIO.byteLength);
  assert.equal(Number(g!.segundos), 7);

  // Y el archivo está de verdad donde dice, no solo la fila.
  const { data: archivo } = await sb.storage.from("grabaciones").download(g!.ruta);
  assert.ok(archivo, "la fila apunta a un archivo que no existe");
  assert.equal((await archivo!.arrayBuffer()).byteLength, AUDIO.byteLength);
});

test("sin transcripción, el relato lo dice en vez de inventarse uno", async () => {
  // Un relato inventado a partir de ruido entra a la bandeja como si alguien lo
  // hubiera dicho. Es lo peor que puede pasar aquí.
  const r = await hablar();
  assert.equal(r.transcripcion, null);
  const { data: a } = await p.from("aporte").select("relato_original, canal").eq("id", r.aporteId).single();
  assert.equal(a!.canal, "voz_transcrita");
  assert.match(a!.relato_original, /no se entendió/);
});

test("la base rechaza un aporte por voz SIN grabación", async () => {
  // Es la regla entera del ADR 0013, y la impide la base con una restricción
  // diferida — no una convención en el código, que se olvida.
  const { error } = await p.from("aporte").insert({
    proceso_id: procesoId, clave_envio: `huerfano-${crypto.randomUUID()}`,
    relato_original: "algo que dije", canal: "voz_transcrita",
  });
  assert.ok(error, "un aporte por voz sin grabación pierde su original");
  assert.match(error!.message, /grabaci/i);
});

test("un aporte escrito no necesita grabación", async () => {
  const { data, error } = await p.from("aporte").insert({
    proceso_id: procesoId, clave_envio: `escrito-${crypto.randomUUID()}`,
    relato_original: "lo escribí yo", canal: "web",
  }).select("id").single();
  assert.equal(error, null);
  creados.push(data!.id);
});

test("corregir la transcripción NO borra la del modelo", async () => {
  const r = await hablar();
  // Se simula la versión 1 del modelo, con su nombre.
  const { data: a } = await p.from("aporte").select("grabacion_id").eq("id", r.aporteId).single();
  await p.from("transcripcion").insert({
    proceso_id: procesoId, grabacion_id: a!.grabacion_id, version: 1,
    texto: "el agua llega turbia en la vereda La Martinica",
    autor: "modelo:google/gemini-3.8-flash",
  });

  await corregirTranscripcion({
    aporteId: r.aporteId,
    texto: "el agua llega turbia en la vereda La Martinita",
    motivo: "se llama Martinita, no Martinica",
  });

  const versiones = await transcripcionesDe(r.aporteId);
  assert.equal(versiones.length, 2);
  // El día que alguien pregunte por qué el expediente decía Martinica, hay que
  // poder mostrar las dos.
  assert.match(versiones[0]!.texto, /Martinica/);
  assert.match(versiones[0]!.autor, /^modelo:/);
  assert.match(versiones[1]!.texto, /Martinita/);
  assert.equal(versiones[1]!.autor, "ciudadano");
});

test("una grabación vacía no es un aporte", async () => {
  await assert.rejects(
    () => guardarGrabacion({ procesoId, audio: new Uint8Array(), tipoMime: "audio/webm" }),
    /vacía/,
  );
});
