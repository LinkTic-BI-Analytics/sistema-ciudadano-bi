# El producto

Esto es el **producto formal**, no el MVP. La distinción importa: el
[ADR 0001](../decisiones/0001-el-mvp-es-instrumento-no-producto.md) dice que el MVP se
construye para tirarse, y esto no. Lo que gobierna aquí son las §8 a §12 de
[`AGENTS.md`](../AGENTS.md).

## Los números de esta máquina

Los dos vienen de `AGENTS.md` §11, y los dos se escogieron **comprobando que estaban
libres**, no por defecto.

| | Valor | Por qué este |
|---|---|---|
| `project_id` | `participacion` | En esta máquina ya viven cinco proyectos Supabase: `depositos`, `finanzas-hogar`, `finanzas-hogar-claude`, `mvp-financiero-grok` y `somostodos`. Los contenedores se llaman `supabase_db_<id>`, y un identificador genérico choca por prefijo: `docker exec` empieza a hablarle al contenedor equivocado y el error no habla de eso. `supabase init` había puesto `producto`, que es exactamente el genérico |
| Bloque de puertos | `548xx` | El `543xx` por defecto lo puede tomar cualquiera de los cinco vecinos al arrancar. Se comprobó con `lsof -nP -iTCP:<puerto> -sTCP:LISTEN` que los nueve estaban libres |
| Puerto de `dev` | `3100` | El 3000 lo tiene `linktic-crm-server` en esta máquina |

Si clonas esto en otra máquina, **vuelve a comprobar**. Los puertos libres son una propiedad
de la máquina, no del proyecto.

## Qué hay y qué no

| | |
|---|---|
| Hay | Next 15.5 con App Router · React 19.1 · TypeScript estricto con `noUncheckedIndexedAccess` · Tailwind 4 sin archivo de configuración · Supabase local en Docker |
| **No hay, a propósito** | **Ninguna tabla.** Ver [`supabase/schemas/LEEME.md`](supabase/schemas/LEEME.md) |
| **No hay, a propósito** | **Ninguna autenticación.** No hay mecanismo de identidad decidido — es la pregunta P4 del pliego |
| Todavía no | Los tokens del sistema de diseño (T013) y la vista de construcción (T014) |

## De cero a andando

Lo que hace falta **antes**, y que no instala ningún guion: **Docker** (para la base),
la **CLI de Supabase** (`brew install supabase/tap/supabase`) y **Node 24 o más nuevo**
—el `package.json` lo declara—. Node importa: las pruebas importan archivos `.ts`
directamente y una versión vieja falla con un error que no habla de eso.

```
cd producto
npm ci
supabase start                       # levanta la base y aplica las migraciones

cp .env.example .env.local           # y pega los valores que imprime:
supabase status                      # URL, publishable key y secret key

cd .. && ./scripts/sembrar.sh        # el proceso de prueba y el catálogo del DANE
./scripts/sembrar-agenda.sh          # la convocatoria y los encuentros de la portada
cd producto && npm run dev           # http://localhost:3100
```

El catálogo territorial **ya viene en el repositorio** —los `.xlsx` del geoportal del DANE
y los `.csv` convertidos, con su versión— así que no hay que descargarlo. `divipola.sh
--bajar` existe para el día que el DANE publique uno nuevo.

**La llave de IA es opcional.** Sin `OPENROUTER_API_KEY` la captura funciona igual: se usa
la segmentación y se le pregunta a la persona por las cinco partes en vez de solo por las
que le falten. `IA-01` lo exige —la recepción no puede depender de un tercero— y hay
pruebas que lo comprueban borrando la llave.

Para comprobar que quedó bien: `./scripts/validar.sh` desde la raíz. Corre los tipos, el
build, las pruebas de nodo, los recorridos de navegador y una veintena de chequeos más.

### Si algo no arranca

| Síntoma | Qué pasa |
|---|---|
| `docker exec` habla con otro contenedor | El `project_id` es `participacion`; un identificador genérico choca por prefijo con los vecinos |
| Un puerto ocupado | El bloque `548xx` y el `3100` se escogieron libres **en esta máquina**. En otra hay que volver a comprobar |
| Las pruebas fallan al importar un `.ts` | Node viejo. Hace falta 24 o más |
| La portada sale sin encuentros | Falta `./scripts/sembrar-agenda.sh` |

## Los guiones

```
npm run dev          levanta en 3100
npm run build        compila; falla si hay un error de tipo o de lint
npm run tipos        solo los tipos
npm run test         Playwright
npm run db:arrancar  Supabase local
npm run db:esquema   genera la migración desde supabase/schemas/
```

Y desde la raíz del repositorio, `./scripts/validar.sh` los corre junto con todo lo demás.

## Una advertencia sobre el stack

El [ADR 0006](../decisiones/0006-stack-fijo.md) fija estas versiones **para el MVP**, y él
mismo dice que *«el stack del MVP no compromete nada de lo que venga después»*. Aquí se está
usando para el producto, que es una decisión distinta.

Se sostiene porque las reglas de `AGENTS.md` §8 y §9 están escritas contra **Postgres y un
framework con servidor**, no contra un proveedor: los cuatro niveles para ubicar la lógica,
el esquema declarativo, la auditoría append-only y los catálogos versionados se cumplen igual
con Supabase gestionado que con Postgres propio.

**Lo que sigue sin decidirse es el proveedor.** `vacios.md` tiene abierto *«motor de base de
datos e infraestructura cloud: sin especificar»*, y para un servicio del Estado colombiano eso
arrastra preguntas de residencia de datos que nadie ha respondido. Nada de lo que hay aquí la
prejuzga.
