# Revisión — requerimiento

|  |  |
|---|---|
| **Código** | M02 |
| **Versión y fecha** | 2026-09-13 |
| **Depende de** | — |
| **Lo usan** | Revisor *(sin confirmar)*, Moderación |
| **Estado en el MVP** | diseñado y no construido |

## 1 · Qué hace

Bandejas para que humanos aclaren ubicaciones, clasifiquen temas, agrupen aportes en necesidades y corrijan sugerencias de la IA.

El revisor aclara ubicación, tema y afectación y organiza aportes en necesidades sin borrar diferencias. NEC-01/TAX-01/CAL-01: separar problema, consecuencia y alternativa; ubicación, clasificación, confirmación y revisión tienen estados distintos. AGR-01 — Quién: Revisor, consulta Analista; IA solo propone. Entrada: relatos originales, problema, lugar, periodo, afectación, versiones, calidad y evidencia declarada. Salida: (1) vínculos de aportes a la misma necesidad; (2) grupos analíticos de necesidades distintas relacionadas, con ID, miembros, criterio, autor, fecha, motivo y versión. Comparar lado a lado, mostrar diferencias y efecto en conteos antes de confirmar; aceptar/rechazar vínculos, desagrupar y conservar historia. Grupo nacional por tema mantiene necesidades locales y disensos, no los fusiona. Búsqueda sobre originales autorizados y etiquetas secundarias; no solo resumen. No fusionar por palabra común ni heredar prioridad o respuestas al desagrupar sin revisión. Caso: 100 reportes de baja presión y 2 de contaminación aparecen bajo agua conservando expedientes y afectaciones distintas. SEN-01: revisar señales poco frecuentes, graves reportadas, nuevas, sin clasificar o con disenso; registrar motivo, evidencia, incertidumbre y responsable. No descartarlas por bajo volumen. Fuente: requisitos_visibilidad_agrupacion_y_campanas_v1.md.

| Quién | Qué hace aquí | Qué NO puede |
|---|---|---|
| Revisor *(sin confirmar)* | Aclara, clasifica, revisa ubicación, relaciona y desagrupa necesidades en la bandeja de calidad. | No inventa ubicaciones o hechos, borra disensos ni aprueba presupuesto. Clasificaciones y agrupaciones requieren motivo y trazabilidad. |
| Moderación | Revisa señales de abuso, amenazas y datos sensibles, protege publicación y conserva crítica y disenso legítimos con motivo y trazabilidad. | No censura crítica legítima por etiqueta automática de IA, no publica datos sensibles ni altera hechos o decisiones institucionales. Protocolo de incidentes pendiente de aprobación. |

## 3 · Vocabulario

| Palabra del negocio | Qué es | Palabra que NUNCA va en pantalla |
|---|---|---|
| Alternativa | opción de respuesta comparable, distinta del problema expresado. | — |
| Decisión | acto registrado de una autoridad responsable con motivos y alcance. | — |
| Aporte | Una expresión individual o colectiva con identidad de registro propia. | — |
| Persona participante | Persona distinguible con el nivel de identificación disponible. | — |
| Necesidad situada | Problema localizado, afectación y resultado esperado, con expediente estable. | — |
| Punto de dolor | Manifestación concreta del problema: qué ocurre y qué dificulta en la vida cotidiana. | — |
| Territorio o lugar afectado | Área, lugar o conjunto de lugares donde se reporta el problema. | — |
| Apoyo | Expresión explícita de respaldo bajo reglas publicadas. | — |
| Decisión y respuesta | Tratamiento institucional y comunicación de sus motivos. | — |
| Proyecto | instrumento de ejecución cuando corresponda; también puede haber respuestas de gestión, servicio o regulación. | — |
| Plan Nacional de Desarrollo (PND) | La Constitución establece una parte general y un plan de inversiones de las entidades públicas nacionales. La primera contiene objetivos, prioridades y orientaciones; el segundo proyecta programas, proyectos y recursos plurianuales dentro de un marco de sostenibilidad fiscal. | — |
| Expediente de necesidad | La unidad de trabajo con identificador estable que conserva la historia, autoría, versiones, agrupaciones, remisiones, decisiones y evidencia de una necesidad. | — |
| Metodología General Ajustada (MGA) | Herramienta que se utiliza para formular proyectos de inversión pública y convertir problemas y alternativas en intervenciones estructuradas. | — |
| Relatoría | Problemas tratados, alternativas, acuerdos, disensos, preguntas y pendientes; versión, responsable y método de validación. Vínculos a aportes; evita duplicarlos. | — |
| Cobertura de escucha: municipios con al menos un aporte ubicado divididos entre municipios incluidos en alcance definido de convocatoria, por 100. Mide presencia de registros, no representación ni ausencia de necesidades. Sin denominador acordado mostrar conteos y no porcentaje. | Cobertura de escucha es presencia de aportes ubicados en el territorio convocado: municipios con registros dividido por municipios del alcance definido. Ejemplo sintético: 2 de 10 municipios =20%. No es representatividad poblacional: miles de aportes de un municipio no representan los otros nueve. Sin alcance definido no calcular porcentaje. | — |
| Encuentro | ID, convocatoria, título, propósito, temas, modalidad, fecha/zona horaria, lugar o sala externa, estado, responsables funcionales, condiciones de acceso, ayudas disponibles y ventana de aportes. | — |
| Inscripción | ID, encuentro, estado y datos mínimos según finalidad; contacto para avisos separado de autorización para otros usos. No equivale a asistencia. | — |
| Sesión/mesa | ID, encuentro, agenda, facilitador, relator y contexto; puede atender varios territorios. | — |
| Intervención | Origen, momento, mesa y tipo; si se conserva, tratamiento apropiado. Su número no equivale a número de aportes. | — |

