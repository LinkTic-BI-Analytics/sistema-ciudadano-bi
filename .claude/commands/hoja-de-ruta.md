---
description: El estado de la construcción formal: qué corre, qué puede empezar, qué bloquea y qué se está pudriendo.
---

Vas a reportar el estado de la **construcción formal** — la Capa B. No escribes nada en
disco salvo lo que el guion deriva solo.

Si `construccion/hoja-de-ruta.md` no existe, este no es el comando: corre `/donde-voy`, que
diagnostica el descubrimiento.

## Primero corre el guion, no leas el tablero a ojo

```
./scripts/construccion.sh
```

Deriva todo de los archivos: el grafo, la ruta crítica, las tareas listas, la matriz de
paralelismo, los agentes andando, los bloqueos, el deterioro y la cobertura. Escribe
`construccion/.estado.json` y el bloque derivado del encabezado del tablero.

**No leas la tabla y saques tus propias cuentas.** Si el guion dice una cosa y tu lectura
otra, es un defecto del guion y hay que arreglarlo — no rodearlo.

## Después mira lo que el guion no puede ver

El guion cuenta. Estas tres las tienes que mirar tú:

**¿Las tareas «listas» de verdad se pueden empezar?** Una tarea puede cumplir las cuatro
condiciones de la guía §5 y aun así llevar adentro una decisión de negocio sin tomar. Esa
no pasa de `candidato`, por muy lista que se vea — `metodo/construccion-solida-y-paralela.md`
§13 lo llama «paralelizar antes de decidir», y el síntoma es varios agentes construyendo
interpretaciones distintas de la misma regla abierta.

Cruza cada tarea candidata contra las `Q` abiertas de `negocio/vacios.md`.

**¿El orden respeta `metodo/frentes.md`?** La unidad de pertenencia va primero, y la
invariante suprema se hace imposible en el mismo frente donde nacen los datos que podrían
violarla. Si la ruta crítica que imprime el guion rompe alguna de las dos, **manda
`frentes.md`** y el tablero está mal ordenado.

**¿Algún módulo cambió después de que sus tareas lo citaran?** Si un código del módulo se
reescribió, todas las tareas que lo citan hay que revisarlas. El guion detecta códigos sin
tarea; no detecta un código que cambió de significado.

## No cambies el orden sin escribir por qué

Si reordenas algo, la fila conserva la razón. Una tarea reordenada sin porqué se vuelve a
reordenar en la siguiente sesión, en la dirección contraria.

## Cómo entregas

Los ocho puntos que ya imprime el guion, en su orden, más lo que hayas encontrado tú. **Y
terminas en una sola decisión.** Un reporte que termina en cinco cosas por hacer no ayudó a
decidir nada.
