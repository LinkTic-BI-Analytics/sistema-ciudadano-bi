// Convocatorias y encuentros (`M06`, `RF10`).
//
// Lo que se vigila es lo que el módulo prohíbe, no lo que permite:
//
//   · **no prometer recepción en convocatoria cerrada** — es la frase literal
//     del requerimiento, y es la que más daño hace al romperse: alguien cuenta
//     su problema a un buzón que nadie va a abrir;
//   · **cancelar no borra** — «cancelación mantiene ficha informativa», porque
//     quitar el encuentro de la lista es cómo alguien acaba en la puerta;
//   · **reprogramar conserva la ficha y muestra el cambio**.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { convocatoriaVigente, proximosEncuentros } from "../src/convocatoria/agenda.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const p = clienteServidor().schema("participacion");
let procesoId = "";

const enDias = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

before(async () => {
  const { data } = await p.from("proceso")
    .insert({ nombre: "ESCENARIO DE PRUEBA — agenda", compromiso: "consulta" })
    .select("id").single();
  procesoId = data!.id;
});

after(async () => {
  await p.from("encuentro").delete().eq("proceso_id", procesoId);
  await p.from("convocatoria").delete().eq("proceso_id", procesoId);
  await p.from("proceso").update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
    .eq("id", procesoId);
});

async function unaConvocatoria(campos: Record<string, unknown>) {
  const { data, error } = await p.from("convocatoria").insert({
    proceso_id: procesoId, nombre: "Convocatoria de prueba",
    proposito: "escuchar", alcance: "el municipio", efecto: "alguien lo revisa",
    abre_en: enDias(-1), ...campos,
  }).select("id").single();
  if (error) throw new Error(error.message);
  return data!.id as string;
}

test("una convocatoria cerrada NO dice que recibe aportes", async () => {
  // La frase del requerimiento: «no promete recepción en convocatoria cerrada».
  await p.from("convocatoria").delete().eq("proceso_id", procesoId);
  await unaConvocatoria({ estado: "publicada", publicada_en: enDias(-1), cierra_en: enDias(-0.5) });
  const c = await convocatoriaVigente(procesoId);
  assert.equal(c?.recibeAportes, false, "la ventana ya cerró");
});

test("publicada y dentro de la ventana sí recibe", async () => {
  await p.from("convocatoria").delete().eq("proceso_id", procesoId);
  await unaConvocatoria({ estado: "publicada", publicada_en: enDias(-1), cierra_en: enDias(30) });
  assert.equal((await convocatoriaVigente(procesoId))?.recibeAportes, true);
});

test("un borrador no se ve desde afuera", async () => {
  // «Borrador no altera la versión pública»: lo que no está publicado no existe
  // para quien entra sin cuenta.
  await p.from("convocatoria").delete().eq("proceso_id", procesoId);
  await unaConvocatoria({ estado: "borrador" });
  assert.equal(await convocatoriaVigente(procesoId), null);
});

test("un encuentro cancelado SIGUE en la agenda", async () => {
  // «Cancelación mantiene ficha informativa y retira acceso a asistir».
  // Quitarlo de la lista es la forma más rápida de que alguien se presente en
  // la puerta de un salón cerrado.
  await p.from("convocatoria").delete().eq("proceso_id", procesoId);
  const c = await unaConvocatoria({ estado: "publicada", publicada_en: enDias(-1) });
  await p.from("encuentro").insert({
    proceso_id: procesoId, convocatoria_id: c, titulo: "Mesa sobre el agua",
    modalidad: "presencial", lugar: "la caseta comunal", comienza_en: enDias(3),
    estado: "cancelado", motivo_cambio: "no hubo quórum",
  });
  const lista = await proximosEncuentros(procesoId);
  assert.equal(lista.length, 1);
  assert.equal(lista[0]!.estado, "cancelado");
  assert.match(lista[0]!.motivoCambio!, /quórum/);
});

test("reprogramar conserva la ficha y deja ver la fecha anterior", async () => {
  await p.from("encuentro").delete().eq("proceso_id", procesoId);
  await p.from("convocatoria").delete().eq("proceso_id", procesoId);
  const c = await unaConvocatoria({ estado: "publicada", publicada_en: enDias(-1) });
  const { data: e } = await p.from("encuentro").insert({
    proceso_id: procesoId, convocatoria_id: c, titulo: "Mesa sobre la vía",
    modalidad: "virtual", sala: "https://sala.ejemplo", comienza_en: enDias(2),
  }).select("id").single();

  await p.from("encuentro").update({
    estado: "reprogramado", comenzaba_en: enDias(2), comienza_en: enDias(9),
    motivo_cambio: "se cruzaba con la jornada de vacunación",
  }).eq("id", e!.id);

  const lista = await proximosEncuentros(procesoId);
  // **El mismo identificador**: el requerimiento pide que reprogramar conserve
  // la URL, los aportes y la inscripción.
  assert.equal(lista[0]!.id, e!.id);
  assert.ok(lista[0]!.comenzabaEn, "sin la fecha anterior, el cambio es invisible");
});

test("la base rechaza un encuentro cambiado sin motivo, y uno presencial sin lugar", async () => {
  await p.from("convocatoria").delete().eq("proceso_id", procesoId);
  const c = await unaConvocatoria({ estado: "publicada", publicada_en: enDias(-1) });

  const sinMotivo = await p.from("encuentro").insert({
    proceso_id: procesoId, convocatoria_id: c, titulo: "x", modalidad: "virtual",
    sala: "https://sala.ejemplo", comienza_en: enDias(1), estado: "cancelado",
  });
  assert.ok(sinMotivo.error, "cancelar sin decir por qué deja a la gente sin saber");

  const sinLugar = await p.from("encuentro").insert({
    proceso_id: procesoId, convocatoria_id: c, titulo: "x", modalidad: "presencial",
    comienza_en: enDias(1),
  });
  assert.ok(sinLugar.error, "un encuentro presencial sin lugar no sirve para ir");
});
