---
description: Arma un pliego de preguntas para que alguien lo llene solo, y lo procesa cuando vuelve.
argument-hint: [tema] · o el nombre de un pliego que ya volvió
---

Vas a producir un pliego de preguntas, o a procesar uno que volvió lleno.

Lee `plantillas/pliego-de-preguntas.md` (la forma) y `metodo/entrevista.md` (de dónde salen
las preguntas que valen). **Lee la forma de la plantilla, no de tu memoria.**

## Primero: ¿estás armando uno o procesando uno?

Mira `negocio/preguntas/`. Si el archivo del tema existe y tiene respuestas escritas, lo estás
procesando. Si no existe, lo estás armando.

---

## Si lo estás armando

### Di en voz alta que esto es el segundo mejor

Antes de escribir nada: **una entrevista de una hora produce más que tres pliegos.** La
entrevista se encadena —la respuesta de la cuarta pregunta cambia la séptima— y un papel no
hace eso. Si hay forma de conseguir la hora, dilo y no armes el pliego.

Se arma cuando la hora no existe: la persona está en otra entidad, hay que pasar por un
conducto, o son varias personas que saben cada una un pedazo.

### Un pliego por tema, y de ocho preguntas

De dónde salen las preguntas: la §9 de `negocio/lectura-documental.md`, la lista 2 de
`negocio/vacios.md`, y lo que la última respuesta haya destapado.

- **Agrupa por quién puede responder, no por tema del documento.** Un pliego que mezcla
  preguntas de operación con preguntas de auditoría no lo puede contestar nadie solo, y vuelve
  a medias.
- **Ocho como máximo.** Uno de cuarenta no lo contesta nadie.
- **Si una pregunta no tiene dueño**, dilo: no saber a quién preguntarle es un hallazgo, no un
  detalle de logística.

### Escribe el contexto mínimo como si nadie hubiera leído nada

Las diez líneas de esa sección tienen dos lectores: quien responde, y **quien abra una
conversación nueva sobre este tema**. Ese segundo lector es el que la gente olvida.

La prueba: **si hay que explicar algo aparte para que el pliego se entienda, faltó en esas
diez líneas.** Y no vale citar otro archivo del repositorio para taparlo — el pliego se lee
solo, como un módulo del entregable.

### Cada pregunta con su porqué

Una pregunta sin razón visible se contesta con una frase; una con razón se contesta con un
caso. Y las dos últimas van siempre, en todo pliego: **qué salió mal alguna vez**, de donde
salen las invariantes, y **qué nos falta preguntar**.

---

## Si lo estás procesando

### No metas nada a la especificación todavía

Lo que la persona escribió es una respuesta, no una regla. Va donde le corresponde:

- **Un dato que faltaba** → `negocio/vacios.md` §3, o la §11 de la especificación.
- **Una decisión de negocio** → `negocio/vacios.md` lista 1, con dónde queda verificable.
- **Algo que cambia cómo se comporta el negocio** → sube a la §5 de la especificación como
  regla, con su código, y en `vacios.md` queda el rastro de dónde salió.
- **Una contradicción con lo que decía un documento** → **manda la persona**, y se anota que el
  documento decía otra cosa. Nunca al revés.

### Marca lo parcial como parcial

Una respuesta a medias no se cierra por cortesía. Si dice *"unos veinte, no estoy seguro"*,
eso es **parcial**: el dato sirve para dimensionar y no sirve para una regla. Dilo en la tabla
de estado y déjalo abierto.

### Lo que la respuesta destapó va al pliego siguiente

Casi siempre una respuesta abre dos preguntas nuevas. **No las metas en este pliego** — este
ya se contestó y volver a mandarlo cansa a la persona. Van al siguiente, y se anotan al pie
de este para que no se pierdan.

### Cuando una respuesta contradice a otra respuesta

Dos personas dijeron cosas distintas de lo mismo. **No escojas.** Pon las dos frases
textuales lado a lado, con quién dijo cada una y cuándo, y pregunta cuál manda. Suele destapar
que ninguna manda: manda la costumbre.

---

## Qué entregas

**Armando:**

1. `negocio/preguntas/<tema>.md` con su contexto mínimo y ninguna línea `> ➤` adentro.
2. **A quién hay que mandárselo**, por nombre y cargo. Si no lo sabes, dilo.
3. Cuánto se demora, en minutos, calculado de verdad.
4. Y **qué queda bloqueado mientras no vuelva**.

**Procesando:**

1. La tabla de estado al día: qué se cerró, qué quedó parcial, qué sigue abierto.
2. **A dónde subió cada respuesta.** Nunca "se conversó": un archivo o no existe la decisión.
3. Lo que destapó y no estaba previsto.
4. Si con esto ya se puede especificar el tema, dilo. Si falta una sola cosa, di cuál.

## Empezar una conversación nueva desde aquí

Cuando se cierre un tema y se pase al siguiente, **no hay que arrastrar la conversación
anterior**. Basta con `AGENTS.md`, `negocio/` y el pliego del tema nuevo — para eso existe el
contexto mínimo.

Dilo al terminar, en una línea: **con qué se arranca la próxima y qué no hace falta traer.**
