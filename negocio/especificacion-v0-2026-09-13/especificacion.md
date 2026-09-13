# 5- Participación Ciudadana Colombia — Captura, Priorización y BI Territorial — Especificación

Qué se mide, con qué reglas y qué tiene que ser imposible. Este documento no dice cómo se
construye: se sostiene solo y sobrevive a cualquier decisión de implementación.

---

## 1. Objetivo

Un servicio de gobierno ayuda a personas sin experiencia en planeación a conocer oportunidades y expresar necesidades mediante eventos presenciales, encuentros virtuales facilitados en vivo y aportes por internet sin asistir a reuniones. La persona conoce agenda y reglas, aporta con ayuda si la necesita, confirma o corrige lo entendido y consulta el tratamiento y la respuesta. El equipo público conserva relato, procedencia y disensos, revisa información y usa BI territorial para identificar puntos de dolor, afectación y vacíos de escucha. Prioriza examen con motivos sin ocultar comunidades pequeñas por popularidad. Las tres modalidades alimentan el mismo inventario de necesidades, diferenciando asistencia, aporte, persona y apoyo. *(acordado por Revisión de diseño por el asistente, por encargo de Miguel Gomez; no acuerdo institucional)*

### El sistema responde 7 preguntas

1. ¿Qué problemas se están expresando y en qué lugares?
2. ¿Qué diferencia hay entre los problemas de lugares que comparten una etiqueta como agua o seguridad?
3. ¿A quiénes afectan, con qué frecuencia y qué consecuencias se reportan?
4. ¿Qué información está confirmada, cuál requiere revisión y cuál falta?
5. ¿Qué lugares y contextos están poco escuchados?
6. ¿Qué necesita revisión prioritaria y quién debe atenderlo?
7. ¿Qué tratamiento se dio a los aportes y qué evidencia sustenta una decisión?

### Granularidad

**La unidad de decisión.** La necesidad situada: un expediente estable que reúne problema, lugares, afectación y resultado esperado. Su tratamiento, agrupación, prioridad de examen, remisión y respuesta son decisiones trazables distintas. Una alternativa, decisión, proyecto o financiación no equivale a una necesidad ni nace automáticamente de ella. *(acordado por Revisión de diseño por el asistente, por encargo de Miguel Gomez; no acuerdo institucional)*

**La unidad de captura.** El aporte individual o colectivo, con identificador, relato original, versión, fecha, canal y convocatoria. Puede vincularse a una necesidad sin perder procedencia. Aporte, persona participante, asistencia, apoyo, necesidad y decisión son unidades diferentes; reintentar un envío no crea otro aporte. *(acordado por Revisión de diseño por el asistente, por encargo de Miguel Gomez; no acuerdo institucional)*

### Fuera de alcance

Primera entrega: captura web y asistida, convocatoria y agenda, eventos presenciales y encuentros virtuales facilitados con enlace externo, formulario asociado y relatoría; participación por internet sin reunión; revisión humana, necesidades territoriales, BI institucional, priorización de examen, respuesta y exportación protegida. No autoriza gasto, sustituye competencias, promete resolver emergencias ni convierte participación voluntaria en censo. La deliberación avanzada futura no excluye los encuentros virtuales básicos iniciales. Videoconferencia propia, captura automática de chat o grabaciones, votación vinculante, entrevista IA, sincronización offline robusta e integraciones automáticas de ejecución son ampliaciones condicionadas. El mapa público detallado exige política aprobada; no publicar datos sensibles para demostrar cobertura. Proveedor, licencias y operación de encuentros deben verificarse; no suponer integraciones disponibles. *(acordado por Revisión de diseño por el asistente, por encargo de Miguel Gomez; no acuerdo institucional)*

---

## 2. Requerimientos

### Lo que el sistema hace

