# Registro — T029 · Desagrupar

**Contrato:** `construccion/tareas/T029-desagrupar.md`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-13 | Prueba escrita antes, **vista fallar** | `does not provide an export named 'desvincular'` |
| 2026-09-13 | Implementado. 19 de 19 en la tanda | `node --test pruebas/revision.test.ts` |

## Lo que se implementó y casi no se implementa

`I4` se lee fácil —*«conservar originales, diferencias, motivos y vínculos»*— y con eso solo se
hace la mitad: no borrar. **La otra mitad está en `NEC-01`**: *«reabre examen de prioridad y
respuestas sin heredar aprobación»*.

Si un aporte sale de un expediente y la prioridad se queda como estaba, **el sistema afirma algo
que ya no sustenta**. Por eso el expediente queda marcado como reabierto, con fecha y causa. No
se borra la prioridad: se señala que dejó de estar vigente.

## Lo que no hubo que hacer, y es la señal de que algo se hizo bien antes

La prueba del corte inmutable **pasó sin escribir una línea**. El corte ya era inmutable por
regla de Postgres desde T022, así que desagrupar no lo toca. Una decisión tomada hace tres
tareas se sostuvo sola.

## Hallazgos aparcados

Ninguno.
