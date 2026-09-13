# Lectura documental — Conjunto Altos del Norte

Lo que dicen los documentos que trajo Marta, y **lo que hay que preguntarle a una persona
por culpa de ellos**.

Nada de este archivo pasó a la especificación directamente. Lo que dice un documento es una
afirmación de quien lo escribió, no un hecho sobre el negocio.

**Fecha de la lectura:** 2026-08-24
**Quién entregó los documentos:** Marta, la administradora

---

## 0 · Por dónde va esto

**De qué se trata.** Un conjunto de 240 apartamentos presta cinco espacios comunes —salón
social, cancha, dos zonas de BBQ y el parqueadero de visitantes— y hoy lo lleva una sola
persona en un cuaderno. Los residentes piden por WhatsApp o bajando a la portería, y ella
anota. Lo que se quiere es que el residente pueda pedir y saber si quedó, sin esperar a que
Marta conteste.

**La línea que dan los documentos, y qué tan firme es.** Poco firme. El reglamento es de
2018 y lo aprobó una asamblea; el manual es de 2022 y lo hizo el consejo; el formato no
tiene fecha y se ve hecho en Word. Los tres se contradicen en cuatro puntos (§7), y ninguno
describe lo que muestra el cuaderno. **Lo que hay es la costumbre**, y la costumbre no está
escrita en ninguna parte.

**Los hitos grandes que se alcanzan a ver.**

| # | Hito | De dónde salió | Qué preguntar para confirmarlo |
|---|---|---|---|
| 1 | Quién es dueño del derecho a reservar | Manual 2022: "tres reservas mensuales por unidad privada". Dice *unidad*, no *persona* | ¿El derecho es del apartamento o de quien lo pide? ¿Dos del mismo apartamento comparten las tres? |
| 2 | Pedir un espacio y saber si quedó | Reglamento cap. VII + formato de solicitud | Cuénteme el último día que alguien pidió el salón, paso a paso |
| 3 | La aprobación del consejo para el salón | Reglamento cap. VII, paso 3 | ¿Cuándo fue la última solicitud que pasó por el consejo? |
| 4 | El depósito del salón | Reglamento (medio salario) y formato ($200.000) — **no coinciden** | ¿Cuánto se cobra hoy de verdad? ¿Quién decide si se devuelve? |
| 5 | Lo que ve la administración | **No está en ningún documento: se dedujo** de que el Excel tiene una pestaña "histórico" que nadie mencionó | ¿Qué mira usted del mes cuando cierra? ¿Para qué usa el histórico? |

**Cómo los atacaría, y por qué en ese orden.** El 1 va primero porque no es una regla sobre
una pantalla: es de quién es cada cosa, y eso se decide antes que nada. El 2 después,
porque es el recorrido que hace que esto sirva para algo. El 3 y el 4 dependen del 2 —no se
puede aprobar ni cobrar un depósito de algo que todavía no se puede pedir— y el 5 depende de
que ya haya historia que mirar.

**Esto no es todavía el orden de construcción.** Ese se decide con la invariante suprema en
la mano, y la invariante suprema no sale de un documento: sale de preguntar qué no puede
pasar nunca.

**Qué exploraría primero si me dieran una hora.** El hito 3. Si el paso por el consejo de
verdad ocurre, hay un flujo de aprobación entero con estados, plazos y notificaciones, y eso
cambia el tamaño del proyecto. Si no ocurre, se cae solo.

> Ocurrió lo segundo. Ver **"Lo que esta lectura produjo, y lo que no"**, al final: Marta no
> lleva una solicitud al consejo desde 2022, y ese hito nunca se construyó. Por eso esta
> sección orienta y no decide.

---

## 1 · Qué se leyó

| Documento | Qué es | Fecha | Quién lo escribió |
|---|---|---|---|
| `reglamento-ph.pdf` | Reglamento de propiedad horizontal, capítulo VII: zonas comunes | 2018 | La asamblea, con un abogado |
| `manual-convivencia.pdf` | Manual de convivencia | 2022 | El consejo de administración |
| `formato-solicitud-salon.pdf` | El formato que se llena para pedir el salón | sin fecha | Se ve hecho en Word por la administración |
| `cuotas-2026.csv` | Los 240 apartamentos con su torre y su estado de cartera | 2026 | Marta, mensual |
| `cuaderno-agosto.jpg` | Foto de dos páginas del cuaderno de reservas | 2026 | Marta |

