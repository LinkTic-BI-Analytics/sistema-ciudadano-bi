# Las reglas de pantalla

Cada regla trae **el hallazgo que la produjo**. Una regla de interfaz sin el caso que la
originó se discute en la primera revisión y se pierde; una con el caso pegado al lado, no.

Se leen antes de tocar una pantalla.

---

## I1 · Dos vistas: la del proyecto y la de los módulos

Todo MVP tiene **dos vistas separadas**, y no se mezclan:

- **La vista del proyecto** — el producto. Se ve como se vería el producto: su navegación,
  sus pantallas, su vocabulario. Nada de la construcción entra aquí.
- **La vista de módulos** (`/modulos`) — **el mapa de la construcción**. Qué módulos hay, qué
  hace cada uno en dos líneas, cuáles están construidos, cuáles a medias y qué esperan.

**El producto no lleva enlace a la vista de módulos.** Esa vista es interna: quien viene a
mirar el producto no tiene por qué toparse con nuestro tablero de obra. Se entra por su
dirección, que es la que se le pasa a quien está construyendo. Al revés sí: desde los módulos
se entra a cada pantalla del producto.

### Por qué separadas

**Porque quien viene a validar tiene que poder mirar el producto, no el andamiaje.** Si la
información de la construcción vive pegada al producto —un menú que dice *"esto todavía no
está"* junto a los botones de verdad— la persona ya no está mirando el producto: está mirando
un producto con nuestras notas internas encima, y no puede decir si algo se entiende o no.

**Y porque sin el mapa reporta como defecto lo que no se ha construido.** Busca cómo comentar,
no lo encuentra, y lo anota como hallazgo. Eso ensucia la revisión con ruido — y la regla de
`plantillas/revision.md`, *"lo ya sabido cuenta como revisado, no como hallazgo"*, no la puede
aplicar quien no sabe qué se sabía.

Las dos necesidades son reales y se contradicen si se meten en una sola pantalla. Por eso son
dos vistas.

### La vista de módulos es del harness, no del proyecto

Su **forma** no la cambia cada negocio: se ve igual en todos los proyectos que usen el
harness. Alguien que llega de otro proyecto la sabe leer sin que se la expliquen, y eso es
justamente lo que la hace útil como mapa.

Lo que cada proyecto pone es el **contenido**, en un solo archivo declarativo. La vista lo
renderiza; el proyecto solo declara.

### La forma es del harness, y por eso la paleta también

Las dos vistas internas comparten tokens en un solo archivo, `harness.css`: tipografía,
vocabulario y el membrete con el logo de LinkTIC arriba. **El logo es marca del
instrumento, no del negocio** — por eso va fuera del cartucho, que es del negocio que se
está descubriendo. Mezclar las dos cosas es justo lo que I1 prohíbe.

**No comparten fondo, y es a propósito.** La telemetría va en negro y los módulos en
claro, porque son preguntas de distinta naturaleza: la telemetría es un diagnóstico que se
lee de un vistazo, denso; los módulos son un mapa que alguien recorre buscando algo. La
variante clara redefine los mismos tokens, así que ningún componente sabe sobre qué fondo
está.

Las tres únicas señales de color son estados, no decoración: **verde** construido, **ocre**
a medias, **gris** todavía no. Si algo no es un estado, no lleva color. Y **el color de la
línea no sirve para el texto**: el gris que hace de regla sobre blanco no alcanza el
contraste para leerse, así que son dos variables y no una.

Ningún fondo lleva retícula. La primera versión la tenía, y competía con la única línea que
hay que mirar, que es la del ciclo.

### El tablero, no la lista — y en dos bandas

Los módulos van **agrupados en columnas**, no en una lista. La razón es la pregunta que esta
vista existe para contestar, que tiene dos mitades: *qué hay construido* y *qué falta*. Una
lista contesta la primera y obliga a leerla entera para contestar la segunda. Agrupado, las
dos se contestan de un vistazo.

Y columnas y no bandas apiladas, porque **las bandas crecen hacia abajo**: con cuarenta
módulos habría que recorrer la pantalla tres veces. En pantalla angosta sí se apilan — ahí
no hay otra forma honesta.

**Arriba lo que hay, abajo lo que vendría.** Son dos cosas que se miran distinto:

| | |
|---|---|
| **Arriba**, en fichas | `construido` y `a medias, a propósito`. Es lo que alguien viene a mirar y por donde puede entrar |
| **Abajo**, en filas | lo pendiente. Ocupa poco, se lee de corrido, y no compite con lo construido |

