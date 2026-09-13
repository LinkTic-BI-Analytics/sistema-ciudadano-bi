# Núcleo de especificación del producto de participación ciudadana

> Actualización de alcance del 13 de septiembre de 2026: la primera entrega incluye encuentros virtuales facilitados mediante sala externa, captura asociada y relatoría revisable, además de eventos presenciales y participación web sin reunión. Consultar `especificacion_participacion_eventos_e_internet_v1.md` para el recorrido, modelo, tratamiento, BI y pruebas. La exclusión de deliberación avanzada no excluye estos encuentros virtuales básicos.

Documento de trabajo, 12 de septiembre de 2026. Deriva de la investigación refinada v2 y de la definición de producto v1. Hace explícitas sus relaciones, condiciones y pruebas para reducir pérdidas al convertir narrativa en requerimientos. Todas las reglas son propuestas de diseño; no constituyen acuerdos institucionales, capacidades construidas ni resultados de pruebas reales. Los ejemplos de prueba son sintéticos.

## Objetivo y alcance

Una persona en Colombia sin experiencia en participación debe poder descubrir una convocatoria, comprender sus límites, expresar una necesidad cotidiana, confirmar que fue comprendida, discutir alternativas y consultar una respuesta verificable. El equipo de gobierno puede divulgar, captar por web y eventos físicos, revisar, priorizar según la fase y responder sin borrar diferencias territoriales o disensos. No se exige al ciudadano conocer ministerios, ejes del PND o códigos de proyectos.

La primera entrega propuesta conecta convocatoria, captura, confirmación, revisión y respuesta. Discusión avanzada, voz, entrevistador contextual, sincronización offline robusta e integración de ejecución se incorporan según validación y capacidad. Una priorización presupuestal pasa al piloto solo si es el encargo habilitado y se ajusta el resto del alcance. Ninguna ampliación posterior se interpreta como prohibición permanente. Un mes no es un plazo nacional confirmado.

## Preguntas que debe responder el producto

1. ¿Para qué me convocan, qué puedo influir y quién responderá?
2. ¿Cómo expreso lo que ocurre sin formular un proyecto técnico?
3. ¿Mi aporte conserva lo que quise decir y las diferencias de mi comunidad?
4. ¿Cómo se revisa, quién lo atiende y cómo corrijo un error?
5. ¿Qué alternativas se comparan, con qué reglas y qué significa mi apoyo?
6. ¿Por qué se adoptó o descartó una alternativa y qué puedo hacer ahora?
7. ¿Qué contextos tuvieron oportunidad real de participar y cuáles siguen ausentes?
8. ¿Qué vínculos comprobados existen entre los aportes, las decisiones y los resultados?

## Modelo de información y propiedad funcional

Aporte: registro de una expresión individual o colectiva con identificador, relato original, versión, canal, fecha y contexto; su autoría y contacto no son necesariamente públicos. Necesidad situada: problema contextualizado, lugar, afectación y cambio esperado; su expediente conserva historia estable y puede reunir varios aportes. Alternativa: opción de respuesta comparable, distinta del problema expresado. Decisión: acto registrado de una autoridad responsable con motivos y alcance. Proyecto: instrumento de ejecución cuando corresponda; también puede haber respuestas de gestión, servicio o regulación. Respuesta: comunicación verificable del tratamiento o decisión al participante.

Proceso participativo, convocatoria, evento, mesa, aporte, necesidad, alternativa, decisión, respuesta, proyecto e indicador son entidades diferentes. Sus relaciones no implican equivalencia ni causalidad automática. Una relación de agrupación tiene autor, motivo, versión y posibilidad de revisión; una remisión identifica destino, responsable y estado; un vínculo de incidencia incluye evidencia. Una necesidad puede seguir en otro ciclo conservando historia. El cierre de convocatoria no suprime por sí mismo el expediente; la política de conservación depende de tipo de dato y finalidad.

Los participantes confirman su relato. Los facilitadores registran el origen asistido y validación de la mesa. Los revisores institucionales caracterizan y proponen agrupaciones/rutas. Las entidades competentes atienden y deciden según mandato. Comunicaciones administra convocatorias. El responsable de proceso configura fases y reglas habilitadas. Administración gestiona permisos, catálogos y auditoría. Control social consulta evidencia pública protegida. Nombres de entidades y personas responsables del piloto siguen pendientes.

## Módulos funcionales propuestos

Captura accesible incluye portal ciudadano, relato, síntesis, comprobante y consulta asistida. Eventos y facilitación incluye agenda pública, ficha, mesa, relatoría, disensos y pendientes de digitalización. Convocatoria y divulgación incluye ficha oficial, páginas, materiales, canales, recordatorios solicitados y métricas agregadas. Revisión institucional incluye bandeja, expediente, agrupaciones, competencias, remisión y respuesta. Discusión incluye diferencias, apoyos y alternativas. Priorización configura examen, deliberación y, solo cuando aplique, selección presupuestal. Contexto documental administra fuentes verificables e IA asistente. Analítica separa participación, necesidades, gestión y ejecución. Respuesta y seguimiento muestra historia comprensible e incidencia documentada. Administración contiene permisos, privacidad, versiones y exportación. Son funciones de un servicio compartido, no diez aplicaciones independientes.

