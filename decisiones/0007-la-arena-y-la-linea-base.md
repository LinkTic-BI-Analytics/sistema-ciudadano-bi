# ADR 0007 — Dos repositorios: la arena y la línea base

**Alcance:** plantilla · **Estado:** aceptada · **Fecha:** 2026-08-28

## Contexto

`metodo/cosecha.md` dice qué vuelve a la plantilla cuando un negocio termina, y dice cómo:
*"escribe el cambio en la plantilla de Fase 1, no en tu copia"*. Con una sola copia esa frase
no se puede cumplir — la plantilla y la copia son el mismo archivo, y cada ajuste que se
hace mientras se descubre un negocio queda mezclado con el negocio que lo produjo.

El resultado conocido es que la plantilla se muere en su primera versión: lo aprendido se
queda enterrado en una copia que nadie va a volver a abrir.

## Decisión

Dos repositorios, con oficios distintos y ninguno reemplaza al otro:

| Repositorio | Qué es | Qué pasa adentro |
|---|---|---|
| `Req-Fase1` | **La arena.** | Se ensaya con negocios de verdad. Se ensucia a propósito: `negocio/` se llena, se rompen comandos, se descubre que una plantilla no servía |
| `Req-estandar` | **La línea base.** | Solo entra lo que ya se probó en la arena. Es lo que se clona para cada negocio nuevo |

**A la línea base viaja la forma, nunca el contenido** — la misma regla de `cosecha.md`. En
la práctica: `metodo/`, `plantillas/`, `decisiones/`, `.claude/`, `ejemplo/`, `harness/` y los
documentos de la raíz. `negocio/` viaja **vacío**, con su estructura y sus README y nada más.

## Consecuencias

**Lo que se gana.** La cosecha deja de depender de que alguien se acuerde: hay un lugar
donde escribirla y un lugar donde ensuciar. Y la línea base se puede clonar sin revisar qué
quedó adentro del negocio anterior.

**Lo que se pierde.** Un ajuste hay que hacerlo dos veces, o moverlo a mano. No hay `merge`
automático entre los dos, y no debe haberlo: el filtro es el punto. Un `git merge` de la
arena a la línea base arrastraría exactamente lo que esta decisión existe para dejar afuera.

**El riesgo real.** Que la arena avance y la línea base se quede atrás — el mismo modo de
falla que `/entregar` en el ciclo: la parte divertida es usar el método, y escribir lo que
se aprendió se pospone. La contramedida es la misma que ya existe: la pregunta de cosecha se
hace **al cerrar cada módulo**, cuando la respuesta está fresca, no "cuando haya tiempo".

**Lo que no decide este ADR.** `negocio/notas-de-descubrimiento.md` e `insumos/` llevan datos
de personas reales. No es que no viajen por ser contenido: es que **no pueden viajar**. El
`.gitignore` trae las dos líneas listas para activarlas.