Lo pendiente **no se esconde** —un mapa que solo enseña lo construido insinúa que lo demás
ni siquiera está en el plan, y quien mira se calla las preguntas sobre lo que falta— pero
tampoco ocupa el mismo espacio que lo que ya existe.

**Y lo de abajo lleva la salvedad escrita**: es una hipótesis, no un plan. Sin esa línea la
banda se lee como un compromiso de entrega, que es exactamente lo que `metodo/frentes.md`
dice que no es.

### Lo pendiente se agrupa por qué lo detiene

No por tema ni por frente: por **qué lo detiene**, y eso no lo declara el proyecto, se deduce
de si el módulo dice esperar algo.

| | |
|---|---|
| **Le toca su turno** | Es orden. Nadie tiene que hacer nada |
| **Espera un dato** | Falta un número o un criterio, y **tiene dueño**. Quien lo lee sabe que la pelota está de su lado |

Es la misma distinción que esta vista ya hacía en el campo "qué espera", ahora usada para
ordenar la pantalla. Y es la que hace la mitad de su valor: sin ella, todo lo que falta se
lee igual de lejano, y lo que está esperando una decisión de alguien se queda esperando.

### Qué dice de cada módulo

La ficha tiene que contestar dos preguntas, no una: **qué llevo** y **cómo va cada cosa que
llevo**. Decir de qué trata el módulo no contesta ninguna de las dos.

| | |
|---|---|
| **Qué hace** | Dos líneas, en las palabras del negocio. No códigos: quien mira esto no sabe qué es `R3` |
| **Ya se puede** | Lo concreto que alguien puede hacer hoy. Es la respuesta explícita a *"¿qué llevo?"* |
| **Todavía no** | Lo que no está **y por qué**. Un módulo marcado `construido` sin esta lista se lee como terminado, y ninguno lo está |
| **Cómo va** | Cuántos casos de verificación se comprobaron, y **quién lo miró sin haberlo construido** |
| **Pantallas** | Los enlaces, para poder entrar a mirar |

**Dentro de "todavía no" se marca aparte lo que espera una decisión**, y esa distinción es
la mitad del valor de esta vista:

- *"Le toca su turno"* — es **orden**. Nadie tiene que hacer nada.
- *"Espera un número que alguien tiene que decidir"* — es un **dato**, y tiene dueño. Quien
  lee eso sabe que la pelota está de su lado.

**Y "nadie lo ha mirado" se dice, y no en gris.** Un frente construido que nadie que no lo
construyó ha revisado es el modo de falla más común del método — el que `/donde-voy` busca
como podredumbre. Si la ficha lo calla, la pantalla que existe para que alguien sepa cómo va
su proyecto está escondiendo justo lo que peor va.

**Los números salen de donde se marcan.** Los casos comprobados se cuentan de las casillas
de la bitácora, no se estiman. Un número que no se puede verificar no se cree — es la misma
regla de *"los números se nombran, no se cuentan"*.

### Lo que no se hace

- **No se esconde lo que no está.** Un mapa que solo enseña lo construido insinúa que lo demás
  ni siquiera está en el plan, y quien mira se calla las preguntas sobre lo que falta.
- **No se suaviza el estado.** *"A medias"* se dice a medias. Es la misma honestidad que la
  §10 de la especificación pide sobre el papel, aplicada a la pantalla.
- **No se pone la advertencia solo aquí.** Que esto es un instrumento y se va a tirar se dice
  en las dos vistas: quien entra directo al producto también tiene que saberlo.

### El hallazgo que la produjo

Construyendo Product Hunt. Primero fue un menú dentro del producto que mezclaba las dos cosas
—lo construido y lo que faltaba, todo junto con los botones de verdad— y el analista lo
separó: *"podríamos tener vista módulos o vista proyecto; la vista módulo nos permitirá ver
qué está construido, la vista proyecto sería mostrar el proyecto como tal"*.

Y añadió la razón por la que es del harness: *"es la forma en la que visualmente todos los que
usen el harness sepan qué están construyendo y qué ya pudieron adelantar"*.

### Cómo se comprueba

Se le da el enlace a alguien que no lo construyó y se le pregunta dos cosas:

1. **Abriendo el producto:** *¿esto se entiende?* — si contesta hablando de lo que falta, el
   andamiaje se está colando.
2. **Abriendo `/modulos`:** *¿qué hay construido y qué falta?* — si no puede contestar, el
   mapa no está haciendo su trabajo.

