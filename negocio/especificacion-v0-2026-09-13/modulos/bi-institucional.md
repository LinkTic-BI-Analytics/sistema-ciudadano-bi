# BI Institucional — requerimiento

|  |  |
|---|---|
| **Código** | M03 |
| **Versión y fecha** | 2026-09-13 |
| **Depende de** | — |
| **Lo usan** | Analista *(sin confirmar)*, Comunicaciones *(sin confirmar)*, Responsable institucional *(sin confirmar)* |
| **Estado en el MVP** | diseñado y no construido |

## 1 · Qué hace

Mapas, indicadores y filtros para explorar las necesidades, ver la cobertura territorial y exportar datos con reglas claras de conteo.

Analista y gestores autorizados exploran problemas, afectación, atención y vacíos de escucha. BI-01/02/03 y TRA-01: mapa agregado, indicadores y lista sincronizados por periodo de recepción, territorio, tema, canal y revisión; expediente y exportación protegida reproducible. Separar aportes, necesidades, recurrencia, afectación y atención. SEN-01 — Bandeja interna de señales poco visibles: baja recurrencia sin revisar, afectación grave reportada con un solo aporte, tema emergente, ubicación/clasificación pendiente, disensos de grupos y falta de respuesta. Cada señal conserva motivo, fuentes, incertidumbre, responsable y estado de examen; filtros y detección manual funcionan sin IA. No inventa problemas no reportados ni elimina señales raras por popularidad. COB-01 — Mapa de escucha separado: fuera de alcance, sin registros, ubicación por aclarar, revisión pendiente y registros disponibles. Alcance territorial y corte versionados; 7 de 10 municipios = 70% de presencia municipal, no población representada. Presencia en cabecera no prueba cobertura de veredas. Desde la brecha se crea acción CAM-01, con evidencia, barrera y motivo; seguimiento CAM-02 muestra línea base, territorios nuevos, calidad y canales, sin confundir antes/después con causalidad. Prioridad de escuchar más, de revisar y de financiar son distintas. VIS-01: BI interno por rol/ámbito; información pública solo versión aprobada. Caso: dos reportes rurales de contaminación permanecen visibles entre cientos de baja presión; un caso sin ubicación sigue en pendientes aunque no tenga punto en mapa. Fuente: requisitos_visibilidad_agrupacion_y_campanas_v1.md.

| Quién | Qué hace aquí | Qué NO puede |
|---|---|---|
| Analista *(sin confirmar)* | Explora mapa, filtros, calidad y cobertura; contrasta fuentes con fecha y territorio, consulta expedientes autorizados y reproduce cortes exportados para apoyar decisiones motivadas. | No presenta participación voluntaria como censo, modifica originales ni exporta identidad fuera de autorización. Consulta datos y fuentes con unidad, fecha y calidad. |
| Comunicaciones *(sin confirmar)* | Identifica vacíos de participación y crea acciones de convocatoria desde la vista de cobertura. | No descarga contactos ni relatos privados del BI para publicidad. Usa cobertura agregada para ampliar escucha; no promete obras o decisiones garantizadas. |
| Responsable institucional *(sin confirmar)* | Detecta pendientes, remisiones no aceptadas y falta de atención para gestionar respuestas. | Solo decide dentro de mandato y competencia; no inventa financiación o ejecución ni cierra por silencio. Designación nominal pendiente. |

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

### RF6 — Explorar necesidades territoriales con mapa, lista e indicadores sincronizados

Explorar necesidades territoriales con mapa, lista e indicadores sincronizados. BI-01: analista y responsable autorizado seleccionan periodo de recepción, territorio, tema, canal y estado; obtienen IDs y métricas del mismo universo, acceso al expediente y corte exportable autorizado. Excluye censo, predicción de problemas no expresados y publicación de ubicaciones sensibles.

