# Preguntas — las seis decisiones que bloquean la construcción

**Para:** Miguel Gómez · **Fecha:** 2026-09-13 · **Estado:** enviado, sin responder

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

### P1 · ¿Cuál es la lista oficial de municipios que vamos a usar, y qué pasa cuando cambia?

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

>

---

### P2 · ¿Qué es exactamente un «expediente»?

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

**Respuesta:**

>

---

### P3 · Cuando alguien pide que retiren lo que contó, ¿qué desaparece y qué queda?

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

>

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

### P5 · Una necesidad que es una emergencia, ¿por dónde se sale de la cola normal?

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

**Respuesta:**

>

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
| Contexto mínimo para retomar | Las seis deciden el modelo de datos. La P3 toca las diez tablas y bloquea la primera migración. La P1, la P2 y la P4 están en la ruta crítica. La P5 no bloquea código: bloquea el piloto con ciudadanía. |