| ID | Requerimiento | Regla que lo gobierna | De dónde sale | Estado |
|---|---|---|---|---|
| RF3 | Remitir directamente al nivel local, interterritorial o nacional competente, con seguimiento de recepción y atención. | — | especificacion_nucleo_participacion_v2.md, sin confirmar | pendiente |
| RF4 | El sistema debe proveer un mecanismo para que el ciudadano consulte el estado de su aporte usando un código o vía asistida, sin obligarlo a tener un correo electrónico. | — | definicion_producto_participacion_v1.md, sin confirmar | pendiente |
| RF1 | Aceptar relato libre, ubicación incompleta y ampliación posterior; contacto, evidencia y solución sugerida son opcionales según finalidad. | — | especificacion_nucleo_participacion_v2.md, sin confirmar | pendiente |
| RF2 | Mostrar relato y síntesis corregible; separar problema, resultado esperado y solución sugerida. | — | especificacion_nucleo_participacion_v2.md, sin confirmar | pendiente |
| RF12 | Qué hace: revisor y responsable institucional determinan qué necesidades examinar primero con motivo. PRI-01 usa urgencia reportada, afectación, recurrencia, competencia e incertidumbre separadas y bandeja de casos poco recurrentes no revisados. Salida: prioridad de examen con autor, fecha y evidencia; no financiación. | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No decide por popularidad sola ni inventa pesos, identidad verificada o presupuesto. | una conversación | pendiente |
| RF14 | Qué hace: administración técnica y responsable de proceso configuran roles, fases, catálogos y versiones; separan identidad/contacto del dato analítico y registran cambios y exportaciones. SEG-01: permisos de consulta y exportación deben aplicarse por rol y alcance. | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No concede autoridad sustantiva para presupuesto ni define unilateralmente retención o responsables institucionales. | una conversación | pendiente |
| RF6 | Explorar necesidades territoriales con mapa, lista e indicadores sincronizados. BI-01: analista y responsable autorizado seleccionan periodo de recepción, territorio, tema, canal y estado; obtienen IDs y métricas del mismo universo, acceso al expediente y corte exportable autorizado. Excluye censo, predicción de problemas no expresados y publicación de ubicaciones sensibles. | Solo consultar/exportar con rol y alcance autorizados. Aplicar BI-01, CAL-01 y TRA-01: mismo periodo, filtros, corte y catálogo; total por IDs distintos. SEG-01 impide identidad y datos protegidos para divulgación. Sin alcance territorial definido, cobertura porcentual no disponible. | una conversación | pendiente |
| RF9 | Qué hace: facilitador y responsable de proceso organizan jornadas y mesas, registran contexto, aportes individuales, relatorías colectivas, acuerdos y disensos. Salida: registros trazables con evento, mesa, origen y validación. Captura asistida pertenece al piloto; sincronización offline robusta es ampliación condicionada a prueba. | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No sustituye validación comunitaria ni promete sincronización offline robusta no probada. | una conversación | pendiente |
| RF13 | Qué hace: revisor y analista catalogan fuentes con origen, fecha, territorio, unidad y limitaciones. Permiten contextualizar después de escuchar el relato. IA-01 propone contexto verificable; entrevista automática es ampliación P1. No hay integración de DNP, TerriData o PIIP confirmada por mencionar su nombre. | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No inventa fuentes o integraciones ni impide captura por ausencia de IA; entrevista automática es ampliación. | una conversación | pendiente |
| RF5 | Registrar un aporte y entregar comprobante. Ciudadano o facilitador introduce relato y ubicación declarada, incluso sin precisar. El sistema persiste ID único, fecha, canal, convocatoria, original y síntesis corregible; entrega comprobante seguro y estado de ubicación/revisión. Excluye asignación automática de presupuesto, verificación ficticia de identidad y ubicación inferida como hecho. DAT-01 y GEO-01. Aceptación propuesta: reenvío del mismo ID crea un aporte; dos participantes en equipo compartido crean dos; municipio incierto se conserva como pendiente. | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No exige propuesta técnica, correo o ubicación exacta; no crea apoyos o financiación. | una conversación | pendiente |
| RF7 | Qué hace: el revisor aclara ubicación, tema y afectación y organiza aportes en necesidades sin borrar diferencias. Entrada: aportes originales, versiones y evidencia declarada; salida: expediente, clasificación, vínculos y revisión con autor y motivo. NEC-01/TAX-01/CAL-01: separar problema, consecuencia y alternativa; ubicación, clasificación, confirmación y revisión tienen estados distintos. IA solo sugiere. | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No fusiona por tema solo, inventa hechos, borra diferencias ni asigna recursos. | una conversación | pendiente |
| RF8 | Qué hace: responsable institucional y entidad competente reciben expedientes, registran tratamiento, remisión, decisión, respuesta y siguiente paso. RES-01: ciudadano consulta historia comprensible con comprobante seguro, también sin correo. Recepción, respuesta, solución, financiación y ejecución son eventos distintos. | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No garantiza solución, presupuesto o ejecución; no cierra por silencio ni atribuye causalidad automática. | una conversación | pendiente |
| RF10 | Qué hace: comunicaciones y responsable de proceso publican propósito, alcance, fechas, canales y efecto de participar. Ayudan a personas nuevas a llegar por web o evento. BI-03 permite detectar vacíos de escucha y registrar acción de convocatoria con responsable, canal y seguimiento. Marketing usa métricas agregadas. | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No explota relatos sensibles para marketing ni promete aprobación de propuestas o representatividad por volumen. | una conversación | pendiente |
| RF11 | Qué hace: ciudadano, facilitador y moderación conservan argumentos, alternativas y desacuerdos vinculados al expediente. Primera entrega registra razones y diferencias; deliberación avanzada, apoyos y votación son ampliaciones sujetas a reglas y mandato. | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. Deliberación avanzada, apoyos y votación vinculante no están habilitados por defecto en P0. | una conversación | pendiente |
| RF15 | Se debe permitir que una persona envíe, corrija o consulte un aporte por internet sin necesidad de haber asistido a un encuentro. | — | especificacion_participacion_eventos_e_internet_v1.md, sin confirmar | pendiente |
| RF16 | Si una persona menciona varios problemas en una sola intervención, el facilitador debe poder separarlos en distintos aportes manteniendo el vínculo al relato original. | — | especificacion_participacion_eventos_e_internet_v1.md, sin confirmar | pendiente |