## 4 · `RF` — lo que el módulo hace

### RF7 — Qué hace: el revisor aclara ubicación, tema y afectación y organiza aportes en necesidades sin borrar diferencias

Qué hace: el revisor aclara ubicación, tema y afectación y organiza aportes en necesidades sin borrar diferencias. Entrada: aportes originales, versiones y evidencia declarada; salida: expediente, clasificación, vínculos y revisión con autor y motivo. NEC-01/TAX-01/CAL-01: separar problema, consecuencia y alternativa; ubicación, clasificación, confirmación y revisión tienen estados distintos. IA solo sugiere.

|  |  |
|---|---|
| **Quién lo hace** | Revisor; Moderación interviene en contenido sensible. |
| **Con qué llega** | Aportes originales, versiones, ubicación declarada, evidencia y catálogo versionado; se admiten pendientes. |
| **Qué queda después** | Expediente o vínculo con motivo, autor, calidad separada e historia; agrupación reversible sin heredar aprobaciones. |
| **Lo que NO hace** | No fusiona por tema solo, inventa hechos, borra diferencias ni asigna recursos. |
| **Regla que lo gobierna** | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No fusiona por tema solo, inventa hechos, borra diferencias ni asigna recursos. |
| **Prioridad** | — |

| Caso | Qué tiene que salir |
|---|---|
| Caso sintético de aceptación, no prueba ejecutada: 12 aportes reportan baja presión y tres contaminación en otra fuente; revisor propone agrupación, corrige ubicación y luego desagrupa un vínculo incorrecto. | Se distinguen problemas pese a compartir tema agua. Cada vínculo/corrección tiene autor, motivo y versión; desagrupar conserva originales y cortes previos, y reabre examen de prioridad/respuestas sin heredar aprobación. Calidad geográfica y revisión institucional son estados separados. |

## 6 · `I` — lo que nunca puede pasar

> ➤ Lo que no puede pasar nunca, con su porqué. Sin esto no hay criterio de cierre.

## 7 · `R` — las reglas

> ➤ Las reglas del módulo, con los mismos códigos de la especificación.

## 12 · Entendido, sin codificar todavía

| Lo que entendimos | Estado | De dónde salió |
|---|---|---|
| **La IA asiste, no decide** — La inteligencia artificial puede sugerir temas o ubicaciones, pero no toma decisiones definitivas ni consolida expedientes sin revisión humana. | confirmado | especificacion_datos_y_bi_v1.md |
| **Cuéntame de qué se trata esto. ¿Qué se hace aquí, con tus palabras?** — El revisor aclara ubicación, tema y afectación y organiza aportes en necesidades sin borrar diferencias. NEC-01/TAX-01/CAL-01: separar problema, consecuencia y alternativa; ubicación, clasificación, confirmación y revisión tienen estados distintos. AGR-01 — Quién: Revisor, consulta Analista; IA solo propone. Entrada: relatos originales, problema, lugar, periodo, afectación, versiones, calidad y evidencia declarada. Salida: (1) vínculos de aportes a la misma necesidad; (2) grupos analíticos de necesidades distintas relacionadas, con ID, miembros, criterio, autor, fecha, motivo y versión. Comparar lado a lado, mostrar diferencias y efecto en conteos antes de confirmar; aceptar/rechazar vínculos, desagrupar y conservar historia. Grupo nacional por tema mantiene necesidades locales y disensos, no los fusiona. Búsqueda sobre originales autorizados y etiquetas secundarias; no solo resumen. No fusionar por palabra común ni heredar prioridad o respuestas al desagrupar sin revisión. Caso: 100 reportes de baja presión y 2 de contaminación aparecen bajo agua conservando expedientes y afectaciones distintas. SEN-01: revisar señales poco frecuentes, graves reportadas, nuevas, sin clasificar o con disenso; registrar motivo, evidencia, incertidumbre y responsable. No descartarlas por bajo volumen. Fuente: requisitos_visibilidad_agrupacion_y_campanas_v1.md. | confirmado | corregida en la sesión |
| **¿Qué pasa cuando sale mal?** — Agrupación incorrecta se deshace conservando vínculos y cortes previos; reexaminar prioridad y respuestas sin heredar aprobaciones. Si cambia catálogo territorial conservar versión histórica y correspondencia explícita. Dato incompleto sigue visible por aclarar. | confirmado | escrito aquí |
| **¿Qué no puede pasar nunca?** — Nunca fusionar solo por etiqueta agua, convertir hipótesis en hecho ni borrar disenso. Caso propuesto: baja presión y contaminación quedan separadas; 12 aportes pueden vincular una necesidad sin representar 12 personas verificadas. | confirmado | escrito aquí |

## 13 · Lo que queda abierto

> ➤ Lo que nadie ha decidido todavía. Un módulo que se entrega con esto vacío y preguntas abiertas miente.

## La prueba del sobre cerrado

- [ ] Cada código se resuelve adentro del archivo
- [ ] Cada regla tiene al menos un caso de verificación
- [ ] Cada invariante dice qué se rompe
- [ ] Ninguna referencia a un archivo que el equipo no recibió
- [ ] Nadie tiene que preguntar qué significa una palabra
