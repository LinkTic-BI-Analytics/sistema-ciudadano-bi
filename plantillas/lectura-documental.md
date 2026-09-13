# Lectura documental — <negocio>

Lo que dicen los documentos que trajo el cliente, y —sobre todo— **lo que hay que
preguntarle a una persona por culpa de ellos**.

> ➤ **Nada de este archivo pasa a la especificación directamente.** Lo que dice un
> documento es una afirmación de quien lo escribió, no un hecho sobre el negocio.
>
> Si el documento **describe** algo que ya opera, describe el proceso como fue diseñado y casi
> nunca como funciona: el manual dice que la solicitud pasa por tres aprobaciones y en la
> práctica todo el mundo llama a la misma persona. Los rodeos nunca están escritos, y el rodeo
> suele ser el requerimiento de verdad.
>
> Si el documento **propone** algo que todavía no existe, no hay práctica que lo desmienta —
> y eso no lo hace más cierto, lo hace menos comprobable. Ver la §2.
>
> Este archivo existe para llegar a la entrevista sabiendo qué preguntar, no para
> ahorrársela.
>
> Borra las líneas ➤ al llenar.

> ➤ **Lo comercial no se analiza aquí, y esto no es un descuido.**
>
> Los documentos de un cliente vienen mezclados: pliegos, ofertas, convenios, contratos. Traen
> precios, formas de pago, descuentos por incumplimiento, presupuestos, plazos de facturación.
> Nada de eso dice **qué tiene que hacer el sistema**, que es lo único que este archivo busca.
>
> Y es un imán. Es la parte más fácil de leer, la que tiene cifras exactas, y la que arrastra
> la conversación: se pasan dos horas discutiendo si el IVA está adentro o afuera y nadie
> preguntó todavía qué no puede pasar nunca con la plata de un depósito. **Una lectura que
> termina en una discusión de contrato es una lectura perdida**, porque el tiempo de la
> persona que sabe del negocio se gastó en algo que no le corresponde.
>
> La regla: **si cambiando esa cifra el sistema se construye igual, no va aquí.** El precio, la
> forma de pago y los descuentos por retraso se construyen igual. El plazo de un trámite, el
> tope de una transacción y la fecha de corte de una regla, no.
>
> Lo que sí entra de un documento comercial: **los plazos que condicionan el orden de
> construcción** (una nota de "no se paga el tercer entregable sin certificar el segundo" sí
> amarra el orden) y **las obligaciones que se vuelven requerimiento** (una disponibilidad
> exigida, una norma de obligatorio cumplimiento). Una línea cada una, en la §6, y nada más.
>
> Si al leer encuentras algo comercial que de verdad importa —una contradicción de plata, un
> riesgo de rechazo— **dilo en voz alta al entregar y a quién le corresponde**, pero no lo
> metas en este archivo.

**Fecha de la lectura:**
**Quién entregó los documentos:**

---

## 0 · Por dónde va esto

> ➤ **Se escribe de última y se lee de primera.** Es la orientación: para que quien abra
> este archivo sepa en diez líneas de qué se trata, sin tener que leer las ocho que siguen.
>
> Y es **importante pero no mandatorio**, que es una distinción que hay que sostener a
> propósito. Sirve para no arrancar de cero: para llegar a la entrevista con una idea de la
> forma del problema y poder decir *"esto parece partirse en tres pedazos, ¿le suena?"* en
> vez de una hoja en blanco. Lo que **no** hace es decidir. Nada de aquí entra a la
> especificación, ningún hito de aquí es un frente todavía, y si la persona dice otra cosa
> en la entrevista, manda la persona.
>
> El riesgo es concreto y tiene nombre: un plan plausible sacado de documentos se vuelve
> *el* plan, y de ahí en adelante la entrevista se usa para confirmarlo en vez de para
> descubrir. Por eso cada hito de la tabla lleva su columna de **qué habría que preguntar
> para confirmarlo** — si esa columna queda vacía, el hito no es un hito: es una suposición
> con formato de tabla.

**De qué se trata esto, en un párrafo.**

> ➤ Qué hace el negocio y para quién, con las palabras de los documentos. Si no cabe en un
> párrafo, todavía no se entendió.

**La línea que dan los documentos.**

> ➤ Hacia dónde apuntan: qué problema dicen resolver, qué alcance declaran, qué dan por
> resuelto. En dos o tres frases. Y **qué tan firme es esa línea** — no es lo mismo un
> contrato firmado que una propuesta comercial que todavía se está negociando.

**Los hitos grandes que se alcanzan a ver.**

> ➤ Los pedazos en que esto parece partirse. Tres a seis, no doce. Cada uno con de dónde
> salió —un documento y su sección, o *"no está en ningún documento, se dedujo"*— y con la
> pregunta que lo confirmaría o lo tumbaría.

| # | Hito | De dónde salió | Qué preguntar para confirmarlo |
|---|---|---|---|
|  |  |  |  |

