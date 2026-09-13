---
description: Dónde vas en las dos capas, qué te bloquea y qué se está pudriendo. Empieza por aquí si no sabes qué sigue.
---

Vas a reportar dónde va el proyecto. No escribes nada en disco: solo informas.

**Hay dos capas y se reportan las dos.** El descubrimiento (Capa A) produce conocimiento del
negocio; la construcción formal (Capa B) produce software. La frontera es el módulo
entregable. Si `entregable/modulos/` está vacío, la Capa B todavía no existe y solo hay que
reportar la primera — pero dilo, no lo omitas: que no exista es el dato más importante.

Lee `metodo/el-ciclo.md` y mira el estado real de `negocio/` y `entregable/`.

## Deriva la etapa, no la preguntes

Mira qué archivos existen y qué tan llenos están. Si `negocio/` está vacío, la etapa es
descubrir. Si hay dominio y no especificación, es especificar. Y así.

## Llama al escribano

Que audite el grafo: códigos citados que no existen, códigos definidos que nadie cita,
reglas sin caso de verificación, enlaces rotos, y **secciones que todavía tienen líneas `> ➤`
adentro** — esas son secciones sin terminar que se leen como si estuvieran listas.

## Qué se puede construir hoy

No basta con decir qué falta: **hay que decir qué se puede hacer con lo que ya se sabe.** Una
lista de datos faltantes se lee como una lista de bloqueos, y casi nunca lo es.

Mira la §11 de la especificación y, por cada dato que falta, su columna de **qué se puede
construir sin esto**. Si esa columna está vacía, dilo — o nadie la llenó, o de verdad bloquea,
y son dos cosas muy distintas.

Y marca aparte **lo que no se puede agregar después**: una columna que habría que rellenar
hacia atrás, un dato de origen que nadie está anotando. Eso va primero aunque falte el número,
porque cada día que pasa se pierde información que no se recupera.

### Y audita los tokens del producto

El archivo de tokens del producto —`producto/src/producto/tokens/`, o `mvp/src/producto/tokens.css`
si lo que existe es un MVP— **declara variables, nunca reglas**. Una sola regla global
—un `* { … }`, un `body a { … }`— se cuela en `/modulos` y `/telemetria` y rompe I5, que dice
que esas dos mantienen siempre su propia línea gráfica.

Reporta:

- Cualquier selector en ese archivo que no sea `:root`.
- Cualquier token sin origen: los que no salieron del cliente van marcados `DE REFERENCIA` o
  `PROVISIONAL`, y uno sin marca se lee como decidido cuando no lo está. Si los tokens se
  generan desde un JSON, el origen vive en el `$description` de cada uno y lo que hay que
  comprobar es que **el CSS no se haya editado a mano**, porque eso lo desincroniza de su fuente.
- Tokens declarados que ninguna pantalla consume. Un token que nadie usa no existe.

## Lo que se está pudriendo

Esta es la parte que nadie más va a mirar:

- Preguntas abiertas cuyo **momento de urgencia ya pasó**.
- Módulos entregados cuyas reglas **cambiaron después** de entregarse. El equipo de
  desarrollo estaría implementando una versión vieja.
- Frentes cerrados **sin rastro en la cuenta demo**. Ese frente no se puede validar con
  nadie.
- Frentes construidos y nunca entregados. Es el modo de falla más común del método.

## Y si ya hay construcción formal

Cuando `construccion/hoja-de-ruta.md` existe, corre también:

```
./scripts/construccion.sh
```

y agrega al reporte lo que el descubrimiento no puede ver:

- **Trabajo activo por línea** y qué agente lo tiene.
- **Tareas listas para paralelo**, y cuáles están listas pero **sin contrato**, que es
  distinto: se pueden empezar, no se pueden despachar.
- **La ruta crítica**, que es el tiempo mínimo restante y ninguna cantidad de agentes acorta.
- **Revisiones e integraciones envejecidas.** Una tarea que lleva dos días «en revisión» es
  trabajo hecho que todavía no vale nada.
- **Un módulo o un plan cuya versión quedó desactualizada.** Si un código del módulo cambió
  después de que sus tareas lo citaran, esas tareas están implementando una versión vieja.

Para el detalle completo de esa capa el comando es `/hoja-de-ruta`. Aquí va el resumen.

## Cómo entregas

Corto y en este orden:

1. **Dónde vas** — la etapa de cada capa, en una línea cada una.
2. **Qué te bloquea hoy** — si algo espera una respuesta de una persona, dilo primero.
3. **Qué se puede construir hoy de todos modos** — y qué de eso no se puede agregar después.
4. **Qué se está pudriendo** — o "nada", si no hay.
5. **El comando que correrías ahora.** Uno solo.
