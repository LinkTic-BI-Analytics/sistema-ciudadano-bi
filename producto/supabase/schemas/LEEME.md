# Por qué esta carpeta está vacía

El esquema de la base es **declarativo** y es la fuente de verdad: los archivos `.sql` de
aquí se concatenan con `../scripts/esquema.sh` para generar la migración. Nunca se toca el
esquema por un panel de administración — un cambio que no está en un archivo es un cambio
que el siguiente entorno no tiene.

**Está vacía porque todavía no se puede escribir la primera tabla.** No es que falte
trabajo: es que falta una decisión, y `AGENTS.md` §9 lo deja escrito para que nadie lo haga
por descuido.

## Qué falta, exactamente

La pregunta es **si un aporte retirado se borra o se apaga** — `[B2]` en
`negocio/preguntas/decisiones-que-bloquean-la-construccion.md`, pregunta P3.

De esa respuesta sale si el modelo es append-only con lápidas o admite borrado físico, y eso
**toca las diez tablas**. `vacios.md` la marca como «la que bloquea todo lo demás», y tiene
razón: escribir migraciones antes de esa respuesta es garantizar reescribirlas.

Hay otra que entra por la misma puerta: **el catálogo geográfico** (P1). Sin saber cuál es y
cómo se versiona, no se puede modelar la ubicación de un aporte de forma que un corte
exportado siga siendo reproducible cuando la lista de municipios cambie.

## Y una regla de orden que no se negocia

`metodo/frentes.md`: **la unidad de pertenencia va primero**. No es una restricción sobre una
tabla, es una columna en **todas** y una condición en cada consulta que alguien escriba desde
ese momento. Agregarla después obliga a revisar todo lo escrito hasta entonces, y basta con
que una consulta se escape.

Y la invariante suprema se hace imposible **en el mismo frente donde nacen los datos que
podrían violarla**, nunca en uno posterior. Crear tablas aquí sin eso sería crear ese frente
sin su invariante.

## Qué sí se puede hacer mientras tanto

Todo lo que no toca datos: la vista de construcción, el pipeline de tokens, los componentes
de interfaz contra los datos de ejemplo que trae el sistema de diseño
(`eventos-ejemplo.json` y `aportes-ejemplo.json`).
