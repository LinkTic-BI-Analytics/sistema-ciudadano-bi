# Proyecto 4: confirmaciones, resúmenes y actores

Revisión del 12 de septiembre de 2026, posterior a la cuarta prueba.

## Resultado guardado en dev-req

Se revisaron y confirmaron las explicaciones pendientes de los diez módulos. Se reescribió la respuesta de propósito como un resumen «Qué hace» en lenguaje sencillo, conservando referencias y condiciones de alcance. También se trajeron y confirmaron cuatro afirmaciones documentales: IA asistente en Revisión y Contexto documental, límites estadísticos del BI y conservación de disensos en Eventos. Esta última se corrigió para permitir rectificaciones trazables y respetar la política de conservación de datos personales.

Los diez módulos muestran cero supuestos sin confirmar. Los once actores tienen descripción funcional, restricciones y módulos asociados. La aplicación ahora indica «todos los módulos tienen quién». Confirmar significa validar la definición de producto, no declarar una función construida ni aprobar mandatos institucionales.

| Módulo | Cobertura al iniciar esta revisión | Cobertura al terminar |
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

Son porcentajes mostrados por la herramienta, no porcentajes de desarrollo ni una auditoría independiente de completitud. El BI ya aparecía en 53 % al iniciar esta revisión. Persisten dimensiones de reglas, vocabulario y casos de prueba sin estructurar, aunque sus contenidos se mencionen en las explicaciones.

## Qué hace cada módulo

Las siguientes versiones breves sintetizan los resúmenes más extensos guardados en el proyecto.

| Módulo | Resumen en lenguaje sencillo |
|---|---|
| Captura | Ayuda a contar una necesidad y dónde ocurre, por internet o con apoyo presencial. Conserva el relato, permite corregir lo entendido y entrega un comprobante. No exige saber de planeación ni inventa una ubicación precisa. |
| Revisión | Convierte relatos en necesidades organizadas, aclara datos y relaciona aportes sin borrar sus diferencias. Permite corregir clasificaciones y deshacer agrupaciones conservando la historia. |
| BI Institucional | Muestra dónde se reportan problemas, sus consecuencias, su atención y los territorios que requieren más escucha. Conecta mapa, indicadores y expedientes con los mismos filtros y evidencia. Distingue falta de información de ausencia de necesidades. |
| Gestión | Lleva cada necesidad a quien puede atenderla y muestra responsables, pendientes, motivos y respuestas. Remitir no equivale a resolver, y responder no demuestra financiación o ejecución. |
| Eventos y facilitación | Organiza jornadas y mesas y conserva aportes, relatorías, acuerdos y disensos. Diferencia asistentes de apoyos y permite digitalizar registros revisados. El funcionamiento digital offline robusto sigue condicionado a una ampliación probada. |
| Convocatoria y divulgación | Explica para qué participar, qué puede cambiar y cómo hacerlo. Mantiene materiales y fechas consistentes y usa la cobertura para llegar a comunidades ausentes sin usar relatos sensibles como publicidad. |
| Discusión | Recoge y compara alternativas, argumentos y desacuerdos. La primera entrega conserva razones en el expediente; los espacios de deliberación avanzada son una ampliación. |
| Priorización | Ayuda a decidir qué examinar primero con razones y responsables, sin ocultar casos pequeños por volumen. No asigna presupuesto automáticamente ni habilita votación vinculante sin mandato y reglas. |
| Contexto documental | Organiza fuentes e indicadores con fecha, territorio y limitaciones. Permite contextualizar después de escuchar, sin presentar datos municipales como datos de un barrio ni simular integraciones disponibles. |
| Administración | Configura permisos, fases, catálogos y versiones y registra cambios. Protege identidad, consulta y exportación sin convertir los permisos técnicos en autoridad para aprobar necesidades o presupuestos. |

## Actores y relaciones guardadas

| Actor | Módulos asociados | Distinción principal |
|---|---|---|
| Ciudadano | Captura; Gestión; Eventos y facilitación; Convocatoria y divulgación; Discusión | Expresa, confirma y consulta. No decide en nombre de una entidad ni accede a expedientes privados ajenos. |
| Facilitador | Captura; Eventos y facilitación; Discusión | Apoya y registra; no sustituye la validación de la comunidad. |
| Revisor | Revisión; Gestión; Priorización; Contexto documental | Aclara y organiza evidencia; no inventa datos ni adjudica presupuesto. |
| Analista | BI Institucional; Priorización; Contexto documental | Analiza datos y fuentes; no convierte participación voluntaria en censo. |
| Comunicaciones | BI Institucional; Convocatoria y divulgación; Eventos y facilitación | Usa cobertura agregada para ampliar escucha; no extrae relatos sensibles o contactos del BI para publicidad. |
| Responsable institucional | Gestión; Priorización; BI Institucional | Registra tratamiento y decisiones dentro de su mandato. |
| Entidades competentes | Gestión; Priorización | Representa al organismo; actúa mediante personas autorizadas. No es sinónimo de la persona responsable. |
| Responsable de proceso | Administración; Convocatoria y divulgación; Eventos y facilitación; Priorización | Configura fases y reglas; no inventa autoridad o recursos. |
| Administración | Administración | Gestiona la operación técnica y permisos, sin asumir decisión sustantiva. |
| Control social | Gestión; Convocatoria y divulgación | Consulta versiones públicas protegidas. No tiene acceso implícito al BI institucional. |
| Moderación | Revisión; Discusión | Protege datos y revisa abuso sin censurar crítica o disenso legítimos. |

