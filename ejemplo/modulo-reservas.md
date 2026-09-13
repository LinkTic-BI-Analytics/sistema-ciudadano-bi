# Reservar un espacio común — requerimiento

| | |
|---|---|
| **Código** | M02 |
| **Versión y fecha** | 1.0 · 2026-08-28 |
| **Salió de** | El MVP `reservas-conjunto`, commit `a7f31c2`, 2026-08-26 |
| **Depende de** | M01 — Apartamentos, residentes y pertenencia |
| **Lo usan** | M03 — Desistir y lista de espera · M05 — Lo que ve la administración |
| **Estado en el MVP** | construido y visto con gente |

---

## 1 · Qué resuelve

**Este módulo responde tres preguntas:**

1. ¿Está libre este espacio en esta franja?
2. ¿Cuántas reservas me quedan este mes?
3. ¿Quedó tomada, sin que nadie me confirme nada?

**Lo que NO resuelve.** Desistir de una reserva y la lista de espera van en M03. Los
bloqueos por mantenimiento y el depósito del salón, en M04. Ver la agenda de toda la semana,
en M05.

---

## 2 · A quién sirve y con qué ritmo

**Quién lo usa.** Un residente adulto de un apartamento del conjunto. No es de sistemas y no
va a leer instrucciones. En un conjunto de 240 apartamentos hay unos 400 residentes con
acceso, de los cuales reservan unos 60 al mes.

**El recorrido mínimo:**

1. Entra y escoge un espacio.
2. Ve el calendario de las próximas cuatro semanas con las franjas libres y tomadas.
3. Toca una franja libre.
4. Confirma, y ve cuántas le quedan del mes.

**Con qué frecuencia y por cuánto tiempo.** Entre semana, en la noche, desde el celular, en
menos de treinta segundos. Casi nunca desde un computador y casi nunca en horario de
oficina.

Esto condiciona la implementación más que cualquier requerimiento de esta lista: **si saber
si una franja está libre toma más de un par de segundos, el residente cierra y vuelve a
escribirle a la administradora por WhatsApp**, que es exactamente lo que este módulo existe
para evitar. En el MVP se midió: 110 ms de pantalla contra 17 ms de consulta. Lo lento no
era la base.

---

## 3 · Vocabulario

| Palabra del negocio | Qué es | Palabra que NUNCA va en pantalla |
|---|---|---|
| Espacio | Salón, cancha, BBQ, parqueadero de visitantes | — |
| Franja | El bloque de tiempo reservable de un espacio | — |
| Derecho mensual | Cuántas reservas le quedan al apartamento este mes | **derecho**, **cupo** |
| Aforo | Cuánta gente cabe en el espacio | **cupo** |
| Corte | Desde cuándo cancelar ya no devuelve el derecho | **corte** |

**Una palabra de la tercera columna que aparezca en una pantalla es un defecto.** En pantalla
se dice *"te quedan 2 este mes"* y *"puedes cancelar sin perderla hasta el jueves a las 6"*.

**"Cupo" está prohibida** porque significa dos cosas —cuánta gente cabe y cuántas veces
puede reservar el apartamento— y en el conjunto se usan las dos. Marta nunca se confunde;
un sistema sí.

**Definiciones.**

- **Franja**: bloque fijo por espacio. No se reserva por horas sueltas: el salón hay que
  entregarlo limpio entre un evento y otro.
- **Corte**: el jueves a las 6:00 p.m. de la semana en que cae la franja.
- **Mes**: calendario, del 1 al último día.

**Estados de una reserva** (lista completa):

| Estado | Qué significa | ¿Consume derecho? |
|---|---|---|
| `confirmada` | Tomada y vigente | sí |
| `usada` | La franja ya pasó | sí |
| `desistida_antes` | El residente canceló antes del corte | no |
| `desistida_despues` | El residente canceló después del corte | sí |
| `anulada` | La administración la quitó | no |

Este módulo produce `confirmada` y la transición a `usada`. Las otras tres las produce M03.

---

## 4 · `RF` — lo que el módulo hace

| ID | Requerimiento | Regla que lo gobierna | Prioridad |
|---|---|---|---|
| RF2 | Ver el calendario de un espacio con sus franjas libres y tomadas | R2 | imprescindible |
| RF3 | Reservar una franja libre | R1, I1 | imprescindible |
| RF4 | Ver cuántas reservas le quedan al apartamento este mes | R1 | imprescindible |
| RF11 | Ver hasta cuándo se puede cancelar sin perder la reserva | R2 | esperado |
| RF12 | Ver quién más del apartamento tiene reservas este mes | R1, I4 | puede esperar |

---

## 5 · `C` — cómo tiene que comportarse

