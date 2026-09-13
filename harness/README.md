# El harness

Lo técnico y reusable. **Está empezando a llegar**: el stack ya se trajo y
[`interfaz.md`](interfaz.md) tiene su primera regla, escrita con el hallazgo que la produjo.
El resto llega a medida que construir lo vaya destapando.

El stack está decidido y es el mismo del proyecto donde nació el método:
[ADR 0006](../decisiones/0006-stack-fijo.md).

## Qué va a llegar

### Los documentos

| Archivo | Qué es | Cuándo se lee |
|---|---|---|
| [`interfaz.md`](interfaz.md) | Las reglas de las pantallas, cada una con el hallazgo que la produjo. **Ya existe, con una regla** | Antes de tocar una pantalla |
| `base-de-datos.md` | Nombres, columnas estándar, aislamiento, índices, y lo que el generador de migraciones borra cada vez | Antes de crear una tabla |
| `runbook.md` | Arrancar un proyecto y las operaciones del día | Al empezar, y cuando algo falle |
| `aprovisionamiento.md` | Qué cuentas crear, cuánto cuestan y dónde va cada credencial | Una sola vez |

### Los ADRs que se traen del proyecto de origen

**Estos números son los del proyecto de origen, no los de aquí.** Este repositorio ya tiene
`0001` a `0006` con otro contenido, y `decisiones/` es un solo registro corrido: traerlos
tal cual haría que `0001` significara dos cosas, que es justo lo que `metodo/codigos.md`
prohíbe. Al traerlos **se renumeran desde `0007`** y cada uno anota de cuál venía.

Y hay que resolver una duplicación antes: el [ADR 0006](../decisiones/0006-stack-fijo.md)
ya se tragó adentro el contenido de cinco de estos —el stack, los cuatro niveles, el esquema
declarativo, las llaves y el dinero en `numeric`—. O se sacan de 0006 y quedan como ADRs
propios, o 0006 se queda como la única fuente y estos cinco no se traen. **Lo que no puede
quedar es la misma decisión escrita en dos lados**, porque el día que una cambie nadie va a
saber cuál manda.

Se copian los de alcance *harness* y se deja afuera lo que era de aquel producto:

| # | Qué decide |
|---|---|
| 0001 | Next, Supabase y Vercel como stack base |
| 0002 | Los cuatro niveles para ubicar la lógica |
| 0003 | El esquema declarativo como fuente de verdad |
| 0005 | Los formularios de creación en superposición, no en la pantalla |
| 0006 | Una sola capa de medición, banderas, repetición y errores |
| 0007 | Llaves `publishable` y `secret`, no `anon` y `service_role` |
| 0008 | Migraciones desde local, no desde integración continua (temporal) |
| 0011 | El dinero es `numeric` y las cuentas se hacen en Postgres |
| 0012 | El color sale de una escala; cada proyecto escoge la suya y sus dos tipografías |

Se quedan afuera los tres que eran del dominio de aquel producto: la unidad de pertenencia,
el modelo de acceso y el alta de cuentas. **Cada negocio escribe los suyos**, y el primero
sale del frente 1.

### Los chequeos

Van en `scripts/`, y `validar.sh` los corre todos. Tres sirven desde el primer día sin base
de datos ni credenciales: el que revisa las reglas de pantalla, el que revisa los enlaces de
la documentación, y el que revisa lo que el generador de migraciones se lleva por delante.

### El primer pedazo de código reusable

`mvp/src/harness/VistaModulos.tsx` es del harness, no del negocio: se ve igual en todos los
proyectos y es lo que hace que alguien que llega de otro sepa leerlo sin explicación. Viaja
tal cual; lo único que cambia por proyecto es `mvp/src/harness/modulos.ts`, que es la
declaración de ese negocio.

Vive dentro de `mvp/` porque todavía no hay dónde más ponerlo. Cuando el harness tenga su
proyecto base, se va allá y el MVP lo copia al arrancar.

### El proyecto base

Next 15 con App Router, Supabase local en Docker, el esquema declarativo con sus tablas de
arranque, los componentes compartidos, y el guion que siembra la cuenta demo.

## Por qué no está ya

**Las reglas de interfaz y de base de datos son reglas sobre código.** Escribirlas sin código
es escribir reglas que nada comprueba — y esa es la lección más cara del proyecto de origen:
estaban escritas desde el primer día y aun así se rompieron en seis listas, cuatro pantallas
y once lugares. Lo que funcionó no fue acordarse: fue que fallara.

Lo mismo con los chequeos. **Un chequeo que no se ha visto fallar no es un chequeo**, y hoy
no hay contra qué verlos fallar. En aquel proyecto, veintidós comprobaciones estuvieron en
verde meses sin poder fallar ni una: el error se tragaba y la condición quedaba en falso.

Mientras tanto la auditoría de los documentos la hace el escribano, y la corre `/donde-voy`.
Cuando llegue el stack eso pasa a `scripts/`, **porque un chequeo que hay que acordarse de
correr no es un chequeo**.

## Lo que hay que resolver al traerlo

- **Alinear `eslint-config-next` con la versión de Next.** El proyecto de origen las tiene
  desalineadas por una versión mayor y funciona por casualidad (ADR 0006).
- **Renombrar la unidad de pertenencia.** Las tablas y políticas de aislamiento vienen con el
  nombre del dominio viejo; la forma se copia, los nombres los pone cada negocio.
- **El `project_id` de Supabase lleva el nombre del negocio, no "mvp".** Los contenedores se
  llaman `supabase_db_<project_id>`, y en una máquina que ya tiene otros proyectos —lo normal
  en cualquiera que lleve más de uno— un `project_id` genérico choca por prefijo con los
  demás y `docker exec` empieza a hablarle al contenedor equivocado. Se descubrió con un
  `project_id = "mvp"` conviviendo con un `mvp-financiero-grok` de otro proyecto.
- **Los puertos también.** El bloque `543xx` que trae `supabase init` por defecto lo usa el
  primer proyecto que se haya levantado en esa máquina. Hay que escoger un bloque libre —
  `lsof -nP -iTCP:<puerto> -sTCP:LISTEN` lo dice— y anotarlo, o el segundo proyecto no
  arranca y el error habla de puertos, no de lo que uno estaba haciendo.
- **Vaciar el catálogo de eventos.** Las reglas de ese archivo son lo valioso; los nombres de
  los eventos son de aquel producto.
- **Reescribir la lista de palabras del dominio** que el chequeo de pantallas prohíbe. Esa
  lista sale del glosario de cada negocio.
