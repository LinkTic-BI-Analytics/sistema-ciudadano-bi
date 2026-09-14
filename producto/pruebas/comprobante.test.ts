// Los siete casos de T026. **Escritos antes de `canjearComprobante`.**
//
// Lo que se prueba no es que el código funcione: es que **no cuente de más**.
// Un comprobante abre un aporte, no una bandeja (`N16`), y un código que no
// existe se responde igual que uno equivocado — si se distinguieran, se podría
// averiguar qué códigos existen probando.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { canjearComprobante } from "../src/comprobante/canjear.ts";
import { recibirAporte } from "../src/captura/recibir.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const sb = clienteServidor();
let procesoId = "";
let otroProcesoId = "";
const claves: string[] = [];
const procesos: string[] = [];

const clave = (n: string) => {
  const k = `t026-${n}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  claves.push(k);
  return k;
};

before(async () => {
  const p = sb.schema("participacion");
  const { data } = await p.from("proceso").select("id").limit(1).single();
  procesoId = data!.id;
  // Un segundo proceso, para comprobar que el código no lo cruza.
  const { data: otro } = await p.from("proceso")
    .insert({ nombre: "ESCENARIO DE PRUEBA — otro proceso", compromiso: "consulta" })
    .select("id").single();
  otroProcesoId = otro!.id;
  procesos.push(otroProcesoId);
});

after(async () => {
  const p = sb.schema("participacion");
  const { data } = await p.from("aporte").select("id").in("clave_envio", claves);
  const ids = (data ?? []).map((a) => a.id as string);
  if (ids.length) {
    await p.from("ubicacion").delete().in("aporte_id", ids);
    await p.from("auditoria").delete().in("entidad_id", ids);
    await p.rpc("borrar_comprobantes_de_prueba", { p_aportes: ids });
    await p.from("aporte").delete().in("id", ids);
  }
  if (procesos.length) {
    await p.from("proceso")
      .update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
      .in("id", procesos);
  }
});

test("con el código bueno devuelve ESE aporte", async () => {
  const r = await recibirAporte({
    procesoId, claveEnvio: clave("bueno"),
    relato: "el agua llega turbia desde hace tres meses", canal: "web",
    lugarDeclarado: "la vereda de arriba",
  });
  const c = await canjearComprobante(r.codigoComprobante, procesoId);
  assert.ok(c, "el código bueno tiene que abrir algo");
  assert.equal(c.aporteId, r.aporteId);
  assert.equal(c.relato, "el agua llega turbia desde hace tres meses");
  assert.equal(c.lugarDeclarado, "la vereda de arriba");
  assert.equal(c.estadoUbicacion, "por_aclarar");
});

test("un código inventado devuelve null, sin error", async () => {
  const c = await canjearComprobante("ZZZZZZZZZZZZ", procesoId);
  assert.equal(c, null, "no encontrar no es un error: es no encontrar");
});

test("el código de un aporte no abre el de otro", async () => {
  const a = await recibirAporte({ procesoId, claveEnvio: clave("ajeno-a"), relato: "lo mío", canal: "web" });
  const b = await recibirAporte({ procesoId, claveEnvio: clave("ajeno-b"), relato: "lo de otra persona", canal: "web" });
  const c = await canjearComprobante(a.codigoComprobante, procesoId);
  assert.equal(c?.aporteId, a.aporteId);
  assert.notEqual(c?.aporteId, b.aporteId);
  assert.equal(c?.relato, "lo mío");
});

test("escrito con espacios y en minúscula funciona igual", async () => {
  const r = await recibirAporte({ procesoId, claveEnvio: clave("formato"), relato: "agua", canal: "web" });
  const comoLoEscribe = r.codigoComprobante.toLowerCase().replace(/(.{4})/g, "$1 ").trim();
  const c = await canjearComprobante(comoLoEscribe, procesoId);
  assert.equal(c?.aporteId, r.aporteId, "la persona lo va a escribir como pueda");
});

test("un código bueno de otro proceso devuelve null", async () => {
  const r = await recibirAporte({ procesoId, claveEnvio: clave("cruzado"), relato: "agua", canal: "web" });
  const c = await canjearComprobante(r.codigoComprobante, otroProcesoId);
  assert.equal(c, null, "el código no cruza procesos");
});

test("la consulta queda en la auditoría, acierte o no", async () => {
  const r = await recibirAporte({ procesoId, claveEnvio: clave("auditada"), relato: "agua", canal: "web" });
  await canjearComprobante(r.codigoComprobante, procesoId);
  await canjearComprobante("YYYYYYYYYYYY", procesoId);
  const { data } = await sb.schema("participacion").from("auditoria")
    .select("accion").eq("accion", "consultar_comprobante");
  assert.ok((data?.length ?? 0) >= 2, "las dos consultas dejan rastro, la buena y la fallida");
});

test("el código en claro NO está en la base", async () => {
  const r = await recibirAporte({ procesoId, claveEnvio: clave("hash"), relato: "agua", canal: "web" });
  const { data } = await sb.schema("participacion")
    .rpc("buscar_texto_en_comprobantes_de_prueba", { p_texto: r.codigoComprobante });
  assert.equal(data, 0, "en la base solo puede estar el hash");
});