**No se pudo leer:** nada. El `.csv` salió de un Excel de tres pestañas; solo se trajo la
primera, y las otras dos —"histórico" y "sanciones"— no se conocen.

> Que existan pestañas llamadas *histórico* y *sanciones* ya es información: hay un
> histórico que alguien lleva y hay sanciones que alguien aplica, y ninguno de los dos
> apareció en la conversación.

---

## 2 · Cómo dice el negocio que funciona

Según el reglamento (cap. VII) y el manual:

1. El residente llena el formato de solicitud y lo radica en la administración.
2. La administración verifica que el apartamento esté **a paz y salvo**.
3. Para el salón social, la solicitud **pasa al consejo de administración**, que aprueba o
   niega en la siguiente reunión ordinaria.
4. Aprobada, el residente consigna el depósito y presenta el recibo.
5. La administración entrega el espacio y lo recibe, con acta de entrega y de recibo.
6. Si hay daños, el depósito se retiene total o parcialmente.

El manual agrega que cada apartamento tiene derecho a **tres reservas mensuales** de zonas
comunes, y que las cancelaciones deben hacerse "con la debida antelación".

---

## 3 · Quién va a usar esto

Candidatos a persona validadora, no personas todavía. La vida se la pone el analista.

| # | Quién es | De dónde salió | Con qué pregunta llega | Qué le duele hoy |
|---|---|---|---|---|
| 1 | **Marta, la administradora.** Lleva el cuaderno | Los cinco documentos la nombran o los escribió ella | *"¿quién tiene el salón el sábado?"* | **Documentado.** El cuaderno de agosto tiene tachones y dos reservas superpuestas. Y contesta el WhatsApp a las once de la noche |
| 2 | **El residente que reserva** | Manual, formato de solicitud | *"¿alcanzo a coger la cancha el domingo?"* | **Deducido.** Hoy no sabe si quedó hasta que Marta conteste. El manual no dice cuánto se demora eso |
| 3 | **El residente que se quedó sin cupo** | **No aparece en ningún documento: se dedujo** del cuaderno, donde los mismos apartamentos repiten | *"¿por qué nunca alcanzo?"* | **Deducido, y es el que más importa.** Nadie lo ve. No hay lista de espera ni forma de saber que quedó por fuera |
| 4 | **El consejo de administración** | Reglamento cap. VII, paso 3 | *"¿esta solicitud la aprobamos?"* | **Deducido, y resultó no existir.** Ver el cierre |
| 5 | **El del 301 al que Marta le deja pasar** | **No aparece: se dedujo** de la contradicción entre el paz y salvo escrito y el cuaderno | *"¿me van a dejar aunque deba?"* | **Deducido.** La excepción existe y no está escrita en ninguna parte |

**Los que no aparecen y seguramente existen:** quien limpia y entrega el espacio (el
reglamento menciona actas de entrega y de recibo, y nadie las mencionó), y quien aplica las
sanciones de la pestaña de Excel que no se trajo.

**A quién habría que ver trabajando:** a Marta, un sábado, con el cuaderno delante. Es el
único momento en que se ve el sistema real —el cuaderno, el WhatsApp y la memoria— haciendo
lo que va a hacer el software.

> De estos cinco, **dos llegaron a ser agentes**: Marta y Hernán (el residente que reserva
> desde el celular). El tercero —el que nunca alcanza— no se escribió como persona, y esa
> fue una mala decisión: es de donde salió R6, y se descubrió tres frentes después.

---

## 4 · El vocabulario que ya existe

