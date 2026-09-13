# El ciclo

Seis etapas, más una anterior que solo aplica si el cliente trae documentos. No son fases
con fecha: son estados por los que pasa un descubrimiento, y las tres del medio se repiten
una vez por frente.

```
  0 LEER ────────┐   (solo si hay documentos)
                 ▼
  1 DESCUBRIR ──▶ 2 ESPECIFICAR ──▶ ┌─▶ 3 CONSTRUIR ──▶ 4 REGISTRAR ──▶ 5 VALIDAR ─┐
                        ▲ ▲         │                                              │
                        │ │         └──────────────── por cada frente ─────────────┘
                        │ │                                  │
                        │ └────────── lo que resultó regla ───┘
                        │                                    │
                        └── la brecha que la validación destapó ─┘
                                                             │
                                            cuando un módulo está claro
                                                             ▼
                                                       6 ENTREGAR ──▶ equipo de desarrollo
```

| # | Etapa | Comando | Produce | Terminó cuando |
|---|---|---|---|---|
| 0 | Leer | `/leer` | `lectura-documental.md` | Hay una lista de preguntas para la entrevista, y el analista sabe por dónde va la cosa |
| 0a | Explorar | `/explorar` | `que-podemos-construir.md` | Hay dos o tres opciones medidas, y el analista escogió una |
| 1 | Descubrir | `/descubrir` | `dominio.md`, notas crudas | La persona escuchó su recorrido mínimo y dijo que sí |
| 1b | Preguntar | `/preguntar` | `preguntas/<tema>.md` | El pliego volvió y cada respuesta quedó en un archivo |
| 2 | Especificar | `/especificar` | `especificacion.md` | Hay al menos una invariante y ningún código huérfano |
| 3 | Construir | `/frente` | El MVP, la bitácora | Las casillas marcadas y rastro en la cuenta demo |
| 4 | Registrar | `/vacios` | `vacios.md` | Cada decisión apunta a dónde vive |
| 5 | Validar | `/validar` | `revision.md` | Cada hallazgo quedó en una prueba, un chequeo o una regla, y cada brecha quedó marcada como cubierta o como no cubierta |
| 6 | Entregar | `/entregar` | `entregable/modulos/` | Pasa la prueba del sobre cerrado |

Si no sabes en cuál vas: `/donde-voy`.

## Lo que hay que entender de este dibujo

**Las flechas que suben son el método.** Todo lo demás es trabajo normal. Lo que hace
distinto a esto es que dos etapas devuelven a la 2, y devuelven cosas diferentes:

- **La 4 devuelve lo que construir obligó a decidir.** Es la flecha original: nadie sabía que
  eso era una pregunta hasta que hubo que escribir el código.
- **La 5 devuelve lo que mirar destapó.** Alguien que no construyó abre la pantalla, hace una
  pregunta que nadie se había hecho, y la respuesta no está en la especificación. Eso no es un
  defecto de la pantalla: es una brecha de la especificación, y se cierra allá.

Sin esas dos flechas, esto es una cascada con más pasos.

**Lo que la etapa 5 devuelve no es solo una regla: también puede ser el orden.** La lista de
frentes de la §10 se escribió antes de construir nada. Al cerrar cada frente se revisa: el
siguiente puede dejar de ser el siguiente, puede aparecer uno que nadie había pensado, y
puede caerse alguno — que se marca `caído` con su razón, no se borra. Ver
[frentes.md](frentes.md).

**La vuelta 2 → 3 → 4 → 5 → 2 se puede dar las veces que haga falta, y no es obligatorio
darla.** Un frente que se validó y no destapó ninguna brecha sigue derecho. Uno que sí,
vuelve a especificar, se corrige y se vuelve a mirar. **Lo que no se vale es cerrar un frente
con una brecha conocida sin escribir que quedó abierta** — eso es lo que convierte una
decisión en un olvido.

**Adentro de la etapa 3 hay un ciclo más corto, y es el que la gente se salta.** Un frente no
se construye de un golpe: se parte en **pasos** —lo más pequeño que se puede mostrar y sobre
lo que alguien puede opinar, casi siempre una pantalla— y **cada paso se acuerda antes de
construirlo**. Se proponen dos o tres, la persona escoge, se construye uno, se muestra, y se
vuelve a preguntar.

Sin ese ciclo corto, la persona recibe el frente terminado y no participó de ninguna de las
decisiones del camino — que son el producto de este método, no el código. Ver
[frentes.md](frentes.md).

**Las etapas 3 a 5 se repiten por frente, no por producto.** Se construye un frente
completo —hasta poder tocarlo— antes de empezar el siguiente. Construir tres a medias
produce tres cosas que no se pueden validar.

**La 0a existe porque el ciclo saltaba de leer a entrevistar, y la entrevista necesita a la
persona con el dominio en la cabeza, disponible, ahora.** Eso casi nunca pasa; lo que sí pasa
es que alguien llega con documentos cargados y quiere avanzar. La 0a mide dónde está la
información y propone dos o tres puntos de arranque, **sin decidir**: la decisión es del
analista.

Se salta si no hubo documentos, porque entonces no hay nada que medir.

Y descansa sobre algo que vale para todo el método: **es muy poco probable tener toda la
claridad antes de empezar.** Esperar a tenerla es esperar para siempre. Se arranca por donde
más se sabe, se construye algo que se pueda mirar, y lo que falte se destapa mirándolo.

**La 1b no es una etapa aparte: es la etapa 1 cuando no se puede tener a la persona en una
hora seguida.** Se le manda un pliego escrito y vuelve. Produce menos que una entrevista
—un papel no se encadena— pero cierra los datos que faltan, y su contexto mínimo es con lo
que arranca una conversación nueva sin arrastrar todo lo anterior.

**La 6 no espera a que todo esté completo.** Un módulo que ya se mostró y se entendió está
listo para entregarse. Esperar a terminar todo es como no entregar nunca — y es el modo de
falla más común de este método, porque construir es más entretenido que escribir.

## La etapa 0 no reemplaza a la 1

Leer los documentos **no ahorra la entrevista**: la afila. Los documentos describen el
proceso como fue diseñado, y el requerimiento suele estar en el rodeo que nadie escribió.

Lo que cambia es que la entrevista arranca por las preguntas que la lectura produjo —
contradicciones entre documentos, reglas escritas que parecen no cumplirse— en vez de
arrancar por el guion desde cero. Sale mucho más profunda en la misma hora.

## Lo que no está en el dibujo

Entre la 2 y la 3 hay una decisión que no es de nadie más: **cuál es la invariante suprema**
y, por lo tanto, qué frente va primero. Está en [frentes.md](frentes.md).
