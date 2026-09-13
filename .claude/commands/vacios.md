---
description: Registra lo que la construcción reveló, y devuelve a la especificación lo que resultó ser regla.
---

Vas a actualizar el registro de vacíos. **Es la etapa que hace que este método sea distinto
de una cascada con más pasos.**

Lee `plantillas/vacios.md`, `metodo/lo-que-destapa-construir.md` y
`negocio/especificacion.md`.

**Clasifica cada vacío por la forma de pregunta que lo produjo** (`[A1]`, `[D2]`, `[F1]`…).
No es burocracia: es lo que permite ver que la misma pregunta lleva tres frentes apareciendo
sobre cosas distintas, y anticiparla en el cuarto. Si alguno no encaja en ninguna forma del
catálogo, dilo — puede ser una forma nueva, y esas vuelven a la plantilla (`metodo/cosecha.md`).

## Por cada cosa que se decidió construyendo

Tres preguntas, en este orden:

1. **¿Qué vacío había?** La pregunta que la especificación no respondía.
2. **¿Qué se decidió?** Con el porqué, no solo el qué.
3. **¿Dónde queda verificable?** Un archivo, una función, una pantalla, un ADR. **Nunca
   "se conversó" ni "quedó acordado".** Si no hay dónde, la decisión todavía no existe.

## Por cada cosa que quedó abierta

Va a la lista 2, numerada con `Q` —de pregunta— y no con `P`, que ya son los principios.
La recomendación **siempre dice cuándo se vuelve urgente**. Una
recomendación sin momento no se ejecuta nunca: se queda en la lista y en seis meses ya era
tarde.

## Lo que casi nadie hace y es la mitad del valor

**Devuelve a la especificación lo que resultó ser regla.** Si un vacío decidido cambia cómo
se comporta el negocio, no se queda en `vacios.md`: sube a la §5 como regla, con su código,
y en `vacios.md` queda el rastro de dónde salió.

Sin este paso, la especificación envejece mientras el sistema aprende, y al final el
entregable describe algo que nadie construyó.

## Corrige lo falso

Si una entrada vieja resultó equivocada, **no se borra**: se reescribe diciendo que era
falsa y por qué. Un registro que se corrige a sí mismo es el que se sigue leyendo.

## Qué entregas

- Lo decidido, con su dónde.
- Lo abierto, **ordenado por cuándo se vuelve urgente**.
- Lo que subió a la especificación.
- Qué datos siguen faltando y a quién hay que pedírselos.
