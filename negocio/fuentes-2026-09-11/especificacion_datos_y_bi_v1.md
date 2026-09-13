# Especificación propuesta: necesidades territoriales y BI

Versión 1 · 12 de septiembre de 2026. Complementa el núcleo N01–N20 y concreta el énfasis solicitado: información visible y utilizable para tomar decisiones. No representa aprobación institucional, integración disponible ni prueba ejecutada.

## 1. Resultado que se construye

Un servicio de gobierno convierte relatos ciudadanos de canales digitales y eventos físicos en necesidades territoriales trazables. Permite localizar puntos de dolor, entender causas y afectaciones reportadas, comparar territorios, identificar vacíos de participación y organizar su revisión institucional.

La primera entrega debe permitir responder:

1. ¿Qué problemas se están expresando y en qué lugares?
2. ¿Qué diferencia hay entre los problemas de lugares que comparten una etiqueta como agua o seguridad?
3. ¿A quiénes afectan, con qué frecuencia y qué consecuencias se reportan?
4. ¿Qué información está confirmada, cuál requiere revisión y cuál falta?
5. ¿Qué lugares y contextos están poco escuchados?
6. ¿Qué necesita revisión prioritaria y quién debe atenderlo?
7. ¿Qué tratamiento se dio a los aportes y qué evidencia sustenta una decisión?

**Precisión** significa respetar ubicación, significado, unidades, procedencia, versiones e incertidumbre. Una plataforma abierta describe necesidades expresadas por sus participantes; no convierte esa participación en un censo representativo de las necesidades del país. El producto debe mostrar ambas cosas: el mapa de lo conocido y el mapa de lo que todavía no se conoce.

## 2. Alcance de la primera entrega

| Incluido | Resultado observable |
|---|---|
| Captura web y captura asistida en eventos | Ambos canales producen registros comparables con procedencia identificable. |
| Convocatoria y divulgación básica | Página con propósito, alcance, fechas, canales y efecto de participar; referencia de convocatoria en cada aporte. |
| Ubicación territorial | Catálogo territorial versionado; ubicación declarada y ubicación normalizada diferenciadas. |
| Revisión humana | Bandeja para aclarar, clasificar, revisar ubicación, relacionar y desagrupar necesidades. |
| Inventario de necesidades | Expedientes consultables por tema, territorio, afectación y estado. |
| BI institucional | Mapa, filtros, indicadores, listas y acceso al expediente con las mismas reglas de conteo. |
| Cobertura y calidad | Visibilidad de territorios sin aportes, ubicación incompleta y clasificación pendiente. |
| Priorización de revisión | Bandejas por urgencia reportada, afectación, recurrencia y falta de atención; resolución humana motivada. |
| Respuesta básica | Responsable, tratamiento, razón y siguiente paso por expediente. |
| Exportación reproducible | Datos autorizados, diccionario y contexto del corte, sin exponer identidad innecesaria. |

Fuera de esta primera entrega: asignación automática de presupuesto; votación vinculante; estimaciones representativas nacionales; mapa público de ubicaciones sensibles; integraciones de ejecución no verificadas; predicción de necesidades no reportadas; sincronización digital sin conexión no probada. Son ampliaciones condicionadas, salvo las decisiones que siempre requieran autoridad humana.

El BI institucional es parte del núcleo inicial: no se pospone como un adorno posterior a la captura. La consulta pública territorial detallada queda condicionada a reglas de divulgación y privacidad. La primera entrega pública puede limitarse a información agregada aprobada y consulta individual de comprobante.

## 3. Unidades de información

| Entidad | Qué representa | Regla de conteo |
|---|---|---|
| Aporte | Una expresión individual o colectiva con identidad de registro propia. | Un reintento técnico no crea otro aporte. Relatos distintos sí pueden hacerlo. |
| Persona participante | Persona distinguible con el nivel de identificación disponible. | Solo contar personas únicas cuando el mecanismo lo permita; de lo contrario publicar aportes, sin estimar personas. |
| Necesidad situada | Problema localizado, afectación y resultado esperado, con expediente estable. | Puede reunir varios aportes. No equivale al número de ciudadanos afectados. |
| Punto de dolor | Manifestación concreta del problema: qué ocurre y qué dificulta en la vida cotidiana. | Atributo estructurado de la necesidad; no necesariamente un punto exacto en un mapa. |
| Territorio o lugar afectado | Área, lugar o conjunto de lugares donde se reporta el problema. | Una necesidad puede vincular varios lugares. Sus subtotales no se suman como casos independientes. |
| Apoyo | Expresión explícita de respaldo bajo reglas publicadas. | Asistencia y aporte no crean apoyos automáticos. |
| Decisión y respuesta | Tratamiento institucional y comunicación de sus motivos. | Son eventos distintos del envío y de la ejecución. |