### Cómo tiene que comportarse

| ID | Cualidad | Cómo se comprueba |
|---|---|---|
| C1 | **Trazabilidad de eventos del expediente.** Cualquier cambio de estado, agrupación o remisión debe registrar quién lo hizo, cuándo, qué versión afectó y por qué. | — |
| C2 | **Privacidad de grupos pequeños.** La publicación de datos de grupos pequeños debe ocultar o agregar información para evitar que las personas sean identificadas. | — |

---

## 3. Principios

> ➤ De dónde salen las decisiones cuando aparece un caso que nadie previó. Si no dice qué hacer, sobra.

---

## 4. Glosario

### Del dominio a la pantalla

El glosario es el idioma del dominio. **No es el idioma de la aplicación.**

> ➤ Una palabra de la columna izquierda que aparezca en una pantalla es un defecto, no una decisión.

### Definiciones

- **Alternativa**: opción de respuesta comparable, distinta del problema expresado.
- **Decisión**: acto registrado de una autoridad responsable con motivos y alcance.
- **Aporte**: Una expresión individual o colectiva con identidad de registro propia.
- **Persona participante**: Persona distinguible con el nivel de identificación disponible.
- **Necesidad situada**: Problema localizado, afectación y resultado esperado, con expediente estable.
- **Punto de dolor**: Manifestación concreta del problema: qué ocurre y qué dificulta en la vida cotidiana.
- **Territorio o lugar afectado**: Área, lugar o conjunto de lugares donde se reporta el problema.
- **Apoyo**: Expresión explícita de respaldo bajo reglas publicadas.
- **Decisión y respuesta**: Tratamiento institucional y comunicación de sus motivos.
- **Proyecto**: instrumento de ejecución cuando corresponda; también puede haber respuestas de gestión, servicio o regulación.
- **Plan Nacional de Desarrollo (PND)**: La Constitución establece una parte general y un plan de inversiones de las entidades públicas nacionales. La primera contiene objetivos, prioridades y orientaciones; el segundo proyecta programas, proyectos y recursos plurianuales dentro de un marco de sostenibilidad fiscal.
- **Expediente de necesidad**: La unidad de trabajo con identificador estable que conserva la historia, autoría, versiones, agrupaciones, remisiones, decisiones y evidencia de una necesidad.
- **Metodología General Ajustada (MGA)**: Herramienta que se utiliza para formular proyectos de inversión pública y convertir problemas y alternativas en intervenciones estructuradas.
- **Relatoría**: Problemas tratados, alternativas, acuerdos, disensos, preguntas y pendientes; versión, responsable y método de validación. Vínculos a aportes; evita duplicarlos.
- **Cobertura de escucha: municipios con al menos un aporte ubicado divididos entre municipios incluidos en alcance definido de convocatoria, por 100. Mide presencia de registros, no representación ni ausencia de necesidades. Sin denominador acordado mostrar conteos y no porcentaje.**: Cobertura de escucha es presencia de aportes ubicados en el territorio convocado: municipios con registros dividido por municipios del alcance definido. Ejemplo sintético: 2 de 10 municipios =20%. No es representatividad poblacional: miles de aportes de un municipio no representan los otros nueve. Sin alcance definido no calcular porcentaje.
- **Encuentro**: ID, convocatoria, título, propósito, temas, modalidad, fecha/zona horaria, lugar o sala externa, estado, responsables funcionales, condiciones de acceso, ayudas disponibles y ventana de aportes.
- **Inscripción**: ID, encuentro, estado y datos mínimos según finalidad; contacto para avisos separado de autorización para otros usos. No equivale a asistencia.
- **Sesión/mesa**: ID, encuentro, agenda, facilitador, relator y contexto; puede atender varios territorios.
- **Intervención**: Origen, momento, mesa y tipo; si se conserva, tratamiento apropiado. Su número no equivale a número de aportes.

