# Registro — T052 · Tres defectos que solo se vieron en pantalla

**De dónde salen:** un aporte real —el código `49VNG55YQC7R`— y una captura de su ficha.
Ninguno de los tres lo habría encontrado leyendo el código.

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-15 | 4 recorridos nuevos, escritos reproduciendo el fallo primero | `afinar.spec.ts`, `consola.spec.ts` |

## 1 · Un aporte que decía «Tunja» y al que nunca se le preguntó dónde

El relato empezaba con *«Las canchas de tunja boyaca todas estan rotas»*. **No se le preguntó
nada de ubicación**, y el aporte llegó a la bandeja sin municipio.

La causa tenía dos mitades que solas no rompían nada:

1. al encontrar Tunja en el relato se **quitaba «dónde» de las preguntas** —para confirmarlo en
   vez de preguntarlo—;
2. el paso de confirmarlo solo corría **si la lectura traía un lugar**, y la IA no había extraído
   ninguno.

Entre las dos, la ubicación desaparecía del recorrido entero. Con Tunja escrito en la primera
línea.

Arreglado en la condición, y además **con una sola puerta hacia el final**: ningún camino
automático llega al último paso sin haber preguntado el municipio. El fallo no fue un despiste en
un `if`; fue que había dos caminos al final y solo uno miraba la ubicación.

**Salvo cuando la persona dice basta.** «Terminar aquí» termina: `N02` no deja exigir la
ubicación, y un botón que dice terminar y saca una pantalla más es una promesa rota — justo lo
que hace abandonar a quien ya se estaba yendo.

## 2 · Los ejemplos de la consola se leían como el dato

El campo «la afectación, en una frase» salía con **«sin agua en la parte alta desde hace tres
meses»** dentro, sobre un aporte de canchas rotas en Tunja.

Era el `placeholder`. En una pantalla de revisión, un ejemplo que es una frase plausible sobre
otro caso **se lee como el dato de este**: quien revisa deprisa puede creer que eso dice el
aporte. Ahora los ejemplos van debajo del campo, dichos como lo que son.

Hay una prueba que recorre la ficha y falla si algún campo vuelve a llevar un ejemplo dentro.

## 3 · Una vuelta borraba lo que la persona había escrito en la anterior

En ese mismo aporte, la versión vigente de la síntesis **no tenía «techarlas y hacerles
mantenimiento»**, que la persona había escrito.

La síntesis se compone con lo que llega en el formulario, y cada vuelta mandaba solo sus dos
campos: la siguiente la reescribía entera y perdía la anterior. Ahora lo ya contestado viaja con
cada vuelta.

**Esto es lo más grave de los tres**, porque no se nota: el texto está en una versión antigua que
nadie mira, y lo que el revisor lee es lo que la persona *no* acabó de decir.

## Y una cuarta, de lectura

Las tres versiones salían diciendo «confirmada por la persona» —cada vuelta confirma la suya— así
que el revisor no sabía cuál manda. Ahora la última dice **vigente** y las anteriores,
**sustituida por la vN**. Se conservan para poder mostrar qué cambió, no para leerlas como el
dato.

## Lo que esto dice del proceso

Los cuatro pasaron por `tsc`, por 136 recorridos y por el chequeo de datos huérfanos. **Ninguno
falló nada.** Los encontró una persona mirando una pantalla con un aporte real.

Lo que sí ayudó: tener el aporte guardado con su código permitió ir a la base, ver exactamente
qué se había guardado y reproducirlo en una prueba antes de tocar nada. Sin eso habría sido
adivinar.
