# ADR 0002 — Códigos rastreables en vez de historias de usuario

**Alcance:** método · **Estado:** aceptada

## Contexto

El formato estándar para entregarle un requerimiento a un equipo de desarrollo son historias
de usuario con criterios de aceptación. Cualquier equipo las lee sin explicación, y eso vale
mucho.

Pero una historia de usuario **no tiene dónde poner una invariante**. "Como residente quiero
reservar el salón para tener dónde hacer el grado de mi hijo" no puede expresar *"dos
reservas nunca ocupan el mismo espacio al mismo tiempo"*: eso no es de una historia, es de
todas. Lo mismo pasa con los principios y las cualidades transversales.

Lo que ocurre en la práctica es que la invariante se escribe como criterio de aceptación de
una historia cualquiera, se implementa ahí, y la siguiente historia que toca el mismo dato
la vuelve a romper.

## Decisión

Cinco familias con código propio y numeración corrida: `RF` requerimientos, `C` cualidades,
`P` principios, `R` reglas, `I` invariantes. Definidas en `metodo/codigos.md`.

Los códigos del entregable son **los mismos** de la especificación del negocio. Si `R3` en el
módulo no es `R3` en la especificación, se pierde la trazabilidad, que es todo el punto.

## Consecuencias

Hay que enseñarle el formato a quien lo recibe. No es gratis: un equipo acostumbrado a
historias necesita una explicación de diez minutos.

A cambio se puede preguntar "si cambio este principio, ¿qué se rompe?" y tener respuesta. Y
las invariantes quedan escritas donde se ven, con el costo de haberlas roto al lado.

La plantilla de módulo agrega una columna que la especificación no tiene: cada `RF` cita la
regla que lo gobierna. Es lo que impide un requerimiento huérfano — que es el modo de falla
de las historias, veinte funciones sueltas sin regla detrás.
