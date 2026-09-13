# Contexto documental — requerimiento

|  |  |
|---|---|
| **Código** | M09 |
| **Versión y fecha** | 2026-09-13 |
| **Depende de** | — |
| **Lo usan** | Revisor *(sin confirmar)*, Analista *(sin confirmar)* |
| **Estado en el MVP** | diseñado y no construido |

## 1 · Qué hace

Administra fuentes verificables e IA asistente.

Qué hace: revisor y analista catalogan fuentes con origen, fecha, territorio, unidad y limitaciones. Permiten contextualizar después de escuchar el relato. IA-01 propone contexto verificable; entrevista automática es ampliación P1. No hay integración de DNP, TerriData o PIIP confirmada por mencionar su nombre.

| Quién | Qué hace aquí | Qué NO puede |
|---|---|---|
| Revisor *(sin confirmar)* | Aclara, clasifica, revisa ubicación, relaciona y desagrupa necesidades en la bandeja de calidad. | No inventa ubicaciones o hechos, borra disensos ni aprueba presupuesto. Clasificaciones y agrupaciones requieren motivo y trazabilidad. |
| Analista *(sin confirmar)* | Explora mapa, filtros, calidad y cobertura; contrasta fuentes con fecha y territorio, consulta expedientes autorizados y reproduce cortes exportados para apoyar decisiones motivadas. | No presenta participación voluntaria como censo, modifica originales ni exporta identidad fuera de autorización. Consulta datos y fuentes con unidad, fecha y calidad. |

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

### RF13 — Qué hace: revisor y analista catalogan fuentes con origen, fecha, territorio, unidad y limitaciones

Qué hace: revisor y analista catalogan fuentes con origen, fecha, territorio, unidad y limitaciones. Permiten contextualizar después de escuchar el relato. IA-01 propone contexto verificable; entrevista automática es ampliación P1. No hay integración de DNP, TerriData o PIIP confirmada por mencionar su nombre.

|  |  |
|---|---|
| **Quién lo hace** | Revisor y Analista; administración gestiona permisos de fuentes. |
| **Con qué llega** | Fuente verificable con fecha, territorio, unidad y limitaciones o estado explícito de no disponibilidad. |
| **Qué queda después** | Ficha contextual versionada y referencia rastreable; dato municipal conserva ese alcance, no se convierte en dato barrial. |
| **Lo que NO hace** | No inventa fuentes o integraciones ni impide captura por ausencia de IA; entrevista automática es ampliación. |
| **Regla que lo gobierna** | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No inventa fuentes o integraciones ni impide captura por ausencia de IA; entrevista automática es ampliación. |
| **Prioridad** | — |

| Caso | Qué tiene que salir |
|---|---|
| Caso sintético de aceptación, no prueba ejecutada: Fuente municipal está desactualizada y falta información de barrio; el proveedor de IA no responde mientras se captura un aporte. | Fuente marcada con periodo, territorio y limitación; no se inventa dato barrial ni se atribuye al ciudadano. Recepción y revisión manual continúan. No se declara integración externa operativa por mencionar una fuente. |

## 6 · `I` — lo que nunca puede pasar

> ➤ Lo que no puede pasar nunca, con su porqué. Sin esto no hay criterio de cierre.

## 7 · `R` — las reglas

> ➤ Las reglas del módulo, con los mismos códigos de la especificación.

## 12 · Entendido, sin codificar todavía

| Lo que entendimos | Estado | De dónde salió |
|---|---|---|
| **Límites de la IA** — La inteligencia artificial propone, pero los humanos deciden y asumen la responsabilidad. | confirmado | especificacion_nucleo_participacion_v2.md |
| **Cuéntame de qué se trata esto. ¿Qué se hace aquí, con tus palabras?** — Qué hace: revisor y analista catalogan fuentes con origen, fecha, territorio, unidad y limitaciones. Permiten contextualizar después de escuchar el relato. IA-01 propone contexto verificable; entrevista automática es ampliación P1. No hay integración de DNP, TerriData o PIIP confirmada por mencionar su nombre. | confirmado | escrito aquí |
| **¿Qué pasa cuando sale mal?** — Fuente ausente o antigua se marca no disponible/desactualizada; continúa captura manual sin inventar datos. Cambio de fuente conserva versión y obliga revisar la interpretación relacionada. No presentar dato municipal como dato de barrio. | confirmado | escrito aquí |
| **¿Qué no puede pasar nunca?** — Nunca atribuir al ciudadano información que solo viene de una fuente o IA; no inferir causalidad o ejecución. Ficha contextual conserva referencia verificable, periodo y alcance. Dependencias reales, permisos y frecuencia de actualización pendientes de inventario. | confirmado | escrito aquí |

## 13 · Lo que queda abierto

> ➤ Lo que nadie ha decidido todavía. Un módulo que se entrega con esto vacío y preguntas abiertas miente.

## La prueba del sobre cerrado

- [ ] Cada código se resuelve adentro del archivo
- [ ] Cada regla tiene al menos un caso de verificación
- [ ] Cada invariante dice qué se rompe
- [ ] Ninguna referencia a un archivo que el equipo no recibió
- [ ] Nadie tiene que preguntar qué significa una palabra
