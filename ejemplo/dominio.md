# Dominio

Las reglas viven en **[especificacion.md](especificacion.md)**. Este archivo es el mapa
corto. Si algo choca entre los dos, manda la especificación.

## Qué es esto

Un sistema para que los residentes de un conjunto reserven los espacios comunes desde el
celular, y para que la administración deje de llevar la agenda en un cuaderno y un grupo de
WhatsApp.

## El usuario

- **Quién es:** Marta, la administradora, 41 años, lleva el conjunto hace seis. Y los 240
  apartamentos, que son quienes reservan.
- **Qué problema tiene hoy:** las reservas se piden por WhatsApp a cualquier hora, ella las
  anota en un cuaderno, y no tiene forma de saber si un apartamento ya usó sus tres del mes.
  Dos veces se le pasó y quedó el salón doble reservado.
- **Cómo lo resuelve sin nosotros:** un cuaderno de contabilidad con una hoja por semana, y
  el grupo de WhatsApp del conjunto donde la gente pide y ella confirma con un "listo".

## El recorrido mínimo

De "entra por primera vez" a "ya obtuvo valor":

1. El residente entra con el número de su apartamento y una clave que le dio la
   administración.
2. Ve el calendario de un espacio y qué franjas están libres.
3. Reserva una franja y ve cuántas le quedan del mes.
4. Marta ve la reserva sin que nadie le escriba.

Los pasos 1–2 son el frente 1 (`I4`, `C1`). Los pasos 3–4 son el frente 2 (`R1`, `R2`, `I1`).

## Entidades

| Entidad | Qué representa | Pertenece a | Ciclo de vida |
|---|---|---|---|
| `conjuntos` | El conjunto. Todo cuelga de aquí | sí mismo | uno solo por instalación |
| `apartamentos` | **La unidad de pertenencia.** El cupo es suyo | `conjuntos` | se crean al montar el conjunto; no se borran aunque el apartamento quede vacío |
| `residentes` | Quien entra al sistema | `apartamentos` | se da de alta y se da de baja con fecha; **no se borra**, para que sus reservas viejas conserven quién las hizo |
| `espacios` | Salón, cancha, BBQ, parqueadero | `conjuntos` | se apagan con `activo`, no se borran: el histórico de reservas los sigue citando |
| `franjas` | El bloque de tiempo reservable de un espacio | `espacios` | fijas por espacio; cambiarlas **no afecta reservas ya confirmadas** (I2) |
| `reservas` | Una franja tomada por un apartamento | `apartamentos` + `franjas` | confirmada → usada, o cancelada con motivo y fecha. **Nunca se borra** |
| `espera` | La fila para una franja que está tomada | `franjas` | se vacía cuando la franja pasa; el orden es el de llegada y no se altera |
| `bloqueos` | La administración inhabilita un espacio | `espacios` | por mantenimiento o por decisión; **no consume cupo de nadie** |

## Glosario

| Palabra del negocio | En el código | Definición |
|---|---|---|
| Apartamento | `apartamentos` | La unidad a la que pertenece el cupo. No es la persona |
| Residente | `residentes` | Quien entra al sistema. Pertenece a un apartamento |
| Espacio | `espacios` | Salón, cancha, BBQ, parqueadero de visitantes |
| Franja | `franjas` | El bloque de tiempo reservable. No se reserva por horas sueltas |
| Solicitud | `reservas` | Lo que pide el residente |
| Bloque ocupado | `v_ocupacion` | El efecto de una solicitud sobre el calendario |
| Derecho mensual | `v_cupo.disponible` | Cuántas le quedan al apartamento este mes |
| Aforo | `espacios.aforo` | Cuánta gente cabe en el espacio |
| Corte | `R2` | El jueves 6 p.m. desde el cual cancelar ya no devuelve el derecho |
| Desistir | `reservas.cancelada_por = 'residente'` | El residente cancela |
| Anular | `reservas.cancelada_por = 'administracion'` | La administración cancela |

## Palabras prohibidas

- **"Reserva"** a secas. Es la **solicitud** que hace el residente y también el **bloque
  ocupado** que produce en el calendario. Mezclarlas hace creer que cancelar la solicitud
  libera el bloque automáticamente, y ahí está I3: son un solo acto porque alguien tiene
  que escribirlo así, no porque pase solo.
- **"Cancelar"** a secas. El residente **desiste**; la administración **anula**. Las
  consecuencias son opuestas: desistir después del corte consume el derecho, anular nunca lo
  consume — no es culpa del residente. Escribir las dos como "cancelada" hizo que en el
  cuaderno se cobraran cupos que la administración misma había quitado.
- **"Cupo"**. Es el **aforo** del espacio (cuánta gente cabe) y también el **derecho
  mensual** del apartamento (cuántas veces puede reservar). Marta usa la misma palabra para
  las dos y nunca se confunde; un sistema sí.

## Fuera de alcance

- Cobrar el depósito del salón. Se sigue pagando en la administración; el sistema solo dice
  si está pagado (`P1`: no se inventa un estado de pago que nadie registró).
- Reservar desde afuera del conjunto. No hay invitados con cuenta.
- Los parqueaderos propios de cada apartamento. Solo el de visitantes.
