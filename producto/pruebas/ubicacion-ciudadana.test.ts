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
import { resolverUbicacion, corregirUbicacionDelCiudadano } from "../src/revision/ubicacion.ts";
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

test("corregir el municipio REEMPLAZA: no deja dos territorios", async () => {
  // `GEO-01` permite que un aporte tenga varios territorios, y eso vale cuando
  // el problema cruza dos municipios. Volver atrás en la captura y escoger otro
  // no es eso: es que el primero estaba mal. Dejar los dos convertiría un error
  // de dedo en un dato, y el aporte se contaría en dos sitios.
  const { data: dos } = await p.from("territorio").select("codigo, version")
    .eq("nivel", "municipio").limit(2);
  const [uno, otro] = dos!;

  const a = await unAporte("las canchas están rotas");
  await resolverUbicacion({
    aporteId: a, codigo: uno!.codigo, version: uno!.version, autor: "ciudadano",
    motivo: "la persona lo confirmó al contar su aporte",
  });
  await corregirUbicacionDelCiudadano({
    aporteId: a, codigo: otro!.codigo, version: otro!.version,
    motivo: "la persona volvió atrás y corrigió el municipio durante la captura",
  });

  const { data: filas } = await p.from("ubicacion")
    .select("territorio_codigo, estado").eq("aporte_id", a);
  assert.equal(filas!.length, 1, "quedaron dos territorios: el equivocado también");
  assert.equal(filas![0]!.territorio_codigo, otro!.codigo);
});

test("corregir sin haber confirmado nunca es resolver, no duplicar", async () => {
  // Quien llega aquí sin una ubicación suya no está corrigiendo nada: es la
  // primera vez. Fallar ahí obligaría a quien llama a saber en qué estado está
  // el aporte, y ese es justo el conocimiento que se pierde entre pantallas.
  const m = await unMunicipio();
  const a = await unAporte("no hay alumbrado");
  await corregirUbicacionDelCiudadano({
    aporteId: a, codigo: m.codigo, version: m.version,
    motivo: "la persona volvió atrás y corrigió el municipio durante la captura",
  });
  const { data: filas } = await p.from("ubicacion").select("estado").eq("aporte_id", a);
  assert.equal(filas!.length, 1);
  assert.equal(filas![0]!.estado, "confirmada");
});

test("corregir NO pisa lo que resolvió un revisor", async () => {
  // Lo que decidió alguien en la bandeja tiene su propio autor y su propio
  // motivo. Esta función es la del ciudadano corrigiéndose a sí mismo durante
  // la captura, y pisar una decisión ajena con ella la borraría sin rastro.
  const { data: dos } = await p.from("territorio").select("codigo, version")
    .eq("nivel", "municipio").limit(2);
  const [uno, otro] = dos!;

  const a = await unAporte("el puente está agrietado");
  await resolverUbicacion({
    aporteId: a, codigo: uno!.codigo, version: uno!.version, autor: "una revisora",
    motivo: "la referencia solo existe en ese municipio",
  });
  await corregirUbicacionDelCiudadano({
    aporteId: a, codigo: otro!.codigo, version: otro!.version,
    motivo: "la persona volvió atrás y corrigió el municipio durante la captura",
  });

  const { data: filas } = await p.from("ubicacion")
    .select("territorio_codigo, autor").eq("aporte_id", a).order("creada_en");
  const dela = filas!.find((f) => f.autor === "una revisora");
  assert.equal(dela!.territorio_codigo, uno!.codigo, "se pisó lo que resolvió un revisor");
});
