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
  // Los expedientes también. La primera vez que faltó esto, la prueba de conteo
  // de al lado empezó a fallar por una clave duplicada: los expedientes de aquí
  // coincidían con su `like`. Una prueba que deja rastro rompe a la siguiente.
  const { data: exps } = await p.from("expediente").select("id").in("proceso_id", procesos);
  const expIds = (exps ?? []).map((e) => e.id as string);
  if (expIds.length) {
    await p.from("expediente_territorio").delete().in("expediente_id", expIds);
    await p.from("vinculo_aporte_expediente").delete().in("expediente_id", expIds);
    await p.from("expediente").delete().in("id", expIds);
  }
  // La auditoría NO se borra: la regla de Postgres lo impide y eso es la
  // invariante, no un estorbo. Y como sus asientos sostienen el proceso por
  // clave foránea, el proceso se **retira** en vez de borrarse — que es el
  // borrado lógico que `V11` fijó para todo.
  if (procesos.length) {
    await p.from("proceso")
      .update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
      .in("id", procesos);
  }
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

// ── T028 · crear expediente y vincular con motivo ───────────────────────────
//
// La separación es el estado por defecto (`V12`). Compartir tema, municipio o
// palabras parecidas **no basta**, y la prueba para decidir es una sola:
//
//   ¿podríamos dar por atendida una mientras la otra sigue pendiente?
//
// Si la respuesta es sí, son dos expedientes. Los tres casos de la tabla de `V12`
// están aquí tal como se escribieron.

import { crearExpediente, vincular, aportesDe, expedientesDe } from "../src/revision/expediente.ts";

test("crear un expediente desde un aporte lo deja vinculado con motivo", async () => {
  const a = await nuevoAporte("exp-crear");
  const e = await crearExpediente({
    procesoId, descripcion: "baja presión de agua en la parte alta",
    desdeAporte: a.aporteId, autor: "revisora", motivo: "es el relato que la origina",
  });
  const aportes = await aportesDe(e.expedienteId);
  assert.equal(aportes.length, 1);
  assert.equal(aportes[0]!.aporteId, a.aporteId);
  assert.equal(aportes[0]!.motivo, "es el relato que la origina");
});

test("vincular sin motivo se rechaza", async () => {
  const a = await nuevoAporte("exp-sin-motivo");
  const e = await crearExpediente({ procesoId, descripcion: "agua", desdeAporte: a.aporteId,
                                    autor: "revisora", motivo: "origen" });
  const b = await nuevoAporte("exp-sin-motivo-b");
  await assert.rejects(() => vincular({ aporteId: b.aporteId, expedienteId: e.expedienteId,
                                        autor: "revisora", motivo: "" }), /motivo/i);
});

test("UN aporte puede alimentar DOS expedientes", async () => {
  // El caso textual de V12: quien menciona contaminación del agua y falta de
  // transporte escolar produce dos necesidades desde un mismo relato.
  const a = await recibirAporte({
    procesoId, claveEnvio: clave("dos-necesidades"),
    relato: "el agua llega contaminada y además no hay transporte escolar", canal: "web",
  });
  const agua = await crearExpediente({ procesoId, descripcion: "agua contaminada",
    desdeAporte: a.aporteId, autor: "revisora", motivo: "el relato menciona el agua" });
  const bus = await crearExpediente({ procesoId, descripcion: "sin transporte escolar",
    desdeAporte: a.aporteId, autor: "revisora", motivo: "el mismo relato menciona el transporte" });
  const exps = await expedientesDe(a.aporteId);
  assert.equal(exps.length, 2);
  assert.notEqual(agua.expedienteId, bus.expedienteId);
});

test("dos barrios del mismo municipio son DOS expedientes por defecto", async () => {
  const a = await nuevoAporte("barrio-a");
  const b = await nuevoAporte("barrio-b");
  const ea = await crearExpediente({ procesoId, descripcion: "baja presión en la parte alta",
    desdeAporte: a.aporteId, autor: "revisora", motivo: "origen" });
  const eb = await crearExpediente({ procesoId, descripcion: "baja presión en el barrio del sur",
    desdeAporte: b.aporteId, autor: "revisora", motivo: "origen" });
  assert.notEqual(ea.expedienteId, eb.expedienteId,
    "compartir municipio y tema no basta: podrían atenderse por separado");
});

test("baja presión y contaminación son dos, aunque compartan territorio", async () => {
  const a = await nuevoAporte("presion");
  const b = await nuevoAporte("contaminacion");
  const ea = await crearExpediente({ procesoId, descripcion: "baja presión",
    desdeAporte: a.aporteId, autor: "revisora", motivo: "origen",
    territorios: [{ codigo: mun[0]!.codigo, version: mun[0]!.version }] });
  const eb = await crearExpediente({ procesoId, descripcion: "agua contaminada",
    desdeAporte: b.aporteId, autor: "revisora", motivo: "origen",
    territorios: [{ codigo: mun[0]!.codigo, version: mun[0]!.version }] });
  assert.notEqual(ea.expedienteId, eb.expedienteId,
    "requieren verificaciones y respuestas distintas (V12)");
});

