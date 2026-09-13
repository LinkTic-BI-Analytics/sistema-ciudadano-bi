# Preguntas — las seis decisiones que bloquean la construcción

**Para:** Miguel Gómez · **Fecha:** 2026-09-13 · **Estado:** **4 de 6 respondidas** (P1, P2, P3, P5). Faltan P4 y P6

## Para quien responde

Son seis decisiones de producto y dos preguntas de cierre. **Ninguna es técnica**: las seis
deciden qué tiene que poder existir, no cómo se implementa.

Se pueden contestar en desorden, y una a una. Si alguna necesita a otra persona —jurídica,
la entidad operadora—, dígalo en la respuesta en vez de dejarla en blanco: saber **de quién
es** una decisión ya destraba media cosa.

Contestar «todavía no sé» es una respuesta válida y útil. Lo que no sirve es una respuesta
plausible que nadie tomó: `AGENTS.md` §3 lo prohíbe por escrito — *un dato que no salió de
una decisión no va a la especificación como si alguien lo hubiera dicho*.

## El contexto mínimo

Estamos montando un servicio para que cualquier persona en Colombia cuente qué necesita
mejorar en su comunidad, y para que los equipos públicos conviertan esos relatos en
información territorial útil. Diez módulos, dieciséis requerimientos funcionales, seis
invariantes, once roles.

El andamiaje de construcción ya está montado y funcionando: repositorio, tablero, chequeos
automáticos, comandos. **Lo que no se puede empezar es el producto**, porque estas seis
decisiones cambian el modelo de datos y, tomadas tarde, obligan a reescribirlo.

La primera de ellas toca las diez tablas.

## Lo que ya sabemos, para no volver a preguntarlo

| Ya está decidido | De dónde salió |
|---|---|
| La IA propone, los humanos deciden y asumen la responsabilidad | `modulos/revision.md` y `modulos/contexto-documental.md` |
| Asistir a un evento no es apoyar una propuesta | `modulos/eventos-y-facilitacion.md` |
| Esto no es un censo: mapea lo reportado, no la prevalencia real | `modulos/bi-institucional.md` |
| Aporte ≠ persona ≠ asistencia ≠ apoyo ≠ necesidad ≠ decisión. Son seis cosas separadas | `especificacion.md` §granularidad |
| La votación presupuestal queda apagada hasta que se publiquen sus ocho condiciones | invariante `I5` |
| Ninguna de las anteriores tiene acuerdo institucional. Son del equipo | `LEEME.md` |

Y lo que **no** hace falta decidir todavía: proveedor de nube, motor de base de datos,
proveedor de videollamada, proveedor de IA. Ninguno bloquea el modelo de datos.

---

## Las preguntas

### P1 · ¿Cuál es la lista oficial de municipios que vamos a usar, y qué pasa cuando cambia? — **RESPONDIDA a medias**

**Por qué la preguntamos.** Todo el análisis territorial se apoya en una lista de lugares.
Y los municipios cambian: se crean, se fusionan, se les cambia el nombre. Un corte exportado
en marzo tiene que seguir siendo reproducible en octubre aunque la lista haya cambiado en
junio — por eso no basta con escoger la lista: hay que decidir **qué pasa con lo viejo**.

Hay una segunda mitad de la pregunta: ¿cuáles son los municipios del piloto? Sin esa lista
no hay denominador, y sin denominador **no se puede mostrar un porcentaje de cobertura,
solo conteos**. «7 de 10 municipios tienen aportes» necesita saber cuáles son los 10.

**Qué pasa si no se responde.** No se pueden implementar ni probar las dos reglas de
cálculo del BI (`R1` y `R2`), ni el mapa de cobertura, ni el porcentaje que es la cifra más
visible del tablero institucional.

**Respuesta:**

> **DIVIPOLA, del DANE.** — Miguel Gómez, 2026-09-13

