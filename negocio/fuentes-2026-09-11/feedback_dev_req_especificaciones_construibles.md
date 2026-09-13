# Feedback para dev-req: de capturar contexto a delimitar construcción

12 de septiembre de 2026. Derivado de la tercera prueba y del nuevo énfasis del usuario en visibilidad territorial y BI.

## Criterio de éxito

La herramienta debe generar documentos que permitan a un equipo construir un alcance explícito y verificarlo. Tener documentos cargados, respuestas guardadas o módulos «sin secciones a medias» no basta.

En este proyecto, la cadena que debe sobrevivir a la captura es:

**Relato ciudadano → dato territorial con calidad visible → necesidad situada → exploración y comparación mediante BI → revisión priorizada → decisión y respuesta trazables.**

Los eventos y la divulgación alimentan esa cadena y ayudan a cubrir contextos ausentes. BI forma parte del alcance inicial; no es simplemente un tablero al final del proceso.

## Cambios necesarios en la herramienta

| Requisito para dev-req | Problema que resuelve | Cómo verificarlo |
|---|---|---|
| Cada requisito conserva ID, actor, entrada, operación, salida, regla, prioridad, exclusiones y aceptación. | Las descripciones extensas de módulos no delimitan qué construir. | Un constructor puede ejecutar un caso de prueba sin consultar la conversación original. |
| Mostrar qué quedó solo como fuente y qué se convirtió en especificación. | En la prueba, la entrevista principal y el diagnóstico alimentaron salidas diferentes. | Respuesta guardada muestra destino y estado de estructuración; ninguna queda silenciosamente fuera. |
| Importación recuperable y conciliación por elemento. | El lote falló con guardado parcial. | Reanudar no duplica y muestra elementos exitosos, fallidos y pendientes. |
| Separar hechos, propuestas de diseño, decisiones aprobadas y desconocidos. | El documento fuente no prueba aprobación ni operación real. | Una propuesta no se publica como regla institucional vigente. |
| Distinguir proceso nuevo de proceso existente. | Preguntar por el último día de uso no puede bloquear del mismo modo un producto aún no construido. | Admite escenario futuro verificable y mantiene pendiente la validación, sin inventar historia. |
| Crear contratos de datos y métricas, además de listas de módulos. | BI puede mostrar cifras engañosas si no distingue aportes, personas, necesidades y apoyos. | Total nacional usa IDs distintos y concilia con mapa, tabla y exportación. |
| Registrar calidad y precisión geográfica como requisitos. | Un mapa puede dar apariencia de exactitud con datos incompletos. | Municipio conocido no se transforma en punto exacto; sin ubicación queda visible como pendiente. |
| Separar motivo, condición y resultado esperado en sus campos. | En la prueba, estos quedaron mezclados en descripciones mientras otras columnas seguían vacías. | La prueba contiene entrada, acción y resultado esperado; el motivo está asociado a la regla. |
| Conservar relaciones entre requisitos, datos, módulos y decisiones. | Una dependencia redactada no siempre llenó «Depende de». | Seleccionar un RF muestra datos consumidos, módulo productor y salidas necesarias. |
| Evaluar completitud semántica. | «Sin secciones a medias» no garantiza un alcance construible. | Detecta RF con múltiples operaciones, métricas sin denominador y pruebas sin resultado esperado. |
| Exportar paquetes autocontenidos y versionados. | El equipo no debe reconstruir contexto repartido entre pantallas. | Incluye alcance, datos, reglas, pruebas, decisiones pendientes y fuentes con IDs resolubles. |

## Contenido mínimo del paquete para este proyecto

1. Resultado del servicio y preguntas que habilita para tomar decisiones.
2. Alcance de la primera entrega y ampliaciones explícitas.
3. Recorrido ciudadano y operativo con estados y contingencias.
4. Entidades, campos, relaciones, procedencia, calidad y privacidad.
5. Requisitos funcionales pequeños, priorizados y verificables.
6. Especificación de mapas, filtros, métricas, denominadores y permisos.
7. Pruebas de punta a punta, sin hacer pasar ejemplos por pruebas ejecutadas.
8. Decisiones pendientes con efecto concreto sobre construcción y despliegue.

La referencia concreta para probar esta mejora es `especificacion_datos_y_bi_v1.md`, que desarrolla requisitos DAT-01, GEO-01, NEC-01, TAX-01, CAL-01, BI-01 a BI-03, PRI-01, TRA-01, RES-01, SEG-01 e IA-01. Deben conservarse identificadores, prioridades, condiciones, exclusiones y pruebas al transformarlo, no resumirse en «módulo de analítica».

## Ejemplo que debe superar la salida

Entrada: «Queremos ver en un mapa dónde están los puntos de dolor, incluyendo comunidades pequeñas».

Salida insuficiente: «Crear dashboard geográfico con IA y filtros».

Salida necesaria: identificar la unidad que se mapea, ubicación y precisión disponibles, dimensiones del problema, revisión y agrupación, regla contra doble conteo, filtros, acceso al expediente, casos no ubicados, cobertura de participación, protección de comunidades pequeñas y criterio de aceptación.

La herramienta ayuda si conserva esa lógica y hace visible lo que falta. No ayuda suficientemente si produce un documento que suena completo pero deja al constructor inventar decisiones de producto.
