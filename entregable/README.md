# El entregable

Lo único que sale del edificio. Esto es lo que recibe el equipo de desarrollo.

Cada módulo es **autocontenido**: se lee solo, sin acceso a este repositorio, y se puede
implementar en la tecnología que el equipo use. Lo produce `/entregar`.

## Qué NO va aquí

- Nada del stack del MVP: ni código, ni tablas, ni componentes. El MVP se construyó para
  descubrir y se tira ([ADR 0001](../decisiones/0001-el-mvp-es-instrumento-no-producto.md)).
- Enlaces a `negocio/`, a `metodo/` ni a `ejemplo/`. Si un módulo cita algo que el equipo no
  va a recibir, está incompleto.

## Los módulos

| # | Módulo | Versión | Salió de | Estado en el MVP |
|---|---|---|---|---|
|  |  |  |  |  |

> La última columna es la que le dice al equipo cuánto creerle a cada documento:
> `construido y visto con gente` · `construido y no mostrado` · `diseñado y no construido`.

## Antes de mandar cualquiera de estos

La prueba del sobre cerrado, que está al pie de cada módulo. Si no pasa, no se manda: un
documento con un hueco enseña al equipo a preguntar, y preguntar es justo lo que estos
documentos existen para evitar.