> ➤ Sin definir todavía: Expediente. Cada una es una pregunta esperando.

> ➤ Definidos con términos que no lo están, y por eso siguen abiertos: Necesidad situada (usa Expediente)

### Taxonomías

> ➤ Cuando algo tiene estados o variantes, la lista completa en una tabla, con qué cambia entre uno y otro. Una taxonomía a medias produce el estado que nadie previó.

---

## 5. Reglas de negocio

### R3 — Independencia entre asistencia y apoyos

El número de asistentes a una mesa física no se traduce automáticamente en un número equivalente de votos o apoyos para las propuestas generadas en esa mesa.

> «La asistencia se cuenta por separado. Diez personas en una mesa no equivalen automáticamente a diez apoyos a todas las propuestas de la relatoría.» — de definicion_producto_participacion_v1.md, **sin confirmar por nadie**

> ➤ Falta el porqué. Una regla sin razón se racionaliza en la primera discusión: alguien dice «en este caso no aplica» y nadie tiene con qué responderle.

### R1 — Conteo de lugares en una necesidad

Si una necesidad afecta a varios municipios, no se multiplica el conteo de necesidades a nivel nacional.

> «Una necesidad puede vincular varios lugares. Sus subtotales no se suman como casos independientes.» — de especificacion_datos_y_bi_v1.md, **sin confirmar por nadie**

| Caso borde | Qué pasa |
|---|---|
| Si la primera afecta dos municipios | el país sigue teniendo dos necesidades únicas, no tres. |

**Por qué.** Una necesidad puede afectar varios territorios; sumar subtotales la duplicaría y sesgaría la priorización. BI-02/TRA-01 usan conjuntos de IDs distintos en el corte. Ejemplo sintético: necesidad A en dos municipios y B en uno totalizan dos necesidades nacionales, aunque haya tres vínculos municipales.

### R2 — Conteo de registros sin ubicación

Los aportes que no tienen un municipio definido siguen sumando al total general de aportes, pero no alteran las métricas de los municipios que sí están ubicados.

> «Los registros sin municipio no desaparecen: se cuentan en el total de aportes y en «sin ubicación municipal resuelta», pero no en el total de municipios con registros ubicados.» — de especificacion_datos_y_bi_v1.md, **sin confirmar por nadie**

| Caso borde | Qué pasa |
|---|---|
| Caso sintético de aceptación, no evento real ni prueba ejecutada: corte con 10 aportes, 7 con municipio aceptado y 3 sin resolver. Total recibido=10; pendientes=3; ubicación resuelta=70%. Si uno de los 7 tiene dos municipios, numerador sigue 7. Al aclarar otro aporte se genera un corte nuevo 8/10, sin reescribir el corte exportado anterior. | En el corte inicial deben aparecer 10 aportes recibidos, 3 pendientes de municipio y 70% de ubicación municipal resuelta; dos vínculos del mismo aporte no cambian 7 como numerador. Mapa, lista y exportación coinciden en universo. Corte posterior: 8 resueltos y 80%, sin modificar archivo anterior. |

**Por qué.** Excluirlos ocultaría barreras de captura y produciría falsa ausencia territorial. CAL-01: aportes sin municipio cuentan en total recibido y pendientes de ubicación; no en municipios con aportes ubicados. Ubicación municipal resuelta divide aportes con vínculo aceptado entre aportes del universo, sin multiplicar por vínculos.

---

## 6. Invariantes