Ejemplo sintético: 12 aportes sobre una falla del mismo sistema de agua pueden vincularse a una necesidad. Tres relatos de contaminación de otra fuente permanecen como otra necesidad, aunque todos compartan el tema agua. Si la primera afecta dos municipios, el país sigue teniendo dos necesidades únicas, no tres.

## 4. Datos mínimos y captura progresiva

El ciudadano cuenta qué pasa. El sistema ayuda a estructurar sin exigir un formulario técnico completo. La ausencia de un dato no se sustituye por una inferencia presentada como hecho.

| Dato | Quién lo aporta o valida | Obligación y tratamiento |
|---|---|---|
| Identificador, fecha de recepción, canal, convocatoria | Sistema | Obligatorios y trazables. |
| Relato original | Ciudadano o facilitador | Obligatorio; puede ser transcrito, con revisión y retención apropiadas. |
| Síntesis del problema y cambio esperado | Ciudadano confirma; revisor aclara | No sustituye el original; conservar diferencias y versiones. |
| Lugar tal como se expresa | Ciudadano | Preguntar siempre; se admite «no puedo precisarlo» y aclaración posterior. |
| Código territorial normalizado | Catálogo y revisor | Solo al resolver ubicación; no obligatorio para recibir el relato. |
| Tipo de lugar y precisión | Sistema/revisor | Departamento, municipio, vereda/barrio, área, punto o sin resolver. No todos los lugares tienen igual granularidad. |
| Tema principal y subtema | IA opcional/revisor | Catálogo versionado; «por clasificar» y temas emergentes permitidos. |
| Consecuencia cotidiana | Ciudadano/revisor | Ejemplos: no asistir a clase, dedicar horas a recoger agua. No convertir automáticamente en causalidad comprobada. |
| Frecuencia y periodo del problema | Ciudadano | Distinguir fecha del problema de fecha del reporte; desconocido permitido. |
| Población o contexto afectado | Ciudadano/revisor | Declaración contextual, no cifra validada ni padrón; atributos sensibles opcionales y protegidos. |
| Urgencia reportada y prioridad revisada | Ciudadano / revisor | Campos distintos, con fundamento y fecha; no urgencia médica o policial certificada. |
| Evidencia y solución sugerida | Ciudadano | Opcionales; evidencia adjunta no equivale a validación. |
| Contacto e identificación | Ciudadano, según finalidad | Separados del dato analítico; no exigir contacto para producir un punto de dolor. |
| Estado de revisión, responsable y motivo | Institución | Obligatorios al cambiar tratamiento o agrupación. |
| Evento, mesa, carácter individual/colectivo | Facilitador | Obligatorios cuando proceda; disensos y apoyos separados. |

Toda clasificación o ubicación propuesta por IA distingue valor sugerido, valor aceptado, autor de revisión, fecha y versión del método. No se usa una única cifra de «confianza» para esconder calidad geográfica, calidad semántica y falta de verificación institucional.

## 5. Requisitos construibles

Todos los siguientes son P0 para el piloto, excepto donde se indique P1. P0 significa necesario para demostrar este recorrido; no implica un plazo prometido.

### DAT-01 · Recepción comparable

Crear aportes por web y por facilitador usando el mismo contrato de datos, con canal, convocatoria y comprobante. Entrada mínima: relato y resultado de la pregunta de ubicación, incluso «sin precisar». Un identificador de envío permite reconocer reintentos técnicos; similitud textual no basta para borrar aportes.

Aceptación: un envío repetido por interrupción conserva un ID; dos ciudadanos que usan un equipo compartido pueden crear dos aportes legítimos. Una mesa de 20 asistentes no crea 20 votos.

### GEO-01 · Resolver ubicación sin fabricar precisión

Conservar texto declarado y ubicación normalizada. Permitir corregir, vincular varios territorios y registrar alcance incierto. Una dirección residencial no se usa como lugar del problema sin confirmación. No presentar el centro de un municipio como coordenada exacta de una necesidad.

Aceptación: «cerca de San José» con varias coincidencias queda por aclarar; el aporte aparece en la bandeja de ubicación pendiente. Al aclararlo, cambian los agregados territoriales con trazabilidad. Si solo se conoce municipio, el mapa usa agregación municipal.

### NEC-01 · Crear y revisar necesidades situadas

Revisor crea expediente o propone vínculo a uno existente según problema, lugar, periodo y afectación. Puede separar una agrupación incorrecta con motivo y versiones. La IA puede sugerir candidatos; no consolidarlos como decisión definitiva.

Aceptación: baja presión y contaminación no se fusionan solo por tema agua. Una desagrupación conserva aportes y referencias previas y permite reconstruir el corte analítico anterior.

### TAX-01 · Clasificación útil para decidir

