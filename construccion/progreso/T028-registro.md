# Registro — T028 · Crear expediente y vincular

**Contrato:** `construccion/tareas/T028-crear-expediente.md`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-13 | Prueba escrita antes, **vista fallar** | `ERR_MODULE_NOT_FOUND: …/expediente.ts` |
| 2026-09-13 | Implementado. 13 de 13 en la tanda | `node --test pruebas/revision.test.ts` |

## Decisiones del orquestador

| Qué chocaba | Qué se decidió | Contra qué autoridad |
|---|---|---|
| ¿`crearExpediente` debería buscar expedientes parecidos y proponer vincular? | **No, y es deliberado** | `V12`: la separación es el estado por defecto, y compartir tema o municipio **no basta**. Sugerir es trabajo de `NEC-01` —la IA propone, el equipo confirma— y necesita el par valor sugerido/valor aceptado, que no existe. Un «propone» sin ese par se vuelve un «decide» |
| El motivo ya lo exige la base. ¿Comprobarlo también aquí? | Sí | Para que el error diga qué falta en vez de devolver un mensaje de restricción. La base es la que lo hace imposible; esto solo lo explica |

## Lo que quedó como prueba, textual

Los tres casos de la tabla de `V12` están escritos como pruebas, no parafraseados:

- Dos barrios del mismo municipio → **dos expedientes por defecto**
- Baja presión y contaminación → **dos**, aunque compartan territorio
- Un relato que menciona agua y transporte → **dos necesidades desde un mismo aporte**

Y la pregunta que decide —*¿podríamos dar por atendida una mientras la otra sigue pendiente?*—
quedó en el comentario de la función, porque es criterio humano y no se puede codificar.

## Hallazgos aparcados

Ninguno.
