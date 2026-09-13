# Partir en frentes

Un frente es un pedazo del dominio que se puede construir completo y **tocar**. No es un
sprint ni una capa técnica: es un conjunto de reglas que juntas producen algo que alguien
puede usar de principio a fin.

## Qué hace bueno a un frente

- **Se puede tocar al terminarlo.** Si al cerrarlo no hay una pantalla donde alguien haga
  algo, no era un frente: era media cosa.
- **Cierra al menos un caso de la §9.** Si no cierra ninguno, no se puede comprobar que
  quedó bien.
- **Cabe en pocos días.** Un frente que se alarga deja de dar información: cuando termina,
  ya nadie se acuerda de qué se quería descubrir con él.
- **Deja rastro en la cuenta demo.** Sin datos, el frente siguiente se construye sobre
  pantallas vacías y las personas validadoras no tienen qué mirar.

## El primer punto no es negociable

Son dos cosas, y conviene separarlas porque se confunden todo el tiempo.

**1 · La unidad de pertenencia va en el frente 1.** Quién es dueño de qué: el hogar, la
cuenta, el apartamento, la sucursal. Es lo único que de verdad no se puede agregar después,
porque no es una restricción sobre una tabla: es una columna en **todas**, y una condición
en cada consulta que alguien escriba a partir de ese momento. Agregarla después obliga a revisar
todo lo escrito hasta entonces, y basta con que una consulta se escape.

**2 · La invariante suprema se hace imposible en el mismo frente en que nacen los datos que
podría violar. Nunca en uno posterior.**

Esta segunda no siempre cae en el frente 1, y ahí está la confusión. En el ejemplo del
conjunto, la invariante suprema es *"un espacio nunca queda reservado dos veces"* — pero esa
no puede ir de primera, porque para violarla tienen que existir espacios, franjas y
reservas, y nada de eso existe todavía. Va en el frente 2, que es donde nace la primera
reserva, y va **desde el primer día de ese frente**: no se construye "reservar" y después se
le agrega la restricción.

En el proyecto donde nació este método las dos coincidían —la unidad de pertenencia era el
hogar y la invariante suprema era que un hogar no viera a otro— y por eso la regla se
escribió como una sola. No lo es.

Para saber cuál es tu invariante suprema: la única cuyo incumplimiento **no se puede
reparar**. Las demás se corrigen; esa no.

## De ahí en adelante, el orden es por dependencias

Y se puede alterar con criterio. La pregunta para ordenar no es "¿qué es más importante?"
sino **"¿qué necesita esto para poder existir?"**.

Escríbelo así en la §10 de la especificación:

```
| Orden | Frente | Reglas |
|---|---|---|
| 1 | <la invariante suprema y su unidad de pertenencia> | I1, C_ |
| 2 | <lo mínimo que produce valor> | R1, R2 |
```

Y debajo, en una frase, **cuál punto no es negociable y por qué**.

## Un frente se construye en pasos, y cada paso se acuerda

Un frente es gordo a propósito —es lo que se puede tocar de principio a fin— pero **eso es
cómo se parte el dominio, no cómo se construye.** Gordo por fuera, de a poco por dentro.

**Un paso es lo más pequeño que se puede mostrar y sobre lo que alguien puede opinar.** Casi
siempre una pantalla. El frente 1 del ejemplo —quién es quién— son tres pasos: entrar como
alguien y ver qué puede hacer, postularse, y revisar la fila. Cada uno se puede mirar solo.

**Antes de cada paso se proponen dos o tres y la persona escoge.** No se le presenta un plan:
se le presenta una elección corta, y se espera.

### Cómo se propone un paso

- **En pantallas, no en códigos.** *"La pantalla donde alguien publica un producto"*, no
  *"R3 y la normalización de URL"*. La persona no tiene por qué saber qué es `R3`, y si se lo
  decimos va a contestar que sí a todo.
- **Dos o tres, no una lista.** Una opción no es una elección; siete tampoco.
- **Con lo que cada una destaparía.** *"Si empezamos por publicar, vamos a tener que decidir
  qué pasa cuando dos publican lo mismo"*. Eso es lo que le permite escoger de verdad: no cuál
  suena mejor, sino cuál pregunta quiere contestar primero.
- **Y con lo que ya sabemos puesto encima.** Si la especificación ya responde algo de ese
  paso, se dice; si no, se dice también. La persona complementa sobre lo que ve, no sobre una
  hoja en blanco.

### Al terminar un paso, se vuelve a preguntar

Se muestra lo construido, se dice **qué destapó** —lo que hubo que decidir, lo que quedó
abierto— y se proponen los siguientes. **Ese es el ciclo corto**, y va adentro del ciclo largo
de las seis etapas.

