// El municipio que confirma la propia persona.
//
// Lo que se vigila es el **motivo**, y no es burocracia: `I2` dice que resolver
// una ubicación es un acto de alguien, y `GEO-01` que una dirección residencial
// no es el lugar del problema sin confirmación. Las dos rutas —«lo dijo» y
// «vive ahí y confirmó»— tienen que quedar distinguibles, porque un revisor
// debería poder pesarlas distinto.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { recibirAporte } from "../src/captura/recibir.ts";
import { resolverUbicacion } from "../src/revision/ubicacion.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const p = clienteServidor().schema("participacion");
let procesoId = "";
const creados: string[] = [];

before(async () => {
  const { data } = await p.from("proceso")
    .insert({ nombre: "ESCENARIO DE PRUEBA — ubicación ciudadana", compromiso: "consulta" })
    .select("id").single();
  procesoId = data!.id;
});

after(async () => {
  // La auditoría es append-only por regla, así que el proceso se **retira**, no
  // se borra. Es `V11` aplicándose a sí misma.
  await p.from("ubicacion").delete().in("aporte_id", creados);
  await p.from("aporte").delete().in("id", creados);
  await p.from("proceso").update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
    .eq("id", procesoId);
});

async function unAporte(relato: string) {
  const r = await recibirAporte({
    procesoId, claveEnvio: `ubi-${crypto.randomUUID()}`, relato, canal: "web",
  });
  creados.push(r.aporteId);
  return r.aporteId;
}

async function unMunicipio() {
  const { data } = await p.from("territorio").select("codigo, version")
    .eq("nivel", "municipio").limit(1).single();
  return data!;
}

test("el motivo distingue «lo dijo» de «vive ahí»", async () => {
  const m = await unMunicipio();

  const a1 = await unAporte("el agua llega turbia");
  await resolverUbicacion({
    aporteId: a1, codigo: m.codigo, version: m.version, autor: "ciudadano",
    motivo: "la persona lo confirmó al contar su aporte",
  });

  const a2 = await unAporte("se cayó el puente");
  await resolverUbicacion({
    aporteId: a2, codigo: m.codigo, version: m.version, autor: "ciudadano",
    motivo: "la persona vive en ese municipio y confirmó que el problema ocurre ahí",
  });

  const { data } = await p.from("ubicacion").select("aporte_id, estado, autor, motivo")
    .in("aporte_id", [a1, a2]).eq("estado", "confirmada");

  const de = (id: string) => data!.find((u) => u.aporte_id === id)!;
  assert.equal(de(a1).autor, "ciudadano");
  assert.match(de(a1).motivo, /lo confirmó al contar/);
  assert.match(de(a2).motivo, /vive en ese municipio/);
  // Sin esta diferencia, un revisor no puede saber si el municipio salió del
  // problema o de dónde duerme quien lo contó.
  assert.notEqual(de(a1).motivo, de(a2).motivo);
});

test("resolver sin motivo no se puede, ni siendo la propia persona", async () => {
  const m = await unMunicipio();
  const a = await unAporte("hay basura acumulada");
  await assert.rejects(
    () => resolverUbicacion({ aporteId: a, codigo: m.codigo, version: m.version, autor: "ciudadano", motivo: "  " }),
    /motivo/,
    "un acto sin razón es indistinguible de una inferencia automática",
  );
});
