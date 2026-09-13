# Las palabras de este método

El método exige que cada negocio escriba su glosario. Sería raro no tener el propio.

Están en el orden en que se necesitan, no alfabético.

## Lo que se hace

**Descubrimiento** — todo el trabajo que hace este repositorio: sacar de la cabeza de
alguien lo que quiere, construirlo barato para ver qué faltaba, y escribir el requerimiento
formal. Empieza con una entrevista y termina con documentos en `entregable/`.

**MVP** — *producto mínimo viable*. Aquí significa una cosa muy concreta: **un sistema que
funciona de verdad, construido rápido, para descubrir con él y después tirarlo.** No es una
maqueta ni un dibujo: tiene pantallas, guarda datos y se puede usar. Y no es el producto: el
producto lo construye después un equipo de desarrollo, con el documento que sale de aquí.

**Frente** — un pedazo del negocio que se construye completo y se puede tocar. No es una
capa técnica ni un sprint: son las reglas que juntas producen algo que alguien puede usar de
principio a fin. Se construyen en orden y uno a la vez.

**Paso** — lo más pequeño que se puede mostrar y sobre lo que alguien puede opinar. Casi
siempre **una pantalla**. Un frente se construye en pasos, y **cada paso se acuerda antes de
construirlo**: se proponen dos o tres, en las palabras de la persona —no en códigos— y ella
escoge.

La razón es la que sostiene todo el método, dicha al revés: si la mitad de las preguntas de un
requerimiento no se pueden hacer en una reunión, **tampoco se pueden contestar todas de una**.
La persona no puede entregar todos los requerimientos, y no hay que pedírselos. Lo que sí
puede hacer, y muy bien, es **opinar sobre algo que ve**. Entonces se le da algo que ver lo
antes posible y lo más pequeño posible, y ella va complementando.

Un frente gordo construido de un solo golpe no es un MVP: es un producto pequeño entregado sin
que nadie opinara en el camino.

**Módulo** — un pedazo del **entregable**. Un frente es cómo se construye; un módulo es cómo
se entrega. Casi siempre coinciden, pero no tienen por qué: dos frentes pequeños pueden
entregarse como un módulo, y un frente muy grande puede partirse en dos.

**Cuenta demo** — una cuenta de mentiras dentro del MVP, con **datos suficientes para que
las pantallas se vean como se verían de verdad**: en el ejemplo del conjunto, unos veinte
apartamentos, reservas de tres meses atrás, algunas canceladas, alguna anulada.

Existe porque una cuenta recién creada solo enseña pantallas vacías, y en una pantalla vacía
no se descubre nada: las contradicciones y los números que no cuadran solo aparecen cuando
hay historia detrás. **Cada frente le agrega su parte**, y por eso "rastro en la cuenta demo"
es condición para cerrarlo.

Los datos los inventa Claude a partir de lo que la persona contó. Es la única cosa que se
inventa a propósito en todo el método, y se puede porque no son datos del negocio: son un
escenario para poder mirar.

## Lo que se escribe

**Invariante** — algo que **tiene que ser imposible**, no algo que sería malo que pasara. La
prueba: si admite grados —"que sea rápido", "que sea claro"— no es invariante. Si es sí o
no, y su incumplimiento es un incidente que alguien tiene que salir a apagar, sí lo es.

En español llano, delante del cliente, se pregunta así: **"¿qué no puede pasar nunca?"**. La
palabra *invariante* es nuestra, no suya.

**Invariante suprema** — la única cuyo incumplimiento **no se puede reparar**. Las demás se
corrigen; esa no. Se escoge una sola, y de ella depende el orden de construcción.

**Grafo** — la red de referencias entre códigos. Cuando `R7` dice "se deriva de `P3`", eso es
una flecha; el conjunto de todas las flechas es el grafo. Importa porque permite preguntar
*"si cambio este principio, ¿qué se rompe?"* y tener respuesta.

**ADR** — *registro de una decisión de arquitectura*, por su sigla en inglés. Aquí es más
simple de lo que suena: un archivo corto que dice **qué se decidió, por qué, y qué se pierde
con esa decisión**. Viven en `decisiones/`. Existen para que dentro de seis meses nadie
crea que una cosa rara fue un descuido.

**Vacío** — una pregunta que la especificación no responde y que construir obligó a decidir.
Son la materia prima de este método: si al terminar un frente no hay ninguno, o no se
construyó nada, o no se anotó.

## Lo técnico, en una línea cada uno

Nada de esto lo tiene que saber quien opera el método. Está aquí para cuando aparezca en un
documento y estorbe.

| Palabra | Qué es |
|---|---|
| **Repositorio** | La carpeta del proyecto, con todo adentro. Cuando alguien diga "el repo", es esto |
| **Stack** | El conjunto de herramientas con que se construye el MVP: Next, Supabase y Vercel. Está fijo y no se discute por proyecto — la lista completa con versiones está en el [ADR 0006](../decisiones/0006-stack-fijo.md) |
| **Harness** | El andamiaje técnico reusable: las reglas de pantalla, de datos y los chequeos automáticos. Se lleva de un proyecto a otro sin cambios |
| **Commit** | Una versión guardada del MVP, con un código corto que la identifica (`a7f31c2`). Se anota en el entregable para saber de qué versión salió |
| **Terminal** | La ventana donde se escriben comandos. Los comandos de este método se escriben ahí, precedidos de `/` |
| **Claude Code** | El programa donde corre todo esto |

## Lo que decimos y lo que dice el cliente

Igual que en cualquier negocio, hay palabras que son nuestras y no van en la conversación
con la persona. Si se le habla de invariantes y de grafos, se pierde media hora.

| Nosotros decimos | Al cliente se le pregunta |
|---|---|
| Invariante | ¿Qué no puede pasar nunca? |
| Regla de negocio | ¿Hay algún límite? ¿Cómo se calcula eso? |
| Cualidad | ¿Cómo se daría cuenta de que está funcionando bien? |
| Principio | ¿Qué haría usted si pasa algo que no habíamos previsto? |
| Recorrido mínimo | Cuénteme el último día que hizo esto, paso a paso |
| Vacío | (no se menciona: es trabajo nuestro) |
