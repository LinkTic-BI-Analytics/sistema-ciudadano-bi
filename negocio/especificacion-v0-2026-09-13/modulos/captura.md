# Captura — requerimiento

|  |  |
|---|---|
| **Código** | M01 |
| **Versión y fecha** | 2026-09-13 |
| **Depende de** | — |
| **Lo usan** | Ciudadano *(sin confirmar)*, Facilitador *(sin confirmar)* |
| **Estado en el MVP** | diseñado y no construido |

## 1 · Qué hace

Recepción de relatos por web y eventos físicos, asignación de identificadores y recolección de datos básicos sin exigir precisión técnica.

Qué hace: ayuda al ciudadano o facilitador a contar qué ocurre y dónde, sin formular un proyecto técnico. Entrada: relato libre y respuesta de ubicación, incluso sin precisar. Conserva original, canal, convocatoria y versión; permite corregir síntesis y entrega ID y comprobante seguro sin exigir correo. DAT-01, GEO-01 y N03–N05: web y eventos usan el mismo contrato; un reintento conserva ID; dos personas en dispositivo compartido pueden aportar. Contacto, evidencia y solución son opcionales según finalidad. Salida: aporte persistido y ubicación confirmada o pendiente, disponible a revisión y BI. La IA es opcional; recepción no depende de ella.

QR-02/03/04: ciudadano confirma el evento sugerido por el enlace, puede cambiar buscando nombre, municipio o fecha, o aportar sin evento cuando esté habilitado. Conservar texto ya escrito y separar evento de origen, evento confirmado y lugar del problema. QR/UTM no prueba asistencia ni confiere acceso; enlace cerrado muestra estado y alternativas vigentes. Caso: QR de A, evento confirmado B y problema en C producen un solo aporte con tres contextos distintos. Fuente: requisitos_qr_atribucion_y_contexto_evento_v1.md.

REC-01, complemento de movilización: tras recepción persistida, ciudadano puede previsualizar, descargar o compartir voluntariamente tarjeta Yo aporté; facilitador puede ayudar. Tarjeta genérica con convocatoria y enlace público, sin identidad, relato, tema sensible ni comprobante privado. No es aprobación, certificado electoral o constancia de asistencia. Compartir nunca es obligatorio ni aumenta prioridad o apoyos; no se publica automáticamente. Caso: envío fallido no genera reconocimiento; quien no comparte conserva consulta y tratamiento iguales. La invitación lleva a convocatoria, no al expediente ni a un evento heredado. Capacidad complementaria candidata a primera entrega sin comprometer núcleo. Fuente: requisito_reconocimiento_social_participacion_v1.md.

| Quién | Qué hace aquí | Qué NO puede |
|---|---|---|
| Ciudadano *(sin confirmar)* | Cuenta qué pasa, confirma la síntesis del problema y el lugar afectado. | No accede a expedientes privados ajenos ni al BI institucional; no decide por una entidad ni crea apoyos automáticos al aportar. |
| Facilitador *(sin confirmar)* | Facilita eventos presenciales y encuentros virtuales: explica agenda y reglas, organiza turnos y alternativas para quien no pudo hablar o conectarse. Registra aportes asistidos individuales o colectivos con procedencia, lugar del problema y síntesis por confirmar. Cuando recibe la responsabilidad de relator, prepara memoria con vínculos a aportes, acuerdos, disensos y pendientes para revisión. No exige cámara ni propuesta técnica. | No sustituye la confirmación de la comunidad, inventa asistencia o convierte asistentes en apoyos; no consulta datos fuera del evento y alcance autorizados. |

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

### RF5 — Registrar un aporte y entregar comprobante

Registrar un aporte y entregar comprobante. Ciudadano o facilitador introduce relato y ubicación declarada, incluso sin precisar. El sistema persiste ID único, fecha, canal, convocatoria, original y síntesis corregible; entrega comprobante seguro y estado de ubicación/revisión. Excluye asignación automática de presupuesto, verificación ficticia de identidad y ubicación inferida como hecho. DAT-01 y GEO-01. Aceptación propuesta: reenvío del mismo ID crea un aporte; dos participantes en equipo compartido crean dos; municipio incierto se conserva como pendiente.

|  |  |
|---|---|
| **Quién lo hace** | Ciudadano o Facilitador, con alcance de evento autorizado. |
| **Con qué llega** | Relato libre y respuesta sobre lugar incluso sin precisar; convocatoria vigente, canal y un identificador de envío para reconocer reintentos. |
| **Qué queda después** | Aporte persistido con ID, original y síntesis corregible, comprobante seguro y estados de ubicación/revisión. Reintento mismo ID conserva un registro; dos aportantes legítimos no se fusionan por dispositivo. |
| **Lo que NO hace** | No exige propuesta técnica, correo o ubicación exacta; no crea apoyos o financiación. |
| **Regla que lo gobierna** | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No exige propuesta técnica, correo o ubicación exacta; no crea apoyos o financiación. |
| **Prioridad** | — |

