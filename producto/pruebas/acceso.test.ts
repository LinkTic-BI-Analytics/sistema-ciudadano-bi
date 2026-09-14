// Negar por defecto: ¿la llave que llega al navegador puede leer algo?
//
// Esto no prueba la política de `T032` —que está bloqueada por `P4` y `Q18`—.
// Prueba lo contrario: que **mientras no haya política, no se vea nada**. Es el
// estado correcto, y es el que se rompe solo si alguien agrega una tabla y se
// olvida de encender el acceso a nivel de fila.
//
// `AGENTS.md` §10: *ocultar un botón no sustituye un permiso de servidor*. Y
// `SEG-01`: los permisos aplican **también por URL directa** — que es
// exactamente lo que hace esta prueba, ir por la puerta de atrás.

import { test } from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publica = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const navegador = createClient(url, publica, { auth: { persistSession: false } });

const TABLAS = [
  "proceso", "territorio", "aporte", "sintesis", "ubicacion",
  "expediente", "vinculo_aporte_expediente", "auditoria", "corte",
];

for (const tabla of TABLAS) {
  test(`la llave del navegador no lee participacion.${tabla}`, async () => {
    const { data, error } = await navegador.schema("participacion").from(tabla).select("*").limit(1);
    // Dos formas de estar bien: que lo niegue, o que devuelva vacío porque no
    // hay política que permita nada. Lo que NO puede pasar es que traiga filas.
    assert.ok(error !== null || (data?.length ?? 0) === 0,
      `${tabla} devolvió ${data?.length} filas a una llave pública`);
  });
}

test("el esquema identidad no es alcanzable por la API, ni con la llave del servidor", async () => {
  const servidor = createClient(url, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } });
  const { error } = await servidor.schema("identidad").from("comprobante").select("*").limit(1);
  assert.ok(error !== null, "identidad no se expone: se escribe por función, no por REST");
});
