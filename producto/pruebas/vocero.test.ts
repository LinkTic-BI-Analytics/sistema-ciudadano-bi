// Quién habla en un aporte.
//
// El requerimiento hablaba de voceros desde el principio y **el dato no se
// capturaba en ninguna parte**: `es_colectivo` existía en la tabla y nadie lo
// escribía ni lo leía.
//
// Lo que se prueba aquí es el límite, no la función: se guarda lo **declarado**,
// porque `Q23` sigue abierta —el colectivo no existe como entidad en ninguno de
// los 24 documentos— y la especificación exige que un vocero de verdad tenga
// *«representación verificada y destinatario autorizado»*. Nada de eso hay.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { recibirAporte } from "../src/captura/recibir.ts";
import { declararVoceria } from "../src/captura/vocero.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const p = clienteServidor().schema("participacion");
let procesoId = "";
const creados: string[] = [];

before(async () => {
  const { data } = await p.from("proceso")
    .insert({ nombre: "ESCENARIO DE PRUEBA — vocería", compromiso: "consulta" })
    .select("id").single();
  procesoId = data!.id;
});

after(async () => {
  await p.from("ubicacion").delete().in("aporte_id", creados);
  await p.from("aporte").delete().in("id", creados);
  await p.from("proceso").update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
    .eq("id", procesoId);
});

async function unAporte(relato: string) {
  const r = await recibirAporte({ procesoId, claveEnvio: `voz-${crypto.randomUUID()}`, relato, canal: "web" });
  creados.push(r.aporteId);
  return r.aporteId;
}

test("se guarda el nombre del grupo, no el de quien escribe", async () => {
  // `V19`: el aporte es del colectivo, no del vocero. Guardar a la persona
  // haría que al cambiar de vocero el aporte se moviera con ella.
  const a = await unAporte("la vía está intransitable");
  await declararVoceria({ aporteId: a, colectivo: "la junta de acción comunal de la vereda El Salado" });

  const { data } = await p.from("aporte").select("es_colectivo, colectivo_declarado").eq("id", a).single();
  assert.equal(data!.es_colectivo, true);
  assert.match(data!.colectivo_declarado, /junta de acción comunal/);
});

test("decir que se habla por un grupo exige decir cuál", async () => {
  const a = await unAporte("no hay alumbrado");
  await assert.rejects(() => declararVoceria({ aporteId: a, colectivo: "   " }), /cuál/);
});

test("la base rechaza un grupo sin marcar el aporte como colectivo", async () => {
  // Se ve fallar la restricción, no la función: un nombre de grupo en un aporte
  // que no es colectivo sería un dato que nadie sabe leer.
  const a = await unAporte("se cayó el puente");
  const { error } = await p.from("aporte")
    .update({ es_colectivo: false, colectivo_declarado: "la mesa de mujeres" }).eq("id", a);
  assert.ok(error, "la base tiene que rechazarlo");
  assert.match(error!.message, /colectivo_con_nombre/);
});
