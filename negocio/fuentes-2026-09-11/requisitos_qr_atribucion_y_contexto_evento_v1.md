# QR, atribución de campaña y contexto del evento

13 de septiembre de 2026. Ampliación de diseño solicitada por Miguel Gomez. Complementa AGE-01/02, CAM-01/02 y DAT-01. Requisitos de primera entrega; no declara una implementación existente.

## Propósito

Desde la preparación de un evento, generar materiales cuyo QR lleve a una captura contextualizada. La persona reconoce rápidamente la convocatoria y el encuentro, confirma si corresponden a su participación y puede corregirlos. El equipo conoce qué material originó el acceso sin atribuir falsamente asistencia o ubicación.

La clave es separar **de dónde vino el enlace**, **en qué evento dice participar la persona** y **dónde ocurre el problema que está reportando**. Estos datos pueden ser distintos y los tres son útiles.

## QR-01 · Generar enlaces y QR por evento y material

**Quién:** Comunicaciones o persona autorizada para preparar materiales del encuentro.

**Con qué llega:** convocatoria, evento con identificador estable, campaña cuando exista, canal de difusión y pieza o ubicación del material.

**Qué queda:** enlace de seguimiento con identificador propio y QR descargable, vinculados al evento. Registro interno con destino, campaña, canal, pieza, UTMs, autor, fecha, estado y versión. Mostrar dirección corta alternativa al QR y una previsualización del destino antes de descargar el material.

Cada evento tiene un enlace base específico. Si se necesita distinguir afiche, volante, radio con enlace corto o publicación digital, se generan variantes por pieza; no hace falta crear un evento duplicado. Una nueva ocurrencia de un encuentro en otra fecha tiene otro ID y QR. Reprogramar el mismo encuentro conserva su identidad y muestra la fecha vigente con aviso.

Las UTMs describen difusión: `utm_source` identifica medio/origen; `utm_medium`, tipo de canal; `utm_campaign`, campaña; `utm_content`, pieza o variante. Usar catálogo y convenciones consistentes, evitando nombres personales o datos sensibles. El ID del evento es un vínculo propio del sistema: no se reconstruye interpretando una UTM.

**Qué NO hace:** usar un QR genérico nacional para todos los encuentros, poner datos del participante en la URL, considerar una UTM como autorización ni depender de un proveedor externo de QR para recibir aportes.

**Aceptación:** dos encuentros distintos producen enlaces con IDs de evento diferentes. Afiche y publicación digital del mismo encuentro pueden distinguirse como piezas sin dividir el evento. El material descargado incluye nombre del encuentro y dirección legible. Un borrador se puede previsualizar, pero sus enlaces de prueba no se presentan como recepción pública habilitada.

## QR-02 · Confirmar o corregir el contexto al entrar

**Quién:** ciudadano o facilitador que registra un aporte asistido.

**Con qué llega:** QR/enlace, con contexto sugerido de evento cuando pueda resolverse.

**Qué queda:** contexto confirmado o corregido por la persona, conservado con el aporte. La página presenta nombre del evento, fecha/hora y lugar o modalidad, seguido de una pregunta sencilla:

> Este enlace corresponde a «Encuentro de agua — Municipio A — 20 de octubre». ¿Es el encuentro en el que quieres participar?

Acciones visibles: **Sí, continuar**, **Cambiar de evento**, **Aportar sin estar en un evento**. No afirmar «estás aquí» ni «asististe» por abrir el QR.

Cambiar abre un buscador breve con eventos publicados: nombre, municipio, fecha y modalidad. Se puede ampliar a otros territorios o fechas y consultar la agenda completa. Al elegir otro se muestran su convocatoria y condiciones antes de continuar. Si cambia la decisión o convocatoria, la persona debe reconocer ese cambio; no remitir silenciosamente a otro proceso.

Se conserva el texto ya escrito mientras se corrige el contexto en la misma sesión. Participar sin evento usa el canal independiente de la convocatoria cuando esté habilitado. Si no lo está, se informa y muestran alternativas publicadas; nunca se obliga a declarar asistencia ficticia.

**Qué NO hace:** exigir GPS, usar domicilio como lugar del evento o del problema, sobrescribir el origen de difusión ni permitir cambiar de evento para evadir una fase cerrada o restricciones de acceso.

**Aceptación:** una persona en el evento B abre un QR del evento A reenviado por otra persona. Identifica el error, encuentra B y continúa sin volver a escribir su relato. El aporte queda asociado a B como contexto confirmado, y A queda solamente como origen del enlace; no se crea asistencia en A ni en B.

## QR-03 · Conservar atribución sin contaminar el contenido

**Quién:** sistema registra procedencia; Analista y Comunicaciones consultan lo permitido.

**Con qué llega:** enlace resuelto, UTMs recibidas, selección del participante, canal real de captura y relato.

**Qué queda:** campos separados y trazables:

