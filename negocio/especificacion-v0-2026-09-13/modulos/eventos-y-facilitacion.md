# Eventos y facilitación — requerimiento

|  |  |
|---|---|
| **Código** | M05 |
| **Versión y fecha** | 2026-09-13 |
| **Depende de** | — |
| **Lo usan** | Ciudadano *(sin confirmar)*, Facilitador *(sin confirmar)*, Comunicaciones *(sin confirmar)*, Responsable de proceso *(sin confirmar)* |
| **Estado en el MVP** | diseñado y no construido |

## 1 · Qué hace

Incluye agenda pública, ficha, mesa, relatoría, disensos y pendientes de digitalización.

Facilitador y responsable de proceso organizan eventos presenciales y encuentros virtuales en vivo desde la primera entrega: ficha, agenda, enlace a sala externa autorizada, inscripción cuando aplique, turnos, formulario vinculado y relatoría. La persona puede aportar antes, durante o después dentro de la ventana publicada, incluso si no pudo asistir o conectarse. Se registra problema, territorio afectado, contexto, relato original, síntesis confirmable, procedencia de evento/mesa, acuerdos y disensos; se entrega comprobante. Relator es una responsabilidad asignada de sesión, no una cuenta compartida. La memoria vincula aportes sin duplicarlos y pasa a revisión y BI; no equivale a respuesta institucional. Se preserva captura asistida y contingencia en papel con digitalización revisada. Videoconferencia propia, captura automática de chat/grabaciones e implementación offline robusta son ampliaciones. Detalle y aceptación: especificacion_participacion_eventos_e_internet_v1.md, EVT-01 a EVT-05, WEB-01, TRT-01, BI-EVT-01 y RES-EVT-01.

| Quién | Qué hace aquí | Qué NO puede |
|---|---|---|
| Ciudadano *(sin confirmar)* | Cuenta qué pasa, confirma la síntesis del problema y el lugar afectado. | No accede a expedientes privados ajenos ni al BI institucional; no decide por una entidad ni crea apoyos automáticos al aportar. |
| Facilitador *(sin confirmar)* | Facilita eventos presenciales y encuentros virtuales: explica agenda y reglas, organiza turnos y alternativas para quien no pudo hablar o conectarse. Registra aportes asistidos individuales o colectivos con procedencia, lugar del problema y síntesis por confirmar. Cuando recibe la responsabilidad de relator, prepara memoria con vínculos a aportes, acuerdos, disensos y pendientes para revisión. No exige cámara ni propuesta técnica. | No sustituye la confirmación de la comunidad, inventa asistencia o convierte asistentes en apoyos; no consulta datos fuera del evento y alcance autorizados. |
| Comunicaciones *(sin confirmar)* | Identifica vacíos de participación y crea acciones de convocatoria desde la vista de cobertura. | No descarga contactos ni relatos privados del BI para publicidad. Usa cobertura agregada para ampliar escucha; no promete obras o decisiones garantizadas. |
| Responsable de proceso *(sin confirmar)* | Configura fases y reglas habilitadas. | No inventa autoridad, recursos, pesos o reglas de votación aprobadas; publicación y cambios de fase deben tener versión y fundamento. |

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

### RF9 — Qué hace: facilitador y responsable de proceso organizan jornadas y mesas, registran contexto, aportes individuales, relatorías colectivas, acuerdos y disensos

Qué hace: facilitador y responsable de proceso organizan jornadas y mesas, registran contexto, aportes individuales, relatorías colectivas, acuerdos y disensos. Salida: registros trazables con evento, mesa, origen y validación. Captura asistida pertenece al piloto; sincronización offline robusta es ampliación condicionada a prueba.

