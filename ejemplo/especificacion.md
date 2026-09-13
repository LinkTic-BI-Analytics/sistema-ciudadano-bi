# Reservas de espacios comunes — Especificación

Qué se mide, con qué reglas y qué tiene que ser imposible. Este documento no dice cómo se
construye: se sostiene solo y sobrevive a cualquier decisión de implementación.

---

## 1. Objetivo

Que los 240 apartamentos de un conjunto reserven los espacios comunes sin pasar por el
WhatsApp de la administradora, y que la administración sepa en todo momento quién tiene qué
sin llevar un cuaderno.

### El sistema responde seis preguntas

1. ¿Está libre el salón el sábado?
2. ¿Cuántas reservas me quedan este mes?
3. ¿Quién tiene reservado cada espacio esta semana?
4. Si está ocupado, ¿me puedo anotar y en qué puesto voy?
5. ¿Qué pasa si cancelo, y hasta cuándo puedo hacerlo sin perder la reserva?
6. ¿Qué apartamentos se están quedando sin poder reservar nunca?

### Granularidad

La unidad de **decisión** es la franja: "Salón social, sábado 2 a 7 p.m.". No se reserva por
horas sueltas, y esa restricción es del negocio, no del sistema — el salón hay que entregarlo
limpio entre un evento y otro, y con horas sueltas nadie sabe a quién le toca.

La unidad de **captura** es la solicitud del residente, una por una, desde el celular.

### Fuera de alcance

Cobrar el depósito del salón: se sigue pagando en la administración. El sistema solo refleja
si está pagado, y solo si alguien lo registró (P1).

Invitados sin apartamento. Todo el que reserva pertenece a uno.

---

## 2. Requerimientos

### Lo que el sistema hace

| ID | Requerimiento | Regla que lo gobierna | Estado |
|---|---|---|---|
| RF1 | Entrar con el número de apartamento y una clave | I4, C1 | listo |
| RF2 | Ver el calendario de un espacio con sus franjas libres y tomadas | R2 | listo |
| RF3 | Reservar una franja libre | R1, I1 | listo |
| RF4 | Ver cuántas reservas le quedan al apartamento este mes | R1 | listo |
| RF5 | Desistir de una reserva propia y ver si el derecho se devuelve | R2, I3 | listo |
| RF6 | Anotarse en la lista de espera de una franja tomada, y ver el puesto | R3 | listo |
| RF7 | Ver quién tiene reservado cada espacio esta semana | — | listo |
| RF8 | Anular una reserva desde la administración, con motivo | R4, I5 | listo |
| RF9 | Bloquear un espacio por mantenimiento, sin consumirle el derecho a nadie | R4, I5 | listo |
| RF10 | Ver qué apartamentos no han logrado reservar en los últimos tres meses | R6 | pendiente |
| RF11 | Ver hasta cuándo se puede cancelar sin perder el derecho | R2 | listo |
| RF12 | Ver quién más del apartamento tiene reservas este mes | R1, I4 | pendiente |

**RF7 no tiene regla detrás, y se deja a la vista.** Es la agenda de la semana que Marta
pide para contestar el WhatsApp: nadie escribió con qué criterio se arma ni qué muestra de
las reservas ajenas. O sobra, o esconde una regla que falta preguntar.

**RF11 y RF12 no salieron de la entrevista, salieron de mirar el MVP.** Los dos residentes
preguntaron *"¿estas 2 que me quedan incluyen la que cancelé?"* — de ahí RF11. RF12 se
dedujo de I4 y nadie lo ha pedido. Subieron aquí desde `vacios.md`, que es lo que impide
que la especificación envejezca mientras el sistema aprende.

### Cómo tiene que comportarse

| ID | Cualidad |
|---|---|
| C1 | **Un apartamento, un solo dato.** Las reservas pertenecen al apartamento, no a quien las sacó. Dos residentes del 502 ven y mueven exactamente lo mismo (I4). |
| C2 | **Una sola verdad.** Que el calendario del residente y el de la administración muestren cosas distintas tiene que ser imposible, no improbable. |
| C3 | **Se usa a las once de la noche desde el celular.** Es cuando la gente reserva. Si algo solo funciona en el computador de la portería, no funciona. |
| C4 | **Nada depende de que Marta conteste.** El residente reserva y sabe si quedó, sin esperar confirmación humana. Es todo el punto: hoy espera un "listo" por WhatsApp. |