## Requerimientos y criterios de aceptación

### N01 Convocatoria comprensible

El proceso publica propósito, decisión abierta, entidad que responde, cortes, canales de ayuda y efecto de participar antes de recibir aportes. Los materiales de divulgación usan la misma ficha vigente. Motivo: evitar promesas distintas entre publicidad y trámite. Prueba sintética: al cambiar una fecha, página y materiales identifican versión vigente; si no existe responsable no se publica una promesa de respuesta institucional ya garantizada.

### N02 Captura mínima y gradual

Aceptar relato libre, ubicación incompleta y ampliación posterior; contacto, evidencia y solución sugerida son opcionales según finalidad. El lugar de la necesidad puede diferir del domicilio. Motivo: no excluir por falta de conocimiento técnico. Prueba: una persona registra agua intermitente en una vereda sin saber la entidad ni adjuntar estudios y recibe comprobante; la ubicación queda pendiente de aclaración, no inventada.

### N03 Fidelidad y confirmación

Mostrar relato y síntesis corregible; separar problema, resultado esperado y solución sugerida. Voz e IA son modalidades opcionales, no requisitos. Motivo: la síntesis no debe sustituir la intención. Prueba: una transcripción cambia acueducto por alcantarillado; la persona corrige antes de validar y la versión confirmada es la que se revisa, con historia apropiada.

### N04 Contexto después de escuchar

Escuchar primero. Solo después presentar antecedentes e indicadores con fuente, período y geografía adecuados. Reconocer ausencia o antigüedad del dato. Motivo: evitar dirigir el relato o inventar autoridad contextual. Prueba: si solo hay dato municipal, el entrevistador no afirma una cifra del barrio; registra fuente y versión del guion.

### N05 Eventos con origen y disenso

Registrar por separado asistentes, aportes individuales, relatorías colectivas, acuerdos, disensos y apoyos explícitos. Validar relatoría de forma accesible; rectificaciones posteriores conservan versión, motivo y nueva validación cuando corresponda. Motivo: asistir no equivale a aprobar. Prueba: diez asistentes y dos disensos no producen diez apoyos automáticos; ninguna edición posterior borra el desacuerdo original silenciosamente.

### N06 Continuidad sin conexión

El piloto admite contingencia en papel y digitalización revisada. Una modalidad digital offline requiere cola local, identificador temporal, estado visible y resolución de conflictos antes de declararse confiable. Motivo: no perder registros ni fabricar envíos. Prueba: interrumpir conexión deja pendiente visible; al reintentar no duplica un mismo envío. Esta prueba técnica aún no ha sido realizada.

### N07 Agrupación reversible

Sugerir similitudes sin fusionar automáticamente por palabras compartidas. Conservar originales, diferencias, motivos y vínculos al desagrupar. Motivo: una etiqueta común puede ocultar problemas distintos. Prueba: agua por contaminación y agua por baja presión pueden relacionarse por tema, pero siguen distinguiéndose y permiten respuestas diferentes.

### N08 Comunidades pequeñas visibles

Mantener revisión de necesidades poco frecuentes y detectar contextos ausentes; proteger tanto comunidades rurales dispersas como minorías urbanas y disensos internos. Garantizar oportunidad de revisión y respuesta, sin aprobación automática ni votos multiplicados. Motivo: volumen de aportes no equivale a gravedad o inclusión. Prueba: un caso de una comunidad pequeña permanece localizable, con responsable y motivo de tratamiento, aunque lleguen miles de solicitudes urbanas; se revisan también perjuicios sobre terceros.

### N09 Prioridad de examen

Revisar urgencia, afectación, posibles obligaciones, competencia y barreras; recurrencia es un dato adicional. Registrar criterios, responsable y dudas. Motivo: decidir qué examinar no equivale a asignar inversión. Prueba: un caso aislado grave puede pasar a revisión prioritaria sin que el sistema declare aprobado su financiamiento.

### N10 Deliberación comparable

Comparar alternativas por resultado, competencia, restricciones, costos estimados cuando existan, riesgos y diferencias locales. Conservar desacuerdos. Motivo: pedir una obra no elimina otras soluciones posibles. Prueba: una demanda de seguridad permite comparar iluminación, atención o gestión según evidencia y competencia, sin asumir cámaras como única respuesta.

### N11 Selección habilitada

Votación presupuestal solo con autoridad, presupuesto, elegibilidad, identidad proporcional, regla de selección, desempate, reclamaciones y efecto publicados. Una consulta se identifica como orientativa. Motivo: el software no autoriza gasto. Prueba: sin presupuesto habilitado, recibir cien apoyos no genera proyecto financiado ni una papeleta vinculante.