**Se actualiza al cerrar cada paso**, no al cerrar el frente. Un paso que agrega pantalla y no
agrega su renglón deja el mapa mintiendo.

---

## I2 · La telemetría sale del grafo, no se escribe a mano

**La telemetría es su propia pantalla** (`/telemetria`), a la que se llega desde los módulos.
Son dos preguntas distintas —*"¿qué hay construido?"* y *"¿dónde va esto y qué falta?"*— y
meterlas en una sola pantalla hace que la segunda parezca un pie de página de la primera.

Lleva en qué etapas va el descubrimiento, qué se sabe, qué falta, qué de lo que falta no puede
esperar, y **el registro de la construcción**. Nada de eso lo escribe nadie: lo produce
`scripts/grafo.sh` leyendo `negocio/` y `git log`.

**Por qué no se escribe a mano.** Un tablero que alguien mantiene a mano se desactualiza en la
tercera semana y a partir de ahí miente — y un tablero que miente es peor que no tener
tablero, porque se toman decisiones con él. Derivado del grafo, o está al día o no existe.

**Y por qué existe el grafo.** `metodo/codigos.md` ya decía que el documento es un grafo:
cuando `R7` cita a `P3` eso es una flecha. Pero ese grafo vivía en prosa, y recorrerlo obligaba
a leer los documentos enteros. Con siete reglas son 18.000 palabras; con setenta serían
180.000, y **cada pregunta pequeña costaría leerlo todo**.

`scripts/grafo.sh` lo hace consultable, y de ahí salen dos cosas:

| | |
|---|---|
| `grafo.sh R5` | R5 y todo lo que toca: **6 nodos** en vez de la especificación entera |
| `grafo.sh --frente 2` | Lo que hace falta para construir ese frente: **29 nodos**, con lo que espera un dato |
| `grafo.sh` | La telemetría |
| `grafo.sh --json` | El grafo entero, para quien lo consuma |

**Un salto, no dos.** La rebanada de un frente a dos saltos trajo 53 de 63 nodos: dejó de
rebanar. La razón es que **los principios son concentradores** —los cita todo el mundo— así
que pasar por uno lleva al resto del documento. Un salto da lo que hace falta; lo demás se
pide aparte.

### El registro de la construcción

Una fila por interacción, la última arriba, con lo que tocó cada una: método, negocio, MVP o
harness. **Sale de `git log`**, por la misma razón que todo lo demás: nadie tiene que
acordarse de llenarla. Un commit no es exactamente una interacción, pero es el único registro
que ya existe.

Sirve para dos cosas que nadie más contesta: **cuántas vueltas llevamos** —que dice si el
descubrimiento está avanzando o dando vueltas— y **qué se tocó de verdad**, que es distinto de
lo que uno cree que hizo.

### Los números se nombran, no se cuentan

*"1 documento cargado"* hizo que el analista dudara de si faltaban documentos. Tenía razón en
dudar: **un número que no se puede verificar no se cree.** Ahora se nombra el archivo
—en ese caso, `Product Hunt.pdf`—.

La regla vale para toda la pantalla: donde quepa el nombre, va el nombre.

### El hallazgo que la produjo

El analista lo dijo antes de que se notara: *"optimizar la
forma en la que consumimos la información, y que no sea que para cada cosa consuma mucha
información sin una lógica"*. Y añadió por qué importa: *"esta es una de las partes más
importantes para cuando vayamos a construir algo muy grande"*.

---

## I3 · Las dos pantallas son obligatorias, y tienen que aguantar cincuenta módulos

**Todo proyecto que use el harness trae `/modulos` y `/telemetria`.** No son un adorno de
este proyecto: son las dos preguntas que alguien que llega se hace —*qué hay construido* y
*dónde va esto*— y un proyecto que no las tiene obliga a preguntárselas a quien construyó,
que es justo lo que el harness existe para evitar.

### Lo que cambia cuando son cincuenta

Con cuatro módulos cualquier cosa se ve bien. La forma se decide con cincuenta, y esto se
probó de verdad: se generó una carga de cincuenta y se midió.

| Con la vista de cuatro | Con cincuenta módulos |
|---|---|
| **7.038 px, casi ocho pantallas de scroll** | 3.435 px |
| Columnas descuadradas: 3.122 contra 4.864 px | 946 contra 1.625 |
| 37 renglones de cosas esperando decisión | **4 decisiones** |

Las reglas que salieron de ahí:

