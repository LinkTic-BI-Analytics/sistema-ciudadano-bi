# Brechas de conocimiento del proyecto 5

12 de septiembre de 2026. Revisión posterior a las correcciones de dev-req.

## Respuesta

Sí, podemos cerrar más con lo que ya sabemos. La lista mezcla decisiones de diseño, datos de operación, aprobaciones institucionales y limitaciones de la herramienta. No todo lo que aparece vacío exige otra reunión o investigación.

## Cierres guardados y comprobados

Se completó un caso sintético y su resultado esperado para el requisito principal de cada uno de los diez módulos. Se verificaron en los documentos de módulo: ya no aparece el aviso de falta de caso en esos requisitos. RF6 incluye ahora su propia prueba, además del caso de R2 del 70 %. Son criterios de aceptación propuestos, no pruebas ejecutadas de una implementación.

También se completaron las razones de I1 e I2 en Captura, distinguiendo riesgos de diseño de incidentes históricos no documentados.

Se respondieron y confirmaron cinco preguntas generales adicionales:

| Pregunta | Definición guardada | Condición que no se inventó |
|---|---|---|
| Necesidad multidepartamental | Un expediente y varios vínculos; bandeja de revisión interterritorial del Responsable de proceso y remisión por competencia. | La entidad asigna operador y directorio antes de activar la convocatoria. |
| Conflicto entre entidades | Estado En revisión de competencia y custodia funcional en coordinación hasta aceptación de una asignación; historia y motivos. | No se determina jurídicamente la competencia ni se designa persona real. |
| Cierre de recepción sin respuesta | Cerrar recepción no cierra expedientes. Mostrar Sin respuesta registrada y última actuación; no inventar vencimiento. | Plazos y escalamiento se configuran cuando estén acordados. |
| Mismo problema por web y evento | Conservar dos aportes con procedencia y proponer vínculo revisado a una necesidad; no duplicar necesidades por canal. | No afirmar identidad única ni crear apoyos sin el mecanismo correspondiente. |
| Asunto sin entidad participante competente | Bandeja de orientación del Responsable de proceso, motivo, búsqueda de ruta y siguiente paso visible. | Directorios y convenios deben existir para remitir efectivamente; no prometer respuesta de terceros. |

Los pendientes generales bajan de **14 a 9**. Definir bandejas y estados es una decisión de producto; asignarles personas y autoridad real es una condición de operación distinta. El cierre de diseño no acredita esta última.

## Qué podemos seguir cerrando nosotros

| Brecha | Trabajo de nuestro lado | Límite |
|---|---|---|
| Casos, reglas, entradas y salidas | Desagregar todos los requisitos de las fuentes y sus escenarios; los diez contratos principales ya tienen un caso. | Un caso principal por módulo no cubre todas las variantes ni requisitos de la fuente. |
| Datos mínimos de inscripción a eventos | Proponer identificador de evento, modalidad, registro de inscripción y estado; datos de contacto/ayuda solo según finalidad, con distinción entre inscripción y asistencia. | Cupo, reglas de elegibilidad e identificación dependen del evento y deben acordarse. |
| Tecnología | Preparar una alternativa de arquitectura y estimación con supuestos visibles. | No declarar que el DNP tiene licencias, nube o integraciones que no se han inventariado. |
| Integraciones del piloto | Definir contratos internos y comportamiento ante ausencia de datos externos. | Integración con ejecución presupuestal sigue fuera del piloto; no requiere inventar una API para completar la ficha. |
| Alertas de gestión | Definir estado pendiente, fecha de última acción, responsable y alertas configurables. | El número de días y sus efectos institucionales requieren un plazo aplicable acordado. |
| Prioridades de entrega | Reconciliar requisitos con primera entrega y ampliaciones de las fuentes. | No confundir P1 como prioridad de entrega con un identificador de regla; el diagnóstico mostró esa confusión en RF13. |

## Nueve preguntas abiertas: responsables y alcance del bloqueo

| Grupo | Preguntas de la lista | Quién debe definir el dato o política | Qué podemos avanzar mientras tanto |
|---|---:|---|---|
| Retiro, eliminación y derivados | 3 | Responsable de datos de la entidad y asesoría jurídica. | Separar identidad, aporte y expediente; implementar solicitud y control de exposición con datos sintéticos. No decidir retención universal. |
| Cambio de vocero colectivo | 1 | Responsable del proceso con protocolo de representación. | Historial y cambios versionados; no transferir notificaciones a alguien no validado. |
| Tiempo para vencimientos | 1 | Entidad responsable de la respuesta y operación. | Estado sin respuesta y antigüedad; evitar vencido si falta plazo. |
| Unicidad de voto en equipo compartido | 1 | Responsable del mecanismo y seguridad, si se habilita votación. | Mantener votación inactiva en el piloto. Esta pregunta no debería bloquear la captura y el BI iniciales. |
| Atención de emergencia reportada | 1 | Entidad promotora y responsables de canales de atención. | Diseñar identificación de urgencia reportada y orientación; no inventar destinatario o prometer atención inmediata. |
| Autoridad para rechazar o declarar falta de competencia | 1 | Entidad promotora según mandato. | Permisos configurables, motivos, revisión e historial sin asignar autoridad real por software. |
| Suplantación y automatización abusiva | 1 | Responsable del proceso, seguridad y responsable de datos. | Diseñar señales, revisión humana y reclamación; no equiparar IP compartida o crítica con fraude, ni prometer fraude imposible. |

Son nueve preguntas, no necesariamente nueve reuniones: las tres de retiro pertenecen a una política común de tratamiento de datos.

## Vacíos que necesitan mejor clasificación en dev-req

- **«Decidido» vacío:** esa sección solicita decisiones cerradas por construcción y un artefacto verificable. No debe rellenarse fingiendo implementación. Las decisiones de diseño confirmadas existen y necesitan una sección o vínculo propio.
- **«Qué bloquea» y «Recomendación» vacíos:** la tabla de pendientes muestra guiones. Debe permitir registrar alcance del bloqueo, recomendación y responsable. Falta de identidad para una futura votación no bloquea la captura del piloto.
- **Veinte entradas de experiencia histórica:** provienen de dos preguntas por módulo marcadas «Esto todavía no existe». Deben distinguirse de información operativa faltante. Se puede validar el proceso actual de talleres con la entidad; no inventar uso histórico de esta plataforma.
- **Datos repetidos:** entidad, responsables, presupuesto, autoridad y plazos aparecen en varias formulaciones. Deben vincularse a una definición común sin perder su procedencia.
- **Datos disponibles frente a aprobado:** el diseño puede estar completo para un prototipo y aún no autorizado para operar. La herramienta debe reflejar ambas condiciones.

## Siguiente paso concreto

Continuar con una matriz fuente → requisito → regla → caso para terminar la desagregación del piloto. Solicitar a la entidad un paquete de definiciones agrupadas: operación y autoridad; datos y publicación; atención y plazos; representación; seguridad. Mantener las preguntas de votación y ejecución automática en ampliaciones condicionadas.

No se necesita reiniciar la investigación ni crear otro proyecto. Se necesita terminar de estructurar lo ya definido y obtener únicamente las decisiones externas identificadas.
