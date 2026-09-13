# Preguntas — <tema>

> ➤ **Qué es esto y cuándo se usa.**
>
> Un pliego de preguntas es la entrevista cuando no se puede tener a la persona en una hora
> seguida: se le manda escrito, lo llena sola, y vuelve. Lo produce y lo lee `/preguntar`.
>
> **Es un segundo mejor y hay que decirlo.** La entrevista funciona porque se encadena: la
> respuesta de la pregunta cuatro cambia la pregunta siete, y eso un papel no lo hace. Un
> pliego cierra los datos que faltan; no descubre lo que nadie sabía que era una pregunta.
> Si hay forma de conseguir la hora, se consigue la hora — ver `metodo/entrevista.md`.
>
> **Sirve para tres cosas, y la tercera es la que no se ve venir:**
>
> 1. Cerrar preguntas cuando la persona no está disponible en vivo.
> 2. Dejar por escrito quién respondió qué y cuándo, que en un proyecto con varias entidades
>    es la mitad del trabajo.
> 3. **Ser el punto de partida de una conversación nueva.** La sección "El contexto mínimo"
>    está escrita para que alguien —una persona o un modelo que abre este repositorio de
>    cero— sepa dónde está parado sin leer todo lo anterior. Cuando se cierra un tema y se
>    pasa al siguiente, se arranca de un pliego nuevo y no se arrastra lo demás.
>
> Uno por tema o por módulo, no uno solo con todo. Un pliego de cuarenta preguntas no lo
> contesta nadie; uno de ocho, sí.
>
> Vive en `negocio/preguntas/<tema>.md`. Borra las líneas ➤ al llenar.

**Para:** <nombre y cargo de quien puede responder. Si no se sabe quién, eso ya es un problema>
**De:** <quién pregunta>
**Fecha en que se manda:**
**Fecha en que volvió:**

---

## Para quien responde

> ➤ Estas cinco líneas se escriben pensando en alguien que no tiene por qué saber nada de
> nosotros ni del método. Sin ellas, la gente contesta lo que cree que uno quiere oír.

Esto no es un formulario de aprobación ni un documento que lo comprometa a nada. Son las
preguntas que nos faltan para poder construir bien, y las escribimos así porque no quisimos
inventarnos las respuestas.

Tres cosas que ayudan más de lo que parece:

- **Si no sabe, escriba "no sé".** Es la respuesta más útil de todas: nos dice a quién hay
  que preguntarle.
- **No redondee.** Si son "como veinte al día, pero el lunes son cien", escriba eso, no
  escriba veinte.
- **Si algo no es como está escrito, dígalo.** Lo que sacamos de los documentos puede estar
  viejo o puede no haber sido cierto nunca.

Se demora entre <n> y <n> minutos. Puede escribir en cualquier orden.

---

## El contexto mínimo

> ➤ **Diez líneas, no más.** De qué se trata el negocio, en qué punto va el descubrimiento, y
> qué se está tratando de cerrar con este pliego.
>
> Esta sección tiene dos lectores y hay que escribirla para los dos: la persona que va a
> responder, y **quien abra una conversación nueva sobre este tema.** Si un modelo lee solo
> esto y el pliego, tiene que poder trabajar sin leer nada más del repositorio.
>
> Prueba: si hay que explicar algo aparte para que alguien entienda el pliego, faltó en estas
> diez líneas.

---

## Lo que ya sabemos, para no volver a preguntarlo

> ➤ Lo que ya está cerrado sobre este tema, **con de dónde salió**. Sirve para dos cosas: que
> la persona no repita lo que ya dijo alguien, y que pueda corregirlo si está mal.
>
> Marca de dónde vino cada cosa: un documento y su sección, una respuesta anterior con su
> fecha y su autor, o **"lo dedujimos nosotros"** — esa última columna es la que hace que la
> gente corrija, porque una deducción se ve como lo que es.

| Lo que damos por sabido | De dónde salió | ¿Está bien? |
|---|---|---|
|  |  | *(deje en blanco si sí; escriba aquí si no)* |

---

## Las preguntas

> ➤ Numeradas con `P` de pliego y el tema adelante si hace falta. **Ocho como máximo.** Cada
> una con su porqué: una pregunta sin razón visible se contesta con una frase corta, y una
> con razón se contesta con un caso.
>
> El orden importa, y va así: **una fácil para arrancar, después las que piden acordarse de
> algo, y de últimas las de opinión.**
>
> Lo primero que se cansa es la memoria. Un *"cuénteme el último día que hizo esto"* en la
> pregunta siete sale en tres renglones; el mismo, en la dos, sale con los rodeos y las
> excepciones — que es para lo que se preguntó. Las de opinión y las de "qué haría usted si"
> aguantan el cansancio: se contestan con lo que la persona ya piensa, no con lo que tiene
> que reconstruir.

### P1 · <la pregunta, en las palabras de la persona, no en las nuestras>

**Por qué la preguntamos.** <Una o dos frases. Qué se decide con esto.>

**Qué pasa si no se responde.** <Qué queda bloqueado, concreto.>

**Respuesta:**

>

---

> ➤ Repite el bloque por pregunta. Y de últimas, siempre, estas dos:

### P_ · ¿Alguna vez esto salió mal? ¿Qué pasó, cuánto costó y cómo se enteraron?

> ➤ **Esta va en todo pliego, sin excepción.** Las invariantes salen de aquí y no de
> preguntar por invariantes. Nadie contesta *"la invariante es que no se paguen dos veces"*;
> la gente cuenta *"una vez se le pagó dos veces al mismo y tocó ir a recuperarlo"*.

**Respuesta:**

>

### P_ · ¿Qué le preguntaría usted a alguien que va a construir esto, y que nosotros no le preguntamos?

> ➤ Es la que destapa lo que no sabíamos que era una pregunta. Cuesta una línea y a veces
> vale más que las otras siete.

**Respuesta:**

>

---

## Si le sobra tiempo

> ➤ Opcional y de verdad opcional: quien responde ya hizo lo que se le pidió. Se ofrece
> porque a veces la persona sabe más de lo que cabe en ocho preguntas y tiene ganas de
> contarlo.
>
> Dos formas de darle salida, y las dos sirven:
>
> - **Cuénteme un día.** *"Cuénteme el último día que hizo esto, desde que llegó hasta que
>   se fue"*. Es lo que más produce por minuto invertido en todo el método.
> - **Escriba usted el pedazo que conoce.** Si la persona tiene con qué describir un módulo
>   —qué hace, quién lo usa, qué no puede pasar— que lo escriba en sus palabras. No importa
>   la forma; nosotros le damos forma después. **Lo que no se puede es que se lo inventemos
>   nosotros.**

---

## Estado

> ➤ **Esta sección la llena el método, no la persona.** Es lo que permite que una conversación
> nueva sepa en qué va este tema sin leer la conversación anterior.
>
> Se actualiza cada vez que vuelve el pliego. Una pregunta contestada a medias se marca
> **parcial** y se dice qué falta — no se marca cerrada por cortesía.

| # | Pregunta | Estado | Qué se hizo con la respuesta |
|---|---|---|---|
| P1 |  | abierta · parcial · cerrada | *(a dónde subió: `vacios.md`, `dominio.md`, una `R` de la especificación…)* |

**Lo que sigue abierto y a quién hay que pedírselo:**

**Lo que esta respuesta destapó y no estaba previsto:**

> ➤ Casi siempre hay algo. Una respuesta abre dos preguntas nuevas, y esas van al pliego
> siguiente — no a este.