Asignar tema principal, subtema, manifestación del problema y etiquetas secundarias. Mantener catálogo versionado, opción por clasificar y propuesta de nuevo tema. Tema describe dominio; consecuencia describe afectación; alternativa describe solución.

Aceptación: «pavimenten porque no llega la ambulancia» permite distinguir movilidad, dificultad de acceso y pavimentación sugerida. Un cambio de catálogo no altera silenciosamente comparaciones históricas.

### CAL-01 · Visibilizar calidad y pendientes

Mantener estados separados para ubicación, clasificación, confirmación del relato y revisión institucional. Mostrar los registros incompletos y su proporción. La vista institucional inicial permite ver todos los registros admitidos; cada indicador declara qué estados incluye.

Aceptación: los registros sin municipio no desaparecen: se cuentan en el total de aportes y en «sin ubicación municipal resuelta», pero no en el total de municipios con registros ubicados.

### BI-01 · Explorar del país al expediente

Ofrecer mapa agregado, indicadores y lista sincronizados. Filtros mínimos: periodo de recepción, territorio, tema, canal y estado de revisión. Desagregar hasta donde la ubicación y el permiso lo permitan. Seleccionar territorio actualiza lista y métricas; seleccionar una necesidad abre su expediente.

Aceptación: mapa, tabla y exportación con iguales filtros muestran el mismo universo. Cambiar el periodo afecta todos los componentes; un resultado vacío explica los filtros y no declara ausencia de necesidades.

### BI-02 · Separar volumen, recurrencia, afectación y atención

Presentar aportes, necesidades distintas, frecuencia reportada, gravedad reportada/revisada y estado de respuesta como medidas diferentes. Evitar un único ranking de popularidad como pantalla predeterminada para decidir.

Aceptación: una necesidad grave con un aporte se encuentra por filtro de afectación y bandeja de revisión, aunque otra tenga miles. El sistema no inventa una puntuación agregada ni pesos para resolver la comparación.

### BI-03 · Mostrar territorios poco escuchados

Construir una vista de cobertura territorial y de canales, independiente del mapa de problemas. Distinguir: sin registros recibidos; registros con localización pendiente; datos recibidos con revisión pendiente; registros disponibles. Permitir a comunicaciones crear una acción de convocatoria desde un vacío observado, con responsable y posterior seguimiento.

Aceptación: municipio sin aportes se muestra como «sin aportes registrados en este periodo». Una campaña con muchos registros no convierte automáticamente el territorio en el de mayor necesidad. La participación de una comunidad pequeña continúa consultable por usuarios autorizados.

### PRI-01 · Priorizar examen con motivación

Permitir al revisor registrar criterio, evidencia o declaración, urgencia, afectación, competencia, incertidumbre y razón de la prioridad. Incluir una bandeja de necesidades poco recurrentes aún no revisadas. Ordenaciones y filtros son ayudas; el acto de priorizar tiene responsable.

Aceptación: un caso aislado se envía a revisión prioritaria con motivo; no aparece financiado. El cambio de prioridad conserva autor, fecha y razón. Los pesos o cuotas no acordados no se rellenan automáticamente.

### TRA-01 · Explicar cada resultado

Desde una métrica autorizada se puede llegar a los registros que la componen, a su procedencia y a sus reglas de inclusión. Desde una necesidad se consulta historia de aportes, agrupación, revisión, prioridad y respuesta. Descargar corte con filtros, fecha, zona horaria, versión de catálogo y diccionario.

Aceptación: otro analista reproduce el total a partir del mismo corte y regla. Una corrección posterior produce una nueva versión; no se modifica el archivo ya exportado.

### RES-01 · Cerrar el ciclo básico

Registrar recepción, revisión, remisión, decisión y respuesta como eventos separados, con responsable y siguiente paso. Mostrar falta de respuesta para gestión. No confundir respuesta con resolución ni vinculación a un proyecto con causalidad.

Aceptación: remisión no aceptada sigue pendiente. Proyecto preexistente aparece como antecedente relacionado, no como resultado de un nuevo aporte.

### SEG-01 · Separar vistas públicas e institucionales

Aplicar permisos en consulta y exportación. Identidad y contacto se almacenan separados de hechos analíticos. El mapa público no revela domicilios ni información que identifique comunidades o personas vulnerables; generalizar o suprimir detalles según política aprobada.

Aceptación: usuario de divulgación no descarga contactos o relatos privados. Un caso protegido continúa en la bandeja institucional autorizada aunque no aparezca como punto público. Umbrales públicos por definir: hasta entonces no habilitar publicación detallada.

### IA-01 · Asistencia sustituible — P1 para entrevista y clasificación automática

IA propone síntesis, temas, similitud y contexto con revisión. Captura, revisión y BI deben funcionar manualmente si la IA falla. El MVP no depende de que la IA clasifique correctamente todo relato.

