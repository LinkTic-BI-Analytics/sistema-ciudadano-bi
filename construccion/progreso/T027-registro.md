# Registro — T027 · Aclarar la ubicación

**Contrato:** `construccion/tareas/T027-bandeja-de-aclaracion.md`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-13 | Prueba escrita antes del código, **vista fallar** | `ERR_MODULE_NOT_FOUND: …/ubicacion.ts` |
| 2026-09-13 | Implementado. 7 de 7 | `node --test pruebas/revision.test.ts` |

## Decisiones del orquestador

| Qué chocaba | Qué se decidió | Contra qué autoridad |
|---|---|---|
| El motivo ya es obligatorio en la base para el vínculo, ¿hace falta comprobarlo también aquí? | **Sí, y no es duplicar** | `I2` dice que resolver es un acto de alguien. Un motivo vacío que la base aceptara —porque la columna de `ubicacion` no lo exige— dejaría un acto sin razón, que es indistinguible de una inferencia automática |
| El segundo territorio de un aporte, ¿reemplaza o se suma? | **Se suma** | `GEO-01` permite vincular varios territorios, y `R2` ya se encarga de que eso no multiplique el numerador. Reemplazar perdería información que la persona dio |

## Lo que apareció construyendo

**Los tres estados que faltaban.** `CAL-01` pide cuatro separados y el esquema solo tenía el de
ubicación. Se agregaron clasificación, confirmación y revisión, y una prueba comprueba que
mover uno **no mueve los otros tres** — que es el punto entero de tenerlos separados.

Y una distinción que quedó escrita en el comentario de la columna: **confirmar la síntesis no
es verificar los hechos.** `backoffice-especificacion.md` lo dice con esas palabras, y un solo
campo los habría juntado.

## Hallazgos aparcados

Ninguno.