---

## 3. Principios

| # | Principio | Consecuencia práctica |
|---|---|---|
| P1 | **Nada se inventa** | Si nadie registró el depósito, el salón aparece como "sin registro de pago", no como pagado ni como debiendo. Un estado inventado es peor que uno vacío. |
| P2 | **El pasado no se edita** | Lo que ya pasó se registra, no se corrige. Cambiar las franjas de un espacio no toca lo que ya está reservado. |
| P3 | **El sistema no decide, pero tampoco deja solo** | Cuando una franja está tomada, no basta con decir "no disponible": se ofrece la lista de espera y las franjas libres más cercanas. |
| P4 | **Quien espera primero, va primero** | El orden de la lista de espera es el de llegada y no lo altera nadie, ni la administración. Es lo único que hace creíble la lista. |
| P5 | **Lo que la administración quita no lo paga el residente** | Una anulación por mantenimiento nunca consume el derecho de nadie. |

---

## 4. Glosario

### Del dominio a la pantalla

El glosario es el idioma del dominio. **No es el idioma de la aplicación.** Una palabra de
la columna izquierda que aparezca en una pantalla es un defecto.

| En el dominio | En la pantalla |
|---|---|
| Derecho mensual | **cuántas te quedan** — "Te quedan 2 este mes" |
| Corte | **hasta cuándo puedes cancelar sin perderla** |
| Aforo | **cuánta gente cabe** |
| Bloque ocupado | (no se nombra: se ve el calendario) |

### Definiciones

- **Franja**: el bloque de tiempo reservable de un espacio. Fija por espacio, no se parte.
- **Corte**: el jueves a las 6:00 p.m. de la semana en que cae la franja.
- **Derecho mensual**: cuántas reservas le quedan al apartamento en el mes calendario.
- **Desistir**: cancela el residente. **Anular**: cancela la administración.

### Estados de una reserva

| Estado | Qué significa | Consume derecho |
|---|---|---|
| `confirmada` | Tomada y vigente | sí |
| `usada` | La franja ya pasó | sí |
| `desistida_antes` | El residente canceló antes del corte | no |
| `desistida_despues` | El residente canceló después del corte | sí |
| `anulada` | La administración la quitó | no |

---

## 5. Reglas de negocio

### R1 — Derecho mensual del apartamento

```
disponible = tope_mensual − confirmadas − usadas − desistidas_despues
```

El **tope** es 3 por mes calendario y es del conjunto, no del apartamento. Las anuladas por
la administración no entran en la cuenta (P5).

| Caso | Disponible |
|---|---|
| Tope 3, ninguna reserva | 3 |
| Tope 3, una usada, una desistida el martes (antes del corte) | 2 |
| Tope 3, una usada, una desistida el viernes (después del corte) | 1 |
| Tope 3, una usada, una anulada por mantenimiento | 2 |

**Por qué el derecho es del apartamento y no de la persona.** Un apartamento con cuatro
adultos tendría cuatro veces más derecho que uno con una persona sola, y el salón es uno
solo. Esto es I4 y decide el orden de construcción: la pertenencia se modela antes que la
primera reserva.

**Qué pasa si falta un dato.** Un apartamento sin residentes dados de alta no puede
reservar, pero conserva su derecho: cuando alguien se dé de alta, tiene sus 3.

Se deriva de P4 y sostiene a I4.

### R2 — El corte

El corte es el **jueves a las 6:00 p.m. de la semana en que cae la franja**. Desistir antes
devuelve el derecho; desistir después, no.

**Por qué hay corte.** Sin él, desistir el sábado a las 8:00 a.m. sale gratis y el salón
queda vacío un sábado. El corte no castiga: le da a la lista de espera tiempo de reaccionar
y a la familia que espera, tiempo de organizarse.

**Por qué el jueves y no el viernes.** Se probó con viernes y no alcanzaba: quien recibe el
cupo el viernes en la noche no logra conseguir comida ni avisarle a nadie para el sábado.

**Una franja entre semana también tiene corte el jueves anterior**, aunque sea de martes.
Marta dijo que es más fácil de recordar una sola regla que dos.

### R3 — La lista de espera

