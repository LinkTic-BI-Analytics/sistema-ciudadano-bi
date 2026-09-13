# Fase 1 — descubrir un requerimiento construyéndolo

Una plantilla para sacar de la cabeza de alguien lo que quiere construir, volverlo un
sistema que se pueda ver y tocar, y de ahí sacar un requerimiento formal que un equipo de
desarrollo pueda implementar en la tecnología que use.

**Esto es un paso previo al desarrollo, no el desarrollo.** Lo que se construye aquí es un
instrumento para descubrir; el producto se construye después, con el documento que sale de
aquí.

> **Este repositorio es la línea base.** Es lo que se clona para cada negocio nuevo, y aquí
> solo entra lo que ya se probó usando el método de verdad. Los ensayos van en
> [`Req-Fase1`](https://github.com/inventr/Req-Fase1) — la arena, que se ensucia a
> propósito. Cómo viaja un ajuste de una a otra: [ADR 0007](decisiones/0007-la-arena-y-la-linea-base.md).

## El problema que resuelve

El orden normal es: alguien escribe el requerimiento, y después alguien lo construye. Falla
siempre por lo mismo — **la mitad de las preguntas no se pueden hacer en una reunión**,
porque nadie sabe que son preguntas hasta que hay que decidirlas para poder escribir el
código.

*"¿Qué pasa si cancela después del jueves?"* no se le ocurre a nadie en una entrevista. Se
le ocurre a quien está construyendo la pantalla de cancelar, y solo cuando ya la está
construyendo.

Este método invierte el orden:

```
   entrevista ──▶ especificación v0 ──▶ construir un frente
                       ▲                       │
                       │                       ├──▶ lo que construir OBLIGÓ a decidir
                       │                       │    → vacios.md
                       └───────────────────────┤
                                               └──▶ lo que la gente vio y no entendió
                                                    → las personas validadoras

   ...y cuando un módulo ya está claro:  ──▶  entregable/  ──▶  equipo de desarrollo
```

La especificación no se escribe una vez: se escribe rápido, se rompe construyendo, y se
corrige con lo que la construcción reveló. Y lo que revela no es aleatorio: son unas veinte
formas de pregunta que aparecen en todo negocio, catalogadas en
[`metodo/lo-que-destapa-construir.md`](metodo/lo-que-destapa-construir.md). Lo que sale al final vale más que cualquier
documento escrito antes de tocar nada, y trae algo que ese documento no puede traer:
**evidencia de que alguien lo usó**.

## Cómo empezar

Lee **[PUESTA-EN-MARCHA.md](PUESTA-EN-MARCHA.md)**. Está organizado por quién puede hacer
cada paso, y es lo único que hay que leer para arrancar.

## Qué hay aquí

| Carpeta | Qué es | ¿Se toca? |
|---|---|---|
| [`metodo/`](metodo/) | Cómo se descubre un negocio. Sirve para cualquiera. Empieza por [`palabras.md`](metodo/palabras.md) si algo no se entiende | **No.** Se lee |
| [`plantillas/`](plantillas/) | La forma en blanco de cada documento, con sus instrucciones adentro | No. Se copian |
| [`negocio/`](negocio/) | **Aquí escribes tu negocio.** Arranca vacío; en [`insumos/`](negocio/insumos/) van los documentos que traiga el cliente | Sí. Es tu trabajo |
| [`entregable/`](entregable/) | Lo único que sale del edificio: los módulos para el equipo de desarrollo | Sí, con `/entregar` |
| [`ejemplo/`](ejemplo/) | Un negocio completo y terminado, para comparar contra el tuyo | No. Se borra cuando estorbe |
| [`decisiones/`](decisiones/) | Por qué el método está hecho así | No. Se lee cuando algo parece raro |
| [`harness/`](harness/) | Lo técnico reusable | Llega con el stack |
| [`scripts/`](scripts/) | Lo que se corre: hoy, la preparación de los documentos del cliente | No. Se corre |

Los comandos viven en `.claude/commands/`. Se escriben con `/` y son el proceso completo:

```
/leer        lee los documentos que trajo el cliente (si los hay)
/descubrir   la entrevista, con la persona presente
/preguntar   un pliego para que alguien lo conteste solo, cuando no hay hora en vivo
/especificar la especificación v0 con sus códigos
/frente      construir una etapa del MVP
/vacios      registrar lo que la construcción reveló
/validar     pasar el MVP por gente que no lo construyó
/entregar    bajar un módulo a requerimiento formal
/donde-voy   dónde vas, qué te bloquea, qué se está pudriendo
```

Si no sabes cuál sigue, escribe `/donde-voy`.

## La regla de partición

Sirve para saber dónde va cualquier archivo nuevo:

> Si borrar este negocio lo dejaría sin sentido, va en `negocio/`.
> Si serviría igual para descubrir otro negocio, va en `metodo/` o `plantillas/`.
> Si es lo que recibe el equipo de desarrollo, va en `entregable/`.

## Estado

El método, las plantillas, los comandos y el ejemplo están escritos. **Falta el stack** —
Next 15, Supabase y Vercel, con sus reglas y sus chequeos — que llega en la siguiente
pasada. Está decidido y no se discute por proyecto: es el mismo del proyecto donde nació el
método, con versiones exactas en el [ADR 0006](decisiones/0006-stack-fijo.md).
Ver [PUESTA-EN-MARCHA.md §5](PUESTA-EN-MARCHA.md).

Salió de un MVP de finanzas del hogar ya terminado, donde este método se usó por primera
vez sin llamarse método. La prueba de que sirve está en ese proyecto: 136 huecos que
ninguna entrevista habría destapado, cada uno con la decisión que se tomó.
