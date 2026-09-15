# Registro — T054 · Lo que hacía falta para poder clasificar

**Autoridad:** `negocio/requisitos/clasificacion-y-recurrencia-v1.md` (`CLA-01` … `CLA-04`),
escrito antes de codificar · `PRI-01` · `BI-02` · `interfaz.md` I2

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-15 | Requisito escrito primero, con la lista marcada como provisional | `CLA-01` … `CLA-04` |
| 2026-09-15 | 3 pruebas del tema, 4 recorridos de ficha y gestión | `lectura-ia.test.ts`, `consola.spec.ts` |

## Lo que faltaba no era más texto

El negocio lo dijo así: *«esta información es la base para luego clasificar y priorizar, pero con
esta información es muy difícil lograrlo»*.

Y tenía razón en el diagnóstico más que en el síntoma. **Faltaba un eje.** Cinco aportes reales lo
dejaban ver: agua en Montería, el techo de una escuela en Popayán, el transporte en Tunja, un
puesto de salud en Neiva, residuos en Armenia. **Cinco temas, cinco municipios, y ninguna forma
de decirlo sin leerlos enteros.**

Sin tema no se puede agrupar lo que se repite, ni saber a qué entidad compete, ni ver que veinte
personas de un municipio están contando lo mismo.

## El tema lo propone la lectura y lo confirma la persona

Se guardan **las dos cosas por separado**: `tema_propuesto` es lo que leyó la máquina y `tema` lo
que confirmó ella. Juntarlas haría imposible saber cuánto se equivoca la lectura — y eso es lo
único que dirá si la lista sirve.

**La lista es provisional y la pantalla lo dice.** La especificación dejó las taxonomías sin
cerrar (`T018`), así que once temas inventados durante la construcción no son una taxonomía
acordada: son un punto de partida (`Q32`). Por eso existe «otra cosa» y **sale marcado en la
bandeja en vez de esconderse**: un asunto que se repite ahí es la señal de que a la lista le falta
algo.

El tema **no pasa por el guardián de anclaje**, y no es un descuido: no es un fragmento del
relato sino una etiqueta de una lista cerrada. Lo que lo controla es la lista — si el modelo
devuelve algo que no está, se descarta sin tirar el resto de la lectura.

## La recurrencia se calcula

Cuántos otros aportes del mismo tema hay en el mismo municipio. Sale del grafo, como toda la
telemetría de este proyecto: nadie lo teclea y nadie lo puede ajustar.

**Y dice su denominador**, que es lo que impide que se lea mal: son *aportes*, no *personas*. Dos
pueden ser de la misma, y veinte vecinos pueden no haber contado ninguno.

**No ordena nada.** Un caso único no se va al final de la fila por ser único — ordenar por
recurrencia sería la puntuación que `PRI-01` no tiene.

## La gestión llega medio llena

El formulario de abrir expediente llega con la descripción y el cambio esperado, sacados de **la
versión vigente de la síntesis** — la que la persona confirmó, no la que leyó la máquina. Si
corrigió «Martinica» por «Martinita», el expediente nace con lo suyo.

**Rellenar no es decidir.** El motivo sigue siendo obligatorio, el expediente se abre por un acto
del revisor y queda a su nombre.

## El error que costó media hora

Puse la confirmación del tema en un `onClick` asíncrono sobre un botón de **envío**. El `await`
suspende el manejador y el formulario no se envía: el paso no avanzaba, y **21 recorridos se
quedaron esperando 30 segundos cada uno** a algo que nunca iba a llegar. Una corrida pasó de 1,6
minutos a más de 8.

Lo que lo hizo caro no fue el error, fue cómo lo miré: dejé corriendo varias validaciones en
segundo plano que se pisaban los puertos entre ellas, y estuve persiguiendo colisiones en vez de
leer el primer fallo. **Cuando una suite tarda cinco veces más de lo normal, lo que hay es un
fallo, no lentitud.**

El arreglo es además el diseño correcto: el tema viaja **con el formulario**, en un solo envío y
una sola acción.

## Lo que queda abierto

**`Q32`: la lista de temas.** Once etiquetas inventadas en la construcción. Antes del piloto.

**La competencia** —a qué entidad le toca— depende del tema **y** del municipio, y ese catálogo no
lo ha dado nadie.

**Agrupar aportes en un expediente** sigue siendo manual, y debe seguir siéndolo: `R1` existe
para que dos expedientes no digan lo mismo, y agrupar sin que alguien lo decida es la forma más
rápida de perder un disenso.