| ID | Cualidad | Cómo se comprueba |
|---|---|---|
| C1 | **Un apartamento, un solo dato.** Dos residentes del mismo apartamento ven y mueven lo mismo | Dos sesiones del mismo apartamento muestran el mismo derecho disponible |
| C2 | **Una sola verdad.** El calendario del residente y el de la administración no pueden diferir | Reservar en una sesión y refrescar la otra: la franja aparece tomada |
| C3 | **Se usa desde el celular a las once de la noche** | El recorrido completo se hace con una mano en una pantalla de 390 px |
| C4 | **Nada depende de que alguien conteste.** El residente sabe si quedó, sin confirmación humana | La reserva queda `confirmada` en la misma operación, sin estado intermedio |

---

## 6 · `P` — la postura de diseño

| ID | Principio | Consecuencia práctica |
|---|---|---|
| P1 | **Nada se inventa** | Un apartamento sin residentes activos no puede reservar, pero conserva su derecho. No se le pone 0 ni se le pone 3 "por si acaso": no hay quién reserve, y ya |
| P3 | **El sistema no decide, pero tampoco deja solo** | Cuando una franja está tomada no basta con "no disponible": se muestran las franjas libres más cercanas del mismo espacio |
| P4 | **Quien espera primero, va primero** | El orden importa incluso aquí: dos solicitudes simultáneas se resuelven por orden de llegada, no por quién refrescó |

---

## 7 · `R` — las reglas

### R1 — Derecho mensual del apartamento

Decide cuántas reservas puede tomar un apartamento en un mes.

```
disponible = tope_mensual − confirmadas − usadas − desistidas_despues
```

- **`tope_mensual`**: 3. Es del conjunto, igual para todos los apartamentos. No es
  configurable por apartamento.
- **`confirmadas`**, **`usadas`**, **`desistidas_despues`**: reservas de **ese apartamento**
  cuya franja cae en el mes calendario en curso.
- Las `desistidas_antes` y las `anuladas` no entran en la cuenta.

| Caso | Disponible |
|---|---|
| Ninguna reserva | 3 |
| Una usada, una desistida antes del corte | 2 |
| Una usada, una desistida después del corte | 1 |
| Una usada, una anulada por la administración | 2 |
| Tres usadas | 0 |

**Por qué el derecho es del apartamento y no de la persona.** Un apartamento con cuatro
adultos tendría cuatro veces más derecho que uno con una persona sola, y el salón es uno
solo. De aquí sale I4, y de I4 sale el orden de construcción: la pertenencia se modela antes
que la primera reserva.

**Por qué la franja que pasó sin usarse consume derecho.** Si no consumiera, quien reserva y
no va sale igual que quien no reservó — y el salón queda vacío un sábado con alguien más que
lo quería.

**Qué pasa si falta un dato.** Un apartamento sin residentes dados de alta no puede reservar
y conserva sus 3: cuando alguien se dé de alta, los tiene completos.

Se deriva de P4. Sostiene a I4.

### R2 — El corte

Decide hasta cuándo cancelar devuelve el derecho.

El corte es el **jueves a las 6:00 p.m. de la semana calendario en que cae la franja**.
Desistir antes del corte devuelve el derecho; desistir después, no.

| Franja | Corte |
|---|---|
| Sábado 12 de septiembre | jueves 10 de septiembre, 6:00 p.m. |
| Martes 8 de septiembre | jueves 3 de septiembre, 6:00 p.m. |

**Por qué hay corte.** Sin él, desistir el sábado a las 8:00 a.m. sale gratis y el salón
queda vacío ese sábado. El corte no castiga: le da a la lista de espera tiempo de reaccionar
y a la familia que recibe, tiempo de organizarse.

**Por qué el jueves y no el viernes.** Se probó con viernes en el MVP: quien recibía el cupo
el viernes en la noche no alcanzaba a conseguir comida ni a avisarle a nadie para el sábado.

**Por qué una franja de martes también corta el jueves anterior.** Marta pidió una sola regla
en vez de dos. Es menos preciso y es más fácil de recordar, y ella es quien la va a explicar
240 veces.

**Este módulo solo muestra el corte** (RF11). Aplicarlo es de M03.

Se deriva de P3.

---

## 8 · `I` — lo que debe ser imposible

**La que manda sobre todas es I1**, y su incumplimiento no se puede reparar: dos familias
llegan el mismo sábado con el grado del hijo y una se tiene que ir. No hay compensación, no
hay descuento, no hay "se lo damos el otro fin de semana" que sirva. Todo lo demás de este
módulo se puede corregir; esto no.

| # | Invariante | De dónde sale | Qué costó |
|---|---|---|---|
| I1 | **Un espacio nunca queda reservado dos veces para la misma franja.** | La suprema | Pasó dos veces en un año con el cuaderno. La segunda vez la familia ya había contratado el pastel |
| I2 | **Una reserva confirmada no cambia.** Cambiar las franjas de un espacio o el tope mensual no toca lo que ya se reservó | P2 | Sin esto, el histórico de quién usó qué no significa nada |
| I4 | **El derecho es del apartamento, no de la persona.** | R1 | Si se amarra a la persona, dos residentes del mismo apartamento sacan cada uno sus tres |