**Cómo los atacaría, y por qué en ese orden.**

> ➤ Un orden propuesto, en dos o tres frases, con la razón. La razón casi siempre es una
> dependencia: *"esto no puede existir hasta que exista aquello"*. **No es todavía la §10
> de la especificación** — el orden de construcción se decide después, con la invariante
> suprema en la mano, y esa no sale de un documento.

**Qué exploraría primero si me dieran una hora.**

> ➤ Una cosa, no una lista. La que más cambia lo que sigue si resulta distinta de lo que
> los documentos dicen.

---

## 1 · Qué se leyó

> ➤ Un renglón por documento: nombre, qué es, de cuándo, y **quién lo escribió**. Lo último
> importa: un reglamento aprobado por una asamblea y un instructivo que hizo alguien de
> operaciones tienen autoridad distinta cuando se contradicen.
>
> Y lo que NO se pudo leer, con el motivo. Un archivo ilegible que nadie menciona se
> convierte en una laguna que nadie sabe que existe.

| Documento | Qué es | Fecha | Quién lo escribió |
|---|---|---|---|
|  |  |  |  |

**No se pudo leer:**

---

## 2 · Cómo dice el negocio que funciona

> ➤ El proceso declarado, en pasos, con las palabras de los documentos. Sin interpretarlo y
> sin arreglarlo. Si suena raro, se anota como pregunta más abajo — no se corrige aquí.
>
> ➤ **Antes de escribir esta sección, decide qué clase de documento tienes en la mano.**
> Hay dos, se leen distinto, y confundirlas es el error más caro de esta etapa:
>
> - **Un documento que DESCRIBE** — reglamento, manual, especificación de un sistema que
>   opera. Dice cómo debería funcionar algo que ya funciona. Lo que se busca es la distancia
>   entre lo escrito y la costumbre, y esa distancia es la materia prima.
> - **Un documento que PROPONE** — una idea de producto, una propuesta, un anteproyecto. Dice
>   cómo debería funcionar algo que **no existe**. No hay costumbre contra la cual
>   contrastar, así que no hay distancia que medir: **todo lo que dice es una intención, no un
>   hecho**, incluido lo que suena decidido. Escríbelo en esta sección, en una línea, para que
>   nadie lo lea como si fuera evidencia.
>
> **Y si propone, busca el sustituto.** Nadie llega con una idea sin haber intentado
> resolverlo de alguna forma: una hoja de cálculo, un grupo de WhatsApp, una lista de correo,
> un cuaderno. Ese apaño casi siempre aparece de pasada, en media línea, y **es lo único con
> peso de evidencia en todo el documento**: lo que ese apaño hace bien hay que hacerlo, y lo
> que hace mal es la razón de existir del producto.
>
> Si no hay ningún sustituto —nadie lo resuelve de ninguna forma— **hay que detenerse y
> decirlo**. Todo el mundo resuelve como sea lo que de verdad le duele. Que no exista un apaño
> es la señal más clara de que se está por construir algo que nadie pidió.

---

## 3 · Quién va a usar esto

> ➤ **Esta sección es la prioridad del método, y por eso va antes que el vocabulario y que
> las reglas.** Un requerimiento se puede escribir entero sin saber quién se sienta delante
> de la pantalla, y así se escriben casi todos: por eso salen sistemas que cumplen el
> contrato y nadie soporta usar.
>
> Los documentos nombran roles —"el juez", "el secretario", "el administrador"— pero un rol
> no es una persona. Lo que se busca aquí es **con qué pregunta llega cada uno a la
> aplicación y qué le duele hoy**, que es lo único que después hace útil a un revisor.
>
> De aquí salen las **personas validadoras** de `plantillas/persona.md`. No las escribas
> todavía: aquí van los candidatos con lo que se sepa. La vida se la pone el analista, y
> `/validar` se niega a inventarla solo.

| # | Quién es | De dónde salió | Con qué pregunta llega | Qué le duele hoy |
|---|---|---|---|---|
|  |  |  |  |  |

> ➤ Cuatro columnas y las cuatro obligatorias:
>
> - **De dónde salió** — el documento y su sección, o **"se dedujo"**. Un usuario deducido
>   no es un usuario: es una hipótesis, y hay que poder distinguirlos.
> - **Con qué pregunta llega** — *"¿ya me pagaron?"*, *"¿esto cuadra?"*, *"¿quién autorizó
>   esto?"*. Si no se sabe, se escribe **"no se sabe"** y se vuelve pregunta de la §9. Un
>   usuario sin pregunta produce una lista de mejoras genéricas.
> - **Qué le duele hoy** — con el rodeo concreto: la hoja de cálculo aparte, la llamada, el
>   dato que teclea dos veces. **Marca lo deducido.** El dolor documentado es raro; el
>   deducido es una apuesta y hay que decir que lo es.

**Los que no aparecen en ningún documento y seguramente existen:**