| Palabra | Dónde aparece | Qué parece significar | ¿Dos sentidos? |
|---|---|---|---|
| Unidad privada | Reglamento | El apartamento | — |
| Copropietario | Reglamento | El dueño. **No siempre es quien vive ahí** | — |
| Residente | Manual | Quien vive, sea dueño o arrendatario | — |
| Zona común de uso exclusivo | Reglamento | Lo que se puede reservar | — |
| Paz y salvo | Los tres | Sin deuda de cuota de administración | — |
| **Reserva** | Todos | La solicitud radicada, y también el bloque de tiempo ocupado | **Sí** |
| **Cancelación** | Manual y formato | Que el residente desista, y que la administración revoque | **Sí** |
| **Cupo** | Manual | Cuánta gente cabe, y también cuántas reservas al mes | **Sí** |
| Depósito | Reglamento y formato | La plata que se deja en garantía | — |

**Códigos y numeraciones que ya existen.** El formato tiene un consecutivo `SOL-####`
escrito a mano, y el `.csv` identifica cada apartamento como `T3-502` — torre y número.
Marta usa esa forma en el cuaderno y al hablar. **Es un requerimiento, no un detalle:** la
gente lo tiene memorizado.

> Las tres palabras con doble sentido salieron gratis de aquí, y son exactamente las tres
> que quedaron como palabras prohibidas en el dominio. Encontrarlas antes de la entrevista
> ahorró tener que descubrirlas construyendo.

---

## 5 · Las cosas que aparecen

| Cosa | Dónde aparece | Qué parece ser |
|---|---|---|
| Unidad privada / apartamento | Reglamento, `.csv` | Candidata a unidad de pertenencia |
| Copropietario | Reglamento | Distinto del residente. Puede que no haga falta |
| Residente | Manual, cuaderno | Quien reserva |
| Zona común | Reglamento (las lista: salón, cancha, dos BBQ, parqueadero de visitantes) | El espacio |
| Solicitud | Formato | **No es una entidad: es una vista.** Trae adentro el apartamento, el residente, el espacio, la fecha y el depósito |
| Acta de entrega y de recibo | Reglamento | Existe en papel. No apareció en la conversación |
| Depósito | Reglamento, formato | Un estado del salón, o una cosa aparte |
| Sanción | Pestaña del Excel que no se trajo | No se sabe |

---

## 6 · Reglas explícitas encontradas

| Lo que dice | Documento y dónde | ¿Se cumple? |
|---|---|---|
| "Tres (3) reservas mensuales por unidad privada" | Manual, art. 22 | Parece que sí |
| "El apartamento deberá encontrarse a paz y salvo" | Reglamento, cap. VII art. 41 | **[?]** El cuaderno tiene reservas de apartamentos que en el `.csv` están en mora |
| "La solicitud del salón social será sometida a consideración del consejo" | Reglamento, art. 42 | **[?]** El cuaderno muestra reservas de salón con dos días de anticipación. El consejo se reúne una vez al mes |
| "Depósito equivalente a medio (0,5) salario mínimo" | Reglamento, art. 43 | **[?]** El formato dice "$200.000" fijo, escrito a mano |
| "Las cancelaciones deberán realizarse con la debida antelación" | Manual, art. 23 | **[?]** No dice cuánta. No es una regla: es una intención |
| "Se levantará acta de entrega y acta de recibo" | Reglamento, art. 44 | **[?]** No apareció nunca en la conversación con Marta |
| Horario de zonas comunes: 8:00 a 22:00 | Manual, art. 21 | Parece que sí |

---

## 7 · Contradicciones

| Sobre qué | Reglamento (2018) | Manual (2022) / formato |
|---|---|---|
| El monto del depósito | Medio salario mínimo — hoy serían unos $712.000 | El formato dice $200.000 fijo |
| Quién aprueba el salón | El consejo de administración | El formato solo tiene firma de la administración |
| Cuántas reservas al mes | No lo menciona | Tres por unidad privada |
| Antelación para cancelar | No lo menciona | "La debida antelación", sin cifra |

No se resolvieron. Cuál manda es una decisión del negocio — y preguntarlo destapó que no
manda ninguno de los dos: manda la costumbre.

---

## 8 · Lo que los documentos no dicen

Ninguno de estos aparece en ningún documento, y un sistema necesita los siete:

- **Cuántas reservas hay al mes.** El cuaderno de agosto sugiere unas 60, pero es una página
  y media.
- **Quién lo hace de verdad.** El reglamento reparte el trabajo entre la administración y el
  consejo; el cuaderno está todo con la misma letra.
