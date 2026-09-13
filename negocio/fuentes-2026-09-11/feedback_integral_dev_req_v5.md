# Feedback integral para ajustar dev-req

Versión 5 · 12 de septiembre de 2026

Documento para producto, desarrollo y pruebas de dev-req. Consolida las pruebas segunda, tercera y cuarta y el cierre posterior de confirmaciones y actores. Reemplaza esos informes como lista de trabajo vigente, conservándolos como evidencia histórica.

## 1. Resultado esperado

Dev-req debe transformar documentos, conversación y decisiones en una especificación que otra persona pueda entender, estimar, construir y verificar sin reconstruir la conversación original.

El principal problema observado es que **capturar, confirmar y estructurar no son lo mismo**. La herramienta conserva mejor el contenido que antes, pero todavía exige saber qué ruta de captura alimenta cada sección del entregable. Parte de la información ya proporcionada aparece como explicación confirmada mientras las dimensiones de reglas o pruebas permanecen incompletas. No todo porcentaje bajo significa que el usuario no dio información.

El ajuste debe conseguir que cada faltante explique qué falta, si existe en alguna fuente, quién debe resolverlo y qué acción permite cerrarlo. La cobertura debe servir para orientar el trabajo, no para premiar la cantidad de texto o de confirmaciones.

**Prioridad recomendada:** primero corregir fidelidad y trazabilidad entre fuente, estructura y salida; después hacer la cobertura explicable y añadir la vista «Qué hace». Embellecer el resumen sin resolver las relaciones dejaría el problema principal intacto.

## 2. Caso de referencia y evidencia disponible

Proyecto de prueba: **4- Participación Ciudadana Colombia — Captura, Priorización y BI Territorial**.

