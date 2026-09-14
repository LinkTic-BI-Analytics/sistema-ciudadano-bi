// T030 · los cinco eventos de gestión, separados.
//
// Lo que se prueba es que **no se colapsen**. Un expediente recibido y remitido
// pero sin responder es el estado en que va a estar casi todo, y con un campo
// `estado` no se puede decir.
//
// Y que el sistema **nunca diga «vencido»**: el plazo no existe (`Q20`), y el
// paquete es explícito — *«no inventar incumplimiento de plazo si no existe
// plazo definido»*.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { registrarActuacion, historiaDe, estadoDeAtencion } from "../src/gestion/actuacion.ts";
import { crearExpediente } from "../src/revision/expediente.ts";
import { recibirAporte } from "../src/captura/recibir.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const p = clienteServidor().schema("participacion");
let procesoId = "";
const procesos: string[] = [];
let n = 0;

before(async () => {
  const { data } = await p.from("proceso")
    .insert({ nombre: "ESCENARIO DE PRUEBA — gestión", compromiso: "consulta" })
    .select("id").single();
  procesoId = data!.id;
  procesos.push(procesoId);
});

after(async () => {
  // Se retira, no se borra: la auditoría lo sostiene y no se deja borrar (C1).
  await p.from("proceso")
    .update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
    .in("id", procesos);
});

async function nuevoExpediente(descripcion: string) {
  const a = await recibirAporte({
    procesoId, claveEnvio: `t030-${++n}-${Date.now()}`,
    relato: "el agua no llega", canal: "web",
  });
  return crearExpediente({ procesoId, descripcion, desdeAporte: a.aporteId,
                           autor: "revisora", motivo: "origen" });
}

test("un expediente sin actuaciones dice «sin respuesta registrada», nunca «vencido»", async () => {
  const e = await nuevoExpediente("sin actuaciones");
  const s = await estadoDeAtencion(e.expedienteId);
  assert.equal(s.estado, "sin_respuesta_registrada");
  assert.notEqual(s.estado, "vencido");
  assert.ok(typeof s.diasSinActuar === "number", "la antigüedad sí se muestra; el juicio no");
});

test("recibido y remitido pero no respondido: los tres hechos por separado", async () => {
  const e = await nuevoExpediente("tres hechos");
  await registrarActuacion({ expedienteId: e.expedienteId, tipo: "recepcion", autor: "responsable" });
  await registrarActuacion({ expedienteId: e.expedienteId, tipo: "remision", autor: "responsable",
                             destino: "la entidad competente", motivo: "es de su competencia" });
  const h = await historiaDe(e.expedienteId);
  assert.equal(h.length, 2);
  assert.deepEqual(h.map((a) => a.tipo), ["recepcion", "remision"]);
  const s = await estadoDeAtencion(e.expedienteId);
  assert.equal(s.estado, "remitido", "remitido NO es respondido");
});

test("una remisión sin aceptar sigue pendiente", async () => {
  const e = await nuevoExpediente("remisión pendiente");
  await registrarActuacion({ expedienteId: e.expedienteId, tipo: "remision", autor: "responsable",
                             destino: "otra entidad", motivo: "competencia" });
  const s = await estadoDeAtencion(e.expedienteId);
  assert.equal(s.remisionPendiente, true, "N13: una remisión no aceptada no aparece como resuelta");
});

test("aceptar la remisión es otra actuación, con su fecha", async () => {
  const e = await nuevoExpediente("remisión aceptada");
  const r = await registrarActuacion({ expedienteId: e.expedienteId, tipo: "remision",
    autor: "responsable", destino: "otra entidad", motivo: "competencia" });
  await p.from("actuacion").update({ aceptada_en: new Date().toISOString() }).eq("id", r.actuacionId);
  const s = await estadoDeAtencion(e.expedienteId);
  assert.equal(s.remisionPendiente, false);
});

test("un tipo que no sea uno de los cinco se rechaza", async () => {
  const e = await nuevoExpediente("tipo malo");
  await assert.rejects(() => registrarActuacion({
    expedienteId: e.expedienteId, tipo: "resuelto" as any, autor: "responsable" }));
});

test("la historia sale en orden y conserva quién y por qué", async () => {
  const e = await nuevoExpediente("historia");
  await registrarActuacion({ expedienteId: e.expedienteId, tipo: "recepcion", autor: "ana",
                             motivo: "llegó por la bandeja" });
  await registrarActuacion({ expedienteId: e.expedienteId, tipo: "respuesta", autor: "beto",
                             motivo: "se explicó qué se va a hacer" });
  const h = await historiaDe(e.expedienteId);
  assert.deepEqual(h.map((a) => a.autor), ["ana", "beto"]);
  assert.equal(h[1]!.motivo, "se explicó qué se va a hacer");
  assert.equal((await estadoDeAtencion(e.expedienteId)).estado, "respondido");
});

test("responder no dice que esté resuelto", async () => {
  // RES-01: «no confundir respuesta con resolución». El estado más avanzado que
  // este módulo conoce es «respondido», y no hay ninguno que diga «resuelto».
  const e = await nuevoExpediente("respuesta no es solución");
  await registrarActuacion({ expedienteId: e.expedienteId, tipo: "respuesta", autor: "responsable" });
  const s = await estadoDeAtencion(e.expedienteId);
  assert.equal(s.estado, "respondido");
  assert.notEqual(s.estado, "resuelto");
});
