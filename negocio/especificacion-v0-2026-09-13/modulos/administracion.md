# Administración — requerimiento

|  |  |
|---|---|
| **Código** | M10 |
| **Versión y fecha** | 2026-09-13 |
| **Depende de** | — |
| **Lo usan** | Responsable de proceso *(sin confirmar)*, Administración *(sin confirmar)* |
| **Estado en el MVP** | diseñado y no construido |

## 1 · Qué hace

Contiene permisos, privacidad, versiones y exportación.

Administración técnica y Responsable de proceso configuran roles, fases, catálogos y versiones; separan identidad/contacto del dato analítico y registran cambios y exportaciones. VIS-01/SEG-01: tres superficies de acceso: pública sin cuenta para convocatoria, agenda e información aprobada; privada del ciudadano para su aporte y respuesta mediante acceso seguro; interna por rol, tarea, convocatoria y territorio para revisión, agrupación, señales, BI y campañas. El acceso interno no permite a todos ver todos los originales. Permisos por acción, registro y campo se aplican a mapa, lista, búsqueda, detalle y exportación, también por URL directa. Publicación exige versión protegida y responsable; borradores, listas de asistentes, contactos y enlaces de moderación no se publican. Comunicaciones recibe diagnóstico agregado para campañas, no relatos privados ni perfiles sensibles para publicidad. Administración técnica no obtiene autoridad presupuestal. Caso VIS-01: un aporte protegido permanece en bandeja autorizada pero no se filtra por mapa público, descarga ni ID ajeno; la falta de política de detalle público no impide publicar agenda autorizada. Fuente: requisitos_visibilidad_agrupacion_y_campanas_v1.md.

| Quién | Qué hace aquí | Qué NO puede |
|---|---|---|
| Responsable de proceso *(sin confirmar)* | Configura fases y reglas habilitadas. | No inventa autoridad, recursos, pesos o reglas de votación aprobadas; publicación y cambios de fase deben tener versión y fundamento. |
| Administración *(sin confirmar)* | Gestiona permisos, catálogos y auditoría. | Permisos técnicos no autorizan decidir necesidades o presupuesto. No expone identidad ni altera auditoría; conservación requiere política definida por finalidad. |

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

### RF14 — Qué hace: administración técnica y responsable de proceso configuran roles, fases, catálogos y versiones; separan identidad/contacto del dato analítico y registran cambios y exportaciones

Qué hace: administración técnica y responsable de proceso configuran roles, fases, catálogos y versiones; separan identidad/contacto del dato analítico y registran cambios y exportaciones. SEG-01: permisos de consulta y exportación deben aplicarse por rol y alcance.

|  |  |
|---|---|
| **Quién lo hace** | Administración técnica y Responsable de proceso según responsabilidad y alcance. |
| **Con qué llega** | Políticas y mandatos aprobados cuando correspondan, roles, catálogos y versiones; datos sintéticos durante diseño. |
| **Qué queda después** | Permisos y fases versionados, registro de cambios y control de consulta/exportación; publicación detallada deshabilitada si falta política. |
| **Lo que NO hace** | No concede autoridad sustantiva para presupuesto ni define unilateralmente retención o responsables institucionales. |
| **Regla que lo gobierna** | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No concede autoridad sustantiva para presupuesto ni define unilateralmente retención o responsables institucionales. |
| **Prioridad** | — |

| Caso | Qué tiene que salir |
|---|---|
| Caso sintético de aceptación, no prueba ejecutada: Administrador configura rol Comunicaciones y este intenta descargar contactos y consultar expediente restringido. Se modifica catálogo y se retira un permiso. | Acceso no autorizado se deniega y cambios son auditables/versionados. Fuente histórica no se reescribe; permiso revocado no habilita nuevas consultas. Permiso técnico no concede autoridad presupuestal; publicación detallada permanece deshabilitada sin política aprobada. |

## 6 · `I` — lo que nunca puede pasar

> ➤ Lo que no puede pasar nunca, con su porqué. Sin esto no hay criterio de cierre.

## 7 · `R` — las reglas

> ➤ Las reglas del módulo, con los mismos códigos de la especificación.

## 12 · Entendido, sin codificar todavía

| Lo que entendimos | Estado | De dónde salió |
|---|---|---|
| **Cuéntame de qué se trata esto. ¿Qué se hace aquí, con tus palabras?** — Administración técnica y Responsable de proceso configuran roles, fases, catálogos y versiones; separan identidad/contacto del dato analítico y registran cambios y exportaciones. VIS-01/SEG-01: tres superficies de acceso: pública sin cuenta para convocatoria, agenda e información aprobada; privada del ciudadano para su aporte y respuesta mediante acceso seguro; interna por rol, tarea, convocatoria y territorio para revisión, agrupación, señales, BI y campañas. El acceso interno no permite a todos ver todos los originales. Permisos por acción, registro y campo se aplican a mapa, lista, búsqueda, detalle y exportación, también por URL directa. Publicación exige versión protegida y responsable; borradores, listas de asistentes, contactos y enlaces de moderación no se publican. Comunicaciones recibe diagnóstico agregado para campañas, no relatos privados ni perfiles sensibles para publicidad. Administración técnica no obtiene autoridad presupuestal. Caso VIS-01: un aporte protegido permanece en bandeja autorizada pero no se filtra por mapa público, descarga ni ID ajeno; la falta de política de detalle público no impide publicar agenda autorizada. Fuente: requisitos_visibilidad_agrupacion_y_campanas_v1.md. | confirmado | corregida en la sesión |
| **¿Qué pasa cuando sale mal?** — Revocación de permiso corta acceso futuro sin reescribir auditoría. Retiro de aporte o cuenta genera tratamiento según política por finalidad; no borrar automáticamente necesidades colectivas ni conservar todo para siempre. Cambio de entidad requiere sucesor autorizado y trazabilidad. | confirmado | escrito aquí |
| **¿Qué no puede pasar nunca?** — Nunca confundir permiso técnico con autoridad de decidir presupuesto. Publicación detallada deshabilitada sin política de privacidad y evaluación de reidentificación. Caso: rol comunicaciones no descarga contactos ni relatos privados; expediente protegido sigue disponible al revisor autorizado. | confirmado | escrito aquí |

## 13 · Lo que queda abierto

> ➤ Lo que nadie ha decidido todavía. Un módulo que se entrega con esto vacío y preguntas abiertas miente.

## La prueba del sobre cerrado

- [ ] Cada código se resuelve adentro del archivo
- [ ] Cada regla tiene al menos un caso de verificación
- [ ] Cada invariante dice qué se rompe
- [ ] Ninguna referencia a un archivo que el equipo no recibió
- [ ] Nadie tiene que preguntar qué significa una palabra