| Dato | Significado |
|---|---|
| ID del enlace/material | Enlace registrado que originó esta captura; nulo si no existe. |
| Campaña y UTMs configuradas | Clasificación prevista de la pieza registrada. |
| UTMs recibidas | Parámetros externos observados, validados y limitados; no equivalen por sí solos a origen verificado. |
| Evento de origen del enlace | Encuentro asociado al QR al generarlo. |
| Evento confirmado | Encuentro elegido por la persona; puede ser distinto o ninguno. |
| Estado del contexto | Confirmado, cambiado, sin evento o sin resolver. Abrir un enlace no confirma contexto. |
| Canal y modalidad | Web autónoma o asistida, por separado de modalidad presencial/virtual del encuentro. |
| Lugar del problema | Declaración del participante, preguntada por separado; puede diferir del lugar del evento. |

Para la primera entrega, la atribución por aporte usa el enlace que inició el formulario actual. Volver a entrar por otro enlace no debe sustituir silenciosamente el origen de un borrador activo: ofrecer continuar ese borrador o iniciar otro. La corrección del evento no reescribe el enlace inicial. No se necesita seguimiento entre dispositivos ni historial publicitario de la persona.

El vínculo registrado del enlace determina su evento de origen. UTMs manipuladas o desconocidas no lo reemplazan. Se marcan discrepancias como dato por revisar y se permite captura según las reglas de la convocatoria. Los parámetros se validan y no se muestran como HTML ni se utilizan para redirecciones a destinos arbitrarios.

**Qué NO hace:** inferir presencia física, personas únicas, votos o causalidad publicitaria; deducir que el problema está en el municipio del evento; contar de nuevo un aporte por cambiar de contexto.

**Aceptación:** escanear el QR de un evento en A, confirmar B y reportar un problema en C produce un aporte, con las tres ubicaciones/contextos diferenciados. UTMs alteradas no cambian el evento registrado ni conceden permisos.

## QR-04 · Manejar enlaces antiguos y cambios de agenda

**Quién:** Responsable de proceso gestiona cambios; Comunicaciones actualiza material.

**Con qué llega:** enlace existente a evento reprogramado, cancelado, pasado, fuera de ventana o no disponible.

**Qué queda:** página que explica el estado real y ofrece alternativas vigentes: fecha actualizada, consulta de memoria, aporte dentro de ventana si sigue abierta o selección de otra oportunidad. Cancelación o cierre no elimina los aportes previos ni los datos de procedencia. Retirar un enlace impide usarlo como acceso activo, pero puede conservar una explicación pública apropiada.

**Qué NO hace:** abrir recepción cerrada porque el QR sigue impreso, redirigir a un evento diferente sin avisar ni prometer que afiches ya distribuidos cambian solos.

**Aceptación:** el mismo QR de un evento reprogramado muestra el cambio de fecha. Un QR cancelado informa cancelación y no invita a asistir. Ante ID inexistente se muestra selector/agenda sin inventar evento ni asociación.

## QR-05 · Medir el recorrido y detectar material confundido

**Quién:** Analista y Comunicaciones, desde vistas internas autorizadas.

**Con qué llega:** enlaces, piezas, contexto confirmado y aportes recibidos; métricas de acceso cuando se hayan instrumentado.

**Qué queda:** filtros por campaña, pieza, evento de origen y evento confirmado; conteos separados de accesos, formularios iniciados cuando medidos y aportes persistidos. Mostrar correcciones de contexto y aportes sin evento, sin exponer identidad. Un acceso web no permite saber con certeza que hubo un escaneo de cámara: puede venir de un enlace reenviado.

Las discrepancias A → B ayudan a revisar materiales o su distribución. No demuestran fraude ni error del participante: compartir un enlace puede ser legítimo. La tasa de corrección declara su denominador —aportes recibidos con evento de origen conocido— y no se presenta como porcentaje de todos los asistentes.

**Qué NO hace:** sumar las vistas por origen y contexto como aportes diferentes, atribuir todos los aportes de un evento a una campaña ni presentar accesos como personas únicas.

**Aceptación:** un aporte con origen A y contexto B aparece en ambas vistas pertinentes, pero cuenta una vez en el total nacional. Los registros sin atribución siguen visibles y no se asignan a la campaña más reciente por defecto.

## Ejemplo completo

Comunicaciones prepara un encuentro en el municipio A y genera QR distintos para un afiche y una publicación digital. Ambos apuntan al mismo encuentro, con piezas distinguibles. Una persona recibe la publicación reenviada mientras participa en el encuentro B. Al entrar, cambia de evento y cuenta un problema de agua que afecta una vereda del municipio C.

El equipo conoce el origen digital del enlace, el contexto B declarado y el lugar C del problema. Puede comprender qué material circuló, organizar el aporte correctamente y analizar las necesidades territoriales sin atribuir a A una asistencia inexistente.

## Relación con el producto

- **Convocatoria y divulgación:** generador de enlaces/QR y materiales asociados a campañas y agenda.
- **Captura:** confirmación y corrección rápida del evento; pregunta independiente sobre lugar del problema.
- **Eventos y facilitación:** catálogo y estado vigente de encuentros, sesiones y condiciones.
- **BI Institucional:** atribución y diagnóstico con dimensiones separadas y conteos reconciliados.
- **Administración:** permisos, validación de parámetros y trazabilidad de cambios de destinos.

Estos requisitos concretan el registro de procedencia previamente definido. La identidad de un evento proviene de su registro; el QR facilita el acceso, las UTMs describen difusión y la persona confirma su contexto.
