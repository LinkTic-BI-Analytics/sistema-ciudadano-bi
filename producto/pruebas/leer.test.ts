// Leer de la base sin perder filas por el camino.
//
// Estas pruebas existen por un defecto que no falló nunca: con 788 aportes, la
// consulta de ubicaciones de la bandeja armaba una URL de ~30 KB, la respuesta
// era `400`, el error se descartaba y la pantalla salía como si ningún aporte
// tuviera municipio. Los desplegables de departamento y municipio quedaban con
// «Todos» y nada más, y nada en el registro decía por qué.
//
// No hablan con la base a propósito: lo que se prueba es **cuántas peticiones
// se hacen y con cuántos códigos cada una**, que es donde estaba el defecto.

import { test } from "node:test";
import assert from "node:assert/strict";
import { todas, porLotes } from "../src/datos/leer.ts";

test("pide páginas hasta que una viene a medias", async () => {
  // 2.350 filas: dos páginas llenas y una corta. PostgREST corta en 1.000 y
  // devuelve `200`, así que quedarse con la primera respuesta es perder 1.350
  // filas sin que nada avise.
  const rangos: [number, number][] = [];
  const filas = await todas<number>("la prueba", (desde, hasta) => {
    rangos.push([desde, hasta]);
    const hay = Math.max(0, Math.min(hasta + 1, 2350) - desde);
    return Promise.resolve({ data: Array.from({ length: hay }, (_, i) => desde + i), error: null });
  });

  assert.equal(filas.length, 2350, "tienen que venir todas, no las primeras mil");
  assert.deepEqual(rangos, [[0, 999], [1000, 1999], [2000, 2999]]);
});

test("una página justo llena se vuelve a pedir, y la siguiente vacía cierra", async () => {
  // 1.000 exactas es el caso que engaña: parece completa y puede no serlo.
  let vueltas = 0;
  const filas = await todas<number>("la prueba", (desde) => {
    vueltas++;
    const hay = desde === 0 ? 1000 : 0;
    return Promise.resolve({ data: Array.from({ length: hay }, (_, i) => i), error: null });
  });

  assert.equal(filas.length, 1000);
  assert.equal(vueltas, 2, "con la página llena hay que preguntar si había más");
});

test("el error se lanza, no se descarta", async () => {
  // Descartarlo es lo que convirtió una consulta rota en una pantalla que
  // afirmaba que ningún aporte tenía municipio.
  await assert.rejects(
    () => todas("las ubicaciones", () =>
      Promise.resolve({ data: null, error: { message: "URI Too Long" } })),
    /no se pudo leer las ubicaciones: URI Too Long/,
  );
});

test("ningún lote lleva más de 100 códigos", async () => {
  // 788 es lo que había en la base el día que se encontró el defecto. Medido
  // contra esa base: 300 códigos en un `.in(...)` pasan, 500 ya no.
  const ids = Array.from({ length: 788 }, (_, i) => `id-${i}`);
  const tamaños: number[] = [];

  const filas = await porLotes<string>("los vínculos", ids, (lote) => {
    tamaños.push(lote.length);
    return Promise.resolve({ data: lote, error: null });
  });

  assert.equal(tamaños.length, 8, "788 códigos son ocho lotes");
  assert.ok(Math.max(...tamaños) <= 100, `un lote se fue a ${Math.max(...tamaños)} códigos`);
  assert.equal(filas.length, 788, "no se pierde ninguno al partir la lista");
  assert.deepEqual([...new Set(filas)].length, 788, "ni se repite ninguno");
});

test("un lote con más de mil filas también se lee por páginas", async () => {
  // Un aporte puede tener varias síntesis: 100 aportes pasan de 1.000 filas sin
  // que nadie lo espere.
  const ids = Array.from({ length: 100 }, (_, i) => `id-${i}`);
  const filas = await porLotes<number>("las síntesis", ids, (lote, desde, hasta) => {
    assert.equal(lote.length, 100);
    const hay = Math.max(0, Math.min(hasta + 1, 1200) - desde);
    return Promise.resolve({ data: Array.from({ length: hay }, (_, i) => desde + i), error: null });
  });

  assert.equal(filas.length, 1200);
});

test("sin códigos no se pregunta nada", async () => {
  // La bandeja pide las remisiones de los expedientes que encontró. Si no
  // encontró ninguno, un `.in(...)` vacío es una petición que sobra.
  let vueltas = 0;
  const filas = await porLotes<string>("las remisiones", [], () => {
    vueltas++;
    return Promise.resolve({ data: [], error: null });
  });

  assert.equal(vueltas, 0);
  assert.deepEqual(filas, []);
});
