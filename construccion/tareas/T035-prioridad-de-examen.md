# T035 — Prioridad de examen, con motivo y sin fórmula

**Objetivo:** que alguien registre **qué examinar primero y por qué**, sin que el sistema lo
decida por él y sin inventar pesos que nadie acordó.
**Autoridad:** `RF12` · `PRI-01`, `BI-02` · `I5`, `N08`, `N09`
**Propietario:** orquestador · **Depende de:** T028 · **Bloqueada por:** ninguna

## Contexto suficiente

Este módulo es el corazón declarado del proyecto. La visión lo dice así: *«la importancia de un
problema no puede depender únicamente de cuántas personas lo repiten»*, y `N08` lo vuelve
requisito — *un caso de una comunidad pequeña permanece localizable aunque lleguen miles de
solicitudes urbanas*.

**Y lo que define esta tarea es lo que NO hace.** `PRI-01` es explícito: *«los pesos o cuotas no
acordados no se rellenan automáticamente»*. `vacios.md` confirma que no existen pesos, ni
cuotas, ni desempate. **El sistema no debe rellenar esa falta con una fórmula inventada.**

Un número plausible es indistinguible de uno real, y nadie lo va a cuestionar después. Aquí eso
significaría decidir a quién se atiende primero con una cuenta que nadie autorizó.

Los cinco factores van **almacenados por separado** (`PRI-01`): urgencia reportada, afectación,
recurrencia, competencia e incertidumbre. Separados porque son cosas distintas y porque
juntarlos en una puntuación es exactamente la fórmula que no existe.

**Priorizar es un acto con responsable**, no una ordenación. *«Ordenaciones y filtros son
ayudas; el acto de priorizar tiene responsable»*.

## Dentro del alcance

- La prioridad de examen: expediente, autor, fecha, motivo, y los cinco factores por separado.
- Que un cambio de prioridad **conserve la anterior** con su autor y su razón.
- Que reabrir un expediente (T029) marque su prioridad como **no vigente**.
- Que la incertidumbre se pueda registrar como tal, y no como un valor bajo.

## Fuera del alcance

- **Cualquier puntuación agregada, peso o ranking.** No existen y no se inventan.
- **La selección presupuestal.** `I5` la bloquea detrás de ocho condiciones publicadas, y
  ninguna está. No hay tabla, no hay función, no hay bandera.
- La bandeja de lo poco recurrente. Es T036.
- Quién tiene autoridad para priorizar. Es `Q21`, abierta — aquí se registra el autor, no se
  valida su mandato.

## Superficie asignada

- Crear: `producto/supabase/schemas/13_prioridad.sql`
- Crear: `producto/src/priorizacion/prioridad.ts`
- Crear: `producto/pruebas/prioridad.test.ts`
- Modificar: `producto/src/revision/expediente.ts`
- No modificar: `producto/src/gestion/`, `producto/src/corte/`

## Interfaces

**Produce:**
- `registrarPrioridad({ expedienteId, autor, motivo, urgenciaReportada?, afectacion?, recurrencia?, competencia?, incertidumbre? })`
- `prioridadVigente(expedienteId)` · `historiaDePrioridad(expedienteId)`

## Invariantes aplicables

- `I5`: **no existe nada que se parezca a una selección presupuestal.** Ni apagada: no existe.
  Una bandera apagada es una bandera que alguien enciende.
- `N09`: *«decidir qué examinar no equivale a asignar inversión»*. Ningún campo de esta tabla
  habla de dinero.

## Casos de verificación

- [ ] Registrar una prioridad exige motivo
- [ ] Los cinco factores se guardan **por separado**, y ninguno es obligatorio
- [ ] No hay ningún campo ni función que produzca una puntuación agregada
- [ ] Cambiar la prioridad conserva la anterior con su autor y razón
- [ ] La incertidumbre se registra como tal, distinta de una afectación baja
- [ ] **Un caso con un solo aporte se prioriza igual que uno con muchos** — nada lo impide
- [ ] Reabrir el expediente deja la prioridad **no vigente**, sin borrarla
- [ ] Priorizar no cambia nada del estado de atención de `T030`

## Terminado cuando

- [ ] Los ocho casos pasan, **vistos fallar antes**.
- [ ] `validar.sh` devuelve 0.
- [ ] Una prueba recorre el módulo y **falla si aparece una función con «puntaje», «score»,
      «peso» o «ranking»** en el nombre.

## Entrega esperada

- Archivos, salidas antes y después, y qué queda esperando `Q21`.
