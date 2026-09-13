> Nota de versión 0.4: se conserva este documento como antecedente funcional e institucional. La presentación vigente de la propuesta está definida en `direccion-visual.md`; sus decisiones prevalecen sobre referencias visuales a versiones anteriores.

# Participación Ciudadana Colombia · 0.3

13 de septiembre de 2026. Propuesta de arquitectura de información, captura y convocatorias. Continúa el sistema de tokens 0.2 y la visión del proyecto; no acredita una adopción institucional ni una integración operativa.

## Decisión general

El producto tiene una portada permanente para orientarse, una agenda para encontrar oportunidades y un flujo compartido para contar necesidades. Las campañas y los QR deben llegar a una convocatoria reconocible, desde la que se pueda participar o corregir el contexto.

**Inicio → Encuentros → Ficha → Aporte → Revisión → Constancia → Tratamiento.**

También existe una entrada directa desde Inicio a Aporte, sin obligación de asistir a un encuentro. Las tres modalidades previstas en la visión —presencial, virtual en vivo y participación asincrónica— alimentan el mismo inventario con procedencia diferenciada.

## 1. Arquitectura de navegación

| Destino | Pregunta que responde | Contenido principal |
|---|---|---|
| Inicio | ¿Para qué sirve y cómo participo? | Promesa, acción principal, próximos encuentros, explicación del proceso y responsable |
| Convocatorias y agenda | ¿Dónde puedo participar? | Lista filtrable, fechas, temas, territorios, modalidades y estados |
| Ficha de convocatoria | ¿Este espacio me sirve y qué debo saber? | Propósito, alcance, equipo, fecha, acceso, apoyos, reglas y tratamiento posterior |
| Contar una necesidad | ¿Cómo expreso lo que pasa? | Escritura/voz, lugar, contexto opcional, revisión |
| Mi aporte | ¿Qué pasó con lo que conté? | Acceso seguro, actuaciones, explicación, responsable y posibilidad de aclaración |
| Cómo participar / ayuda | ¿Qué hago si necesito apoyo? | Instrucciones, canales realmente habilitados y alternativas |
| Resultados | ¿Qué se puede conocer públicamente? | Devoluciones aprobadas, contexto y límites de los datos |

En la demostración se muestran Inicio, Encuentros, ficha, captura, revisión y un ejemplo de seguimiento. El catálogo de componentes queda accesible desde el pie como herramienta de revisión, fuera de la navegación principal propuesta para ciudadanía. No se simula autenticación ni publicación de resultados reales.

Rutas propuestas para la aplicación futura: `/`, `/encuentros`, `/encuentros/{slug}`, `/participar`, `/mis-aportes`, `/como-participar` y `/resultados`. Son especificaciones; el prototipo cambia vistas dentro de la conversación.

## 2. Estructura de la landing page

### A. Cabecera

Espacio para activos institucionales autorizados, nombre estable del servicio y navegación breve. La versión revisable usa texto sin reproducir un escudo ni afirmar que el servicio sea oficial. Al implementar, integrar cabecera y pie según la versión GOV.CO que confirme el cliente.

### B. Invitación principal

Título propuesto: **«Tu comunidad tiene mucho que contar»**. Explicación: **«Cuéntanos qué necesita mejorar. Puedes escribir o hablar, revisar lo que quedó registrado y conocer su tratamiento»**.

Una acción principal: **Contar una necesidad**. Una ruta secundaria: **Ver encuentros**. El bloque no requiere fotografía, carrusel, video de fondo ni cifras de participación para funcionar. Si se incorporan imágenes, deben representar contextos reales con procedencia y permisos definidos, sin convertir el texto esencial en una imagen.

### C. Cómo funciona

Tres momentos: contar la experiencia, revisar y corregir, conocer el tratamiento. Se muestran como una secuencia breve, sin tarjetas de colores para cada paso. La intención es explicar la promesa completa antes del formulario.

