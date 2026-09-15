// Los siete casos de T023, sacados de los pasos 1 y 2 de la prueba de punta a
// punta y de la aceptación de `DAT-01`.
//
// **Se escribieron antes que `recibirAporte`, y se vieron fallar.** Es la regla
// de `AGENTS.md` §12: ninguna casilla se marca con una afirmación.
//
// Esto no prueba la pantalla ni la acción de Next: prueba que **recibir un
// aporte dos veces produce un aporte**. Lo demás es envoltura.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { recibirAporte } from "../src/captura/recibir.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const sb = clienteServidor();
let procesoId = "";
const claves: string[] = [];

const clave = (n: string) => {
  const k = `prueba-${n}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  claves.push(k);
  return k;
};

before(async () => {
  const { data, error } = await sb.schema("participacion").from("proceso")
    .select("id").limit(1).single();
  if (error) throw new Error(`no hay proceso sembrado: ${error.message}`);
  procesoId = data.id;
});

// Cada corrida se limpia lo suyo. Un aporte de prueba que se queda ensucia los
// conteos de R2, que es justo lo que no se puede permitir.
after(async () => {
  if (!claves.length) return;
  const { data } = await sb.schema("participacion").from("aporte")
    .select("id").in("clave_envio", claves);
  const ids = (data ?? []).map((a) => a.id as string);
  if (!ids.length) return;
  // Los hijos primero: las claves foráneas no dejan borrar el padre, y un
  // borrado que falla en silencio deja aportes que descuadran los conteos de la
  // prueba de al lado. Pasó, y por eso está escrito aquí.
  await sb.schema("participacion").from("ubicacion").delete().in("aporte_id", ids);
  await sb.schema("participacion").from("auditoria").delete().in("entidad_id", ids);
  await sb.schema("participacion").rpc("borrar_comprobantes_de_prueba", { p_aportes: ids });
  await sb.schema("participacion").from("aporte").delete().in("id", ids);
});

test("un envío nuevo crea un aporte y devuelve comprobante", async () => {
  const r = await recibirAporte({
    procesoId, claveEnvio: clave("nuevo"),
    relato: "el agua no llega con presión suficiente", canal: "web",
    lugarDeclarado: "la parte alta del barrio",
  });
  assert.equal(r.yaExistia, false);
  assert.ok(r.aporteId, "debe devolver el id del aporte");
  assert.ok(r.codigoComprobante.length >= 8, "el código debe ser suficiente para no adivinarse");
});

test("I1 · el mismo envío repetido NO crea un segundo aporte", async () => {
  const k = clave("reintento");
  const entrada = { procesoId, claveEnvio: k, relato: "el agua no llega", canal: "web" as const };
  const primero = await recibirAporte(entrada);
  const segundo = await recibirAporte(entrada);   // el corte de red
  assert.equal(segundo.aporteId, primero.aporteId, "tiene que ser el MISMO aporte");
  assert.equal(segundo.yaExistia, true);
});

test("I1 · dos personas en el mismo equipo SÍ crean dos aportes", async () => {
  const a = await recibirAporte({ procesoId, claveEnvio: clave("eq-a"), relato: "no hay agua", canal: "web" });
  const b = await recibirAporte({ procesoId, claveEnvio: clave("eq-b"), relato: "no hay transporte", canal: "web" });
  assert.notEqual(a.aporteId, b.aporteId, "claves distintas son aportes distintos");
});

test("I2 · sin lugar normalizable la ubicación queda «por aclarar» y SIN código", async () => {
  const r = await recibirAporte({
    procesoId, claveEnvio: clave("sin-lugar"),
    relato: "agua intermitente", canal: "web", lugarDeclarado: "cerca de San José",
  });
  const { data } = await sb.schema("participacion").from("ubicacion")
    .select("estado, territorio_codigo").eq("aporte_id", r.aporteId);
  assert.equal(data?.length, 1);
  assert.equal(data?.[0]?.estado, "por_aclarar");
  assert.equal(data?.[0]?.territorio_codigo, null, "no se inventa un municipio");
});

test("el lugar se guarda TAL COMO la persona lo dijo", async () => {
  const dicho = "subiendo por la loma, después de la escuela";
  const r = await recibirAporte({
    procesoId, claveEnvio: clave("textual"), relato: "agua", canal: "web", lugarDeclarado: dicho,
  });
  const { data } = await sb.schema("participacion").from("aporte")
    .select("lugar_declarado").eq("id", r.aporteId).single();
  assert.equal(data?.lugar_declarado, dicho);
});

test("I1 · dos envíos simultáneos con la misma clave producen un solo aporte", async () => {
  const k = clave("carrera");
  const entrada = { procesoId, claveEnvio: k, relato: "el puente está agrietado", canal: "web" as const };
  const [a, b] = await Promise.all([recibirAporte(entrada), recibirAporte(entrada)]);
  assert.equal(a.aporteId, b.aporteId, "comprobar-y-luego-insertar dejaría pasar los dos");
  const { count } = await sb.schema("participacion").from("aporte")
    .select("id", { count: "exact", head: true }).eq("clave_envio", k);
  assert.equal(count, 1);
});

test("cada aporte recibido deja un asiento en la auditoría", async () => {
  const r = await recibirAporte({ procesoId, claveEnvio: clave("auditoria"), relato: "agua", canal: "web" });
  const { data } = await sb.schema("participacion").from("auditoria")
    .select("accion, entidad").eq("entidad_id", r.aporteId);
  assert.ok(data && data.length >= 1, "tiene que quedar el rastro de quién y cuándo");
  assert.equal(data?.[0]?.accion, "recibir");
});

import { claveEnvioVigente, nuevaClaveEnvio } from "../src/captura/clave-envio.ts";
import { TEMAS } from "../src/captura/lectura.ts";

/** Un almacén de mentira, para no depender de que haya navegador. */
function almacenFalso(inicial: Record<string, string> = {}): Storage {
  const datos = new Map(Object.entries(inicial));
  return {
    getItem: (k: string) => datos.get(k) ?? null,
    setItem: (k: string, v: string) => { datos.set(k, v); },
    removeItem: (k: string) => { datos.delete(k); },
    clear: () => datos.clear(),
    key: () => null,
    get length() { return datos.size; },
  } as Storage;
}

test("la clave del servidor se adopta, no se sustituye por otra", () => {
  // **Es lo que sostiene `I1` durante la hidratación.** El formulario se puede
  // enviar antes de que el navegador hidrate, con la clave que el servidor
  // dibujó. Si al hidratar se inventara otra, un reintento crearía un segundo
  // aporte de lo mismo — justo lo que `I1` existe para impedir.
  const almacen = almacenFalso();
  const reserva = nuevaClaveEnvio();
  assert.equal(claveEnvioVigente({ almacen, reserva }), reserva);
  // Y queda guardada: el siguiente reintento usa la misma.
  assert.equal(claveEnvioVigente({ almacen }), reserva);
});

test("si ya había una guardada, esa manda sobre la del servidor", () => {
  // Quien recarga a mitad de escribir sigue siendo el mismo envío.
  const almacen = almacenFalso({ "pc.clave-envio": "la-de-antes" });
  assert.equal(claveEnvioVigente({ almacen, reserva: nuevaClaveEnvio() }), "la-de-antes");
});

test("sin almacén se usa la del servidor antes que inventar una", () => {
  const reserva = nuevaClaveEnvio();
  assert.equal(claveEnvioVigente({ reserva }), reserva);
});

test("la base acepta TODOS los temas de la lista, no solo los viejos", async () => {
  // **El fallo que esto vigila fue silencioso.** La lista pasó de once a
  // dieciocho en el código y la restricción del esquema se quedó con once: la
  // base rechazaba el `update` con «empleo», el error no se miraba, y el aporte
  // quedaba sin tema mientras la ficha decía «la lectura propuso Empleo e
  // ingresos».
  //
  // Se comprueba contra la base de verdad, uno por uno: una lista que cuadra en
  // el papel puede no cuadrar en la base que está corriendo.
  // `await`, no `return`: `node:test` espera `Promise<void>` y devolver el
  // array de resultados no compila.
  await Promise.all(TEMAS.map(async (tema) => {
    const r = await recibirAporte({
      procesoId, claveEnvio: `tema-${tema}-${Date.now()}`,
      relato: `prueba del tema ${tema}`, canal: "web",
    });
    const { error } = await clienteServidor().schema("participacion")
      .from("aporte").update({ tema }).eq("id", r.aporteId);
    assert.equal(error, null, `la base rechaza el tema «${tema}»: ${error?.message}`);
  }));
});