Queda en `AGENTS.md` §9 y en `vacios.md` V10. Departamento de 2 dígitos más municipio de 3;
los centros poblados llevan 3 más; las áreas no municipalizadas también están.

**Lo que esta respuesta abrió, y no estaba en la pregunta:**

- **`Q4` · DIVIPOLA no tiene barrios.** Llega hasta el centro poblado, que es rural
  —caseríos, corregimientos, inspecciones de policía—. La diferencia entre dos barrios de la
  misma ciudad no se puede representar con este catálogo, y la visión dice que una necesidad
  se puede perder *«dentro de una ciudad o de una misma comunidad»*. Hay que decidir si el
  barrio va como texto libre sin catálogo —que es lo que `I2` permite: queda «por aclarar» y
  no se infiere— o si se adopta un segundo catálogo urbano.
- **`Q5` · qué versión, y qué pasa con la anterior.** No es hipotético: en 1997 los centros
  poblados pasaron de 2 dígitos a 3, así que un código histórico significa cosas distintas
  según la versión con que se escribió. La versión va guardada **en cada registro**.

**Sigue abierta la otra mitad (`Q6`): cuáles son los municipios del piloto.** Sin esa lista
no hay denominador, y el mapa de cobertura muestra conteos pero nunca un porcentaje.

---

### P2 · ¿Qué es exactamente un «expediente»? — **RESPONDIDA**

**Por qué la preguntamos.** Es la entidad central del sistema —la unidad sobre la que se
decide todo— y **el glosario la declara sin definir**. «Necesidad situada» queda abierta
también, porque su definición usa esta.

Lo concreto que hay que poder responder: si dos personas de barrios distintos del mismo
municipio cuentan el mismo problema de agua, ¿eso es un expediente o dos? ¿Y si es el mismo
problema en dos municipios vecinos? ¿Y si es agua pero uno habla de presión y el otro de
contaminación?

**Qué pasa si no se responde.** El módulo de revisión no se puede construir: es todo él la
máquina de convertir aportes en expedientes. Y sin eso no hay BI, ni priorización, ni
gestión — es el cuello de la ruta crítica.

**Respuesta:** — Miguel Gómez, 2026-09-13

> Un expediente es el **registro de trabajo y seguimiento de una necesidad situada**. Reúne
> los aportes que la describen, sus evidencias, las aclaraciones pendientes y las actuaciones
> del equipo responsable. **Puede comenzar con un solo aporte**; no requiere que varias
> personas reporten el problema.
>
> Una **necesidad situada** es una afectación concreta, reportada en un territorio y un
> contexto temporal, que afecta a una población y requiere un cambio identificable. Por
> ejemplo: *«Baja presión de agua recurrente en la parte alta del barrio desde hace tres
> meses»*.
>
> **Tres niveles:** *aporte* (lo que una persona o un grupo expresa, con su relato original y
> su procedencia) → *expediente* (la necesidad concreta que se revisa y gestiona; puede reunir
> varios aportes) → *agrupación temática o territorial* (relaciona expedientes para analizar
> patrones, **sin fusionarlos**).
>
> **¿Cuándo dos aportes pertenecen al mismo expediente?** Cuando la revisión permite establecer
> que describen la misma afectación, en un ámbito territorial y temporal coherente, y pueden
> tener seguimiento conjunto sin ocultar diferencias relevantes. **Compartir tema, municipio,
> entidad responsable o palabras similares no es suficiente.** Tampoco hace falta conocer la
> causa técnica para abrir un expediente.
>
> | Caso | Regla |
> |---|---|
> | Dos barrios distintos del mismo municipio reportan problemas de agua | **Dos expedientes por defecto**, salvo que la revisión establezca una misma afectación compartida —por ejemplo, una interrupción de la misma red— |
> | El problema aparece en dos municipios vecinos | **Dos expedientes por defecto**, relacionados para análisis regional. Podrían ser uno intermunicipal si se confirma afectación común **y la gestión conjunta conserva el seguimiento de cada territorio** |
> | Una persona reporta baja presión y otra contaminación | **Dos expedientes relacionados**, aunque compartan territorio o infraestructura: son afectaciones diferentes con verificaciones y respuestas distintas |
>
> **La pregunta práctica para decidir:** *¿podríamos dar por atendida una de estas situaciones
> mientras la otra sigue pendiente?* Si la respuesta es sí, deben poder gestionarse por separado.
>
> **Cinco reglas para el módulo de revisión:** (1) un aporte puede alimentar **varios**
> expedientes; (2) la información incompleta permanece visible y no se fuerza su agrupación ni
> se descarta; (3) la IA propone y el equipo confirma, con responsable y motivo; (4) los
> expedientes pueden fusionarse o dividirse **conservando originales, referencias e historial**;
> (5) cada expediente registra identificador, descripción, territorio, contexto temporal,
> población cuando se conozca, cambio esperado, aportes vinculados, incertidumbres, responsable,
> estado e historial.
>
> **Para BI se cuentan por separado aportes y expedientes.** Cien aportes siguen siendo **una**
> necesidad registrada; ese volumen no demuestra mayor gravedad ni equivale a cien personas
> afectadas. Si abarca varios municipios, es **un mismo expediente** al calcular totales.
>
> **Abrir un expediente significa iniciar una revisión y un seguimiento trazables.** No implica
> aprobar una intervención, asignar recursos ni declarar resuelto el problema.

