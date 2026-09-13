# Por qué esta carpeta todavía está vacía

El esquema de la base es **declarativo** y es la fuente de verdad: los archivos `.sql` de
aquí se concatenan con `../scripts/esquema.sh` para generar la migración. Nunca se toca el
esquema por un panel de administración — un cambio que no está en un archivo es un cambio
que el siguiente entorno no tiene.

## Qué se destrabó el 2026-09-13

Dos de las tres cosas que bloqueaban ya están decididas, y están escritas en
[`AGENTS.md`](../../../AGENTS.md) §9:

| | Decidido |
|---|---|
| **El borrado es lógico** | La fila se queda y se marca. Append-only con lápidas, en las diez tablas |
| **El catálogo geográfico es DIVIPOLA** | Departamento 2 dígitos + municipio 3. Centros poblados, 3 más. La versión va **en cada registro** |

## Qué bloquea ahora, y es más grave

**Falta la unidad de pertenencia** (`Q9` en [`negocio/vacios.md`](../../../negocio/vacios.md)).

`metodo/frentes.md` lo dice sin rodeos: es lo único que de verdad **no se puede agregar
después**, porque no es una restricción sobre una tabla — es **una columna en todas** y una
condición en cada consulta que alguien escriba a partir de ese momento. Agregarla después
obliga a revisar todo lo escrito hasta entonces, y basta con que una consulta se escape.

La especificación no la nombra. Describe el acceso interno como *«rol + tarea + convocatoria
+ territorio»*, lo que sugiere que la unidad es **convocatoria × territorio** — pero eso es
una lectura del texto, no una decisión de nadie, y `AGENTS.md` §3 prohíbe escribirla como si
lo fuera.

Y faltan dos más que tocan el modelo:

- **`P2` · qué es un «expediente».** El glosario lo declara sin definir, y es la entidad
  central del sistema.
- **`P4` · el mecanismo de identidad.** No existe en ningún archivo, ni para los nueve roles
  internos ni para el comprobante de la persona.

## La regla de orden, que sigue igual

La invariante suprema se hace imposible **en el mismo frente donde nacen los datos que
podrían violarla**, nunca en uno posterior, y desde el primer día de ese frente. No se
construye el comportamiento y después se le agrega la restricción.

## Qué sí se puede hacer mientras tanto

Todo lo que no toca datos: la vista de construcción, el pipeline de tokens, y los
componentes de interfaz contra los datos de ejemplo que trae el sistema de diseño
(`eventos-ejemplo.json` y `aportes-ejemplo.json`).