> ➤ Cuál manda sobre todas, y por qué su incumplimiento no se puede reparar. Esta línea decide el orden de construcción.

| # | Invariante | Por qué | De dónde sale |
|---|---|---|---|
| I5 | **Selección habilitada.** Votación presupuestal solo con autoridad, presupuesto, elegibilidad, identidad proporcional, regla de selección, desempate, reclamaciones y efecto publicados. | el software no autoriza gasto. | especificacion_nucleo_participacion_v2.md, sin confirmar |
| I1 | **Reintentos técnicos no duplican aportes.** Un fallo de conexión que causa un reenvío del mismo formulario no debe crear dos registros distintos en la base de datos. | No hay incidente real documentado; es riesgo de diseño. Un reintento duplicado inflaría volumen y podría aparentar apoyo o recurrencia inexistente. La clave de envío debe conservar un registro y permitir recuperar su comprobante; no usar similitud o IP como sustituto de esa clave. | especificacion_datos_y_bi_v1.md, sin confirmar |
| I2 | **No inferir datos faltantes.** Si el ciudadano no proporciona un dato, el sistema no debe rellenarlo automáticamente con suposiciones. | No hay incidente real documentado. Inventar municipio o identidad puede dirigir recursos y exposición hacia personas o territorios equivocados. Conservar desconocido o por aclarar; sugerencia IA no es hecho confirmado. Caso sintético: cerca de San José permanece ambiguo hasta aclaración. | especificacion_datos_y_bi_v1.md, sin confirmar |
| I3 | **Eventos con origen y disenso.** Registrar por separado asistentes, aportes individuales, relatorías colectivas, acuerdos, disensos y apoyos explícitos. | asistir no equivale a aprobar. | especificacion_nucleo_participacion_v2.md, sin confirmar |
| I4 | **Agrupación reversible.** Sugerir similitudes sin fusionar automáticamente por palabras compartidas. Conservar originales, diferencias, motivos y vínculos al desagrupar. | una etiqueta común puede ocultar problemas distintos. | especificacion_nucleo_participacion_v2.md, sin confirmar |
| I6 | **No divulgar identidad ni ubicación sensible a un rol no autorizado, ni ofrecer mapas y exportaciones con universos contradictorios.** No divulgar identidad ni ubicación sensible a un rol no autorizado, ni ofrecer mapas y exportaciones con universos contradictorios. Motivo: daño a personas y decisiones equivocadas. SEG-01/BI-01/TRA-01. Aceptación sintética: comunicaciones no descarga contactos; caso protegido sigue en bandeja autorizada; mismos filtros producen mismo total. | No existe incidente real documentado; es un riesgo de diseño. Exponer identidad puede causar daño y desalentar participación, especialmente en comunidades pequeñas. Caso sintético: rol Comunicaciones intenta exportar contactos y obtiene denegación; un revisor autorizado conserva acceso al expediente protegido según política. | una conversación |

> ➤ Ninguna trae costo puesto, y hay que decirlo: significa que nadie ha visto todavía lo que este sistema tiene que impedir.

---

## 8. Rituales

> ➤ Lo que alguien hace cada día, cada semana o cada mes. Es lo que decide qué pantalla tiene que ser rápida.

---

## 9. Cómo se verifica

Las fórmulas se comparan contra números calculados a mano, nunca contra lo que el sistema
devolvió la primera vez.

