# Participación Colombia · Perfil interno 0.5

Esta versión añade el diseño del equipo interno al sistema ciudadano 0.4. Es una referencia navegable y una especificación de componentes, no un sistema operativo con permisos o datos reales.

## Dos caras de un mismo sistema

| Decisión | Ciudadanía | Equipo interno |
|---|---|---|
| Tarea principal | Expresar una experiencia y comprender su tratamiento | Revisar información, asignar trabajo y registrar actuaciones |
| Tipografía | Newsreader para invitación; Geist para captura y lectura | Geist en navegación, listas, formularios y textos de trabajo |
| Azul sólido | Continuar, revisar o confirmar | Abrir el siguiente aporte o guardar la actuación de una ficha |
| Superficie cálida | Portada y explicaciones | Navegación lateral y relato original |
| Controles | 48 px de alto | 40 px con puntero preciso; mínimo de 44 px al tacto |
| Radios | 12 px en controles, hasta 20 px en paneles editoriales | 8 px en controles; 12 px en ficha y agrupaciones |
| Densidad | Una pregunta central y espacio de lectura | Filas comparables, metadatos compactos y edición contextual |
| Contenido sensible | Acceso de la persona a su propio aporte | Acceso según función y ámbito, por implementar en servidor |

El azul tinta `#16345C`, el azul de acción `#3366CC`, la arena `#F8F7F3`, los neutrales y los colores semánticos proceden de la misma base. La extensión interna no cambia los 252 tokens existentes de la versión ciudadana; añade 67. En total, el sistema 0.5 contiene **319 tokens**.

Los criterios de referencias actuales, color y marca de la propuesta ciudadana se conservan en `direccion-visual.md`. El perfil interno se deriva de esa misma dirección y de la visión del proyecto proporcionada por el cliente. No representa un manual oficial de Presidencia.

## Arquitectura propuesta

| Área | Objetivo | Cobertura en esta entrega |
|---|---|---|
| Aportes | Organizar recepción y revisión | Bandeja, búsqueda, filtros, ficha, asignación, síntesis e historial |
| Encuentros | Preparar el propósito y la información de convocatorias | Lista y edición de un borrador interno |
| Necesidades relacionadas | Revisar vínculos sugeridos sin borrar diferencias | Definición de siguiente módulo; sin acciones ficticias en navegación |
| Análisis territorial | Examinar cobertura, incertidumbre y necesidades poco frecuentes | Arquitectura pendiente de datos y criterios; sin gráficos ni prioridades inventadas |
| Respuestas y publicación | Revisar borradores y autorizar devoluciones | Borrador de respuesta en la ficha; emisión y publicación pendientes |
| Administración | Equipos, ámbitos, permisos y reglas versionadas | Matriz conceptual de responsabilidades; sin autenticación simulada |

La navegación de la muestra incluye sólo las áreas que pueden recorrerse. “Sistema visual” reúne la comparación de perfiles y un escenario de fallo de guardado; no es un módulo operativo para la ciudadanía.

## Bandeja de aportes

La pantalla inicial prioriza el trabajo pendiente. Muestra seis de los ocho aportes ficticios: recibidos, en revisión o por aclarar. El contador se calcula desde los registros del ejemplo.

La tabla contiene aporte, territorio, estado y responsable. El código y la fecha acompañan al título. La búsqueda admite código, título, relato, territorio o tema y omite diferencias de mayúsculas y acentos. Los filtros de estado y equipo se combinan. “Abrir siguiente” abre el primer resultado visible por fecha de recepción; no aplica una puntuación de prioridad.

Las filas se ordenan de la más antigua a la más reciente. Se conserva esa regla mientras cambia el filtro. Sin resultados se muestra una explicación y una acción para limpiar filtros. El botón de abrir siguiente se deshabilita cuando no hay resultados.

En anchos pequeños, la tabla da paso a una lista con los mismos datos, conservando el título accionable, territorio, estado y responsable. No se ocultan datos esenciales ni se reduce el campo por debajo de 16 px para encajar la interfaz.

## Ficha de revisión

La ficha separa cuatro elementos:

1. **Relato original:** contenido conservado y visible como referencia. No se edita junto con la síntesis.
2. **Contexto:** lugar reportado, convocatoria de origen y una observación sobre lo que falta aclarar.
3. **Síntesis de trabajo:** propuesta de organización, tema y confirmación humana de fidelidad. Validar una síntesis no equivale a verificar los hechos.
4. **Gestión:** responsable, estado y motivo. El guardado registra una actuación y sus cambios.

La muestra AP-1047 procede de una convocatoria de Caquetá y describe un problema en Chocó. Ambas referencias se muestran separadas. El texto incluye una negación —el relato no afirma que el puesto de salud esté cerrado— para hacer visible la importancia de revisar el sentido de una transcripción.

La IA se representa como una propuesta de ejemplo, sin porcentajes de confianza ni apariencia de validación automática. Editar la síntesis o el tema desmarca la validación previa. La marca de “síntesis validada” se registra al guardar; no se utiliza el verde para un borrador que aún no fue revisado.

En escritorio, original y síntesis comparten la columna principal; la gestión queda a la derecha. En pantallas menores, el contenido se apila para conservar un ancho de lectura útil. La vista no depende de un panel lateral que tape el relato.

