// La carga de prueba. **Vive en la arena y no baja a la línea base.**
//
// Existe para contestar una pregunta que no se puede contestar con cuatro
// módulos: ¿esta pantalla sigue sirviendo con cincuenta? Los nombres son de
// mentira; lo que importa es la forma — cuántos módulos, en qué estados, con
// cuántas cosas adentro cada uno.
//
// Las proporciones no son inventadas: salen de cómo va este proyecto de verdad
// —dos de cuatro frentes tocados, ninguno validado, casi todo lo que falta
// esperando un número— y se proyectan a cincuenta.

import type { Modulo } from "@/harness/modulos";

const areas = [
  "Portada", "Publicación", "Votos", "Conversación", "Correo",
  "Curaduría", "Perfiles", "Búsqueda", "Colecciones", "Medición",
];

const acciones = [
  "Ver la lista del día sin identificarse",
  "Publicar una dirección y que se reconozca si ya está",
  "Votar y que quede el origen del voto",
  "Comentar y responder una vez",
  "Recorrer la cadena de quién avaló a quién",
  "Aprobar o rechazar una postulación",
  "Filtrar por día y ver los de ayer",
  "Entrar como cualquiera de las personas sembradas",
  "Ver de dónde llegó cada voto de un producto",
  "Marcar que el producto lo hizo quien lo publicó",
];

const faltas = [
  { que: "El tope por persona", porque: "espera un número que nadie ha decidido", dato: true },
  { que: "El descarte de ráfagas", porque: "espera cuántos votos y en cuánto tiempo", dato: true },
  { que: "El ranking", porque: "queda fuera de alcance al arrancar" },
  { que: "Borrar o editar", porque: "sin decidir", dato: true },
  { que: "Notificar por correo", porque: "es el frente siguiente" },
  { que: "Historial de cambios", porque: "no se preguntó todavía", dato: true },
];

// Cómo se reparten cincuenta: pocos cerrados, un tercio a medias, el resto
// por venir. Es la forma que tiene un proyecto de verdad a media construcción.
function estadoDe(i: number): Modulo["estado"] {
  if (i % 7 === 0) return "construido";
  if (i % 3 === 0) return "a medias";
  return "pendiente";
}

export const modulosDePrueba: Modulo[] = Array.from({ length: 50 }, (_, i) => {
  const estado = estadoDe(i);
  const area = areas[i % areas.length];
  const cuantasPuede = estado === "pendiente" ? 0 : 2 + (i % 3);
  const cuantasFaltan = estado === "pendiente" ? 0 : 2 + (i % 3);

  return {
    nombre: `${area} · módulo ${i + 1}`,
    queHace:
      `Lo que hace el módulo ${i + 1} del área de ${area.toLowerCase()}, dicho en dos ` +
      "líneas y en las palabras del negocio para que se entienda sin saber cómo está hecho.",
    estado,
    yaSePuede: Array.from({ length: cuantasPuede }, (_, k) => acciones[(i + k) % acciones.length]),
    noEntra: Array.from({ length: cuantasFaltan }, (_, k) => faltas[(i + k) % faltas.length]),
    comprobado: estado === "pendiente" ? undefined : { cerrados: 2 + (i % 4), total: 6 },
    pantallas: estado === "pendiente" ? [] : [{ nombre: `Pantalla ${i + 1}`, href: "/" }],
    espera: estado === "pendiente" && i % 2 === 0
      ? "Un número o un criterio que alguien tiene que decidir."
      : undefined,
  };
});