| Caso | Resultado |
|---|---|
| un envío repetido por interrupción | conserva un ID (I1) |
| Si la primera afecta dos municipios | el país sigue teniendo dos necesidades únicas, no tres. (R1) |
| una persona registra agua intermitente en una vereda sin saber la entidad ni adjuntar estudios | recibe comprobante; la ubicación queda pendiente de aclaración, no inventada. (RF1) |
| una transcripción cambia acueducto por alcantarillado; la persona corrige antes de validar | la versión confirmada es la que se revisa, con historia apropiada. (RF2) |
| diez asistentes y dos disensos | no producen diez apoyos automáticos; ninguna edición posterior borra el desacuerdo original silenciosamente. (I3) |
| agua por contaminación y agua por baja presión pueden relacionarse por tema | siguen distinguiéndose y permiten respuestas diferentes. (I4) |
| sin presupuesto habilitado, recibir cien apoyos | no genera proyecto financiado ni una papeleta vinculante. (I5) |
| una cuestión nacional | no requiere pasar obligatoriamente por alcalde y gobernador (RF3) |
| una petición de mantenimiento local | no se presenta como compromiso del PND. (RF3) |
| Caso sintético de aceptación, no evento real ni prueba ejecutada: corte con 10 aportes, 7 con municipio aceptado y 3 sin resolver. Total recibido=10; pendientes=3; ubicación resuelta=70%. Si uno de los 7 tiene dos municipios, numerador sigue 7. Al aclarar otro aporte se genera un corte nuevo 8/10, sin reescribir el corte exportado anterior. | En el corte inicial deben aparecer 10 aportes recibidos, 3 pendientes de municipio y 70% de ubicación municipal resuelta; dos vínculos del mismo aporte no cambian 7 como numerador. Mapa, lista y exportación coinciden en universo. Corte posterior: 8 resueltos y 80%, sin modificar archivo anterior. (R2) |
| Caso sintético de aceptación de RF6, no prueba ejecutada: analista autorizado abre corte de 10 aportes, 7 ubicados y 3 por aclarar. Dos aportes se vinculan a necesidad A que afecta dos municipios; un aporte se vincula a necesidad B rural de baja recurrencia. Selecciona periodo, territorio, tema, canal y revisión, abre B desde la lista y exporta el mismo corte. Luego cambia periodo a uno sin registros. Comunicaciones intenta exportar contactos. | Resultado esperado: corte inicial muestra 10 aportes, 7 ubicados, 3 pendientes y 70% de ubicación resuelta. A cuenta una sola vez nacionalmente aunque tenga dos municipios. B puede encontrarse y abrirse sin ranking de popularidad. Cada cambio de filtro actualiza mapa, indicadores, lista y exportación sobre los mismos IDs autorizados; exportación conserva corte, filtros, fecha/zona horaria, catálogo y diccionario. Periodo vacío explica sin registros en ese periodo, no ausencia de necesidades. Acceso de Comunicaciones a contactos se deniega. No se modifica un archivo exportado previamente. (RF6) |
| Caso sintético de aceptación, no prueba ejecutada: una persona envía relato de falta de agua y ubicación sin precisar, corrige la síntesis y envía. Se interrumpe red y reintenta con mismo ID. Otra persona en el mismo equipo envía un relato similar. IA no disponible durante ambos envíos. | Resultado esperado: primer envío y reintento tienen un solo ID y comprobante tras persistencia; segundo envío legítimo conserva otro ID. Original y síntesis corregida se conservan con versión. Lugar permanece por aclarar, sin municipio inventado; ambos aportes son visibles en revisión manual y totales del BI. No se crean apoyos ni se exige correo. (RF5) |
| Caso sintético de aceptación, no prueba ejecutada: 12 aportes reportan baja presión y tres contaminación en otra fuente; revisor propone agrupación, corrige ubicación y luego desagrupa un vínculo incorrecto. | Se distinguen problemas pese a compartir tema agua. Cada vínculo/corrección tiene autor, motivo y versión; desagrupar conserva originales y cortes previos, y reabre examen de prioridad/respuestas sin heredar aprobación. Calidad geográfica y revisión institucional son estados separados. (RF7) |
| Caso sintético de aceptación, no prueba ejecutada: Entidad recibe un expediente, lo remite y la destinataria no confirma recepción. Un proyecto relacionado preexistente es descartado por falta de presupuesto. | Remisión sigue pendiente de aceptación y no aparece resuelta. Se conservan aporte y necesidad; decisión, razón y siguiente paso son eventos separados. El proyecto no se presenta como resultado causado por el aporte, ni se inventan financiación, plazos o respuesta. (RF8) |
| Caso sintético de aceptación, no prueba ejecutada: Mesa de 20 asistentes registra dos aportes individuales, una relatoría colectiva y un disenso; facilitador reintenta el envío tras corte de red. | Asistentes, aportes, relatoría y disenso quedan separados con origen y estado. No se generan 20 apoyos. Reintento mismo ID no duplica; relatoría conserva versión y validación sin fingir unanimidad. No se acredita operación offline robusta. (RF9) |
| Caso sintético de aceptación, no prueba ejecutada: Comunicaciones observa municipio sin registros en un periodo y crea acción de escucha desde cobertura; termina vigencia de convocatoria. | Acción tiene responsable, canal y seguimiento; ausencia de registros no se presenta como ausencia de necesidad. Material informa estado real y límites; no promete recepción en convocatoria cerrada. Recordatorios requieren solicitud y no se exportan relatos sensibles para publicidad. (RF10) |
| Caso sintético de aceptación, no prueba ejecutada: Participante plantea alternativa y otro disiente; IA marca como ofensiva una crítica legítima. La alternativa se modifica posteriormente. | Se conserva disenso y relación con la versión original. Moderación humana revisa señal IA sin censura automática ni publicación de datos privados. No trasladar respaldos a una alternativa distinta; deliberación avanzada y voto permanecen fuera del piloto. (RF11) |
| Caso sintético de aceptación, no prueba ejecutada: Necesidad rural grave tiene un aporte y otra urbana miles; revisor consulta afectación y propone examinar primero la rural. | Ambas son encontrables. Se registra prioridad de examen con autor, fecha, evidencia/incertidumbre y motivo. No aparecen financiación, votos multiplicados o pesos inventados; una revisión posterior conserva historia. (RF12) |
| Caso sintético de aceptación, no prueba ejecutada: Fuente municipal está desactualizada y falta información de barrio; el proveedor de IA no responde mientras se captura un aporte. | Fuente marcada con periodo, territorio y limitación; no se inventa dato barrial ni se atribuye al ciudadano. Recepción y revisión manual continúan. No se declara integración externa operativa por mencionar una fuente. (RF13) |
| Caso sintético de aceptación, no prueba ejecutada: Administrador configura rol Comunicaciones y este intenta descargar contactos y consultar expediente restringido. Se modifica catálogo y se retira un permiso. | Acceso no autorizado se deniega y cambios son auditables/versionados. Fuente histórica no se reescribe; permiso revocado no habilita nuevas consultas. Permiso técnico no concede autoridad presupuestal; publicación detallada permanece deshabilitada sin política aprobada. (RF14) |
| quien no pudo conectarse envía dentro de la ventana | recibe el mismo tratamiento inicial (RF15) |

