---
description: Lee los documentos que trajo el cliente y produce la lectura documental con las preguntas para la entrevista.
argument-hint: [opcional: un documento en particular]
---

Vas a leer los documentos del cliente. **Se corre antes de `/descubrir`**, cuando hay
material; si no hay, se salta.

## Antes de leer

Lee `plantillas/lectura-documental.md` (la forma) y `metodo/entrevista.md` (para saber qué
preguntas hacen falta). **Lee la forma de la plantilla, no de tu memoria.**

Mira qué hay en `negocio/insumos/`. Si está vacío, dilo y sugiere `/descubrir` directamente:
no hace falta tener documentos para arrancar.

## Prepara los documentos antes de leerlos

```
./scripts/leer-insumos.sh
```

Extrae el texto conservando las tablas, separa las figuras de los membretes, y le pasa OCR
a lo que venga escaneado. **Corre local: no manda nada a ninguna parte.** Deja todo en
`negocio/insumos/.extraido/` y te dice, por documento, cuántas páginas no tenían texto y
qué marca de clasificación trae.

**No leas los PDF a mano si el script puede hacerlo.** Un PDF fotografiado no tiene una sola
letra que extraer, y leerlo página por página como imagen cuesta veinte veces más.

**Mira las figuras.** Están en `.extraido/figuras/` y llevan el número de página en el
nombre. Un diagrama de arquitectura o un mapa de módulos no aparece en el texto, y suele
ser la página más informativa del documento.

## Lo que no se hace sin permiso escrito

Existe `--motor mistral`, que lee tablas mejor porque manda los documentos a un servidor de
otra empresa. **No lo propongas de entrada y no lo corras por tu cuenta.**

- Los documentos del cliente vienen marcados —`Información Reservada`, `Clasificada`— y esa
  marca es del cliente, no nuestra.
- El script se niega solo si no hay autorización escrita en
  `negocio/autorizacion-de-salida.md`, pero **que exista una compuerta no es permiso para
  empujarla**.
- Si crees que un documento se leería mucho mejor afuera, dilo con el nombre del documento y
  qué se ganaría, y **espera**. Autorizar es del analista, y a veces ni siquiera de él: es
  una decisión de contrato.

## La regla que gobierna todo este comando

**Lo que dice un documento es una afirmación de quien lo escribió, no un hecho sobre el
negocio.**

Y hay dos clases de documento, que se leen distinto. **Decide cuál tienes antes de escribir
nada:**

- **El que DESCRIBE** algo que ya opera — un reglamento, un manual, la especificación de un
  sistema en producción. Describe el proceso como fue diseñado y casi nunca como funciona, y
  esa distancia es la materia prima.
- **El que PROPONE** algo que no existe — una idea de producto, una propuesta, un
  anteproyecto. No hay práctica que lo desmienta, y eso no lo hace más cierto: lo hace menos
  comprobable. **Todo lo que dice es una intención, incluido lo que suena decidido** — los
  modelos de datos, los topes de caracteres, las listas de "ideas". Dilo en la §2 para que
  nadie lo lea como evidencia.

**Si propone, busca el sustituto.** Nadie llega con una idea sin haber intentado resolverlo de
alguna forma, y ese apaño aparece de pasada —en media línea— y es lo único con peso de
evidencia en todo el documento. Si no hay ninguno, **detente y dilo**: que nadie lo resuelva de
ninguna forma es la señal más clara de que se está por construir algo que nadie pidió.

De ahí salen tres prohibiciones:

- **No escribas `dominio.md` ni `especificacion.md`.** Este comando produce un solo archivo:
  `negocio/lectura-documental.md`. Quien lea un dominio sacado de documentos va a creer que
  ya sabe cómo funciona el negocio, y va a la entrevista a confirmar en vez de a descubrir.
- **No resuelvas las contradicciones.** Muéstralas. Cuál documento manda es una decisión del
  negocio, y preguntarla suele destapar que no manda ninguno: manda la costumbre.
- **No rellenes lo que falta.** Un proceso que el documento no menciona no es un proceso que
  no existe: es uno que nadie escribió. Va a la lista de preguntas.

## Qué buscas, y qué no

**Buscas qué tiene que hacer el sistema y quién lo va a usar. Nada más.**

Los documentos de un cliente vienen mezclados: pliegos, ofertas, convenios. Traen precios,
formas de pago, descuentos por incumplimiento, presupuestos. **Nada de eso va en este
archivo**, y no es un descuido: es la parte más fácil de leer, la que trae cifras exactas, y
la que se lleva la conversación. Se pasan dos horas discutiendo si el IVA está adentro o
afuera y nadie preguntó todavía qué no puede pasar nunca.

La regla para decidir: **si cambiando esa cifra el sistema se construye igual, no va.** El
precio se construye igual. El tope de una transacción, no.

Entran dos excepciones, una línea cada una: **los plazos que amarran el orden de
construcción** y **las obligaciones que se vuelven requerimiento** —una disponibilidad
exigida, una norma de obligatorio cumplimiento—.

Si encuentras algo comercial que de verdad importa —una contradicción de plata, un riesgo de
rechazo— **dilo al entregar, en voz alta, y di a quién le corresponde.** No lo metas en el
archivo y no lo dejes pasar callado.

## La prioridad es quién lo va a usar

