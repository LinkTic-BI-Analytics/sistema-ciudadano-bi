# Registro — T025 · La síntesis corregible

**Contrato:** `construccion/tareas/T025-la-sintesis-corregible.md`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-13 | Prueba escrita antes, **vista fallar** | `ERR_MODULE_NOT_FOUND: …/sintesis.ts` |
| 2026-09-13 | Implementado. 7 contra la base + 20 recorridos en navegador | `npm test` y `playwright test` |

## La decisión que define esta tarea

**Aquí no hay IA, y no es una carencia.** `IA-01` la deja como ampliación y exige que todo
funcione sin ella. La pregunta era cuál es el camino manual, y la respuesta no es que un
revisor escriba la síntesis: es **preguntarle a la persona**, después de que contó libremente,
por las tres partes que `N03` pide separar.

Eso respeta lo que la visión pide —*«una solución sugerida es bienvenida, pero no debería ser
requisito»*— y respeta `V14`: la última palabra sobre su síntesis es suya. Proponer sin que
pueda corregir sería decidir por ella.

## Dos cosas que confirmar NO significa

**No significa que los hechos estén verificados.** `backoffice-especificacion.md` lo dice con
esas palabras, y hay una prueba de que confirmar mueve `estado_confirmacion` y **deja
`estado_revision` intacto**. Tocar los dos habría afirmado que alguien de la institución ya lo
miró, y no lo ha mirado nadie.

**No cierra nada.** Corregir una síntesis ya confirmada crea la versión 2 y la 1 se queda
diciendo lo que decía, porque el día que alguien pregunte por qué cambió hay que poder
mostrarlo.

## Lo que se guarda sin usarse todavía

Las dos clases de corrección —*«me entendieron mal»* y *«ahora quiero cambiar mi posición»*—
quedan **distinguidas en la base**, aunque su efecto sobre el registro histórico siga abierto
(`Q15`).

Guardar la distinción ahora es lo que permite decidir después **sin haber perdido el dato**. Si
se guardaran iguales, el día que `Q15` se responda solo serviría para lo nuevo.

## Una decisión de pantalla

Los tres campos van **plegados**. `N02` pide captura mínima y gradual: lo obligatorio es el
relato. Abrirlos de entrada convierte un formulario de dos campos en uno de cinco, y eso es lo
que hace que alguien lo cierre.

## Hallazgos aparcados

Ninguno.
