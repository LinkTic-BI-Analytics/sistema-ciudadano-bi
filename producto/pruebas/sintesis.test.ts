// T025 · la síntesis que la persona corrige y confirma.
//
// `V14`: **la persona tiene la última palabra sobre la síntesis atribuida a
// ella.** Y `N03`: la síntesis **nunca sustituye el original**.
//
// Lo que se prueba es que corregir no borre, que confirmar no signifique más de
// lo que significa, y que las dos clases de corrección queden distinguidas
// —aunque su efecto siga abierto (`Q15`)—.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { proponerSintesis, confirmarSintesis, corregirSintesis, sintesisDe } from "../src/captura/sintesis.ts";
import { recibirAporte } from "../src/captura/recibir.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const p = clienteServidor().schema("participacion");
let procesoId = "";
const procesos: string[] = [];
let n = 0;

before(async () => {
  const { data } = await p.from("proceso")
    .insert({ nombre: "ESCENARIO DE PRUEBA — síntesis", compromiso: "consulta" })
    .select("id").single();
  procesoId = data!.id;
  procesos.push(procesoId);
});

after(async () => {
  await p.from("proceso")
    .update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
    .in("id", procesos);
});

const RELATO = "el agua llega turbia y a veces no llega en la parte alta";

const nuevoAporte = () => recibirAporte({
  procesoId, claveEnvio: `t025-${++n}-${Date.now()}`, relato: RELATO, canal: "web",
});

test("guardar una síntesis crea la versión 1, sin confirmar", async () => {
  const a = await nuevoAporte();
  await proponerSintesis({ aporteId: a.aporteId, autor: "ciudadano",
    problema: "el agua llega turbia", resultadoEsperado: "que llegue limpia y constante" });
  const s = await sintesisDe(a.aporteId);
  assert.equal(s.length, 1);
  assert.equal(s[0]!.version, 1);
  assert.equal(s[0]!.clase, "propuesta");
  assert.equal(s[0]!.confirmadaEn, null);
});

test("el relato original NO cambia al guardar una síntesis", async () => {
  const a = await nuevoAporte();
  await proponerSintesis({ aporteId: a.aporteId, autor: "ciudadano", problema: "otra cosa" });
  const { data } = await p.from("aporte").select("relato_original").eq("id", a.aporteId).single();
  assert.equal(data?.relato_original, RELATO, "N03: la síntesis nunca sustituye el original");
});

test("confirmar mueve estado_confirmacion y NO mueve estado_revision", async () => {
  const a = await nuevoAporte();
  await proponerSintesis({ aporteId: a.aporteId, autor: "ciudadano", problema: "el agua" });
  await confirmarSintesis({ aporteId: a.aporteId, autor: "ciudadano" });
  const { data } = await p.from("aporte")
    .select("estado_confirmacion, estado_revision").eq("id", a.aporteId).single();
  assert.equal(data?.estado_confirmacion, "confirmado");
  // «Validar una síntesis no equivale a verificar los hechos».
  assert.equal(data?.estado_revision, "sin_revisar");
});

test("corregir una confirmada crea la versión 2 y CONSERVA la 1", async () => {
  const a = await nuevoAporte();
  await proponerSintesis({ aporteId: a.aporteId, autor: "ciudadano", problema: "el agua llega turbia" });
  await confirmarSintesis({ aporteId: a.aporteId, autor: "ciudadano" });
  await corregirSintesis({ aporteId: a.aporteId, autor: "ciudadano",
    texto: "yo pedí mejorar la presión, no construir una planta",
    clase: "mal_interpretado", motivo: "no era lo que quise decir" });
  const s = await sintesisDe(a.aporteId);
  assert.equal(s.length, 2, "la historia no se reescribe");
  assert.equal(s[0]!.version, 1);
  assert.equal(s[1]!.version, 2);
  assert.match(s[0]!.texto, /turbia/, "la versión 1 sigue diciendo lo que decía");
});

test("las dos clases de corrección se guardan distinguidas", async () => {
  const a = await nuevoAporte();
  await proponerSintesis({ aporteId: a.aporteId, autor: "ciudadano", problema: "el agua" });
  await corregirSintesis({ aporteId: a.aporteId, autor: "ciudadano", texto: "me entendieron mal",
                           clase: "mal_interpretado" });
  await corregirSintesis({ aporteId: a.aporteId, autor: "ciudadano", texto: "ahora además quiero esto",
                           clase: "cambio_de_posicion" });
  const s = await sintesisDe(a.aporteId);
  assert.deepEqual(s.map((x) => x.clase), ["propuesta", "mal_interpretado", "cambio_de_posicion"]);
});

test("una clase inventada se rechaza", async () => {
  const a = await nuevoAporte();
  await proponerSintesis({ aporteId: a.aporteId, autor: "ciudadano", problema: "el agua" });
  await assert.rejects(() => corregirSintesis({ aporteId: a.aporteId, autor: "ciudadano",
    texto: "x", clase: "retractacion" as any }));
});

test("una síntesis sin ninguna de las tres partes no se guarda", async () => {
  const a = await nuevoAporte();
  await assert.rejects(() => proponerSintesis({ aporteId: a.aporteId, autor: "ciudadano" }),
    /vac[ií]a|ninguna/i);
});
