# Registro — T040 · El municipio lo confirma la persona

**Autoridad:** el módulo de captura, que dice que el ciudadano *«cuenta qué pasa, confirma la
síntesis del problema **y el lugar afectado**»* · `I2` (la ubicación no se infiere) · `GEO-01`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-14 | 7 pruebas del emparejador contra DIVIPOLA real | `emparejar.test.ts` |
| 2026-09-14 | 3 recorridos del paso nuevo, con el texto de una persona real | `afinar.spec.ts` |
| 2026-09-14 | Chequeo de clases inventadas; **visto fallar** con 4 | `clases_inventadas.py` |
| 2026-09-14 | Interruptor `SIN_IA`; **visto fallar** al quitarlo | `lectura-ia.test.ts` |

## De dónde salió

De una persona probando la pantalla. Escribió **«en la verede la martinita y rionegro
antioquia»** — vereda, municipio y departamento en una frase— y ese texto se guardaba como texto
y ya. La bandeja lo recibía **sin ubicación**, para que un revisor que no estuvo ahí adivinara
después a qué Rionegro se refería.

Teníamos DIVIPOLA cargado desde `T022`: 1.122 municipios, 33 departamentos. No lo estábamos
usando en el único momento en que está presente **la persona que sí lo sabe**.

## Proponer no es inferir

`I2` prohíbe inferir la ubicación, y esto no infiere: **busca candidatos y se los enseña para que
ella confirme**. La diferencia no es un matiz —es la especificación: confirmar el lugar afectado
es literalmente lo que el módulo dice que hace el ciudadano.

La ubicación queda `confirmada`, con autor `ciudadano` y el motivo escrito: *«la persona lo
confirmó al contar su aporte»*. `I2` pide que resolverla sea **un acto de alguien**; aquí el
alguien tiene nombre.

**Y nunca se devuelve uno solo por descarte.** «Rionegro» existe en Antioquia y en Santander: si
el texto no distingue, salen los dos y la pantalla dice *«hay más de uno con ese nombre, y solo tú
sabes cuál es»*. Elegir ahí sería exactamente lo que `I2` prohíbe. Pero si **nombró el
departamento**, solo sale ese: no es decidir por ella, lo dijo — y ofrecerle el otro es ruido, y
el ruido en una lista de botones se toca por error.

La salida —«ninguno / no estoy seguro»— importa tanto como la lista. Sin ella, quien no reconozca
ninguno escoge el primero por salir del paso, y **un municipio equivocado es peor que ninguno,
porque parece un dato**.

Su texto se queda igual en `lugar_declarado`. El código no lo sustituye, y eso es lo que mantiene
reversible haber aplazado el barrio (`Q26`).

## Los otros dos defectos de la misma captura

**«¿A quiénes les pasa? en mi casa».** El modelo metía un sitio en el campo de personas, y de paso
dejaba `lugar` vacío — así que le preguntaba dónde ocurre a alguien que ya lo había dicho, que es
justo lo que este diseño existe para evitar. La instrucción ahora dice que *afectados son
personas* y que *un sitio nunca va ahí*. Comprobado contra el proveedor real: «en mi casa» ya
entra como lugar.

**«Desde el invierno pasado».** En Colombia no hay invierno. Era un ejemplo mío escrito sin
pensar en el país, y un ejemplo que no es de aquí enseña a contestar cualquier cosa. Ahora dice
«hace dos meses», «desde que empezaron las lluvias», «desde diciembre».

## Tres clases que no existían

`.pc-quote`, `.pc-read`, `.pc-options` y `.pc-refine` estaban escritas en pantallas que yo había
dado por terminadas. **Una clase inventada no rompe nada**: el navegador la ignora, el elemento
sale sin estilo, y las pruebas —que buscan texto y botones— pasan igual. Por eso la persona vio
«Esto es lo que entendimos» como texto plano y yo no.

Lo delató una captura de pantalla. Eso es demasiado tarde, así que ahora hay un chequeo que
compara cada `className` del producto contra las hojas del sistema de diseño. **Se vio fallar con
las cuatro.**

## Una prueba que fallaba y no se dejaba reproducir

Tres veces apareció **un solo fallo** en la suite, nunca el mismo y nunca reproducible. La
sospecha: que el servidor de pruebas estuviera cogiendo la llave de IA pese a pasarle la variable
vacía —Next carga `.env.local` del disco al arrancar— y entonces el flujo dependiera de lo que el
modelo encontrara esa vez.

**No lo confirmé.** En vez de seguir persiguiéndolo, lo hice imposible: un interruptor `SIN_IA=1`
que apaga el proveedor antes de mirar ninguna llave, y que los recorridos ponen siempre.

La primera versión de esa prueba **era un falso verde**: afirmaba que el resultado fuera la
segmentación, y con el interruptor borrado una llave inválida da 401 y también cae en la
segmentación. Ahora afirma lo único que distingue las dos cosas: **que no sale ni una petición**.

Es el cuarto falso verde del día, y los cuatro tienen la misma forma: *la comprobación no
encontraba nada y lo leía como que no había nada malo*.

## Lo que queda abierto

**El barrio y la vereda siguen sin catálogo** (`Q4`, `V21`). «La Martinita» no está en DIVIPOLA y
no va a estarlo: DIVIPOLA llega a centro poblado. Se guarda como texto, que es lo que deja la
puerta abierta.

**`Q29`** sigue: una llamada por aporte, y la política de datos de la cuenta sin fijar.
