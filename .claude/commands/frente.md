---
description: Construye o avanza un frente del MVP y deja su etapa escrita.
argument-hint: [número del frente]
---

Vas a construir un frente del MVP.

## Antes de tocar nada

Lee `plantillas/bitacora.md` (la forma de la etapa), la §10 de `negocio/especificacion.md`
(el orden), `metodo/frentes.md`, **`harness/interfaz.md` si vas a tocar una pantalla**, y
`negocio/vacios.md` — **lo que está en vacíos ya se
decidió y no se vuelve a discutir**.

Si el frente anterior no está cerrado y el orden lo exige, **rehúsa y di por qué ese orden
no es negociable**. Si el que falta es el primero —el de la invariante suprema— explícalo
completo: agregar una restricción sobre datos que ya existen es como se producen las fugas
que debía impedir.

## Antes de construir, recorre el catálogo

Lee `metodo/lo-que-destapa-construir.md` y hazle a **cada entidad que este frente toca** las
preguntas de los bloques A y B — de quién es, si se borra o se apaga, si la definición y el
caso son dos cosas, si el cambio aplica hacia atrás. Diez minutos aquí evitan la migración
cara de después.

Lo que no se pueda contestar con la especificación en la mano **es un vacío desde ya**: se
anota antes de construir, no después.

## Si falta un dato, parte el frente — no lo detengas

**Casi ningún frente está bloqueado entero.** Cuando falta un tope, un umbral o una hora de
corte, lo que falta es el criterio con que una regla decide, no lo que esa regla hace posible.

Recorre las reglas del frente y parte cada una en dos: **qué hace posible** —la tabla, la
columna, el dato que se guarda, la pantalla— y **con qué criterio decide** —el número—. Lo
primero casi siempre se puede construir hoy.

Y hay una regla que decide el orden, que es la misma de la invariante suprema:

> **Lo que no se puede agregar después va primero, aunque el número falte.**

Guardar de dónde vino un voto no necesita saber qué es una ráfaga; contar sí. Y guardar es lo
irreversible: los votos que ya pasaron sin origen no se reconstruyen, y el día que llegue el
umbral no habrá contra qué aplicarlo. La prueba: **si esperar un mes lo hace más caro que hoy,
va hoy.**

Lo que se construye a medias **se dice a medias**: en la bitácora, "lo que NO entra" lleva lo
que espera un dato y **cuál dato es**, con dueño. Nunca "pendiente" a secas.

**Lo único que no se parte** son la unidad de pertenencia y la invariante suprema. Si a una de
esas le falta el dato, ahí sí se para y se pide — construir la mitad de una invariante es
construir un dominio falso.

## No construyas el frente entero: propón el primer paso y espera

**Esto es lo que más se hace mal, y lo hace mal quien construye rápido.** Un frente es gordo
a propósito —es lo que se puede tocar de principio a fin— pero eso es cómo se parte el
dominio, no cómo se construye. Gordo por fuera, de a poco por dentro.

Parte el frente en **pasos**: lo más pequeño que se puede mostrar y sobre lo que alguien puede
opinar. Casi siempre una pantalla.

**Propón dos o tres y espera la respuesta.** No es una formalidad: es el momento en que la
persona entra al diseño en vez de recibirlo terminado.

Cómo se proponen:

- **En pantallas, no en códigos.** *"La pantalla donde alguien publica un producto"*, no
  *"R3 y la normalización de URL"*. Si le dices códigos, va a contestar que sí a todo.
- **Dos o tres.** Una opción no es una elección; siete tampoco.
- **Con lo que cada una destaparía.** *"Si empezamos por publicar, vamos a tener que decidir
  qué pasa cuando dos publican lo mismo el mismo día"*. Eso le permite escoger cuál pregunta
  quiere contestar primero, que es la elección que de verdad importa.
- **Diciendo qué ya sabemos y qué no.** Si la especificación responde algo de ese paso, se
  dice; si no, también. La persona complementa sobre lo que ve.

**Construye un paso. Muéstralo. Vuelve a preguntar.** Al terminar cada paso se dice qué
destapó —lo que hubo que decidir, lo que quedó abierto— y se proponen los siguientes.

Lo que no se vale es construir el frente entero y después enseñarlo. Aunque salga bien, la
persona no participó de ninguna de las decisiones del camino — y esas decisiones son el
producto de este método, no el código.

## Antes de construir un paso, declara

- Los códigos que ese paso implementa.
- **Los casos de la §9 que va a cerrar**, copiados literales.
- Si algún caso no se puede cerrar, dilo **ahora**, no al final.
- **Qué queda esperando un dato**, con cuál dato y a quién se le pide.

## Mientras construyes

- Cada decisión que la especificación no responde **se para y se anota**. No se resuelve
  callado: eso es exactamente lo que este método existe para capturar.
- Respeta las invariantes aunque sea un MVP. Un MVP que permite lo prohibido enseña un
  dominio falso, y las conclusiones que salgan de usarlo van a ser falsas.
- No optimices. Esto se construye para descubrir y para tirarse.

## Al cerrar el frente

Un frente se cierra cuando sus pasos están cerrados, no antes.

- La entrada en `negocio/bitacora.md` con sus pasos, los casos de §9 que cerró, y **"lo que
  NO entra" con su razón**.
- **Rastro en la cuenta demo.** Un frente sin datos deja las pantallas vacías, y una
  pantalla vacía no se puede validar con nadie.
- **La vista de módulos al día** — `harness/interfaz.md` I1. Cada paso que agrega pantalla
  agrega su renglón, y lo que quedó esperando un dato lo dice **con cuál dato y de qué clase
  es**: *"le toca su turno"* es orden, *"espera un número"* tiene dueño. Un mapa
  desactualizado miente, y quien viene a validar reporta como defecto lo que no se construyó.
- Llama a `/vacios` para registrar lo que salió.
- Sugiere `/validar` si hay pantalla nueva.
- **No des por hecho que el frente siguiente es el siguiente.** La lista de la §10 es una
  hipótesis escrita antes de construir nada. Quién va ahora se decide después de validar, con
  lo que se aprendió mirando — no antes.
