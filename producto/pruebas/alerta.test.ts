// T034 · la ruta de alerta urgente (`V13`).
//
// Lo que se prueba es que **no prometa de más**: que mostrar un teléfono no
// cuente como haber contactado, que contactar no cuente como que alguien
// recibió, y que nada ni nadie pueda apagarla sin decir por qué.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import {
  hayIndicio, ORIENTACION, levantarAlerta, marcarOrientacionMostrada,
  registrarContactoIntentado, confirmarRecepcion, devolverAFlujoOrdinario,
} from "../src/alerta/urgencia.ts";
import { recibirAporte } from "../src/captura/recibir.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const p = clienteServidor().schema("participacion");
let procesoId = "";
const procesos: string[] = [];
let n = 0;

before(async () => {
  const { data } = await p.from("proceso")
    .insert({ nombre: "ESCENARIO DE PRUEBA — alerta", compromiso: "consulta" })
    .select("id").single();
  procesoId = data!.id;
  procesos.push(procesoId);
});

after(async () => {
  await p.from("proceso")
    .update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
    .in("id", procesos);
});

const aporte = (relato = "el agua no llega") =>
  recibirAporte({ procesoId, claveEnvio: `t034-${++n}-${Date.now()}`, relato, canal: "web" });

test("una señal de texto levanta indicio; un relato corriente no", async () => {
  assert.ok(hayIndicio("el puente está agrietado y la gente sigue pasando"));
  assert.equal(hayIndicio("el agua llega turbia desde hace tres meses"), null);
  // Muestra de más, nunca de menos: la asimetría está decidida.
  assert.ok(hayIndicio("es urgente, hay un deslizamiento"));
});

test("marcarla a mano crea la alerta ligada al aporte", async () => {
  const a = await aporte();
  const r = await levantarAlerta({ aporteId: a.aporteId, origen: "persona" });
  assert.equal(r.yaExistia, false);
  const { data } = await p.from("alerta").select("aporte_id, origen").eq("id", r.alertaId).single();
  assert.equal(data?.aporte_id, a.aporteId);
  assert.equal(data?.origen, "persona");
});

test("queda dicho si la levantó una señal y no una persona", async () => {
  const a = await aporte("el muro se va a caer");
  const indicio = hayIndicio("el muro se va a caer")!;
  const r = await levantarAlerta({ aporteId: a.aporteId, origen: "senal", indicio });
  const { data } = await p.from("alerta").select("origen, indicio").eq("id", r.alertaId).single();
  assert.equal(data?.origen, "senal", "una señal no es una persona diciendo que es emergencia");
  assert.equal(data?.indicio, indicio);
});

test("la alerta existe SIN que haya expediente", async () => {
  const a = await aporte();
  const r = await levantarAlerta({ aporteId: a.aporteId, origen: "persona" });
  const { count } = await p.from("vinculo_aporte_expediente")
    .select("id", { count: "exact", head: true }).eq("aporte_id", a.aporteId);
  assert.equal(count, 0, "un formulario a medio llenar ya puede tener alerta");
  assert.ok(r.alertaId);
});

test("levantar dos veces sobre el mismo aporte no crea dos alertas", async () => {
  const a = await aporte();
  const uno = await levantarAlerta({ aporteId: a.aporteId, origen: "persona" });
  const dos = await levantarAlerta({ aporteId: a.aporteId, origen: "senal", indicio: "urgente" });
  assert.equal(dos.alertaId, uno.alertaId);
  assert.equal(dos.yaExistia, true);
});

test("los tres momentos se registran por separado", async () => {
  const a = await aporte();
  const { alertaId } = await levantarAlerta({ aporteId: a.aporteId, origen: "persona" });

  await marcarOrientacionMostrada(alertaId);
  let { data } = await p.from("alerta")
    .select("orientacion_mostrada_en, contacto_intentado_en, recepcion_confirmada_en")
    .eq("id", alertaId).single();
  assert.ok(data?.orientacion_mostrada_en);
  assert.equal(data?.contacto_intentado_en, null, "mostrar un teléfono NO es haber contactado");

  await registrarContactoIntentado({ alertaId, canal: "123", responsable: "turno" });
  ({ data } = await p.from("alerta")
    .select("orientacion_mostrada_en, contacto_intentado_en, recepcion_confirmada_en")
    .eq("id", alertaId).single());
  assert.ok(data?.contacto_intentado_en);
  assert.equal(data?.recepcion_confirmada_en, null, "contactar NO es que alguien haya recibido");

  await confirmarRecepcion({ alertaId, constancia: "número de reporte 4471", responsable: "turno" });
  ({ data } = await p.from("alerta").select("recepcion_confirmada_en").eq("id", alertaId).single());
  assert.ok(data?.recepcion_confirmada_en);
});

test("no se puede confirmar recepción sin haber intentado el contacto", async () => {
  const a = await aporte();
  const { alertaId } = await levantarAlerta({ aporteId: a.aporteId, origen: "persona" });
  await assert.rejects(() => confirmarRecepcion({
    alertaId, constancia: "inventada", responsable: "x" }));
});

test("devolver al flujo ordinario exige justificación y conserva el aporte", async () => {
  const a = await aporte();
  const { alertaId } = await levantarAlerta({ aporteId: a.aporteId, origen: "senal", indicio: "urgente" });
  await assert.rejects(() => devolverAFlujoOrdinario({ alertaId, autor: "revisora", motivo: "" }),
    /justificaci/i);
  await devolverAFlujoOrdinario({ alertaId, autor: "revisora",
    motivo: "la palabra urgente era por la demora del trámite, no por peligro" });
  const { data } = await p.from("alerta").select("devuelta_motivo, devuelta_autor").eq("id", alertaId).single();
  assert.match(data!.devuelta_motivo!, /demora/);
  const { data: sigue } = await p.from("aporte").select("id, retirado_en").eq("id", a.aporteId).single();
  assert.ok(sigue && sigue.retirado_en === null, "el aporte se conserva");
});

test("no existe forma de desactivar una alerta sin autor y motivo", async () => {
  // V13: la IA puede detectar, pero su valoración no puede desactivarla por sí
  // sola. Lo más parecido que existe es devolverla, y eso exige una persona.
  const modulo = await import("../src/alerta/urgencia.ts");
  const nombres = Object.keys(modulo).map((k) => k.toLowerCase());
  assert.ok(!nombres.some((k) => k.includes("desactivar") || k.includes("descartar")),
    "una función así sería una puerta para apagarla sin decir por qué");
});

test("la orientación no pide acercarse al peligro ni tomar fotos", async () => {
  const t = ORIENTACION.toLowerCase();
  for (const prohibido of ["foto", "acércate", "acercarse", "evidencia", "prueba"]) {
    assert.ok(!t.includes(prohibido), `la orientación decía «${prohibido}»`);
  }
  assert.match(ORIENTACION, /123/);
  assert.match(ORIENTACION, /no activa por sí mismo/i);
});