> ➤ Sin ningún caso todavía: R3. Una regla sin caso es una regla que nadie va a poder comprobar.

### Fallas que este dominio produce

> ➤ Los errores que ya ocurrieron, cada uno con el código que ahora lo previene. Si no hay ninguno registrado, decirlo: es un hueco, no un logro.

---

## 10. Estado

**Nada de esto está construido.** Los frentes, en el orden en que tienen que construirse:

> ➤ Esta lista es una hipótesis, no un plan, y se escribe el día en que menos se sabe. Un frente que se cae no se borra: se marca `caído` con la razón.

---

## 11. Lo que falta cargar

Datos, no decisiones. Las decisiones abiertas viven en `vacios.md`.

| Qué falta | Qué desbloquea | Qué se puede construir sin esto |
|---|---|---|
| Entidad y responsables del sistema | — | — |
| Territorios y población del piloto | — | — |
| Catálogo geográfico exacto a utilizar | — | — |
| Política de publicación y retención de datos | — | — |
| Metas de servicio, carga y volumen esperado | — | — |
| Nombres de entidades y personas responsables del piloto siguen pendientes. | — | — |
| Entidad convocante, autoridad que decide, responsables de respuesta, presupuesto, calendario, territorios piloto, capacidad operativa, mecanismo de priorización y sistemas disponibles. | — | — |
| Números de panelistas, pesos de puntuación, cuotas presupuestales, metas de adopción o umbrales de cobertura. | — | — |
| No especifica qué motor de base de datos o infraestructura en la nube se debe utilizar. | — | — |
| No detalla los campos exactos del formulario de inscripción a un evento físico. | — | — |
| No define el tiempo máximo (SLA) que tiene el equipo institucional para dar una respuesta a una necesidad. | — | — |
| No explica cómo se integrará técnicamente con los sistemas de ejecución presupuestal existentes. | — | — |
| No define quién es la autoridad específica que toma la decisión final. | — | — |
| No detalla la fórmula matemática o el mecanismo exacto de desempate para la asignación de presupuesto. | — | — |
| El presupuesto exacto con el que cuenta la entidad para financiar los proyectos priorizados. | — | — |
| La lista definitiva de entidades sectoriales que participarán en el piloto. | — | — |
| El inventario real de licencias y capacidades tecnológicas que ya posee el DNP. | — | — |
| El mandato oficial definitivo de la entidad promotora para ejecutar este diseño | — | — |
| El presupuesto exacto disponible para la operación tecnológica y territorial del sistema | — | — |
| Cómo se hace hoy de verdad: «¿Cómo lo resuelves hoy sin nosotros?» | Sin el sustituto actual no sabemos qué tiene que ser mejor, ni si el problema existe. | — |
| Cómo se hace hoy de verdad: «Cuéntame el último día que usaste esto, paso a paso.» | Sin el recorrido mínimo no hay por dónde empezar a construir. | — |
| Cómo se hace hoy de verdad: «¿Cómo lo resuelves hoy sin nosotros?» | Sin el sustituto actual no sabemos qué tiene que ser mejor, ni si el problema existe. | — |
| Cómo se hace hoy de verdad: «Cuéntame el último día que usaste esto, paso a paso.» | Sin el recorrido mínimo no hay por dónde empezar a construir. | — |
| Cómo se hace hoy de verdad: «¿Cómo lo resuelves hoy sin nosotros?» | Sin el sustituto actual no sabemos qué tiene que ser mejor, ni si el problema existe. | — |
| Cómo se hace hoy de verdad: «Cuéntame el último día que usaste esto, paso a paso.» | Sin el recorrido mínimo no hay por dónde empezar a construir. | — |
| Cómo se hace hoy de verdad: «¿Cómo lo resuelves hoy sin nosotros?» | Sin el sustituto actual no sabemos qué tiene que ser mejor, ni si el problema existe. | — |
| Cómo se hace hoy de verdad: «Cuéntame el último día que usaste esto, paso a paso.» | Sin el recorrido mínimo no hay por dónde empezar a construir. | — |
| Cómo se hace hoy de verdad: «¿Cómo lo resuelves hoy sin nosotros?» | Sin el sustituto actual no sabemos qué tiene que ser mejor, ni si el problema existe. | — |
| Cómo se hace hoy de verdad: «Cuéntame el último día que usaste esto, paso a paso.» | Sin el recorrido mínimo no hay por dónde empezar a construir. | — |
| Cómo se hace hoy de verdad: «¿Cómo lo resuelves hoy sin nosotros?» | Sin el sustituto actual no sabemos qué tiene que ser mejor, ni si el problema existe. | — |
| Cómo se hace hoy de verdad: «Cuéntame el último día que usaste esto, paso a paso.» | Sin el recorrido mínimo no hay por dónde empezar a construir. | — |
| Cómo se hace hoy de verdad: «¿Cómo lo resuelves hoy sin nosotros?» | Sin el sustituto actual no sabemos qué tiene que ser mejor, ni si el problema existe. | — |
| Cómo se hace hoy de verdad: «Cuéntame el último día que usaste esto, paso a paso.» | Sin el recorrido mínimo no hay por dónde empezar a construir. | — |
| Cómo se hace hoy de verdad: «¿Cómo lo resuelves hoy sin nosotros?» | Sin el sustituto actual no sabemos qué tiene que ser mejor, ni si el problema existe. | — |
| Cómo se hace hoy de verdad: «Cuéntame el último día que usaste esto, paso a paso.» | Sin el recorrido mínimo no hay por dónde empezar a construir. | — |
| Cómo se hace hoy de verdad: «¿Cómo lo resuelves hoy sin nosotros?» | Sin el sustituto actual no sabemos qué tiene que ser mejor, ni si el problema existe. | — |
| Cómo se hace hoy de verdad: «Cuéntame el último día que usaste esto, paso a paso.» | Sin el recorrido mínimo no hay por dónde empezar a construir. | — |
| Cómo se hace hoy de verdad: «¿Cómo lo resuelves hoy sin nosotros?» | Sin el sustituto actual no sabemos qué tiene que ser mejor, ni si el problema existe. | — |
| Cómo se hace hoy de verdad: «Cuéntame el último día que usaste esto, paso a paso.» | Sin el recorrido mínimo no hay por dónde empezar a construir. | — |
| Cuáles son los proveedores de software de videollamada autorizados o compatibles. | — | — |
| Cuál es el protocolo institucional exacto para resolver objeciones o disensos en las relatorías. | — | — |
| Cuánto tiempo dura exactamente la 'ventana de aportes' antes, durante o después de un evento. | — | — |
| Cómo se maneja el almacenamiento y retención a largo plazo de las grabaciones si se decide habilitarlas. | — | — |
