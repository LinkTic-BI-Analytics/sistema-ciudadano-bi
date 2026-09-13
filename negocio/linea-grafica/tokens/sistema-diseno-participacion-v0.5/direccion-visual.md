# Participación ciudadana · Dirección visual 0.4

Propuesta de producto para Colombia. Investigación consultada el 13 de septiembre de 2026. La dirección visual, las fuentes y los colores ampliados son una propuesta; no constituyen un manual aprobado por la Presidencia.

## Decisión

Dar al servicio una expresión editorial y contemporánea: titulares con personalidad, un fondo cálido, azul reconocible y controles sencillos. La portada invita a participar; la captura permite concentrarse en lo que se quiere contar. La forma de expresar la marca cambia según esa tarea, utilizando los mismos tokens.

La versión 0.3 resolvía la estructura y reducía ambigüedades. La 0.4 mejora su carácter visual y hace más reconocibles los eventos. La lectura de tendencias que sigue es una interpretación de referencias concretas, no una afirmación de que exista un estilo universal de 2026.

## Referencias y traducción al producto

| Referencia verificada | Qué aporta | Cómo lo aplicamos |
|---|---|---|
| [Linear · UI refresh, 12 marzo 2026](https://linear.app/changelog/2026-03-12-ui-refresh) | Actualización reciente: cabeceras y controles consistentes, iconos revisados y navegación más discreta para favorecer el contenido. | Navegación neutra; mismo comportamiento de controles en todas las vistas; color concentrado en la acción. No trasladamos la densidad de una herramienta para especialistas. |
| [Tally](https://tally.so/) | Formularios concebidos como un documento, preguntas directas y personalización. La portada observada da mucho peso al titular y a una acción principal. | La experiencia ciudadana es la unidad de captura. Una pregunta central, ayuda breve y acciones visibles. No copiamos sus ilustraciones ni sus afirmaciones comerciales. |
| [Typeform](https://www.typeform.com/) | En la portada observada combina un titular serif de gran tamaño con navegación y controles sans serif. Ofrece respuestas mediante texto, audio y video. | Diferenciar tipografía editorial de tipografía operativa. Mantener escribir/hablar como opciones; no convertir la captura en un chat obligatorio ni añadir una cámara. |
| [Luma · Descubrir](https://luma.com/discover) | Agenda observada con títulos, fechas y lugares como unidades rápidas de lectura; imágenes complementarias y agrupación por categoría. | Fecha reconocible, tema, modalidad, título y lugar en ese orden. Dos tarjetas en la portada; lista al filtrar. No ordenamos necesidades por popularidad. |
| [Singapore Government Design System · tokens](https://www.designsystem.tech.gov.sg/foundations/design-tokens) | Fundaciones compartidas para una experiencia pública consistente. | Separar valores de marca, decisiones semánticas y estilos de componentes; permitir evolución sin rediseñar cada formulario. |
| [Radix Colors · usos de la escala](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) | Asigna funciones distintas a fondos, estados, bordes y texto. | Adoptamos la lógica de roles, con una paleta propia y contraste calculado. No presentamos nuestros valores como una escala oficial de Radix. |

Luma, Tally y Typeform se inspeccionaron visualmente en navegador. Linear, SGDS y Radix se consultaron en sus publicaciones y documentación oficial. Los productos pueden cambiar después de esta fecha.

## Paleta y jerarquía

| Rol | Color de referencia | Uso |
|---|---|---|
| Azul tinta | `#16345C` | Titulares editoriales, franja institucional de la propuesta, fechas. |
| Azul de acción | `#3366CC` | Acción principal. Conserva el vínculo con la referencia GOV.CO estudiada previamente. |
| Arena | `#F8F7F3` | Portada y agrupaciones informativas suaves. |
| Papel | `#FFFFFF` | Captura, campos, tarjeta informativa y eventos. |
| Amarillo | `#F2C94C` | Pequeño marcador y subrayado editorial. No representa un estado ni una acción. |
| Texto | `#1D3040` | Lectura y controles. |
| Texto secundario | `#52616A` | Ayudas, fecha completa, ubicación y contexto. |
| Borde de control | `#69757C` | Identificar campos con suficiente contraste. |

Los fondos arena y blanco crean separación sin encerrar cada párrafo. Los bordes suaves separan las tarjetas; los bordes de los campos son más definidos porque permiten reconocer dónde escribir. El rojo, verde y ámbar se reservan para errores y estados con significado. Un encuentro cancelado conserva una etiqueta textual: no depende del rojo.

La franja superior es una composición de muestra, no una reproducción del encabezado oficial GOV.CO. No se inventa un escudo, un sello, una entidad receptora real ni una campaña de gobierno. La integración del encabezado, pie y activos institucionales deberá seguir la versión del manual que confirme el cliente. El análisis previo se conserva en `referencia-institucional.md`.

## Tipografía

**Newsreader 400** en el titular de portada y el encabezado de agenda aporta una voz editorial. **Geist** se usa para navegación, campos, preguntas, botones, fechas y textos. Esta combinación es nuestra elección; no se atribuye a la Presidencia ni a las marcas de referencia.

- Titular de portada: máximo 72 px; referencia compacta 44 px. Se adapta al ancho y envuelve el texto.
- Pregunta de captura: 32 px en escritorio, 28 px en móvil, sans serif.
- Cuerpo y campos: 16 px. Ayudas entre 13 y 14 px; etiquetas auxiliares pequeñas sólo para metadatos breves.
- Texto de la persona: mismo tamaño de lectura que el cuerpo, sin tratamiento decorativo.
- Pesos 400 y 500 para lectura y jerarquía suave; 600 para etiquetas y acciones que lo necesitan.
- Sustituciones: Georgia para el titular; Arial y sans-serif para la interfaz. En producción, alojar los archivos de fuentes autorizados y usar `font-display: swap`.

La propuesta permite comparar el titular editorial con una alternativa geométrica que usa Geist, y el fondo arena con blanco. Las variantes afectan la presentación, no los datos ni la estructura del flujo.

## Reglas de componentes

**Botones.** El principal es azul sólido, con texto blanco, altura mínima de 48 px y radio de 12 px. Una acción principal por grupo. El secundario es blanco con borde neutral y texto oscuro. El terciario es un enlace subrayado. Una selección de modo no usa la apariencia del botón principal.

**Escribir / Hablar.** Selector neutral con fondo suave; el modo activo tiene fondo blanco, subrayado, texto y `aria-pressed`. Ambos conservan etiquetas visibles e iconos complementarios. Cambiar de modo preserva el relato y la transcripción pendiente. No hay animación continua ni activación automática del micrófono.

**Campos.** Fondo blanco, borde de control, radio de 12 px y etiqueta persistente. El error mantiene texto explicativo, borde y enfoque en el campo. El placeholder no sustituye la etiqueta. No se utiliza el borde tenue de una tarjeta para identificar un campo.

**Eventos.** Fecha compacta con día y mes; tema y modalidad; título accionable con flecha; horario completo y lugar. En la portada, dos columnas cuando caben; al filtrar, lista vertical. Las tarjetas se adaptan a títulos largos y metadatos multilínea. El título tiene un área de interacción de al menos 44 px y foco visible; la tarjeta no contiene enlaces anidados ni acciones duplicadas.

**Contexto de captura.** Resumen del evento o de participación general, cambio explícito y una divulgación rotulada “Quién recibe y qué pasa después”. Se compactó para que la pregunta quede antes en la pantalla móvil. El detalle conserva el receptor de ejemplo, el tratamiento previsto y los límites de la participación.

**Información y confianza.** Agrupación por proximidad, subtítulos breves y fondo cálido. Sin métricas ficticias, testimonios inventados o números de aprobación. El seguimiento es un recorrido de actuaciones, no una promesa de financiación.

**Movimiento.** Transición de color de 120 ms en botones; sin entradas animadas, carruseles, parallax, pulsos continuos o desplazamientos que cambien el lugar de una acción. `prefers-reduced-motion` elimina la transición.

## Estructura y comportamiento

1. Portada: invitación → acción principal → explicación breve → próximos encuentros → equipo y tratamiento → privacidad.
2. Agenda: título → filtros → cantidad de resultados → eventos o vacío útil.
3. Encuentro: propósito, público, agenda, fecha, acceso, responsable y apoyos. Estado visible antes de participar.
4. Captura: relato → lugar → revisión → recepción de ejemplo.

Se mantienen los flujos de recuperación, la separación entre convocatoria y lugar del problema, la revisión de voz y los errores de recepción. Los contenidos operativos y las rutas previstas están detallados en `estructura-producto.md`; esta dirección 0.4 prevalece sobre sus referencias visuales a la versión anterior.

## Componentes de implementación: decisión razonada

| Base | Encaje en este proyecto | Decisión propuesta |
|---|---|---|
| [shadcn/ui](https://ui.shadcn.com/docs/theming) | Permite aplicar variables de tema a componentes que se adaptan al producto. | Mantenerlo como opción principal si se construye en React. El archivo `shadcn-theme.css` conecta el tema con los tokens; no se usa la apariencia de fábrica como identidad final. |
| [Base UI](https://base-ui.com/react/overview/about) | Componentes sin estilos y API de composición; da control de la presentación y documenta su foco en accesibilidad. | Alternativa para comportamientos complejos si el equipo quiere más control. Elegir una base de comportamiento consistente para el sistema. |
| [React Aria](https://react-aria.adobe.com/) | Componentes sin estilo con soporte de accesibilidad e internacionalización. | Evaluar si fechas, comboboxes o selección compleja dominan el producto. No mezclar bibliotecas para resolver variaciones puramente visuales. |
| [HeroUI](https://heroui.com/) | Componentes con presentación inicial y personalización. | Referencia secundaria; adoptarlo sólo si encaja con el equipo y el tema completo. Cambiar de biblioteca no es necesario para lograr esta expresión visual. |

Esta comparación se refiere a la documentación consultada; no se instaló ni se midió ninguna biblioteca. La demostración utiliza controles nativos y los estilos entregados.

## Qué queda por validar con personas

La preferencia por una portada más fresca no demuestra, por sí misma, una mejor captura. En pruebas con participantes se debe observar: si reconocen dónde comenzar; si encuentran la opción de hablar; si entienden quién recibe; si distinguen participar de inscribirse; y si pueden revisar un nombre o una negación sin perder su relato. Registrar dificultades y abandono por paso sin convertir el tiempo de respuesta en una valoración de las personas.

No se afirma una mejora porcentual ni una conformidad global de accesibilidad. `validacion.md` distingue lo comprobado en la demostración de lo pendiente en el producto real.
