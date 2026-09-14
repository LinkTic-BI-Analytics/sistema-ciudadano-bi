# Registro — T037 · Afinar la captura en dos vueltas

**Autoridad:** `N02` (captura mínima y gradual) · `N03` (las tres partes, y la síntesis nunca
sustituye el original) · `V14` (la última palabra sobre su síntesis es de la persona) ·
`IA-01` (la IA es ampliación; la recepción no depende de ella)

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-14 | 5 recorridos del flujo nuevo, **escritos antes** de la pantalla | `afinar.spec.ts` |
| 2026-09-14 | 4 pruebas de la lectura; **vistas fallar** haciéndola inventar y no marcar el recorte | `lectura.test.ts` |
| 2026-09-14 | Las etiquetas de la consola; **vista fallar** con 9 campos sin `<label>` | `consola.spec.ts` |

## El orden es la regla

**Primero se recibe, después se afina.** `N02` y `DAT-01` dicen que la recepción no depende de
nada más, así que el comprobante sale **antes** de la primera vuelta y se queda a la vista
mientras se afina. Quien abandone en la segunda pantalla ya tiene con qué consultar lo suyo, y
hay una prueba que abandona a propósito y lo comprueba.

Antes, las tres partes de `N03` estaban plegadas **dentro** del formulario inicial. Eso convertía
un formulario de dos campos en uno de cinco antes de que hubiera nada guardado: quien lo cerraba
se iba sin dejar nada. Ahora lo primero que pasa es que su aporte queda.

Dos vueltas y no un formulario largo porque son **dos preguntas distintas**: *¿es esto?* y *¿qué
falta?*. La primera devuelve lo que la persona ya dijo; la segunda pide lo único que no dijo.
Juntarlas convierte una confirmación en un trámite. El tope es de tres cajas por vuelta, y hay
una prueba que las cuenta — un campo de más es gente que cierra la pestaña, y a quien esto
quiere escuchar es justamente a quien no tiene paciencia para un formulario.

## Lo que la lectura NO hace

**No interpreta: segmenta.** No hay IA, y no es una carencia: `IA-01` la deja como ampliación e
`integraciones.md` todavía no tiene proveedor elegido. Poner una dependencia externa en el camino
de la recepción sería hacer que recibir un aporte dependa de que un tercero responda.

Así que la pantalla no dice «creemos entender». Dice **esto es lo que nos contaste**, porque eso
es exactamente lo que hay. La diferencia no es de tono: una lectura inventada que la persona
acepta por inercia mete en el expediente palabras que nadie dijo.

La prueba que lo sostiene es literal — **cada palabra de la lectura tiene que aparecer en el
relato** — y se vio fallar haciendo que la función antepusiera dos palabras suyas. El día que
haya proveedor de IA, `leer()` es lo único que cambia: el flujo, las versiones y la última
palabra de la persona siguen igual.

**El recorte se marca.** Un relato largo se corta a 180 caracteres y termina en «…», porque un
recorte sin marca se lee como el texto entero y la persona confirmaría una frase mutilada.

## «No es eso»

El botón que pediste ya estaba modelado en la base desde `T025`: `clase = mal_interpretado`, con
versión propia. Lo que faltaba era el camino para llegar a él.

Cuando la persona corrige, su texto entra como **versión nueva** y la anterior se queda diciendo
lo que decía. Y llega **con lo que ya había escrito dentro**, no en blanco: la especificación lo
pide literal —*«conservar texto ya escrito»*— y vaciarlo castiga justamente a quien se tomó el
trabajo de corregirnos.

## Una decisión de seguridad

**Las vueltas viajan con el código, nunca con el `aporteId`.** Si el navegador llevara el id
interno, cualquiera podría mandar el de otra persona y confirmar una síntesis ajena — y confirmar
es precisamente el acto que dice *esto es mío y dice lo que quise decir*.

El código lo tiene solo quien hizo el aporte, y el canje deja asiento en auditoría acierte o no.

## Las cajas de la consola

Dos errores míos, encadenados. `.bo-search-field` es el **contenedor** de una caja de búsqueda
con icono en el sistema de diseño, y yo la puse en el `<input>`. Al usarla en lugar de
`.bo-field`, los campos se quedaron sin lo único que les da separación — por eso se veían pegados
unos a otros.

Y el segundo, que es el grave: **el nombre del campo vivía en el placeholder**. Desaparece al
escribir, un lector de pantalla no lo anuncia como nombre del campo, y en gris sobre blanco no
pasa el contraste que el propio sistema de diseño valida. La pantalla ciudadana tiene una prueba
contra esto desde el primer día; la consola cayó exactamente en lo que esa prueba impide afuera.

Ahora hay una prueba que recorre el panel y falla si algún campo visible no tiene `<label for>`.
**Y la primera versión de esa prueba era un falso verde**: pasaba también sin etiquetas, porque
el ayudante que abre el aporte devolvía con la navegación en curso y la lista de campos se
contaba sobre una página vacía. Se arregló en el ayudante — abrir un aporte no está hecho hasta
que el panel está — y entonces sí falló, con los 9 campos.

Es el segundo falso verde de esta sesión. El primero fue la hoja de estilos sin importar. Los dos
tenían la misma forma: **la prueba no encontraba nada y lo leía como que no había nada malo.**

## Lo que queda abierto

**`Q28`, nueva**: la síntesis tiene tres clases y falta una. Cuando la persona confirma nuestra
lectura y **agrega** lo que debería cambiar, eso no corrige ni cambia de posición: completa. Hoy
entra como `propuesta` firmada por ella, que es cierto pero mezcla dos cosas en la historia de
versiones. No se inventa una clase cuarta antes de saber para qué sirven las tres (`Q15`).

**La segunda vuelta no pregunta a quién afecta**, que sería lo natural para perfilar. No hay
dónde guardarlo sin inventar una columna que la especificación no nombra, y la cadena de
autoridad dice que manda la especificación, no la pantalla.