test("R1 · un expediente con DOS territorios es UNA necesidad", async () => {
  const a = await nuevoAporte("intermunicipal");
  const e = await crearExpediente({
    procesoId, descripcion: "la cuenca que cruza los dos municipios",
    desdeAporte: a.aporteId, autor: "revisora", motivo: "origen",
    territorios: [{ codigo: mun[0]!.codigo, version: mun[0]!.version },
                  { codigo: mun[1]!.codigo, version: mun[1]!.version }],
  });
  const { data } = await p.from("expediente_territorio")
    .select("territorio_codigo, estado_atencion").eq("expediente_id", e.expedienteId);
  assert.equal(data?.length, 2, "dos territorios");
  // Y cada uno lleva su propio estado: no es un expediente con territorio promedio.
  assert.ok(data!.every((t) => t.estado_atencion === "sin_atender"));
});

// ── T029 · desagrupar sin borrar, y reabrir sin heredar ─────────────────────
//
// `I4` es la invariante más cara de implementar mal. Lo que tiene que sobrevivir
// a un desagrupe está escrito: *«conservar originales, diferencias, motivos y
// vínculos»*, y *«reabre examen de prioridad y respuestas sin heredar
// aprobación»*.
//
// Esa segunda mitad es la que se olvida.

import { desvincular } from "../src/revision/expediente.ts";

test("desvincular sin motivo se rechaza", async () => {
  const a = await nuevoAporte("desv-sin-motivo");
  const e = await crearExpediente({ procesoId, descripcion: "agua", desdeAporte: a.aporteId,
                                    autor: "revisora", motivo: "origen" });
  await assert.rejects(() => desvincular({ aporteId: a.aporteId, expedienteId: e.expedienteId,
                                           autor: "revisora", motivo: "" }), /motivo/i);
});

test("el vínculo SIGUE en la base después de desvincular", async () => {
  const a = await nuevoAporte("desv-conserva");
  const e = await crearExpediente({ procesoId, descripcion: "agua", desdeAporte: a.aporteId,
                                    autor: "revisora", motivo: "origen" });
  await desvincular({ aporteId: a.aporteId, expedienteId: e.expedienteId,
                      autor: "revisora", motivo: "era otra afectación" });
  const { data } = await p.from("vinculo_aporte_expediente")
    .select("motivo, desvinculado_motivo, desvinculado_autor")
    .eq("aporte_id", a.aporteId).eq("expediente_id", e.expedienteId);
  assert.equal(data?.length, 1, "la fila no se borra: se marca");
  assert.equal(data?.[0]?.motivo, "origen", "el motivo original se conserva");
  assert.equal(data?.[0]?.desvinculado_motivo, "era otra afectación");
});

test("el aporte deja de contar en el expediente", async () => {
  const a = await nuevoAporte("desv-cuenta");
  const e = await crearExpediente({ procesoId, descripcion: "agua", desdeAporte: a.aporteId,
                                    autor: "revisora", motivo: "origen" });
  assert.equal((await aportesDe(e.expedienteId)).length, 1);
  await desvincular({ aporteId: a.aporteId, expedienteId: e.expedienteId,
                      autor: "revisora", motivo: "no era" });
  assert.equal((await aportesDe(e.expedienteId)).length, 0);
});

test("el expediente queda REABIERTO, con fecha y causa", async () => {
  const a = await nuevoAporte("desv-reabre");
  const e = await crearExpediente({ procesoId, descripcion: "agua", desdeAporte: a.aporteId,
                                    autor: "revisora", motivo: "origen" });
  await desvincular({ aporteId: a.aporteId, expedienteId: e.expedienteId,
                      autor: "revisora", motivo: "el relato hablaba de otra cosa" });
  const { data } = await p.from("expediente")
    .select("reabierto_en, reabierto_motivo").eq("id", e.expedienteId).single();
  assert.ok(data?.reabierto_en, "sin esto, la prioridad se hereda y el sistema afirma lo que ya no sustenta");
  assert.match(data!.reabierto_motivo!, /desagrup/i);
});

test("un corte tomado ANTES sigue devolviendo lo mismo", async () => {
  const a = await nuevoAporte("desv-corte");
  await resolverUbicacion({ aporteId: a.aporteId, codigo: mun[0]!.codigo, version: mun[0]!.version,
                            autor: "revisora", motivo: "aceptado" });
  const e = await crearExpediente({ procesoId, descripcion: "agua del corte",
                                    desdeAporte: a.aporteId, autor: "revisora", motivo: "origen" });
  const { data: corteId } = await p.rpc("tomar_corte", { p_proceso: procesoId });
  const { data: antes } = await p.from("corte").select("indicadores").eq("id", corteId).single();
  const necesidadesAntes = (antes!.indicadores as any).necesidades;

  await desvincular({ aporteId: a.aporteId, expedienteId: e.expedienteId,
                      autor: "revisora", motivo: "revisión posterior" });

  const { data: despues } = await p.from("corte").select("indicadores").eq("id", corteId).single();
  assert.equal((despues!.indicadores as any).necesidades, necesidadesAntes,
    "el corte es inmutable: R2 lo exige y la regla de Postgres lo garantiza");
});