**Sobre I1, para quien lo implemente.** Dos solicitudes simultáneas de la misma franja tienen
que resolverse de forma que **exactamente una** quede confirmada. Comprobar disponibilidad y
después escribir, en dos pasos, no cumple I1 por rápido que sea: entre los dos pasos cabe la
otra solicitud. Cómo se garantice —una restricción de unicidad, un bloqueo, una transacción
serializable— lo decide el equipo; que se garantice, no.

---

## 9 · Contrato con el resto del sistema

**Qué recibe**

| Dato | De qué módulo | Qué pasa si no llega |
|---|---|---|
| A qué apartamento pertenece quien entró | M01 | No se puede reservar. Es un fallo, no un caso de negocio |
| Si el residente está activo | M01 | Se trata como inactivo: no reserva |
| Las franjas configuradas de cada espacio | M04 | El calendario aparece vacío y lo dice; no se inventan franjas (P1) |
| Los bloqueos vigentes del espacio | M04 | Las franjas bloqueadas se ofrecerían como libres. **Es la falla más grave posible de este módulo** |

**Qué entrega**

| Dato | Quién lo consume | Con qué frecuencia cambia |
|---|---|---|
| La reserva confirmada | M03, M05 | Decenas de veces al día |
| El derecho disponible del apartamento | M05 | Con cada reserva y cada desistimiento |
| La ocupación de una franja | M03, M05 | Constante |

**Qué asume garantizado por otro**

| Afirmación | Quién la garantiza | Qué se rompe si es falsa |
|---|---|---|
| Un residente pertenece a un solo apartamento | M01 | El derecho se cuenta contra el apartamento equivocado y I4 se rompe |
| Las franjas de un espacio no se solapan entre sí | M04 | I1 se rompe sin que este módulo pueda evitarlo |
| Un apartamento pertenece a un solo conjunto | M01 | El aislamiento entre conjuntos, si algún día hay más de uno |

---

## 10 · Cómo se verifica

Las fórmulas se comparan contra números calculados a mano, nunca contra lo que el sistema
devolvió la primera vez.

| Caso | Resultado |
|---|---|
| Apartamento sin reservas este mes | disponible 3 |
| Una usada y una desistida el martes de la semana de su franja | disponible 2 |
| Una usada y una desistida el viernes de la semana de su franja | disponible 1 |
| Una usada y una anulada por mantenimiento | disponible 2 |
| Tres usadas, intento de reservar una cuarta | se rechaza, y dice que le quedan 0 y desde cuándo vuelve a tener |
| Dos solicitudes de la misma franja en el mismo instante | exactamente una queda confirmada; la otra recibe que ya está tomada |
| Dos residentes del mismo apartamento piden la misma franja | la segunda se rechaza diciendo que su apartamento ya la tiene |
| Franja del sábado 12, consultada el miércoles 9 | dice que se puede cancelar sin perderla hasta el jueves 10 a las 6:00 p.m. |
| Franja del martes 8, consultada el lunes 7 | dice que ya pasó el plazo: el corte fue el jueves 3 |
| Se cambian las franjas del salón de 2–7 p.m. a 3–8 p.m. | las reservas ya confirmadas siguen siendo de 2 a 7 |
| Se baja el tope de 3 a 2 el día 20 | quien ya tiene 3 este mes las conserva; el mes entrante son 2 |
| Apartamento sin residentes activos | no puede reservar; su disponible sigue en 3 |
| Espacio sin franjas configuradas | el calendario dice que no hay franjas configuradas; no muestra ninguna |
| Franja dentro de un bloqueo vigente | no se ofrece como libre |
| Residente de otro conjunto pidiendo la ocupación de este | no la obtiene, ni sabe que existe |

**Fallas que ya ocurrieron.**

- El salón quedó doble reservado dos veces en un año con el cuaderno (I1).
- En el MVP, la primera versión comprobaba disponibilidad y después escribía. Con dos
  pestañas abiertas se lograron dos reservas de la misma franja en la primera prueba (I1).
- El primer cálculo del corte usaba la fecha en que se reservó, no la de la franja. Reservar
  con dos meses de anticipación daba dos meses de cancelación gratis (R2, vacío V23).

---

## 11 · Los datos que este módulo necesita

Esto no dice tablas ni motor de base de datos: dice qué tiene que poder existir, de quién es
y cuánto tiene que durar.

