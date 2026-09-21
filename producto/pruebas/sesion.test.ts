// El acceso a la zona interna: un token compartido, y una sesión en dos JWT.
//
// Esto no toca la base. Prueba lo que hace que un `curl` no entre: la firma, el
// vencimiento, que un token de renovación no sirva como token de acceso, que
// cambiar el ACCESS_TOKEN cierre las sesiones abiertas, y que el «siguiente» del
// login no mande a nadie fuera del sitio.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  firmar, verificar, mismoToken, destinoSeguro, esPrivada,
  DURACION_ACCESO, DURACION_RENOVACION,
} from "../src/acceso/sesion.ts";

const claves = { secreto: "s".repeat(40), token: "token-de-prueba" };
const ahora = Date.UTC(2026, 8, 21, 15, 0, 0);

test("un token de acceso recién firmado se acepta", async () => {
  const jwt = await firmar("acceso", claves, ahora);
  assert.equal(jwt.split(".").length, 3);
  assert.equal(await verificar(jwt, "acceso", claves, ahora), true);
});

test("el token de acceso vence a los quince minutos, y ni un segundo después", async () => {
  assert.equal(DURACION_ACCESO, 15 * 60);
  const jwt = await firmar("acceso", claves, ahora);
  assert.equal(await verificar(jwt, "acceso", claves, ahora + (15 * 60 - 1) * 1000), true);
  assert.equal(await verificar(jwt, "acceso", claves, ahora + 15 * 60 * 1000), false);
});

test("el de renovación dura ocho horas", async () => {
  assert.equal(DURACION_RENOVACION, 8 * 60 * 60);
  const jwt = await firmar("renovacion", claves, ahora);
  assert.equal(await verificar(jwt, "renovacion", claves, ahora + 7 * 3600 * 1000), true);
  assert.equal(await verificar(jwt, "renovacion", claves, ahora + 8 * 3600 * 1000), false);
});

test("un token de renovación no sirve como token de acceso, ni al revés", async () => {
  const renovacion = await firmar("renovacion", claves, ahora);
  const acceso = await firmar("acceso", claves, ahora);
  assert.equal(await verificar(renovacion, "acceso", claves, ahora), false);
  assert.equal(await verificar(acceso, "renovacion", claves, ahora), false);
});

test("otra firma, otra carga o `alg: none` no pasan", async () => {
  const jwt = await firmar("acceso", claves, ahora);
  const [cab, carga, firma] = jwt.split(".") as [string, string, string];

  // Firmado con otro secreto.
  const ajeno = await firmar("acceso", { ...claves, secreto: "x".repeat(40) }, ahora);
  assert.equal(await verificar(ajeno, "acceso", claves, ahora), false);

  // La carga cambiada a mano: más tiempo de vida con la firma vieja.
  const datos = JSON.parse(Buffer.from(carga, "base64url").toString());
  const alargada = Buffer.from(JSON.stringify({ ...datos, exp: datos.exp + 86_400 })).toString("base64url");
  assert.equal(await verificar(`${cab}.${alargada}.${firma}`, "acceso", claves, ahora), false);

  // Sin firma.
  const none = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  assert.equal(await verificar(`${none}.${carga}.`, "acceso", claves, ahora), false);

  // Basura.
  for (const malo of ["", "a.b", "a.b.c", "...", `${cab}.${carga}`]) {
    assert.equal(await verificar(malo, "acceso", claves, ahora), false, malo);
  }
});

test("cambiar el ACCESS_TOKEN cierra las sesiones que ya estaban abiertas", async () => {
  // Es lo que se hace cuando el token se filtra: si las sesiones abiertas con
  // el viejo siguieran vivas, rotarlo no serviría durante ocho horas.
  const renovacion = await firmar("renovacion", claves, ahora);
  const rotado = { ...claves, token: "token-nuevo" };
  assert.equal(await verificar(renovacion, "renovacion", rotado, ahora), false);
});

test("el token se compara entero, y vacío nunca entra", async () => {
  assert.equal(await mismoToken("token-de-prueba", "token-de-prueba"), true);
  assert.equal(await mismoToken("token-de-prueb", "token-de-prueba"), false);
  assert.equal(await mismoToken("token-de-prueba ", "token-de-prueba"), false);
  assert.equal(await mismoToken("", "token-de-prueba"), false);
  assert.equal(await mismoToken("", ""), false);
});

test("después de ingresar solo se vuelve a una ruta privada de este sitio", () => {
  assert.equal(destinoSeguro("/consola?ubicacion=todos&q=agua"), "/consola?ubicacion=todos&q=agua");
  assert.equal(destinoSeguro("/administracion?seccion=materiales"), "/administracion?seccion=materiales");
  assert.equal(destinoSeguro("/consola/1b2c3d"), "/consola/1b2c3d");
  // Todo lo demás cae en la consola: un «siguiente» es una invitación abierta
  // a mandar a alguien a otro sitio justo después de que puso el token.
  for (const malo of [
    null, undefined, "", "https://otro.sitio/consola", "//otro.sitio/consola", "/\\otro.sitio",
    "/consolas", "/participar", "javascript:alert(1)", "consola",
  ]) {
    assert.equal(destinoSeguro(malo), "/consola", String(malo));
  }
});

test("las rutas privadas son la consola y la administración, con todo lo que cuelga", () => {
  for (const r of ["/consola", "/consola/abc", "/consola/audio/abc", "/administracion",
    "/administracion/pieza/X/afiche.png"]) assert.equal(esPrivada(r), true, r);
  for (const r of ["/", "/participar", "/mis-aportes", "/ingresar", "/consolas", "/e/abc"]) {
    assert.equal(esPrivada(r), false, r);
  }
});
