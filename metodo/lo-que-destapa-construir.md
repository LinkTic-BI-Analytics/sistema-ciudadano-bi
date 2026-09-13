# Lo que destapa construir

El catálogo de preguntas que aparecen **siempre**, en cualquier negocio, y que ninguna
entrevista produce.

## De dónde salió esto

El proyecto donde nació este método terminó con 136 vacíos registrados: preguntas que la
especificación no respondía y que hubo que decidir para poder seguir construyendo.

Al mirarlas juntas no eran 136 sorpresas distintas. Eran **unas veinte formas de pregunta
repitiéndose** sobre cosas diferentes. La misma pregunta que apareció con los sobres apareció
después con las bolsas, con las tarjetas y con las etiquetas — y cada vez sorprendió, porque
nadie la había escrito como forma.

Aquí están escritas. No son un cuestionario para la entrevista: **son lo que hay que
preguntarle a cada entidad y a cada regla mientras se construye.** Se usan en `/frente`,
cuando toca decidir algo que la especificación no dice.

Cómo leer cada una: la pregunta · por qué no sale antes · qué pasa si no se hace · un caso
real.

---

## A · De quién es, y quién puede

### A1 · ¿De quién es cada cosa?

La unidad de pertenencia: la persona, la cuenta, el hogar, el apartamento, la sucursal.

**Por qué no sale antes.** Para quien cuenta su negocio es obvio de quién es cada cosa, y por
eso no lo dice. Solo aparece cuando hay que escribir a nombre de qué se guarda una fila.

**Si no se hace.** Se escoge la unidad equivocada —casi siempre la persona— y cambiarla
después no es cambiar una tabla: es cambiar todas, y una condición en cada consulta escrita
hasta ese momento.

**Un caso.** *"¿El derecho a reservar es del residente o del apartamento?"* Del apartamento.
Si fuera de la persona, un apartamento con cuatro adultos tendría cuatro veces más derecho.

### A2 · ¿Quién puede hacerle qué a quién?

**Por qué no sale antes.** Se pregunta "¿quién usa esto?" y se contesta con una lista de
personas, no con una matriz de permisos. Las excepciones —*"bueno, sacar a alguien no
cualquiera"*— solo salen cuando hay un botón que apretar.

**Si no se hace.** Se construye el caso normal y aparece el día que alguien se saca a sí
mismo, o saca al último que quedaba.

**Un caso.** *"Cualquiera saca a cualquiera menos a sí mismo, y el último no puede salir."*
Ninguna de las dos mitades estaba escrita.

### A3 · ¿Qué queda de alguien que se fue?

**Por qué no sale antes.** Nadie cuenta su negocio desde la salida. Se cuenta desde que las
cosas funcionan.

**Si no se hace.** O se borra en cascada y desaparece el histórico, o quedan filas huérfanas.
Las dos son malas y descubrirlo tarde cuesta una migración.

**Un caso.** Al salir del hogar, el nombre se **congela en la fila** y se suelta el vínculo
con la cuenta. Lo que esa persona registró sigue ahí, con su nombre.

---

## B · Qué es una cosa, y qué es cada caso de esa cosa

### B1 · ¿La definición y el caso son dos cosas distintas?

Casi siempre sí, y casi nunca se dice. "El arriendo" es una definición que se repite todos
los meses; "el arriendo de agosto, 1.500.000, pagado el 5" es un caso.

**Por qué no sale antes.** Se habla de las dos con la misma palabra, y en la conversación
nunca estorba.

**Si no se hace.** Se modela una sola y aparece el mes que hay que cambiar el monto sin
reescribir la historia — o el mes que se quiere ver cómo iba antes.

**Un caso.** `fuentes` (de dónde entra plata) contra `entradas` (una llegada, en un mes). Se
descubrió cuando las entradas se modelaron sin definición y no había cómo proponer el mes
siguiente.

### B2 · ¿Se borra o se apaga?

**Por qué no sale antes.** "Se elimina" en la conversación significa "deja de aparecerme", no
"desaparece de la historia".

**Si no se hace.** Se borra de verdad y el histórico se desfonda: los meses viejos empiezan a
dar cifras distintas.

**Un caso.** Se vende el carro. El carro se apaga; lo que costó sigue sumando en el año.

### B3 · ¿Esto cambia el pasado?

Cuando un dato cambia —una tasa, un precio, un tope, un horario— ¿el cambio aplica hacia
atrás o solo de aquí en adelante?

**Por qué no sale antes.** Nadie piensa en el pasado cuando está describiendo cómo funciona
hoy.

**Si no se hace.** Se guarda en una columna, el cambio reescribe la historia, y ningún
indicador histórico vuelve a significar nada.

**Un caso.** La tasa de una bolsa no es una columna: son **tramos con fecha**. Una columna
solo guarda el último valor y aplicarla hacia atrás miente sobre lo que rindió.

