---
description: Pasa el MVP por gente que no lo construyó. Crea las personas si no existen.
argument-hint: [pantalla o frente]
---

Vas a validar una parte del MVP con las personas validadoras.

Lee `metodo/validacion.md` y `plantillas/persona.md`.

## Dos cosas que te hacen parar

**Si no hay personas, no las inventes solo.** Pero tampoco arranques de cero: **los
candidatos ya están en la §3 de `negocio/lectura-documental.md`**, con de dónde salió cada
uno, la pregunta con la que llega y qué le duele. Los que están marcados como deducidos son
hipótesis: confírmalos antes de escribirlos como persona.

Lo que te falta pedirle al analista es la vida: edad, ciudad, contexto, desde qué aparato
entra, qué le molesta. Y sobre todo **la pregunta con la que abre la aplicación**, si la §3 no
la trae. Una persona sin pregunta produce una lista de mejoras genéricas y no sirve para nada.

**Si la cuenta demo está vacía, para.** Un demo sin historia enseña estados vacíos y nada
más; las contradicciones solo aparecen cuando hay datos detrás. Di exactamente qué le falta
y sugiere volver a `/frente`.

## La corrida

- Corre cada persona **por separado**. Que no vean lo que encontraron las otras: la
  independencia es lo que hace que encuentren cosas distintas.
- Cada persona reconstruye la pantalla desde el código y **consulta los datos de verdad**.
  No opina sobre un dibujo.
- Después, cada hallazgo pasa por el abogado del diablo, cuyo trabajo es refutarlo.

Las tres reglas del juego:

- Un hallazgo sin caso concreto no es un hallazgo.
- Nada se arregla durante la revisión.
- Lo que ya está en `vacios.md` cuenta como revisado, no como hallazgo.

## Cada persona hace dos cosas, no una

**Encuentra hallazgos**, que es lo de siempre. Y **pregunta**, que es lo que casi nunca se
aprovecha y suele valer más.

Un hallazgo dice *"esto está mal"*. Una pregunta dice *"esto no sé qué es"*, y esa es la
señal de que falta una regla, no de que sobre un botón. Cuando una persona abre una pantalla
con su pregunta en la cabeza y no encuentra la respuesta, **eso no siempre se arregla en la
pantalla: muchas veces se arregla en la especificación.**

Las preguntas no pasan por el abogado del diablo —no hay nada que refutar en una pregunta— y
van a `negocio/vacios.md` §2 como `Q`, o a un pliego con `/preguntar` si hay que preguntárselas
a alguien de afuera.

## Comprueba las brechas, no solo la pantalla

Antes de cerrar la corrida, recorre **lo que estaba abierto** —las `Q` de `vacios.md` y las
preguntas de la lectura documental que este frente debía cerrar— y por cada una di una de
tres cosas:

- **Cubierta**, con dónde se ve en la pantalla.
- **No cubierta**, y por qué: se construyó otra cosa, o se construyó y no alcanza.
- **Ya no aplica**, con la razón.

**Una brecha que nadie marca se cierra sola en la cabeza de la gente**, y tres frentes después
nadie se acuerda de que quedó abierta. Esta lista es lo que impide eso, y es barata: son cinco
minutos al final de la corrida.

## Y revisa la lista de frentes

La §10 de la especificación se escribió el día en que menos se sabía: sin nada construido y
sin nada mostrado. Acabas de mirar el producto andando con gente — **es el único momento en
que esa lista se puede corregir con algo más que intuición.**

Tres preguntas, un minuto:

- **¿El siguiente sigue siendo el siguiente?** Entre los frentes que ya pueden existir,
  decide lo que se acaba de aprender. La dependencia sigue mandando: lo que no puede existir
  todavía, no se adelanta.
- **¿Apareció uno que no estaba?** Una pregunta de una persona validadora puede ser una
  funcionalidad entera. Se agrega **al final**, con su porqué.
- **¿Se cayó alguno?** Se marca `caído` con la razón. **No se borra.**

Y si cambia algo, **se dice por qué debajo de la tabla**. Una lista que se reordena en
silencio es una lista en la que nadie puede confiar.

Lo único que no se toca: la unidad de pertenencia y la invariante suprema. Esas van donde
van y no dependen de lo que se aprenda mirando.

## Cuándo devolver a la especificación

Un hallazgo que sobrevive puede querer decir dos cosas muy distintas:

- **La pantalla no dice bien lo que la regla decidió.** Se arregla la pantalla, y el hallazgo
  queda en una prueba o en un chequeo. Es el caso normal.
- **La regla no existe, o dice otra cosa de la que el negocio necesita.** Eso no se arregla
  mirando: **se vuelve a `/especificar`**, se corrige la §5, y después se vuelve a mirar.

Distinguirlas es tuyo y hay que decirlo en voz alta. La prueba: **si el arreglo cambia lo que
el negocio permite, es especificación; si solo cambia cómo se ve, es pantalla.**

Volver a especificar no es un fracaso de la validación: es para lo que existe. Y la vuelta
—especificar, construir, registrar, validar— se puede dar las veces que haga falta. **No es
obligatorio darla**: un frente que se validó sin brechas sigue derecho.

## Qué entregas

- La corrida en `negocio/revision.md`: cuántos hallazgos en bruto y cuántos quedaron en pie.
- Por cada hallazgo que sobrevivió, **dónde queda para que no se repita**: una prueba, un
  chequeo, o una regla escrita con el hallazgo pegado al lado. Un hallazgo que no queda en
  ninguno de los tres se vuelve a cometer.
- **Las preguntas que hicieron las personas**, y a dónde fueron: `vacios.md` §2 o un pliego.
- **La tabla de brechas**: cubierta, no cubierta, o ya no aplica. Con su porqué.
- **Si hay que volver a especificar, dilo con las reglas que hay que tocar.** Y si no hay que
  volver, dilo también: es una respuesta perfectamente buena y es la que se espera.
- **Cómo quedó la lista de frentes**: qué sigue, qué se agregó, qué se cayó y por qué. Si no
  cambió nada, dilo en una línea — que no cambie también es información.
- La línea **"si solo se pudiera hacer una"**.

Cuando una recomendación de experiencia choque con una regla del negocio, **manda el
negocio — y escribe por qué**.
