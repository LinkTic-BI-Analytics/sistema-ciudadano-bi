# Hoja de ruta — <producto>

> ➤ Copia este archivo a `construccion/hoja-de-ruta.md`. Es **el tablero canónico de la
> construcción formal**: no lleva el detalle de cada tarea —eso vive en su contrato— sino
> el estado, la dependencia, el propietario y la evidencia que hace falta para entender el
> conjunto.

**Objetivo vigente:** <un resultado observable, no una lista de módulos>
**Fuente:** <qué módulos y en qué versión gobiernan este tablero>
**Actualizada:** <fecha y quién>

<!-- derivado · lo escribe scripts/construccion.sh · NO editar a mano -->
**Ruta crítica:** —
**Líneas paralelas activas:** —
<!-- /derivado -->

> ➤ La ruta crítica y las líneas activas **se derivan, no se declaran**. Es la misma regla
> `I2` de `harness/interfaz.md`: la telemetría sale del grafo. Escribirlas a mano garantiza
> que dentro de una semana digan algo que ya no es cierto.

## Las tareas

> ➤ Una fila por tarea. La columna `Códigos` enlaza con la especificación y es lo que hace
> rastreable el tablero; una tarea sin códigos no tiene autoridad. `scripts/construccion.sh`
> lee esta tabla, así que el formato de las columnas no se cambia.

| ID | Resultado | Códigos | Depende de | Línea | Propietario | Estado | Evidencia de cierre |
|---|---|---|---|---|---|---|---|
| T001 | <resultado> | <RF3, I1 o «—»> | <IDs o «—»> | <base, A, B…> | <quién> | <estado> | <qué se ve al cerrar> |

## Los estados

Ocho, y no hay más. **Prohibidos «avanzado», «casi» y «pendiente»**: no dicen qué falta ni
quién lo debe.

| Estado | Qué significa |
|---|---|
| `candidato` | Apareció, pero todavía no tiene contrato suficiente |
| `listo` | Tiene autoridad, dependencias resueltas, propietario y prueba de cierre |
| `en construcción` | Su propietario está trabajando y no hay otro propietario activo |
| `bloqueado` | No puede avanzar. **Incluye causa, dueño del desbloqueo y fecha de urgencia** |
| `en revisión` | Implementación entregada, pendiente de una o ambas revisiones |
| `en integración` | Aprobada aislada, pendiente de verificarse con el conjunto |
| `terminado` | Integrada y comprobada con evidencia reciente |
| `caído` | Ya no se construirá. Conserva la razón y la decisión que lo retiró |

## Las reglas de actualización

- Cada cambio de estado registra fecha y evidencia.
- Una tarea `bloqueado` indica **qué sí puede construirse sin la respuesta**.
- Una tarea nueva se agrega sin borrar la historia anterior.
- Una tarea reordenada conserva el porqué.
- Una tarea `terminado` **no se reabre en silencio**: vuelve a `listo` con la causa.
- Si cambia un código del módulo, se revisan todas las tareas que lo citan.

## Bloqueos

> ➤ Uno por fila. La causa se enlaza a la `Q` de `negocio/vacios.md` que lo produce, y la
> última columna es la que evita que un bloqueo pare más de lo que debe.

| Tarea | Causa | Dueño del desbloqueo | Urgente antes de | Qué SÍ se puede construir sin la respuesta |
|---|---|---|---|---|
