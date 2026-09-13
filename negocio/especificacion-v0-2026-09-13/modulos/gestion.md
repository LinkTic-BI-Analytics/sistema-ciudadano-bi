# Gestión — requerimiento

|  |  |
|---|---|
| **Código** | M04 |
| **Versión y fecha** | 2026-09-13 |
| **Depende de** | — |
| **Lo usan** | Ciudadano *(sin confirmar)*, Revisor *(sin confirmar)*, Responsable institucional *(sin confirmar)*, Entidades competentes *(sin confirmar)*, Control social *(sin confirmar)* |
| **Estado en el MVP** | diseñado y no construido |

## 1 · Qué hace

Priorización de expedientes, asignación de responsables, registro de decisiones y respuestas a las necesidades planteadas.

Qué hace: responsable institucional y entidad competente reciben expedientes, registran tratamiento, remisión, decisión, respuesta y siguiente paso. RES-01: ciudadano consulta historia comprensible con comprobante seguro, también sin correo. Recepción, respuesta, solución, financiación y ejecución son eventos distintos.

| Quién | Qué hace aquí | Qué NO puede |
|---|---|---|
| Ciudadano *(sin confirmar)* | Cuenta qué pasa, confirma la síntesis del problema y el lugar afectado. | No accede a expedientes privados ajenos ni al BI institucional; no decide por una entidad ni crea apoyos automáticos al aportar. |
| Revisor *(sin confirmar)* | Aclara, clasifica, revisa ubicación, relaciona y desagrupa necesidades en la bandeja de calidad. | No inventa ubicaciones o hechos, borra disensos ni aprueba presupuesto. Clasificaciones y agrupaciones requieren motivo y trazabilidad. |
| Responsable institucional *(sin confirmar)* | Detecta pendientes, remisiones no aceptadas y falta de atención para gestionar respuestas. | Solo decide dentro de mandato y competencia; no inventa financiación o ejecución ni cierra por silencio. Designación nominal pendiente. |
| Entidades competentes *(sin confirmar)* | Atienden y deciden según mandato. | Organismo que actúa mediante personas autorizadas; no es sinónimo del responsable individual ni una cuenta compartida. No recibe competencias por configuración técnica. |
| Control social *(sin confirmar)* | Consulta evidencia pública protegida. | Consulta solo versiones públicas protegidas; no tiene acceso implícito al BI institucional ni a identidad y relatos privados. |

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

### RF8 — Qué hace: responsable institucional y entidad competente reciben expedientes, registran tratamiento, remisión, decisión, respuesta y siguiente paso

Qué hace: responsable institucional y entidad competente reciben expedientes, registran tratamiento, remisión, decisión, respuesta y siguiente paso. RES-01: ciudadano consulta historia comprensible con comprobante seguro, también sin correo. Recepción, respuesta, solución, financiación y ejecución son eventos distintos.

|  |  |
|---|---|
| **Quién lo hace** | Responsable institucional y personas autorizadas de Entidades competentes; ciudadano consulta su respuesta protegida. |
| **Con qué llega** | Expediente, evidencia, competencia y asignación revisada; directorio real y plazos siguen pendientes de entidad. |
| **Qué queda después** | Recepción, remisión, decisión y respuesta separadas con responsable, motivo y siguiente paso; remisión no aceptada sigue pendiente. |
| **Lo que NO hace** | No garantiza solución, presupuesto o ejecución; no cierra por silencio ni atribuye causalidad automática. |
| **Regla que lo gobierna** | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No garantiza solución, presupuesto o ejecución; no cierra por silencio ni atribuye causalidad automática. |
| **Prioridad** | — |

| Caso | Qué tiene que salir |
|---|---|
| Caso sintético de aceptación, no prueba ejecutada: Entidad recibe un expediente, lo remite y la destinataria no confirma recepción. Un proyecto relacionado preexistente es descartado por falta de presupuesto. | Remisión sigue pendiente de aceptación y no aparece resuelta. Se conservan aporte y necesidad; decisión, razón y siguiente paso son eventos separados. El proyecto no se presenta como resultado causado por el aporte, ni se inventan financiación, plazos o respuesta. |

## 6 · `I` — lo que nunca puede pasar

> ➤ Lo que no puede pasar nunca, con su porqué. Sin esto no hay criterio de cierre.

## 7 · `R` — las reglas

> ➤ Las reglas del módulo, con los mismos códigos de la especificación.

## 12 · Entendido, sin codificar todavía

| Lo que entendimos | Estado | De dónde salió |
|---|---|---|
| **Cuéntame de qué se trata esto. ¿Qué se hace aquí, con tus palabras?** — Qué hace: responsable institucional y entidad competente reciben expedientes, registran tratamiento, remisión, decisión, respuesta y siguiente paso. RES-01: ciudadano consulta historia comprensible con comprobante seguro, también sin correo. Recepción, respuesta, solución, financiación y ejecución son eventos distintos. | confirmado | escrito aquí |
| **¿Qué pasa cuando sale mal?** — Remisión no aceptada sigue pendiente. Conflicto entre entidades queda en custodia de coordinación por designar; no se pierde ni duplica expediente. Entidad sin responder no cierra por silencio; umbrales y escalamiento requieren acuerdo. Proyecto descartado conserva necesidades y motivos. | confirmado | escrito aquí |
| **¿Qué no puede pasar nunca?** — Nunca inventar responsable nominal, presupuesto, respuesta o ejecución. Proyecto preexistente es antecedente, no prueba de incidencia del aporte. Caso: necesidad multidepartamental conserva un expediente con varios vínculos; falta designar coordinación real. | confirmado | escrito aquí |

## 13 · Lo que queda abierto

> ➤ Lo que nadie ha decidido todavía. Un módulo que se entrega con esto vacío y preguntas abiertas miente.

## La prueba del sobre cerrado

- [ ] Cada código se resuelve adentro del archivo
- [ ] Cada regla tiene al menos un caso de verificación
- [ ] Cada invariante dice qué se rompe
- [ ] Ninguna referencia a un archivo que el equipo no recibió
- [ ] Nadie tiene que preguntar qué significa una palabra