### D. Próximos encuentros

Dos o tres eventos vigentes y un enlace a la agenda completa. Cada elemento muestra fecha, título, modalidad y lugar. El título abre la ficha; no se repite un segundo botón con exactamente el mismo destino en la misma fila.

Orden recomendado: fecha próxima y pertinencia explícita cuando la persona haya elegido un territorio. No deducirlo de su ubicación sin decisión de producto y tratamiento correspondientes. Evitar un carrusel que esconda eventos a quienes no lo operan.

### E. Quién recibe y qué se puede esperar

Explicar el equipo responsable, el uso previsto y los límites: recepción no significa financiación ni aprobación. En esta demo se usan nombres de equipo señalados como ejemplos; no se presenta una entidad ficticia como operadora real.

La versión productiva debe mostrar la entidad operadora real en Inicio y el equipo específico en cada convocatoria. **Es un dato de publicación requerido, no un dato que debamos inventar para llenar la pantalla.**

### F. Ayuda, privacidad y resultados

Ayuda contextual y acceso a la política de datos. Un bloque de resultados sólo aparece cuando existen devoluciones autorizadas. Evitar estadísticas inventadas, testimonios ficticios presentados como reales o mensajes de «impacto» sin evidencia. La maqueta no rellena ese espacio con métricas ilustrativas.

### G. Borrador en curso

Si hay un aporte pendiente, mostrar una entrada discreta para retomarlo. El título conserva la convocatoria asociada, si existe. La demo mantiene el estado sólo en memoria durante la sesión; recargar o cerrar elimina el borrador. El diseño de recuperación persistente se define por separado.

## 3. Agenda: localizar y comparar

Usar una lista de eventos como vista inicial. Un calendario mensual puede ser adicional si resulta útil; la lista hace visibles propósito, modalidad, lugar y cambios sin depender de casillas pequeñas o hover.

Filtros iniciales: **territorio, tema, modalidad y fecha**. En móvil se apilan con etiquetas visibles. La demo contiene un conjunto reducido y explícitamente ficticio; sus opciones no representan un catálogo territorial nacional.

Mostrar cantidad de resultados y permitir limpiar filtros. Un estado vacío explica que no hubo coincidencias y ofrece ajustar la búsqueda o participar sin evento. No debe sugerir que no hay necesidades en un territorio porque no haya convocatorias.

La disponibilidad de un encuentro virtual nacional debe ser visible. La implementación debe distinguir territorio al que se dirige un evento, lugar de realización y alcance temático; no basta un único campo llamado «ubicación». La demo permite seleccionar «Nacional» como alcance de ejemplo.

## 4. Anatomía de la ficha de convocatoria

| Bloque | Información necesaria | Regla |
|---|---|---|
| Identificación | Título, propósito breve, tema, modalidad y estado | Mismo evento desde agenda, campaña y QR |
| Vigencia | Inicio, fin, zona horaria, fechas de aportes | No confundir horario del encuentro con ventana para aportar |
| Alcance | Qué se escuchará y qué puede decidirse | Evitar promesas de solución automática |
| Destinatarios | A quién está dirigido | Lenguaje comprensible y requisitos sólo si existen |
| Participación | Dirección/acceso virtual, inscripción si aplica, agenda, reglas | Un aporte no equivale a inscripción o asistencia |
| Apoyos | Accesibilidad del lugar, apoyo de lectura, idioma, captura asistida | Mostrar sólo capacidades confirmadas |
| Responsabilidad | Entidad, equipo y canal de ayuda | Identificación real antes de publicar |
| Tratamiento | Qué se revisa, cómo se devuelve y cuándo se actualizará | No inventar plazo de respuesta |
| Cambios | Cancelación o reprogramación con explicación | Conservar historial y nueva fecha claramente |
| Participación alternativa | Captura asincrónica cuando esté habilitada | Continuidad si no puede asistir o pierde la conexión |

