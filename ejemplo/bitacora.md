# Bitácora de construcción

**Cómo se cierra un frente:** todas las casillas marcadas, los casos de la §9 de la
especificación probados —no a ojo—, `vacios.md` actualizado, y rastro en la cuenta demo.

| Frente | Qué cubre | Reglas | Estado |
|---|---|---|---|
| 1 | Apartamentos, residentes y pertenencia | I4, C1 | listo |
| 2 | Espacios, franjas y reservar | R1, R2, I1, I2 | listo |
| 3 | Desistir, anular y lista de espera | R3, R4, I3, I5 | siguiente |
| 4 | Bloqueos y depósito | R4, R5, P1 | — |
| 5 | Lo que ve la administración | RF7, R6 | — |

---

## Frente 1 — Apartamentos, residentes y pertenencia

`I4`, `C1` · es lo que hace imposible que dos residentes del mismo apartamento saquen cada
uno su propio derecho

**Los pasos, en el orden en que se acordaron**

| # | El paso | Quién lo escogió | Qué destapó |
|---|---|---|---|
| 1 | La lista de los 240 apartamentos, para poder entrar como uno | Marta, entre esa y "la pantalla de dar de alta a un residente" | Que el `.csv` traía el estado de cartera de cada apartamento, que nadie había mencionado en la entrevista |
| 2 | Entrar como residente y ver cuál es mi apartamento | Marta | Que dos residentes del 502 tenían que ver y mover exactamente lo mismo. De ahí salió `I4` |
| 3 | Dar de alta a un residente, desde la administración | Marta, después de mirar el paso 2 | Que el alta la hace solo ella: no hay registro abierto, porque la portería ya valida quién vive dónde (`D3`) |

> El paso 2 se escogió porque Marta quería ver "lo que ve el residente" antes que lo que ve
> ella. Fue la decisión correcta y no era la que estaba en la lista: el orden de los pasos lo
> pone quien va a usar el sistema, no quien lo construye.

**El apartamento es la unidad, no la persona.** Va primero por eso: no es una restricción
sobre una tabla, es de quién es cada cosa en todas. Se decidió antes de escribir la primera
línea y no se volvió a tocar.

**Los residentes no se borran.** Marta preguntó qué pasa cuando alguien se muda. Si se
borrara, las reservas viejas de esa persona quedarían sin dueño y el histórico del que sale
R6 dejaría de servir. Se dan de baja con fecha.

**Base de datos**

- [x] Apartamentos, con su número y su torre
- [x] Residentes, cada uno perteneciendo a un apartamento
- [x] La restricción de que un residente pertenece a exactamente uno (I4)
- [x] Baja con fecha, sin borrado

**Aplicación**

- [x] Entrar con número de apartamento y clave
- [x] Ver quién más está en mi apartamento

**Verificación**

- [x] 14 comprobaciones de pertenencia y aislamiento
- [x] Recorrido a mano con dos residentes del mismo apartamento

**Casos de la §9 que este frente cierra**

- [x] «Apartamento sin residentes dados de alta» → no puede reservar, conserva sus 3
- [x] «Un apartamento pidiendo ver las reservas de otro conjunto» → no las obtiene

**Rastro en la cuenta demo**

- [x] 20 apartamentos, 34 residentes, 3 de ellos dados de baja

**Lo que NO entra**

- Permisos por residente. Todos los de un apartamento pueden lo mismo (C1). Ponerlos ahora
  sería inventar un modelo para un problema que nadie ha tenido.
- Recuperar la clave. No hay correos cargados; lo hace Marta a mano.

---

## Frente 2 — Espacios, franjas y reservar

`R1`, `R2` · e `I1`, que es la invariante suprema y se hace imposible **desde el primer día
de este frente**, no después

**La unicidad se construyó antes que la pantalla de reservar.** No al revés. Es la regla de
`metodo/frentes.md`: la invariante suprema se hace imposible en el mismo frente donde nacen
los datos que podría violar.

**El derecho disponible se calcula, no se guarda.** Un contador y una lista de reservas son
dos verdades sobre lo mismo, y cuando se separan nadie sabe cuál es la buena (C2).

**Base de datos**

- [x] Espacios y franjas
- [x] Reservas, con sus cinco estados
- [x] La restricción de unicidad de franja vigente (I1)
- [x] El cálculo del derecho disponible (R1)

**Aplicación**

- [x] Calendario de cuatro semanas por espacio
- [x] Reservar una franja libre
- [x] "Te quedan N este mes"
- [x] "Puedes cancelar sin perderla hasta el jueves a las 6" (R2)

**Verificación**

- [x] 22 comprobaciones, incluidas las dos solicitudes simultáneas
- [x] Sesiones con Marta (2 × 40 min) y con dos residentes

**Casos de la §9 que este frente cierra**

- [x] «Dos solicitudes de la misma franja al mismo tiempo» → una confirmada, la otra no
- [x] «Tope 3, una usada y una desistida el martes de esa semana» → disponible 2
- [x] «Se cambian las franjas del salón de 2–7 a 3–8» → las confirmadas siguen de 2 a 7
- [x] «Franja del martes, desistida el miércoles anterior» → el derecho se devuelve

**Rastro en la cuenta demo**

- [x] 4 espacios con sus franjas, y 3 meses de reservas hacia atrás con algunas usadas

**Lo que estaba roto y salió al usarlo**

| Qué | Cómo se vio |
|---|---|
| Se lograron dos reservas de la misma franja | La primera versión comprobaba disponibilidad y después escribía, en dos pasos. Con dos pestañas abiertas salió en el primer intento. **Rompía I1** |
| El corte daba dos meses de cancelación gratis | Se calculaba sobre la fecha en que se reservó, no sobre la de la franja. Lo vio Marta, no una prueba (vacío V23) |
| El calendario no decía **quién** tenía cada franja | Marta: *"y esto está ocupado, ¿pero de quién?"* — es lo primero que le preguntan por WhatsApp. De ahí salió RF7, que se dejó para el frente 5 |

**Lo que NO entra**

- Desistir. Va en el frente 3: necesita la lista de espera para que I3 tenga sentido, y sin
  ella desistir dejaría la franja libre para cualquiera.
- Ver las reservas del resto del apartamento (RF12). Nadie lo pidió; se dedujo de I4.
