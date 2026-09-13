# Evaluación de dev-req con el proyecto de participación ciudadana

Fecha de prueba: 12 de septiembre de 2026. Evaluación funcional mediante la interfaz; no auditoría del código, seguridad, almacenamiento o proveedor de IA.

## Resultado

Se creó el proyecto **Participación Ciudadana Colombia — Captura, Divulgación y Priorización** y se cargaron completos los dos documentos de trabajo. La herramienta sirve para iniciar una estructura y proponer preguntas, pero la extracción probada no conserva automáticamente toda la esencia y todavía no produce una especificación lista para construir. Los documentos fuente deben seguir siendo referencia junto con las correcciones explícitas.

[Abrir proyecto](https://limitations-shirts-muslim-presidential.trycloudflare.com/participacion-ciudadana-colombia-captura-divulgacion-y-prior/sistema)

## Material y acciones verificadas

- `investigacion_planeacion_ciudadana_colombia_v2.md`: investigación refinada, contexto de la reunión, restricciones y propuesta; la aplicación reporta 13.819 palabras.
- `definicion_producto_participacion_v1.md`: definición del producto, recorrido ciudadano, divulgación, eventos, captura, discusión, priorización, roles y fases; la aplicación reporta 3.225 palabras.
- Ambos fueron autorizados para análisis con OpenRouter bajo el nombre Miguel Gomez, conforme a la autorización del usuario. No se incluyen credenciales en este informe.
- Primera extracción: se seleccionaron 34 de 42 sugerencias; ocho quedaron fuera. Segunda: se seleccionaron 35 de 53; dieciocho quedaron fuera. Son conteos de selección, no una garantía de que 69 registros distintos se hayan persistido correctamente.
- La interfaz muestra diez módulos y siete actores. No se completaron asociaciones de actores a módulos: muestra diez módulos sin actores asignados.
- Se corrigieron manualmente objetivo, unidad de decisión, unidad de captura y límites. Se verificó su presencia en la especificación generada.
- La pantalla de salida permite consultar y bajar un borrador, pero declara 66 decisiones pendientes y doce secciones sin llenar. No se obtuvo ni se certificó una especificación final.

Antes de la indicación de crear un proyecto nuevo, los mismos archivos se habían subido al espacio preexistente Plan de Desarrollo; allí no se ejecutó su análisis. No se eliminaron esos archivos.

## Estructura resultante

Recepción accesible; Talleres; Gestión interna; Contexto documental; Analítica territorial; Respuesta y seguimiento; Espacio de discusión; Consola de convocatoria; Consola de priorización; Administración.

Se evitó añadir como módulos separados varias superficies que duplicaban funciones existentes: portal ciudadano, portal de eventos, consola de facilitación, consola de revisión y tablero público. Esta agrupación es una propuesta de organización; sus pantallas, permisos y relaciones aún necesitan desarrollo dentro de la herramienta.

## Hallazgos de fidelidad

| Evidencia observada | Implicación y tratamiento |
|---|---|
| Conservar el original se transformó en nunca borrar texto ni audio. | Excluido. Se aclaró que preservar la fidelidad del relato no elimina políticas de conservación o supresión de datos personales. |
| Escalar según competencia se interpretó como pasar al siguiente nivel de gobierno. | Excluido. Se dejó explícita la ruta local, interterritorial o nacional según competencia, sin escalera obligatoria. |
| Una ampliación posterior de seguimiento presupuestal se propuso como algo que el producto no hará. | Excluido. Se distinguió futuro condicionado de exclusión permanente. |
| La unidad de decisión se redujo a proyectos o carteras con presupuesto. | Excluido. Se redactaron tres fases: revisión de necesidades, deliberación de alternativas y selección presupuestal solo cuando esté autorizada. |
| Se sugirieron grabación obligatoria, sincronización offline inmediata y bloqueo absoluto de relatorías validadas. | No se importaron esas formulaciones. Voz es opcional; offline robusto requiere validación; las rectificaciones necesitan versiones y trazabilidad, no alteración silenciosa. |
| Varias propuestas conservaron citas textuales, pero cambiaron el sentido de su condición o alcance. | Tener una cita al lado no demuestra fidelidad semántica. |
| La segunda extracción propuso actores y módulos equivalentes a otros existentes. | Se filtraron duplicados antes de importar. No se comprobó reconciliación automática entre documentos. |
| Tres preguntas del sistema seleccionadas en la segunda importación no aparecieron: la salida siguió mostrando las cinco de la primera. | Posible omisión o regla de importación no explicada; requiere reproducir y revisar. No se afirma una causa técnica. |
| La salida pregunta otra vez por objetivo, unidades y límites aun después de corregir sus campos. | La captura de campos y la cola de entrevista no parecen reconciliarse en esta prueba. |
| La salida incluye Aporte como palabra prohibida y afirma que el documento la usa para dos cosas distintas. | No se validó esa afirmación contra evidencia suficiente. Debe revisarse antes de adoptar la restricción de lenguaje. |
| La herramienta mostró porcentajes de cobertura bajos por módulo y 100% en objetivo después de rellenar campos. | Estos indicadores describen su esquema interno; no miden conservación de la esencia ni preparación real para construir. |

## Esencia preservada y trabajo estructural pendiente

Los documentos completos contienen los siguientes requisitos. Algunos aparecen ya como reglas o módulos; otros se recuperaron en los campos corregidos, pero todavía no están desarrollados como flujos verificables.

| Aspecto | Estado observado y siguiente trabajo |
|---|---|
| Ciudadano sin experiencia | Objetivo corregido y regla de lenguaje cotidiano presentes. Faltan flujos accesibles completos y pruebas con personas. |
| Divulgación y eventos físicos | Existen módulos de convocatoria y talleres. Falta relacionar agenda, materiales, canales, accesibilidad y medición de llegada efectiva. |
| Relato fiel y confirmación | Regla de confirmación importada; separación de problema, resultado y solución aparece como afirmación pendiente. |
| Comunidades pequeñas y disensos | Protección de identidad importada; acceso, revisión y respuesta sin prioridad automática incorporados en límites. Faltan reglas operativas y pruebas de no invisibilización. |
| Priorización por fases | Corregida en la unidad de decisión. La descripción automática del módulo aún enfatiza votación; necesita revisión. |
| Contexto e IA | Existe módulo documental. Falta materializar escuchar antes de contextualizar, fuentes con fecha/geografía y prohibición de inventar indicadores locales. |
| Rutas y respuesta | Módulo creado y competencia aclarada. Faltan responsables, aceptación de remisión, plazos y escalamiento por ausencia de respuesta. |
| Seguimiento e incidencia | Se aclaró que ejecución e incidencia requieren evidencia. Falta separar recibido, considerado, incorporado, financiado, ejecutado y resultado. |
| Analítica | Módulo creado. Falta diferenciar participación, necesidades, gestión y ejecución; evitar confundir frecuencia con representatividad. |
| Privacidad y permisos | Restricciones básicas presentes. Faltan conservación, supresión, acceso, consentimiento de voz y verificación de identidad proporcional a cada acción. |
| Integraciones | La aplicación no muestra integraciones registradas. DNP, TerriData, SINERGIA y PIIP son candidatos de la investigación, no accesos probados ni compromisos. |
| Piloto de un mes | Se preservó como hipótesis condicionada. No hay fecha, presupuesto ni capacidad institucional confirmados. |

## Mejoras recomendadas para dev-req

1. Comparar cada extracción con su fuente y distinguir requisito, ejemplo, condición, alternativa, hipótesis, ampliación futura y decisión institucional pendiente.
2. Reconciliar documentos sucesivos: proponer ampliar, reemplazar o vincular antes de crear entidades duplicadas; mostrar qué se guardó, qué no y por qué.
3. Ofrecer una matriz fuente → requisito → módulo → regla → prueba → pendiente. Mostrar explícitamente los fragmentos importantes que todavía no tienen representación estructurada.
4. Conservar un estado de propuesta de diseño separado de aprobación institucional. Editar un campo no debe confundirse con autorización de una entidad.
5. Reconciliar automáticamente preguntas con campos ya contestados, conservando preguntas realmente abiertas. Permitir respuestas parciales sin fingir decisiones.
6. Facilitar carga textual extensa y corrección masiva con revisión de diferencias; en la pestaña Escribir probada se invita a corregir fichas puntuales, sin campo para narración amplia.
7. Distinguir borrador revisable de especificación aprobada. Permitir trabajar con decisiones pendientes sin interpretar que el proyecto carece de todo conocimiento útil.
8. Añadir comprobaciones semánticas: una comunidad pequeña debe sobrevivir al agrupamiento; una fase futura no debe volverse prohibición; una consulta no debe volverse voto presupuestal; una cita no debe ocultar un cambio de significado.

## Próxima validación concreta

Conservar este proyecto como base. Antes de usar su salida para estimar o construir, completar los flujos de captura, convocatoria, taller y revisión con la definición de producto ya cargada; asociar roles; formular criterios de aceptación; y revisar que el borrador mantenga las restricciones de minorías, competencia y trazabilidad.

Las decisiones de patrocinador, entidad convocante, presupuesto, calendario, alcance territorial, mecanismo de participación y equipo responsable requieren información institucional real. No se contestaron inventando autorizaciones. Esta prueba evalúa la herramienta de levantamiento de requisitos; no demuestra que el producto ciudadano esté construido o que funcione en un evento real.
