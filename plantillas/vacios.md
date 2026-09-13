# Vacíos

Lo que hubo que decidir construyendo y la especificación no responde — porque no le
corresponde. La especificación dice qué se mide y con qué reglas; construir obliga a
decidir cosas que ninguna entrevista destapa, porque nadie sabe que son preguntas hasta
que hay que resolverlas para poder seguir.

**Este archivo es la prueba de que el método sirve.** Si al terminar un frente está vacío,
o no se construyó nada o no se anotó lo que se decidió.

> ➤ Se actualiza al cerrar cada frente, junto con la bitácora. Borra las líneas ➤.
>
> ➤ Cada entrada dice entre corchetes **qué forma de pregunta la produjo**, del catálogo de
> [`metodo/lo-que-destapa-construir.md`](../metodo/lo-que-destapa-construir.md). Ver
> `ejemplo/vacios.md` para cómo se ve lleno.

---

## 1 · Decidido

> ➤ Se numeran con **`V`** de vacío, no con `D` de decidido: el catálogo de formas de
> pregunta ya tiene una familia `D` —las cuentas— y sus formas `[D1]` a `[D4]` aparecen en
> esta misma tabla. Dos cosas distintas con el mismo código convierten en mentira todo lo
> que las citaba, y aquí ya pasó: alguien citó "el vacío D3" queriendo decir la fila 23.
>
> ➤ La columna **Dónde** apunta a un artefacto verificable: un archivo, una función, un ADR,
> una pantalla. Nunca "se conversó" ni "quedó acordado". Si no hay dónde, la decisión no
> existe todavía.

| # | Vacío que había | Qué se decidió | Dónde |
|---|---|---|---|
| V1 |  |  |  |

### Reglas donde dos se tocaban

> ➤ Cuando el vacío es un conflicto entre dos reglas que ninguna nombra, la última columna
> cambia: no importa dónde quedó, importa **por qué** se resolvió así.

| # | Las dos reglas | Qué se decidió | Por qué |
|---|---|---|---|
|  |  |  |  |

---

## 2 · Por decidir

> ➤ Se numeran con **`Q`** de pregunta, no con `P`: `P` ya son los principios de la
> especificación, y dos cosas distintas con el mismo código convierten en mentira todo lo
> que las citaba.

> ➤ La recomendación **siempre dice cuándo se vuelve urgente**. Una recomendación sin
> momento no se ejecuta nunca: se queda en la lista y en seis meses ya era tarde.

| # | La pregunta | Qué bloquea | Recomendación |
|---|---|---|---|
| Q1 |  |  | <Qué haría, y **antes de cuándo**.> |

> ➤ Cuando una de estas se cierra, se mueve a la lista 1 anotando cuál cerraba:
> *"(cerraba **Q3**)"*. Así se puede rastrear una decisión hasta la pregunta que la originó.

---

## 3 · Datos que faltan

> ➤ No son decisiones: son cifras, catálogos o documentos sin cargar. Sin ellos hay reglas
> que no tienen con qué correr.

| Qué falta | Qué desbloquea | A quién se le pide |
|---|---|---|
|  |  |  |

---

## Cuando una entrada resulta falsa

> ➤ No se borra: se reescribe diciendo que era falsa y por qué. Un registro que se corrige a
> sí mismo es el que se sigue leyendo; uno que solo acumula aciertos, nadie lo cree.
>
> Ejemplo: *"V21 — El ADR 0011 afirmaba que el dinero cruza como `string`. **Es falso**: cruza
> como número y se pierde precisión por encima de…"*