Cuando una franja tomada se libera —por desistimiento o por anulación— pasa **al primero de
la lista de espera**, en el mismo acto (I3).

El orden es el de llegada y no lo altera nadie (P4). Quien recibe una franja de la lista
tiene 12 horas para confirmarla; si no, pasa al siguiente.

**Por qué 12 horas y no 24.** Con 24, una franja liberada el viernes llegaba a su dueño el
sábado en la mañana. Con 12, alcanza a dar dos saltos.

### R4 — Bloqueos de la administración

La administración puede inhabilitar un espacio por un rango de fechas. Las reservas que
caigan adentro quedan `anulada`, **no consumen derecho** (P5), y sus apartamentos pasan
automáticamente al frente de la lista de espera de la siguiente franja equivalente.

### R5 — El depósito del salón social

El salón social exige un depósito. El sistema **no lo cobra**: solo refleja si alguien lo
registró. Un salón reservado sin registro de depósito aparece marcado, y Marta decide (P1,
P3).

### R6 — Apartamentos que nunca alcanzan

Un apartamento que lleva tres meses intentando y no ha logrado ninguna reserva aparece en un
listado para la administración.

**Por qué existe esta regla.** Salió del cuaderno: los mismos seis apartamentos reservaban
el salón casi siempre, porque pedían apenas se abría el mes. Sin esta lista nadie lo ve, y
es exactamente el tipo de cosa por la que la gente deja de creer en el sistema.

---

## 6. Invariantes

**La que manda sobre todas: I1.** Es la única cuyo incumplimiento no se puede reparar. Dos
familias llegan el mismo sábado con el grado del hijo y una se tiene que ir; no hay
compensación, no hay descuento, no hay "se lo damos el otro fin de semana" que sirva.

| # | Invariante | Por qué |
|---|---|---|
| I1 | **Un espacio nunca queda reservado dos veces para la misma franja.** | La suprema. Pasó dos veces en el cuaderno, en marzo y en agosto. La segunda vez la familia había contratado el pastel. |
| I2 | **Una reserva pasada no cambia.** Cambiar las franjas o el tope no toca lo que ya se reservó. | P2. Si el pasado se puede editar, el histórico de quién usó qué no significa nada, y de ahí sale R6. |
| I3 | **Desistir y asignarle la franja al primero de la lista son un solo acto.** | R3. Separados, la franja queda libre unos segundos y se la lleva alguien que no estaba esperando. Quien esperó tres semanas ve que se la quitaron, y no vuelve a anotarse. |
| I4 | **El derecho es del apartamento, no de la persona.** | R1. Si se amarra a la persona, dos residentes del mismo apartamento sacan cada uno su cupo. |
| I5 | **Una anulación de la administración nunca consume derecho.** | P5. En el cuaderno se cobraron cupos que la administración misma había quitado por mantenimiento, y fue la queja más repetida del año. |

---

## 8. Rituales

- **El residente**, desde el celular, casi siempre entre semana en la noche. Treinta
  segundos: mirar si está libre y tomarlo. La pregunta que trae es siempre la misma:
  *"¿alcanzo a coger la cancha el domingo?"*.
- **Marta**, todas las mañanas, desde el computador de la portería. Cinco minutos: ver qué
  hay hoy y qué hay el fin de semana, para avisarle al portero.
- **Marta, el primer lunes de cada mes**, veinte minutos: revisar quién no ha alcanzado
  nunca (R6) y los depósitos sin registrar (R5).

---

## 9. Cómo se verifica

Las fórmulas se comparan contra números calculados a mano, nunca contra lo que el sistema
devolvió la primera vez.