**1 · Un módulo por fila, y todos visibles.** El primer intento plegó el detalle dentro de
cada ficha, y resolvía el tamaño creando un problema peor: **los módulos quedaban
escondidos**. Una pantalla que existe para saber qué hay no puede empezar tapando lo que
hay. Una fila se recorre entera sin abrir nada y mide igual con cuatro que con cincuenta.

**2 · Lo que el módulo lleva adentro va en la fila, no en la ventana.** Lo que ya se puede
hacer y lo que todavía no, a la vista, sin abrir nada. Se intentó al revés —solo los
conteos, y el resto a un clic— y no sirve: *"los módulos no sé qué llevo"*. `4/4` y `2
esperan decisión` dicen cuánto, no **qué**.

La razón está en para qué existe esta pantalla, y es de las que hay que tener escritas:
*"podría tener una sesión varios días y después de tener varias cosas no recordar qué está o
qué falta"*. **Recordar no se resuelve con un clic por módulo — se resuelve viéndolo.** Ese
es el trabajo de esta vista, y esconder para ahorrar scroll es cambiar lo que hace por lo
que mide.

Cuesta: con cincuenta módulos la página pasó de 4,6 a 6,3 pantallas. Se paga.

**3 · La ventana guarda lo que no se lee en diagonal**: quién usa el módulo y para qué, la
razón completa de cada falta, los casos comprobados, los enlaces a las pantallas. Se abre en
ventana y no desplegando la fila, porque desplegar empuja todo lo de abajo y obliga a volver
a buscar dónde iba uno. Cierra con Escape, con el botón y haciendo clic afuera — **las
tres**: quien no encuentra cómo salir de una ventana deja de abrirlas.

**4 · Lo que espera una decisión sube a su propia banda.** Es lo único de esta pantalla
sobre lo que alguien tiene que *hacer* algo, y con el detalle en la ventana quedaría a un
clic por módulo de distancia.

**5 · Las decisiones se agrupan por decisión, no por módulo.** Este fue el hallazgo que más
cambió la pantalla: **la misma cifra que falta bloquea muchos módulos**. La lista plana
traía treinta y siete renglones que eran cuatro decisiones. Agrupada y ordenada por cuántos
módulos destraba cada una, contesta lo único que sirve: **cuál pedir primero.**

**6 · Con muchas filas, la descripción va a una línea** —recorriendo cincuenta nadie lee
dos—, y el texto entero queda en la ventana. La barra de avance hace lo mismo: un tramo por
módulo mientras se distingan, y tres tramos proporcionales cuando se vuelve un peine de
rayitas.

---

## I4 · Cada módulo dice quién lo usa, y los roles se definen una vez

**Lo primero de la ventana de un módulo no es qué hace: es quién lo usa.** La prioridad es
el usuario — un módulo que no sabe decir quién lo usa se especificó desde la función y no
desde la persona, y así se escriben los sistemas que cumplen el contrato y nadie soporta
usar.

Cada módulo declara **qué rol lo usa y para qué**, en una línea por rol. No "el usuario":
*qué* usuario y *qué hace* ahí.

### Los roles se definen arriba, una vez

Un módulo que dice *"lo usa quien cura"* no sirve de nada si nadie sabe quién es quien cura.
Por eso los roles van definidos en su propia banda, antes de los módulos, cada uno con **una
línea de quién es**.

Salen de la taxonomía del negocio —la de la §4 de la especificación— y de los usuarios
probables de la lectura documental. **El que no salga de ningún documento se marca
`deducido`**, porque un usuario que nadie escribió es una hipótesis, no un usuario. Es la
misma regla que `/leer` aplica en su §3, sostenida hasta la pantalla.

### La marca la pone el harness, no el proyecto

La forma de cada rol se asigna **por su posición en la lista declarada**. Ningún negocio
escoge colores, y la pantalla se ve igual en todos.

Y se distinguen **por relleno y borde, no por tono**: en esta pantalla el color significa
estado —construido, a medias, esperando una decisión— y meterle cuatro tonos más de rol lo
volvería ruido. De paso funciona para quien no distingue colores.

### Cómo se comprueba

Se le da el enlace a alguien que no lo construyó y se le pregunta dos cosas:

1. **Abriendo el producto:** *¿esto se entiende?* — si contesta hablando de lo que falta, el
   andamiaje se está colando.
2. **Abriendo `/modulos`:** *¿qué hay construido y qué falta?* — si no puede contestar, el
   mapa no está haciendo su trabajo.

**Se actualiza al cerrar cada paso**, no al cerrar el frente. Un paso que agrega pantalla y no
agrega su renglón deja el mapa mintiendo.

