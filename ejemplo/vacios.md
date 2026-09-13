# Vacíos

Lo que hubo que decidir construyendo y la especificación no respondía.

Cada entrada dice entre corchetes **qué forma de pregunta la produjo**, del catálogo de
[`metodo/lo-que-destapa-construir.md`](../metodo/lo-que-destapa-construir.md). Ninguna de
estas salió de la entrevista con Marta: todas aparecieron con algo a medio construir
delante.

---

## 1 · Decidido

### De quién es y quién puede

| # | Vacío que había | Qué se decidió | Dónde |
|---|---|---|---|
| V1 | **[A1]** Marta habla de "los residentes". ¿El derecho a reservar es del residente o del apartamento? | **Del apartamento.** Uno con cuatro adultos tendría cuatro veces más derecho, y el salón es uno solo | `I4` · `apartamentos` |
| V2 | **[A1]** ¿Un residente puede estar en dos apartamentos? Los hay que arriendan y viven en otro | **No.** Quien lo necesite usa dos cuentas. Permitirlo obliga a preguntar contra cuál apartamento reserva, cada vez | `residentes.apartamento_id` |
| V3 | **[A2]** ¿Quién da de alta a un residente? | **Solo la administración.** No hay registro abierto: el conjunto es cerrado y la portería ya valida quién vive dónde | `alta_residente()` |
| V4 | **[A2]** ¿Un residente puede cancelar la reserva que sacó otro de su mismo apartamento? | **Sí.** El derecho es del apartamento (I4), así que la reserva también. Prohibirlo obliga a llamar a quien la sacó | `desistir()` |
| V5 | **[A3]** ¿Qué pasa con las reservas de quien se muda? | Se da de baja con fecha y **no se borra**. Sus reservas conservan quién las pidió, porque el histórico de R6 lo necesita | `residentes.baja_at` |
| V6 | **[A3]** Si el apartamento se vende, ¿el nuevo dueño hereda el historial? | **Hereda el apartamento, no el historial de personas.** Las reservas viejas siguen colgadas del apartamento; los residentes viejos quedan de baja | `alta_residente()` |

### Qué es una cosa y qué es cada caso

| # | Vacío que había | Qué se decidió | Dónde |
|---|---|---|---|
| V7 | **[B1]** Se modeló "reserva" como una sola cosa. ¿La franja del sábado 2–7 p.m. es una definición o un caso? | **Dos cosas.** `franjas` es la definición (el salón se reserva de 2 a 7, todos los sábados) y `reservas` es el caso. Sin separarlas no se puede cambiar el horario sin reescribir lo ya reservado | `franjas` · `reservas` |
| V8 | **[B2]** Se quita un espacio del conjunto. ¿Se borra? | **Se apaga.** Las reservas viejas lo siguen citando y el histórico de uso es lo que justifica quitarlo | `espacios.activo` |
| V9 | **[B3]** Marta quiere poder cambiar las franjas del salón. ¿Aplica a lo ya reservado? | **No.** Lo confirmado sigue con el horario que tenía (I2). Si aplicara hacia atrás, alguien llegaría a una hora distinta de la que le dijeron | `reservas.desde`, `.hasta` copiadas al confirmar |
| V10 | **[B3]** ¿Y si cambia el tope de 3 a 2? | **Del mes siguiente en adelante.** Quien ya tiene 3 este mes las conserva. Quitarle una reserva confirmada por un cambio de política es exactamente lo que I2 prohíbe | `R1` · `topes` con fecha |
| V11 | **[B1]** El horario de las franjas se copió a la reserva al confirmar. ¿Eso no es duplicar el dato? | **Sí, y es a propósito.** Es la única forma de que V9 se sostenga. El dato de la franja es "cómo se reserva hoy"; el de la reserva es "qué se le prometió a esta familia" | `reservas.desde` |

### Los vacíos y los bordes

| # | Vacío que había | Qué se decidió | Dónde |
|---|---|---|---|
| V12 | **[C1]** El salón exige depósito. Un salón reservado sin depósito registrado, ¿se rechaza? | **No: se marca.** Nadie sabe si se pagó y no se registró, o si no se pagó. Un estado inventado es peor que uno vacío (P1) | `v_reservas.sin_registro_de_deposito` |
| V13 | **[C1]** ¿Se exige motivo al desistir? | **No.** Nadie tiene que explicar por qué no va a usar el salón, y exigirlo produce motivos de mentiras. Al **anular** sí se exige: ahí hay alguien a quien darle una razón | `desistir()` · `anular()` |
| V14 | **[C2]** ¿Dónde cae una solicitud de un espacio que no está en la lista —la terraza, que a veces prestan? | **No cae en ninguna parte: no se puede pedir.** Marta la maneja por WhatsApp y decidimos no modelarla todavía. Queda como pregunta abierta (Q4), no como sobre "Otros": un espacio que el sistema no controla no puede aparecer como si lo controlara | — |
| V15 | **[C3]** Un espacio recién creado, sin franjas todavía. ¿Qué muestra el calendario? | **Dice que no hay franjas configuradas.** No muestra un calendario vacío, que se lee como "todo ocupado" | `calendario.tsx` |
| V16 | **[C3]** Un apartamento sin residentes activos. ¿Su derecho es 0 o 3? | **3, pero no hay quién reserve.** Ponerle 0 sería castigar a quien llegue; ponerle un residente ficticio sería inventar | `R1` |
| V17 | **[C4]** El listado de apartamentos lo mantiene la administración en un Excel. ¿Qué pasa si está desactualizado? | El sistema **no lo sincroniza ni lo adivina**: se carga a mano y se dice cuándo fue la última carga. Un apartamento que no está no puede reservar, y eso se ve | `apartamentos.cargado_at` |

