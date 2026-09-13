---
description: Despacha una tarea a un agente constructor, pero solo si pasa la prueba de paralelismo.
argument-hint: "[T007, o varias: T007 T009]"
---

Vas a entregarle una tarea a un agente constructor. **Solo despachas lo que pasa la prueba**;
si no pasa, lo dices y no la despachas.

## La prueba, antes de nada

```
./scripts/construccion.sh --revisar
./scripts/paralelismo.sh --duro
```

Si alguno devuelve 1, **para**. Despachar sobre un tablero que se contradice es cómo se
producen dos agentes editando la misma superficie.

Y después, las nueve casillas de `metodo/construccion-solida-y-paralela.md` §7. El guion
comprueba las que se pueden contar; estas dos las miras tú:

- **No contiene una decisión de negocio abierta.** Crúzala contra las `Q` de `negocio/vacios.md`.
- **Tiene un espacio de trabajo aislado.** Si no lo tiene, créalo: **REQUIRED SUB-SKILL:**
  `superpowers:using-git-worktrees`.

## Un solo implementador por plan

El ADR 0011 lo fija y las dos fuentes coinciden: `superpowers:subagent-driven-development`
dice *«never dispatch multiple implementation subagents in parallel»*, y la guía §2.2 llega
a lo mismo por otro camino.

> **El paralelismo es entre planes, no entre tareas.** Varias tareas del mismo plan van una
> detrás de otra. Varios módulos independientes sí van a la vez, cada uno en su worktree.

Si te pidieron despachar dos tareas del mismo plan, despacha la primera y dilo.

## Qué lleva el despacho, y qué no

**REQUIRED SUB-SKILL:** `superpowers:subagent-driven-development`.

El contrato de la tarea es la fuente única de requisitos. El despacho lleva:

1. Una línea sobre dónde encaja esta tarea en el proyecto.
2. La ruta del contrato, presentada como *«lee esto primero: son tus requisitos, con los
   valores exactos»*.
3. Las interfaces y decisiones de tareas anteriores que el contrato no puede conocer.
4. Tu resolución de cualquier ambigüedad que hayas visto en el contrato.
5. La ruta del archivo de reporte.

**Y no lleva nada más.** No le pegues el resumen de las tareas anteriores: en una sesión real
un despacho llegó a 42.000 caracteres de los cuales el 99% era historia pegada. Un agente
nuevo necesita su tarea, sus interfaces y las restricciones globales.

**El agente constructor no despacha agentes.** Ni ayudantes ni revisores. La revisión llega
de ti, después del reporte.

## Cuando vuelva

Anota en `construccion/progreso/<plan>-registro.md`: qué volvió, cuántos commits, y el
estado nuevo en el tablero con su evidencia. Después: `/revisar-tarea <ID>`.

## Cómo entregas

Qué despachaste, a qué worktree, con qué modelo, y **qué NO despachaste y por qué**. Lo
segundo es lo que evita que alguien lo intente otra vez en media hora.