La maqueta usa **Contar una necesidad para este encuentro** porque ejemplifica captura asincrónica asociada a una convocatoria. Esa acción no reserva cupo, registra asistencia ni abre una sala externa. En producción, inscripción y acceso en vivo son acciones diferenciadas según estado y modalidad.

### Estados y acciones

| Estado del evento | Qué se ve | Acción propuesta |
|---|---|---|
| Programado | Fecha y datos confirmados | Aportar si la ventana está abierta; inscripción si corresponde |
| Reprogramado | Nueva fecha, anterior y razón | Mantener la URL; actualizar invitaciones y contexto |
| En curso | Horario y acceso real habilitado | Acceder a sesión o aportar por la vía permitida |
| Finalizado | Fecha pasada y estado explícito | Ver devolución aprobada; aportar sólo si la ventana sigue abierta |
| Cancelado | Aviso visible y razón | Otras convocatorias o aporte general; sin CTA de asistir |

`event.status`, `registration.status`, `contributionWindow.status` y `publication.status` son dimensiones distintas. Una convocatoria puede haber terminado y seguir recibiendo aportes; una inscripción cerrada no prueba que la recepción asincrónica también lo esté. La demo emplea `captureOpen` como simplificación; no debe sustituir esas dimensiones en el modelo productivo.

## 5. Contexto de entrada, evento y territorio

Conservar por separado:

- **Origen del enlace:** campaña, pieza, QR y evento sugerido por ese enlace.
- **Evento confirmado:** convocatoria que la persona eligió para su aporte.
- **Canal de aporte:** asincrónico, presencial asistido o sesión virtual; no deducirlo del enlace.
- **Asistencia o inscripción:** hechos independientes con evidencia propia, si se registran.
- **Lugar del problema:** descripción de la persona, posiblemente varios territorios, y normalización validada.

Un QR reenviado no determina lugar ni asistencia. Cambiar el evento no debe reescribir el territorio. Si ya existe un borrador, mostrar la diferencia y permitir conservar el contexto anterior o adoptar el nuevo, manteniendo lo escrito. La demo representa esta decisión; no registra atribución de campaña ni asistencia real.

## 6. Mejoras de captura 0.3

### Confianza y propósito

El contexto de captura muestra quién recibe y revisa, el evento asociado y cómo se comunicará el tratamiento. Una divulgación breve explica lo que ocurre después del envío. Las responsabilidades productivas permanecen pendientes de confirmación; los fixtures están marcados como ejemplos.

### Escritura y voz al inicio

**Escribir / Hablar** aparece antes del campo. Son alternativas de entrada, con peso neutral y estado seleccionado que no depende sólo del color. El botón principal corresponde a la tarea activa: continuar, comenzar voz, terminar o añadir transcripción.

Cambiar a escribir no elimina una transcripción pendiente. Si se intenta avanzar mientras queda voz por revisar, el prototipo vuelve a ese fragmento para incorporarlo o descartarlo explícitamente. El relato anterior permanece intacto.

### Recuperación

Salir temporalmente de la captura conserva relato, lugar, cambio esperado, contexto y fragmento de voz pendiente durante la sesión. Una grabación de ejemplo se pausa al abandonar la captura y no se reanuda sola al volver. El inicio muestra la entrada para retomar el aporte.

En la aplicación real, una llamada, un cambio de pestaña o una interrupción deben cerrar o pausar la captura según capacidades del dispositivo, sin prometer audio recuperable si no fue almacenado. Debe existir una máquina de estados ligada a eventos reales; no basta cambiar un texto en pantalla.

### Revisión orientada

Se pide comprobar sentido, nombres de lugares, cantidades y negaciones. Se puede consultar la transcripción inicial del ejemplo tras haberla corregido. Esta referencia permite distinguir lo reconocido de lo que se incorporó al relato; no se presenta como verificación factual.

