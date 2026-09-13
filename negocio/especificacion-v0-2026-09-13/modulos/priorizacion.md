# Priorización — requerimiento

|  |  |
|---|---|
| **Código** | M08 |
| **Versión y fecha** | 2026-09-13 |
| **Depende de** | — |
| **Lo usan** | Revisor *(sin confirmar)*, Analista *(sin confirmar)*, Responsable institucional *(sin confirmar)*, Entidades competentes *(sin confirmar)*, Responsable de proceso *(sin confirmar)* |
| **Estado en el MVP** | diseñado y no construido |

## 1 · Qué hace

Configura examen, deliberación y, solo cuando aplique, selección presupuestal.

Qué hace: revisor y responsable institucional determinan qué necesidades examinar primero con motivo. PRI-01 usa urgencia reportada, afectación, recurrencia, competencia e incertidumbre separadas y bandeja de casos poco recurrentes no revisados. Salida: prioridad de examen con autor, fecha y evidencia; no financiación.

| Quién | Qué hace aquí | Qué NO puede |
|---|---|---|
| Revisor *(sin confirmar)* | Aclara, clasifica, revisa ubicación, relaciona y desagrupa necesidades en la bandeja de calidad. | No inventa ubicaciones o hechos, borra disensos ni aprueba presupuesto. Clasificaciones y agrupaciones requieren motivo y trazabilidad. |
| Analista *(sin confirmar)* | Explora mapa, filtros, calidad y cobertura; contrasta fuentes con fecha y territorio, consulta expedientes autorizados y reproduce cortes exportados para apoyar decisiones motivadas. | No presenta participación voluntaria como censo, modifica originales ni exporta identidad fuera de autorización. Consulta datos y fuentes con unidad, fecha y calidad. |
| Responsable institucional *(sin confirmar)* | Detecta pendientes, remisiones no aceptadas y falta de atención para gestionar respuestas. | Solo decide dentro de mandato y competencia; no inventa financiación o ejecución ni cierra por silencio. Designación nominal pendiente. |
| Entidades competentes *(sin confirmar)* | Atienden y deciden según mandato. | Organismo que actúa mediante personas autorizadas; no es sinónimo del responsable individual ni una cuenta compartida. No recibe competencias por configuración técnica. |
| Responsable de proceso *(sin confirmar)* | Configura fases y reglas habilitadas. | No inventa autoridad, recursos, pesos o reglas de votación aprobadas; publicación y cambios de fase deben tener versión y fundamento. |

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

### RF12 — Qué hace: revisor y responsable institucional determinan qué necesidades examinar primero con motivo

Qué hace: revisor y responsable institucional determinan qué necesidades examinar primero con motivo. PRI-01 usa urgencia reportada, afectación, recurrencia, competencia e incertidumbre separadas y bandeja de casos poco recurrentes no revisados. Salida: prioridad de examen con autor, fecha y evidencia; no financiación.

|  |  |
|---|---|
| **Quién lo hace** | Revisor y Responsable institucional dentro de mandato; Responsable de proceso configura fases autorizadas. |
| **Con qué llega** | Necesidad, afectación y urgencia reportadas, recurrencia, evidencia, competencia e incertidumbre. |
| **Qué queda después** | Prioridad de examen con autor, fecha y motivo, visible incluso para un caso aislado; no estado financiado. |
| **Lo que NO hace** | No decide por popularidad sola ni inventa pesos, identidad verificada o presupuesto. |
| **Regla que lo gobierna** | Primera entrega según alcance confirmado y reglas de las fuentes N01–N20 y especificación de datos/BI. Actor autorizado, estado y fase habilitados; conservar versiones y motivo. No decide por popularidad sola ni inventa pesos, identidad verificada o presupuesto. |
| **Prioridad** | — |

| Caso | Qué tiene que salir |
|---|---|
| Caso sintético de aceptación, no prueba ejecutada: Necesidad rural grave tiene un aporte y otra urbana miles; revisor consulta afectación y propone examinar primero la rural. | Ambas son encontrables. Se registra prioridad de examen con autor, fecha, evidencia/incertidumbre y motivo. No aparecen financiación, votos multiplicados o pesos inventados; una revisión posterior conserva historia. |

## 6 · `I` — lo que nunca puede pasar

### I5 — Selección habilitada

Votación presupuestal solo con autoridad, presupuesto, elegibilidad, identidad proporcional, regla de selección, desempate, reclamaciones y efecto publicados.

**Por qué.** el software no autoriza gasto.

## 7 · `R` — las reglas

> ➤ Las reglas del módulo, con los mismos códigos de la especificación.

## 12 · Entendido, sin codificar todavía

| Lo que entendimos | Estado | De dónde salió |
|---|---|---|
| **Cuéntame de qué se trata esto. ¿Qué se hace aquí, con tus palabras?** — Qué hace: revisor y responsable institucional determinan qué necesidades examinar primero con motivo. PRI-01 usa urgencia reportada, afectación, recurrencia, competencia e incertidumbre separadas y bandeja de casos poco recurrentes no revisados. Salida: prioridad de examen con autor, fecha y evidencia; no financiación. | confirmado | escrito aquí |
| **¿Qué pasa cuando sale mal?** — Cambio de evidencia genera revisión de prioridad e historia; falta de pesos no se rellena con fórmula inventada. Caso aislado grave se remite a examen motivado. Votación presupuestal permanece inactiva hasta autoridad, presupuesto, identidad, elegibilidad, selección, desempate y reclamación aprobados. | confirmado | escrito aquí |
| **¿Qué no puede pasar nunca?** — Nunca decidir solo por popularidad ni garantizar selección de un grupo por pequeño. No prometer fraude imposible: identidad y controles proporcionales están pendientes para apoyos. Un dispositivo compartido no prueba suplantación. Urgencia reportada orienta a canal apropiado, sin presentar la plataforma como atención de emergencia. | confirmado | escrito aquí |

## 13 · Lo que queda abierto

> ➤ Lo que nadie ha decidido todavía. Un módulo que se entrega con esto vacío y preguntas abiertas miente.

## La prueba del sobre cerrado

- [ ] Cada código se resuelve adentro del archivo
- [ ] Cada regla tiene al menos un caso de verificación
- [ ] Cada invariante dice qué se rompe
- [ ] Ninguna referencia a un archivo que el equipo no recibió
- [ ] Nadie tiene que preguntar qué significa una palabra
