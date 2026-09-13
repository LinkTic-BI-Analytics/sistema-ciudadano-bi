# Tercera prueba de dev-req: recorrido e incorporación por módulos

Fecha: 12 de septiembre de 2026.

Proyecto nuevo: [Participación Ciudadana Colombia — Especificación integral v3](https://idle-asset-trustee-websites.trycloudflare.com/participacion-ciudadana-colombia-especificacion-integral-v3).

## Resultado

Esta prueba avanzó más allá de cargar documentos. Se recorrieron los diez módulos, se registraron roles y acuerdos, se contestaron preguntas de diseño, se completó la captura estructurada del diagnóstico y se inspeccionaron los diez documentos generados.

La herramienta puede conservar buena parte de la esencia cuando se alimentan sus campos estructurados. No se debe asumir que subir un documento o contestar la entrevista principal produce automáticamente una especificación equivalente. Se encontraron rutas de captura que almacenan información en lugares diferentes y no alimentan de la misma manera el entregable.

La especificación sigue siendo un borrador de diseño, no una aprobación institucional ni una validación de un producto construido. La ausencia de secciones vacías en una ficha no prueba completitud funcional.

## Material cargado y alcance de la lectura automática

Se cargaron completos los tres documentos disponibles:

1. `especificacion_nucleo_participacion_v2.md`: núcleo de requisitos N01–N20.
2. `definicion_producto_participacion_v1.md`: definición del producto y recorrido.
3. `investigacion_planeacion_ciudadana_colombia_v2.md`: investigación refinada, marco colombiano, comparaciones y fuentes.

La autorización de Miguel Gomez para análisis mediante OpenRouter ya estaba otorgada. En este proyecto se analizó automáticamente el núcleo. Los otros dos documentos quedaron cargados como fuentes; no se completó su análisis automático en esta tercera prueba. Su contenido y la conversación se utilizaron para la incorporación manual de requisitos. Por tanto, no se afirma una conciliación automática completa de los tres documentos.

## Recorrido realizado

En cada módulo se contestaron las preguntas de propósito, fallos e invariantes como propuestas. Las preguntas sobre cómo opera hoy la entidad y el último día real de uso se dejaron pendientes, señalando que se necesita un responsable institucional o usuario real por identificar. No se inventaron experiencias de campo para reducir contadores.

Se añadió un rol por módulo y se registraron acuerdos con justificación. Después se utilizó «¿Qué falta en este módulo?» para crear capacidades, reglas asociadas, restricciones de acceso, vocabulario y reglas con motivos y casos sintéticos. Se añadieron invariantes por esa misma vía.

| Módulo | Contenido incorporado y comprobado en su entregable |
|---|---|
| Captura accesible | Relato sencillo, síntesis editable, comprobante, contacto opcional, ubicación por aclarar; aporte distinto de necesidad; reintento sin duplicación y contexto sin datos inventados. |
| Eventos y facilitación | Evento, mesa, relatoría validable y rectificable; asistentes, apoyos y disensos separados; respaldo en papel y condiciones para captura digital sin conexión. |
| Convocatoria y divulgación | Propósito, efecto de participar, fechas y entidad que responderá; consistencia entre web y eventos, medios comunitarios, recordatorios opcionales y divulgación cívica sin perfiles políticos. |
| Revisión institucional | Necesidad situada, agrupación revisable y reversible, competencia, rutas sin escalera territorial obligatoria; atención explícita a casos infrecuentes, territorios dispersos y disensos. |
| Discusión | Comparación de alternativas, efectos, riesgos, costos conocidos o desconocidos; conservación de objeciones y revisión de moderación. |
| Priorización | Examen, consulta y decisión vinculante como fases distintas; mandato y reglas previas; protección de grupos pequeños sin aprobación automática ni multiplicación arbitraria de votos. |
| Contexto documental | Fuente, fecha y geografía; escuchar antes de contextualizar; reconocimiento de datos ausentes y fuentes externas como candidatas, no conexiones existentes. |
| Analítica | Participación, necesidades, gestión y ejecución separadas; denominadores y límites de representatividad; cero aportes no equivale a cero necesidades; protección de grupos pequeños. |
| Respuesta y seguimiento | Recibido, considerado, incorporado, financiado, ejecutado y resultado; motivación, revisión y responsable; remisión no equivale a solución y proyecto previo no prueba causalidad de un aporte posterior. |
| Administración | Permisos, identidad separada del relato, retención, versiones y auditoría; IA con revisión humana, contingencias y plazo del MVP condicionado a alcance y capacidad reales. |

La inspección de cada uno de los diez entregables confirmó capacidad funcional, texto de reglas, actor y contenido de casos sintéticos. La interfaz indicó «sin secciones a medias» para los diez. Esto es una verificación de presencia, no una certificación de suficiencia: las capacidades siguen siendo amplias y contienen varias operaciones que deben descomponerse antes de estimar y construir.

## Hallazgos del funcionamiento de la herramienta

### 1. La importación masiva falla después de guardar parcialmente

El primer intento de incorporar el núcleo terminó con error de servidor `3828304120`. Después de recargar se conservaron diez módulos, ocho preguntas generales y campos del sistema, pero no los actores y otras categorías. El documento seguía mostrando la vista previa de importación.

Se intentó una recuperación limitada a categorías no guardadas. También falló, con `852020152`. No se siguió repitiendo el mismo lote. Se continuó mediante edición directa.

Implicación: el usuario no tiene una confirmación fiable de qué se incorporó y qué falta; reintentar todo puede provocar duplicación. Recomendación: transacción coherente o progreso por elemento con resultado persistente, posibilidad de reanudar y prevención de duplicados. El informe no atribuye una causa interna que no se haya observado.

### 2. La entrevista principal no equivale a captura estructurada

En Captura accesible se respondió una descripción extensa y se redujo el contador de preguntas. Sin embargo, la ficha continuó indicando que no se había entendido nada, y el entregable no contenía esa capacidad funcional. Guardar acuerdos directamente tampoco llenó inicialmente la sección de reglas de ese documento.

Al responder desde «¿Qué falta en este módulo?» sí apareció RF1 y luego su regla asociada en el entregable. Se extendió esta ruta a los demás módulos y se comprobaron los resultados.

Recomendación: una única cadena visible de trazabilidad entre respuesta, extracción, revisión, registro estructurado y salida. Si una respuesta solo queda en la conversación, la interfaz debe decirlo y ofrecer convertirla sin volver a escribirla.

### 3. El formato de algunas preguntas no guía el formato de la respuesta

La pregunta de vocabulario puede tratar toda una explicación como el nombre del término. En Eventos quedó un nombre largo para «Aporte colectivo», aunque su definición y contraejemplo sí se incorporaron. En los siguientes módulos se introdujo primero el nombre corto y después la definición.

Algunas justificaciones y resultados esperados permanecen dentro del texto largo, mientras la columna específica queda vacía. El consolidado incluye los casos vinculados a R1–R10, pero la columna Resultado muestra la referencia de regla sin separar siempre el resultado esperado. Los invariantes incorporados contienen el motivo dentro de su descripción, y la columna «Por qué» sigue vacía en la muestra inspeccionada.

Recomendación: campos explícitos para nombre, definición, condición, resultado esperado, motivo y fuente; revisión de la interpretación antes de guardar. No deducir completitud por presencia de texto en un campo general.

### 4. El diagnóstico de completitud es parcial

Después de completar las fichas, los diez módulos mostraron «sin secciones a medias». El consolidado aún mostraba diez secciones sin llenar en la última lectura completa, incluyendo aspectos transversales. El contador de pendientes mostraba 27 antes de la última edición de la unidad de decisión; no se usa ese número como medida de avance final.

Los veinte pendientes de experiencia real —dos por módulo— se conservaron deliberadamente. Otros vacíos son problemas de estructuración o diseño por completar; no deben mezclarse con esos pendientes institucionales.

El encabezado «Depende de» continuó vacío en la muestra de Administración aunque las dependencias se describieron en las respuestas. Esto confirma que redactar una relación no crea necesariamente la relación estructurada.

### 5. Dependencias externas deben permanecer como no verificadas

Se registró «Fuentes públicas de contexto y seguimiento — candidatas por validar», asociada a Contexto documental, Analítica y Respuesta y seguimiento. Se dejó en nivel 1, sin contrato ni esquema real. La descripción consigna candidatos, datos requeridos, acceso no verificado, alternativa de importación revisada, continuidad y avisos.

Durante la edición hubo un error del operador al usar posiciones de controles que cambiaron después de guardar: parte del texto quedó en campos distintos, incluyendo contrato. Se retiró únicamente ese registro recién creado y se recreó correctamente. El estado final se verificó en nivel 1 y con las tres asociaciones. Este incidente no se presenta como un fallo de extracción del producto.

La herramienta, no obstante, elevó temporalmente a nivel 3 un texto narrativo puesto en contrato. Sería conveniente validar la naturaleza del contenido y no equiparar cualquier texto con un contrato de interfaz comprobado.

## Decisiones de producto destiladas que se preservaron

- El ciudadano expresa necesidades; no tiene que formular proyectos ni entender la estructura del Estado.
- Se protege la fidelidad del relato y la capacidad de corregir, antes de usar IA para agrupar o resumir.
- Las poblaciones pequeñas necesitan oportunidades de participación, examen y respuesta; no un multiplicador arbitrario que prometa aprobación.
- La divulgación debe alcanzar contextos ausentes y reducir barreras, sin usar relatos privados para persuasión política.
- Asistir, aportar, apoyar, votar y representar a una comunidad son actos diferentes.
- La institución conserva la responsabilidad por competencia, motivación y decisiones; la IA no suple legitimidad ni autoriza gasto.
- La respuesta mínima debe cerrar el ciclo del aporte. Seguimiento de ejecución ampliado depende de información verificable.
- La unidad de decisión se precisó como expediente de necesidad situada para tratamiento, y alternativas para comparación en la fase correspondiente; no una aprobación única que convierta automáticamente aporte en proyecto.

## Qué falta antes de usarlo para construcción

1. Corregir la importación parcial y conciliar las tres fuentes con el contenido estructurado, conservando procedencia y diferencias.
2. Separar requisitos amplios en operaciones atómicas, con prioridad, estados, condiciones y resultados esperados. No basta un RF extenso por módulo.
3. Normalizar vocabulario, separar motivos e invariantes y hacer que los casos de aceptación aparezcan completos en cada entregable que los necesite.
4. Completar relaciones entre módulos y permisos de múltiples actores. El rol por módulo es una base; no una matriz de acceso completa. Analista y control social requieren roles diferenciados en la implementación.
5. Completar el modelo de entidades y relaciones: procesos, convocatorias, eventos, mesas, aportes, necesidades, alternativas, decisiones, respuestas, proyectos e indicadores; incluir sus estados e historia.
6. Definir entidad convocante, competencia, efecto de la participación, calendario, canales, idiomas, población del piloto, recursos y responsables. Ninguno se inventó en esta prueba.
7. Validar operación actual, disponibilidad de fuentes, privacidad, identificación por acción, retención, participación de menores y protocolos de campo con responsables institucionales.
8. Probar el recorrido completo con ciudadanos sin experiencia, baja conectividad, accesibilidad y grupos poco numerosos. Los ejemplos registrados son criterios propuestos, no resultados de esas pruebas.

## Conclusión

El proyecto nuevo contiene una base más útil y explícita que las cargas anteriores. La ruta de diagnóstico estructurado demuestra que dev-req puede producir una especificación con capacidades, reglas, vocabulario y verificaciones. Todavía no es fiable como conversor automático de todo el contexto: exige conocer qué pantalla alimenta cada sección y revisar manualmente la salida. El siguiente cierre debe centrarse en fidelidad, estructura y trazabilidad, no en eliminar todos los contadores de pendientes.
