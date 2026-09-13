> Nota de versión 0.4: se conserva este documento como antecedente funcional e institucional. La presentación vigente de la propuesta está definida en `direccion-visual.md`; sus decisiones prevalecen sobre referencias visuales a versiones anteriores.

# Referencia institucional de la investigación inicial

La base siguiente conserva la investigación original. Para las decisiones actuales de interfaz y navegación prevalecen los documentos y tokens de la versión 0.3.

# Participación Ciudadana Colombia
## Sistema de diseño · propuesta 0.1.0

Investigación y decisiones de diseño al 13 de septiembre de 2026. Elaborado a partir de la visión entregada por el equipo. Esta es una base de trabajo para diseño e implementación; no es un manual oficial de Presidencia ni un producto conectado a servicios institucionales.

## 1. Dirección recomendada

Una interfaz pública serena, legible y cercana: azul institucional para actuar, superficies claras para leer, amarillo como acento editorial y espacio suficiente para expresarse. La familiaridad debe venir de la claridad del servicio y de elementos institucionales autorizados. La calidez debe venir del lenguaje, del trato y de la representación territorial.

El principio rector es **escuchar → permitir corregir → explicar el tratamiento**. Esto determina componentes, estados, arquitectura de información y métricas. La plataforma no debe pedirle a una persona que conozca la entidad competente o que redacte un proyecto para poder contar una necesidad.

Propuesta técnica: **shadcn/ui como código base de componentes + tokens propios + patrones de participación**, usando la lógica de escalas de Radix como referencia. Mantener un único conjunto principal de primitivas de interacción. React Aria es una alternativa completa si la complejidad de selección, fechas e internacionalización domina el alcance.

## 2. Qué encontramos sobre el cliente

### Institución, servicio y coyuntura

