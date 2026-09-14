# T027 — Aclarar la ubicación, con los cuatro estados separados

**Objetivo:** que un revisor vea los aportes cuya ubicación quedó por aclarar, la resuelva
contra el catálogo, y que los agregados territoriales cambien con rastro.
**Autoridad:** `RF7` · `GEO-01`, `CAL-01` · `I2`
**Propietario:** orquestador · **Depende de:** T021 · **Bloqueada por:** ninguna
**Puede ejecutarse en paralelo con:** T030, T031 — no tocan `src/revision/`.

## Contexto suficiente

Todo aporte nace con la ubicación `por_aclarar` y sin código, porque `I2` prohíbe inferirla.
Alguien tiene que resolverla, y ese es el primer trabajo del backoffice.

**`CAL-01` pide cuatro estados separados** —ubicación, clasificación, confirmación del relato y
revisión institucional— y hoy el esquema solo tiene el de ubicación. Juntarlos es el error que
`CAL-01` existe para impedir: *«cada indicador declara qué estados incluye»*, y con un solo
campo no se puede declarar nada.

Dos reglas de `GEO-01` que no son opcionales: **una dirección residencial no es el lugar del
problema** sin confirmación, y **el centro de un municipio no es la coordenada de una
necesidad**.

## Dentro del alcance

- Los tres estados que faltan, separados del de ubicación.
- Listar los aportes por aclarar de un proceso.
- Resolver una ubicación: confirmar un código del catálogo, con autor y motivo.
- Poder vincular **varios territorios** a un aporte (`GEO-01` lo permite).
- Devolver a `por_aclarar` lo que se resolvió mal.

## Fuera del alcance

- Clasificación temática. Es `TAX-01` y no está en esta tanda.
- La pantalla. Aquí va la lógica y sus pruebas.
- Cualquier sugerencia automática de ubicación. `IA-01` la permite, pero **como sugerencia**, y
  eso necesita el campo de valor sugerido contra valor aceptado que hoy no existe.

## Superficie asignada

- Crear: `producto/src/revision/ubicacion.ts`
- Crear: `producto/pruebas/revision.test.ts`
- Crear: `producto/supabase/schemas/10_estados.sql`
- No modificar: `producto/src/captura/`, `producto/src/comprobante/`

## Interfaces

**Produce:**
- `porAclarar(procesoId, limite?): Promise<PendienteUbicacion[]>`
- `resolverUbicacion({ aporteId, codigo, version, autor, motivo }): Promise<void>`
- `devolverAPorAclarar({ aporteId, autor, motivo }): Promise<void>`

## Invariantes aplicables

- `I2`: resolver es un acto con autor; **nunca** se rellena solo. Devolver a `por_aclarar`
  borra el código, no lo deja huérfano.

## Casos de verificación

- [ ] Un aporte nuevo aparece en la bandeja por aclarar
- [ ] Resolverlo con un código válido → desaparece de la bandeja y cuenta en los indicadores
- [ ] Resolverlo sin motivo → se rechaza
- [ ] Un código que no existe en esa versión del catálogo → se rechaza
- [ ] Un aporte puede quedar con **dos** territorios confirmados, y sigue contando **uno**
- [ ] Devolverlo a `por_aclarar` deja el código en nulo y vuelve a la bandeja
- [ ] Los cuatro estados se mueven por separado: cambiar el de ubicación no toca los otros tres

## Terminado cuando

- [ ] Los siete casos pasan, vistos fallar antes.
- [ ] `./scripts/validar.sh` devuelve 0.