- **Qué pasa cuando sale mal.** Ni una palabra sobre la doble reserva, que según Marta pasó
  dos veces.
- **Las excepciones.** El reglamento no contempla que la administración bloquee un espacio
  por mantenimiento, y evidentemente ocurre.
- **Los plazos reales.** "Debida antelación" no es un plazo.
- **Qué se hace cuando el proceso dice que no.** Si el consejo no ha aprobado y el evento es
  el sábado, ¿qué pasa? El cuaderno sugiere que se hace igual.
- **Cuánto cuesta el error.** Nada dice qué pasa cuando dos familias llegan el mismo sábado.

---

## 9 · Preguntas para la entrevista

| # | La pregunta | De dónde sale |
|---|---|---|
| 1 | El reglamento dice que el salón lo aprueba el consejo. ¿Así es como pasa? | Art. 42 contra el cuaderno |
| 2 | ¿Hace cuánto no se lleva una solicitud al consejo? | La misma |
| 3 | El depósito: ¿$200.000 o medio salario mínimo? ¿Quién lo cambió y cuándo? | Reglamento contra formato |
| 4 | ¿Le ha tocado dejar reservar a alguien que está en mora? ¿Cuándo, y por qué? | Art. 41 contra el `.csv` |
| 5 | "Con la debida antelación" — ¿desde cuándo ya es tarde para cancelar? | Manual art. 23 |
| 6 | ¿Qué hace hoy cuando alguien cancela el sábado en la mañana? | La misma |
| 7 | ¿Las actas de entrega y recibo se levantan? ¿Dónde quedan? | Art. 44 |
| 8 | ¿Qué pasa cuando hay daños? ¿Ha tenido que retener un depósito? | Art. 43 |
| 9 | El Excel tiene una pestaña "sanciones". ¿Qué se sanciona y quién decide? | `cuotas-2026.csv` |
| 10 | Y una "histórico". ¿Qué guarda ahí? | La misma |
| 11 | ¿Cuántas reservas hay en un mes normal? El cuaderno de agosto sugiere unas 60 | `cuaderno-agosto.jpg` |
| 12 | ¿Ha bloqueado un espacio por mantenimiento? El reglamento no lo contempla | Ausencia en el reglamento |
| 13 | Cuénteme las dos veces que quedó doble reservado. ¿Qué pasó exactamente? | No está en ningún documento |
| 14 | ¿El copropietario y el residente son la misma persona? ¿Reserva el que vive o el dueño? | Reglamento contra manual |
| 15 | "T3-502" — ¿así los llama todo el mundo? | `cuotas-2026.csv` |

**La que no se puede dejar de hacer:** la 1.

Si el consejo de verdad aprueba cada salón, el sistema necesita un flujo de aprobación con
espera de días y eso cambia todo el diseño. Si no aprueba —y el cuaderno dice que no— el
reglamento está desactualizado y hay que decirlo antes de construir un paso que nadie va a
usar.

---

## Lo que esta lectura produjo, y lo que no

**Produjo** las tres palabras prohibidas del glosario, el formato `T3-502` que quedó en el
dominio, la lista de espacios, quince preguntas ordenadas, y dos pestañas de Excel que nadie
había mencionado.

**No produjo** ni una sola regla de la especificación. Todas las que salieron de aquí
llegaron marcadas con **[?]** y se confirmaron —o se cayeron— en la entrevista:

- El paso del consejo **no existe en la práctica** (pregunta 1). Marta no lleva una solicitud
  al consejo desde 2022. Nunca se construyó.
- El paz y salvo **sí se exige**, pero no siempre: *"si es la señora del 301 pues uno le
  deja"*. Quedó como pregunta abierta (Q5 en `vacios.md`), no como regla.
- El depósito quedó sin resolver y sigue abierto (Q3).

Esa es toda la diferencia entre leer documentos y descubrir un negocio: **los documentos
dijeron cómo debería funcionar, y la entrevista dijo cómo funciona.** Sin la lectura, la
entrevista no habría tenido esas quince preguntas. Con solo la lectura, habríamos construido
un flujo de aprobación que nadie usa desde hace cuatro años.