test("volver a vincular crea un vínculo NUEVO, no revive el viejo", async () => {
  const a = await nuevoAporte("desv-revincula");
  const e = await crearExpediente({ procesoId, descripcion: "agua", desdeAporte: a.aporteId,
                                    autor: "revisora", motivo: "origen" });
  await desvincular({ aporteId: a.aporteId, expedienteId: e.expedienteId,
                      autor: "revisora", motivo: "me equivoqué" });
  await vincular({ aporteId: a.aporteId, expedienteId: e.expedienteId,
                   autor: "revisora", motivo: "sí era, después de aclararlo con la persona" });
  const { data } = await p.from("vinculo_aporte_expediente")
    .select("motivo, desvinculado_en").eq("aporte_id", a.aporteId).eq("expediente_id", e.expedienteId);
  assert.equal(data?.length, 2, "dos filas: la historia no se reescribe");
  assert.equal(data!.filter((v) => v.desvinculado_en === null).length, 1);
});

import { bandeja } from "../src/revision/bandeja.ts";
import { registrarActuacion, aceptarRemision } from "../src/gestion/actuacion.ts";

test("la bandeja dice de qué habla y si ya se escaló", async () => {
  // Sin el tema no se enruta a ninguna mesa, y sin el escalamiento dos personas
  // remiten lo mismo dos veces — la segunda sin forma de saberlo salvo abriendo
  // el aporte uno por uno.
  const sinEscalar = await nuevoAporte("bandeja-tema");
  await p.from("aporte").update({ tema: "agua" }).eq("id", sinEscalar.aporteId);

  const escalado = await nuevoAporte("bandeja-escalado");
  const e = await crearExpediente({
    procesoId, descripcion: "el agua no llega a la parte alta",
    desdeAporte: escalado.aporteId, autor: "revisora", motivo: "origen",
  });
  const r = await registrarActuacion({
    expedienteId: e.expedienteId, tipo: "remision", autor: "revisora",
    destino: "la mesa técnica de agua", motivo: "necesita desagregarse",
  });

  const antes = await bandeja(procesoId, { ubicacion: "todos" }, 500);
  const filaTema = antes.filas.find((f) => f.aporteId === sinEscalar.aporteId);
  assert.equal(filaTema!.tema, "agua");
  assert.equal(filaTema!.escalado, "no", "un aporte sin expediente no está escalado");
  assert.equal(
    antes.filas.find((f) => f.aporteId === escalado.aporteId)!.escalado,
    "pendiente",
    "remitir no es que lo hayan recibido: mientras nadie confirme, sigue pendiente",
  );

  await aceptarRemision({ actuacionId: r.actuacionId, autor: "revisora", motivo: "radicado 4471" });
  const despues = await bandeja(procesoId, { ubicacion: "todos" }, 500);
  assert.equal(
    despues.filas.find((f) => f.aporteId === escalado.aporteId)!.escalado,
    "recibido",
  );
});

test("el departamento y el municipio de un aporte ubicado salen en los filtros", async () => {
  // El desplegable de departamento y el de municipio enseñaban «Todos» y nada
  // más, con 575 aportes ubicados en la base. La causa era una consulta que
  // fallaba en silencio; el síntoma era este, y es lo que hay que vigilar: si
  // un aporte tiene municipio confirmado, **tiene que poder filtrarse por él**.
  const r = await nuevoAporte("filtros-territorio");
  await resolverUbicacion({
    aporteId: r.aporteId, codigo: mun[0]!.codigo, version: mun[0]!.version,
    autor: "revisora", motivo: "la persona confirmó el municipio por teléfono",
  });

  const { opciones } = await bandeja(procesoId, { ubicacion: "todos" }, 500);
  const municipio = opciones.municipios.find((m) => m.codigo === mun[0]!.codigo);
  assert.ok(municipio, "el municipio del aporte no se puede escoger en el filtro");
  assert.ok(
    opciones.departamentos.some((d) => d.codigo === municipio.departamento),
    "el municipio salió sin su departamento: filtrar por departamento no lo encontraría",
  );

  // Y filtrar por él tiene que devolverlo, que es para lo que está el filtro.
  const filtrada = await bandeja(procesoId, { ubicacion: "todos", municipio: mun[0]!.codigo }, 500);
  assert.ok(filtrada.filas.some((f) => f.aporteId === r.aporteId));
  // El desplegable no se calcula sobre lo filtrado: si se calculara, escoger un
  // municipio dejaría ese como única opción y no habría forma de volver.
  assert.ok(filtrada.opciones.municipios.some((m) => m.codigo === mun[0]!.codigo));
});
