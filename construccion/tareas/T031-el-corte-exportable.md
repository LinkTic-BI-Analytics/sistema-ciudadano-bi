# T031 — El corte exportable, reproducible por otro

**Objetivo:** que otro analista reproduzca el total a partir del mismo corte y la misma regla —
y que el archivo exportado no cambie nunca.
**Autoridad:** `RF6` · `TRA-01`, `R1`, `R2`, `SEG-01`
**Propietario:** orquestador · **Depende de:** T022 · **Bloqueada por:** ninguna

## Contexto suficiente

**Esto es lo que recibe el Sistema Nacional de Planeación** (`V16`). El BI lo construye otro
equipo (`V20`), así que lo nuestro no es el tablero: es el corte, y su credibilidad.

`TRA-01` fija el criterio de aceptación en una frase: *«otro analista reproduce el total a
partir del mismo corte y regla»*. Para eso el corte tiene que llevar **con qué se calculó**:
filtros, fecha, zona horaria, versión de catálogo y diccionario de datos.

La mitad ya está: `tomar_corte` congela los indicadores y el universo de IDs, y es inmutable
por regla. Falta **empaquetarlo para que salga**, y que salga sin exponer lo que no debe.

`SEG-01`: *«no exponer identidad innecesaria»*. Un corte lleva conteos y códigos territoriales,
**nunca relatos ni contactos**.

## Dentro del alcance

- Exportar un corte: sus indicadores, su universo y su procedencia.
- El **diccionario de datos**: qué significa cada indicador y su advertencia obligatoria, de la
  §7 del paquete. *Aportes recibidos: «no son personas ni votos»*, y así las ocho.
- Que exportar dos veces el mismo corte dé **exactamente lo mismo**.
- Que el corte no lleve relatos, contactos ni códigos de comprobante.

## Fuera del alcance

- Mapas, gráficas y filtros interactivos. Son de M03, y M03 es de otro equipo.
- El formato final del archivo para el otro equipo. Es `Q25` y está aplazada a propósito: aquí
  se produce la estructura, no se fija el contrato de entrega.

## Superficie asignada

- Crear: `producto/src/corte/exportar.ts`
- Crear: `producto/pruebas/corte.test.ts`
- Modificar: `producto/supabase/schemas/07_conteo.sql`
- No modificar: `producto/src/revision/`, `producto/src/gestion/`

## Interfaces

**Produce:**
- `exportarCorte(corteId): Promise<Exportacion>` con `{ procedencia, indicadores, diccionario, universo }`

## Invariantes aplicables

- `I6`: *«ni ofrecer mapas y exportaciones con universos contradictorios»*. El corte lleva el
  universo de IDs exacto, y la exportación cuenta **sobre esos**, no vuelve a consultar.

## Casos de verificación

- [ ] Exportar el mismo corte dos veces devuelve lo mismo, byte a byte
- [ ] La exportación lleva versión de catálogo, zona horaria, filtros y fecha
- [ ] Lleva el diccionario, y **cada indicador trae su advertencia**
- [ ] **No lleva relatos, ni contactos, ni códigos de comprobante**
- [ ] Los indicadores de la exportación coinciden con los del corte congelado
- [ ] Un aporte aclarado después del corte **no cambia** lo exportado
- [ ] Un corte de un proceso no incluye aportes de otro

## Terminado cuando

- [ ] Los siete casos pasan, vistos fallar antes.
- [ ] `validar.sh` devuelve 0.
