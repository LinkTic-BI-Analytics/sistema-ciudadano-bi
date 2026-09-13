# ADR 0004 — Un negocio, un repositorio

**Alcance:** método · **Estado:** aceptada

## Contexto

Es tentador descubrir dos productos relacionados en la misma copia de la plantilla —dos
módulos de la misma empresa, dos versiones de la misma idea— para no repetir el arranque.

## Decisión

Un negocio por copia de la plantilla. No se descubren dos en el mismo repositorio.

## Consecuencias

La razón es la numeración. Los códigos son corridos y para siempre: con dos dominios en el
mismo `especificacion.md`, `R7` significa dos cosas y ninguna referencia cruzada sirve.
Y el glosario se vuelve imposible — la misma palabra significa algo distinto según de qué
producto se hable, que es exactamente lo que las palabras prohibidas existen para evitar.

El costo es repetir el arranque: copiar la plantilla otra vez y volver a hacer la entrevista.
Es barato comparado con un grafo que no se puede navegar.

Si los dos productos comparten reglas de verdad, eso es una señal de que son uno solo con
dos frentes, no dos negocios.