La revisión de fuentes se asignó a Revisor y Analista, sin crear un actor adicional llamado curador que duplicara sus funciones. Las asociaciones describen participación funcional; no son permisos efectivos concedidos a cuentas reales. El carácter interno o externo de algunos roles sigue por definir porque aún no se ha decidido la entidad operadora ni el esquema de contratación. No se completó ese dato por suposición para aumentar el porcentaje.

## Mejora solicitada: «Qué hace» junto a «De dónde salió» y «Pantallas»

Estado: especificación propuesta para el equipo de dev-req. Se guardaron los resúmenes en los campos existentes; no se añadió una pestaña nueva a la aplicación, cuya interfaz y código no se modificaron.

**Propósito:** permitir que alguien que llega por primera vez entienda el módulo sin leer toda la entrevista ni interpretar códigos de requisitos.

**Contenido de la vista:**

1. Resumen breve: quién lo usa, qué hace, qué obtiene y para qué sirve.
2. Recorrido principal: entrada, acción y resultado, en tres a cinco pasos.
3. Alcance: primera entrega, ampliaciones y condiciones pendientes, separados explícitamente.
4. Actores reutilizados del catálogo común, con responsabilidad y restricciones. Cada actor enlaza a su ficha; no se mantienen listas independientes.
5. Reglas esenciales y un ejemplo comprensible, con enlace al requisito detallado.
6. Fuentes y decisiones que sustentan el resumen y fecha de su última revisión.

**Comportamiento:** sintetizar todo el contenido confirmado del módulo, incluidos requisitos, reglas, actores, casos y decisiones. Lo no confirmado se presenta aparte como pendiente. La síntesis es editable y debe revisarse; al cambiar una fuente relacionada, marcarla «requiere revisión» en lugar de sustituir silenciosamente una versión confirmada. Mantener su historial y procedencia.

**Criterios de aceptación:**

- Una persona nueva identifica propósito, usuario, resultado y alcance sin conocer los códigos del documento.
- El BI menciona mapa, filtros coherentes, evidencia, cobertura, calidad y protección de comunidades pequeñas; no se reduce a «genera reportes».
- La vista de Discusión conserva que la deliberación avanzada es posterior; una síntesis no la incorpora al piloto automáticamente.
- Cambiar un actor en el catálogo se refleja en su módulo y en el entregable, sin duplicar fichas.
- Una confirmación actualiza el estado y el porcentaje después de guardarse y sobrevive a una recarga.
- El resumen figura al principio del documento del módulo como «Qué hace», no únicamente dentro de «Entendido, sin codificar todavía».
- Cada regla y prueba mencionada puede abrirse y revisarse por separado. Confirmar la síntesis no confirma de forma masiva decisiones institucionales pendientes.
- La cobertura explica qué falta y por qué. Debe distinguir información capturada, confirmada, estructurada y lista para construir.

## Limitaciones observadas y pendientes

La salida de BI muestra el resumen actualizado con estado «confirmado», pero permanece en la sección de conocimiento sin codificar. Esto confirma conservación del texto y también la necesidad de una síntesis principal mejor ubicada.

La página general «Qué es el sistema» presentó «This page couldn’t load», error 2149101213, que persistió después de recargar. Los módulos, actores y la salida continuaron accesibles. No se pudieron cerrar las cinco definiciones generales desde esa página. La salida global sigue mostrando 20 decisiones pendientes; cero supuestos en cada módulo no significa cero decisiones en todo el proyecto.

Además, guardar una asociación de actor actualizó la matriz sin cerrar el formulario. Algunas vistas mostraron brevemente valores anteriores tras guardar. La herramienta debería dar una confirmación clara y sincronizar sus indicadores, para que no se confunda una operación guardada con una fallida.

En Captura se probó convertir una explicación confirmada en un límite: quedó referenciada como I11. Esa conversión por sí sola no completó motivo y casos de verificación ni elevó la dimensión de límites. Antes de entregar habrá que revisar su solapamiento con los límites específicos I1 e I2 y estructurar la información sin duplicarla.

El siguiente cierre debe desagregar las reglas y casos ya descritos, vincular entradas y resultados a cada requisito y resolver las decisiones con el responsable adecuado. No procede declarar un 100 % completo únicamente confirmando frases.
