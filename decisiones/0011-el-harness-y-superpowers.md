# ADR 0011 — El harness decide qué se construye; Superpowers organiza cómo

**Alcance:** método
**Estado:** aceptada
**Fecha:** 2026-09-13

## Contexto

El método de este repositorio termina en `entregable/modulos/`. Ahí se para: produce un
requerimiento formal y lo entrega a un equipo de desarrollo. `AGENTS.md` lo dice sin
rodeos en §2 —*«el MVP es un instrumento, no un producto»*— y deja **cinco secciones
vacías a propósito, §8 a §12**: dónde vive la lógica, base de datos, interfaz, entornos y
credenciales, y la definición de terminado del código. Son los huecos de la capa que falta.

El analista trajo [Superpowers](https://github.com/obra/superpowers) (v6.3.0, 14 skills) y
una guía propia, `metodo/construccion-solida-y-paralela.md`, que ya había hecho el trabajo
de conectarlos en el papel. La pregunta no era si sirve: era **qué manda cuando los dos
digan cosas distintas**, y **dónde exactamente se puede paralelizar sin romper nada**.

Hay un hecho que obliga a decidir ya. Este negocio son **10 módulos, 16 requerimientos
funcionales, 6 invariantes, 11 roles y 12 decisiones sin tomar**. Con ese tamaño, esperar a
que el orden salga solo es garantizar que no salga.

Y hay un precedente directo: el [ADR 0010](0010-las-fronteras-de-integracion.md) hizo este
mismo ejercicio contra otro framework hace dos semanas. El veredicto fue *«buena parte ya
está, con otro nombre»*, y en dos puntos el método no cedió. Este ADR sigue esa forma.

## Decisión

**El harness es la Capa A y decide qué se construye y por qué. Superpowers es la Capa B y
organiza cómo construirlo. La frontera entre las dos es el módulo entregable, y el módulo
entregable manda sobre el plan.**

### La cadena de autoridad

Cuando dos artefactos se contradigan, manda el de más arriba:

| # | Artefacto | De quién es |
|---|---|---|
| 1 | La decisión explícita de la persona responsable del negocio | — |
| 2 | El módulo entregable vigente y sus códigos `RF` `C` `P` `R` `I` | harness |
| 3 | La especificación vigente | harness |
| 4 | Las decisiones registradas en `vacios.md` | harness |
| 5 | El plan de implementación | Superpowers |
| 6 | El contrato de una tarea | la guía §6 |
| 7 | El código existente | — |

**El plan explica cómo cumplir la especificación; no tiene autoridad para cambiarla.** Y el
código demuestra una implementación: no convierte su comportamiento en regla de negocio.

Superpowers entra en los niveles 5, 6 y 7. **No toca del 1 al 4.** Su skill de
`brainstorming` es buena, pero aquí el descubrimiento ya tiene dueño: `/descubrir`,
`/especificar`, `/vacios` y `/validar`, con las cinco familias de códigos y el escribano
auditando el grafo.

### El artefacto puente

`plantillas/modulo.md` produce `entregable/modulos/MNN-*.md`. **Ese archivo es el `Spec:`
que pide el encabezado de `superpowers:writing-plans`**, que dice literalmente: *«the plan
argues from the spec, so the spec travels with it; executors read both»*. Encaja sin
adaptador.

```
negocio/especificacion.md
      │ /entregar          ← la prueba del sobre cerrado
      ▼
entregable/modulos/M01-captura.md          LA AUTORIDAD
      │ /planear-construccion M01
      ▼
construccion/planes/AAAA-MM-DD-captura.md  superpowers:writing-plans
construccion/tareas/T0NN-*.md              contratos, guía §6
      │ /despachar
      ▼
superpowers:subagent-driven-development     la ejecución
      │ /integrar
      ▼
construccion/hoja-de-ruta.md → terminado, con evidencia
```

### Dónde vive el paralelismo, exactamente

Esta es la parte que hay que tener a mano, porque es donde el error sale caro.

`superpowers:subagent-driven-development` lo prohíbe en una línea: **«Never dispatch
multiple implementation subagents in parallel (conflicts)»**. Y la guía §2.2 dice lo mismo
por otro camino: dos tareas solo van en paralelo si no tocan los mismos archivos, no
deciden sobre la misma regla, y sus interfaces ya están escritas y aprobadas.

Los dos están diciendo lo mismo. De ahí sale la regla:

> **El paralelismo es entre planes, no entre tareas.**
> Un módulo = un plan = un worktree = una corrida secuencial de SDD.
> Varios módulos independientes = varios worktrees a la vez.

`superpowers:using-git-worktrees` da el aislamiento que la guía §7 exige en su novena
casilla —*«tiene un espacio de trabajo aislado»*—. Sin worktree, esa casilla no se puede
marcar y la tarea no se despacha.

### Qué aporta cada quién

| Rol de la guía §3 | Lo ejecuta | De dónde sale |
|---|---|---|
| Responsable de negocio | una persona | — |
| Orquestador-integrador | la sesión principal | `subagent-driven-development` |
| Agente de descubrimiento | `/leer` `/descubrir` `/especificar` `/vacios` `/validar` | harness |
| Agente planificador | `/planear-construccion` | envuelve `writing-plans` |
| Agente constructor | el implementador de SDD | Superpowers |
| Revisor de cumplimiento | task-reviewer, primera etapa | Superpowers |
| Revisor técnico | task-reviewer, segunda etapa | Superpowers |
| Auditor del grafo documental | `escribano` | harness |
| Refutador de hallazgos | `abogado-del-diablo` | harness |
| Personas validadoras | agentes por negocio | `plantillas/persona.md` |

**No se crean agentes nuevos.** Los diez roles quedan cubiertos por lo que ya existe en los
dos lados. Un agente más sin un chequeo detrás es ceremonia, y este repositorio ya tiene
escrita la lección: *«un chequeo que no se ha visto fallar no es un chequeo»*.

### Los dos registros de progreso, y cuál manda

Superpowers lleva su propio ledger en `.superpowers/sdd/<plan>/progress.md` y advierte por
qué: *«controllers that lost their place have re-dispatched entire completed task sequences
— the single most expensive failure observed»*. La guía §4 pide un registro equivalente en
`construccion/progreso/`.

**Son dos vistas del mismo hecho y no se duplican a mano.** El ledger de SDD es el original
—lo escribe el orquestador mientras ejecuta— y `construccion/progreso/` se deriva de él
junto con `git log`. Si alguna vez se contradicen, **manda `git log`**: los commits que el
ledger nombra existen aunque nadie se acuerde de haberlos hecho.

## Lo que el método NO cede

**El orden lo sigue decidiendo qué no se puede agregar después.** `metodo/frentes.md` es
claro: la unidad de pertenencia va primero y la invariante suprema se hace imposible en el
mismo frente donde nacen los datos que podrían violarla, nunca en uno posterior.
`writing-plans` ordena por dependencia técnica, que es otra cosa. Cuando choquen, manda
`frentes.md`.

**TDD rojo-verde sí, pero la prueba se deriva de la §9 de la especificación.** Superpowers
exige ver la prueba fallar antes de implementar, y eso se toma tal cual. Lo que no se toma
es inventar el caso: `AGENTS.md` §7 pide que toda regla tenga al menos un caso de
verificación **con el resultado calculado a mano**, nunca con lo que devolvió una
implementación. El caso existe antes que la prueba.

**Las 12 decisiones abiertas bloquean de verdad.** La guía §13 lo llama por su nombre:
*«paralelizar antes de decidir»*, y el síntoma es varios agentes construyendo
interpretaciones distintas de una regla abierta. Una tarea con una decisión de negocio
adentro no pasa de `candidato`, por muy lista que se vea.

**El español no se negocia.** `AGENTS.md` §3 pide español de Colombia. Los comandos nuevos
y los artefactos de `construccion/` se escriben en español; los nombres de las skills de
Superpowers quedan en inglés porque son las suyas y renombrarlas sería inventar una capa de
traducción que nadie mantiene. Tampoco chocan: los diez comandos del harness están todos en
español.

## Lo que no se toma

**`brainstorming` no reemplaza a `/descubrir`.** Hace preguntas buenas, pero no produce
códigos rastreables, no distingue una invariante de una cualidad, y no tiene dónde poner un
vacío. El [ADR 0002](0002-codigos-en-vez-de-historias.md) ya explicó por qué eso importa.

**El sitio por defecto de los planes se cambia.** `writing-plans` los guarda en
`docs/superpowers/plans/`; aquí van en `construccion/planes/`, que es lo que pide la guía
§4. La propia skill lo permite: *«User preferences for plan location override this default»*.

**«Do not pause to check in with your human partner between tasks» se acota.** Dentro de un
plan aprobado, correcto: el orquestador falla y sigue. Pero `AGENTS.md` §6 lista cuatro
cosas que no se resuelven solas —una decisión de negocio que la especificación no responde,
una contradicción entre dos cosas que la persona dijo, una invariante que estorba, una
especificación sin invariantes—. Ante cualquiera de esas, **se para y se pregunta**, aunque
el plan siga teniendo tareas.

## Sobre versionar la especificación

El [ADR 0010](0010-las-fronteras-de-integracion.md) dice que `negocio/` no se commitea
porque lleva documentos marcados `Información Reservada`. **Aquí sí se commitea, y la razón
es que no es el mismo caso.** El paquete de `negocio/especificacion-v0-2026-09-13/` es
trabajo propio —su `LEEME.md` dice *«propuesta nuestra, sin acordar»*— y no tiene ninguna
marca de clasificación. `negocio/insumos/` sigue fuera de git para cuando lleguen documentos
que sí la tengan.

## Consecuencias

**Lo bueno.** Las §8 a §12 de `AGENTS.md` dejan de estar vacías, y la pregunta *«¿quién
integra esto?»* tiene una respuesta escrita antes de que haya dos agentes trabajando. El
método gana una capa de ejecución probada sin perder su trazabilidad hasta la evidencia del
descubrimiento.

**Lo malo, y es real.** Son **dos vocabularios sobre el mismo trabajo**: un «frente» del
harness y un «plan» de Superpowers no son lo mismo, un «paso» y una «tarea» tampoco, y
`metodo/palabras.md` ahora se queda corto. Quien llegue nuevo va a tener que aprender los
dos. La tentación va a ser fusionarlos, y fusionarlos rompería la trazabilidad de los
códigos en un lado o el ledger de recuperación en el otro.

**Lo segundo malo.** El ledger de SDD y `construccion/progreso/` **pueden desincronizarse**,
y el día que pase nadie lo va a notar hasta que se re-despache una tarea ya hecha —que es
exactamente el fallo que Superpowers llama «el más caro observado»—. Por eso el desempate
está escrito arriba y por eso `construccion/progreso/` se deriva en vez de escribirse.

**Lo que queda sin resolver.** El punto ciego del [ADR 0010](0010-las-fronteras-de-integracion.md)
sigue abierto y esta capa no lo cierra: **no se sabe cómo validar con personas un cálculo
que no se ve en una pantalla.** Aquí eso son las reglas `R1` y `R2` del BI —no sumar
subtotales solapados, y los aportes sin ubicación que cuentan en el total pero no en el
denominador municipal—. TDD las prueba contra casos escritos a mano; **que los casos
escritos a mano sean los correctos no lo prueba nadie todavía.**
