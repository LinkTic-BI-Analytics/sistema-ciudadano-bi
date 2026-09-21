// El calendario de la portada: los encuentros repartidos en semanas.
//
// Se prueba con fechas fijas y calculadas a mano, nunca con lo que devuelva la
// función la primera vez (AGENTS.md §7). Los casos son los que se ven mal si
// fallan: un encuentro en sábado, una semana fuera del cronograma, el orden
// de los colores, y la fecha civil de un instante que cae de madrugada en UTC
// pero de noche en Bogotá.

import { test } from "node:test";
import assert from "node:assert/strict";
import { agruparPorSemana, fechaLocal, lunesDe, sumarDias } from "../src/convocatoria/calendario.ts";
import type { Encuentro } from "../src/convocatoria/agenda.ts";

function encuentro(id: string, comienzaEn: string, extra: Partial<Encuentro> = {}): Encuentro {
  return {
    id, titulo: `Encuentro ${id}`, tema: null, modalidad: "presencial", comienzaEn,
    zonaHoraria: "America/Bogota", lugar: id, sala: null, ayudas: null, cupos: null,
    estado: "programado", comenzabaEn: null, motivoCambio: null, ...extra,
  };
}

const CRONOGRAMA = [
  { lunes: "2026-10-05", numero: 1, tema: "Reestructuración" },
  { lunes: "2026-10-12", numero: 2, tema: "Seguridad" },
];

test("un instante de madrugada en UTC es el día anterior en Bogotá", () => {
  // Las 11 de la noche del 5 en Bogotá son las 4 de la madrugada del 6 en UTC.
  // Agrupar por la fecha UTC pondría el encuentro en el día equivocado.
  assert.equal(fechaLocal("2026-10-06T04:00:00Z", "America/Bogota"), "2026-10-05");
});

test("el lunes de cualquier día de la semana es el mismo lunes", () => {
  for (const d of ["2026-10-05", "2026-10-07", "2026-10-11"]) {
    assert.equal(lunesDe(d), "2026-10-05", d);
  }
  assert.equal(sumarDias("2026-10-05", 6), "2026-10-11");
});

test("las semanas del cronograma salen aunque no tengan encuentros, si no han terminado", () => {
  const semanas = agruparPorSemana([], { cronograma: CRONOGRAMA, festivos: {}, hoy: "2026-10-01" });
  assert.deepEqual(semanas.map((s) => [s.lunes, s.numero, s.tema]), [
    ["2026-10-05", 1, "Reestructuración"],
    ["2026-10-12", 2, "Seguridad"],
  ]);
  assert.equal(semanas[0]!.dias.length, 7);
});

test("una semana del plan que ya pasó y quedó vacía no se muestra", () => {
  const semanas = agruparPorSemana([], { cronograma: CRONOGRAMA, festivos: {}, hoy: "2026-10-12" });
  assert.deepEqual(semanas.map((s) => s.numero), [2]);
});

test("los colores de la bandera rotan por día con encuentro, dentro de cada semana", () => {
  // Pereira lunes, Quibdó miércoles, Ibagué viernes: dorado, azul, rojo. Y la
  // semana siguiente vuelve a empezar en dorado.
  const lista = [
    encuentro("pereira", "2026-10-05T14:00:00Z"),
    encuentro("quibdo", "2026-10-07T14:00:00Z"),
    encuentro("ibague", "2026-10-09T14:00:00Z"),
    encuentro("popayan", "2026-10-14T14:00:00Z"),
  ];
  const [s1, s2] = agruparPorSemana(lista, { cronograma: CRONOGRAMA, festivos: {}, hoy: "2026-10-01" });
  const banderas = (s: typeof s1) => s!.dias.filter((d) => d.encuentros.length).map((d) => d.bandera);
  assert.deepEqual(banderas(s1), [1, 2, 3]);
  assert.deepEqual(banderas(s2), [1]);
  // Los días sin encuentro no llevan color.
  assert.equal(s1!.dias[1]!.bandera, null);
});

test("dos encuentros el mismo día comparten el color y se ordenan por hora", () => {
  const lista = [
    encuentro("tarde", "2026-10-05T20:00:00Z"),
    encuentro("manana", "2026-10-05T13:00:00Z"),
  ];
  const [s] = agruparPorSemana(lista, { cronograma: CRONOGRAMA, festivos: {}, hoy: "2026-10-01" });
  const lunes = s!.dias[0]!;
  assert.deepEqual(lunes.encuentros.map((e) => e.id), ["manana", "tarde"]);
  assert.equal(lunes.bandera, 1);
});

test("un encuentro fuera del cronograma crea su propia semana, sin rótulo", () => {
  // Es lo que hace la siembra de los recorridos: fechas relativas que caen
  // donde caigan, incluido un sábado.
  const lista = [encuentro("sabado", "2026-09-26T14:00:00Z")];
  const [s] = agruparPorSemana(lista, { cronograma: CRONOGRAMA, festivos: {}, hoy: "2026-09-21" });
  assert.equal(s!.lunes, "2026-09-21");
  assert.equal(s!.numero, null);
  assert.equal(s!.dias[5]!.encuentros.length, 1, "el sábado tiene su encuentro");
});

test("el festivo cae en su día", () => {
  const [, s2] = agruparPorSemana([], {
    cronograma: CRONOGRAMA, festivos: { "2026-10-12": "Festivo nacional" }, hoy: "2026-10-01",
  });
  assert.equal(s2!.dias[0]!.festivo, "Festivo nacional");
  assert.equal(s2!.dias[1]!.festivo, null);
});
