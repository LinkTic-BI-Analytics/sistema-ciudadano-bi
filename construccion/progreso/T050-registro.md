# Registro — T050 · La bandeja que sí ayuda a decidir

**Autoridad:** `backoffice-especificacion.md` §«Bandeja de aportes» · `BI-02` · `RF2`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-15 | 3 recorridos nuevos de bandeja, 1 de la señal de voz | `consola.spec.ts`, `microfono.spec.ts` |
| 2026-09-15 | Semilla que ejercita los seis casos distintos | `scripts/sembrar-bandeja.sh` |

## Qué estaba mal

La bandeja se diseñó cuando el formulario capturaba tres cosas: relato, lugar y fecha. **Hoy
captura diez y seguía mostrando tres.** El revisor no tenía cómo distinguir un aporte de otro.

Y mostraba **solo los que tenían la ubicación por aclarar**, así que ni siquiera podía ver los ya
resueltos.

De la especificación del backoffice no cumplíamos casi nada: pedía tabla con **aporte, territorio,
estado y responsable**, búsqueda por relato, lugar o territorio sin tildes ni mayúsculas, filtros
combinables, «abrir siguiente» y un vacío que explique y ofrezca limpiar.

## Qué trae ahora

Lo que la especificación pide, más **las señales que cambian cómo se revisa**. No son decoración:
cada una dice qué hacer distinto.

| Señal | Por qué importa |
|---|---|
| **por voz** | la transcripción puede estar mal, y hay audio que oír |
| **habla por un grupo** | hay a quién responderle, y nadie verificó que hable por él |
| **alerta de urgencia** | se mira antes que lo demás |
| **viene de un encuentro** | tiene contexto que el resto no tiene |

Y una columna que no estaba en ninguna especificación pero es la que más falta hacía: **qué le
falta**. Nombrada en palabras —«municipio, a quiénes, desde cuándo»— y no con códigos: el revisor
tiene que saber **qué preguntar**, no qué columna está vacía.

**Ninguna puntuación**, y eso sigue siendo la decisión. El orden es del más antiguo al más
reciente y se conserva al filtrar; «abrir siguiente» abre el primero por fecha de recepción, no
el más grave. `BI-02` prohíbe ordenar por popularidad, y una columna de puntaje es una puntuación
aunque se llame de otra forma.

Los filtros van **por la dirección** y no por estado de cliente: así un revisor puede guardar o
mandarle a otro el enlace de lo que estaba mirando, que es media razón de que una bandeja sea
compartida.

## La semilla

También tenía razón el negocio. La anterior metía cinco relatos y nada más: ni municipio, ni a
quiénes, ni desde cuándo, ni voz, ni grupo, ni urgencia. **Con eso la bandeja se veía siempre
igual** —todo por aclarar, todo sin señales— y no servía para ver si la pantalla ayuda a
distinguir.

Ahora son seis casos elegidos para que se vean seis filas distintas: uno completo y ubicado, uno
sin lugar ninguno, uno por voz, uno de un colectivo, uno con urgencia y uno con lugar que no
lleva a ningún municipio.

**El de voz no se pudo sembrar por SQL**, y eso fue una buena noticia: la base rechazó el
`insert` porque un aporte hablado sin grabación pierde su original (ADR 0013). Se siembra con un
guion que **sube audio de verdad** — una fila que apunte a un archivo que no existe es justo lo
que las pruebas vigilan.

## Dos defectos que salieron al probar

**En teléfono se ocultaban datos esenciales.** La tarjeta no mostraba qué falta ni quién lo
tiene, y el sistema de diseño lo prohíbe sin rodeos: *«no se ocultan datos esenciales»* al pasar
de tabla a lista.

**Las pruebas buscaban el aporte entre los primeros 50.** Con 126 recorridos acumulando, el
recién creado se salía de la lista y fallaba sin que nada estuviera roto. Ahora usan el buscador
que la bandeja acaba de estrenar, que además es como se usa de verdad.

Y una lección de SQL que costó una corrida: **dentro de una misma sentencia, un `update` no ve
las filas que otra parte de ella acaba de insertar.** Comparten instantánea. La semilla dejaba
cero ubicaciones confirmadas, en silencio.

## Lo que queda abierto

**No hay asignación.** La columna «quién lo tiene» sale del autor de la ubicación, que es lo más
cercano que hay. Asignar de verdad —con equipos y ámbitos— es `RF14` y va con los permisos
(`T032`, bloqueada por `P4`).

**No hay filtro por estado de revisión ni por equipo**, que la especificación sí pide. Hoy el
filtro es de ubicación, que es lo que la bandeja resuelve.

**El revisor sigue sin poder escuchar el audio** de un aporte hablado, aunque ahora al menos sabe
que existe.
