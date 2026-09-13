# Registro — <plan>

> ➤ Copia este archivo a `construccion/progreso/<plan>-registro.md`. **Conserva hechos de
> ejecución, no opiniones**: qué se despachó, qué volvió, qué se revisó, qué se integró.
>
> No sustituye a la hoja de ruta. La hoja de ruta da la vista del sistema; esto permite
> recuperar la ejecución exacta después de una pausa o un cambio de agente.
>
> **Este archivo se deriva** de `.superpowers/sdd/<plan>/progress.md` y de `git log`. Si los
> tres se contradicen, manda `git log`: los commits existen aunque nadie recuerde haberlos
> hecho (ADR 0011).

**Plan:** `construccion/planes/<archivo>.md`
**Módulo que le da autoridad:** `entregable/modulos/<archivo>.md` v<N>
**Ledger de SDD:** `.superpowers/sdd/<plan>/progress.md`

## Corridas

| Fecha | Tarea | Qué pasó | Evidencia |
|---|---|---|---|
| AAAA-MM-DD HH:MM | TNNN | despachada · modelo, propietario | — |
| AAAA-MM-DD HH:MM | TNNN | volvió DONE · N commits | `<sha>` |
| AAAA-MM-DD HH:MM | TNNN | revisión de cumplimiento: N hallazgos | `<ruta del paquete>` |
| AAAA-MM-DD HH:MM | TNNN | ronda de arreglo 1 de 5 | `<sha>` |
| AAAA-MM-DD HH:MM | TNNN | integrada | `<sha>` + suite completa |

## Decisiones del orquestador

> ➤ Cada vez que un hallazgo choca con el texto del plan hay que fallar. **La decisión se
> escribe aquí con su razón**, y la razón se argumenta contra el módulo, que es la
> autoridad. Una decisión sin razón se re-litiga en la siguiente tarea.

| Fecha | Qué chocaba | Qué se decidió | Contra qué autoridad |
|---|---|---|---|

## Hallazgos aparcados

> ➤ Lo que la revisión encontró y se decidió no arreglar todavía. **Un hallazgo aparcado sin
> fecha de revisión es un hallazgo perdido.**

| Tarea | Hallazgo | Por qué se aparca | Se revisa cuando |
|---|---|---|---|

## Bloqueos

| Fecha | Tarea | Causa | Dueño | Se destrabó el |
|---|---|---|---|---|
