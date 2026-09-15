# Registro — T045 · El contexto no se vuelve a pedir

**Autoridad:** el negocio — *«al pasar al segundo solo queda el problema pero alguna información
de contexto que le puede pegar a 2 problemas se elimina»* · `I2` · `GEO-01`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-14 | 24 recorridos; 2 nuevos sobre el contexto entre aportes | `afinar.spec.ts` |

## Lo que se perdía

Quien cuenta dos cosas vive en el mismo sitio, le pasan a la misma gente y suelen venir de la
misma época. Al pasar al segundo problema se le preguntaba **todo otra vez desde cero**.

Eso es lo que hace abandonar en el segundo — y entonces la segunda necesidad se pierde, que es
justo lo que partir en dos venía a evitar.

Ahora, al pasar, se lleva lo que ya contó: municipio, lugar con sus palabras, a quiénes, desde
cuándo y el grupo por el que habla. Al llegar, se le enseña: *«¿Esto también es así?»*.

## Se propone, no se hereda

**Aceptarlo es un acto suyo, no un cálculo nuestro.** `I2` prohíbe inferir la ubicación, y dar
por hecho que el segundo problema ocurre donde el primero sería exactamente eso: alguien puede
contar lo del agua de su casa y lo de la vía del colegio de sus hijos, que está en otro
municipio.

Si dice que sí, la ubicación queda con un motivo que lo dice: *«la persona confirmó que ocurre en
el mismo municipio que su aporte anterior»*. Si dice que no, se le pregunta como si fuera la
primera vez.

Y lo que **sí** se le sigue preguntando es lo propio de cada problema: qué debería cambiar y qué
solución se le ocurre. Eso no se hereda porque no es lo mismo.

El contexto viaja por el navegador, nunca por la dirección ni por el servidor: son datos de su
aporte y no tienen por qué pasar por ningún registro intermedio.

## Tres errores míos por el camino

**El sujeto recortado.** La regla de «fragmento mínimo» que añadí ayer se llevaba también el
sujeto: *«el internet no sirve ni para comunicarnos»* salía como *«no sirve ni para
comunicarnos»*. Ahora la instrucción lo dice explícito y manda dejar más ante la duda.

**El doble montaje.** `tomarContexto()` borra la llave al leerla, y React monta dos veces en
desarrollo: la segunda lectura devolvía vacío y pisaba la primera. **El contexto desaparecía sin
que nada fallara** — el paso simplemente no salía.

**Las vueltas que se movían.** Al guardar lo que la persona escribía, esas partes dejaban de
faltar y el reparto de preguntas se recalculaba **a mitad del recorrido**: el «paso 3 de 5»
pasaba a no existir. Ahora se fija al llegar la lectura y solo se rehace cuando de verdad cambia
lo que hay que preguntar.

Los tres los encontraron pruebas, no una lectura del código.

## Lo que queda abierto

**No está medido** cuánta gente cuenta más de una cosa, ni cuántas llegan al segundo aporte. Es
lo primero que diría si este flujo sirve o solo lo parece.