La revisión muestra evento y lugar como campos conceptualmente distintos. Cambiar una respuesta vuelve directamente al resumen. Se mantiene una confirmación del aporte, sin casillas repetidas de «sí revisé» para un mismo fin.

### Fallo de recepción

El catálogo de pruebas permite simular un fallo de recepción. Confirmar muestra el error y conserva el aporte; sólo el escenario de recuperación permite llegar a la confirmación ficticia. Es una prueba de la UI, no de conectividad ni de un servidor real.

En producción hacen falta idempotencia, verificación de estado ante resultado incierto y constancia emitida por el servidor. «Pendiente», «falló» y «recibido» no son intercambiables.

## 7. Modelo de contenido para construir

`eventos-ejemplo.json` sirve para prototipos y pruebas. La ficha futura debería aceptar, al menos:

```text
Event
  id, slug, title, summary, purpose, scope, topicIds
  audience, targetTerritories[], venueTerritory, modality
  startsAt, endsAt, timeZone, status
  previousSchedule[], changeReason, updatedAt
  ownerEntity, responsibleTeam, helpChannel
  registration { status, opensAt, closesAt, capacity?, url? }
  contributionWindow { status, opensAt, closesAt }
  participation { address?, virtualAccess?, agenda[], rules }
  accessibility { confirmedSupports[], requestChannel? }
  publication { status, approvedBy, approvedAt, resultsUrl? }

ContributionContext
  source { campaignId?, pieceId?, linkedEventId? }
  confirmedEventId?, captureChannel
  reportedPlaces[], normalizedPlaces[], normalizationConfirmed
  assistance?, attendanceReference?
```

Los campos con interrogación son condicionales; no se muestran vacíos sin explicación. No enviar datos de relato, audio o contacto a etiquetas de campaña. Las URL públicas del evento permanecen estables tras una actualización de fecha.

## 8. Patrones y tokens

Se añaden decisiones de portada, lista de eventos, bloque de confianza, borrador y estados del evento. Se conserva la jerarquía de acciones definida en 0.2.

| Patrón | Partes principales | Comportamiento |
|---|---|---|
| LandingIntro | Promesa, explicación, CTA, ruta a agenda | Una acción principal |
| UpcomingEvents | Lista breve y acceso a agenda | Fechas visibles sin carrusel |
| EventListItem | Fecha, título, modalidad, lugar, estado | Un único destino principal por elemento |
| EventFilters | Etiquetas, selects, resultados, limpiar | Estado vacío útil y anuncios moderados |
| EventDetails | Alcance, datos, equipo, apoyos, acciones | Acciones según estado real |
| EventContext | Selección y equipo receptor | Cambiar contexto conservando el relato |
| InputMode | Escribir / Hablar | Elegir modalidad antes de escribir |
| DraftResume | Borrador y contexto | Retomar sin volver a empezar |
| ReviewHints | Sentido, nombres, lugar y referencia | Corrección directa, sin falsa certeza de IA |

Usar `componentes.css` para controles y `estructura.css` para composiciones. El prototipo incorpora ambos junto con las variables generadas; los colores no se eligen de nuevo por página. No hacen falta paletas separadas para landing y formulario.

## 9. Secuencia para implementación real

1. Confirmar entidad operadora, versión de identidad aplicable, políticas y responsables.
2. Implementar contenido de convocatoria con revisión/publicación, fechas y cambios auditables.
3. Construir portada y agenda con el mismo modelo de datos y rutas estables.
4. Integrar captura y borradores con acceso seguro y estados verificables.
5. Añadir voz con soporte, permisos y evaluación de fidelidad por contexto lingüístico.
6. Conectar devoluciones privadas y resultados públicos aprobados.

La siguiente validación útil es recorrer Inicio → evento → aporte → interrupción → corrección → tratamiento con personas de perfiles distintos. La maqueta ayuda a observar comprensión; no aporta todavía evidencia de adopción o reducción del abandono.