| Cosa | Qué representa | Pertenece a | Ciclo de vida | ¿Se borra? |
|---|---|---|---|---|
| Espacio | Salón, cancha, BBQ, parqueadero | El conjunto | Se apaga cuando deja de existir | **No.** El histórico lo sigue citando |
| Franja | El bloque reservable de un espacio | El espacio | Se agrega y se retira; retirarla no toca reservas confirmadas (I2) | No |
| Reserva | Una franja tomada por un apartamento | El apartamento **y** la franja | `confirmada` → `usada`; las demás transiciones son de M03 | **Nunca.** Es el histórico del que salen los indicadores |
| Derecho disponible | Cuántas le quedan al apartamento este mes | El apartamento | Se calcula, no se guarda | — |

**Sobre el derecho disponible.** Se calcula a partir de las reservas, no se lleva como un
contador. Un contador y una lista de reservas son dos verdades sobre lo mismo, y cuando se
separan —y se separan— nadie sabe cuál es la buena (C2).

**Sobre la unicidad.** Tiene que ser imposible que existan dos reservas vigentes de la misma
franja. Es I1 y no es una validación de formulario: es una restricción sobre los datos.

---

## 12 · Lo que el MVP probó y lo que no

**Visto con gente de verdad.**

- **Marta**, la administradora, dos sesiones de 40 minutos. Encontró que el calendario no
  decía **quién** tenía cada franja, solo que estaba ocupada — y eso es lo primero que le
  preguntan por WhatsApp. De ahí salió RF7, que quedó en M05.
- **Dos residentes**, una sesión cada uno, desde su propio celular. Los dos entendieron el
  calendario sin explicación. Los dos preguntaron *"¿y estas 2 que me quedan incluyen la que
  cancelé?"* — de ahí salió RF11 y la redacción de la pantalla.

**Asumido y nunca visto.**

- **RF12** (ver qué reservas tiene el resto del apartamento) se diseñó y no se construyó.
  Nadie lo pidió; se dedujo de I4.
- **El comportamiento con 400 residentes** no se probó. El MVP corrió con 12 apartamentos
  sembrados.
- **Un apartamento sin residentes activos** no se probó con gente: solo existe como caso en
  la §10.
- **Nadie usó esto un mes entero.** Todo lo que dice este documento sobre el ritmo mensual
  —R1, el listado de quién no alcanza— es lo que dijo Marta del cuaderno, no observación.

---

## 13 · Lo que queda abierto

| La pregunta | Qué bloquea | Recomendación | Cuándo se vuelve urgente |
|---|---|---|---|
| ¿Se puede reservar para el mes siguiente, o solo dentro del mes en curso? | Saber contra qué ventana se compite | Preguntarle a Marta con el cuaderno delante. Sospechamos que la ventana es el problema real detrás de que los mismos seis apartamentos ganen siempre | **Antes de abrirlo a los residentes.** Después ya hay costumbre y cambiarla es una pelea |
| ¿El tope de 3 podría variar por espacio? | Nada hoy | No construirlo hasta que alguien lo pida | Cuando el conjunto agregue un espacio muy disputado |

---

## 14 · Orden de construcción sugerido

| Orden | Parte | Códigos | Por qué va aquí |
|---|---|---|---|
| 1 | La unicidad de la franja | I1 | **No es negociable.** Se construye antes que la primera reserva |
| 2 | El calendario de un espacio | RF2 | Sin ver, no hay qué reservar |
| 3 | Reservar y el conteo del derecho | RF3, RF4, R1 | El recorrido mínimo queda cerrado aquí |
| 4 | Mostrar el corte | RF11, R2 | Salió de las sesiones; no bloquea a nadie |
| 5 | Reservas del resto del apartamento | RF12 | Nadie lo pidió |

**Lo que no es negociable:** el punto 1. La restricción que impide la doble reserva se
construye antes que la primera reserva, no después. Agregarla encima de datos que ya existen
obliga a revisar cada camino de escritura escrito hasta ese momento, y basta con que uno se
escape para que I1 vuelva a romperse — que es exactamente como pasó en el cuaderno.

---

## 15 · Anexo — cómo se veía en el MVP

**No es un diseño obligatorio. Es evidencia.**

- `calendario-espacio.png` — cuatro semanas en columnas, las franjas en filas. Los dos
  residentes lo entendieron sin explicación; Marta pidió ver quién tenía cada una.
- `confirmar-reserva.png` — la pantalla de confirmar, con *"te quedan 2 este mes"*. Es la
  frase que produjo la pregunta de la que salió RF11.

---

## La prueba del sobre cerrado

- [x] Cada código que se cita se resuelve adentro de este archivo.
- [x] Cada `R` tiene al menos un caso en la §10.
- [x] Cada `I` dice qué se rompe cuando falla.
- [x] No queda ninguna referencia a un archivo que el equipo no recibió.
- [x] Nadie tiene que preguntar qué significa una palabra.
