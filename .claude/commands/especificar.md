---
description: Convierte lo descubierto en la especificación con sus cinco familias de códigos.
argument-hint: [todo | nombre de un frente]
---

Vas a escribir la especificación v0 del negocio.

## Antes de escribir

Lee: `plantillas/especificacion.md` (la forma), `metodo/codigos.md` (las cinco familias y el
árbol de decisión), `metodo/frentes.md` (cómo se ordena), `negocio/dominio.md` y
`negocio/notas-de-descubrimiento.md` (el material).

**Lee la forma de la plantilla, no de tu memoria.**

## El orden de escritura es obligatorio

1. **§1 — las N preguntas que responde el sistema.** Es el ancla de todo el documento.
2. **§4 — el glosario**, con la tabla de traducción dominio → pantalla.
3. **§5 — las reglas `R`.** Con fórmula, casos borde y el porqué de cada una.
4. **§6 — las invariantes `I`.** Con el costo cuando la falla ya ocurrió.
5. **§3 — los principios `P`** que sostienen lo anterior.
6. **§2 — las cualidades `C`** y, **de últimas, los requerimientos `RF`.**

**Los requerimientos se derivan de las reglas, no al revés.** Empezar por `RF` produce una
lista de funciones sueltas sin regla detrás — que es exactamente el modo de falla de las
historias de usuario, y la razón por la que no usamos ese formato.

Después: §9 los casos de verificación, §10 los frentes en orden, §11 los datos que faltan.

## Las reglas de escritura

- **Prohibido inventar.** Si un número, un límite o un plazo no salió de la entrevista, va a
  `negocio/vacios.md` §3 como dato que falta. No lo pongas en la especificación con una
  cifra plausible: una cifra plausible es indistinguible de una real y nadie la va a
  cuestionar después.
- Cada `R` cita los `P` y `C` de los que se deriva. Cada `I` dice de dónde sale y, si ya
  ocurrió, **cuánto costó**.
- La §9 se escribe con números **calculados a mano**. Ninguna implementación existe todavía;
  cuando exista, se compara contra estos.
- Toda regla de la §5 necesita al menos un caso en la §9.

## Dos bloqueos

**No termines con la §6 vacía.** Una especificación sin invariantes significa que nadie
preguntó qué no puede pasar nunca. Si no hay ninguna, no inventes: di exactamente qué falta
preguntarle a la persona y para en ese punto.

**Muestra las contradicciones, no las resuelvas.** Si la persona dijo dos cosas
incompatibles en momentos distintos, pon las dos frases textuales lado a lado y pregunta
cuál manda.

## Al terminar

- Propón cuál es la **invariante suprema** —la única cuyo incumplimiento no se puede
  reparar— y explica por qué. **La decisión es del analista, no tuya.**
- Ordena los frentes en la §10, con la invariante suprema en el primero y la regla de
  secuenciación escrita.
- Corre el escribano para que audite el grafo, y arregla lo que reporte.
- Di cuál es el siguiente paso: `/frente 1`.
