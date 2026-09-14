# T029 — Desagrupar sin borrar, y reabrir sin heredar

**Objetivo:** que deshacer una agrupación conserve todo y **reabra** lo que dependía de ella.
**Autoridad:** `RF7` · `I4` · `NEC-01`
**Propietario:** orquestador · **Depende de:** T028 · **Bloqueada por:** ninguna

## Contexto suficiente

`I4` es la invariante más cara de implementar mal, y la especificación dice exactamente qué
tiene que sobrevivir a un desagrupe: *«conservar originales, diferencias, motivos y vínculos»*,
y *«reabre examen de prioridad y respuestas **sin heredar aprobación**»*.

Esa última mitad es la que se olvida. Si un aporte sale de un expediente y la prioridad del
expediente se queda como estaba, el sistema está afirmando algo que ya no sustenta.

Y `NEC-01`: *«una desagrupación conserva aportes y referencias previas y permite reconstruir el
corte analítico anterior»*. El corte viejo no se toca — ya es inmutable por regla.

## Dentro del alcance

- Desvincular un aporte de un expediente, con autor y motivo.
- Conservar la fila del vínculo marcada, nunca borrarla.
- Marcar el expediente como **reabierto**: su prioridad y su respuesta dejan de estar vigentes.
- Que un corte tomado antes siga devolviendo lo que devolvía.

## Fuera del alcance

- La prioridad en sí. Es M08 y no está en esta tanda: aquí solo se marca que hay que revisarla.
- Dividir un expediente en dos.

## Superficie asignada

- Modificar: `producto/src/revision/expediente.ts`
- Modificar: `producto/pruebas/revision.test.ts`
- Modificar: `producto/supabase/schemas/04_expediente.sql`

## Interfaces

**Produce:**
- `desvincular({ aporteId, expedienteId, autor, motivo })`

## Invariantes aplicables

- `I4`: nada se borra. El vínculo queda con su fecha, su autor y su motivo de desvinculación.

## Casos de verificación

- [ ] Desvincular sin motivo → se rechaza
- [ ] Después de desvincular, el vínculo **sigue en la base** con su motivo
- [ ] El aporte deja de contar en la recurrencia del expediente
- [ ] El expediente queda marcado como reabierto, con la fecha y la causa
- [ ] **Un corte tomado antes sigue devolviendo los mismos números**
- [ ] Volver a vincular el mismo aporte crea un vínculo nuevo, no revive el viejo

## Terminado cuando

- [ ] Los seis casos pasan, vistos fallar antes.
- [ ] `validar.sh` devuelve 0.
