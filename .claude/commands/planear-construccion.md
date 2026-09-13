---
description: Convierte un módulo entregable en plan de implementación y contratos de tarea.
argument-hint: "[M01 o el nombre del módulo]"
---

Vas a convertir un módulo entregable en un plan ejecutable. Es la etapa 2 de
`metodo/construccion-solida-y-paralela.md` §8.

## Antes de nada: ¿el módulo pasa el sobre cerrado?

Lee `entregable/modulos/<módulo>.md` y mira su última sección. **Si alguna de las cinco
casillas está sin marcar, para aquí.**

Un módulo que no pasa el sobre cerrado no tiene autoridad (ADR 0011, nivel 2), y un plan
sin autoridad es un plan que argumenta desde la especificación — que manda menos y no
recortó nada. Dilo y devuelve el módulo a `/entregar`.

Si `entregable/modulos/` está vacío, el trabajo que hay que hacer es la Pista A, no esta.

## Lee, en este orden

1. `plantillas/plan-de-construccion.md` — lo que este método le agrega a la skill. **Léela
   en tiempo de ejecución**; no traigas sus encabezados aprendidos (`AGENTS.md` §4).
2. El módulo completo, con sus códigos.
3. `metodo/frentes.md` — el orden lo decide qué no se puede agregar después.
4. `AGENTS.md` §8 y §9 — en qué nivel vive cada regla y qué no se puede tocar todavía.
5. `entregable/mapa-de-modulos.md` — de qué depende este módulo y qué depende de él.

## Después usa la skill

**REQUIRED SUB-SKILL:** `superpowers:writing-plans`.

Ella sabe descomponer en tareas con TDD rojo-verde y sin marcadores de relleno. Lo que no
puede saber es lo de este método, y eso lo pones tú:

- El `Spec:` apunta **al módulo**, no a la especificación.
- Las `Global Constraints` llevan las invariantes `I` **copiadas literalmente**. Una
  invariante parafraseada es una invariante distinta.
- El plan se guarda en `construccion/planes/AAAA-MM-DD-<resultado>.md`.

## Y escribe un contrato por tarea

Con `plantillas/tarea.md`, en `construccion/tareas/TNNN-<nombre>.md`. Los números son
corridos sobre **todo el tablero**, no por plan, y nunca se reciclan.

La sección **Superficie asignada** no es decorativa: es lo que `scripts/paralelismo.sh` lee
para saber si dos tareas se pisan. Un contrato sin superficie es una tarea que no se puede
despachar.

## Agrega las filas al tablero

Una por tarea, en `construccion/hoja-de-ruta.md`, con sus códigos y su dependencia. Sin
borrar nada de lo que ya estaba.

## La compuerta antes de terminar

```
./scripts/construccion.sh --revisar
./scripts/paralelismo.sh --duro
```

Los dos tienen que devolver 0. Y además, a ojo:

- **Ningún código del módulo quedó sin tarea.**
- **Ninguna tarea lleva adentro una decisión de negocio abierta.** Si la lleva, se queda en
  `candidato` y la pregunta va a `negocio/vacios.md` como `Q`, con qué bloquea y cuándo se
  vuelve urgente.

## Cómo entregas

El plan guardado, cuántas tareas salieron, cuál es la ruta crítica, qué grupos pueden ir en
paralelo y **qué quedó en `candidato` y por qué**. Esa última lista es la más útil: es lo
que hay que ir a preguntarle a alguien.