Las consecuencias de modelado están en `AGENTS.md` §8 y §9, y en `vacios.md` V12.

**Una corrección que esta respuesta obligó.** `AGENTS.md` §8 decía que un expediente «nunca se
fusiona». Era **más estricto que la fuente**: la `I4` de la especificación prohíbe fusionar
*«automáticamente por palabras compartidas»*, no fusionar. Corregido — la fusión se puede,
pero nunca destruyendo filas: expediente nuevo, lápidas en los anteriores, vínculos
conservados. Compone con el borrado lógico de la `P3`.

**Lo que esta respuesta abrió:**

- **`Q10` · el «contexto temporal» del ejemplo es una fecha relativa.** *«Desde hace tres
  meses»*, guardado literalmente, deja de ser cierto mañana. Y falta si se distingue una
  afectación recurrente de una puntual.
- **`Q11` · «población afectada» choca con `C2`.** La definición pide registrarla; `C2` pide
  agregar u ocultar para evitar reidentificación. *«Doce familias de la vereda X»* identifica.
- **`Q12` · un aporte retirado que alimentaba varios expedientes.** Que un aporte alimente
  varios es información nueva: el retiro ya no toca un expediente sino N, y alguno puede estar
  en gestión.

---

### P3 · Cuando alguien pide que retiren lo que contó, ¿qué desaparece y qué queda? — **RESPONDIDA a medias**

**Por qué la preguntamos.** Ésta es la que toca las diez tablas, y `vacios.md` la marca como
«la que bloquea todo lo demás».

Decide si el modelo conserva todo y marca lo retirado, o si de verdad borra. Y no es una
pregunta abstracta: hay tres casos concretos que se responden distinto.

1. Alguien retira su aporte **por seguridad** —tiene miedo de que lo identifiquen—. ¿Se
   borra el texto pero queda el conteo? ¿O desaparece también del conteo, y los números
   publicados el mes pasado dejan de cuadrar?
2. El aporte **ya está agrupado** en una necesidad que está en revisión. ¿Se saca y la
   necesidad queda con menos respaldo? ¿O la necesidad ya tiene vida propia?
3. La necesidad **ya es parte de un proyecto elegible**. ¿Se puede retirar algo que ya
   sustentó una decisión pública?

**Qué pasa si no se responde.** No se escribe la primera migración. Está escrito así en
`AGENTS.md` §9 para que nadie lo haga por descuido: decidir esto después obliga a reescribir
el esquema entero.

**Si esto necesita jurídica**, dígalo y seguimos: es exactamente el tipo de decisión que no
se delega.

