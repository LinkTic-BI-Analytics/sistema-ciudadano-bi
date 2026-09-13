---
description: Revisa una tarea entregada. Primero cumplimiento, después calidad. En ese orden.
argument-hint: "[T007]"
---

Vas a revisar una tarea que un constructor entregó. **Son dos revisiones distintas y el
orden no es negociable.**

El constructor no aprueba su propio trabajo.

## Primero: ¿se construyó lo correcto?

Una sola pregunta: **¿lo construido cumple exactamente el módulo y el contrato?**

Lee `construccion/tareas/<ID>-*.md` y el cambio exacto — no el resumen del constructor. El
resumen dice lo que él cree que hizo.

Revisa:

- **Cobertura** de los códigos `RF` `C` `P` `R` `I` asignados. Uno por uno.
- **Trabajo faltante.**
- **Comportamiento agregado sin autorización.** Es tan defecto como el que falta: nadie lo
  pidió, nadie lo va a mantener y nadie sabe qué regla implementa.
- **Los casos de verificación**, con el resultado calculado a mano.
- **Los límites de alcance**: ¿tocó alguna superficie que el contrato le prohibía?
- **Cada invariante en el nivel donde se vuelve imposible**, no donde se valida
  (`AGENTS.md` §8). Una invariante que solo vive en una acción de servidor es una invariante
  que un `curl` rompe.

**No te metas todavía con el estilo.** Primero se determina si se construyó lo correcto.

## Después: ¿está bien construido?

Ahora sí: claridad, mantenibilidad, diseño de errores, seguridad y aislamiento, contratos e
integraciones, duplicación, complejidad innecesaria, consistencia con el repositorio.

Para esto: **REQUIRED SUB-SKILL:** `superpowers:requesting-code-review`.

## Cuando un hallazgo choca con el plan

No lo resuelves tú en silencio y tampoco lo ignoras. **Se falla, y la razón se argumenta
contra el módulo**, que es la autoridad — el plan solo es su argumento. La decisión queda en
`construccion/progreso/<plan>-registro.md`.

**Y si el hallazgo es que hace falta cambiar algo del negocio, no lo decides.** Va a
`negocio/vacios.md` como `Q`, con qué bloquea y cuándo se vuelve urgente. `AGENTS.md` §6.

## Las rondas de arreglo

Cinco como máximo. Las tres primeras las resuelve el mismo implementador; de la cuarta en
adelante, uno nuevo y con un modelo más capaz. Cada ronda queda en el registro.

Si la quinta sigue dejando hallazgos abiertos, **se para y se decide sobre cada uno**: o es
de los que sostienen algo y hay que resolverlo, o se aparca en el registro **con fecha de
revisión**. Un hallazgo aparcado sin fecha es un hallazgo perdido.

## Cómo entregas

Los hallazgos por severidad, separando los de cumplimiento de los de calidad, y qué evidencia
hace falta para cerrar cada uno. Después: `/integrar <ID>` si pasó, o la ronda de arreglo si
no.
