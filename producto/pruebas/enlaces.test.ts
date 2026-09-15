// Enlaces, QR y contexto (`QR-01` … `QR-04`).
//
// El caso completo del requerimiento, montado tal cual: **alguien recibe
// reenviado el QR del evento A mientras está en el evento B, y cuenta un
// problema de una vereda del municipio C.**
//
// Tiene que quedar un solo aporte, con tres contextos distinguibles y **sin
// asistencia en ninguno de los dos eventos**. Es lo que separa conocer qué
// material circuló de inventar que alguien estuvo en un sitio.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import {
  crearEnlace, direccionDe, qrDe, resolverEnlace, utmsLimpias,
} from "../src/convocatoria/enlaces.ts";
import { recibirAporte } from "../src/captura/recibir.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const p = clienteServidor().schema("participacion");
let procesoId = "";
let eventoA = "";
let eventoB = "";
const aportes: string[] = [];

const enDias = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

before(async () => {
  const { data: proc } = await p.from("proceso")
    .insert({ nombre: "ESCENARIO DE PRUEBA — enlaces", compromiso: "consulta" })
    .select("id").single();
  procesoId = proc!.id;

  const { data: c } = await p.from("convocatoria").insert({
    proceso_id: procesoId, nombre: "c", proposito: "x", alcance: "y", efecto: "z",
    abre_en: enDias(-1), estado: "publicada", publicada_en: enDias(-1),
  }).select("id").single();

  const nuevos = await p.from("encuentro").insert([
    { proceso_id: procesoId, convocatoria_id: c!.id, titulo: "Encuentro de agua — Municipio A",
      modalidad: "presencial", lugar: "caseta de A", comienza_en: enDias(5) },
    { proceso_id: procesoId, convocatoria_id: c!.id, titulo: "Encuentro de vías — Municipio B",
      modalidad: "presencial", lugar: "colegio de B", comienza_en: enDias(6) },
  ]).select("id");
  eventoA = nuevos.data![0]!.id;
  eventoB = nuevos.data![1]!.id;
});

after(async () => {
  await p.from("aporte").update({ enlace_id: null }).in("id", aportes);
  await p.from("ubicacion").delete().in("aporte_id", aportes);
  await p.from("aporte").delete().in("id", aportes);
  await p.from("enlace").delete().eq("proceso_id", procesoId);
  await p.from("encuentro").delete().eq("proceso_id", procesoId);
  await p.from("convocatoria").delete().eq("proceso_id", procesoId);
  await p.from("proceso").update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
    .eq("id", procesoId);
});

test("dos encuentros distintos producen enlaces con eventos distintos", async () => {
  const a = await crearEnlace({ procesoId, encuentroId: eventoA, pieza: "afiche", creadoPor: "comunicaciones" });
  const b = await crearEnlace({ procesoId, encuentroId: eventoB, pieza: "afiche", creadoPor: "comunicaciones" });
  assert.notEqual(a.id, b.id);
  assert.notEqual(a.encuentroId, b.encuentroId);
  // `QR-01` prohíbe «un QR genérico nacional para todos los encuentros».
});

test("afiche y publicación del mismo encuentro son piezas, no eventos distintos", async () => {
  const afiche = await crearEnlace({ procesoId, encuentroId: eventoA, pieza: "afiche", creadoPor: "c" });
  const digital = await crearEnlace({
    procesoId, encuentroId: eventoA, pieza: "publicacion", creadoPor: "c",
    utm: { source: "whatsapp", medium: "mensajeria", campaign: "agua-2026" },
  });
  assert.notEqual(afiche.id, digital.id);
  assert.equal(afiche.encuentroId, digital.encuentroId, "no hace falta duplicar el evento");
  assert.equal(digital.utms.campaign, "agua-2026");
});

test("la dirección es corta y tecleable, y el QR se genera aquí", async () => {
  const e = await crearEnlace({ procesoId, encuentroId: eventoA, pieza: "afiche", creadoPor: "c" });
  const url = direccionDe(e.id, "https://participa.ejemplo");
  assert.match(url, /\/e\/[A-Z0-9]{6,12}$/);
  // Sin O, I ni L: va impreso y alguien lo va a teclear mirándolo de lejos.
  assert.ok(!/[OIL]/.test(e.id), `el identificador ${e.id} tiene letras que se confunden`);

  const svg = await qrDe(url);
  // `QR-01`: **no depender de un proveedor externo de QR**. Un afiche impreso
  // dura años y el proveedor puede no durar tanto.
  assert.match(svg, /^<\?xml|^<svg/);
});