**Respuesta:**

> **Borrado lógico.** — Miguel Gómez, 2026-09-13

Queda en `AGENTS.md` §9 y en `vacios.md` V11. La fila se queda y se marca; no se borra
físicamente. El modelo es append-only con lápidas, y eso vale para las diez tablas.

**Lo que esta respuesta abrió:**

- **`Q7` · la parte jurídica sigue abierta.** La Ley 1581 de 2012 da derecho a que un dato
  personal se **suprima**, y una fila marcada sigue estando ahí. La separación física entre
  identidad y dato analítico que ya pide `AGENTS.md` §9 permite las dos cosas a la vez —
  borrar de verdad lo que identifica, dejar lógico el registro analítico— pero **eso no lo
  decide el equipo técnico.**
- **`Q8` · un aporte retirado, ¿sigue contando?** «Lógico» dice qué pasa con la fila; no dice
  si sigue en el total publicado, en el denominador de `R2`, ni en la necesidad donde ya
  estaba agrupado. Las tres respuestas son defendibles y cambian los números.
- **Cuánto tiempo se queda.** Sin política de retención, «borrado lógico» significa «para
  siempre».

**Y la respuesta destapó la pregunta que de verdad bloquea la primera tabla (`Q9`): cuál es
la unidad de pertenencia.** Ver abajo.

---

### P4 · ¿Cómo entra una persona a ver su propio aporte, y cómo entran los nueve roles internos?

**Por qué la preguntamos.** **Hoy no hay nada escrito sobre identidad en ningún archivo de
la especificación.** Ni proveedor para los roles internos, ni definición de qué es el
«comprobante seguro» que la persona recibe.

La promesa del producto es *«podrás revisar lo que entendimos y conocer qué pasó con tu
aporte»*, y hay un requisito que la aprieta: **sin exigir correo**. Entonces, ¿qué recibe la
persona? ¿Un código que anota en un papel? ¿Un enlace? ¿Y si lo pierde?

Y por el otro lado: los nueve roles internos entran con algo. ¿Cuentas del sistema? ¿El
directorio de la entidad? ¿Carpeta Ciudadana Digital?

**Qué pasa si no se responde.** No se puede cerrar el módulo de administración, que es la
raíz del grafo: todos los demás dependen de él para permisos. Se puede empezar a construir
la captura sin esto, pero no se puede terminar el recorrido — que es justo la promesa.

**Respuesta:**

>

---

### P5 · Una necesidad que es una emergencia, ¿por dónde se sale de la cola normal? — **RESPONDIDA**

**Por qué la preguntamos.** Alguien va a reportar un puente a punto de caerse, o un
deslizamiento. Hoy eso cae en la misma bandeja que una petición de mejorar un parque, y sale
por orden de llegada.

Esto no es un riesgo técnico. Es el riesgo de que el sistema reciba un aviso que podía
salvar a alguien y lo deje en la fila.

Lo que hay que decidir: **quién lo ve, en cuánto tiempo, y qué hace con eso.** La plataforma
no puede prometer que atiende emergencias —no es su competencia— pero sí tiene que decidir
qué hace cuando una llega, aunque la respuesta sea «se le dice a la persona a qué número
llamar y se marca para revisión inmediata».

**Qué pasa si no se responde.** Es la única de las seis que no bloquea código: se puede
construir todo lo demás sin ella. **Bloquea el primer piloto real con ciudadanía.**

**Respuesta:** — Miguel Gómez, 2026-09-13. Protocolo completo en el hilo de esta pregunta.