| Caso | Qué tiene que salir |
|---|---|
| Caso sintético de aceptación, no prueba ejecutada: una persona envía relato de falta de agua y ubicación sin precisar, corrige la síntesis y envía. Se interrumpe red y reintenta con mismo ID. Otra persona en el mismo equipo envía un relato similar. IA no disponible durante ambos envíos. | Resultado esperado: primer envío y reintento tienen un solo ID y comprobante tras persistencia; segundo envío legítimo conserva otro ID. Original y síntesis corregida se conservan con versión. Lugar permanece por aclarar, sin municipio inventado; ambos aportes son visibles en revisión manual y totales del BI. No se crean apoyos ni se exige correo. |

## 6 · `I` — lo que nunca puede pasar

### I1 — Reintentos técnicos no duplican aportes

Un fallo de conexión que causa un reenvío del mismo formulario no debe crear dos registros distintos en la base de datos.

**Por qué.** No hay incidente real documentado; es riesgo de diseño. Un reintento duplicado inflaría volumen y podría aparentar apoyo o recurrencia inexistente. La clave de envío debe conservar un registro y permitir recuperar su comprobante; no usar similitud o IP como sustituto de esa clave.

### I2 — No inferir datos faltantes

Si el ciudadano no proporciona un dato, el sistema no debe rellenarlo automáticamente con suposiciones.

**Por qué.** No hay incidente real documentado. Inventar municipio o identidad puede dirigir recursos y exposición hacia personas o territorios equivocados. Conservar desconocido o por aclarar; sugerencia IA no es hecho confirmado. Caso sintético: cerca de San José permanece ambiguo hasta aclaración.

## 7 · `R` — las reglas

> ➤ Las reglas del módulo, con los mismos códigos de la especificación.

## 12 · Entendido, sin codificar todavía

| Lo que entendimos | Estado | De dónde salió |
|---|---|---|
| **Cuéntame de qué se trata esto. ¿Qué se hace aquí, con tus palabras?** — Qué hace: ayuda al ciudadano o facilitador a contar qué ocurre y dónde, sin formular un proyecto técnico. Entrada: relato libre y respuesta de ubicación, incluso sin precisar. Conserva original, canal, convocatoria y versión; permite corregir síntesis y entrega ID y comprobante seguro sin exigir correo. DAT-01, GEO-01 y N03–N05: web y eventos usan el mismo contrato; un reintento conserva ID; dos personas en dispositivo compartido pueden aportar. Contacto, evidencia y solución son opcionales según finalidad. Salida: aporte persistido y ubicación confirmada o pendiente, disponible a revisión y BI. La IA es opcional; recepción no depende de ella. QR-02/03/04: ciudadano confirma el evento sugerido por el enlace, puede cambiar buscando nombre, municipio o fecha, o aportar sin evento cuando esté habilitado. Conservar texto ya escrito y separar evento de origen, evento confirmado y lugar del problema. QR/UTM no prueba asistencia ni confiere acceso; enlace cerrado muestra estado y alternativas vigentes. Caso: QR de A, evento confirmado B y problema en C producen un solo aporte con tres contextos distintos. Fuente: requisitos_qr_atribucion_y_contexto_evento_v1.md. REC-01, complemento de movilización: tras recepción persistida, ciudadano puede previsualizar, descargar o compartir voluntariamente tarjeta Yo aporté; facilitador puede ayudar. Tarjeta genérica con convocatoria y enlace público, sin identidad, relato, tema sensible ni comprobante privado. No es aprobación, certificado electoral o constancia de asistencia. Compartir nunca es obligatorio ni aumenta prioridad o apoyos; no se publica automáticamente. Caso: envío fallido no genera reconocimiento; quien no comparte conserva consulta y tratamiento iguales. La invitación lleva a convocatoria, no al expediente ni a un evento heredado. Capacidad complementaria candidata a primera entrega sin comprometer núcleo. Fuente: requisito_reconocimiento_social_participacion_v1.md. | confirmado | corregida en la sesión |
| **¿Qué pasa cuando sale mal?** — Si falla red se reintenta con el mismo ID; no mostrar comprobante antes de persistir. Si falla IA, mantener recepción visible y revisión manual, con estado de asistencia separado y reintento controlado. Ubicación ambigua queda por aclarar. Aceptación propuesta: caída durante envío no duplica; cerca de San José no inventa coordenada; 50 aportes legítimos similares no equivalen a 50 personas verificadas ni apoyos. | confirmado | escrito aquí |
| **¿Qué no puede pasar nunca?** — Nunca alterar intención u originales silenciosamente, inventar precisión geográfica o identidad, duplicar por reintento, bloquear por IP compartida ni exponer datos personales. Motivo: fidelidad, inclusión y métricas correctas. DAT-01/GEO-01/SEG-01: validar con un envío repetido, dos aportes legítimos en equipo común y uno sin municipio. Historial no significa conservar datos personales para siempre; retención requiere política. | confirmado | escrito aquí |

## 13 · Lo que queda abierto

> ➤ Lo que nadie ha decidido todavía. Un módulo que se entrega con esto vacío y preguntas abiertas miente.

## La prueba del sobre cerrado

- [ ] Cada código se resuelve adentro del archivo
- [ ] Cada regla tiene al menos un caso de verificación
- [ ] Cada invariante dice qué se rompe
- [ ] Ninguna referencia a un archivo que el equipo no recibió
- [ ] Nadie tiene que preguntar qué significa una palabra
