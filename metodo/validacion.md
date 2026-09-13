# Validar con personas

Gente que no construyó el sistema y lo mira por nosotros. Viven en `.claude/agents/` y se
invocan por nombre.

**No son un adorno.** En el proyecto donde nació este método, las nueve reglas de interfaz
salieron de estas revisiones — y ocho de ellas con todos los chequeos automáticos en verde.
Ningún test iba a encontrarlas, porque todas requerían mirar un número y saber que estaba
mal.

## Por qué encuentran lo que encuentran

Tres condiciones, y las tres importan:

**1 · Corren contra una cuenta llena, no contra un formulario vacío.** Una cuenta recién
creada enseña los estados vacíos y poco más. Las contradicciones aparecen cuando hay meses
de historia detrás. Por eso cada frente deja rastro en la cuenta demo.

**2 · Reconstruyen la pantalla desde el código y consultan los datos de verdad.** No opinan
sobre un dibujo: leen qué cifra sale en qué renglón y la verifican contra la base.

**3 · Tienen una vida y una pregunta.** No evalúan "usabilidad": llegan con *"¿alcanzo a
coger la cancha el domingo?"* y reportan dónde se trabaron. **Un revisor sin pregunta
produce una lista de mejoras genéricas; uno con pregunta produce el renglón exacto que
estorba.**

## Hacen dos cosas, no una

**Encuentran hallazgos**, que es lo que todo el mundo espera. Y **preguntan**, que es lo que
casi nadie aprovecha y suele valer más.

Un hallazgo dice *"esto está mal"* y se arregla en la pantalla. Una pregunta dice *"esto no sé
qué es"*, y eso casi nunca se arregla en la pantalla: se arregla en la especificación, porque
lo que falta es una regla. Por eso la validación devuelve a la etapa 2 y no solo a la 3.

Y de ahí sale la tercera cosa que hacen, que es la más barata y la que más se olvida:
**comprueban si las brechas que estaban abiertas quedaron cubiertas.** Se recorre lo que
estaba en `vacios.md` §2 y se marca cubierta, no cubierta, o ya no aplica. Una brecha que
nadie marca se cierra sola en la cabeza de la gente, y tres frentes después nadie se acuerda
de que quedó abierta.

## Cuáles hacen falta

Dos o tres, no más, y con preguntas distintas sobre la misma pantalla:

- **Quien lo usa todos los días**, rápido y sin saber del tema. Juzga si se entiende.
- **Quien audita**, una vez al mes y con calma. Juzga si los números se sostienen y si
  alguien puede reproducirlos.
- **Quien decide**, si el negocio tiene a alguien que aprueba o rechaza. Juzga si tiene con
  qué decidir.

Se escriben con [plantillas/persona.md](../plantillas/persona.md), y **la vida se la pones
tú**: edad, ciudad, contexto, desde qué aparato entra y con qué pregunta llega. Una persona
genérica no encuentra nada.

**No se arranca de cero.** Si hubo documentos, los candidatos ya están en la §3 de la lectura
documental, con de dónde salió cada uno y qué le duele. Los que quedaron marcados como
deducidos son hipótesis: se confirman antes de escribirlos como persona.

Aparte van los revisores de oficio —el escribano y el abogado del diablo— que sí vienen
hechos porque su trabajo no depende del negocio.

## Cuándo correrlas

- **Al cerrar un frente.** Que todo esté en verde no dice nada sobre si se entiende.
- **Cuando una pantalla cambia de forma**, no cuando cambia de contenido.
- **Antes de dar por buena una pantalla nueva.** Es más barato que descubrirlo tres semanas
  después.

No hace falta correrlas todas siempre.

## Qué hacer con lo que dicen

**No se aplica en bloque.** Se lee, se discute y se decide. Cuando una recomendación de
experiencia choca con una regla del negocio, **manda el negocio — y se dice por qué**.

En el proyecto original una diseñadora propuso registrar un ingreso ficticio para que el mes
cuadrara. Se rechazó: le enseña a la persona que el número se arregla mintiéndole. La
propuesta era buena de experiencia y mala de dominio, y esa tensión se resuelve
explicándola, no ignorándola.

## Cómo un hallazgo deja de repetirse

En este orden de preferencia:

1. **Una prueba**, si se puede expresar como una afirmación sobre los datos.
2. **Un chequeo automático**, si es una regla sobre la forma del código.
3. **Una regla escrita, con el hallazgo pegado al lado.** La regla sin el caso se olvida o
   se racionaliza; con el caso concreto al lado, es más difícil convencerse de que "en este
   caso no aplica".

Lo tercero es el mínimo. **Un hallazgo que no queda en ninguno de los tres se vuelve a
cometer.**
