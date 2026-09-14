# Registro — T023 · Recibir un aporte

**Contrato:** `construccion/tareas/T023-recibir-un-aporte.md`
**Módulo que le da autoridad:** ninguno todavía. `entregable/modulos/` está vacío, así que la
autoridad son los códigos citados (`RF5`, `I1`, `I2`, `DAT-01`) y las decisiones de
`negocio/vacios.md`.

## Corridas

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-13 | Prueba escrita antes que el código, **vista fallar** | `ERR_MODULE_NOT_FOUND: Cannot find module …/recibir.ts` |
| 2026-09-13 | Implementado. 7 de 7 | `node --test pruebas/captura.test.ts` |
| 2026-09-13 | Prueba de acceso agregada. 10 de 10 | `pruebas/acceso.test.ts` |
| 2026-09-13 | Acceso **visto fallar**: `grant select` a `anon` sobre `territorio` | `territorio devolvió 1 filas a una llave pública` |

## Decisiones del orquestador

Dos fallos contra el texto de mi propio contrato. La guía §5 pide que la razón se argumente
contra la autoridad, no contra el plan.

| Qué chocaba | Qué se decidió | Contra qué autoridad |
|---|---|---|
| El contrato decía **No modificar: `supabase/schemas/`**, y hubo que agregar dos archivos | Se agregaron `08_comprobante.sql` y `09_acceso.sql` | `SEG-01` dice que los permisos aplican **también por URL directa**. Exponer `identidad` a PostgREST la volvía alcanzable por esa vía, y eso no es un detalle de implementación: es la invariante `I6`. La prohibición del contrato existía para que T023 no rediseñara el modelo de datos, y no lo rediseñó — agregó la puerta correcta |
| El contrato pedía la prueba en Python | Se escribió en TypeScript | La acción es TypeScript, y una prueba que no ejecuta el código que prueba no prueba nada. Node 26 corre TS nativo, así que no costó una dependencia |

## Lo que apareció construyendo

**El esquema `identidad` no se expone por la API.** No estaba previsto y es la decisión más
importante de la tarea. Se escribe a través de `participacion.emitir_comprobante`, que corre
con los privilegios de su dueño y **recibe el hash, nunca el código** — si recibiera el código,
quedaría en el registro de sentencias de Postgres.

**El acceso arranca negando.** `T032` decidirá quién ve qué, y está bloqueada por `P4` y `Q18`.
Mientras tanto el acceso a nivel de fila queda encendido en las doce tablas **sin ninguna
política**: nadie ve nada, salvo el rol del servidor que lo salta. Agregar una política después
es escribir una regla sobre un interruptor que ya está puesto; arrancar al revés —permitir y
luego restringir— es cómo se filtran los datos, porque basta olvidar una tabla.

## Hallazgos aparcados

Ninguno.
