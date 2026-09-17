// La pieza gráfica de un encuentro (`PIE-01` … `PIE-04`).
//
// Lo que se vigila es lo que el requisito prohíbe: inventar datos que falten,
// invitar a un encuentro cancelado, y convertir un dato ausente en una
// negativa.

import { test } from "node:test";
import assert from "node:assert/strict";
import { piezaSVG, porQueNo, FORMATOS, type DatosPieza, type Formato } from "../src/convocatoria/pieza.ts";

const base: DatosPieza = {
  convocatoria: "Escucha para el Plan Nacional de Desarrollo",
  titulo: "Mesa sobre el agua en la zona rural",
  tema: "Vivienda, Ciudad y Territorio",
  comienzaEn: "2026-10-20T14:00:00.000Z",
  zonaHoraria: "America/Bogota",
  modalidad: "presencial",
  lugar: "Caseta comunal de la vereda El Salado",
  ayudas: "Hay interpretación en lengua de señas y transporte desde la cabecera",
  cupos: 40,
  estado: "programado",
  enlaceId: "ABC23XYZ",
  base: "https://participa.ejemplo",
};

test("la pieza lleva lo que PIE-02 obliga, siempre", async () => {
  const svg = await piezaSVG(base, "afiche");
  for (const debe of [
    "Mesa sobre el agua",                 // el encuentro
    "20 de octubre de 2026",              // la fecha entera, sin abreviar
    "hora de Bogota",                     // con su zona horaria
    "Caseta comunal",                     // dónde
    "participa.ejemplo/e/ABC23XYZ",       // la dirección legible
    "sin asistir",                        // se puede aportar sin ir
    "no es un compromiso de obra",        // el límite
  ]) {
    assert.ok(svg.includes(debe), `a la pieza le falta «${debe}»`);
  }
  // Y el QR dentro, no un enlace a un servicio que lo dibuje.
  assert.match(svg, /<svg[^>]*viewBox="0 0 \d+ \d+"[^>]*>/);
});

test("lo que no se dijo NO se rellena", async () => {
  // Escribir «sin transporte» donde nadie decidió que no lo hubiera convierte
  // un dato que falta en una negativa, y alguien deja de ir por eso.
  const svg = await piezaSVG({ ...base, ayudas: null, cupos: null, tema: null }, "afiche");
  assert.ok(!/sin ayudas|sin transporte|no hay cupos|sin tema/i.test(svg),
    "la pieza está inventando una negativa donde solo falta un dato");
});

test("un encuentro cancelado NO produce pieza", async () => {
  const motivo = porQueNo({ ...base, estado: "cancelado" });
  assert.match(motivo!, /cancelado/);
  await assert.rejects(() => piezaSVG({ ...base, estado: "cancelado" }, "afiche"), /cancelado/);
});

test("un presencial sin lugar tampoco: un afiche sin dónde no sirve para ir", async () => {
  assert.match(porQueNo({ ...base, lugar: null })!, /lugar/);
  // Pero uno virtual sí, porque su «dónde» es la sala.
  assert.equal(porQueNo({ ...base, modalidad: "virtual", lugar: null }), null);
});

test("los cuatro formatos salen con su proporción", async () => {
  for (const f of Object.keys(FORMATOS) as Formato[]) {
    const svg = await piezaSVG(base, f);
    const { ancho, alto } = FORMATOS[f];
    assert.ok(svg.includes(`width="${ancho}" height="${alto}"`), `${f} salió con otro tamaño`);
  }
});

test("con imagen de fondo, el texto se sigue leyendo", async () => {
  // `PIE-03`: con una imagen que impida el contraste, la pieza se genera **con**
  // la capa que lo restituye, no sin ella.
  const svg = await piezaSVG({ ...base, imagen: "data:image/png;base64,iVBORw0KGgo=" }, "publicacion");
  assert.match(svg, /<image href="data:image\/png/);
  assert.match(svg, /opacity="0\.7\d"/, "falta la capa que restituye el contraste");
});

test("el texto que viene de la base no puede romper el SVG", async () => {
  const svg = await piezaSVG({ ...base, titulo: 'Mesa <script>alert("x")</script> & agua' }, "afiche");
  assert.ok(!svg.includes("<script>"), "un título con etiquetas rompería la pieza o algo peor");
  assert.ok(svg.includes("&amp;"));
});
