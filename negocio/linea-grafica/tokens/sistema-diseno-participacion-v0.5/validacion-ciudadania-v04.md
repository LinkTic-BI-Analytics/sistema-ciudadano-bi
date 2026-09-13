# Revisión de la propuesta 0.4

13 de septiembre de 2026. Revisión del prototipo local y de sus tokens; no es una prueba con ciudadanía ni una certificación de accesibilidad.

## Hallazgos y ajustes

| Aspecto | Decisión y comprobación |
|---|---|
| Personalidad visual | Portada con Newsreader, interfaz con Geist, arena y azul tinta. Se observó la composición real en navegador. |
| Acción principal y secundaria | En el catálogo: principal azul `rgb(51, 102, 204)` con texto blanco; secundario blanco con texto neutral `rgb(55, 71, 81)`. Ambos midieron 48 px de alto. |
| Ruido de color | Amarillo limitado al marcador y subrayado editorial. Escribir/hablar es una selección neutral; error y cancelación conservan texto explícito. |
| Contexto antes de escribir | El bloque previo a la pregunta ocupaba mucho espacio. Se compactó el contenido y se agrupó el receptor y tratamiento en “Quién recibe y qué pasa después”. Se comprobó abrir y cerrar el detalle y leer el receptor. |
| Muestra tipográfica | Una regla heredada reducía el tamaño del ejemplo Newsreader en el catálogo. Se corrigió la especificidad del selector. |
| Jerarquía de encabezados | El catálogo comienza con H1; sus fundamentos y componentes usan H2. Los eventos de portada permanecen bajo H3. |
| Recuperación de contenido | Texto escrito → Hablar → Escribir conservó exactamente el relato. La selección activa mantuvo `aria-pressed`. |
| Revisión | Se avanzó de relato a lugar, revisión y recepción ficticia. El relato y el lugar aparecieron separados y sin alteraciones. |
| Eventos | Agenda inicial con 3 próximos encuentros; Caquetá + Virtual produjo 0 con mensaje útil; limpiar filtros y elegir todas las fechas mostró 5. |
| Cancelación | “Cuidar a quienes cuidan” mostró la razón de cancelación y ocultó la acción de aportar a ese evento. |

## Revisión de tamaños

Se inspeccionaron capturas del navegador con anchos de 1024, 390 y 320 px. El marco de prueba deja 16 px por lado; los anchos efectivos fueron 992, 358 y 288 px.

- Portada: sin desbordamiento horizontal en los tres anchos comprobados.
- Captura y ficha de evento: sin desbordamiento a 288 px efectivos.
- Agenda: tarjetas y filtros observados en escritorio, filtros operados también en el ancho móvil estrecho.
- En el ancho más estrecho, el titular y la acción principal envuelven el texto. Los tamaños de campo permanecen en 16 px; no se reduce el texto para forzar una línea.
- No se verificó zoom del navegador al 200 %, lectores de pantalla reales ni dispositivos físicos.

## Comprobaciones técnicas

- 252 tokens; todos los aliases resueltos sin ciclos.
- 31 pares de color superaron los umbrales declarados en `contraste.md`.
- Verificación sintáctica del script de interacción con `node --check`.
- Referencias CSS a variables del sistema comprobadas contra sus definiciones.
- Consola del navegador sin errores en las vistas y acciones probadas.
- El fragmento no usa micrófono, reconocimiento de voz, solicitudes de red para captura ni almacenamiento persistente.

## Alcance pendiente

El recorrido de fallo de recepción y los estados extensos de voz se mantienen de la versión 0.3; en esta revisión se volvió a comprobar el cambio escribir/hablar y la recepción de ejemplo, no se repitió cada caso anterior. La voz real, su permiso, latencia, transcripción y reintentos deben probarse al conectarla.

También quedan pendientes la implementación de backend, recuperación después de recargar, conectividad intermitente real, lectores de pantalla, navegadores y teléfonos objetivo, y la validación con personas de distintos niveles de alfabetización digital.

Los controles de comparación tipográfica y de superficie dependen del panel de diseño de la conversación; el navegador de prueba no reproduce ese panel. Los dos estados propuestos están definidos en el script y no modifican el contenido capturado.

La identidad institucional final, los activos oficiales, el equipo receptor y la política de datos siguen pendientes de confirmación del cliente. Los datos y las constancias de la demostración son ficticios.