---

## C · Los vacíos y los bordes

### C1 · ¿Un campo vacío es un error o es el dato?

**Por qué no sale antes.** En la conversación todo el mundo describe los casos completos.

**Si no se hace.** Se pone obligatorio algo que legítimamente no se sabe, y la gente empieza
a escribir cualquier cosa para poder seguir. A partir de ahí los datos mienten.

**Un caso.** Una deuda sin cuota **no es una captura incompleta**: es una deuda sin plan de
pago, y el sistema lo dice con esas palabras en vez de exigir un número inventado.

### C2 · ¿Dónde cae lo que no encaja en ninguna categoría?

**Por qué no sale antes.** Quien describe su negocio enumera las categorías que usa, no la
que le falta.

**Si no se hace.** O se obliga a clasificar —y la gente escoge cualquiera, arruinando el
dato— o se pierde el registro.

**Un caso.** Un gasto sin sobre cae en uno llamado "Otros", **sin presupuesto**: nadie
decidió cuánto debería costar lo suelto, y ponerle una cifra haría que la desviación no
signifique nada.

### C3 · ¿Qué pasa la primera vez, cuando no hay nada?

**Por qué no sale antes.** El negocio se describe en régimen, ya andando.

**Si no se hace.** La primera pantalla que ve alguien nuevo está vacía y no dice qué hacer, o
peor, muestra un cero que parece una medición.

**Un caso.** Un sobre que nadie presupuestó **no genera exceso**: no se pasó de nada, y
preguntar de dónde salió esa plata sería molestar por algo que no ocurrió.

### C4 · ¿Qué se hace cuando el dato de afuera no llegó?

Toda cosa que dependa de un tercero —una tasa, un precio, un catálogo— necesita su cascada.

**Por qué no sale antes.** Se asume que el dato está.

**Si no se hace.** Se inventa un valor razonable, y un valor inventado es indistinguible de
uno real. Nadie lo vuelve a cuestionar.

**Un caso.** Sin la tasa del día, un aporte en otra moneda **no se registra**. Es un trigger,
no una advertencia: la tasa de ese día ya pasó y después nadie puede reconstruirla.

---

## D · Las cuentas

### D1 · ¿Esto entra en esa suma? ¿Y se cuenta una sola vez?

**Por qué no sale antes.** Las sumas se describen por su nombre —"el total del mes"— y nadie
enumera qué entra.

**Si no se hace.** Doble conteo. Es el error más caro que existe porque no se ve: la cifra
sale plausible.

**Un caso.** La cuota de una deuda es **un sobre enlazado**, no una cosa aparte. Si viviera
en los dos lados, el compromiso del mes la contaría dos veces. Otro: un ahorro pagado con una
prima se restaba también del sueldo — 4.250.000 de déficit falso en un mes.

### D2 · ¿Se calcula o se guarda?

**Por qué no sale antes.** Es una pregunta de construcción pura. Nadie del negocio la puede
contestar.

**Si no se hace.** Se guarda un contador al lado de los datos de los que sale. Se separan —y
se separan— y nadie sabe cuál es el bueno.

**Un caso.** Cuántas reservas le quedan a un apartamento se **calcula** de las reservas. Un
contador y una lista son dos verdades sobre lo mismo.

### D3 · ¿Dónde cae el redondeo?

**Por qué no sale antes.** Nadie reparte a mano hasta el último peso.

**Si no se hace.** Las partes no suman el total, y alguien que sí hace la cuenta pierde la
confianza en todo lo demás.

**Un caso.** El sobrante del reparto cae en *libre*, que es el único destino sin una
consecuencia que distorsionar. En una meta, adelantaría meses que no se adelantaron.

### D4 · ¿Con qué fecha se anota?

**Por qué no sale antes.** Se habla del qué, no del cuándo exacto.

**Si no se hace.** El movimiento queda en un orden que hace que los cálculos que dependen de
la secuencia den distinto.

**Un caso.** Un pago hecho hoy sobre un mes en curso se anota **con la fecha de hoy**, no con
el día 1: con el día 1 quedaría antes del registro que creó la deuda y no movería el saldo.

---

## E · Qué hace el sistema con eso

### E1 · ¿Impide, o solo avisa?

**Por qué no sale antes.** La conversación dice "eso no debería pasar", que no distingue
entre las dos.

**Si no se hace.** Se bloquea algo que la vida real necesita —y la gente encuentra el
rodeo— o se deja pasar algo que no se puede deshacer.

**Un caso.** Se puede cerrar un mes sin el extracto de una tarjeta: la regla decía "avisa",
no "impide". El extracto llega tarde y el mes no puede quedarse abierto para siempre. Lo que
queda es la marca de que se midió contra una base incompleta.

### E2 · ¿Cómo se hace imposible?

