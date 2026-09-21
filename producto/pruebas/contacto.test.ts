// Desde dónde nos contacta la persona.
//
// La pregunta nació de algo que el formulario no tenía cómo registrar: quien
// escribe desde fuera del país sobre su municipio de siempre. Hasta hoy o se
// quedaba sin decirlo, o —peor— lo escribía en el campo del lugar del problema,
// y entonces un aporte de Caldas parecía ser de Madrid.
//
// Lo que se vigila aquí es **que las dos cosas no se toquen**:
//
//   · desde dónde escribe        → `aporte.contacto_*`
//   · dónde ocurre el problema   → `participacion.ubicacion`, y de ahí `R1`/`R2`
//
// Y que el ámbito y el código no se puedan contradecir. Eso último no lo
// comprueba el servidor: lo rechaza la base (`AGENTS.md` §8), y por eso el caso
// se escribe contra la base y no contra la función.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { recibirAporte } from "../src/captura/recibir.ts";
import { declararDesdeDonde } from "../src/captura/contacto.ts";
import { resolverUbicacion } from "../src/revision/ubicacion.ts";
import { paises } from "../src/territorio/paises.ts";
import { clienteServidor } from "../src/datos/cliente.ts";

const p = clienteServidor().schema("participacion");
let procesoId = "";
const creados: string[] = [];

before(async () => {
  const { data } = await p.from("proceso")
    .insert({ nombre: "ESCENARIO DE PRUEBA — desde dónde nos contacta", compromiso: "consulta" })
    .select("id").single();
  procesoId = data!.id;
});

after(async () => {
  await p.from("ubicacion").delete().in("aporte_id", creados);
  await p.from("aporte").delete().in("id", creados);
  await p.from("proceso").update({ retirado_en: new Date().toISOString(), retirado_motivo: "escenario de prueba" })
    .eq("id", procesoId);
});

async function unAporte(relato: string) {
  const r = await recibirAporte({ procesoId, claveEnvio: `con-${crypto.randomUUID()}`, relato, canal: "web" });
  creados.push(r.aporteId);
  return r.aporteId;
}

async function unMunicipio() {
  const { data } = await p.from("territorio").select("codigo, version")
    .eq("nivel", "municipio").limit(1).single();
  return data!;
}

test("el catálogo trae los países, y son los de ISO 3166-1", async () => {
  // **Se cuentan.** Es la misma trampa que dejó 122 municipios fuera del
  // buscador durante semanas: PostgREST corta en 1.000 filas y contesta 200
  // como si fueran todas. Hoy caben de sobra, y «hoy caben» no es un chequeo.
  const todos = await paises();
  assert.equal(todos.length, 249, "faltan países: ¿se sembró ./scripts/paises.sh?");
  assert.ok(todos.some((x) => x.codigo === "ES" && x.nombre === "España"));
  assert.ok(todos.some((x) => x.codigo === "CO"));
  // El código es de dos letras **siempre**: de ahí cuelga la restricción del
  // aporte, que distingue un país de un municipio por la forma del código.
  assert.ok(todos.every((x) => /^[A-Z]{2}$/.test(x.codigo)));
});

test("escribir desde fuera no mueve el municipio del problema", async () => {
  // Es el caso que motivó la pregunta entera: alguien en España contando lo de
  // su vereda. El aporte tiene que quedar contado en el municipio colombiano
  // —`R2` cuenta `ubicacion`, no esto— y a la vez decir desde dónde se escribió.
  const m = await unMunicipio();
  const a = await unAporte("la vía de la vereda está intransitable desde el invierno");

  await resolverUbicacion({
    aporteId: a, codigo: m.codigo, version: m.version, autor: "ciudadano",
    motivo: "la persona lo confirmó al contar su aporte",
  });
  const es = (await paises()).find((x) => x.codigo === "ES")!;
  await declararDesdeDonde({ aporteId: a, ambito: "internacional", codigo: es.codigo, version: es.version });

  const { data: ap } = await p.from("aporte")
    .select("contacto_ambito, contacto_codigo, contacto_version").eq("id", a).single();
  assert.equal(ap!.contacto_ambito, "internacional");
  assert.equal(ap!.contacto_codigo, "ES");
  assert.equal(ap!.contacto_version, es.version, "la versión del catálogo viaja con el código (Q5)");

  const { data: ubis } = await p.from("ubicacion")
    .select("territorio_codigo").eq("aporte_id", a).eq("estado", "confirmada");
  assert.equal(ubis!.length, 1, "decir desde dónde escribe no agrega un territorio");
  assert.equal(ubis![0]!.territorio_codigo, m.codigo, "el problema sigue ocurriendo donde ocurría");
});

test("desde Colombia se guarda el municipio, con la versión de DIVIPOLA", async () => {
  const m = await unMunicipio();
  const a = await unAporte("no hay alumbrado en la cuadra");
  await declararDesdeDonde({ aporteId: a, ambito: "nacional", codigo: m.codigo, version: m.version });

  const { data: ap } = await p.from("aporte")
    .select("contacto_ambito, contacto_codigo, contacto_version").eq("id", a).single();
  assert.equal(ap!.contacto_ambito, "nacional");
  assert.equal(ap!.contacto_codigo, m.codigo);
  assert.equal(ap!.contacto_version, m.version);
});

test("no contestar deja las tres columnas vacías, y eso es una respuesta", async () => {
  // `N02`. Un aporte que pasa por el final sin decir desde dónde no se rellena
  // con «nacional»: suponerlo es la inferencia que `I2` prohíbe, aunque acierte
  // casi siempre.
  const a = await unAporte("se cayó un árbol sobre el andén");
  const { data: ap } = await p.from("aporte")
    .select("contacto_ambito, contacto_codigo, contacto_version").eq("id", a).single();
  assert.equal(ap!.contacto_ambito, null);
  assert.equal(ap!.contacto_codigo, null);
  assert.equal(ap!.contacto_version, null);
});

test("la base rechaza un ámbito internacional con código de municipio", async () => {
  // Se ve fallar la restricción, no la función: «internacional · 05001» sería
  // una fila que ninguna pantalla sabe leer, y el servidor no es el sitio donde
  // eso se vuelve imposible (`AGENTS.md` §8).
  const m = await unMunicipio();
  const a = await unAporte("hay basura acumulada en el parque");
  const { error } = await p.from("aporte")
    .update({ contacto_ambito: "internacional", contacto_codigo: m.codigo, contacto_version: m.version })
    .eq("id", a);
  assert.ok(error, "la base tiene que rechazarlo");
  assert.match(error!.message, /el_contacto_cuadra_con_el_ambito/);
});

test("la base rechaza un código sin su versión de catálogo", async () => {
  // Un código sin versión no se puede volver a leer dentro de un año (`Q5`), y
  // la clave foránea no lo atrapa: con una columna nula se salta la
  // comprobación.
  const a = await unAporte("el puente peatonal está sin barandas");
  const { error } = await p.from("aporte")
    .update({ contacto_ambito: "internacional", contacto_codigo: "ES", contacto_version: null })
    .eq("id", a);
  assert.ok(error, "la base tiene que rechazarlo");
  assert.match(error!.message, /el_contacto_trae_su_version/);
});

test("declarar sin código no se puede", async () => {
  const a = await unAporte("la cancha está sin luz");
  await assert.rejects(
    () => declararDesdeDonde({ aporteId: a, ambito: "nacional", codigo: "  ", version: "junio 2026" }),
    /código/,
  );
});