**La §3 es la sección más importante de este archivo después de las preguntas**, y la que se
hace mal en todas partes: un requerimiento se puede escribir entero sin saber quién se
sienta delante de la pantalla, y así se escriben casi todos. Por eso salen sistemas que
cumplen el contrato y nadie soporta usar.

Los documentos nombran roles. Un rol no es una persona. Lo que hay que sacar es **con qué
pregunta llega cada uno a la aplicación y qué le duele hoy** — el rodeo concreto: la hoja de
cálculo aparte, la llamada, el dato que teclea dos veces.

- **Marca siempre lo deducido.** El dolor documentado es raro; el deducido es una apuesta, y
  un usuario que no aparece en ningún documento es una hipótesis, no un usuario.
- **Busca activamente a los que no aparecen**: quien recibe el resultado, quien arregla lo
  que sale mal, quien audita, quien administra. Los documentos normativos describen a quien
  opera el proceso y casi nunca a los demás — y los demás son los que sufren.
- **No escribas las personas validadoras todavía.** De aquí salen los candidatos; la vida se
  la pone el analista y las escribe `/validar`, que se niega a inventarlas solo.

## Al leer

- **Cita textual y de dónde salió.** Alguien va a discutir una regla y hay que poder mostrar
  el renglón.
- **Di qué no pudiste leer y por qué.** Un archivo ilegible que nadie menciona se convierte
  en una laguna que nadie sabe que existe.
- **Caza las palabras con dos sentidos** entre documentos distintos. Son candidatas a palabra
  prohibida, y encontrarlas aquí ahorra semanas.
- **Un formulario no es una entidad**: es una vista de varias. Un formato de "solicitud"
  suele traer adentro tres o cuatro cosas distintas.
- **Marca lo que parezca escrito y no cumplido.** Un plazo que nadie respeta, una aprobación
  que suena a trámite: esas son las mejores preguntas que vas a llevar.

## Lo que tienes que buscar activamente porque no va a estar

Recorre la §8 de la plantilla completa. Los documentos normativos no traen frecuencia, ni
quién lo hace de verdad, ni las excepciones, ni qué se hace cuando el proceso dice que no —
y un sistema necesita las cuatro.

## Y mira si vino la línea gráfica

Entre los documentos suele venir una guía de marca, un manual de identidad o un export de
tokens. **Si viene, dilo al entregar y déjala en `negocio/linea-grafica/`** — es una entrada
del proyecto, no material de lectura, y cambia cómo se construye desde el primer módulo.

Si no viene, **también se dice**, y se pide: *¿hay marca?* La razón no es cosmética — está
en `harness/interfaz.md` I5: si el instrumento se ve como un boceto gris, la gente comenta
el boceto en vez de comentar el flujo, y esa conversación no sirve para descubrir.

## Qué entregas

1. `negocio/lectura-documental.md` con sus diez secciones y ninguna línea `> ➤` adentro.
2. **La lista de preguntas de la §9**, que es la razón de existir del archivo. Ordenadas
   para preguntarlas en ese orden, cada una con su origen.
3. **Los usuarios probables de la §3**, cada uno con su pregunta y su dolor, y marcado cuál
   se dedujo. Son los candidatos a persona validadora.
4. **Una sola pregunta marcada como la que no se puede dejar de hacer.**
5. Si un documento resultó ser una fuente mejor de lo esperado —una hoja de cálculo con
   datos reales, un reporte con volúmenes— dilo: eso alimenta la cuenta demo después.

## Y termina orientando, en voz alta

Lo último que haces no es anunciar el archivo: es **decirle al analista dónde está parado**.
Es la §0, dicha en corto:

- **De qué se trata esto**, en un párrafo.
- **Qué línea dan los documentos** — y qué tan firme es. Un contrato firmado y una
  propuesta en negociación no pesan igual.
- **Los hitos grandes que se alcanzan a ver**, tres a seis, cada uno con de dónde salió.
- **Quiénes van a usar esto**, con qué pregunta llega cada uno y qué le duele. Di cuáles
  dedujiste.
- **En qué orden los atacarías y por qué**, en dos o tres frases.
- **Qué explorarías primero**, una sola cosa.
- Y el ofrecimiento: **que puedes recorrer cualquiera de esos hitos con él** antes de la
  entrevista, si quiere llegar con más terreno pisado.

**El tono importa y es la mitad del trabajo.** Esto se ofrece como orientación, no como
veredicto: *"por acá parece ir la cosa"*, no *"el proyecto se divide en tres módulos"*.
Es importante y **no es mandatorio** — sirve para no arrancar de cero, no para decidir.

Tres cosas que no haces al orientar:

- **No propongas la especificación.** Ningún hito es un frente todavía, y el orden de
  construcción no se decide aquí: se decide con la invariante suprema en la mano, y esa no
  sale de un documento.
- **No escondas de dónde salió cada cosa.** Lo que dedujiste tú se dice que lo dedujiste tú.
  Un hito sin origen se lee como un hecho del negocio y no lo es.
- **No suavices los huecos para que el resumen quede redondo.** Si los documentos no dicen
  quién hace algo de verdad, el resumen tiene que decir que no lo dicen. Un panorama limpio
  sobre documentos incompletos es la forma más fácil de que nadie pregunte lo que falta.

Y cierra diciendo que el siguiente paso es `/descubrir`, que la entrevista **arranca por
las preguntas de la §9** y no por el guion desde cero, y que **si la persona contradice algo
de este archivo, manda la persona**.