### Las cuentas

| # | Vacío que había | Qué se decidió | Dónde |
|---|---|---|---|
| V18 | **[D1]** ¿Una reserva anulada cuenta contra el tope? | **No** (P5, I5). En el cuaderno se cobraban, y fue la queja más repetida del año | `R1` |
| V19 | **[D1]** Una franja que pasó y nadie usó, ¿cuenta? | **Sí.** Si no contara, quien reserva y no va sale igual que quien no reservó — y el salón quedó vacío con alguien más que lo quería | `R1`, estado `usada` |
| V20 | **[D1]** ¿Estar en la lista de espera consume derecho? | **No.** Solo consume la reserva confirmada. Si consumiera, anotarse tendría un costo y nadie se anotaría — y la lista es lo que hace que el sistema sea justo | `espera` |
| V21 | **[D2]** ¿El derecho disponible se guarda en un contador? | **Se calcula** de las reservas. Un contador y una lista son dos verdades sobre lo mismo, y cuando se separan nadie sabe cuál es la buena (C2) | `v_cupo` |
| V22 | **[D4]** Al desistir, ¿con qué fecha se anota para saber si fue antes o después del corte? | **Con la hora del servidor**, no con la del celular. Un celular con la hora corrida decidiría si el derecho se devuelve | `desistir()` |
| V23 | **[D4]** El corte, ¿se calcula sobre la fecha de la franja o sobre la fecha en que se reservó? | **Sobre la de la franja.** Con la otra, reservar con dos meses de anticipación daba dos meses de cancelación gratis. Lo vio Marta, no una prueba | `R2` |
| V24 | **[D1]** ¿El mes del tope es calendario o corrido? | **Calendario.** Marta lo lleva así en el cuaderno; cambiarlo sería enseñarle una regla nueva sin ganar nada | `R1` |

### Qué hace el sistema con eso

| # | Vacío que había | Qué se decidió | Dónde |
|---|---|---|---|
| V25 | **[E2]** ¿Cómo se hace imposible la doble reserva? | **Una restricción sobre los datos**, no una comprobación antes de escribir. La primera versión comprobaba y después escribía: con dos pestañas abiertas salió doble a la primera (I1) | `reservas_franja_vigente_key` |
| V26 | **[E1]** Un apartamento sin sus tres, ¿se le impide reservar o se le avisa? | **Se le impide**, y se le dice desde cuándo vuelve a tener. Es un límite del reglamento, no una recomendación | `reservar()` |
| V27 | **[E1]** ¿Se impide reservar dos espacios distintos a la misma hora? | **Se avisa, no se impide.** Una familia puede tener el BBQ y la cancha el mismo domingo y no hay nada malo en eso. Marta pidió verlo, no bloquearlo | `v_reservas.solapa_consigo` |
| V28 | **[E3]** ¿Basta con marcar la reserva como desistida? | **No.** Desistir y pasarle la franja al primero de la lista son una sola operación (I3). Separados, la franja queda libre unos segundos y se la lleva alguien de afuera de la lista | `desistir()` |
| V29 | **[E4]** ¿Cuándo se le ofrece a alguien la lista de espera? | **En el momento en que toca una franja tomada**, no en una pantalla aparte. Ahí es cuando le importa; después ya cerró la aplicación | `calendario.tsx` |
| V30 | **[E5]** El listado de apartamentos que nunca alcanzan (R6), ¿trae un botón para darles prioridad? | **No.** Es información para que Marta hable con el consejo. Darle prioridad a alguien por decreto rompe P4, que es lo único que hace creíble la lista de espera | `v_nunca_alcanzan` |

### Reglas donde dos se tocaban

