# Discusión — requerimiento

|  |  |
|---|---|
| **Código** | M07 |
| **Versión y fecha** | 2026-09-13 |
| **Depende de** | — |
| **Lo usan** | Ciudadano *(sin confirmar)*, Facilitador *(sin confirmar)*, Moderación |
| **Estado en el MVP** | diseñado y no construido |

## 1 · Qué hace

Incluye diferencias, apoyos y alternativas.

Qué hace: ciudadano, facilitador y moderación conservan argumentos, alternativas y desacuerdos vinculados al expediente. Primera entrega registra razones y diferencias; deliberación avanzada, apoyos y votación son ampliaciones sujetas a reglas y mandato.

| Quién | Qué hace aquí | Qué NO puede |
|---|---|---|
| Ciudadano *(sin confirmar)* | Cuenta qué pasa, confirma la síntesis del problema y el lugar afectado. | No accede a expedientes privados ajenos ni al BI institucional; no decide por una entidad ni crea apoyos automáticos al aportar. |
| Facilitador *(sin confirmar)* | Facilita eventos presenciales y encuentros virtuales: explica agenda y reglas, organiza turnos y alternativas para quien no pudo hablar o conectarse. Registra aportes asistidos individuales o colectivos con procedencia, lugar del problema y síntesis por confirmar. Cuando recibe la responsabilidad de relator, prepara memoria con vínculos a aportes, acuerdos, disensos y pendientes para revisión. No exige cámara ni propuesta técnica. | No sustituye la confirmación de la comunidad, inventa asistencia o convierte asistentes en apoyos; no consulta datos fuera del evento y alcance autorizados. |
| Moderación | Revisa señales de abuso, amenazas y datos sensibles, protege publicación y conserva crítica y disenso legítimos con motivo y trazabilidad. | No censura crítica legítima por etiqueta automática de IA, no publica datos sensibles ni altera hechos o decisiones institucionales. Protocolo de incidentes pendiente de aprobación. |

## 3 · Vocabulario

| Palabra del negocio | Qué es | Palabra que NUNCA va en pantalla |
|---|---|---|
| Alternativa | opción de respuesta comparable, distinta del problema expresado. | — |
| Decisión | acto registrado de una autoridad responsable con motivos y alcance. | — |
| Aporte | Una expresión individual o colectiva con identidad de registro propia. | — |
| Persona participante | Persona distinguible con el nivel de identificación disponible. | — |
| Necesidad situada | Problema localizado, afectación y resultado esperado, con expediente estable. | — |
| Punto de dolor | Manifestación concreta del problema: qué ocurre y qué dificulta en la vida cotidiana. | — |
| Territorio o lugar afectado | Área, lugar o conjunto de lugares donde se reporta el problema. | — |
| Apoyo | Expresión explícita de respaldo bajo reglas publicadas. | — |
| Decisión y respuesta | Tratamiento institucional y comunicación de sus motivos. | — |
| Proyecto | instrumento de ejecución cuando corresponda; también puede haber respuestas de gestión, servicio o regulación. | — |
| Plan Nacional de Desarrollo (PND) | La Constitución establece una parte general y un plan de inversiones de las entidades públicas nacionales. La primera contiene objetivos, prioridades y orientaciones; el segundo proyecta programas, proyectos y recursos plurianuales dentro de un marco de sostenibilidad fiscal. | — |
| Expediente de necesidad | La unidad de trabajo con identificador estable que conserva la historia, autoría, versiones, agrupaciones, remisiones, decisiones y evidencia de una necesidad. | — |
| Metodología General Ajustada (MGA) | Herramienta que se utiliza para formular proyectos de inversión pública y convertir problemas y alternativas en intervenciones estructuradas. | — |
| Relatoría | Problemas tratados, alternativas, acuerdos, disensos, preguntas y pendientes; versión, responsable y método de validación. Vínculos a aportes; evita duplicarlos. | — |
| Cobertura de escucha: municipios con al menos un aporte ubicado divididos entre municipios incluidos en alcance definido de convocatoria, por 100. Mide presencia de registros, no representación ni ausencia de necesidades. Sin denominador acordado mostrar conteos y no porcentaje. | Cobertura de escucha es presencia de aportes ubicados en el territorio convocado: municipios con registros dividido por municipios del alcance definido. Ejemplo sintético: 2 de 10 municipios =20%. No es representatividad poblacional: miles de aportes de un municipio no representan los otros nueve. Sin alcance definido no calcular porcentaje. | — |
| Encuentro | ID, convocatoria, título, propósito, temas, modalidad, fecha/zona horaria, lugar o sala externa, estado, responsables funcionales, condiciones de acceso, ayudas disponibles y ventana de aportes. | — |
| Inscripción | ID, encuentro, estado y datos mínimos según finalidad; contacto para avisos separado de autorización para otros usos. No equivale a asistencia. | — |
| Sesión/mesa | ID, encuentro, agenda, facilitador, relator y contexto; puede atender varios territorios. | — |
| Intervención | Origen, momento, mesa y tipo; si se conserva, tratamiento apropiado. Su número no equivale a número de aportes. | — |