test("un identificador que no existe NO se inventa", async () => {
  // `QR-04`: «ante ID inexistente se muestra selector/agenda sin inventar
  // evento ni asociación».
  assert.deepEqual(await resolverEnlace("NOEXISTE9"), { existe: false });
});

test("un enlace retirado se resuelve pero no sirve para entrar", async () => {
  // «Retirar un enlace impide usarlo como acceso activo, pero puede conservar
  // una explicación pública apropiada».
  const e = await crearEnlace({ procesoId, encuentroId: eventoA, pieza: "volante", creadoPor: "c" });
  await p.from("enlace").update({ estado: "retirado" }).eq("id", e.id);
  const r = await resolverEnlace(e.id);
  assert.equal(r.existe, true);
  assert.equal(r.existe && r.utilizable, false);
});

test("el caso completo: QR de A, evento confirmado B, problema en C", async () => {
  // Es el ejemplo del requerimiento, entero.
  const enlaceA = await crearEnlace({
    procesoId, encuentroId: eventoA, pieza: "publicacion", creadoPor: "c",
    utm: { source: "whatsapp", medium: "mensajeria" },
  });

  const r = await recibirAporte({
    procesoId, claveEnvio: `qr-${crypto.randomUUID()}`,
    relato: "el agua llega turbia en la vereda del municipio C", canal: "web",
    lugarDeclarado: "una vereda del municipio C",
  });
  aportes.push(r.aporteId);

  await p.from("aporte").update({
    enlace_id: enlaceA.id,
    evento_confirmado_id: eventoB,
    estado_contexto: "cambiado",
    utms_recibidas: { utm_source: "whatsapp" },
  }).eq("id", r.aporteId);

  const { data: a } = await p.from("aporte")
    .select("enlace_id, evento_confirmado_id, estado_contexto, lugar_declarado").eq("id", r.aporteId).single();

  // Los tres contextos, distintos y distinguibles.
  assert.equal(a!.enlace_id, enlaceA.id, "de dónde vino el enlace");
  assert.equal(a!.evento_confirmado_id, eventoB, "en qué evento dice participar");
  assert.match(a!.lugar_declarado, /municipio C/, "dónde ocurre el problema");
  assert.equal(a!.estado_contexto, "cambiado");

  // **Y ninguna asistencia.** «No se crea asistencia en A ni en B»: abrir un
  // enlace no es haber estado en ningún sitio, y un enlace reenviado tampoco.
  //
  // Se comprueba contra el esquema y no contra una fila: mientras no exista una
  // tabla de asistencia, no hay dónde inventarla. El día que exista —el módulo
  // de eventos la contempla— esta prueba falla y obliga a decidir qué la crea.
  const { data: hayAsistencia } = await clienteServidor()
    .schema("information_schema" as never)
    .from("tables" as never)
    .select("table_name")
    .eq("table_schema", "participacion").eq("table_name", "asistencia");
  assert.deepEqual(hayAsistencia ?? [], [],
    "apareció una tabla de asistencia: hay que decidir qué la crea, porque abrir un QR no");
});

test("abrir un enlace no confirma contexto", async () => {
  // Nace «sin resolver» y solo la persona lo mueve.
  const r = await recibirAporte({
    procesoId, claveEnvio: `qr2-${crypto.randomUUID()}`, relato: "algo", canal: "web",
  });
  aportes.push(r.aporteId);
  const { data: a } = await p.from("aporte").select("estado_contexto").eq("id", r.aporteId).single();
  assert.equal(a!.estado_contexto, "sin_resolver");
});

test("la base rechaza un contexto confirmado sin evento", async () => {
  const r = await recibirAporte({
    procesoId, claveEnvio: `qr3-${crypto.randomUUID()}`, relato: "algo", canal: "web",
  });
  aportes.push(r.aporteId);
  const { error } = await p.from("aporte")
    .update({ estado_contexto: "confirmado" }).eq("id", r.aporteId);
  assert.ok(error, "decir que confirmó un evento sin decir cuál no significa nada");
});

test("las UTMs se limpian: son texto de un desconocido", async () => {
  // `QR-03`: se validan, no se muestran como HTML y no sirven para redirigir.
  const sucias = new URLSearchParams(
    "utm_source=<script>alert(1)</script>&utm_medium=radio&otra=cosa&utm_campaign=" + "x".repeat(200));
  const limpias = utmsLimpias(sucias)!;
  assert.ok(!limpias.utm_source?.includes("<"), "una UTM acaba en una pantalla interna");
  assert.equal(limpias.utm_medium, "radio");
  assert.equal(limpias.otra, undefined, "solo se guardan las cuatro UTMs conocidas");
  assert.ok(limpias.utm_campaign!.length <= 80);
  assert.equal(utmsLimpias(new URLSearchParams("")), null);
});
