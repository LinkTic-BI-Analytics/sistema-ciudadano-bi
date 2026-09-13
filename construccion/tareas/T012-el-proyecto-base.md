# T012 — El proyecto base levanta y la base de datos arranca sin chocar

**Objetivo:** que `npm run dev` sirva una página y `supabase start` levante Postgres local
sin pelearse con otro proyecto de la misma máquina.
**Autoridad:** `AGENTS.md` §9 y §11 · [ADR 0006](../../decisiones/0006-stack-fijo.md)
**Propietario:** orquestador
**Depende de:** T006
**Puede ejecutarse en paralelo con:** T009, T015 — ninguna abre `producto/`.
**NO en paralelo con:** T013 y T014, que también escriben dentro de `producto/`.

## Contexto suficiente

`producto/` es el producto formal, no el MVP. La distinción importa: el
[ADR 0001](../../decisiones/0001-el-mvp-es-instrumento-no-producto.md) dice que el MVP se
construye para tirarse, y esto no.

El stack sale del ADR 0006 y no se discute por proyecto. **Lo que sí está sin decidir es el
proveedor**: `AGENTS.md` §9 lo deja escrito porque `vacios.md` tiene abierto *«motor de base
de datos e infraestructura cloud: sin especificar»*, y para un servicio del Estado colombiano
eso arrastra preguntas de residencia de datos. Esta tarea monta Postgres 17 local en Docker,
que es cierto en las dos ramas de esa decisión, y **no compromete el proveedor**.

Dos cosas que ya se sabe que muerden, y están en `AGENTS.md` §11:

**El identificador del proyecto.** Los contenedores se llaman `supabase_db_<id>`. En una
máquina con más de un proyecto, un identificador genérico choca por prefijo y `docker exec`
empieza a hablarle al contenedor equivocado — y el error no habla de eso. Se descubrió con
un `project_id = "mvp"` conviviendo con otro proyecto.

**Los puertos.** El bloque `543xx` que trae `supabase init` lo usa el primer proyecto que se
haya levantado en esa máquina. Hay que escoger uno libre y anotarlo, o el segundo proyecto no
arranca y el error habla de puertos, no de lo que uno estaba haciendo.

Y una del propio ADR 0006: el proyecto de origen tiene `eslint-config-next@^16` con
`next@^15` y **funciona por casualidad**. Aquí se alinean.

## Dentro del alcance

- Next 15.5 con App Router, React 19.1, TypeScript 5.9 estricto con `noUncheckedIndexedAccess`.
- Tailwind 4.1 sin archivo de configuración: los tokens viven en el CSS.
- Supabase local con identificador propio y bloque de puertos escogido y anotado.
- `supabase/schemas/` **vacío**, con un LEEME que diga por qué está vacío.
- Una sola página que diga que el proyecto levanta.

## Fuera del alcance

- **Cualquier tabla.** `AGENTS.md` §9: no se escribe la primera migración hasta cerrar `[B2]`,
  que decide si el modelo es append-only y toca las diez tablas.
- Los tokens del producto. Son T013.
- La vista `/construccion`. Es T014.
- Autenticación de cualquier clase. No hay mecanismo de identidad decidido.

## Superficie asignada

- Crear: `producto/package.json`
- Crear: `producto/tsconfig.json`
- Crear: `producto/next.config.ts`
- Crear: `producto/src/app/layout.tsx`
- Crear: `producto/src/app/page.tsx`
- Crear: `producto/src/app/globals.css`
- Crear: `producto/supabase/config.toml`
- Crear: `producto/supabase/schemas/LEEME.md`
- Crear: `producto/LEEME.md`
- Leer: `decisiones/0006-stack-fijo.md`
- Leer: `AGENTS.md`
- No modificar: `harness/`
- No modificar: `negocio/`

## Interfaces

**Consume:**
- Nada. Es la raíz del producto.

**Produce:**
- `producto/package.json` con los guiones `dev`, `build`, `lint` y `test`. T013 le agrega
  `tokens:build` y T014 no lo toca.
- `producto/src/app/globals.css` como el único punto de entrada de estilos. T013 importa ahí.
- El identificador y el bloque de puertos anotados en `producto/LEEME.md`.

## Invariantes aplicables

- Ninguna del negocio todavía: no hay datos. **Y esa es justamente la razón de que
  `supabase/schemas/` quede vacío** — `metodo/frentes.md` dice que la invariante suprema se
  hace imposible en el mismo frente donde nacen los datos que podrían violarla, nunca en uno
  posterior. Crear tablas aquí sería crear ese frente sin su invariante.

## Casos de verificación

- [ ] `npm run dev` → sirve en un puerto y la página responde 200
- [ ] `npm run build` → termina sin errores
- [ ] `npx tsc --noEmit` → sin errores, con `strict` y `noUncheckedIndexedAccess` activos
- [ ] `supabase start` → levanta con el identificador propio, y `docker ps` lo muestra con ese prefijo
- [ ] `lsof -nP -iTCP:<puerto elegido> -sTCP:LISTEN` antes de arrancar → vacío
- [ ] `npm ls eslint-config-next next` → misma versión mayor en las dos

## Pasos de ejecución

- [ ] Escoger el bloque de puertos y **comprobar que está libre antes de usarlo**, registrando
      la salida de `lsof`.
- [ ] Crear el proyecto con las versiones exactas del ADR 0006.
- [ ] Comprobar que `tsc` falla si se indexa un arreglo sin comprobar — es la prueba de que
      `noUncheckedIndexedAccess` está de verdad puesto, y no solo escrito.
- [ ] Arrancar Supabase y comprobar el prefijo de los contenedores.
- [ ] Anotar identificador y puertos en `producto/LEEME.md`.
- [ ] Correr los seis casos y registrar cada salida.

## Terminado cuando

- [ ] Los seis casos de verificación pasan, con su salida registrada.
- [ ] `supabase/schemas/` está vacío y su LEEME dice que espera a `[B2]`.
- [ ] No se creó ninguna tabla.
- [ ] Pasó revisión de cumplimiento y revisión técnica.

## Entrega esperada

- Archivos creados.
- Las versiones exactas que quedaron instaladas, contra la tabla del ADR 0006.
- El bloque de puertos escogido y la prueba de que estaba libre.
- Riesgos o supuestos residuales.
