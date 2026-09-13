# Revisión

Qué se revisa, con qué rúbrica, y qué salió en cada corrida.

Cada frente lo mira alguien que solo busca en su dimensión y no sabe qué encontraron los
demás. Cada hallazgo pasa después por un escéptico cuyo trabajo es **refutarlo**: si no
sobrevive, no entra.

**Por qué con rúbrica y no a ojo.** Una revisión sin rúbrica encuentra lo que al revisor le
llamó la atención ese día. La rúbrica es lo que hace que dos corridas sean comparables.

> ➤ Borra las líneas ➤ al llenar.

## Los frentes de revisión

| # | Frente | Rúbrica | Qué busca |
|---|---|---|---|
| 1 | El documento como grafo | `metodo/codigos.md` | Códigos huérfanos, reglas sin caso de verificación, enlaces rotos, afirmaciones sin porqué |
| 2 | Las reglas contra la realidad | La §5 de la especificación | Una regla que la persona no reconocería como suya |
| 3 | Lo que se entiende | Las personas validadoras | Frases que no informan, el dato que vino a buscar y no está |
| 4 |  |  |  |

## Las reglas del juego

**Un hallazgo sin caso concreto no es un hallazgo.** Archivo, línea, y con qué datos falla.
"La navegación es confusa" no es un hallazgo; "desde la pantalla de reservas no hay forma de
volver al listado sin usar el botón del navegador" sí.

**Nada se arregla durante la revisión.** Arreglar mientras se busca sesga lo que se sigue
buscando: después de un arreglo uno mira el código con los ojos de quien acaba de tocarlo.

**Lo ya sabido cuenta como revisado, no como hallazgo.** Lo que está en `vacios.md` no
reaparece. Si reaparece, la revisión se llena de cosas que ya se decidieron y el hallazgo
nuevo se pierde entre ellas.

## Las preguntas que hicieron las personas

> ➤ Una persona que abre la pantalla con su pregunta en la cabeza y no encuentra la respuesta
> no siempre está señalando un defecto: muchas veces está señalando **una regla que falta**.
> Eso no es un hallazgo y no pasa por el escéptico —no hay nada que refutar en una pregunta—.
>
> Van a `vacios.md` §2 como `Q`, o a un pliego con `/preguntar` si hay que preguntárselas a
> alguien de afuera.

| La pregunta | Quién la hizo | Mirando qué | A dónde fue |
|---|---|---|---|
|  |  |  |  |

## Las brechas

> ➤ Lo que estaba abierto antes de esta corrida —las `Q` de `vacios.md` y las preguntas de la
> lectura documental que este frente debía cerrar— con una de tres respuestas por cada una.
>
> **Una brecha que nadie marca se cierra sola en la cabeza de la gente**, y tres frentes
> después nadie se acuerda de que quedó abierta. Marcar "no cubierta" es una respuesta
> perfectamente buena; no marcarla no lo es.

| Qué estaba abierto | Cubierta · No cubierta · Ya no aplica | Dónde se ve, o por qué no |
|---|---|---|
|  |  |  |

**¿Hay que volver a especificar?**

> ➤ Sí o no, y si es sí, **con las reglas que hay que tocar**. La prueba para decidirlo: si el
> arreglo cambia lo que el negocio permite, es especificación; si solo cambia cómo se ve, es
> pantalla.
>
> Volver no es un fracaso de la revisión: es para lo que existe. Y no volver también es una
> respuesta — un frente que se validó sin brechas sigue derecho.

## El plan de arreglo

> ➤ Agrupa los hallazgos en tandas ordenadas por **qué se rompe si no se hace**, no por
> gravedad suelta. Una tanda tiene sentido cuando se puede cerrar entera.

## Corridas

### 1 · <fecha>

> ➤ Cuántos revisores, cuántos frentes, cuántos hallazgos en bruto y cuántos quedaron en pie
> después de los escépticos. Ese cociente dice qué tan bien está calibrada la revisión: si
> nunca se refuta nada, los escépticos no están trabajando.

| Gravedad | Frente | Dónde | Qué | Arreglado |
|---|---|---|---|---|
|  |  |  |  | ☐ |
