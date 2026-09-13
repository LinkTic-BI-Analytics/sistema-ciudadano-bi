# ADR 0006 — El stack es fijo, y es el mismo del proyecto donde nació el método

**Alcance:** plantilla · **Estado:** aceptada · **Fecha:** 2026-08-28

## Contexto

El MVP se puede construir en cualquier cosa. Y quien opera Fase 1 no programa, así que no
tiene criterio para escoger — pero sí puede quedar atrapado en la conversación.

Hay además una razón más fuerte que la comodidad: **las reglas del harness solo se pueden
comprobar si el stack no cambia.** "Los formularios de creación se abren desde un
disparador" es una regla que un script puede verificar con un `grep` sobre archivos `.tsx`.
Con un stack distinto por proyecto, esa regla se vuelve un consejo, y un consejo que nada
comprueba se salta — que es la lección más cara del proyecto de origen.

## Decisión

**El mismo stack del proyecto donde nació el método**, sin cambios y sin discutirlo por
proyecto.

| Pieza | Versión | Para qué |
|---|---|---|
| Next.js | `^15.5` | App Router, Server Components y Server Actions |
| React | `^19.1` | — |
| TypeScript | `^5.9` | En modo estricto, con `noUncheckedIndexedAccess` |
| Supabase (`supabase-js`, `ssr`) | `^2.58`, `^0.7` | Base de datos, acceso y sesión |
| Supabase CLI | `^2.40` | Esquema declarativo, migraciones y pruebas |
| PostgreSQL | 17 | Corriendo local en Docker |
| Tailwind CSS | `^4.1` | Sin archivo de configuración: los tokens viven en el CSS |
| shadcn/ui | estilo `new-york`, base `neutral` | Componentes copiados al repositorio, no una dependencia |
| Radix Colors | `^3.0` | Las escalas de color; el proyecto escoge cuáles |
| Zod | `^4.1` | Validación compartida entre formulario y servidor |
| PostHog | `^1.270` / `^5.9` | Medición, banderas, repetición de sesión y errores, en una sola capa |
| Playwright | `^1.62` | Recorridos en un navegador de verdad, escritorio y celular |
| Vercel | — | Despliegue |
| lucide-react · motion · sonner · vaul | — | Iconos, movimiento, avisos y hojas en móvil |

Y las decisiones que vienen amarradas al stack, que tampoco se discuten por proyecto:

- **Cuatro niveles para ubicar la lógica**, en este orden: acceso a nivel de fila → función
  en Postgres → acción de servidor → función de borde. Nunca la misma regla en dos niveles.
- **El esquema de la base es declarativo** y es la fuente de verdad. Nunca se toca por el
  panel de administración.
- **El dinero es `numeric` y las cuentas se hacen en Postgres.** JavaScript formatea, no
  calcula.
- **Las llaves son `publishable` y `secret`**, no las viejas `anon` y `service_role`.
- **La medición es una sola capa** y su catálogo de eventos es un archivo tipado.

## Consecuencias

**Lo que se gana.** Cada decisión técnica que se le deja al analista es una sesión perdida en
algo que no descubre nada del negocio. Con el stack fijo esa conversación no existe, las
reglas del harness se pueden comprobar con scripts, y todo lo que se aprendió en un proyecto
—las reglas de pantalla, las de base de datos, los chequeos— sirve tal cual en el siguiente.

**Lo que se pierde.** Si un negocio necesita algo que este stack no da bien —tiempo real
pesado, procesamiento largo, un cliente móvil nativo— hay que salirse de la plantilla.

Se paga sin dolor porque **el MVP no es el producto** (ADR 0001). Lo que se construye aquí se
tira, y el equipo de desarrollo va a implementar el requerimiento en la tecnología que use.
El stack del MVP no compromete nada de lo que venga después: el entregable de
`plantillas/modulo.md` dice qué tiene que poder existir, nunca en qué motor.

**Lo que este ADR no decide.** Las escalas de color y las dos tipografías las escoge cada
proyecto — es lo primero que se hace y lo que evita que todos los MVP se vean iguales.

## Un desalineamiento conocido

El proyecto de origen tiene `eslint-config-next@^16` con `next@^15`. Son versiones mayores
distintas y funciona por casualidad. **No se replica**: al traer el stack se alinea, y queda
anotado aquí para que nadie lo copie creyendo que fue a propósito.