| Caso | Resultado |
|---|---|
| Apartamento con tope 3 y ninguna reserva | disponible 3 |
| Tope 3, una usada y una desistida el martes de esa semana | disponible 2 |
| Tope 3, una usada y una desistida el viernes de esa semana | disponible 1 |
| Tope 3, una usada y una anulada por mantenimiento | disponible 2 |
| Franja del martes, desistida el miércoles anterior | el derecho se devuelve: el corte fue el jueves de la semana anterior |
| Dos solicitudes de la misma franja al mismo tiempo | una queda confirmada y la otra no; nunca las dos |
| Franja tomada que se desiste con dos en lista de espera | queda del primero, y el segundo pasa a puesto 1, en la misma operación |
| El primero de la lista no confirma en 12 horas | pasa al segundo; el primero no consume derecho |
| Se cambian las franjas del salón de 2–7 a 3–8 | las reservas ya confirmadas siguen de 2 a 7 |
| Se baja el tope de 3 a 2 el día 20 | quien ya tiene 3 este mes las conserva; el mes entrante son 2 |
| Bloqueo del salón del 10 al 15 con dos reservas adentro | las dos quedan anuladas, ninguna consume derecho, y los dos apartamentos quedan de primeros en la lista de la franja equivalente |
| Salón reservado sin registro de depósito | aparece marcado, no se rechaza |
| Apartamento sin residentes dados de alta | no puede reservar, conserva sus 3 |
| Un apartamento pidiendo ver las reservas de otro conjunto | no las obtiene, ni sabe que existen |
| Apartamento con 4 intentos y 0 reservas en 3 meses | aparece en el listado de R6 |

### Fallas que este dominio produce

Ninguna salta a la vista, y las tres ocurrieron con el cuaderno:

- El salón quedó doble reservado dos veces en un año (I1). La segunda vez la familia ya
  había contratado el pastel.
- Se cobraron cupos que la administración había quitado por mantenimiento (I5). Fue la queja
  más repetida.
- Los mismos seis apartamentos se llevaban el salón casi siempre, porque pedían apenas se
  abría el mes, y nadie lo veía (R6).

---

## 10. Estado

Los frentes 1 y 2 están construidos y se vieron con Marta y con dos residentes. Del 3 en
adelante, nada.

| Orden | Frente | Reglas | Estado |
|---|---|---|---|
| 1 | Apartamentos, residentes y pertenencia | I4, C1 | validado |
| 2 | Espacios, franjas y reservar | R1, R2, I1, I2 | validado |
| 3 | Desistir, anular y lista de espera | R3, R4, I3, I5 | pendiente |
| 4 | Bloqueos y depósito | R4, R5, P1 | pendiente |
| 5 | Lo que ve la administración | RF7, R6 | pendiente |
| 6 | Que el residente sepa en qué puesto va de la lista de espera | R3 | **agregado** |

**La lista cambió al validar el frente 2, y así se ve cuando cambia.** El frente 6 no existía:
salió de que Hernán, mirando la pantalla de reservar, preguntó *"¿y si no alcanzo, cómo sé si
voy de primero?"*. Se agregó al final y no en medio — si de verdad urgiera, se reordenaría y
se vería que se reordenó.

**El orden no es negociable en sus dos primeros puntos, y por razones distintas.**

**El frente 1 es la pertenencia al apartamento**, y va primero porque no es una restricción
sobre una tabla: es de quién es cada cosa, en todas. Si se arranca amarrando reservas a
personas, dos residentes del 502 sacan cada uno sus tres, y arreglarlo después obliga a
revisar cada consulta escrita hasta ese momento — basta con que una se escape.

**I1, la invariante suprema, va en el frente 2** y no en el 1, porque para violarla tienen
que existir espacios, franjas y reservas, y en el frente 1 no existe ninguno. Lo que no es
negociable es que vaya **desde el primer día del frente 2**: no se construye "reservar" y
después se le agrega la restricción que impide la doble reserva. Así fue como pasó en el
cuaderno, y así fue como pasó otra vez en la primera versión del MVP.

De ahí en adelante el orden es por dependencias: la lista de espera necesita que exista
desistir, y los bloqueos necesitan que exista anular.

---

## 11. Lo que falta cargar

| Qué falta | Qué desbloquea | Qué se puede construir sin esto |
|---|---|---|
| Las franjas reales de cada espacio | Que el calendario muestre la verdad | Todo `R2` y el calendario entero, con las franjas puestas a ojo y **dicho en pantalla que son provisionales**. Cambiarlas después es cargar una tabla |
| El monto del depósito del salón y quién lo registra | El cálculo de `R5` | La marca de "salón reservado sin depósito registrado", que es lo que Marta mira. El monto solo hace falta para cobrarlo, y el sistema no cobra |
| Cuántos apartamentos hay sin residente activo | Saber si `R1` con apartamento vacío es un caso real o teórico | Nada se construye distinto: la regla ya lo contempla. **Este dato no bloquea, informa** — dice si vale la pena hacerle una pantalla al caso |
