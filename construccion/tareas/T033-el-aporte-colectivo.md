# T033 — El aporte colectivo y su vocería

**Objetivo:** que un grupo pueda hacer un aporte como propio, y que cambiar de vocero no cambie
de dueño ni transfiera notificaciones a quien no fue validado.
**Autoridad:** `RF16`, `I3` · `V15` y `V19` de `negocio/vacios.md`
**Propietario:** negocio
**Depende de:** T028
**Puede ejecutarse en paralelo con:** ninguna, mientras esté bloqueada.
**Bloqueada por:** `Q23`, `Q24`

## Contexto suficiente

Dos decisiones ya están tomadas y son firmes:

- **`V19` · el aporte colectivo es del colectivo.** No del vocero, que solo lo representa, y no
  de quien lo reportó primero.
- **`V15` · la vocería es un rol, no una propiedad.** Cambiarla exige designación verificable
  del grupo, **no** la autorización del vocero anterior, y con la vocería en disputa la revisión
  sigue pero no se entrega información reservada.

**Lo que falta es a quién se le asigna esa propiedad**, y son dos huecos distintos:

- **`Q23` · «colectivo» no existe como entidad.** Se buscó en los 24 documentos fuente y la
  palabra aparece **solo dentro de la propia pregunta**. Falta cómo se identifica, si se
  registra, si cambia de composición y quién valida que alguien habla por él. Hoy hay una
  propiedad asignada a algo que el modelo no tiene.
- **`Q24` · un expediente que mezcla procedencias.** `V12` dice que un expediente puede reunir
  varios aportes. Si reúne el de una junta de acción comunal y el de tres personas por internet,
  darle la propiedad al colectivo **le daría derechos sobre los aportes de los otros tres** — que
  es justo lo que `V14` prohíbe.

  La lectura que no se contradice: **el aporte colectivo es del colectivo; el expediente no es de
  nadie** —es el registro de trabajo de la institución— y lo que el colectivo tiene son derechos
  de representación y notificación sobre su parte. Hay que confirmarlo, no darlo por dicho.

## Qué SÍ se puede construir sin la respuesta

- **El aporte individual completo.** Es la mayoría, y no toca nada de esto.
- La columna `es_colectivo` **ya está en el esquema** y hoy solo se marca. Cuando `Q23` se
  cierre, el colectivo será una tabla y una clave foránea — no una migración sobre lo escrito.
- **Y hay una pista de dónde puede nacer el colectivo sin inventarlo:** `V14` ya exige definir
  *antes de cada encuentro* quiénes pueden validar un aporte colectivo y con qué mecanismo. Eso
  es un colectivo con nombre y miembros, producido por el propio proceso.

## Superficie asignada

- Crear: `producto/supabase/schemas/09_colectivo.sql`
- Modificar: `producto/src/captura/recibir.ts`
- No modificar: `producto/supabase/schemas/03_aporte.sql`

## Invariantes aplicables

- `I3`: asistentes, aportes individuales, relatorías, acuerdos, disensos y apoyos van separados.
  El aporte colectivo es un séptimo elemento y **no toda relatoría es uno** (`V14`).

## Casos de verificación

- [ ] Un cambio de vocero no transfiere notificaciones a quien no fue validado
- [ ] Con la vocería en disputa, la revisión de la necesidad continúa
- [ ] Un expediente que mezcla aporte colectivo e individuales no da derechos del colectivo sobre los individuales

## Terminado cuando

- [ ] `Q23` y `Q24` están respondidas y registradas.
- [ ] Los tres casos pasan contra la base.

## Entrega esperada

- Qué es un colectivo, cómo se identifica y quién valida su representación.