[Abrir el proyecto](https://idle-asset-trustee-websites.trycloudflare.com/4-participacion-ciudadana-colombia-captura-priorizacion-y-bi/conocimiento). La dirección corresponde al túnel utilizado durante las pruebas y puede cambiar.

El producto ciudadano que se está especificando conecta:

**Convocatoria y eventos → relatos ciudadanos → datos territoriales revisables → necesidades situadas → BI y visibilidad de contextos ausentes → prioridad de examen → tratamiento y respuesta.**

La primera entrega incluye BI institucional. No exige al ciudadano formular proyectos técnicos. Conserva comunidades pequeñas y disensos, distingue aportes de personas y apoyos y no convierte participación voluntaria en un censo nacional. La IA ayuda, pero no decide presupuesto ni reemplaza responsabilidad institucional.

Fuentes completas cargadas y analizadas en la cuarta prueba:

| Archivo | Contenido | Palabras registradas |
|---|---|---:|
| investigacion_planeacion_ciudadana_colombia_v2.md | Investigación, contexto colombiano, comparaciones y fuentes | 13.819 |
| definicion_producto_participacion_v1.md | Producto, recorrido, canales y propuesta de alcance | 3.225 |
| especificacion_nucleo_participacion_v2.md | N01–N20, entidades, condiciones, motivos y pruebas sintéticas | 1.998 |
| especificacion_datos_y_bi_v1.md | Trece requisitos de datos y BI, métricas y aceptación | 2.872 |

Total: 21.914 palabras. Las cuatro incorporaciones seleccionadas terminaron sin los errores de servidor de la tercera prueba. Hubo revisión humana para evitar duplicados y corregir interpretaciones.

La evaluación se hizo mediante la interfaz y los entregables visibles. No se revisó el código ni se atribuyen causas internas a partir de estos síntomas. No se ha ejecutado una nueva prueba después del último cierre documentado. Los escenarios del producto ciudadano son sintéticos, no resultados de campo.

## 3. Qué ya mejoró y qué sigue abierto

| Tema | Estado respaldado por la última revisión | Tratamiento recomendado |
|---|---|---|
| Error de importación con guardado parcial | Ocurrió en la tercera prueba; las cuatro incorporaciones de la cuarta terminaron sin ese error visible | Mantener como prueba de regresión; no afirmar que sigue fallando ni que la atomicidad interna está demostrada |
| Entrevista de un producto que no existe | Se añadió «Esto todavía no existe» y se utilizó | Conservar; evitar reintroducir preguntas que exijan inventar una experiencia pasada |
| Conservación de respuestas | Las explicaciones aparecen como fichas revisables y en la salida | Mejorado; falta completar su conversión estructurada |
| Confirmaciones principales | Se revisaron y quedaron cero supuestos sin confirmar en los diez módulos | Cerrado para estas fichas; no equivale a aprobar las decisiones institucionales |
| Actores sin asociación | Había cinco módulos sin actor; se completaron manualmente once actores y sus relaciones | Cerrado en este proyecto; mejorar detección y propuesta de vínculos |
| Resúmenes comprensibles | Se escribieron manualmente diez resúmenes | Contenido disponible; falta una vista principal «Qué hace» que sintetice y mantenga esa información |
| Reglas, pruebas y dependencias | Parte sigue en texto narrativo o en campos amplios | Abierto: estructuración y trazabilidad |
| Tablas con barras verticales | En la cuarta prueba el texto introducido con ese carácter produjo celdas adicionales y barras invertidas visibles | Abierto según última observación; verificar vista, copia y descarga por separado |
| Página general del sistema | Error 2149101213 persistió al recargar en el cierre posterior | Abierto según última observación; impidió completar esa pantalla |

### Cobertura observada antes y después del cierre manual

| Módulo | Inicio del cierre | Final del cierre |
|---|---:|---:|
| Captura | 37 % | 50 % |
| Revisión | 36 % | 50 % |
| BI Institucional | 53 % | 58 % |
| Gestión | 37 % | 50 % |
| Eventos y facilitación | 20 % | 33 % |
| Convocatoria y divulgación | 3 % | 17 % |
| Discusión | 37 % | 50 % |
| Priorización | 28 % | 42 % |
| Contexto documental | 28 % | 42 % |
| Administración | 20 % | 33 % |

Los porcentajes demuestran que confirmar afectó el avance. No permiten inferir la fórmula interna ni cuánto desarrollo falta. El consolidado conservó veinte decisiones pendientes, aunque cada módulo mostrara cero supuestos sin confirmar.

## 4. Responsabilidades: herramienta, equipo y entidad

| Situación | Responsable principal | Acción correcta |
|---|---|---|
| La fuente ya contiene una regla y su ejemplo, pero la salida no los vincula | Dev-req facilita la recuperación; el equipo valida | Proponer la estructura desde la fuente, sin pedir que se vuelva a escribir |
| Una frase contiene varias capacidades | Dev-req propone separación; el equipo decide el alcance | Crear requisitos pequeños y mostrar relaciones y diferencias |
| Dos fuentes se contradicen o una actualiza a otra | Equipo de producto, con comparación provista por dev-req | Registrar resolución y conservar versiones; no sobrescribir por orden de llegada |
| Una respuesta correcta sigue como supuesto | Equipo revisor | Confirmar con significado explícito y verificar persistencia |
| Falta autoridad, presupuesto, territorio piloto o política de retención | Entidad responsable | Mantener decisión pendiente con impacto; no completarla con IA |
| Falta un detalle técnico que puede proponerse sin cambiar el mandato | Equipo constructor | Registrar propuesta y criterio verificable; no atribuirla a la entidad |
| Un porcentaje contradice el contenido o no explica sus faltantes | Dev-req | Mostrar evidencias, dimensiones, reglas de cálculo y estado de cada elemento |

Dev-req no debe asumir que toda sección vacía es una omisión del entrevistado. Tampoco debe considerar suficiente cualquier texto colocado en un campo.

## 5. Modelo de información recomendado para dev-req

Estas son propuestas de ajuste, no una descripción comprobada de su arquitectura actual.

Cada unidad de conocimiento debe conservar identificador estable, texto fuente y localización, versión de fuente, interpretación propuesta, destino estructurado, responsable de revisión, fecha y relaciones. Un requisito debe poder conectarse con módulo, actor, entrada, salida, regla, límite, criterio de aceptación y decisión que lo condiciona.

Separar al menos dos ejes:

| Eje | Estados o valores propuestos |
|---|---|
| Naturaleza del contenido | Hecho informado; propuesta de diseño; decisión institucional documentada; ejemplo sintético; incógnita |
| Estado de elaboración | Capturado; interpretación propuesta; estructurado sin confirmar; confirmado; requiere nueva revisión; descartado con motivo |

El alcance es un atributo adicional: primera entrega, ampliación condicionada o fuera del producto. Un texto puede estar confirmado como propuesta de diseño sin ser un acuerdo institucional ni una función implementada.

La confirmación debe indicar qué se confirma: fidelidad de la síntesis, requisito de producto o una decisión sustentada. «Así es» no debe otorgar a todo el contenido el mismo nivel de autoridad.

## 6. Ajustes prioritarios y criterios de aceptación

P0: bloquea confianza o uso del entregable. P1: mejora necesaria para un flujo completo y comprensible. Estas prioridades corresponden a dev-req, no a las prioridades del producto ciudadano.

### DR-01 · P0 · Unir captura, estructura y salida

**Evidencia:** la entrevista y el diagnóstico generaron salidas distintas en la tercera prueba. En la cuarta, las respuestas se conservan, pero parte permanece en «Entendido, sin codificar todavía». Convertir una explicación de Captura en I11 no completó motivo ni casos y puede solaparse con I1 e I2.

**Ajuste:** al guardar, mostrar las unidades detectadas y su destino: resumen, requisito, regla, caso, actor o pendiente. Permitir convertir y revisar sin copiar de nuevo. Detectar coincidencias antes de crear otra regla.

**Aceptación:** dada una respuesta con comportamiento, condición, motivo y ejemplo, todos aparecen en una propuesta revisable con sus relaciones. Después de confirmar, la ficha del módulo y el entregable contienen lo mismo. Lo no transformado queda identificado, no omitido silenciosamente.

### DR-02 · P0 · Conciliar cobertura por fuente

**Evidencia:** los requisitos N01–N20 y los trece requisitos de datos/BI están explícitos en documentos; no se comprobó una correspondencia completa y separada en la estructura generada.

**Ajuste:** matriz de fuente a especificación con estados completo, parcial, no incorporado, sustituido y fuera de alcance justificado. Señalar partes del requisito fuente aún ausentes.

**Aceptación:** los trece identificadores de datos/BI son localizables por separado. Una mera mención de BI-02 dentro de BI-01 no se presenta como cobertura completa. Si se combinan requisitos por decisión humana, sus criterios conservan trazabilidad individual.

### DR-03 · P0 · Preservar significado y fase

**Evidencia:** se tuvieron que excluir interpretaciones que convertían una ampliación futura en prohibición permanente, «no fusionar automáticamente» en «no fusionar» o un aporte en expresión exclusivamente individual.

**Ajuste:** mostrar cita e interpretación juntas y conservar opcionalidad, condición, fase y modalidad. Una fuente posterior no sustituye el alcance confirmado sin revisión de diferencias.

**Aceptación:** agrupación revisada sigue permitida; offline robusto queda como ampliación; aporte admite origen individual o colectivo; prioridad de examen no se convierte en inversión aprobada; IA opcional no bloquea captura manual.

### DR-04 · P0 · Reparar el formato del entregable

**Evidencia:** texto como «BI-01 [barra vertical] P0 [barra vertical] Propuesta…» produjo columnas adicionales en la tabla visible.

**Ajuste:** serializar el contenido sin interpretar caracteres de usuario como estructura. Conservar texto multilínea, signos y enlaces.

**Aceptación:** un caso con barras verticales, saltos de línea, comillas y caracteres acentuados mantiene columnas y texto íntegros en vista leída, copia y descarga. Los tres resultados se comparan; aprobar la vista no sustituye probar la descarga.

### DR-05 · P0 · Recuperar errores y conservar trabajo

**Evidencia:** «Qué es el sistema» devolvió error 2149101213 dos veces; módulos y actores continuaban accesibles. Los fallos parciales de importación son antecedentes históricos, no fallos reproducidos en el cuarto lote.

**Ajuste:** resolver la página general y proporcionar mensajes recuperables, estado de guardado e identificación de operación. En importación, mostrar resultado persistente por elemento o una operación íntegra recuperable, según arquitectura.

**Aceptación:** abrir, editar, guardar y recargar la definición general funciona. Interrumpir una importación y reanudarla no pierde elementos ni los duplica; se distinguen guardados, fallidos y pendientes. Una recarga no obliga a repetir análisis ya terminado.

### DR-06 · P0 · Cobertura explicable y verificable

**Evidencia:** confirmar corrigió parte del avance, pero dimensiones a cero coexisten con reglas y ejemplos redactados. Un módulo sin supuestos puede coexistir con decisiones globales.

**Ajuste:** cada faltante debe identificar si no hay información, si existe en una fuente sin estructurar, si falta confirmación, si hay conflicto o si depende de una decisión. Debe ofrecer la acción exacta para resolverlo.

**Aceptación:** pulsar una dimensión muestra qué registros cuentan, qué campos faltan y qué evidencia se encontró. No cambia por agregar texto irrelevante o duplicados. La contribución al porcentaje se explica y reproduce. La fórmula y su versión son visibles; no se requiere adivinarla.

### DR-07 · P1 · «Qué hace» como vista principal del módulo

**Evidencia:** se escribieron diez resúmenes manualmente. El de BI aparece confirmado en el documento, dentro del conocimiento sin codificar. No se añadió una pestaña nueva a la aplicación durante la prueba.

**Ajuste:** añadir «Qué hace» junto a «De dónde salió» y «Pantallas». Sintetizar el contenido confirmado completo: propósito, actores, recorrido, resultado, primera entrega, ampliaciones, reglas esenciales y pendientes. Conservar enlaces al detalle y edición humana.

**Aceptación:** una persona nueva entiende el módulo sin códigos ni conversación previa. El resumen se incluye al inicio de su documento. Si cambia una fuente relacionada, queda marcado para revisión y no se sobrescribe silenciosamente. Los pendientes aparecen separados de lo confirmado.

### DR-08 · P1 · Actores reutilizables y permisos explícitos

**Evidencia:** cinco módulos quedaron inicialmente sin actor. Se corrigió manualmente la matriz de once actores. Varias descripciones mencionaban participación en más módulos que los asociados.

**Ajuste:** sugerir relaciones desde el contenido, comparar nombres y funciones y separar actor, organización y cuenta real. Capturar responsabilidad, acciones permitidas, restricciones y tipo interno/externo cuando se conozca.

**Aceptación:** cambiar una ficha se refleja en todos sus módulos y entregables. No se duplican analista y curador si se decidió reutilizar el rol. Una entidad y su representante no se fusionan solo por parecido. Vincular Control social a consulta pública no le atribuye acceso al BI privado. «Por definir» es válido cuando falta evidencia.

### DR-09 · P1 · Requisitos y pruebas con campos propios

**Evidencia:** se observaron motivos y resultados dentro de descripciones largas mientras sus columnas específicas permanecían vacías; varios RF agrupan operaciones.

**Ajuste:** separar nombre corto, actor, precondición, entradas, comportamiento, salida, regla, motivo, prioridad y aceptación. Un caso contiene datos, acción y resultado esperado, además de estado de ejecución.

**Aceptación:** la regla de no duplicar una necesidad multiterritorial incluye un caso con dos municipios y total nacional único. El caso se muestra como «no ejecutado» hasta registrar una ejecución real. Un campo con texto no cuenta como prueba si no permite determinar éxito o fallo.

### DR-10 · P1 · Enriquecer coincidencias sin perder información

**Evidencia histórica:** en la segunda prueba «Aporte» se trató como existente, pero quedó sin definición; en la cuarta se evitó duplicación mediante selección manual. No se aisló nuevamente el caso de enriquecimiento en la cuarta.

**Ajuste:** distinguir duplicado exacto, complemento y contradicción. Proponer completar campos vacíos sin borrar lo confirmado.

**Aceptación de regresión:** importar una definición de un término existente sin definición la ofrece como enriquecimiento. Importar una alternativa incompatible muestra ambas fuentes y exige resolución. Repetir una importación no crea copias de actores o términos.

### DR-11 · P1 · Dependencias e integraciones con nivel de evidencia

**Evidencia:** redactar dependencias no siempre completó «Depende de». En una prueba histórica, texto narrativo en un campo de contrato pudo aparentar mayor completitud; esa colocación incorrecta fue un error del operador, no prueba de fallo de extracción.

**Ajuste:** separar relación entre módulos de integración externa; distinguir candidata, acceso comprobado, contrato validado y prueba ejecutada. Registrar proveedor/custodio, datos requeridos, permisos, frecuencia y contingencia cuando existan.

**Aceptación:** TerriData, SINERGIA y PIIP permanecen candidatos hasta aportar evidencia. Un párrafo general no acredita contrato ni integración funcionando. La captura manual sigue disponible si una fuente externa no responde.

### DR-12 · P1 · Estados de guardado y análisis consistentes

**Evidencia:** una previsualización mostró el resultado anterior hasta navegar o recargar. Guardar asociaciones actualizó la matriz sin cerrar el formulario; algunos indicadores mostraron temporalmente valores anteriores.

**Ajuste:** indicar documento, versión, operación en curso, guardado final y vigencia del análisis. No mantener controles que sugieran repetir una operación concluida sin aclararlo.

**Aceptación:** analizar dos documentos secuencialmente muestra el resultado correcto de cada uno sin recarga manual. Guardar una asociación informa éxito y la matriz coincide con la ficha. Tras fallo se explica qué se conservó y qué debe reintentarse.

### DR-13 · P1 · Paquete autocontenido y versionado

**Evidencia:** hay conocimiento repartido entre documentos, entrevista, diagnóstico, fichas y salida. Una ficha con secciones llenas no garantiza relaciones completas.

**Ajuste:** exportar alcance, resumen, actores, requisitos, datos, reglas, pruebas, dependencias, decisiones y fuentes necesarias con identificadores resolubles y una versión de corte.

**Aceptación:** entregar un módulo a otro equipo no requiere buscar detalles esenciales en una conversación inaccesible. Toda referencia se resuelve dentro del paquete. Un cambio posterior no modifica silenciosamente un archivo ya exportado. El consolidado y el documento de módulo no contradicen actores o estados.

## 7. Cómo deben aclararse las coberturas

No fijamos aquí una fórmula interna: no se inspeccionó el código y sería incorrecto explicar los porcentajes como si conociéramos sus pesos. Se propone que dev-req publique su contrato de cálculo y distinga cuatro lecturas:

| Lectura | Qué responde | Qué no demuestra |
|---|---|---|
| Cobertura de fuentes | ¿Qué partes relevantes de los insumos quedaron representadas? | Que la fuente original sea suficiente o esté aprobada |
| Estructuración | ¿Qué requisitos, reglas y pruebas tienen los campos y relaciones necesarios? | Que lo estructurado sea correcto |
| Confirmación | ¿Qué interpretaciones revisó el equipo y en qué versión? | Que exista mandato institucional o implementación |
| Preparación para construir | ¿Qué alcance está definido, es verificable y no tiene decisiones bloqueantes sin tratamiento? | Que el software ya esté probado o listo para despliegue |

Reglas del indicador propuesto:

- Definir unidad, numerador, denominador, alcance y versión de cálculo. Evitar mezclar preguntas de entrevista con requisitos como si fueran unidades equivalentes.
- Separar el piloto de ampliaciones. Una capacidad futura no reduce automáticamente la preparación del piloto, pero tampoco desaparece del alcance general.
- «No aplica» necesita motivo y revisión; no sirve para esconder faltantes. Mostrar cuántos elementos se excluyeron del denominador.
- Un duplicado o un párrafo más largo no incrementa cobertura. Una regla mencionada cuenta como localizada, no como plenamente estructurada.
- Si la extracción todavía no identificó de forma suficiente lo relevante en la fuente, declarar la cobertura provisional. No confundir «todo lo extraído» con «todo lo que había».
- Si cambia el alcance y crece el denominador, explicar por qué baja el porcentaje. Una disminución puede reflejar descubrimiento útil, no pérdida de trabajo.
- Al cambiar una fuente, reevaluar solo los elementos afectados y mostrar cuáles necesitan revisión.
- Un bloqueo crítico puede impedir entregar una parte aunque el porcentaje total sea alto. Mostrar alcance construible, alcance condicionado y bloqueo por separado.

La cobertura de dev-req no debe confundirse con la cobertura territorial del producto ciudadano: son indicadores diferentes con denominadores y propósitos distintos.

## 8. Ejemplo completo para verificar la transformación

Fuente: BI-01 y contrato de indicadores de `especificacion_datos_y_bi_v1.md`.

**Resumen visible:** «Permite explorar las necesidades reportadas en un mapa, ver indicadores y abrir la evidencia. Todas las vistas usan los mismos filtros y muestran la calidad y los límites de la información».

| Campo | Contenido esperado, como propuesta de diseño |
|---|---|
| ID de origen | BI-01 |
| Módulo y actor | BI Institucional; Analista |
| Prioridad | P0 del producto ciudadano |
| Entradas | Corte identificado de aportes y necesidades, relaciones territoriales, estado de revisión y permisos |
| Filtros | Periodo de recepción, territorio, tema, canal y revisión |
| Comportamiento | Seleccionar filtros actualiza mapa, indicadores y lista; seleccionar necesidad abre expediente permitido |
| Resultado | Mismo universo consultable y trazable en todas las vistas |
| Regla relacionada | IDs distintos; no sumar subtotales territoriales solapados |
| Motivo | Evitar que una necesidad compartida parezca varios problemas nacionales |
| Dependencias | GEO-01, NEC-01, CAL-01; exportación y trazabilidad TRA-01; permisos SEG-01 |
| Límite | No inventar precisión ni considerar cero reportes como cero necesidades |
| Aceptación sintética | Una necesidad asociada a dos municipios aparece en ambos contextos y una sola vez en el total nacional |
| Estado | Especificado y revisable; prueba no ejecutada sobre una implementación ciudadana |

Un segundo caso de calidad, relacionado con CAL-01: diez aportes, ocho con ubicación municipal resuelta y dos pendientes. Resultado esperado: diez aportes totales, ocho resueltos y dos pendientes; 80 % de resolución de ubicación. Los pendientes no se ubican artificialmente. Ese 80 % no mide representatividad ni cobertura territorial.

Dev-req debe representar campos y relaciones, no colocar toda esta tabla en un único RF y declarar terminado el trabajo.

## 9. Matriz de regresión para las fuentes del proyecto

Esta matriz indica qué verificar en la siguiente versión. No certifica que todas esas pruebas ya hayan pasado.

| Fuente | Elemento que debe sobrevivir a la transformación |
|---|---|
| DAT-01 | Contrato común entre web y eventos; reintentos sin duplicación; dispositivos compartidos permitidos |
| GEO-01 | Lugar declarado y normalizado distintos; ubicación incierta visible; varios territorios sin precisión inventada |
| NEC-01 | Expediente y agrupación reversible con originales e historia |
| TAX-01 | Tema, consecuencia y alternativa distintos; catálogo versionado |
| CAL-01 | Calidad de ubicación, clasificación, confirmación y revisión separadas |
| BI-01 | Mapa, lista e indicadores sincronizados y acceso al expediente |
| BI-02 | Volumen, recurrencia, afectación y atención como medidas diferentes |
| BI-03 | Contextos sin escucha visibles y acción de convocatoria relacionada |
| PRI-01 | Examen motivado por persona responsable; caso pequeño no oculto; sin financiación automática |
| TRA-01 | Procedencia, reglas de inclusión y corte reproducible |
| RES-01 | Remisión, respuesta y resolución no equivalentes |
| SEG-01 | Consulta y exportación protegidas; vista pública distinta de institucional |
| IA-01 | P1 para automatización descrita; captura y revisión manuales siguen funcionando |

También se debe conciliar N01–N20. Sus solapamientos con los trece requisitos anteriores se relacionan; no se duplican automáticamente como si fueran funcionalidades adicionales.

## 10. Protocolo de aceptación de la siguiente versión

1. Usar un proyecto vacío con los mismos cuatro archivos y registrar versión de aplicación y fuentes. Procesar uno a la vez; no contaminar las fuentes de producto con este feedback de la herramienta.
2. Inspeccionar la extracción antes de incorporar. Registrar nuevos, enriquecidos, coincidentes, contradictorios y excluidos. Verificar conservación de condiciones y fases.
3. Revisar la matriz de los trece requisitos y N01–N20. Cada elemento queda representado, parcial con detalle o excluido con motivo; ninguno se considera cubierto solo por aparecer su nombre.
4. Completar el recorrido de BI usando la información ya disponible, sin reescribirla en otra pantalla. Revisar campos, actores, reglas, motivos y casos separados.
5. Confirmar y recargar. Verificar que cambian el estado y la dimensión correcta y que el historial conserva la fuente y la versión revisadas.
6. Abrir «Qué hace». Comprobar que una persona ajena a la conversación entiende propósito, recorrido y límites; comparar con el detalle.
7. Verificar matriz de actores y exportación. Una asociación funcional no se interpreta como acceso universal a información privada.
8. Ejecutar regresiones de caracteres en tablas, dos análisis consecutivos, enriquecimiento de glosario, reintento de importación y acceso a la página general.
9. Modificar una fuente de prueba y comprobar que el resumen y los requisitos afectados requieren revisión sin destruir la versión anterior.
10. Exportar y entregar el paquete a un revisor que no participó en la captura. Registrar qué debe preguntar todavía y clasificar cada pregunta: pérdida de información, detalle de diseño faltante o decisión institucional pendiente.

**Pasa la prueba:** la información suministrada se puede rastrear y utilizar; los faltantes son específicos y tienen responsable; el paquete conserva alcance y condiciones; no se necesitan decisiones inventadas para mostrar completitud. Las pruebas del producto se mantienen como criterios sin ejecutar hasta que exista una implementación evaluada.

**No pasa:** sube el porcentaje, pero quedan reglas o ejemplos conocidos fuera de estructura; el resumen suena completo y omite límites; un módulo exportado pierde actores; una ampliación se vuelve obligatoria; o desaparecen incógnitas por confirmación masiva.

## 11. Secuencia de implementación recomendada

Primera entrega de correcciones: DR-01 a DR-06. Debe recuperar confianza en persistencia, fidelidad, formato y cobertura. Incorporar las pruebas históricas sin afirmar que los fallos siguen activos.

Segunda entrega: DR-07 a DR-12. Debe hacer natural la revisión del resumen, actores, reglas, pruebas, coincidencias e integraciones, con estados claros.

Tercera entrega: DR-13 y ejecución del protocolo completo. Revisar el paquete con una persona que vaya a construirlo. No se fija plazo sin conocer el sistema y la capacidad del equipo.

## 12. Decisiones que el ajuste de dev-req no debe inventar

Entidad convocante y operadora, designación de responsables, mandato para decidir, presupuesto, calendario y población del piloto, contratos externos, política de conservación y publicación, tratamiento de menores, metas de servicio, capacidad de campo y reglas de selección vinculante.

Puede proponer alternativas y explicar consecuencias, pero debe identificar quién decide y qué queda condicionado. Hay trabajo de construcción que puede avanzar con datos sintéticos y políticas propuestas; eso no autoriza un despliegue institucional.

## 13. Evidencias locales que acompañan este documento

- `evaluacion_dev_req_segunda_prueba.md`: omisiones, condiciones alteradas y enriquecimiento incompleto.
- `evaluacion_dev_req_tercera_prueba.md`: importación parcial, rutas de captura y estructuración manual.
- `evaluacion_dev_req_cuarta_prueba.md`: cuatro análisis completos, mejoras y problemas de salida.
- `cierre_confirmaciones_resumenes_actores_proyecto4.md`: porcentajes finales, diez resúmenes, once actores y error de página general.
- `especificacion_datos_y_bi_v1.md` y `especificacion_nucleo_participacion_v2.md`: entradas de referencia para verificar fidelidad.

Las afirmaciones de estado de este documento se limitan a esas observaciones. Una corrección posterior necesita verificación nueva antes de marcar el hallazgo como resuelto.
