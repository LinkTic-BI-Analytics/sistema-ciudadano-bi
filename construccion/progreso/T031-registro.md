# Registro — T031 · El corte exportable

**Contrato:** `construccion/tareas/T031-el-corte-exportable.md`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-13 | Prueba escrita antes, **vista fallar** | `ERR_MODULE_NOT_FOUND: …/exportar.ts` |
| 2026-09-13 | Implementado. 7 de 7 | `node --test pruebas/corte.test.ts` |
| 2026-09-13 | **Vista fallar de nuevo**: se hizo que recalculara en vez de leer la foto | `AssertionError: R2: un corte nuevo no reescribe el anterior` |

## La decisión que sostiene todo lo demás

**`exportarCorte` no vuelve a consultar nada.** Lee lo que el corte congeló: sus indicadores y
su universo de IDs.

Parece un detalle de implementación y es la invariante entera. Si recalculara, dos
exportaciones del mismo corte podrían diferir, y el corte dejaría de ser una foto — que es
justo lo que `R2` prohíbe y lo que `I6` llama *«universos contradictorios»*.

Se comprobó rompiéndolo: haciendo que recalculara, la prueba del aporte aclarado después del
corte falló de inmediato.

## El diccionario va textual, no parafraseado

Las ocho advertencias de la §7 del paquete se copiaron literales. *«No son personas ni votos»*
es la diferencia entre un dato y una afirmación sobre el país, y una advertencia reescrita es
una advertencia distinta.

Y solo se exportan los indicadores que el diccionario documenta: **un número sin definición ni
advertencia es un número que alguien va a interpretar como quiera.**

## Lo que el corte no lleva

Ni relatos, ni contactos, ni códigos de comprobante. `SEG-01`: *«sin exponer identidad
innecesaria»*. Hay una prueba que busca esas palabras en el resultado y falla si aparecen —
porque el relato de una persona en un municipio pequeño la identifica, aunque no lleve su
nombre.

## Hallazgos aparcados

Ninguno. Queda abierta `Q25` —si al otro equipo se le entregan filas o un corte con las reglas
aplicadas— y está aplazada a propósito: esta tarea produce la estructura, no fija el contrato
de entrega.