Cuando algo **no puede pasar nunca**, ¿se comprueba antes de escribir, o se hace imposible en
los datos?

**Por qué no sale antes.** Es la traducción de una invariante a construcción, y solo existe
cuando hay algo que construir.

**Si no se hace.** Se comprueba y después se escribe, en dos pasos — y entre los dos pasos
cabe la otra solicitud. Es exactamente así como se producen las dobles reservas.

**Un caso.** La restricción de que una franja no se tome dos veces vive **en los datos**. La
primera versión comprobaba y después escribía: con dos pestañas abiertas salió doble a la
primera.

### E3 · ¿Basta con anotarlo, o tiene que dejar consecuencia?

**Por qué no sale antes.** Registrar algo y que ese algo cambie el resto suenan igual cuando
se cuentan.

**Si no se hace.** Queda una nota bonita que no mueve ninguna cifra, y el sistema empieza a
tener dos versiones de la realidad.

**Un caso.** Decir que un exceso se cubrió con un préstamo **crea la deuda en la misma
transacción**. Sin eso sería una anotación, no un registro.

### E4 · ¿Cuándo se pregunta?

**Por qué no sale antes.** El momento se piensa cuando hay una pantalla que interrumpe a
alguien.

**Si no se hace.** Se pregunta siempre y se vuelve ruido, o se pregunta tarde y ya nadie se
acuerda.

**Un caso.** De dónde salió el exceso solo se pregunta **cuando el margen ya no alcanza**.
Con margen, sale de ahí y no se molesta a nadie.

### E5 · ¿Esto es una acción o solo información?

**Por qué no sale antes.** Nadie distingue entre "el sistema me dice" y "el sistema lo hace"
hasta que ve un botón.

**Si no se hace.** Se pone un botón donde debía haber una decisión humana, y el sistema
empieza a decidir cosas que no le tocan.

**Un caso.** Las opciones para cuadrar un mes que no cuadra **no tienen botón de aplicar**.
Son caminos con su precio; quien decide baja a la pantalla que corresponda.

---

## F · Cuando dos reglas se tocan

### F1 · El caso que ninguna de las dos nombra

Dos reglas, cada una clara por su lado, y un caso que cae justo en el medio.

**Por qué no sale antes.** Las reglas se cuentan de a una. El cruce no existe hasta que
existen las dos y hay que escribir el código que las obedece a ambas.

**Si no se hace.** Se implementa la que se estaba escribiendo en ese momento y la otra queda
rota en silencio, para un caso que aparece meses después.

**Un caso.** La lista de espera da 12 horas para confirmar; el corte es el jueves a las 6.
¿Qué pasa con una franja liberada el jueves a las 5? Mandan las 12 horas: el corte existe
para que la lista alcance a reaccionar, y aplicarlo contra quien está reaccionando lo vuelve
en contra de su propósito.

**Estos se registran aparte.** En `vacios.md` tienen su propia tabla, y la última columna no
es *dónde* quedó sino **por qué** se resolvió así — que es lo único que sirve cuando el caso
vuelva a aparecer con otras dos reglas.

---

## Cómo se usa este catálogo

**No de corrido.** Se usa apuntando:

- **Al abrir un frente**, recorre las entidades que va a tocar y hazle a cada una las de los
  bloques A y B. Diez minutos, y evitan la migración cara.
- **Al escribir una regla**, las de D y E.
- **Cuando algo no se sabe decidir**, busca aquí la forma: casi siempre ya está, y la
  respuesta de otro dominio sirve de guía.
- **Al cerrar un frente**, en `/vacios`: cada respuesta que se dio queda escrita, aunque
  parezca obvia. Lo que parece obvio hoy es lo que nadie va a poder explicar en marzo.

**Este catálogo crece.** Cuando en un negocio aparezca una forma que no está aquí —no un caso
nuevo, una **forma** nueva— vuelve a la plantilla. Eso es `cosecha.md`.

---

### Las tres capas de la cuenta demo

Ya se pedía "rastro en la cuenta demo". De qué está hecho ese rastro:

1. **Coherencia estructural** — cédulas con formato válido, fechas en orden, montos en rangos
   plausibles. Sin esto la pantalla se ve rota y nadie mira más allá.
2. **Coherencia relacional** — si alguien tiene tres cosas, esas tres existen y cuadran entre
   tablas.
3. **Casos borde a propósito** — un registro incompleto, un nombre con tilde y ñ, un monto en
   cero, algo vencido.

**La tercera es la que vale**, y es la que se olvida. Es la que produce el *"¿y eso qué hace el
sistema cuando pasa?"* — la pregunta que ningún documento contesta. En Product Hunt se hizo sin
nombrarla: se sembró una ráfaga de votos a propósito para poder mirar lo que la invariante iba
a tener que descartar.

