# Mostrar el MVP

Cómo se le enseña a la persona lo que se construyó, y qué se observa mientras lo usa.

> ➤ **Este documento reemplaza a uno de salida a producción, y esa ausencia es a propósito.**
> El MVP es el instrumento de descubrimiento, no el producto: no se lanza, no se le entregan
> usuarios reales y no se le pone un dominio bonito. Lo que sale de aquí es el requerimiento
> formal, no el sistema. Ver `decisiones/0001-el-mvp-es-instrumento-no-producto.md`.

## Antes de la sesión

- [ ] La cuenta demo tiene historia suficiente para que las pantallas no se vean vacías.
- [ ] Está claro **qué se quiere descubrir en esta sesión**. Una sesión sin pregunta produce
      una demostración; una con pregunta produce información.
- [ ] Alguien va a tomar notas que no sea quien maneja la pantalla.

## Durante

**Que maneje la persona, no tú.** Es la regla que más cuesta y la que más da. En el momento
en que tú manejas, la sesión se vuelve una demostración de lo que construimos en vez de una
observación de lo que la persona hace.

**No expliques antes.** Si hay que explicar cómo se usa una pantalla, eso ya es el hallazgo.
Anótalo y sigue.

**Cuando se trabe, pregunta qué esperaba**, no le muestres dónde estaba el botón. Lo que
esperaba es el dato; dónde estaba el botón ya lo sabemos.

**Anota las frases textuales.** "Y esto de aquí es lo que ya pagué o lo que me falta?" vale
más que "confusión con la etiqueta de saldo".

## Qué se observa

| Qué mirar | Por qué importa |
|---|---|
| Dónde se detiene antes de tocar algo | Ahí la pantalla no dice qué hacer |
| Qué palabra repite que no es nuestra | Es la palabra que debería estar en la pantalla |
| Qué dato busca y no encuentra | Es un requerimiento que no salió en la entrevista |
| Qué hace que no habíamos previsto | Es el recorrido real, y el que escribimos estaba mal |
| Qué le da miedo tocar | Ahí falta decir qué va a pasar antes de que pase |

## Después

- [ ] Las frases textuales, a `negocio/notas-de-descubrimiento.md`.
- [ ] Lo que resultó ser regla, a la especificación.
- [ ] Lo que quedó sin decidir, a `vacios.md` con **cuándo se vuelve urgente**.
- [ ] Lo que ya se puede bajar a requerimiento formal: `/entregar`.

> ➤ Ese último punto es el que se pospone siempre. Si un módulo ya se mostró y la persona lo
> entendió, está listo para entregarse — esperar a que "todo esté completo" es como no
> entregar nunca.
