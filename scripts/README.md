# Los chequeos y las herramientas

Lo que se corre, no lo que se lee. Cada cosa aquí existe porque **un chequeo que hay que
acordarse de correr no es un chequeo**.

## `leer-insumos.sh`

Prepara los documentos que el cliente trajo a `negocio/insumos/` para que `/leer` pueda
trabajarlos. Se corre las veces que haga falta.

```
./scripts/leer-insumos.sh                  # local: no sale nada de la máquina
./scripts/leer-insumos.sh --motor mistral  # con la API de afuera, si está autorizado
```

La primera vez se demora: crea el entorno de Python y compila el OCR. Después son
segundos.

### Qué hace

| Documento | Cómo se lee |
|---|---|
| PDF con capa de texto | `pypdf` en modo `layout`, que conserva la forma de las tablas. El modo corrido las convierte en una sopa de números |
| PDF escaneado o fotografiado | OCR con el framework Vision de macOS. Local, gratis, y no manda nada a ninguna parte |
| Figuras | Se separan de los membretes **por repetición**: una imagen igual en todas las páginas es un logo, no un diagrama |

Todo queda en `negocio/insumos/.extraido/`, que está fuera de git.

Y lee la **marca de clasificación** de cada documento —`Información Reservada`,
`Clasificada`, `Pública`— distinguiendo el sello del pie de página de una mención suelta en
el cuerpo del contrato: un sello se repite en todas las páginas, una cláusula aparece dos o
tres veces. Sin esa distinción, un pliego público sale marcado confidencial porque su
cláusula de confidencialidad usa esas dos palabras.

### La compuerta

`--motor mistral` manda los documentos a un servidor de otra empresa. Antes de mandar nada,
el script exige dos cosas:

1. **Que exista `negocio/autorizacion-de-salida.md`.** Sin ese archivo no sale nada, ni
   siquiera lo marcado público. Escribirlo **es** el acto de aprobación.
2. **Que el documento restringido esté marcado `[x]` ahí, por nombre.** Un documento sin
   marca de clasificación cuenta como restringido: uno que no dice qué es no autoriza nada.

No es un aviso: es un `return False`. Lo que el analista escribe en ese archivo es lo único
que abre la puerta.

### Por qué el motor por defecto es el local

Porque alcanza. En el primer negocio de verdad, el OCR de macOS leyó 22 páginas
fotografiadas con un celular en 11 segundos, sin un peso y sin sacar de la máquina un anexo
técnico marcado `Información Reservada`. Lo que Mistral agrega —tablas con estructura,
descripción de figuras, extracción a JSON— es real pero es marginal, y se paga mandando
documentos del cliente afuera.

La regla que sale de ahí: **primero local, y afuera solo lo que no se pueda leer aquí.**

## `densidad.sh`

Cuánta información hay cargada, y sobre qué. Se corre en la etapa **0a**, después de
`leer-insumos.sh` y antes de decidir por dónde arrancar.

```
./scripts/densidad.sh
```

Cuenta, por región de cada documento, **palabras** y **epígrafes**. Las dos columnas dicen
cosas distintas y hay que leer las dos: muchas palabras y pocos epígrafes es una explicación;
muchos epígrafes y pocas palabras es un índice sin cuerpo.

**No decide: cuenta.** Existe porque *"¿por dónde arrancamos?"* se contesta con una opinión
cuando no hay con qué medirla — y la opinión favorece lo que suena interesante, mientras el
conteo favorece lo que está escrito, que es lo único que se puede construir sin inventar.

## `esquema.sh`

Genera la migración a partir de los esquemas declarativos de `mvp/supabase/schemas/`.

```
./scripts/esquema.sh
```

`supabase db diff` necesita una base sombra que no siempre levanta. Como el esquema
declarativo es la fuente de verdad (ADR 0006), la migración se **deriva** de él concatenando:
es lo mismo que el diff produciría contra una base vacía.

**Se corre cada vez que cambie un archivo de `schemas/`.** Y ojo con `config.toml`: si
`schema_paths` viene comentado, el CLI ignora `schemas/` y `db reset` siembra contra una base
vacía — el error que sale es `relation "…" does not exist` y no dice por qué.

## `linea-grafica.sh`

Trae el sistema de diseño del cliente adentro del MVP.

```
./scripts/linea-grafica.sh
```

La fuente es `negocio/linea-grafica/tokens/`, que es donde el cliente entrega. Pero el CSS no
puede salir de `mvp/` —Turbopack no lo deja— así que se copia. **La copia no se edita:** se
corre esto cada vez que el cliente entregue una versión nueva, y lo que cambie se ve en el
diff.

## `grafo.sh`

El grafo del negocio, hecho explícito y consultable.

```
./scripts/grafo.sh                  telemetría: en qué vamos y qué falta
./scripts/grafo.sh R3               todo lo que toca R3, y nada más
./scripts/grafo.sh --frente 2       lo que hace falta para construir ese frente
./scripts/grafo.sh --json           el grafo entero, para quien lo consuma
```

No inventa nada: lee lo que ya está escrito en `negocio/`. Si un dato no está allá, aquí
tampoco aparece — y eso es lo que lo hace útil como diagnóstico en vez de como reporte.

**Para qué sirve de verdad.** Para no leer 18.000 palabras cada vez que hace falta entender
una regla. `grafo.sh R5` devuelve seis nodos: la regla, de qué principio sale, qué invariante
sostiene, qué vacío la cerró y qué dato espera. Con setenta reglas en vez de siete, esa
diferencia es la que hace que el método siga funcionando.

Deja `negocio/.grafo.json` al correr, que es lo que consume la vista de módulos del MVP.

## `.env`

Solo hace falta para el motor de afuera. Se copia de `.env.example` y está fuera de git.
Mira de qué plan es la llave: el gratuito de Mistral entrena con lo que le mandes.

## `base-limpia.sh`

¿La línea base sigue limpia? Se corre **antes de subir una cosecha**.

```
./scripts/base-limpia.sh
```

La regla es *"vuelve la forma, nunca el contenido"*, y lo que se cuela no se ve leyendo: se
ve buscando. Devuelve `1` si encuentra algo, así que sirve en un gancho.

Busca cuatro cosas, y las cuatro pasaron de verdad:

| | |
|---|---|
| Archivos de un negocio corrido | Una especificación, una bitácora, un `.env`, un `mvp/` |
| Insumos o respuestas del cliente | Lo que quedó en `insumos/`, `preguntas/` o `linea-grafica/` |
| Secciones sin terminar | Líneas `> ➤` fuera de las plantillas, que se leen como si estuvieran listas |
| **Una regla definida dos veces** | Al corregir una regla se dejó la anterior al lado, y el archivo terminó diciendo las dos cosas |

La última es la peor y es la que motivó el script: quien lea de arriba abajo aplica la
primera que encuentre. **Corregir es reemplazar, no añadir.**