## Estados y transiciones

| Estado interno | Qué significa | Qué no debe inferirse |
|---|---|---|
| Recibido | El registro entró en la bandeja | Su contenido es verdadero o la solicitud está aprobada |
| En revisión | Hay trabajo de examen asignado | Se decidió una intervención |
| Por aclarar | Falta información concreta | La persona perdió prioridad o su relato carece de valor |
| Remitido | Registro de una remisión en el escenario de ejemplo | La entidad destinataria resolvió la necesidad |
| Respuesta en borrador | Existe un texto de trabajo interno | La respuesta fue enviada o publicada |

El prototipo permite recibido → revisión/aclaración; revisión → aclaración/remisión/borrador; aclaración → revisión; remisión → revisión/borrador; borrador → revisión. Se puede conservar el estado para añadir una actuación. No se salta directamente de recibido a respuesta en borrador.

Para producción, registrar una remisión requerirá además destino, constancia, fecha y aceptación o seguimiento según el proceso acordado. La muestra no implementa envío a otras entidades. Una respuesta sólo debe aparecer como disponible para la persona cuando un flujo separado haya confirmado su emisión; no se deriva de guardar un borrador.

## Guardado y recuperación

- Se exige síntesis no vacía, motivo y responsable cuando el estado deja de ser recibido.
- El estado de respuesta en borrador exige un texto de respuesta.
- Los cambios se guardan juntos; no hay autoguardado ni mensajes de éxito previos a la confirmación local.
- La actuación conserva motivo, autor de ejemplo y cambios en estado, responsable, síntesis, tema, validación o respuesta.
- Salir con una edición pendiente permite seguir editando o descartar expresamente. El mensaje no borra el contenido.
- El escenario “Falla el próximo intento” produce un fallo de una sola operación. El siguiente guardado puede reintentarse con el mismo contenido. No simula una conexión real persistente.

Toda persistencia de esta demostración está en memoria. Al recargar se restablecen los datos iniciales. En producto, la concurrencia entre revisores debe resolverse con versión del registro y aviso de conflicto, no sobrescribiendo cambios silenciosamente.

## Encuentros: preparar no equivale a publicar

La lista toma las cinco convocatorias de ejemplo del perfil público. Mantiene estado de convocatoria, fecha, modalidad y ubicación. Los aportes asociados se cuentan desde la muestra interna; el conteo no es un número de inscritos ni asistentes.

La ficha permite editar título, propósito, equipo receptor y apoyos de participación. La copia de trabajo es independiente de la información de la convocatoria de referencia. Guardar devuelve un borrador interno actualizado y no modifica automáticamente lo que ve la ciudadanía.

Antes de una publicación real harán falta fecha y acceso verificados, responsable, revisión de accesibilidad, alcance de captura, tratamiento de datos y permiso editorial. Esta muestra no publica eventos, cancela reuniones reales ni envía comunicaciones.

## Mapa de componentes y tokens

| Componente | Tokens de referencia | Regla |
|---|---|---|
| Navegación lateral | `component.backoffice.sidebar.*`, `component.backoffice.navigation.*` | Superficie cálida y selección neutral; no compite con guardar |
| Botón interno | `component.backoffice.button.*` + `semantic.color.action.*` | Cambia geometría, conserva significado de color |
| Campo interno | `component.backoffice.field.*` + `semantic.color.border.control` | Borde reconocible, etiqueta y texto de error |
| Tabla | `component.backoffice.table.*` | Cabecera suave, divisores horizontales y densidad ajustable |
| Relato original | `component.backoffice.original.*` | Bloque diferenciado y lectura de 16 px |
| Propuesta | `component.backoffice.proposal.*` | Lenguaje y estado explícitos; no un distintivo de autoridad |
| Estados | `component.backoffice.status.*` | Texto siempre visible; color de fondo suave |
| Panel de gestión | `component.backoffice.panel.radius` | Contiene los campos que se guardan juntos |

Las alternativas de densidad y fondo lateral de la propuesta son variaciones de tokens. No cambian el orden de trabajo, la información ni el estado de los registros.

## Responsabilidades por definir con el cliente

| Función propuesta | Ámbito de trabajo | Restricción que debe aplicar el producto |
|---|---|---|
| Facilitación | Captura asistida y contexto de encuentros | Acceso al evento o territorio asignado |
| Revisión | Fidelidad de síntesis, clasificación y aclaraciones | No sustituir el relato original ni emitir decisiones fuera de su función |
| Coordinación | Asignación, remisión y seguimiento | Motivos y constancias de actuaciones |
| Edición y publicación | Convocatorias y devoluciones autorizadas | Publicación separada de preparación; datos privados excluidos |
| Administración | Equipos, roles y configuración | Acceso administrativo no implica acceso indiscriminado al contenido |

Estas funciones son una propuesta de arquitectura. Ocultar un botón no sustituye permisos de servidor; la demostración no implementa autorización. El cliente deberá concretar funciones, ámbitos y reglas de auditoría.

Las agrupaciones y el análisis territorial deberán conservar las diferencias, los casos poco frecuentes y la trazabilidad al original. Volumen o popularidad no son criterios suficientes para aprobar intervenciones ni invisibilizar aportes.