La Presidencia tiene una portada orientada a comunicación de gobierno y una sede electrónica del DAPRE con funciones de servicio. El menú Participa ya contempla diagnóstico, consulta, colaboración, rendición de cuentas y control social. Esto da una estructura institucional útil para conectar convocatoria, escucha y devolución. No demuestra que la plataforma propuesta ya haya sido adoptada ni que DAPRE sea su operador definitivo. [Participa DAPRE](https://dapre.presidencia.gov.co/AtencionCiudadana/participacion-ciudadana).

El cronograma de rendición de cuentas de 2026 incluye consulta por formulario, definición de responsables y aprobación de línea gráfica. Por tanto, nuestro diseño debe facilitar tanto la participación como la administración de contenidos y sus aprobaciones. [Rendición de cuentas 2026](https://dapre.presidencia.gov.co/AtencionCiudadana/audiencias-publicas/rendicion-de-cuentas-2026).

Las publicaciones oficiales consultadas para septiembre de 2026 identifican a Abelardo De La Espriella como presidente. En esa muestra aparecen seguridad y respeto institucional, continuidad de infraestructura y garantía de servicios. Son señales de comunicación de coyuntura, no un inventario exhaustivo del programa ni un manual visual. [Seguridad institucional, 2 de septiembre](https://www.presidencia.gov.co/prensa/Paginas/Presidente-de-la-Republica-ordena-reforzar-medidas-de-seguridad-de-los-magistrados-de-la-Sala-de-Casacion-Pena-260902.aspx), [Metro de Bogotá, 2 de septiembre](https://www.presidencia.gov.co/prensa/Paginas/Declaracion-a-medios-del-Presidente-de-la-Republica-Abelardo-De-La-Espriella-260902.aspx), [agua y energía, 4 de septiembre](https://www.presidencia.gov.co/prensa/Paginas/Gobierno-del-presidente-De-La-Espriella-se-anticipa-a-los-efectos-del-fenomeno-de-El-Nino-para-evitar-260904.aspx).

**Interpretación de diseño:** comunicar responsabilidad, continuidad y claridad de respuesta. En la captura ciudadana, mantener un tono hospitalario y espacio para cualquier necesidad. Las categorías y formularios deben surgir del relato de las personas; no encauzarlos hacia una agenda política predeterminada.

### Evidencia visual y sus límites

La inspección directa de la [portada de Presidencia](https://www.presidencia.gov.co/) mostró barra azul GOV.CO, cabecera blanca, escudo con denominación Presidencia y acento tricolor. La pieza principal empleaba fondo oscuro azulado y amarillo. Estos son rasgos observados en una página y una pieza; sus colores exactos no se extrajeron como especificaciones oficiales.

El [índice de identidad visual](https://www.presidencia.gov.co/MIV/index.html) aparece en el buscador asociado a «Gobierno del cambio», pero al abrirlo durante esta revisión redirigió a página no encontrada. El [PDF indexado](https://www.presidencia.gov.co/MIV/MIV.pdf) conserva referencias al manual, pero no se pudo inspeccionar como documento completo vigente. No se atribuye ese manual a la nueva administración ni se reproducen sus activos como aprobados.

La biblioteca GOV.CO v4 publica azul #3366CC, azul oscuro #004884 y la pareja Montserrat / Work Sans. Se usa como **referencia provisional verificable**. También existe documentación v5 y un PDF de componentes que menciona Nunito Sans / Verdana; la página v5 consultada se identifica como QA. Es necesario que el cliente confirme la versión aplicable antes de cerrar marca, tipografía y componentes transversales. [Color v4](https://cdn.www.gov.co/v4/transversal/color), [tipografía v4](https://cdn.www.gov.co/v4/transversal/tipografia), [color v5](https://cdn.www.gov.co/v5/transversal/color), [componentes MinTIC](https://www.mintic.gov.co/portal/715/articles-406089_recurso_1.pdf).

**Decisión:** separar `brand` de `action`, aunque inicialmente compartan azules. Un cambio de identidad institucional no debería cambiar el significado de error, recibido o pendiente. No recolorear ni redibujar el escudo. Reservar un espacio para los activos que entregue el equipo de comunicaciones.

## 3. Referencias de componentes

| Referencia | Qué aporta | Costo o límite para este proyecto | Uso recomendado |
|---|---|---|---|
| [shadcn/ui](https://ui.shadcn.com/docs) | Código modificable y composición de componentes | El equipo mantiene sus adaptaciones y actualizaciones | Base preferida para formularios, navegación y trabajo interno |
| [Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) | Escalas por función: fondos, interacción, bordes, sólidos y texto | Una escala no sustituye la marca ni la comprobación de cada par | Método cromático; evitar elegir tonos sueltos por pantalla |
| [Radix Themes](https://www.radix-ui.com/themes/docs/overview/getting-started) | Componentes con estilo y configuración común | Mayor dependencia de su lenguaje visual y convenciones | Alternativa si se prioriza rapidez con menor personalización |
| [Base UI](https://base-ui.com/react/overview/quick-start) | Primitivas sin estilo para componer interacciones | Exige construir la capa visual | Alternativa de motor de componentes; no añadir en paralelo sin necesidad |
| [React Aria](https://react-aria.adobe.com/) | Composición sin estilo, internacionalización e interacciones accesibles | Más decisiones de presentación e integración | Evaluar como alternativa principal para requisitos complejos |
| [GOV.UK: páginas de preguntas](https://design-system.service.gov.uk/patterns/question-pages/) | Referencia de UX para trámites y captura por tareas | Debe adaptarse al contexto y lenguaje colombiano | Inspiración de secuencia y claridad, sin copiar identidad |

La preferencia por shadcn es una decisión de adecuación al proyecto, no una clasificación universal. La calidad final depende del contenido, los estados y las pruebas con personas. No hace falta sumar bibliotecas decorativas para lograr una buena interfaz.

## 4. Arquitectura de tokens

```text
primitive.color.blue.600         #3366CC
            ↓
semantic.color.action.primary.default
            ↓
component.button.primary.background
            ↓
Botón «Continuar»
```

**Primitivos:** valores de color, espacio, familia y tamaño tipográfico, peso, radio, duración, ancho y capas. Pueden cambiar sin renombrar los componentes.

**Semánticos:** decisiones con significado: `surface`, `text`, `action`, `feedback`, `focus`, `selection`, `brand`, `assist`, `data`. Los equipos de producto deberían hablar principalmente con este vocabulario.

**Componentes:** decisiones específicas cuando un patrón necesita un contrato estable: `field.border`, `button.height`, `summary.background`, `status.received.foreground`. Evitar crear un token por cada declaración CSS.

Se entregan 163 tokens con tipos y referencias en JSON, CSS derivado y un puente de variables para shadcn. La estructura usa las convenciones del [formato DTCG 2025.10](https://www.designtokens.org/tr/2025.10/format/): `$type`, `$value`, colores sRGB estructurados y alias. La resolución de alias y el contraste se comprobaron localmente; no se ha certificado la importación en un editor concreto.

### Paleta funcional inicial

| Rol | Token abreviado | Valor | Criterio |
|---|---|---|---|
| Acción principal | `action.primary.default` | #3366CC | Un CTA dominante por tarea |
| Acción hover | `action.primary.hover` | #2852A3 | Cambio consistente y visible |
| Institucional / pressed | `brand.institutional` | #004884 | Encabezados y acción presionada |
| Fondo general | `surface.canvas` | #F8F9FB | Separar bloques sin ruido |
| Superficie de lectura | `surface.base` | #FFFFFF | Formularios y contenido |
| Texto | `text.default` | #172B3A | Legibilidad en superficies claras |
| Texto secundario | `text.secondary` | #526070 | Ayuda con contraste suficiente |
| Borde de control | `border.control` | #667085 | Campos reconocibles sin sombra |
| Acento editorial | `brand.accent` | #F2C94C | Detalles y reconocimiento, uso moderado |
| Error | `feedback.error.foreground` | #B42318 | Mensaje + indicación de corrección |
| Atención | `feedback.warning.foreground` | #8A4B08 | Necesidad de aclaración |
| Recepción confirmada / éxito técnico | `feedback.success.foreground` | #216E4E | Nunca significa obra aprobada |
| Asistencia | `assist.foreground` | #6342A6 | Identificar una síntesis sugerida |

Salvo los dos azules referenciados en GOV.CO v4, los valores son propuestas del producto. Las rampas no se presentan como escalas oficiales de Radix. El amarillo no debe ser texto sobre blanco ni el color por defecto de botones. El rojo no representa opiniones contrarias ni territorios con pocos aportes.

### Tipografía, espacio y forma

| Decisión | Público | Trabajo interno |
|---|---|---|
| Familias provisionales | Montserrat en títulos; Work Sans en lectura | Las mismas |
| Cuerpo | 16 px / 1.5; introducciones 18 px | 16 px; metadatos 14 px |
| H1 / H2 / H3 | 40 / 32 / 24 px; H1 móvil 32 px | 32 / 24 / 20 px según jerarquía |
| Pesos | 400 para lectura, 600 para títulos y acciones | Igual; cifras tabulares en tablas |
| Escala de espacio | 4, 8, 12, 16, 24, 32, 48, 64, 96 px | Misma escala |
| Radio | 8 px en controles; 12 px en tarjetas | Igual |
| Altura mínima | 48 px en controles principales | 40 px; ampliar área táctil a 44 px si procede |
| Ancho | Formulario máximo 42 rem; contenido 75 rem | Analítica hasta 90 rem |
| Movimiento | 120–180 ms para feedback; respetar reducción | Igual |

Los valores en px describen la equivalencia a raíz de 16 px; tamaños de texto, espacios y controles se exportan en rem donde corresponde. La altura es mínima: el texto ampliado debe poder crecer. Usar una columna para captura, incluso en escritorio. Dos columnas sólo para grupos realmente relacionados y si conservan legibilidad.

No usar sombra como única forma de reconocer campos. Sombras reservadas para superposiciones cuando se implemente su token; sin elevación decorativa en cada tarjeta. Píldoras para estados breves, no para todos los botones. Iconografía lineal consistente, 20–24 px, con nombre visible en acciones importantes.

### Modos y adaptación

Esta entrega cubre **modo claro**. No se debe aplicar inversión automática como modo oscuro. La siguiente versión puede añadir un conjunto semántico oscuro manteniendo nombres y comprobando pares. El modo de contraste forzado del sistema debe conservar contornos y estados; se verificará en la implementación.

Los perfiles de densidad pública e interna comparten significado. Una página puede ser más compacta sin alterar el tamaño mínimo de lectura ni reducir áreas táctiles. Los puntos de quiebre propuestos son 40, 48 y 64 rem; CSS media queries requieren valores compilados, no `var()` en la condición.

## 5. Catálogo inicial de componentes

| Familia | Componentes / patrones | Estados y reglas imprescindibles | Fase |
|---|---|---|---|
| Estructura | Cabecera institucional, navegación, ruta, pie, enlace al contenido | Móvil, foco, página actual; activos y enlaces oficiales confirmados | Inicial |
| Acciones | Button, Link, IconButton | Default, hover, pressed, focus, disabled, loading; loading con nombre de acción | Inicial |
| Captura | Field, Textarea, RadioGroup, Checkbox, NativeSelect, ErrorSummary | Etiqueta visible, ayuda, obligatorio/opcional, error, lectura, ocupado | Inicial |
| Territorio | TerritoryField | Departamento → municipio; vereda/barrio; varios lugares; «no lo encuentro»; corregir sugerencia | Inicial |
| Proceso | StepHeader, SaveStatus, Confirmation | Paso actual, anterior, guardando, guardado confirmado, fallo, pendiente de envío | Inicial |
| Revisión | SummaryReview | Relato original, síntesis sugerida, editar, confirmar; fallo de IA con vía manual | Inicial |
| Convocatorias | EventCard, EventDetails, EventContext | Presencial/virtual; abierta/cerrada/cancelada/reprogramada; responsable y zona horaria | Inicial |
| Devolución | ContributionStatus, TreatmentTimeline, ResponsePanel | Recepción, revisión, aclaración, remisión, respuesta; evidencia y fecha | Inicial |
| Protección | PrivacyNotice, ContactPreference | Explicar para qué se solicita cada dato; separar compartir y recibir avisos | Inicial |
| Revisión interna | NeedRecord, SourceList, GroupComparison | Original protegido, discrepancias, vínculos sugeridos/confirmados, historial | Posterior |
| Análisis | CoverageNotice, AccessibleChart, TerritoryTable | Sin datos, cero observado, dato incompleto, corte temporal, alternativa tabular | Posterior |
| Movilización | ListeningGap, CampaignBrief, RecognitionCard | Contexto de brecha, acción y responsable; compartir voluntario sin más peso | Posterior |

### Contratos de cuatro patrones críticos

**Field.** Anatomía: etiqueta → ayuda breve → control → error. La ayuda y el error se asocian con `aria-describedby`; el error utiliza `aria-invalid`. No sustituir la etiqueta por un placeholder. En envío fallido, conservar valores y presentar un resumen con enlaces a los campos. Evitar errores mientras la persona aún está escribiendo, excepto restricciones que pueda corregir inmediatamente.

**SummaryReview.** Anatomía: «Esto entendimos» → procedencia y condición de sugerencia → síntesis editable → acceso al original → confirmar. Modelar por separado `generatedBy`, `confirmedByParticipant`, `reviewedByInstitution` y versiones. Una confirmación de fidelidad no significa que la institución haya verificado los hechos. Si falla la IA, conservar el relato y permitir revisión humana.

**EventContext.** Mostrar qué evento venía en el enlace y permitir confirmarlo o cambiarlo. Guardar por separado origen de campaña, evento confirmado, asistencia y territorio de la necesidad. Un QR no prueba asistencia ni ubicación. Si el evento se cerró, conservar el contexto y ofrecer la alternativa que realmente esté habilitada.

**TreatmentTimeline.** Cada actuación tiene tipo, fecha, responsable, explicación y visibilidad. La línea de tiempo no debe inventar una secuencia lineal ni marcar agrupación como resolución. Una remisión necesita destino y constancia cuando existan. La respuesta debe explicar el tratamiento aunque no haya intervención aprobada.

## 6. Flujos de UX que debe sostener el sistema

### Participación por internet

1. **Entender:** para qué sirve, quién recibe y cómo se usa el aporte. CTA «Contar una necesidad». Acceso claro a agenda y consulta de aportes.
2. **Contar:** «¿Qué necesita mejorar en tu comunidad?». Pedir experiencia, no clasificación administrativa. No exigir solución ni evidencia para escuchar.
3. **Ubicar:** dónde ocurre, a quién afecta y qué cambio espera. Permitir corregir sugerencias y describir un lugar no encontrado.
4. **Revisar:** presentar la síntesis como propuesta; permitir modificarla y consultar el original. Explicar qué es privado y qué podría publicarse de forma agregada.
5. **Enviar:** mostrar sólo información que efectivamente enviará. La confirmación exige recepción del servidor. Ante incertidumbre, comprobar estado antes de duplicar envíos.
6. **Volver:** proporcionar un mecanismo seguro para consultar el aporte y la explicación de su tratamiento. El diseño exacto de identidad y recuperación depende del operador.

El desglose en pantallas es ajustable tras las pruebas. No imponer siete pantallas para siete campos. Como punto de partida, usar grupos breves con progreso textual, botón anterior y conservación de valores. Inspiración de [GOV.UK para páginas de preguntas](https://design-system.service.gov.uk/patterns/question-pages/); la secuencia propuesta procede de la visión de este proyecto.

### Participación asistida y conectividad

El facilitador registra que está capturando el relato de otra persona, muestra o lee la síntesis y consigna la confirmación. No reutilizar automáticamente el contacto del facilitador como contacto del participante. En dispositivos compartidos, terminar la sesión y limpiar los datos según el flujo aprobado.

«Guardado en este dispositivo», «pendiente de envío» y «recibido por el equipo» son estados diferentes. El funcionamiento sin conexión necesita almacenamiento, recuperación y sincronización implementados; no se promete en un mockup. Ofrecer grabación sólo donde esté habilitada, con transcripción revisable y alternativa escrita o asistida. La grabación no debe ser requisito.

### Agenda

Descubrir por territorio, tema, fecha y modalidad → leer propósito y alcance → ver responsable, accesibilidad y condiciones → participar. El enlace a Meet/Teams debe indicar que abre otro servicio. Diferenciar inscripción, asistencia y aporte. Mostrar una alternativa posterior para quien perdió la conexión, si el proceso la admite.

### Revisión y BI

Separar en pantalla **calidad de la información**, **afectación reportada**, **prioridad de examen** y **decisión institucional**. No mostrar una única puntuación que mezcle esas dimensiones. «Pocos aportes» y «sin registros» pueden requerir ampliar escucha; no equivalen a falta de necesidad. Mostrar los disensos dentro de las agrupaciones. En mapas, distinguir ausencia de datos de cero observado y de cobertura insuficiente.

## 7. Lenguaje, inclusión y confianza

| Evitar | Preferir |
|---|---|
| Radique su problemática | Cuéntanos qué ocurre |
| IA ha validado su solicitud | Revisa si esta síntesis refleja lo que quisiste decir |
| Su problema será resuelto | Recibimos tu aporte. Aquí podrás consultar su tratamiento |
| Municipio inválido | No encontramos ese municipio. Puedes buscarlo de nuevo o describir el lugar |
| Bajo valor ciudadano | Información por aclarar |
| No hay necesidades en este territorio | Aún no hay registros en el periodo consultado |

Proponer tuteo claro y respetuoso para captura pública; validar la guía de lenguaje del cliente. No pedir datos demográficos sensibles para poder contar un problema. Si son necesarios para evaluar inclusión, justificar cada pregunta y definir voluntariedad y tratamiento con el operador. No exhibir relatos, contactos o ubicaciones sensibles en resultados públicos.

Las imágenes deben mostrar personas y contextos diversos con autorización y procedencia conocida; evitar que una única fotografía represente toda Colombia. El contenido importante permanece como texto. La UI debe tolerar nombres territoriales largos, caracteres propios de distintas lenguas y traducciones más extensas. Sólo mostrar idiomas y apoyos que realmente estén disponibles.

## 8. Accesibilidad y calidad de uso

La Resolución 1519 de 2020 fija WCAG 2.1 AA para sus sujetos obligados. Se propone WCAG 2.2 AA como objetivo adicional del producto, sujeto a validación de alcance institucional. No afirmar cumplimiento sólo por usar una biblioteca. [Normograma MinTIC, artículo 3](https://normograma.mintic.gov.co/mintic/compilacion/docs/resolucion_mintic_1519_2020.htm), [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

Lista de aceptación propuesta:

- Texto normal con contraste mínimo 4.5:1 y controles/foco identificables con al menos 3:1 donde corresponde. Se adjunta cálculo de 15 pares del tema.
- Formularios operables por teclado y lector de pantalla; orden lógico, nombres, ayudas y errores asociados.
- Reflujo a 320 CSS px, ampliación de texto a 200% y zoom sin pérdida de acciones ni contenido. Tablas complejas con alternativa legible.
- Foco visible no tapado por cabeceras. Foco de dos colores cuando un contorno único no contraste con fondos diversos.
- Estado con texto e icono o estructura; nunca sólo color. Confirmaciones importantes persistentes, no únicamente toast.
- Mensajes dinámicos con anuncios moderados, gestión de foco y recuperación después de fallos. Probar diálogos y controles compuestos en integración.
- Movimiento reducido, imágenes diferidas y fuentes locales optimizadas. Captura utilizable sin cargar mapas, video o analítica pesada.

Como metas iniciales de rendimiento, acordar un presupuesto de carga para el flujo ciudadano y medirlo en móvil de gama baja y red limitada. El catálogo de componentes debe documentar ese costo, además de su apariencia. No se han medido tiempos de carga de una aplicación de producción en esta entrega.

## 9. Ejemplos de composición

**Entrada pública:** cabecera breve → promesa en lenguaje cotidiano → CTA principal → dos rutas secundarias (agenda y consulta) → próximos encuentros → cómo se revisa y devuelve la información. Sin carrusel automático como puerta de entrada a la captura.

**Formulario:** progreso textual → pregunta principal → ayuda breve → campo amplio → mensaje de privacidad contextual → anterior/continuar. El espacio ayuda a concentrarse; no llenar el lateral con estadísticas.

**Revisión:** síntesis editable → territorio y alcance → original disponible → confirmación explícita → siguiente paso. El acento violeta indica ayuda del sistema, nunca autoridad de la IA.

**Devolución:** estado actual → última actuación y responsable → qué significa y qué no significa → historial → canal o acción siguiente. Un estado «respuesta disponible» sólo aparece cuando existe una respuesta autorizada.

La visualización adjunta utiliza contenido ficticio y operaciones locales para comparar estas composiciones. No registra aportes ni se conecta a Presidencia.

## 10. Implementación y mantenimiento

1. Importar `participacion.css` y luego `shadcn-theme.css` después del tema inicial. Configurar la integración CSS/Tailwind según la versión del proyecto. La aplicación usa valores CSS completos, no envolturas `hsl(var(...))`. [Theming de shadcn](https://ui.shadcn.com/docs/theming).
2. Usar clases de componentes que consuman variables semánticas o de componente. No incorporar hexadecimales independientes en las pantallas.
3. Aplicar Montserrat a títulos y Work Sans al cuerpo explícitamente; el puente define la familia base, no carga archivos de fuentes. Autoalojar fuentes verificadas en WOFF2 y usar `font-display: swap`.
4. Crear un catálogo de historias por componente, con estados vacíos, error, carga, teclado y texto largo. Comenzar por Field, ErrorSummary, Button, EventContext y SummaryReview.
5. Traducir nombres de tokens a colecciones del editor de diseño: Primitives, Semantic y Components. Comprobar un componente piloto antes de importar toda la colección.
6. Mantener el JSON como fuente de verdad. Cambio visual compatible: versión menor o parche según alcance. Renombre o cambio de significado: versión mayor con migración. Documentar dueño, motivo y evidencia de cada cambio.

Estructura sugerida del futuro paquete:

```text
tokens/              valores y perfiles de tema
components/ui/       componentes base adaptados
components/patterns/ captura, revisión, eventos, devolución
templates/           composiciones de página
content/             lenguaje, etiquetas y mensajes
stories/             estados y ejemplos comprobables
```

Los colores de `data` son una escala secuencial inicial; las series categóricas requieren otra asignación semántica según el gráfico. El puente `chart-*` es un punto de partida técnico, no autoriza a usar esos colores como categorías o estados arbitrarios.

## 11. Decisiones que quedan abiertas

| Decisión | Quién debe cerrarla | Qué cambia |
|---|---|---|
| Entidad operadora y responsables de revisión | Dirección del proyecto / DAPRE si corresponde | Promesas, canales y estados reales |
| Manual vigente y versión GOV.CO aplicable | Comunicaciones y equipo web institucional | Activos, tipografía, cabecera y pie |
| Identidad, recuperación y acceso al aporte | Producto, seguridad y operador | Contacto y seguimiento seguro |
| Tratamiento, publicación y retención | Responsable de datos y equipo jurídico | Preguntas, avisos y visibilidad |
| Territorios, lenguas y apoyos iniciales | Operación y equipos territoriales | Contenido y canales disponibles |
| IA habilitada y validación humana | Producto y responsables del proceso | Síntesis, atribución y estados |

Estas decisiones no impiden revisar esta propuesta. Sí impiden presentarla como un servicio oficial ya operativo.

## 12. Próxima validación

Realizar dos rondas pequeñas con personas de contextos distintos: baja experiencia digital, conectividad limitada, participación asistida y uso de tecnología de apoyo. Probar tres tareas: contar y corregir una necesidad; encontrar un encuentro pertinente; explicar con sus palabras qué pasó con un aporte.

Medir finalización, campos donde se necesita ayuda, pérdida de información, fidelidad de la síntesis y comprensión de estados. En revisión interna, comprobar que el equipo encuentra necesidades con pocos aportes y puede explicar una agrupación. Los cambios de la siguiente versión deben responder a esas observaciones.

## Entregables

- `participacion.tokens.json`: 163 tokens con tipos y alias.
- `participacion.css`: variables CSS generadas.
- `shadcn-theme.css`: puente de tema claro.
- `contraste.md`: verificación numérica de 15 pares.
- `sistema-diseno.md`: investigación, decisiones, catálogo y flujos.

No se incluye aplicación React, biblioteca publicada, importación a Figma ni auditoría integral. La visualización en la conversación es un ejemplo de diseño, independiente de una implementación productiva.