> **Los tiempos son una propuesta operativa para el piloto; deben quedar respaldados por
> responsables y turnos antes de abrirlo a ciudadanía.**
>
> Todo aporte que señale una posible emergencia activa una **ruta de alerta urgente**,
> separada de la cola normal. Orienta a la persona y traslada el aviso al canal competente,
> con seguimiento humano. **La plataforma no despacha recursos ni garantiza la atención.**
>
> **Qué la activa:** un indicio de peligro inmediato o próximo para la vida o la integridad.
> Puede activarla la persona, un facilitador, un revisor o una detección automática. **No
> requiere corroboración, fotografías, identidad verificada ni un número mínimo de reportes.**
> La IA ayuda a detectar, pero su valoración **no puede impedir ni desactivar** una alerta. Se
> abre desde un aporte **sin esperar a crear, completar o agrupar un expediente**.
>
> **Qué ve la persona,** sin exigir que termine el formulario: *«Si hay personas en peligro,
> llama ahora al 123. No esperes una respuesta de esta plataforma. Este formulario registra
> información y no activa por sí mismo un servicio de emergencia.»* «Llamar al 123» es la
> acción principal, lo escrito se conserva, y **nunca se pide acercarse al peligro, tomar
> fotografías ni conseguir pruebas**.
>
> **Quién y en cuánto.** La entidad operadora nombra un **responsable de alertas por turno**,
> un suplente y un coordinador de escalamiento. *Una bandeja compartida sin persona asignada no
> cumple esta función.* Al activarse sale de la cola normal y genera notificación activa — no
> basta con destacarla en rojo. Máximo 5 minutos para acusar recibo; sin demora ante peligro
> evidente y máximo 10 minutos para iniciar contacto con el canal territorial; a los 5 minutos
> sin aceptación se avisa al suplente y al coordinador. **Son plazos de actuación del equipo de
> la plataforma, no tiempos de llegada de organismos de emergencia.**
>
> **Cuándo termina.** Mostrar un teléfono, enviar un correo o pulsar «remitir» **no equivale a
> confirmar que una autoridad recibió el aviso**. El sistema distingue *orientación mostrada*,
> *contacto intentado* y *recepción confirmada*, con responsable, canal, fecha y constancia. Una
> transferencia confirmada tampoco significa emergencia resuelta. Si la revisión determina que
> no hay indicios, devuelve el caso al flujo ordinario con justificación, conservando la
> necesidad y el relato.
>
> **Condición para abrir el piloto:** recepción en horarios con cobertura humana efectiva. Si se
> habilita 24 horas, esta ruta necesita guardia equivalente. Antes de abrir deben estar
> definidos responsables, suplencias, directorio y protocolo, y **haberse probado casos con
> ausencia del titular y fallos de contacto**. *Un aviso que diga «no atendemos emergencias» no
> sustituye esa capacidad operativa.*

Las consecuencias están en `AGENTS.md` §9 (el modelo) y §10 (la pantalla), y en `vacios.md` V13.

**El 123 se verificó** antes de escribirlo en una pantalla: es la Línea Única de Atención de
Emergencias, el NUSE, nacional, gratuita y 24/7. Y trae un matiz que respalda la propuesta:
**quién contesta varía por municipio**.

**Lo que esta respuesta abrió:**

- **`Q13` · el directorio de canales por territorio no existe.** Sin él, «trasladar al canal
  competente» no tiene a dónde. Es condición de piloto, no de construcción.
- **`Q14` · si la recepción tiene horario, ¿qué pasa con la ventana de aportes de una
  convocatoria?** Son dos cosas distintas y hoy no se sabe cuál manda fuera de horario.
- **Y la entidad operadora dejó de ser un dato de publicación.** Sin ella no hay responsable de
  turno, ni suplente, ni coordinador — así que **bloquea el piloto**, no solo la ficha pública.

---

### P6 · Si la persona corrige la síntesis y el facilitador cree que eso cambia lo que se habló en la mesa, ¿quién tiene la última palabra?

**Por qué la preguntamos.** El producto promete dos cosas que se pueden contradecir: que la
persona puede corregir lo que entendimos de lo suyo, y que las relatorías de un encuentro
registran fielmente lo que pasó en la mesa.

