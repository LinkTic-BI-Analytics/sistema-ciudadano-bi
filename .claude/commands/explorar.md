---
description: Qué se puede construir con lo que hay cargado, medido antes de opinar.
---

Vas a decir qué se puede construir con lo que hay cargado. **Se corre después de `/leer` y
antes de `/descubrir`.**

## Por qué existe esta etapa

Porque el ciclo saltaba de leer a entrevistar, y **la entrevista necesita a la persona que
tiene el dominio en la cabeza, disponible, ahora.** Eso casi nunca pasa. Lo que sí pasa es
que alguien llega con documentos cargados y quiere avanzar.

Y hay una razón de fondo, que es la que sostiene todo el método: **es muy poco probable
tener toda la claridad antes de empezar.** Esperar a tenerla es esperar para siempre. Se
arranca por donde más se sabe, se construye algo que se pueda mirar, y lo que falte se
destapa mirándolo.

## Mide antes de opinar

```
./scripts/densidad.sh
```

Cuenta, por región de cada documento, cuántas palabras hay y cuántos epígrafes. **Las dos
columnas dicen cosas distintas y hay que leer las dos:** muchas palabras y pocos epígrafes es
una explicación; muchos epígrafes y pocas palabras es un índice sin cuerpo.

**No arranques por tu impresión de qué es más importante.** La impresión favorece lo que
suena interesante; el conteo favorece lo que está escrito, que es lo único que se puede
construir sin inventar.

## Inventaría las fronteras antes de proponer nada

```
plantillas/fronteras.md  →  negocio/fronteras.md
```

**Cada punto donde el sistema depende de algo que no controla.** El diagrama de arquitectura
del cliente suele traerlas todas: es la página más informativa de cualquier documento técnico
y casi nadie la mira.

Tres preguntas por frontera, y ninguna suele estar en el documento:

| | |
|---|---|
| **¿De quién es el dato?** | Decide quién lo puede corregir cuando esté mal |
| **¿Qué disponibilidad hay de verdad?** | La real, no la del contrato. Si nadie la midió, se dice |
| **¿Qué pasa cuando no responde?** | **El hueco grande.** No vale "se muestra un error" |

Y dos marcas: **gobernabilidad** —controlable si es del mismo cliente, no controlable si es
del Estado o de un tercero, y ahí el plan B es obligatorio— y **nivel de mock**, del 1 al 3
según si solo se sabe el nombre, los tipos de dato, o hay contrato de verdad.

**El nivel de mock se muestra en la pantalla del MVP.** Alguien valida distinto un dato
inventado que un dato contractual, y si no se le dice, los valida igual.

**Y se pregunta temprano si existe ambiente de pruebas de cada frontera.** Lo que no lo tenga
se simula, y eso queda escrito como **no validado** — no como construido.

Detrás está `decisiones/0010-las-fronteras-de-integracion.md`.

## Cruza tres cosas, no una

La densidad sola no alcanza. Para cada módulo candidato:

| | |
|---|---|
| **Cuánto hay escrito** | De `densidad.sh` y de la §0 de la lectura |
| **Qué lo bloquea** | De la §9 de la lectura: qué preguntas hay que responder antes |
| **Qué se puede construir sin eso** | La mitad que no depende del dato que falta |

Lo tercero es lo que la gente se salta, y es lo que convierte "está bloqueado" en "está
bloqueada una parte". Vale la misma regla de `metodo/frentes.md`: **casi ningún frente está
bloqueado entero.**

## Qué entregas

`negocio/que-podemos-construir.md`, y adentro:

1. **Lo que está cargado**, con su marca de clasificación.
2. **Dónde está la información, medida.** La tabla de `densidad.sh` cruzada con los módulos.
3. **Qué haría falta para arrancar cada uno**, con qué se puede construir sin eso.
4. **Dos o tres opciones**, no una lista de siete. Cada una con **qué enseña**, que es lo que
   importa en algo que se va a tirar.
5. **Cuál propondrías y por qué** — y decir que no es mandatorio.

## Las tres cosas que no se hacen

**No escojas por tamaño.** El módulo más grande no es el que más enseña. Se escoge por **qué
tan rápido se le puede poner enfrente a alguien que haga el trabajo de verdad**.

**No escondas lo que se escogería sobre una inferencia.** Si un módulo candidato no sale de
los documentos del cliente sino del análisis de alguien, dilo con esas palabras. Construir
sobre una inferencia se puede —a veces es lo único que hay— pero se decide sabiéndolo.

**No propongas lo que no tiene con qué.** El hueco más grande es siempre el más tentador, y
es justo donde no hay nada escrito. Construirlo hoy es inventarlo, y lo inventado por
nosotros no lo reconoce nadie después. Di qué haría falta para que deje de estar vacío —casi
siempre es media hora mirando a alguien trabajar.

## Y termina preguntando, no concluyendo

La última línea es una pregunta con opciones, no un veredicto:

> *"Del que más información tenemos es este. ¿Arrancamos por ahí, o prefieres otro y
> exploramos?"*

**La decisión es del analista.** Esta etapa le da con qué decidir; no decide por él.

Cuando escoja, el siguiente paso es `/descubrir` si hay persona con quien hablar, o
`/preguntar` si no la hay. Y si escogió un módulo del que ya existen historias escritas en
otra parte —un tablero, un Azure, un Jira— **pídelas antes de construir**: dieciséis historias
aceptadas valen más que veinte mil palabras de descripción de pantalla.
