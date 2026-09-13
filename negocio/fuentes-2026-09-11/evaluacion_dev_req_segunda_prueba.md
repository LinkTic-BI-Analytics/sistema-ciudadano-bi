# Segunda prueba de dev-req: fidelidad de la especificación

12 de septiembre de 2026. Evaluación mediante interfaz; sin revisión del código, infraestructura ni seguridad del servicio.

## Dictamen

La herramienta recibió y analizó la información, creó una estructura útil y permitió corregir la definición central. **Todavía no conserva por sí sola toda la esencia ni la lógica del producto en la especificación generada.** El problema no se limita a la redacción de los insumos: también se observaron omisiones al importar, deduplicación que deja definiciones incompletas y falta de traslado de razones y pruebas explícitas.

El proyecto queda como base revisada, no como especificación aprobada para construir. El núcleo de requisitos N01–N20 sigue siendo referencia obligatoria junto con los documentos fuente.

[Abrir proyecto de validación](https://idle-asset-trustee-websites.trycloudflare.com/participacion-ciudadana-colombia-validacion-de-especificacio/sistema)

## Qué se cargó y probó

Se creó **Participación Ciudadana Colombia — Validación de especificaciones v2**, separado del ensayo anterior. Se cargaron completos y analizaron:

1. `investigacion_planeacion_ciudadana_colombia_v2.md`: 13.819 palabras según la aplicación; incluye investigación refinada e interpretación de la reunión.
2. `definicion_producto_participacion_v1.md`: 3.225 palabras según la aplicación; recorrido, canales, eventos, divulgación, priorización, roles y secuencia.
3. `especificacion_nucleo_participacion_v2.md`: 1.998 palabras según la aplicación; complemento elaborado para esta prueba con modelo de información, veinte requisitos, sus motivos y ejemplos sintéticos de aceptación.

Se utilizó la autorización de Miguel Gomez para analizar la información del producto con OpenRouter. No se incluyeron credenciales en los documentos.

Se revisaron las sugerencias antes de importarlas. Las selecciones realizadas fueron 39 elementos de investigación, 28 de definición y 32 de la vista revisada del complemento. Estos números representan selección en pantalla, no una garantía de igual número de registros nuevos persistidos. Se evitaron interpretaciones incorrectas y duplicados.

También se probó la pregunta escrita del módulo Recepción accesible con una descripción completa y seis casos sintéticos: ubicación incompleta, transcripción incorrecta, contexto geográfico insuficiente, conexión compartida, interrupción de envío y confidencialidad del comprobante. La aplicación avanzó de pregunta, pero el documento del módulo inspeccionado no incorporó esos casos.

## Qué mejoró respecto al primer ensayo

- Los campos generales distinguen **propuesta nuestra**, propuesta documental y acuerdo. La edición de esos campos ya no se presenta automáticamente como aprobación institucional.
- La extracción de investigación recoge expresamente protección de minorías sin multiplicar votos.
- Se asignaron algunos actores a módulos automáticamente; la primera prueba había dejado todos sin asociación.
- Hay avisos de coincidencias y semejanzas entre información nueva y existente.
- Algunas preguntas iniciales se retiran cuando se completan campos relacionados. No es una reconciliación completa ni consistente con todos los paneles.
- La descripción extraída de priorización habla de reglas y alternativas, sin limitar el módulo exclusivamente a votar.

## Fallos reproducidos o detectados

| Hallazgo | Evidencia de entrada y salida | Consecuencia |
|---|---|---|
| Condición futura convertida en exclusión | «La integración completa con ejecución presupuestal y resultados es una ampliación posterior» se propone como respuesta a «Qué no va a hacer, aunque se lo pidan». | Se elimina una capacidad futura del alcance conceptual. Se excluyó y aclaró manualmente. |
| Decisión simplificada | Primero cartera, luego necesidad o expediente, sin conservar conjuntamente examen, deliberación y selección habilitada. | El equipo puede construir una única priorización donde existen tres decisiones diferentes. Se escribió la distinción manualmente. |
| Restricción más fuerte que la fuente | «Sin fusionar automáticamente por palabras compartidas» se resume como «no se fusionan». | Prohíbe también agrupaciones revisadas permitidas por el modelo. Se excluyó esa formulación. |
| Preguntas seleccionadas no incorporadas | La lista del sistema siguió con dos preguntas tras seleccionar nuevas en las importaciones de definición y complemento. | La salida concluye que faltó entrevista pese a disponer del contenido. Se recuperaron seis preguntas manualmente. |
| Deduplicación sin completar definición | El complemento define Aporte. La vista lo descarta como existente; el glosario final sigue diciendo «Sin definir todavía: Aporte». | La comparación de nombres impide enriquecer un registro incompleto. Se dejó definición en el campo de captura, pero el glosario requiere reparación. |
| Razones explícitas no trasladadas | N17 explica que centros comunitarios comparten dispositivos; la regla resultante de duplicidad muestra «Falta el porqué». | La especificación pierde la justificación necesaria para aplicar correctamente la regla. |
| Pruebas explícitas no trasladadas | N01–N20 contienen ejemplos; la salida declara que R1, R2 y R3 no tienen casos. La captura guiada con seis casos tampoco los incorporó al documento inspeccionado. | Tener el archivo cargado no significa tener criterios verificables en el entregable. |
| Requisitos distribuidos incorrectamente | Recepción accesible recibe RF1, mientras confirmación y captura mínima aparecen en el documento general y no en su documento de módulo inspeccionado. | Quien recibe solo el módulo obtiene un recorrido incompleto. |
| Actores inconsistentes entre vistas | El módulo Recepción accesible muestra Ciudadanía en su interfaz, pero su documento muestra «Lo usan —». | Una asociación visible no necesariamente llega al documento entregado. |
| Estructura incompleta pese a fuente explícita | Convocatoria y administración no fueron propuestas en la extracción de definición; aparecieron al procesar el complemento. | La estructura depende del insumo y no debe considerarse exhaustiva. |
| Cuestionario y estado no siempre concuerdan | Una vista dijo que no quedaban preguntas abiertas mientras el panel lateral mantenía pendientes. | El usuario no sabe con claridad dónde resolverlas. |

La navegación durante una lectura y los reintentos produjeron vistas previas tardías del mismo documento. No se reimportaron esas vistas para evitar duplicación. Esto no constituye una prueba aislada de concurrencia: hace falta reproducirla controladamente y verificar el estado de los trabajos en el servidor. La interfaz debería distinguir lectura en curso, resultado listo, importación aplicada y nueva revisión, evitando que un botón invite a repetir una operación todavía pendiente.

## Qué quedó corregido y verificado

Se guardaron manualmente y se comprobaron en la salida:

- Objetivo completo: ciudadano sin experiencia; convocatoria, captura presencial/digital, confirmación, discusión, priorización y respuesta.
- Unidad de decisión por fases, con protección de grupos pequeños y rutas por competencia.
- Unidad de captura: aporte distinto de expediente, apoyo, persona verificada, alternativa, decisión, proyecto e indicador; historia y agrupaciones reversibles.
- Límites: IA sin autoridad presupuestal, incidencia con evidencia, cuatro vistas analíticas, privacidad, divulgación cívica, integración futura condicionada y plazo no confirmado.
- Ocho preguntas del sistema, seis añadidas manualmente para recuperar propósito, fidelidad, revisión, alternativas, inclusión e incidencia.

Los cuatro campos generales corregidos aparecen como **propuesta nuestra · sin acordar**. Las preguntas añadidas manualmente aparecen con marca de confirmación en la interfaz; eso representa su incorporación editorial a la prueba, no un acuerdo con una entidad pública.

Estado final observado: **10 módulos, 10 actores, 6 módulos sin actores asociados, 8 preguntas del sistema, 65 decisiones pendientes y 14 secciones sin llenar en la especificación general**. El mismo número de módulos o un porcentaje de cobertura mayor no significa que el contenido esté completo. La cantidad de pendientes tampoco es comparable directamente con el ensayo anterior: se agregó un tercer documento y se hicieron correcciones distintas.

## Trazabilidad del núcleo: qué debe completarse

Los veinte requisitos están íntegros en el documento complementario cargado. La siguiente tabla distingue su presencia parcial en la estructura de la necesidad de desarrollar reglas y pruebas.

| Núcleo | Representación observada | Falta para una especificación utilizable |
|---|---|---|
| N01 Convocatoria | Módulo añadido con el complemento; objetivo y pregunta corregidos. | Ficha, versión de mensajes, permisos y condiciones de publicación. |
| N02 Captura gradual | RF3 y definición central. | Relación al módulo y prueba de ubicación incompleta. |
| N03 Fidelidad | RF2 y campo de captura. | Versiones, confirmación, corrección de voz y pruebas. |
| N04 Contexto después de escuchar | Módulo documental y límites corregidos. | Secuencia del entrevistador, fuentes y prueba geográfica. |
| N05 Eventos y disensos | Talleres y R2. | Flujo de validación, rectificaciones y conteos distintos. |
| N06 Continuidad sin conexión | I2 y alcance corregido. | Diferenciar papel de offline digital, reintento e identificación temporal. |
| N07 Agrupación reversible | Afirmación pendiente y captura corregida. | Permisos, historial, desagrupación y reclamación. |
| N08 Comunidades pequeñas | I1, protección de identidad y decisión corregida. | Revisión operativa de rareza, ausencia, disenso y perjuicios a terceros. |
| N09 Prioridad de examen | Campo de decisión corregido. | Criterios, salida, responsable y prueba de caso aislado grave. |
| N10 Deliberación | Módulo de discusión y decisión corregida. | Fichas comparables, restricciones y registro de desacuerdos. |
| N11 Selección habilitada | I3 y decisión corregida. | Configuración y pruebas de habilitación; mandato real pendiente. |
| N12 Competencia | Gestión interna y decisión corregida. | Remisión, aceptación, conflicto y gestión de no respuesta. |
| N13 Respuesta y reclamación | Módulo, preguntas y objetivo. | Estados, responsables, tiempos y revisión de errores. |
| N14 Incidencia | I4 y límites corregidos. | Vínculos con evidencia y transiciones verificables. |
| N15 Cuatro vistas | Analítica y límites corregidos. | Unidades, denominadores, cortes y límites de representatividad. |
| N16 Privacidad | RF1, P1, C3 y captura corregida. | Acceso, conservación, supresión y seguridad de consulta. |
| N17 Controles revisables | R3. | Motivo, protocolo de revisión y caso de conexión compartida. |
| N18 Divulgación cívica | Módulo y límites corregidos. | Preferencias de contacto, métricas y separación de datos publicitarios. |
| N19 Responsabilidad de IA | Objetivo y límites corregidos. | Versiones, revisores y aprobación de sugerencias. |
| N20 Integraciones | Aclaración en límites; ninguna integración anotada. | Registro como candidatas, muestras y tratamiento de fallos. |

Esta tabla no certifica implementación. Los ejemplos son sintéticos y no se ejecutaron contra una plataforma ciudadana real.

## Cambios prioritarios para que dev-req cumpla el objetivo

1. **Importación reconciliada y verificable:** mostrar cuántos elementos nuevos, actualizados, omitidos y fallidos se guardaron; no ignorar silenciosamente preguntas o mejoras de campos.
2. **Enriquecer coincidencias:** si un término existe sin definición, proponer completarlo; si tiene una distinta, mostrar la comparación antes de sustituir.
3. **Extraer relaciones completas:** requisito + motivo + condición + actor + módulo + caso + resultado esperado. La fuente con veinte requisitos no debe convertirse solo en cinco reglas destacadas sin advertencia de lo omitido.
4. **Preservar modalidad y fase:** opcional, condicionado, futuro, ejemplo y prohibición son significados diferentes. Revisar cita y paráfrasis conjuntamente.
5. **Conectar conversación y entregable:** una respuesta guardada debe convertirse en material estructurado revisable o mostrar explícitamente por qué aún no lo hizo. Avanzar de pregunta no demuestra que lo dicho pasó a la especificación.
6. **Unificar las vistas:** roles, preguntas y requisitos deben conservar las mismas relaciones en pantalla y exportación. Los pendientes deben poder localizarse y resolverse desde el aviso.
7. **Mostrar cobertura por fuente:** N01–N20 debe tener una matriz que permita ver qué está completo, parcial o ausente, separada de los porcentajes del cuestionario.

## Criterio para una próxima prueba

Repetir con los mismos tres archivos en un proyecto vacío, una lectura a la vez. Conservar entradas y salidas de cada importación. La prueba pasa cuando los veinte requisitos y sus condiciones, motivos y ejemplos quedan representados y vinculados en los entregables correspondientes; Aporte queda definido; las ocho preguntas se conservan; una fase futura no se convierte en prohibición; y los pendientes se limitan a decisiones realmente no suministradas o muestran claramente qué detalle falta.

No se deben inventar patrocinador, mandato, presupuesto, plazos, pesos, cuotas o permisos para mejorar un indicador. La investigación y el diseño permiten avanzar en el recorrido neutral; la aprobación institucional sigue siendo una cuestión distinta.
