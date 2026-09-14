// T035 · prioridad de examen.
//
// **Lo que más se prueba aquí es lo que el módulo NO tiene.** `PRI-01`: *«los
// pesos o cuotas no acordados no se rellenan automáticamente»*, y `vacios.md`
// confirma que no existen. Una fórmula inventada decide a quién se atiende
// primero con una cuenta que nadie autorizó.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { registrarPrioridad, prioridadVigente, historiaDePrioridad } from "../src/priorizacion/prioridad.ts";
import { crearExpediente, desvincular } from "../src/revision/expediente.ts";
import { recibirAporte } from "../src/captura/recibir.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const p = clienteServidor().schema("participacion");
let procesoId = "";
const procesos: string[] = [];
let n = 0;

before(async () => {
  const { data } = await p.from("proceso")
    .insert({ nombre: "ESCENARIO DE PRUEBA — prioridad", compromiso: "consulta" })
    .select("id").single();
  procesoId = data!.id;
  procesos.push(procesoId);
});

after(async () => {
  await p.from("proceso")
    .update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
    .in("id", procesos);
});

async function expedienteCon(aportes: number, descripcion: string) {
  const primero = await recibirAporte({ procesoId, claveEnvio: `t035-${++n}-${Date.now()}`,
                                        relato: descripcion, canal: "web" });
  const e = await crearExpediente({ procesoId, descripcion, desdeAporte: primero.aporteId,
                                    autor: "revisora", motivo: "origen" });
  for (let i = 1; i < aportes; i++) {
    const a = await recibirAporte({ procesoId, claveEnvio: `t035-${++n}-${Date.now()}`,
                                    relato: descripcion, canal: "web" });
    await (await import("../src/revision/expediente.ts")).vincular({
      aporteId: a.aporteId, expedienteId: e.expedienteId, autor: "revisora", motivo: "lo mismo" });
  }
  return { ...e, primeroId: primero.aporteId };
}

test("priorizar exige motivo", async () => {
  const e = await expedienteCon(1, "agua");
  await assert.rejects(() => registrarPrioridad({ expedienteId: e.expedienteId,
    autor: "revisora", motivo: "" }), /motivo/i);
});

test("los cinco factores se guardan por separado, y ninguno es obligatorio", async () => {
  const e = await expedienteCon(1, "agua");
  await registrarPrioridad({ expedienteId: e.expedienteId, autor: "revisora",
    motivo: "afectación grave reportada", afectacion: "alta" });
  const v = await prioridadVigente(e.expedienteId);
  assert.equal(v?.afectacion, "alta");
  // Los otros cuatro en nulo: «no se estableció» es información, y ponerles un
  // valor por defecto sería inventarlo.
  assert.equal(v?.urgenciaReportada, null);
  assert.equal(v?.recurrencia, null);
  assert.equal(v?.competencia, null);
});

test("no existe ninguna función que produzca una puntuación", async () => {
  const modulo = await import("../src/priorizacion/prioridad.ts");
  const nombres = Object.keys(modulo).join(" ").toLowerCase();
  for (const prohibido of ["puntaje", "score", "peso", "ranking", "puntuacion", "calcular"]) {
    assert.ok(!nombres.includes(prohibido),
      `apareció «${prohibido}»: PRI-01 prohíbe rellenar con una fórmula lo que nadie acordó`);
  }
});

test("no hay ninguna columna de puntaje ni de selección presupuestal", async () => {
  const { data } = await p.rpc("columnas_de_prueba", { p_tabla: "prioridad_examen" });
  const cols = (data as string[]).join(" ").toLowerCase();
  for (const prohibido of ["puntaje", "score", "peso", "ranking", "presupuesto", "voto", "seleccion"]) {
    assert.ok(!cols.includes(prohibido), `la tabla tenía «${prohibido}»`);
  }
});

test("cambiar la prioridad conserva la anterior con su autor y razón", async () => {
  const e = await expedienteCon(1, "agua");
  await registrarPrioridad({ expedienteId: e.expedienteId, autor: "ana",
    motivo: "parecía menor", afectacion: "baja" });
  await registrarPrioridad({ expedienteId: e.expedienteId, autor: "beto",
    motivo: "llegó evidencia de que afecta a una escuela", afectacion: "alta" });
  const h = await historiaDePrioridad(e.expedienteId);
  assert.equal(h.length, 2, "la historia no se reescribe");
  assert.equal(h[0]!.autor, "ana");
  assert.match(h[0]!.motivo, /menor/);
  assert.ok(h[0]!.vigenteHasta, "la primera ya no está vigente");
  assert.equal(h[1]!.vigenteHasta, null);
});

test("la incertidumbre se registra como tal, distinta de una afectación baja", async () => {
  const e = await expedienteCon(1, "agua");
  await registrarPrioridad({ expedienteId: e.expedienteId, autor: "revisora",
    motivo: "hay que ir a mirar", afectacion: "sin_establecer",
    incertidumbre: "no sabemos cuántas familias dependen de esa toma" });
  const v = await prioridadVigente(e.expedienteId);
  assert.equal(v?.afectacion, "sin_establecer", "sin establecer NO es baja");
  assert.match(v!.incertidumbre!, /cuántas familias/);
});

test("N08 · un caso con UN aporte se prioriza igual que uno con muchos", async () => {
  const solo = await expedienteCon(1, "agua en la vereda dispersa");
  const muchos = await expedienteCon(5, "andenes rotos en la avenida");
  await registrarPrioridad({ expedienteId: solo.expedienteId, autor: "revisora",
    motivo: "afectación grave reportada, aunque sea un solo aporte", afectacion: "alta" });
  await registrarPrioridad({ expedienteId: muchos.expedienteId, autor: "revisora",
    motivo: "recurrente pero de baja afectación", afectacion: "baja", recurrencia: "alta" });
  // Nada en el sistema impide lo primero, y nada hace lo segundo más prioritario.
  assert.equal((await prioridadVigente(solo.expedienteId))?.afectacion, "alta");
  assert.equal((await prioridadVigente(muchos.expedienteId))?.recurrencia, "alta");
});

test("reabrir el expediente deja la prioridad NO vigente, sin borrarla", async () => {
  const e = await expedienteCon(1, "agua");
  await registrarPrioridad({ expedienteId: e.expedienteId, autor: "revisora",
    motivo: "examinar pronto", afectacion: "alta" });
  await desvincular({ aporteId: e.primeroId, expedienteId: e.expedienteId,
                      autor: "revisora", motivo: "era otra afectación" });
  assert.equal(await prioridadVigente(e.expedienteId), null,
    "NEC-01: reabre sin heredar aprobación");
  const h = await historiaDePrioridad(e.expedienteId);
  assert.equal(h.length, 1, "no se borró");
  assert.match(h[0]!.motivo, /examinar pronto/);
});

test("priorizar no cambia el estado de atención", async () => {
  const { estadoDeAtencion } = await import("../src/gestion/actuacion.ts");
  const e = await expedienteCon(1, "agua");
  await registrarPrioridad({ expedienteId: e.expedienteId, autor: "revisora", motivo: "pronto" });
  const s = await estadoDeAtencion(e.expedienteId);
  assert.equal(s.estado, "sin_respuesta_registrada",
    "N09: decidir qué examinar no equivale a haberlo atendido");
});
