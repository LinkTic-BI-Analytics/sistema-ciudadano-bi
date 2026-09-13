# Quinta prueba de dev-req

> **Actualización posterior a las cuatro correcciones, 12 de septiembre:** la cola general ya permite responder. Se cerraron y confirmaron nueve respuestas y los pendientes bajaron de 23 a 14. Administración muestra el propósito correcto. La exportación de BI incluye ahora I6 y el caso de R2 con resultado del 70 %. Los hallazgos históricos de abajo se conservan como registro; consultar el cierre al final para su estado actualizado.

12 de septiembre de 2026. Proyecto: **5- Participación Ciudadana Colombia — Captura, Priorización y BI Territorial**.

[Abrir proyecto](https://idle-asset-trustee-websites.trycloudflare.com/5-participacion-ciudadana-colombia-captura-priorizacion-y-bi/sistema).

## Resultado

Se cargaron y analizaron las cuatro fuentes completas. Se revisó la extracción antes de incorporarla, se completó la definición general, se interactuó con los diez módulos y se relacionaron once actores con funciones y restricciones. Se completaron campos separados de actor, entrada, resultado, exclusiones y condición del requisito principal de cada módulo. Las afirmaciones documentales aceptadas también se trajeron y confirmaron.

La versión sí mejora la comprensión: existe «Qué hace», incluye explicaciones confirmadas, actores, restricciones, pasos y procedencia; la exportación añade esa sección y diferencia «diseñado y no construido». Sin embargo, **todavía no conviene tratar su porcentaje como garantía de que el documento está listo para construir**. Persisten pendientes sin vía de respuesta, confirmaciones de actores sin control visible, selección incorrecta del resumen en algunos módulos y diferencias entre la vista y el documento exportable.

Son confirmaciones de diseño realizadas por el asistente por encargo de Miguel Gomez. No son aprobación de una entidad, prueba ejecutada del producto ciudadano ni designación de funcionarios.

## Fuentes incorporadas

| Fuente | Palabras mostradas | Elementos incorporados / propuestos |
|---|---:|---:|
| especificacion_datos_y_bi_v1.md | 2.872 | 43 / 47 |
| especificacion_nucleo_participacion_v2.md | 1.998 | 40 / 50 |
| definicion_producto_participacion_v1.md | 3.225 | 25 / 38 |
| investigacion_planeacion_ciudadana_colombia_v2.md | 13.819 | 15 / 40 |

Las exclusiones fueron deliberadas: duplicados, interpretaciones que confundían aporte y necesidad, ampliaciones presentadas como alcance inicial y restricciones excesivamente absolutas. No se volvió a incorporar todo para aumentar porcentajes. La investigación original sigue cargada íntegra; seleccionar una extracción no reemplaza esa fuente.

Se registró que faltan documentos y acuerdos de la entidad: mandato, responsables nominales, presupuesto, territorios y calendario, políticas de datos, protocolos, fuentes e integraciones reales. La autorización existente de Miguel Gomez para OpenRouter se aplicó a las cuatro lecturas.

## Estado comprobado por módulo

| Módulo | Cobertura mostrada al cierre | Preguntas de la entrevista pendientes | Supuestos sin confirmar |
|---|---:|---:|---:|
| Captura | 50 % | 0 | 0 |
| Revisión | 50 % | 0 | 0 |
| BI Institucional | 92 % | 0 | 0 |
| Gestión | 50 % | 0 | 0 |
| Eventos y facilitación | 42 % | 0 | 0 |
| Convocatoria y divulgación | 33 % | 0 | 0 |
| Discusión | 50 % | 0 | 0 |
| Priorización | 42 % | 0 | 0 |
| Contexto documental | 33 % | 0 | 0 |
| Administración | 33 % | 0 | 0 |

Estos ceros corresponden a la entrevista y las fichas de cada módulo. No significan ausencia de preguntas en el diagnóstico, casos pendientes o decisiones generales. La página general muestra **6 de 6 confirmadas y 23 sin preguntar**; además, las cuatro definiciones generales y las siete preguntas del sistema quedaron revisadas.

No se inventó experiencia histórica: se utilizó «Esto todavía no existe». La herramienta lo presenta después como información que hay que buscar a un operador actual o futuro, lo que aún necesita una distinción explícita entre no aplicable y pendiente.

## Qué se completó por nuestro lado

- Propósito, unidad de captura, unidad de decisión y alcance inicial, distinguiendo ampliaciones.
- Resumen del propósito, fallos y restricciones en cada módulo, con confirmación posterior.
- Un requisito funcional principal por módulo con actor, entrada, resultado, exclusiones y condiciones separados. No equivale a haber desagregado automáticamente todos los requisitos N01–N20 y DAT/GEO/BI de las fuentes.
- BI: fundamentos de las dos reglas de conteo, caso sintético con resultado esperado, definición de cobertura y restricción de privacidad.
- Once actores: Ciudadano, Facilitador, Revisor, Analista, Comunicaciones, Responsable institucional, Entidades competentes, Responsable de proceso, Administración, Control social y Moderación. Todos los módulos tienen actores asociados. Se conservaron como pendientes las relaciones internas/externas que dependen de la entidad operadora.
- Distinción entre identidad, aporte, apoyo, asistencia, necesidad, alternativa, decisión, proyecto y ejecución.
- Prioridad de examen motivada, visibilidad institucional de comunidades pequeñas y separación entre falta de reportes y ausencia de necesidades.
- Un boceto de BI con tabla anclada a RF6 y nota sobre coherencia de filtros, permisos y estados vacíos. Es un ensayo de la herramienta de pantallas, no una interfaz de BI construida ni un diseño completo. La paleta visible no ofrecía un componente de mapa geográfico.

## Feedback verificable para dev-req

### P0 · Pendientes generales que no se pueden responder

**Reproducción:** abrir «Qué es el sistema» y expandir «Decisiones pendientes 23». El lateral enumera las preguntas, mientras el área principal dice «No queda ninguna pregunta abierta aquí». La lista no ofrece un control para responder o vincular una respuesta ya existente.

**Impacto:** decisiones respondidas en módulos, como recuperación ante caída de IA o versionado territorial, siguen bloqueando toda la entrega. Otras requieren solo una designación institucional, no repetir la definición del flujo.

**Cambio solicitado:** abrir cada pendiente, responder, enlazar contenido, registrar revisor y separar parte resuelta y condición pendiente. No borrar una pregunta parcialmente resuelta ni tratarla como completamente desconocida.

**Aceptación:** relacionar la respuesta de Captura sobre persistencia independiente de IA con el pendiente general correspondiente; actualizar su estado y conservar evidencia después de recargar. Una designación institucional no resuelta debe mantenerse explícita.

### P0 · Vista y documento no entregan los mismos casos y restricciones

**Reproducción:** en BI se guardó para R2 el escenario sintético de 10 aportes, 7 ubicados y 3 pendientes, y su resultado esperado de 70 %. «Qué hace» muestra ambos junto a la regla. La salida del documento de BI muestra R2 y su fundamento, pero no ese caso junto a la regla. La restricción I6 de privacidad aparece en la vista de resumen y en la lista de anclajes de pantallas; la salida inspeccionada del módulo no la presenta como sección de límites.

RF6 conserva correctamente actor, entrada, salida y exclusiones después de completarlos, pero sigue indicando que falta su caso particular. El caso de R2 no constituye por sí mismo una prueba vinculada a RF6: el producto debe permitir una relación explícita y mantener ambas distinciones.

**Cambio solicitado:** una fuente común de contenido para resumen, documento de módulo, documento general y exportación. Exportar casos con entrada, resultado esperado, regla y alcance; no inferir que están ejecutados. Mostrar todas las restricciones asociadas y permitir enlazar pruebas a requisitos.

**Aceptación:** el documento de BI contiene R2, su caso y resultado guardados, I6 y su razón. La prueba de RF6 se puede crear o vincular explícitamente y deja de aparecer vacía solo cuando está realmente completa.

### P0 · Cobertura alta no demuestra suficiencia

BI llegó al 92 % pese a los problemas anteriores. En otros módulos las explicaciones confirmadas no sustituyen reglas ni casos estructurados. La extracción tampoco convirtió íntegramente cada requisito identificable de las fuentes en elementos trazables.

**Cambio solicitado:** explicar numerador, denominador y requisitos faltantes por dimensión; separar capturado, revisado, estructurado, exportado y verificado en implementación. La matriz fuente → requisito → regla → caso → documento debe mostrar omisiones y exclusiones justificadas. Las funciones futuras no deben bloquear el piloto como si fueran P0.

**Aceptación:** la falta de un caso requerido de RF6 aparece en la cobertura y se puede abrir; no se compensa con vocabulario o explicaciones largas. Cada identificador fuente, por ejemplo BI-03 o SEG-01, tiene destino o motivo explícito de exclusión.

### P1 · Actores revisados continúan «sin confirmar»

**Reproducción:** completar restricciones y asociaciones, editar y guardar la función de Analista, abrir «Qué hace» de BI. Se ve el texto actualizado y continúa «sin confirmar». La ficha de actores inspeccionada no ofrece botón explícito de confirmación.

**Cambio solicitado:** distinguir revisión de la definición del rol, pertenencia institucional y designación nominal. Permitir confirmar la primera sin inventar las otras.

**Aceptación:** el rol Analista queda confirmado como definición de producto por un revisor identificado, con historial; la entidad o persona por designar se mantiene pendiente en su propio campo. Todas las vistas usan el mismo estado.

### P1 · «Qué hace» selecciona una restricción en lugar del propósito

**Reproducción:** Administración conserva las tres respuestas correctas y confirmadas por separado. Sin embargo, el bloque principal «Qué hace» muestra «Nunca confundir permiso técnico con autoridad…». El propósito correcto aparece en «Cómo funciona, paso a paso». Se detectó también una selección inadecuada del párrafo principal en Discusión y Priorización.

**Cambio solicitado:** seleccionar el propósito mediante su tipo y vínculo, no por posición, orden de confirmación o coincidencia textual. El resumen debe sintetizar propósito, usuario, recorrido y alcance; las restricciones tienen su sección. Permitir revisión explícita de la síntesis sin alterar las respuestas originales.

**Aceptación:** cambiar el orden de confirmación no cambia el propósito elegido. En Administración se explica configurar roles, fases y catálogos, y se conserva por separado que ello no concede autoridad presupuestal.

### P1 · Extracción cambia condiciones o unidades

Ejemplos observados y excluidos/corregidos: convertir una restricción de primera entrega en prohibición definitiva; tratar una necesidad como registro individual; presentar conservación de originales como retención perpetua; afirmar que una versión protegida se publica sin condicionar a política; prohibir todo ranking en vez de impedir pesos no acordados.

**Cambio solicitado:** conservar P0/P1, excepciones, negaciones, unidades y responsables, presentar diferencias entre fuentes y guardar el motivo de exclusión. No sustituir una definición confirmada por una sugerencia incompatible de una fuente anterior.

### P1 · Actualización y confirmación de guardado ambiguas

Las lecturas del núcleo y la investigación terminaron y mostraron «ya leído», pero su revisión apareció después de recargar. Guardar asociaciones y crear Moderación conservaron los datos dejando formularios abiertos; después de crear el actor la misma pantalla incluso avisaba que el nombre ya existía. El contador transitorio de elementos traídos también pudo combinar selección anterior con total de la nueva lectura.

**Cambio solicitado:** estado explícito de lectura, revisión pendiente, importación y guardado; sincronización de contadores y cierre o reinicio intencional del formulario. Recuperar un análisis terminado sin repetir envío al proveedor.

### P1 · Inventario confunde documentos disponibles con expediente completo

El texto «dijo que ya estaba todo» aparece junto a nuestra nota explícita de que faltan documentos institucionales. Sustituirlo por «revisó el inventario disponible» y estados completo, incompleto o por validar. No convertir una nota de faltantes en una certificación de exhaustividad.

### P2 · Campos breves aceptan párrafos sin separar nombre y definición

La pregunta de vocabulario tomó toda nuestra explicación de cobertura como nombre del término; después permitió definirlo, conservando el nombre excesivo. El formulario de pantalla también tomó toda la descripción como título. Por nuestro lado conviene introducir solo un nombre breve en esos campos; por producto se necesita edición separada de nombre/definición y título/propósito, con vista previa antes de crear.

### P2 · Bocetos y sugerencias deben conservar las condiciones reales

El anclaje de una tabla a RF6 funcionó. La paleta no tenía mapa geográfico; la sugerencia de componentes incluyó contadores de plazo y vencimientos sin que existiera un plazo institucional acordado. Son sugerencias, no se aceptaron como requerimientos. Añadir soporte para mapas y filtros relacionados, y no sugerir automatismos de vencimiento sin política registrada.

## ¿Qué sigue siendo nuestro y qué es del sistema?

| Frente | Situación y siguiente acción |
|---|---|
| Diligenciamiento | Se completaron y confirmaron entrevistas, actores y contratos principales. Falta seguir desagregando todas las reglas y pruebas de las fuentes; no confundir un resumen por módulo con el catálogo completo. |
| dev-req | Corregir respuesta a pendientes generales, estado de actores, fidelidad de exportación, selección de resumen y explicación de cobertura. El contexto ya escrito no debería requerir otra investigación. |
| Entidad promotora | Definir mandato, responsables, territorios, presupuesto, calendario, políticas de datos, protocolos de atención y directorios/integraciones reales. |
| Equipo constructor | Implementar y ejecutar las pruebas con datos sintéticos antes de operar; acordar carga, tiempos, accesibilidad y soporte antes de prometer despliegue nacional. |

El proyecto sirve mejor como espacio de revisión y contiene una base útil para comenzar diseño y construcción acotada. La entrega contractual completa necesita la reconciliación anterior y la desagregación restante; no basta aumentar el porcentaje.

## Revalidación de las cuatro correcciones

### 1. Cola de preguntas generales: corregida y utilizada

Se verificó la primera pregunta seguida de las otras pendientes. Responder y confirmar actualiza el contador. «Ahora no» pasa a la siguiente y conserva el pendiente: no se utilizó para fingir cierre.

Quedaron respondidas y confirmadas nueve decisiones de diseño:

1. Fidelidad, privacidad y separación de unidades como garantías generales.
2. Desagrupación con revisión de prioridad y respuestas, sin heredar aprobaciones.
3. Versionado de catálogos territoriales sin reescribir el pasado.
4. Recepción independiente de IA, revisión manual y reintentos sin duplicación.
5. Cambios de alcance de una necesidad entre ciclos mediante versiones.
6. Separación de agrupación y alternativa, sin eliminación o anulación automática.
7. Reintentos de envío desde eventos con identificador estable.
8. Fuente contextual ausente o desactualizada sin inventar información ni bloquear captura.
9. Priorización de examen sin efecto presupuestal automático en PIIP durante P0.

El contador pasó de **23 a 14**, con **cero supuestos sin confirmar** en la página general tras estas respuestas. Las catorce conservadas requieren completar políticas, designaciones o mecanismos: coordinación multiterritorial y conflictos de competencia; retiro de datos y derivados; representación colectiva; plazos y falta de respuesta; identidad y apoyos; ruta de emergencias; relación de aportes entre canales; autoridad de rechazo; asuntos sin entidad competente; tratamiento de suplantación. Las respuestas ya definidas en módulos siguen siendo la base, no se consideran desconocidas en su totalidad.

### 2. Cuatro campos por requisito: contenido conservado; alcance de esta comprobación

Los cuatro campos de los requisitos principales ya habían sido diligenciados en la prueba anterior. Se verificó que Captura no vuelve a pedirlos en «¿Qué falta?» y que RF6 exporta quién lo hace, con qué llega, qué queda y qué no hace con sus textos completos.

Esta comprobación valida conservación y ausencia de preguntas redundantes para campos completos. No se vaciaron campos ni se crearon requisitos ficticios para probar la nueva presentación de cuatro preguntas sobre un requisito vacío. Ese caso específico queda como prueba de regresión por ejecutar con un registro de prueba aislado.

### 3. Propósito de Administración: corregido

«Qué hace» muestra ahora configurar roles, fases, catálogos, versiones, separación de datos y auditoría. Ya no selecciona como propósito la respuesta «Nunca confundir permiso técnico con autoridad…». Se conserva la distinción de propósito y restricción.

### 4. Exportación de BI: corregidos I6 y el caso de R2

El documento contiene «6 · I — lo que nunca puede pasar» y la ficha I6. R2 incluye una tabla con el caso sintético de 10 aportes, 7 ubicados y 3 pendientes, y resultado esperado del 70 %, además del corte posterior del 80 % sin modificar el archivo histórico.

**Pendiente distinto:** RF6 todavía indica que falta su caso particular. No se considera resuelto automáticamente por existir un caso asociado a R2. Debe vincularse o redactarse la prueba funcional de RF6 con su propio alcance.

### Resultado de esta revalidación

Se cierran los fallos concretos de respuesta a la cola general, selección del propósito de Administración y omisión de I6/caso de R2 en la exportación inspeccionada. No se da por corregida toda la lista de la quinta prueba: la confirmación de actores, la suficiencia de cobertura y el resto de requisitos/pruebas necesitan su revisión específica. Tampoco se afirma que las pruebas sintéticas del producto ciudadano hayan sido ejecutadas: aquí se probó dev-req y su conservación de especificaciones.