|  |  |
|---|---|
| **Quién lo hace** | Facilitador y Responsable de proceso; Ciudadano confirma lo registrado. |
| **Con qué llega** | Evento y mesa identificados, contexto, aportes y relatoría por validar; conectividad disponible o procedimiento asistido definido. |
| **Qué queda después** | Asistencias, aportes, relatoría, acuerdos y disensos separados, procedencia y estado de recepción. Mesa de 20 personas no genera 20 votos. |
| **Lo que NO hace** | No sustituye validación comunitaria ni promete sincronización offline robusta no probada. |
| **Regla que lo gobierna** | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No sustituye validación comunitaria ni promete sincronización offline robusta no probada. |
| **Prioridad** | — |

| Caso | Qué tiene que salir |
|---|---|
| Caso sintético de aceptación, no prueba ejecutada: Mesa de 20 asistentes registra dos aportes individuales, una relatoría colectiva y un disenso; facilitador reintenta el envío tras corte de red. | Asistentes, aportes, relatoría y disenso quedan separados con origen y estado. No se generan 20 apoyos. Reintento mismo ID no duplica; relatoría conserva versión y validación sin fingir unanimidad. No se acredita operación offline robusta. |

## 6 · `I` — lo que nunca puede pasar

### I3 — Eventos con origen y disenso

Registrar por separado asistentes, aportes individuales, relatorías colectivas, acuerdos, disensos y apoyos explícitos.

**Por qué.** asistir no equivale a aprobar.

## 7 · `R` — las reglas

> ➤ Las reglas del módulo, con los mismos códigos de la especificación.

## 12 · Entendido, sin codificar todavía

| Lo que entendimos | Estado | De dónde salió |
|---|---|---|
| **Asistencia no es apoyo** — Estar en un evento no significa estar de acuerdo con lo que allí se concluye. | confirmado | especificacion_nucleo_participacion_v2.md |
| **Cuéntame de qué se trata esto. ¿Qué se hace aquí, con tus palabras?** — Facilitador y responsable de proceso organizan eventos presenciales y encuentros virtuales en vivo desde la primera entrega: ficha, agenda, enlace a sala externa autorizada, inscripción cuando aplique, turnos, formulario vinculado y relatoría. La persona puede aportar antes, durante o después dentro de la ventana publicada, incluso si no pudo asistir o conectarse. Se registra problema, territorio afectado, contexto, relato original, síntesis confirmable, procedencia de evento/mesa, acuerdos y disensos; se entrega comprobante. Relator es una responsabilidad asignada de sesión, no una cuenta compartida. La memoria vincula aportes sin duplicarlos y pasa a revisión y BI; no equivale a respuesta institucional. Se preserva captura asistida y contingencia en papel con digitalización revisada. Videoconferencia propia, captura automática de chat/grabaciones e implementación offline robusta son ampliaciones. Detalle y aceptación: especificacion_participacion_eventos_e_internet_v1.md, EVT-01 a EVT-05, WEB-01, TRT-01, BI-EVT-01 y RES-EVT-01. | confirmado | corregida en la sesión |
| **¿Qué pasa cuando sale mal?** — Fallo de envío se reintenta con ID estable; distinguir borrador de recibido. Relatoría discutida conserva desacuerdos y rectificaciones versionadas. Cambio de vocero exige verificar representación y destinatario autorizado; no transferir datos automáticamente. | confirmado | escrito aquí |
| **¿Qué no puede pasar nunca?** — Nunca convertir asistentes en apoyos ni borrar minorías por mayoría. Caso: mesa de 20 asistentes produce relatoría y aportes reales, no 20 votos automáticos. Validar relatoría no implica unanimidad. Protocolo de impugnación y retención pendientes de entidad. | confirmado | escrito aquí |

## 13 · Lo que queda abierto

> ➤ Lo que nadie ha decidido todavía. Un módulo que se entrega con esto vacío y preguntas abiertas miente.

## La prueba del sobre cerrado

- [ ] Cada código se resuelve adentro del archivo
- [ ] Cada regla tiene al menos un caso de verificación
- [ ] Cada invariante dice qué se rompe
- [ ] Ninguna referencia a un archivo que el equipo no recibió
- [ ] Nadie tiene que preguntar qué significa una palabra