### N12 Ruta por competencia

Remitir directamente al nivel local, interterritorial o nacional competente, con seguimiento de recepción y atención. Registrar devolución o conflicto de competencia y responsable de resolverlo. Motivo: no exigir una escalera de avales que bloquee la necesidad. Prueba: una cuestión nacional no requiere pasar obligatoriamente por alcalde y gobernador; una petición de mantenimiento local no se presenta como compromiso del PND.

### N13 Respuesta y reclamación

Cada expediente muestra estado comprensible, responsable y siguiente paso. Una no adopción conserva motivos y ruta de revisión u otro ciclo. La falta de respuesta institucional queda visible para gestión. Motivo: capturar sin devolver no cierra participación. Prueba: una remisión no aceptada sigue pendiente y no aparece como resuelta; el ciudadano puede reportar un error de agrupación.

### N14 Incidencia verificable

Distinguir recibido, examinado, incorporado, financiado, ejecutado y resultado. Registrar vínculos muchos-a-muchos con soporte; no afirmar que una obra ocurrió por un aporte sin evidencia. Motivo: seguimiento no es propaganda causal. Prueba: un proyecto anterior relacionado se muestra como antecedente, no como logro provocado por la nueva solicitud.

### N15 Cuatro vistas analíticas

Separar cobertura de participación, necesidades expresadas, gestión de expedientes y ejecución/resultados. Mostrar fecha, canal, límites y unidades. No extrapolar apoyos voluntarios como preferencias nacionales representativas. Motivo: una mayor campaña puede generar mayor volumen sin mayor necesidad. Prueba: mil aportes no se etiquetan como mil personas verificadas; un territorio sin registros aparece como falta de evidencia, no ausencia de necesidades.

### N16 Privacidad proporcional

Separar identidad y contacto del contenido público; minimizar ubicación y datos sensibles. Definir acceso, conservación y supresión según finalidad. Conservar el original frente a una síntesis no significa almacenar para siempre audio o información personal. Motivo: una comunidad pequeña puede identificarse incluso sin nombre. Prueba: una vista pública oculta detalle identificador manteniendo la necesidad en análisis; consulta por comprobante no expone expedientes ajenos.

### N17 Controles revisables

Alertas de abuso y duplicidad no eliminan automáticamente registros por compartir conexión o textos similares. Diferenciar envío, persona identificada, apoyo y voto. Motivo: centros comunitarios comparten dispositivos y hay reiteraciones legítimas. Prueba: cincuenta aportes desde un punto de ayuda no se descartan como bots sin revisión; los apoyos verificados no se confunden con asistentes.

### N18 Divulgación cívica

Adaptar idioma, formato y logística; no usar preferencias políticas inferidas o relatos sensibles como perfiles publicitarios. Recordatorios requieren preferencia de contacto; participar no exige aceptar promoción. Motivo: facilitar acceso sin condicionar expresión ni comprar popularidad. Prueba: una persona que rechaza recordatorios puede enviar y consultar su aporte; métricas de campaña no transmiten el relato a redes publicitarias.

### N19 IA y responsabilidad

IA sugiere transcripción, síntesis, temas, agrupaciones, contexto y borradores; personas responsables revisan. No asigna presupuesto ni determina legitimidad. Conservar versión, fuente y revisión de sugerencias. Motivo: automatizar lectura no delega autoridad. Prueba: una ruta sugerida por IA se puede corregir y no se publica como decisión institucional hasta revisión autorizada.

### N20 Integraciones y fallos

TerriData, SINERGIA y PIIP son candidatos, no conexiones disponibles probadas. Verificar muestras, custodios, permisos y periodicidad; permitir importación revisada antes de automatizar. Motivo: la disponibilidad de información no garantiza interoperabilidad. Prueba: fuente externa desactualizada muestra fecha y limitación; no inventa estado ni cambia financiado a ejecutado por falta de respuesta.

## Decisiones realmente abiertas

Entidad convocante, autoridad que decide, responsables de respuesta, presupuesto, calendario, territorios piloto, capacidad operativa, mecanismo de priorización y sistemas disponibles. No se rellenan atribuyendo mandato al DNP por inferencia. Tampoco están fijados números de panelistas, pesos de puntuación, cuotas presupuestales, metas de adopción o umbrales de cobertura. Se puede diseñar y probar el recorrido neutral mientras se resuelven, sin publicarlo como programa oficial.

## Definición de resultado aceptable de especificación

El equipo que construya debe poder relacionar cada N01–N20 con módulo, actor, datos, estado, regla y prueba. La presencia del texto en un archivo cargado no equivale a estar representado en la especificación. Si una extracción omite o altera condiciones, conserva el requisito fuente y marca la discrepancia. Ningún porcentaje interno reemplaza revisar estas relaciones. Esta definición evalúa el documento de producto; aún deben ejecutarse pruebas de usabilidad, operación, accesibilidad y seguridad sobre una implementación real.
