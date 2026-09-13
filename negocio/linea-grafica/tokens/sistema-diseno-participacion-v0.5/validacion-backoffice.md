# Validación del perfil interno 0.5

Revisión realizada el 13 de septiembre de 2026 en una vista previa local aislada. No es una evaluación con usuarios, prueba de producción o certificación de accesibilidad.

## Verificaciones del sistema

- 319 tokens: los 252 anteriores se compararon por clave, tipo y valor y permanecen iguales. Se añaden 67 para el perfil interno.
- Todos los aliases resuelven sin ciclos y las referencias CSS utilizadas tienen una definición.
- 41 pares de color pasan el cálculo declarado en `contraste.md`: 31 de la base y 10 para superficies/estados internos.
- El script de interacción pasa `node --check`.
- 64 identificadores de elementos únicos; cierre de etiquetas comprobado.
- Ocho aportes con códigos únicos y referencias a convocatorias existentes en las cinco muestras compartidas.
- El fragmento no tiene solicitudes de red, almacenamiento persistente, micrófono o llamadas a modelos.

## Revisión visual

| Vista | Comprobación |
|---|---|
| Bandeja de escritorio | Navegación lateral neutral, acción principal azul, una tabla con cuatro columnas, estado textual y responsable visible. Ancho de 1024 px, 992 px efectivos, sin desbordamiento. |
| Bandeja intermedia | Ancho de 768 px, 736 px efectivos; navegación superior y tabla visible sin desbordamiento horizontal. |
| Bandeja móvil | Anchos de 390 y 320 px, 358 y 288 px efectivos. Se oculta la tabla y se presenta la lista con los mismos registros. Sin desbordamiento horizontal. |
| Ficha de aporte | Original a la izquierda y gestión a la derecha en escritorio; contenido apilado y legible a 288 px efectivos. |
| Ficha de encuentro | Edición y contexto apilados en móvil. Sin desbordamiento a 288 px efectivos. |

El marco de prueba utiliza 16 px por lado, de ahí la diferencia entre tamaño del navegador y ancho efectivo. Se inspeccionaron capturas reales de las vistas, no sólo el código.

## Interacciones comprobadas

1. **Búsqueda y filtros:** la bandeja inicial contiene seis pendientes; “Todos los estados” muestra ocho y “Recibido” muestra tres. Combinar recibido con Equipo digital produce un vacío útil. Limpiar restablece los pendientes. La búsqueda AP-1047 identifica el caso esperado.
2. **Contexto:** AP-1047 conserva Chocó como lugar reportado y Caquetá como territorio de convocatoria. El original mantiene la negación sobre el cierre del puesto de salud.
3. **Validación de actuación:** seleccionar “En revisión” sin responsable muestra error; asignar equipo sin motivo muestra el error del motivo. Guardar con los datos necesarios actualiza el estado y añade una actuación.
4. **Salida con cambios:** al modificar la síntesis y salir, aparece la elección entre continuar o descartar. Continuar conserva el texto. Descartar permite salir de la ficha sin registrar la edición.
5. **Fallo y reintento:** el escenario de un fallo conserva el motivo escrito y deja el estado guardado anterior en “Recibido”. Reintentar cambia a revisión y deja exactamente una nueva actuación; no duplica la recepción inicial.
6. **Respuesta en borrador:** exige texto de respuesta. Al completar los campos, el estado indica que sigue siendo un borrador interno y el mensaje de guardado aclara que no se envió.
7. **Encuentros:** se muestran cinco. La ficha de agua identifica AP-1048 y AP-1047 como asociados en la muestra. Un responsable formado sólo por espacios se rechaza. El guardado de un título y equipo nuevos aparece como borrador actualizado.
8. **Separación de versiones:** después de editar el borrador del encuentro, el aporte continúa mostrando el título original de la convocatoria, sin cambiar su contexto histórico.

La consola no registró errores durante las consultas realizadas. Algunos intentos de vaciar campos mediante la automatización no vaciaron el control; la validación se comprobó posteriormente con un valor compuesto sólo por espacios y con la lectura del valor real.

## Problemas corregidos durante la revisión

- Dos opciones del filtro tenían un cierre de etiqueta incorrecto y no aparecían como opciones seleccionables. Se corrigieron y se verificaron los resultados de todos/recibidos.
- El marco aislado no permite el envío nativo de formularios. Las acciones del prototipo se conectaron explícitamente a botones locales para ejecutar la validación y el guardado simulado, sin enviar datos. La implementación del producto deberá conectar su formulario al servicio real y mantener la prevención de envíos duplicados.
- La simulación de fallo se definió como un único intento fallido. Esto permite probar la recuperación con la misma edición, sin tener que salir de la ficha para cambiar un ajuste de prueba.

## Límites y trabajo pendiente

No se han probado lectores de pantalla reales, ampliación al 200 %, dispositivos físicos, rendimiento con grandes volúmenes, concurrencia, fallos de servidor o conectividad real. Los tamaños táctiles se definen mediante CSS para punteros gruesos, pero no se verificaron en un teléfono físico.

Los controles de comparación de densidad y fondo lateral dependen del panel de diseño de la conversación; su interfaz no se reproduce en el navegador de prueba. El escenario de fallo se comprobó en la ficha de aporte; la ficha de encuentro comparte la modalidad de fallo en el código, pero no se repitió ese caso específico.

La muestra no implementa permisos, envíos, publicación, remisión institucional real, verificación de hechos o IA. Sus estados precargados son casos ficticios, no evidencia de actuaciones realizadas. La matriz de funciones y los requisitos de constancia de remisión se describen en `backoffice-especificacion.md`.

El alcance adecuado para la siguiente prueba con personas es observar si un revisor distingue original, propuesta y validación; localiza el responsable; explica un cambio; y reconoce cuándo un borrador aún no ha sido comunicado.