## 4 · `RF` — lo que el módulo hace

### RF11 — Qué hace: ciudadano, facilitador y moderación conservan argumentos, alternativas y desacuerdos vinculados al expediente

Qué hace: ciudadano, facilitador y moderación conservan argumentos, alternativas y desacuerdos vinculados al expediente. Primera entrega registra razones y diferencias; deliberación avanzada, apoyos y votación son ampliaciones sujetas a reglas y mandato.

|  |  |
|---|---|
| **Quién lo hace** | Ciudadano, Facilitador y Moderación según fase y permisos. |
| **Con qué llega** | Expediente, alternativas y argumentos, reglas de convivencia y publicación apropiadas. |
| **Qué queda después** | Razones, disensos y versiones vinculadas al expediente; revisión humana de contenido marcado. |
| **Lo que NO hace** | Deliberación avanzada, apoyos y votación vinculante no están habilitados por defecto en P0. |
| **Regla que lo gobierna** | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. Deliberación avanzada, apoyos y votación vinculante no están habilitados por defecto en P0. |
| **Prioridad** | — |

| Caso | Qué tiene que salir |
|---|---|
| Caso sintético de aceptación, no prueba ejecutada: Participante plantea alternativa y otro disiente; IA marca como ofensiva una crítica legítima. La alternativa se modifica posteriormente. | Se conserva disenso y relación con la versión original. Moderación humana revisa señal IA sin censura automática ni publicación de datos privados. No trasladar respaldos a una alternativa distinta; deliberación avanzada y voto permanecen fuera del piloto. |

## 6 · `I` — lo que nunca puede pasar

> ➤ Lo que no puede pasar nunca, con su porqué. Sin esto no hay criterio de cierre.

## 7 · `R` — las reglas

> ➤ Las reglas del módulo, con los mismos códigos de la especificación.

## 12 · Entendido, sin codificar todavía

| Lo que entendimos | Estado | De dónde salió |
|---|---|---|
| **Cuéntame de qué se trata esto. ¿Qué se hace aquí, con tus palabras?** — Qué hace: ciudadano, facilitador y moderación conservan argumentos, alternativas y desacuerdos vinculados al expediente. Primera entrega registra razones y diferencias; deliberación avanzada, apoyos y votación son ampliaciones sujetas a reglas y mandato. | confirmado | escrito aquí |
| **¿Qué pasa cuando sale mal?** — Revisión humana de contenido señalado por IA; separar crítica legítima, amenaza y datos personales. Proteger exposición sin perder trazabilidad conforme política. Si alternativa cambia, versionar y revisar relación con argumentos, sin atribuir respaldos viejos a opción distinta. | confirmado | escrito aquí |
| **¿Qué no puede pasar nunca?** — Nunca equiparar crítica con fraude, asistencia con apoyo o mayoría con verdad. Un disenso minoritario permanece visible a revisión autorizada. No publicar automáticamente acusaciones ni rechazar exclusivamente por etiqueta de IA. | confirmado | escrito aquí |

## 13 · Lo que queda abierto

> ➤ Lo que nadie ha decidido todavía. Un módulo que se entrega con esto vacío y preguntas abiertas miente.

## La prueba del sobre cerrado

- [ ] Cada código se resuelve adentro del archivo
- [ ] Cada regla tiene al menos un caso de verificación
- [ ] Cada invariante dice qué se rompe
- [ ] Ninguna referencia a un archivo que el equipo no recibió
- [ ] Nadie tiene que preguntar qué significa una palabra