Aceptación: síntesis errónea se corrige sin perder el original; fuente municipal no se presenta como dato de barrio; caída del proveedor no impide recibir un aporte.

## 6. Pantallas y preguntas de decisión

| Pantalla | Usuario | Decisión habilitada |
|---|---|---|
| Cuéntanos qué pasa | Ciudadano/facilitador | Confirmar que quedó bien expresada su necesidad. |
| Bandeja de calidad | Revisor | Aclarar ubicación, tema o síntesis antes de usar información ambigua. |
| Mapa de necesidades | Analista/gestor | Elegir qué territorio y problema investigar, viendo evidencia y limitaciones. |
| Cobertura de escucha | Comunicaciones/responsable | Identificar dónde faltan canales, eventos o convocatoria. |
| Expediente de necesidad | Revisor/entidad | Agrupar, diferenciar, priorizar examen, remitir y responder. |
| Comparador territorial | Analista | Comparar el mismo periodo, unidades y calidad, sin equiparar participación y prevalencia. |
| Gestión y respuesta | Responsable institucional | Detectar pendientes, remisiones no aceptadas y falta de atención. |

El detalle geográfico es una posibilidad del dato, no una jerarquía garantizada: nación → departamento → municipio → lugar reportado, cuando exista y sea divulgable. El producto no promete la misma resolución en todos los municipios.

## 7. Contrato mínimo de indicadores

| Indicador | Definición | Advertencia obligatoria |
|---|---|---|
| Aportes recibidos | IDs distintos recibidos en el periodo y universo filtrado, excluyendo solo reintentos técnicos del mismo envío. | No son personas ni votos. |
| Necesidades situadas | IDs distintos de expedientes en el corte y universo indicado. | La agrupación es revisable; mostrar fecha del corte. |
| Recurrencia de una necesidad | Aportes distintos vinculados al expediente en el corte. | No equivale a población afectada. |
| Ubicación municipal resuelta | Aportes con al menos un vínculo municipal aceptado / aportes del universo × 100. | Mostrar denominador y casos pendientes; múltiples municipios no multiplican el numerador. |
| Cobertura territorial | Municipios con al menos un aporte ubicado / municipios incluidos en el alcance de convocatoria × 100. | No mide representación de sus habitantes. Si el alcance no está definido, no calcular porcentaje. |
| Clasificación pendiente | Aportes pendientes de clasificación / aportes del universo × 100. | Una caída puede deberse a revisión, no a mejora de las necesidades. |
| Necesidades sin revisión | Expedientes sin revisión inicial registrada en el corte. | No inventar incumplimiento de plazo si no existe plazo definido. |
| Necesidades con respuesta | Expedientes con respuesta registrada / expedientes del universo declarado × 100. | Respuesta no equivale a solución. |

No mezclar periodos de recepción, ocurrencia del problema y decisión. La vista inicial filtra recepción; las otras fechas se habilitan con rótulo explícito. Los filtros por territorios o etiquetas múltiples usan conjuntos de IDs distintos; un total nacional se calcula sobre esos IDs, no sumando subtotales que se solapan.

Comparaciones por habitante solo se habilitan con denominador externo adecuado, fuente, periodo y geografía compatibles. Incluso entonces miden intensidad de reporte por habitante, no prevalencia del problema.

## 8. Prueba de punta a punta que define el piloto

Con datos sintéticos claramente etiquetados:

1. Registrar una necesidad rural de agua desde un evento, otra urbana de seguridad desde web y una con municipio incierto.
2. Reintentar un envío sin crear un duplicado técnico.
3. Confirmar o corregir síntesis y normalizar ubicación sin usar domicilio como sustituto.
4. Relacionar varios aportes sobre una necesidad y mantener separado otro con causa diferente.
5. Consultar mapa, listado y pendientes: todos deben reconciliar con los registros y filtros.
6. Encontrar la necesidad rural de baja recurrencia y registrar su prioridad de examen con motivo.
7. Remitir y responder sin atribuir financiación ni solución inexistentes.
8. Exportar el corte y reproducir sus métricas; verificar que otro rol no acceda a datos protegidos.

El piloto pasa cuando estas operaciones y reglas se comprueban en una implementación, no cuando el documento o el tablero tienen secciones llenas. Carga, concurrencia, tiempo de actualización, accesibilidad e idiomas deben tener metas acordadas antes de comprometer despliegue nacional; esta versión no inventa esas cifras.

## 9. Decisiones pendientes que condicionan el despliegue

Entidad y responsables, territorios y población del piloto, catálogo geográfico y cobertura local disponible, política de publicación y retención, canales y ayudas de accesibilidad, metas de servicio y volumen, recursos de convocatoria, mandato de priorización y contratos externos. Mientras se resuelven, el equipo puede construir el recorrido con catálogos versionados de prueba y datos sintéticos, sin presentarlos como el mapa real del país.