En un aporte individual no hay conflicto. En uno recogido en una mesa colectiva sí: el
facilitador escribió una cosa, la persona la corrige, y el facilitador cree que la corrección
cambia el sentido de lo que el grupo acordó.

Hay una pregunta hermana: un aporte colectivo **cambia de vocero**. ¿De quién es el
expediente, y a quién le llegan las respuestas?

**Qué pasa si no se responde.** El módulo de revisión no puede resolver un conflicto de
autoría, y es un caso que va a pasar en el primer encuentro presencial. Si no está decidido,
lo va a decidir quien esté en la pantalla ese día — y cada quien lo va a decidir distinto.

**Respuesta:**

>

---

### P7 · ¿Alguna vez esto salió mal? ¿Qué pasó, cuánto costó y cómo se enteraron?

En un ejercicio de participación anterior —cualquiera, no tiene que ser de este proyecto—:
algo que se prometió y no se pudo cumplir, información que se perdió, alguien que quedó
expuesto, una consulta que la gente sintió que no sirvió para nada.

**Por qué la preguntamos.** Las invariantes salen de aquí y no de preguntar por invariantes.
Nadie contesta *«la invariante es que no se reidentifique a nadie»*; la gente cuenta *«una
vez publicamos un mapa de un municipio pequeño y se supo quién había hablado»*.

**Respuesta:**

>

---

### P8 · ¿Qué le preguntaría usted a alguien que va a construir esto, y que no le preguntamos?

**Por qué la preguntamos.** Es la que destapa lo que no sabíamos que era una pregunta.
Cuesta una línea y a veces vale más que las otras siete.

**Respuesta:**

>

---

## Si le sobra tiempo

Lo de abajo no bloquea el modelo de datos, así que no hace falta contestarlo hoy. Pero cada
una es un pliego que va a llegar después:

- **Las taxonomías y las siete máquinas de estado.** La sección está vacía en la
  especificación, y hay al menos siete flujos implícitos sin escribir: ubicación,
  clasificación, confirmación, revisión, remisión, campaña y encuentro. Es una sesión de
  diseño, no un pliego.
- **Cuánto silencio institucional convierte un aporte en «vencido»**, y qué pasa entonces.
  Hoy no hay ningún plazo escrito, y el sistema tampoco puede cerrar por silencio.
- **Qué versión de GOV.CO aplica** —la v4, la v5 que está en QA, o el PDF de MinTIC—. El
  manual oficial daba 404 cuando se consultó. Bloquea cerrar marca y tipografía, no bloquea
  construir: los tokens ya separan la identidad institucional del significado de las acciones
  justamente para esto.
- **Quién es la entidad operadora**, y quién responde por los aportes. Es un dato de
  publicación, no un dato que podamos inventar.

## Estado

| | |
|---|---|
| Enviado | 2026-09-13 |
| Respondido | — |
| Qué destrabó | — |
| Qué abrió que no estaba | — |
| Respondido | P1, P2, P3 y P5, el 2026-09-13. La P1 y la P3 a medias: cada una cerró el mecanismo y abrió su semántica. La P2 y la P5 completas, y las dos trajeron protocolo, no solo definición |
| Qué destrabó | Catálogo, modo de borrado, la forma del expediente y la ruta de alerta ya están en `AGENTS.md`. El módulo de revisión tiene sus cinco reglas y su prueba de decisión |
| Qué abrió que no estaba | Once preguntas nuevas, `Q4` a `Q14`. La más grave sigue siendo `Q9`. Y una corrección: `AGENTS.md` §8 decía «nunca se fusiona», que era más estricto que la `I4` de la especificación |
| Contexto mínimo para retomar | Quedan **P4** (identidad) y **P6** (quién decide entre ciudadano y facilitador). **Y apareció una que no estaba y bloquea más que todas: `Q9`, cuál es la unidad de pertenencia** — la columna que va en todas las tablas y que `metodo/frentes.md` señala como lo único que no se puede agregar después. La primera tabla espera esa, no las dos ya respondidas. |
