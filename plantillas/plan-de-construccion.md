# Plan de construcción — <módulo>

> ➤ Esta plantilla es **delgada a propósito**. El cuerpo del plan lo escribe
> `superpowers:writing-plans`, que ya sabe descomponer en tareas de 2 a 5 minutos con TDD
> rojo-verde y sin marcadores de relleno. Lo que esta plantilla agrega son las tres cosas
> que esa skill no puede saber porque son de este método.
>
> Se guarda en `construccion/planes/AAAA-MM-DD-<resultado>.md`. **No** en
> `docs/superpowers/plans/`, que es el sitio por defecto de la skill: el ADR 0011 lo cambia
> y la propia skill lo permite (*«User preferences for plan location override this default»*).

## Lo que este método agrega al encabezado

**1 · `Spec:` apunta al módulo entregable, no a la especificación.**

```
**Spec:** ../../entregable/modulos/MNN-<nombre>.md  (versión N)
```

El módulo es la autoridad (ADR 0011, nivel 2 de la cadena). La especificación es el nivel 3:
manda menos. Si el plan cita la especificación en vez del módulo, está argumentando desde la
fuente equivocada y va a arrastrar códigos que el módulo no recortó.

**2 · Las `Global Constraints` llevan los códigos, textuales.**

Ahí van las invariantes `I` del módulo copiadas **literalmente**, no parafraseadas, más las
cualidades `C` y los principios `P` que apliquen a todo el plan. Cada tarea las hereda sin
repetirlas. Una invariante parafraseada es una invariante distinta.

**3 · Cada tarea del plan tiene su contrato en `construccion/tareas/`.**

El plan dice qué hacer; el contrato (`plantillas/tarea.md`) es lo que recibe el agente
constructor, y es el que declara la **superficie asignada** que `scripts/paralelismo.sh`
necesita para saber si dos tareas se pisan. Un plan sin contratos no se puede despachar.

## La compuerta antes de despachar

> ➤ Estas cinco son de `metodo/construccion-solida-y-paralela.md` §8, etapa 2. Ninguna se
> marca «a ojo».

- [ ] **Ningún código del módulo quedó sin tarea.** Lo comprueba `scripts/construccion.sh`.
- [ ] **Ninguna tarea carece de fuente, prueba o dependencia explícita.**
- [ ] El grafo de dependencias está construido y la ruta crítica identificada.
- [ ] Los grupos paralelos pasan la matriz de `scripts/paralelismo.sh`.
- [ ] **Ninguna tarea contiene una decisión de negocio abierta.** Si la tiene, se queda en
      `candidato` y la pregunta va a `negocio/vacios.md` como `Q`, con qué bloquea.

## El orden no lo decide la dependencia técnica sola

> ➤ Esta es la parte donde `writing-plans` y este método pueden chocar, y hay que saber
> quién gana.

`metodo/frentes.md` manda sobre el orden:

- **La unidad de pertenencia va primero.** Es lo único que de verdad no se puede agregar
  después: no es una restricción sobre una tabla, es una columna en **todas** y una
  condición en cada consulta que alguien escriba desde ese momento.
- **La invariante suprema se hace imposible en el mismo frente donde nacen los datos que
  podrían violarla.** Nunca en uno posterior, y desde el primer día de ese frente — no se
  construye el comportamiento y después se le agrega la restricción.

Si `writing-plans` propone un orden que rompe alguna de las dos, **gana `frentes.md`**.