---

## I5 · La línea gráfica es del producto, nunca del harness

El equipo del cliente puede tener ya su marca: tokens, una guía, un sistema de diseño. Eso
es **una entrada del proyecto**, va en `negocio/linea-grafica/` como los documentos, y el
producto se construye con ella **desde el primer módulo**.

### Por qué antes y no al final

Porque **la línea gráfica cambia de qué habla la gente cuando mira.**

Si el instrumento se ve como un boceto gris, quien lo mira comenta el boceto: que los
botones están feos, que falta el logo, que ese azul no es el nuestro. Si se ve como su
producto, comenta lo que sirve: que ese paso sobra, que ahí falta un dato, que nadie haría
eso en ese orden.

Es el mismo problema que I1 resuelve separando las dos vistas —que quien viene a validar
mire el producto y no el andamiaje— aplicado al aspecto. Y por eso no se deja para el final:
se pone antes del primer módulo, cuando todavía no hay diez pantallas que rehacer.

### Si no hay nada, se construye con lo que vaya llegando

No se espera a tener la marca completa para arrancar. Casi siempre no hay sistema de diseño
pero **sí hay referencias**: alguien pasa una captura, un enlace, *"que se vea como esto"*.
Eso sirve, y es de lo que se construye mientras llega lo demás.

**Una referencia sin decir qué tomarle no sirve.** *"Hazlo como Linear"* no dice nada por sí
solo: ¿el color, la densidad, que no tenga sombras, el tono de los textos? Cada una lleva a
una pantalla distinta, y quien la pasó tenía **una** en la cabeza. Se anota qué hay que
tomarle en una frase, y si no se sabe **se pregunta** — es la pregunta más barata de todo
esto. Y cuando aplique, qué **no** tomarle, que suele ser más útil: *"me gusta, pero no ese
azul"* evita rehacer una pantalla.

### Cada token dice de dónde salió

Tres orígenes, y no pesan igual:

| Marca en el token | De dónde salió | Cuánto pesa |
|---|---|---|
| *sin marca* | Del sistema o la guía que entregó el cliente | Es la marca. No se discute |
| `DE REFERENCIA` | De algo que alguien pasó, con lo que había que tomarle anotado | Sirve para construir. **No está decidido**, y se cae cuando llegue la marca |
| `PROVISIONAL` | De nada. Lo pusimos nosotros para que no se vea roto | No representa ninguna decisión |

**Un archivo donde no se distinguen los tres miente al mes**: nadie se acuerda de cuál color
lo dijo el cliente y cuál salió de una captura, y el que salió de la captura se defiende en
una reunión como si fuera marca.

### Y por qué el harness no la toca — nunca

**`/modulos` y `/telemetria` mantienen siempre su propia línea gráfica**, la del harness, sin
importar qué marca traiga el negocio. Es una regla dura y no admite excepción por proyecto.

Su valor está en que se ven igual en todos: alguien que llega de otro proyecto las sabe leer
sin que se las expliquen. Pintadas con la marca de cada negocio se volverían parte del
producto — que es exactamente lo que I1 prohíbe, al revés. Y quien las abre tiene que saber
en el primer vistazo que está mirando la construcción y no lo construido; que **no** se
parezcan al producto es justamente lo que se lo dice.

| | |
|---|---|
| `negocio/linea-grafica/` | Lo que llegue del cliente, crudo: la marca en `marca/`, lo que vayan pasando en `referencias/` |
| `mvp/src/producto/tokens.css` | Lo derivado: los valores que el producto consume, cada uno con su origen |
| `src/harness/harness.css` | Los del harness. **No los toca ningún negocio** |

### Cómo se sostiene técnicamente

El harness declara sus tokens sobre `.harness`, no sobre `:root`, así que lo que el proyecto
ponga en `:root` no lo alcanza. Se comprueba en el navegador: con `--pr-marca` puesto en la
raíz, `.harness` conserva su `--fondo` y su tipografía, y solo el `body` del producto toma la
del proyecto.

Pero eso solo aguanta por una razón, y hay que sostenerla: **`tokens.css` declara variables,
nunca reglas.** Una sola regla global —un `* { border-radius: … }`, un `body a { … }`— se
cuela en las dos vistas y no hay token que la detenga. Si un proyecto necesita reglas, van en
sus propias pantallas, no en el archivo de tokens.

### Lo que no se hace