**Lo que no se vale es construir el frente entero y después mostrarlo.** Aunque salga bien, la
persona no participó de ninguna de las decisiones que se tomaron en el camino — y esas
decisiones son el producto de este método, no el código.

## Un frente casi nunca está bloqueado entero

Cuando falta un dato —un tope, un umbral, una hora de corte— la reacción normal es parar el
frente y esperar. **Casi siempre es la reacción equivocada**, y sale cara de dos maneras: se
pierde el tiempo de espera, y peor, se pierde la información que ese pedazo iba a producir.

La pregunta no es *"¿tengo todo para construir esto?"*. Es: **"¿qué parte de esto ya se puede
construir, y qué parte espera?"**. Casi cualquier regla se parte en dos:

- **Lo que la regla hace posible** — la tabla, la columna, el dato que se guarda, la pantalla.
- **El criterio con que decide** — el número, el umbral, el plazo.

Un tope de tres posts por día necesita el número para *rechazar el cuarto*. No lo necesita
para contar cuántos lleva alguien hoy, ni para tener la columna donde eso se ve. Se construye
el conteo, y el rechazo entra el día que llegue el número.

### La regla que decide qué va primero

> **Lo que no se puede agregar después va primero, aunque el número falte.**

Es la misma razón por la que la invariante suprema no espera. Guardar de dónde vino un voto no
necesita saber qué es una ráfaga; **contar** sí. Y guardar es lo irreversible: los votos que
ya pasaron sin que nadie anotara su origen **no se reconstruyen**, y el día que llegue el
umbral no habrá contra qué aplicarlo.

Entonces: se construye el guardado hoy, con el número faltando, y el conteo después. Al revés
—esperar el número para empezar— se pierden los datos de todo lo que pasó mientras tanto.

La prueba para saber de qué lado está algo: **si esperar un mes lo hace más caro que hoy, va
hoy.** Una columna que se agrega después obliga a rellenar hacia atrás, y hacia atrás no
siempre hay con qué.

### Cómo se escribe un frente parcial

En la bitácora, "lo que NO entra" deja de ser solo lo que se descartó: lleva también **lo que
espera un dato, con cuál dato es**. Y en la §11 de la especificación, cada dato que falta dice
**qué se puede construir sin él** — que es el renglón que evita que alguien lea esa lista como
una lista de bloqueos.

Un frente parcial se cierra igual que uno completo: con sus casillas, su rastro en la cuenta
demo y sus vacíos anotados. Lo único distinto es que **su lista de "lo que espera" tiene
dueño y tiene dato**, y no dice "pendiente" a secas.

## La lista de frentes es una hipótesis, no un plan

Se escribe en la §10 al especificar, cuando **todavía no se ha construido nada y no se ha
mostrado nada**. Es lo mejor que se puede saber ese día, y por eso mismo es lo que más rápido
envejece.

**Se revisa al cerrar cada frente**, en `/validar`, y son tres preguntas de un minuto:

- **¿El siguiente sigue siendo el siguiente?** Lo que se acaba de mirar puede haber cambiado
  qué urge. Reordenar no es improvisar: la dependencia manda —qué necesita esto para poder
  existir— pero entre los que ya pueden existir, decide lo que se aprendió.
- **¿Apareció un frente que no estaba?** Alguien miró la pantalla, preguntó algo, y la
  respuesta era una funcionalidad entera que nadie había pensado. Se agrega **al final de la
  lista con su porqué**, no en medio: si de verdad urge, se reordena en el paso anterior y se
  ve que se reordenó.
- **¿Se cayó alguno?** Un frente que se diseñó y que después de ver el producto andando ya no
  tiene sentido **no se borra: se marca como caído, con la razón**. Alguien va a preguntar por
  él dentro de tres meses, y "se nos olvidó" y "lo quitamos porque X" son dos respuestas muy
  distintas.

**Cambiar la lista es volver a especificar**, y no es un fracaso: es la flecha del ciclo que
va de la etapa 5 a la 2, aplicada a la §10 en vez de a la §5. Lo único que no se toca es el
primer punto — la unidad de pertenencia y la invariante suprema van donde van, y eso no
depende de lo que se aprenda mirando.

**Lo que sí es un fracaso** es cambiar la lista sin que quede escrito por qué. Una lista que
se reordena en silencio es una lista en la que nadie puede confiar, y a los tres frentes ya
nadie sabe si el orden actual fue una decisión o un descuido.

## Los dos errores

**Partir por capas técnicas.** "Primero la base de datos, después las pantallas" no es
partir en frentes: es partir en capas, y al final del primer mes no hay nada que tocar ni
nada que descubrir. El método completo depende de poder mirar algo funcionando.

**Partir en demasiados.** Diez frentes de dos días cada uno son veinte días sin nadie que
haya visto el producto entero. Cuatro o cinco frentes gordos dan más información que doce
finitos.