> ➤ Recorre estos cuatro. Un documento normativo describe a quien opera el proceso y casi
> nunca a los demás, y los demás son los que sufren:
>
> - **Quien recibe el resultado** — el ciudadano, el cliente, el beneficiario. Rara vez
>   aparece, y es de quien depende que el sistema sirva para algo.
> - **Quien arregla lo que salió mal** — el que llama, el que corrige, el que hace la
>   excepción a mano.
> - **Quien audita o supervisa** — mira sin operar, y necesita cosas distintas.
> - **Quien administra el sistema** — crea usuarios, cambia parámetros. Suele ser una sola
>   persona y suele ser el cuello de botella de todo.

**A quién habría que ver trabajando:**

> ➤ Uno o dos, con el porqué. No "el usuario final": el cargo concreto y qué se aprendería
> mirándolo media hora.

---

## 4 · El vocabulario que ya existe

> ➤ Esto es lo más valioso que dan los documentos, y sale gratis: **las palabras que el
> negocio ya usa**. Alimenta el glosario del dominio.
>
> Presta atención especial a las palabras que aparecen con dos sentidos en documentos
> distintos: esas son candidatas a palabra prohibida, y encontrarlas aquí ahorra semanas.

| Palabra | Dónde aparece | Qué parece significar | ¿Aparece con dos sentidos? |
|---|---|---|---|

**Códigos, siglas y numeraciones que ya existen:**

> ➤ Si el negocio ya numera sus cosas —expedientes, radicados, referencias— ese formato es
> un requerimiento, no un detalle. La gente lo tiene memorizado.

---

## 5 · Las cosas que aparecen

> ➤ Entidades candidatas, con la advertencia de que un formulario no es una entidad: es una
> vista de varias. Un formato de "solicitud de préstamo" suele traer adentro el solicitante,
> el bien, el préstamo y el aval.

| Cosa | Dónde aparece | Qué parece ser |
|---|---|---|

---

## 6 · Reglas explícitas encontradas

> ➤ Solo lo que el documento dice literalmente. Con la cita textual y de dónde salió —
> alguien va a discutirla y hay que poder mostrar el renglón.
>
> Marca con **[?]** las que parezcan estar escritas y no cumplirse. Esas son las mejores
> preguntas de la entrevista.

| Lo que dice | Documento y dónde | ¿Se cumple? |
|---|---|---|

---

## 7 · Contradicciones

> ➤ **No las resuelvas.** Cuál manda es una decisión del negocio, y preguntarla suele destapar
> que no manda ninguna: manda la costumbre.
>
> Vienen de tres sitios y hay que buscarlas en los tres:
>
> - **Entre documentos.** Dos entidades que dicen cosas distintas de lo mismo. La autoridad
>   de quien lo escribió importa: un reglamento aprobado por una asamblea y un instructivo que
>   hizo alguien de operaciones no pesan igual.
> - **Dentro de un mismo documento.** Un borrador que se editó por encima sin borrar lo
>   viejo, una sección de "ideas" que contradice la de decisiones. Un `OLD STUFF BELOW` o un
>   párrafo tachado a medias son oro: dicen qué cambió de opinión el autor y —a veces— que
>   nunca lo decidió.
> - **Entre el texto y las imágenes.** La contradicción que más se escapa, porque casi nadie
>   mira los mockups con el texto al lado. Un botón dibujado que el texto no menciona es una
>   decisión que alguien tomó con el mouse y no con la cabeza.

| Sobre qué | Dice una parte | Dice la otra |
|---|---|---|

---

## 8 · Lo que los documentos no dicen

> ➤ Estas faltan casi siempre, porque un documento normativo no las necesita y un sistema sí.
> Recórrelas todas y anota cuáles quedaron sin respuesta:
>
> - **Cuántas veces al día o al mes** pasa cada cosa. Sin esto no se sabe qué pantalla tiene
>   que ser rápida.
> - **Quién lo hace de verdad**, contra quién dice el documento que lo hace.
> - **Qué pasa cuando sale mal**, y quién lo arregla.
> - **Las excepciones**: a quién se le deja saltar la regla y por qué.
> - **Los plazos reales** contra los plazos escritos.
> - **Qué se hace hoy cuando el sistema o el proceso dice que no.**
> - **Cuánto cuesta** el error que se está tratando de evitar.

---

## 9 · Preguntas para la entrevista

> ➤ **Esta es la razón de existir de todo el archivo.** Numeradas, en el orden en que
> conviene preguntarlas, cada una con de dónde salió.
>
> Las que más valen son de tres clases: donde dos documentos se contradicen · donde una
> regla está escrita y parece no cumplirse · donde el documento describe un paso que suena
> a que en la práctica se salta.

| # | La pregunta | De dónde sale |
|---|---|---|
| 1 |  |  |

**La que no se puede dejar de hacer:**

> ➤ Una sola. Si la sesión se acaba a los veinte minutos, esta es la que tuvo que quedar
> contestada.