| # | Las dos reglas | Qué se decidió | Por qué |
|---|---|---|---|
| V31 | **[F1]** R3 da 12 horas para confirmar. R2 pone el corte el jueves a las 6. Una franja liberada el jueves a las 5 | **Mandan las 12 horas**, aunque crucen el corte | El corte existe para que la lista de espera alcance a reaccionar. Aplicarlo contra quien está reaccionando lo vuelve en contra de su propósito |
| V32 | **[F1]** R4 dice que una anulación no consume derecho. R1 cuenta las confirmadas. Un apartamento con sus 3 gastadas y una que se anula | **Recupera esa y queda en 1** | P5: lo que la administración quita no lo paga el residente |
| V33 | **[F1]** R4 vacía las listas de espera de un espacio bloqueado. R3 dice que el orden no lo altera nadie | Los de la lista vaciada pasan **al frente** de la franja equivalente siguiente, conservando su orden entre ellos | Es la solución menos injusta que encontramos, no una que salga de una regla. Se deja escrito así a propósito: si alguien encuentra una mejor, que sepa que aquí no había una razón fuerte |
| V34 | **[F1]** I2 dice que una reserva confirmada no cambia. R4 permite anularla por mantenimiento | **Anular no es cambiar**: la reserva conserva su horario y su historia, y cambia de estado con motivo y fecha | I2 protege el registro de lo que se prometió, no impide que la realidad lo invalide. La diferencia es que quede escrito quién y por qué |

---

## 2 · Por decidir

| # | La pregunta | Qué bloquea | Recomendación |
|---|---|---|---|
| **Q1** | ¿Se puede reservar para el mes siguiente, o solo dentro del mes en curso? Marta dijo "pues cuando abra" y no supo explicar cuándo abre | El frente 5 entero: el listado de R6 no significa nada si no se sabe contra qué ventana se compite | **Antes de abrirlo a los residentes.** Sospecho que la ventana es el problema real detrás de R6 — si abre el día 1 a las 00:00, los seis de siempre van a seguir ganando. Preguntar con el cuaderno delante |
| **Q2** | ¿Quién puede anular: cualquiera de la administración o solo Marta? | Nada hoy: la administración es una persona. Bloquea el día que entre alguien más | Cuando haya una segunda persona. Hoy sería inventar un modelo de permisos para un solo usuario |
| **Q3** | ¿El depósito se devuelve? ¿En cuánto tiempo? ¿Quién decide si se pierde? | R5 completo. Hoy el sistema solo dice si está registrado | Antes del frente 4. Es una conversación con el consejo, no con Marta, y esas se demoran |
| **Q4** | La terraza se presta a veces, por WhatsApp, y no está en la lista de espacios (V14) | Nada hoy. Pero si alguien la pide por el sistema y no está, va a asumir que no se presta | Cuando el sistema lleve un mes andando. Si para entonces Marta sigue prestándola aparte, es un espacio con reglas distintas y hay que preguntarle cuáles |
| **Q5** | ¿Qué pasa si un residente reserva y presta el espacio a alguien de otro apartamento? | Nada técnico. Es una regla del reglamento que puede o no existir | Preguntarle al consejo, no a Marta. Si existe y el sistema no la refleja, alguien va a usarlo para saltársela |

---

## 3 · Datos que faltan

| Qué falta | Qué desbloquea | A quién se le pide |
|---|---|---|
| Las franjas reales de cada espacio | El calendario entero. Hoy están puestas a ojo | Marta, del cuaderno |
| El monto del depósito y quién lo registra | R5 | El consejo de administración |
| El listado de apartamentos con su torre | Cargar el conjunto de verdad. Hoy hay 20 inventados | Marta, del Excel de cuotas |
| Cuántos apartamentos están sin residente activo | Saber si V16 es un caso real o teórico | Marta |

---

## Entradas corregidas

**V0 — decía que el tope era por apartamento y configurable. Es falso.** El tope es del
conjunto y es el mismo para todos. Salió de una mala lectura de la entrevista: Marta dijo
"cada apartamento tiene tres" y se entendió "cada apartamento tiene *su* número de tres".

Lo destapó construir la pantalla de administración, donde había que poner un campo por
apartamento y no tenía sentido llenarlo 240 veces. La entrada se deja escrita así, explicada
y no borrada: alguien va a leer una versión vieja de la especificación que la citaba.

---

## Lo que este archivo enseña

Treinta y cuatro decisiones, y **ninguna salió de la entrevista**. Marta contestó todo lo que
se le preguntó, y contestó bien: lo que pasa es que nadie —ni ella ni nosotros— sabía que
estas eran preguntas hasta que hubo algo a medio construir delante.

Fíjate en cuántas son la misma forma repetida sobre cosas distintas: **[B3]** aparece con las
franjas (V9), con el tope (V10) y otra vez con el horario copiado (V11). **[D1]** aparece
cuatro veces, siempre preguntando qué entra en una suma. Por eso el catálogo de
`lo-que-destapa-construir.md` vale más que este archivo: este es de un conjunto residencial,
el catálogo sirve para cualquier cosa.