|  |  |
|---|---|
| **Quién lo hace** | Analista y Responsable institucional con permisos; Comunicaciones solo consulta cobertura y agregados autorizados. Referencia a actores del catálogo, no personas nominalmente designadas. |
| **Con qué llega** | Aportes persistidos y expedientes con IDs, vínculos territoriales y estados de calidad; catálogo versionado, periodo de recepción, filtros y rol autorizado. Puede haber datos incompletos y cero registros; no exigirlos resueltos para mostrar calidad. |
| **Qué queda después** | Mapa, lista e indicadores del mismo universo y corte; filtros visibles, unidades y pendientes. Acceso al expediente autorizado y exportación con fecha, zona horaria, filtros, catálogo y diccionario reproducible. Caso: 10 aportes, 7 ubicados, 3 pendientes muestran 10/7/3 y 70%, sin duplicar por multiterritorio. |
| **Lo que NO hace** | No es censo ni estima prevalencia; no inventa geografía o datos no reportados, no asigna presupuesto, no publica información sensible y no incorpora ejecución de PIIP sin integración validada. BI institucional es P0; mapa público detallado e IA avanzada condicionados. |
| **Regla que lo gobierna** | Solo consultar/exportar con rol y alcance autorizados. Aplicar BI-01, CAL-01 y TRA-01: mismo periodo, filtros, corte y catálogo; total por IDs distintos. SEG-01 impide identidad y datos protegidos para divulgación. Sin alcance territorial definido, cobertura porcentual no disponible. |
| **Prioridad** | — |

| Caso | Qué tiene que salir |
|---|---|
| Caso sintético de aceptación de RF6, no prueba ejecutada: analista autorizado abre corte de 10 aportes, 7 ubicados y 3 por aclarar. Dos aportes se vinculan a necesidad A que afecta dos municipios; un aporte se vincula a necesidad B rural de baja recurrencia. Selecciona periodo, territorio, tema, canal y revisión, abre B desde la lista y exporta el mismo corte. Luego cambia periodo a uno sin registros. Comunicaciones intenta exportar contactos. | Resultado esperado: corte inicial muestra 10 aportes, 7 ubicados, 3 pendientes y 70% de ubicación resuelta. A cuenta una sola vez nacionalmente aunque tenga dos municipios. B puede encontrarse y abrirse sin ranking de popularidad. Cada cambio de filtro actualiza mapa, indicadores, lista y exportación sobre los mismos IDs autorizados; exportación conserva corte, filtros, fecha/zona horaria, catálogo y diccionario. Periodo vacío explica sin registros en ese periodo, no ausencia de necesidades. Acceso de Comunicaciones a contactos se deniega. No se modifica un archivo exportado previamente. |

## 6 · `I` — lo que nunca puede pasar

### I6 — No divulgar identidad ni ubicación sensible a un rol no autorizado, ni ofrecer mapas y exportaciones con universos contradictorios

No divulgar identidad ni ubicación sensible a un rol no autorizado, ni ofrecer mapas y exportaciones con universos contradictorios. Motivo: daño a personas y decisiones equivocadas. SEG-01/BI-01/TRA-01. Aceptación sintética: comunicaciones no descarga contactos; caso protegido sigue en bandeja autorizada; mismos filtros producen mismo total.

**Por qué.** No existe incidente real documentado; es un riesgo de diseño. Exponer identidad puede causar daño y desalentar participación, especialmente en comunidades pequeñas. Caso sintético: rol Comunicaciones intenta exportar contactos y obtiene denegación; un revisor autorizado conserva acceso al expediente protegido según política.

## 7 · `R` — las reglas

### R1 — Conteo de lugares en una necesidad

Si una necesidad afecta a varios municipios, no se multiplica el conteo de necesidades a nivel nacional.

**Por qué.** Una necesidad puede afectar varios territorios; sumar subtotales la duplicaría y sesgaría la priorización. BI-02/TRA-01 usan conjuntos de IDs distintos en el corte. Ejemplo sintético: necesidad A en dos municipios y B en uno totalizan dos necesidades nacionales, aunque haya tres vínculos municipales.

| Caso | Qué tiene que salir |
|---|---|
| Si la primera afecta dos municipios | el país sigue teniendo dos necesidades únicas, no tres. |

### R2 — Conteo de registros sin ubicación

Los aportes que no tienen un municipio definido siguen sumando al total general de aportes, pero no alteran las métricas de los municipios que sí están ubicados.

**Por qué.** Excluirlos ocultaría barreras de captura y produciría falsa ausencia territorial. CAL-01: aportes sin municipio cuentan en total recibido y pendientes de ubicación; no en municipios con aportes ubicados. Ubicación municipal resuelta divide aportes con vínculo aceptado entre aportes del universo, sin multiplicar por vínculos.

