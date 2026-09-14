// T031 · el corte exportable, reproducible por otro.
//
// **Esto es lo que recibe el Sistema Nacional de Planeación** (`V16`). El BI lo
// construye otro equipo (`V20`), así que lo nuestro no es el tablero: es el
// corte, y su credibilidad.
//
// `TRA-01` fija el criterio en una frase: *«otro analista reproduce el total a
// partir del mismo corte y regla»*. Lo que se prueba es eso, y que el corte no
// lleve lo que no debe.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { exportarCorte } from "../src/corte/exportar.ts";
import { resolverUbicacion } from "../src/revision/ubicacion.ts";
import { recibirAporte } from "../src/captura/recibir.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const p = clienteServidor().schema("participacion");
let procesoId = "";
let otroId = "";
let mun: { codigo: string; version: string }[] = [];
const procesos: string[] = [];
let n = 0;

before(async () => {
  for (const nombre of ["ESCENARIO DE PRUEBA — corte", "ESCENARIO DE PRUEBA — corte otro"]) {
    const { data } = await p.from("proceso")
      .insert({ nombre, compromiso: "consulta" }).select("id").single();
    procesos.push(data!.id);
  }
  [procesoId, otroId] = procesos as [string, string];
  const { data: t } = await p.from("territorio")
    .select("codigo, version").eq("nivel", "municipio").order("codigo").limit(2);
  mun = t as typeof mun;
});

after(async () => {
  await p.from("proceso")
    .update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
    .in("id", procesos);
});

async function aporteUbicado(proceso = procesoId) {
  const a = await recibirAporte({
    procesoId: proceso, claveEnvio: `t031-${++n}-${Date.now()}`,
    relato: "el agua no llega", canal: "web", lugarDeclarado: "la parte alta",
  });
  await resolverUbicacion({ aporteId: a.aporteId, codigo: mun[0]!.codigo, version: mun[0]!.version,
                            autor: "revisora", motivo: "confirmado" });
  return a;
}

async function tomarCorte(proceso = procesoId) {
  const { data, error } = await p.rpc("tomar_corte", { p_proceso: proceso });
  if (error) throw new Error(error.message);
  return data as string;
}

test("exportar dos veces el mismo corte devuelve lo mismo", async () => {
  await aporteUbicado();
  const id = await tomarCorte();
  const a = await exportarCorte(id);
  const b = await exportarCorte(id);
  assert.equal(JSON.stringify(a), JSON.stringify(b), "un corte es una foto, no una consulta");
});

test("lleva versión de catálogo, zona horaria, filtros y fecha", async () => {
  await aporteUbicado();
  const e = await exportarCorte(await tomarCorte());
  assert.equal(e.procedencia.catalogoVersion, "junio 2026");
  assert.equal(e.procedencia.zonaHoraria, "America/Bogota");
  assert.ok(e.procedencia.tomadoEn, "sin fecha no es reproducible");
  assert.ok("filtroDesde" in e.procedencia, "los filtros viajan aunque estén vacíos");
});

test("cada indicador trae su advertencia obligatoria", async () => {
  await aporteUbicado();
  const e = await exportarCorte(await tomarCorte());
  for (const [clave, d] of Object.entries(e.diccionario)) {
    assert.ok(d.definicion?.length > 10, `${clave} sin definición`);
    assert.ok(d.advertencia?.length > 10, `${clave} sin advertencia`);
  }
  // La del paquete, textual: «no son personas ni votos».
  assert.match(e.diccionario.aportes_recibidos!.advertencia, /no son personas ni votos/i);
});

test("NO lleva relatos, ni contactos, ni códigos de comprobante", async () => {
  await aporteUbicado();
  const e = await exportarCorte(await tomarCorte());
  const texto = JSON.stringify(e).toLowerCase();
  for (const prohibido of ["el agua no llega", "relato", "contacto", "comprobante", "codigo_hash"]) {
    assert.ok(!texto.includes(prohibido), `el corte llevaba «${prohibido}»: SEG-01 lo prohíbe`);
  }
});

test("los indicadores coinciden con los del corte congelado", async () => {
  await aporteUbicado();
  const id = await tomarCorte();
  const { data } = await p.from("corte").select("indicadores").eq("id", id).single();
  const e = await exportarCorte(id);
  assert.deepEqual(e.indicadores, data!.indicadores);
});

test("un aporte aclarado DESPUÉS del corte no cambia lo exportado", async () => {
  await aporteUbicado();
  const a = await recibirAporte({ procesoId, claveEnvio: `t031-post-${Date.now()}`,
                                  relato: "otro", canal: "web" });
  const id = await tomarCorte();
  const antes = await exportarCorte(id);

  await resolverUbicacion({ aporteId: a.aporteId, codigo: mun[1]!.codigo, version: mun[1]!.version,
                            autor: "revisora", motivo: "aclarado después" });

  const despues = await exportarCorte(id);
  assert.deepEqual(despues.indicadores, antes.indicadores,
    "R2: un corte nuevo no reescribe el anterior");
});

test("un corte de un proceso no incluye aportes de otro", async () => {
  await aporteUbicado(procesoId);
  await aporteUbicado(otroId);
  const mio = await exportarCorte(await tomarCorte(procesoId));
  const ajeno = await exportarCorte(await tomarCorte(otroId));
  const cruce = mio.universo.filter((x) => ajeno.universo.includes(x));
  assert.equal(cruce.length, 0, "los universos no se tocan");
});
