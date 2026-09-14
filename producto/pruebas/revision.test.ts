// T027 · aclarar la ubicación, con los cuatro estados separados.
//
// Todo aporte nace `por_aclarar` y sin código, porque `I2` prohíbe inferirla.
// Esto prueba que resolverla es **un acto con autor y motivo**, y que los cuatro
// estados de `CAL-01` se mueven por separado.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { porAclarar, resolverUbicacion, devolverAPorAclarar } from "../src/revision/ubicacion.ts";
import { recibirAporte } from "../src/captura/recibir.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const sb = clienteServidor();
const p = sb.schema("participacion");
let procesoId = "";
let mun: { codigo: string; version: string }[] = [];
const claves: string[] = [];
const procesos: string[] = [];

const clave = (n: string) => {
  const k = `t027-${n}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  claves.push(k);
  return k;
};

before(async () => {
  // Proceso propio: contar sobre datos compartidos hace que la prueba dependa
  // de lo que dejó la de al lado.
  const { data } = await p.from("proceso")
    .insert({ nombre: "ESCENARIO DE PRUEBA — revisión", compromiso: "consulta" })
    .select("id").single();
  procesoId = data!.id;
  procesos.push(procesoId);
  const { data: t } = await p.from("territorio")
    .select("codigo, version").eq("nivel", "municipio").order("codigo").limit(3);
  mun = t as typeof mun;
});

after(async () => {
  const { data } = await p.from("aporte").select("id").in("clave_envio", claves);
  const ids = (data ?? []).map((a) => a.id as string);
  if (ids.length) {
    await p.from("ubicacion").delete().in("aporte_id", ids);
    await p.from("auditoria").delete().in("entidad_id", ids);
    await p.rpc("borrar_comprobantes_de_prueba", { p_aportes: ids });
    await p.from("aporte").delete().in("id", ids);
  }
  if (procesos.length) await p.from("proceso").delete().in("id", procesos);
});

const nuevoAporte = (n: string) =>
  recibirAporte({ procesoId, claveEnvio: clave(n), relato: "el agua no llega", canal: "web",
                  lugarDeclarado: "cerca de San José" });

test("un aporte nuevo aparece en la bandeja por aclarar", async () => {
  const r = await nuevoAporte("bandeja");
  const pendientes = await porAclarar(procesoId);
  assert.ok(pendientes.some((x) => x.aporteId === r.aporteId));
  assert.equal(pendientes.find((x) => x.aporteId === r.aporteId)?.lugarDeclarado, "cerca de San José");
});

test("resolverlo lo saca de la bandeja y lo hace contar", async () => {
  const r = await nuevoAporte("resolver");
  await resolverUbicacion({
    aporteId: r.aporteId, codigo: mun[0]!.codigo, version: mun[0]!.version,
    autor: "revisora", motivo: "la persona confirmó el municipio por teléfono",
  });
  const pendientes = await porAclarar(procesoId);
  assert.ok(!pendientes.some((x) => x.aporteId === r.aporteId), "ya no está pendiente");
  const { data } = await p.rpc("indicadores", { p_proceso: procesoId });
  assert.equal(data?.[0]?.aportes_ubicados, 1);
});

test("resolver sin motivo se rechaza", async () => {
  const r = await nuevoAporte("sin-motivo");
  await assert.rejects(() => resolverUbicacion({
    aporteId: r.aporteId, codigo: mun[0]!.codigo, version: mun[0]!.version,
    autor: "revisora", motivo: "",
  }), /motivo/i);
});

test("un código que no existe en esa versión se rechaza", async () => {
  const r = await nuevoAporte("codigo-malo");
  await assert.rejects(() => resolverUbicacion({
    aporteId: r.aporteId, codigo: "99999", version: mun[0]!.version,
    autor: "revisora", motivo: "probando",
  }));
});

test("un aporte con DOS territorios confirmados sigue contando UNO", async () => {
  const r = await nuevoAporte("dos-territorios");
  await resolverUbicacion({ aporteId: r.aporteId, codigo: mun[1]!.codigo, version: mun[1]!.version,
                            autor: "revisora", motivo: "el problema cruza el límite" });
  await resolverUbicacion({ aporteId: r.aporteId, codigo: mun[2]!.codigo, version: mun[2]!.version,
                            autor: "revisora", motivo: "y también afecta al vecino" });
  const { data } = await p.rpc("indicadores", { p_proceso: procesoId });
  // El de la prueba anterior más este: dos aportes ubicados, no tres.
  assert.equal(data?.[0]?.aportes_ubicados, 2, "dos territorios no son dos aportes (R2)");
});

test("devolverlo a por aclarar deja el código en nulo", async () => {
  const r = await nuevoAporte("devolver");
  await resolverUbicacion({ aporteId: r.aporteId, codigo: mun[0]!.codigo, version: mun[0]!.version,
                            autor: "revisora", motivo: "aceptado" });
  await devolverAPorAclarar({ aporteId: r.aporteId, autor: "revisora", motivo: "era el domicilio, no el lugar del problema" });
  const { data } = await p.from("ubicacion").select("estado, territorio_codigo").eq("aporte_id", r.aporteId);
  assert.ok(data!.every((u) => u.estado === "por_aclarar"));
  assert.ok(data!.every((u) => u.territorio_codigo === null), "el código no queda huérfano");
});

test("los cuatro estados se mueven por separado", async () => {
  const r = await nuevoAporte("cuatro-estados");
  await resolverUbicacion({ aporteId: r.aporteId, codigo: mun[0]!.codigo, version: mun[0]!.version,
                            autor: "revisora", motivo: "aceptado" });
  const { data } = await p.from("aporte")
    .select("estado_clasificacion, estado_confirmacion, estado_revision").eq("id", r.aporteId).single();
  assert.equal(data?.estado_clasificacion, "por_clasificar", "resolver ubicación no clasifica");
  assert.equal(data?.estado_confirmacion, "sin_confirmar", "ni confirma el relato");
  assert.equal(data?.estado_revision, "sin_revisar", "ni da por revisado");
});
