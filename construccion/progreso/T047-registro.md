# Registro — T047 · Contar hablando

**Autoridad:** `decisiones/0013-el-audio-es-el-original.md` · `N03` · el caso de la §9:
*«una transcripción cambia acueducto por alcantarillado; la persona corrige antes de validar»*

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-14 | Se comprobó que OpenRouter transcribe, con audio real | 0,0005 USD, 45 modelos con audio |
| 2026-09-14 | 6 pruebas del modelo de voz | `pruebas/voz.test.ts` |
| 2026-09-14 | 4 recorridos con micrófono falso de Chromium | `pruebas/e2e/microfono.spec.ts` |

## Me equivoqué al empezar

Dije que OpenRouter no servía porque es un enrutador de modelos de texto. **Lo comprobé antes de
seguir y era falso**: 45 de sus modelos aceptan audio de entrada. Mandé un audio de ocho segundos
y volvió transcrito por **0,0005 USD** — medio milésimo de dólar por aporte hablado.

Con la llave que ya estaba. Ni integración nueva, ni proveedor nuevo que vigilar.

## Y el primer intento ya trajo el error que importa

Dije *«la vereda La Martinita»* y transcribió *«La Martinica»*. **Un nombre de vereda cambiado**,
en la primera prueba. Es exactamente el caso que la especificación anticipa, y es la razón de la
decisión que tomó el negocio: **el audio es el original**.

> *«Es posible que luego encontremos una mejor opción para transcribir… Entonces el audio sería
> el original.»*

Si se guardara solo el texto, el «original» que `N03` manda conservar sería el error de la
máquina, y no habría con qué volver atrás.

## Lo que el modelo hace imposible

**Un aporte por voz sin grabación no existe.** Es la regla entera, y la impide la base.

Llegar ahí costó un rediseño. Lo intenté primero con la grabación apuntando al aporte y un
disparador diferido — y **no funciona**: con PostgREST cada llamada es su propia transacción, así
que el aporte se confirma solo y la regla salta siempre. El fallo dio el diseño correcto: **la
grabación existe antes que el aporte**, porque es el original, y el aporte apunta a ella. Con eso
basta una comprobación normal que nadie puede evitar.

**Una transcripción es una versión, no un hecho.** Lleva número, autor —`modelo:google/gemini-3.8-flash`,
con nombre— y fecha. Corregir no borra: la del modelo se queda diciendo lo que dijo, porque el
día que alguien pregunte por qué el expediente habla de La Martinica hay que poder mostrar las
dos. Y con el nombre del modelo guardado, **se puede volver a transcribir más tarde** con un
proveedor mejor sin perder nada, que es justo lo que la decisión quería posible.

**No se inventa un relato a partir de ruido.** Si no se entiende, el relato dice *«no se entendió
la grabación»* y la grabación queda guardada para que alguien la escuche. Un texto inventado
entraría a la bandeja como si alguien lo hubiera dicho.

## Lo que la pantalla no promete

El sistema de diseño pedía *«una máquina de estados ligada a eventos reales; no basta cambiar un
texto en pantalla»*, y eso es lo que hay: los estados se mueven con el permiso, el `MediaRecorder`
y la respuesta del servidor, nunca con un temporizador.

**Mientras graba, no hay nada guardado, y lo dice.** El diseño es explícito —*«no prometer audio
recuperable si no fue almacenado»*— y callarlo sería prometerlo.

**Se le avisa de que guardamos su voz cuando aprieta el botón**, no en una política que nadie lee.

**Lo escrito no se pierde**: la transcripción se **añade**, no reemplaza. Borrar lo tecleado
castiga a quien empezó a escribir y se cansó — que es justo quien más necesita hablar.

Y el micrófono se suelta al salir. Sin eso, el punto rojo del navegador se queda encendido
después de irse de la captura, que es la forma más rápida de que alguien no vuelva a confiar en
la pantalla.

## Lo que queda abierto, y pesa

**`Q29` pasó de importante a bloqueante.** La voz identifica a una persona aunque las palabras no
lo hagan. Con texto se podía posponer qué proveedor, con qué plan y con qué política de datos;
con audio, no.

**`Q30`, nueva: si alguien pide retirar su aporte, ¿qué pasa con su grabación?** `V11` decidió
borrado **lógico** y se decidió sobre texto: un relato oculto sigue en una fila que nadie
consulta. Con voz hay un archivo con la voz de esa persona, y ocultar la fila no lo borra del
depósito.

**Grabaciones huérfanas.** Si alguien graba y abandona sin continuar, queda un archivo sin
aporte: la voz de alguien guardada sin nada que explique por qué está ahí. Hay que limpiarlas, y
hoy no se limpian.

**No hay forma de escuchar la grabación desde la consola.** El revisor ve la transcripción y no
puede comprobarla contra el original, que es medio sentido de haberlo guardado.
