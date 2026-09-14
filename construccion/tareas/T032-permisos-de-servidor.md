# T032 — Permisos de servidor por rol y ámbito

**Objetivo:** que un rol no autorizado no pueda leer identidad ni ubicación sensible, **ni
siquiera por URL directa**.
**Autoridad:** `RF14`, `SEG-01`, `I6`
**Propietario:** negocio
**Depende de:** T021
**Puede ejecutarse en paralelo con:** ninguna, mientras esté bloqueada.
**Bloqueada por:** `P4`, `Q18`

## Contexto suficiente

`I6` prohíbe divulgar identidad o ubicación sensible a un rol no autorizado. `SEG-01` añade que
los permisos aplican **también por URL directa**, y `AGENTS.md` §10 lo dice sin rodeos:
*ocultar un botón no sustituye un permiso de servidor*.

**Esta tarea no se puede escribir todavía, y la razón no es de tiempo.** Faltan dos cosas que
deciden la forma de la política, no su detalle:

- **`P4` · el mecanismo de identidad.** Se buscó en los 24 documentos fuente y **no hay ni una
  mención** de inicio de sesión, contraseña o proveedor. Sin saber con qué entra alguien, no se
  sabe contra qué se comprueba un permiso.
- **`Q18` · aislamiento o jerarquía.** Si los procesos son compartimentos estancos, la política
  compara `proceso_id`. Si la Nación ve lo de todos y cada territorio solo lo suyo, compara un
  árbol territorial. **Se implementan distinto y no se convierte una en la otra después.**

Escribir la política antes de esas dos respuestas es escribir la equivocada con confianza.

## Qué SÍ se puede construir sin la respuesta

Esto es lo que la guía §5 pide decir en toda tarea bloqueada, y es casi todo:

- **La captura pública entera** (T023–T026). No necesita cuenta: es la superficie de una
  persona sin identificar, y así está diseñada.
- **Las pantallas internas contra los datos de ejemplo** (T027–T030). La interfaz, la máquina
  de estados y las bandejas se construyen y se prueban sin conectar el permiso.
- **La columna sobre la que se escribirá la política.** `proceso_id` ya está en todas las
  tablas desde la primera migración, precisamente para que esto sea agregar una regla y no
  reescribir el esquema.

## Superficie asignada

- Crear: `producto/supabase/schemas/08_permisos.sql`
- Leer: `producto/supabase/schemas/01_pertenencia.sql`
- No modificar: nada más

## Invariantes aplicables

- `I6`: nivel 1 —acceso a nivel de fila— y **también por URL directa**. Una invariante que solo
  vive en una acción de servidor es una que un `curl` rompe.

## Casos de verificación

- [ ] Un rol de divulgación pide contactos por URL directa → se le niega
- [ ] Un caso protegido sigue en la bandeja institucional autorizada aunque no salga como punto público

## Terminado cuando

- [ ] `P4` y `Q18` están respondidas y registradas en `negocio/vacios.md`.
- [ ] Los casos pasan contra la base, no contra la interfaz.

## Entrega esperada

- La política escrita, y contra qué identidad se comprueba.