**No se inventa una marca.** Es la misma regla que prohíbe inventar un número, y por la
misma razón: una paleta plausible es indistinguible de una real y nadie la va a cuestionar
después.

**Y el color provisional de marca es gris a propósito.** Un naranja o un azul plausible se
leen como una decisión que alguien tomó. Un gris se ve como lo que es: que todavía no hay
marca.

**Un token que nadie usa no existe.** Si se declara un color y ninguna pantalla lo consume,
sobra. Esto no es una guía de marca: es la entrada de la que se construye.

### El hallazgo que la produjo

El analista lo pidió antes de que se notara: *"es posible que el equipo ya tenga los tokens
o elementos de cómo gráficamente se debería ver el proyecto; esto se debería dejar en algún
lado para que sea una entrada del proyecto"*. Y dio la razón, que es la que quedó escrita
arriba: *"para que la persona, cuando comience a ver resultados, empiece a verlos dentro de
lo que visualmente ya entiende"*.

Y lo completó al revisarlo: *"si no hay nada construimos con lo que vamos teniendo o con
referencias que se vayan pasando, pero si ya tenemos un sistema de tokens es importante
tenerlo para la construcción"*. De ahí salieron los tres orígenes.

Sobre el harness fue tajante, y por eso la regla no admite excepción: *"las pantallas de
módulo y telemetría siempre se deben mantener con la línea gráfica establecida"*.

---

## I6 · «¿Alcanza para construir la pantalla?» se deriva, no se declara

Cada módulo lleva un nivel que contesta una sola pregunta: **¿alcanza lo que sabemos para
dibujar esto?**

Tres valores, y ninguno es un porcentaje:

| | |
|---|---|
| `alcanza` | Se puede construir entero con lo que hay |
| `a medias` | Se puede dibujar; algo queda sin criterio o sin conectar |
| `no alcanza` | Falta lo básico: nadie sabe quién lo usa, o no hay nada escrito |

### Por qué no es un porcentaje

**Un nivel de confianza escrito a mano es una opinión con formato de dato.** Nadie lo puede
discutir —¿contra qué?— y nadie lo actualiza. A las tres semanas todos los módulos dicen 70 %
y ese número no significa nada.

Este sale de **cuatro cosas que se cuentan**:

| Se cuenta | De dónde sale |
|---|---|
| Qué tan escrito está | `scripts/densidad.sh`, en palabras y con el documento nombrado |
| Cuántas decisiones espera | Las faltas marcadas como dato en la declaración del módulo |
| Quiénes lo usan, y cuántos deducidos | Los roles del módulo. Un usuario deducido es una hipótesis |
| Qué fronteras toca, y en qué nivel de mock | `negocio/fronteras.md`. Nivel 1 es solo saber el nombre |

### Y se enseñan las partes, siempre

La ventana del módulo muestra **de qué está hecho el nivel**, parte por parte, con lo que cada
una empuja. Es la mitad del valor: **un número que no se puede desarmar no se puede
discutir**, y la discusión es justamente lo que hace falta cuando alguien no está de acuerdo.

Con las partes a la vista, el desacuerdo deja de ser *"yo creo que sí alcanza"* y pasa a ser
*"esa frontera no está en nivel 1, ya tenemos el contrato"* — que se resuelve en un minuto y
además corrige el dato.

### Las reglas se dicen, no se puntúan

El nivel no es una suma ponderada: es una lista de reglas en orden, y la primera que aplique
manda. Un puntaje esconde el porqué; una regla se puede señalar con el dedo.

```
lo que falta es el módulo entero        → no alcanza
no hay nada escrito                     → no alcanza
nadie sabe quién lo usa                 → no alcanza
toca una frontera en nivel 1            → a medias   (se puede dibujar, no conectar)
espera un número que alguien decida     → a medias
                                        → alcanza
```

**«Se puede dibujar, no conectar» es la distinción que más sirve.** Una pantalla sobre una
integración de la que solo sabemos el nombre se construye igual, se muestra igual, y enseña
casi lo mismo — siempre que quien la mire sepa que el dato de atrás es inventado.

### El hallazgo que la produjo

Salió de un framework que trajo el analista de otra conversación, que proponía un *nivel de
confianza por módulo*. La primera reacción fue rechazarlo —un porcentaje no se puede
verificar— y él insistió en que la idea servía. **Tenía razón: lo que no servía era
declararlo.** Derivado de cosas contables, es la misma regla que ya gobierna la telemetría —
*sale del grafo, no se escribe a mano*— aplicada a la pregunta de por dónde arrancar.