| Caso | Qué tiene que salir |
|---|---|
| Caso sintético de aceptación, no evento real ni prueba ejecutada: corte con 10 aportes, 7 con municipio aceptado y 3 sin resolver. Total recibido=10; pendientes=3; ubicación resuelta=70%. Si uno de los 7 tiene dos municipios, numerador sigue 7. Al aclarar otro aporte se genera un corte nuevo 8/10, sin reescribir el corte exportado anterior. | En el corte inicial deben aparecer 10 aportes recibidos, 3 pendientes de municipio y 70% de ubicación municipal resuelta; dos vínculos del mismo aporte no cambian 7 como numerador. Mapa, lista y exportación coinciden en universo. Corte posterior: 8 resueltos y 80%, sin modificar archivo anterior. |

## 12 · Entendido, sin codificar todavía

| Lo que entendimos | Estado | De dónde salió |
|---|---|---|
| **No es un censo estadístico** — El sistema mapea lo que la gente reporta, no calcula la prevalencia real del problema en todo el país. Muestra lo conocido y evidencia lo que falta por conocer. | confirmado | especificacion_datos_y_bi_v1.md |
| **Cuéntame de qué se trata esto. ¿Qué se hace aquí, con tus palabras?** — Analista y gestores autorizados exploran problemas, afectación, atención y vacíos de escucha. BI-01/02/03 y TRA-01: mapa agregado, indicadores y lista sincronizados por periodo de recepción, territorio, tema, canal y revisión; expediente y exportación protegida reproducible. Separar aportes, necesidades, recurrencia, afectación y atención. SEN-01 — Bandeja interna de señales poco visibles: baja recurrencia sin revisar, afectación grave reportada con un solo aporte, tema emergente, ubicación/clasificación pendiente, disensos de grupos y falta de respuesta. Cada señal conserva motivo, fuentes, incertidumbre, responsable y estado de examen; filtros y detección manual funcionan sin IA. No inventa problemas no reportados ni elimina señales raras por popularidad. COB-01 — Mapa de escucha separado: fuera de alcance, sin registros, ubicación por aclarar, revisión pendiente y registros disponibles. Alcance territorial y corte versionados; 7 de 10 municipios = 70% de presencia municipal, no población representada. Presencia en cabecera no prueba cobertura de veredas. Desde la brecha se crea acción CAM-01, con evidencia, barrera y motivo; seguimiento CAM-02 muestra línea base, territorios nuevos, calidad y canales, sin confundir antes/después con causalidad. Prioridad de escuchar más, de revisar y de financiar son distintas. VIS-01: BI interno por rol/ámbito; información pública solo versión aprobada. Caso: dos reportes rurales de contaminación permanecen visibles entre cientos de baja presión; un caso sin ubicación sigue en pendientes aunque no tenga punto en mapa. Fuente: requisitos_visibilidad_agrupacion_y_campanas_v1.md. | confirmado | corregida en la sesión |
| **¿Qué pasa cuando sale mal?** — Ubicación o clasificación pendiente no desaparece: mostrar totales y calidad separados. Resultado vacío informa filtros; municipio sin aportes no significa sin necesidades. Si no hay universo territorial no calcular cobertura porcentual. Fuente o periodo incompatible impide comparación por habitante. | confirmado | escrito aquí |
| **¿Qué no puede pasar nunca?** — Nunca sumar subtotales territoriales solapados ni llamar votos o personas a los aportes. Caso sintético: 12 aportes a una necesidad en dos municipios y 3 a otra suman 15 aportes y 2 necesidades nacionales. Mapa/lista/exportación con igual corte deben reconciliar. Un caso pequeño grave sigue encontrable. Contactos y ubicaciones sensibles no se exportan por divulgación. | confirmado | escrito aquí |

## 13 · Lo que queda abierto

> ➤ Lo que nadie ha decidido todavía. Un módulo que se entrega con esto vacío y preguntas abiertas miente.

## La prueba del sobre cerrado

- [ ] Cada código se resuelve adentro del archivo
- [ ] Cada regla tiene al menos un caso de verificación
- [ ] Cada invariante dice qué se rompe
- [ ] Ninguna referencia a un archivo que el equipo no recibió
- [ ] Nadie tiene que preguntar qué significa una palabra
