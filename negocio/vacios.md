# Vacíos

Lo que hubo que decidir construyendo y la especificación no responde — porque no le
corresponde. La especificación dice qué se mide y con qué reglas; construir obliga a decidir
cosas que ninguna entrevista destapa, porque nadie sabe que son preguntas hasta que hay que
resolverlas para poder seguir.

**Este archivo es la prueba de que el método sirve.** Si al terminar un frente está vacío, o
no se construyó nada o no se anotó lo que se decidió.

> Este archivo empieza con lo que destapó montar el **andamiaje**, no el producto. El
> producto todavía no tiene una línea de código de negocio, y aun así construir ya obligó a
> decidir seis cosas y destapó tres preguntas. La lista de vacíos de la especificación v0
> vive aparte, en `especificacion-v0-2026-09-13/vacios.md`, hasta que `T020` las junte.

---

## 1 · Decidido

| # | Vacío que había | Qué se decidió | Dónde |
|---|---|---|---|
| V1 | `[A1]` ¿Dónde vive el producto formal, y qué manda cuando el harness y Superpowers se contradigan? | El harness es la Capa A y decide qué se construye; Superpowers es la Capa B y organiza cómo. Cadena de autoridad de siete niveles; el módulo entregable manda sobre el plan | [`decisiones/0011-el-harness-y-superpowers.md`](../decisiones/0011-el-harness-y-superpowers.md) |
| V2 | `[A1]` ¿Se puede paralelizar por tareas? Las dos fuentes parecían decir cosas distintas | No: el paralelismo es **entre planes**. Un módulo = un plan = un worktree = una corrida secuencial | ADR 0011, §«dónde vive el paralelismo» |
| V3 | `[B1]` El paquete de requerimientos ¿es documento del cliente o trabajo propio? Cambia si se versiona o no | Trabajo propio: su `LEEME` dice «propuesta nuestra, sin acordar». Se versiona. `insumos/` queda para documentos externos, fuera de git | [`negocio/especificacion-v0-2026-09-13/ESTADO.md`](especificacion-v0-2026-09-13/ESTADO.md) |
| V4 | `[C3]` ¿Con qué identificador y puertos arranca Supabase, con cinco proyectos ya en la máquina? | `project_id = participacion` y bloque `548xx`, los dos comprobados libres antes de usarlos. El `dev` de Next en 3100, porque el 3000 lo tiene otro proceso | [`producto/LEEME.md`](../producto/LEEME.md) |
| V5 | `[E2]` ¿Cómo se sabe que una tarea está lista de verdad, y no solo porque alguien lo escribió? | El estado se declara —cambiarlo es una decisión con evidencia— pero **las condiciones se derivan**, y el guion señala dónde lo declarado y los archivos no coinciden | `scripts/lib/construccion.py` |
| V6 | `[B1]` ¿«Listo» y «despachable a un agente» son lo mismo? | No. `listo` son las cuatro condiciones de la guía §5; despachable son además las nueve de §7, entre ellas el contrato con su superficie de archivos. Se reportan separados | `scripts/lib/construccion.py`, `revisar_listas()` |
| V9 | `[C4]` ¿Qué pasa cuando la copia de los tokens en el producto se desincroniza de su fuente? El generador reescribe su propio archivo de entrada y las copias se hacen con un guion **(cerraba Q3)** | Un chequeo compara las dos copias contra el original y falla si difieren. Se vio fallar editando un color a mano en la copia | `scripts/validar.sh`, chequeo «la copia de los tokens» |

### Reglas donde dos se tocaban

| # | Las dos reglas | Qué se decidió | Por qué |
|---|---|---|---|
| V7 | El ADR 0010 dice que `negocio/` no se commitea por confidencialidad. La guía dice que el estado vive en archivos recuperables | Se versiona `negocio/`, menos `insumos/` | No es el mismo caso. El ADR 0010 describía un repositorio con documentos marcados `Información Reservada`; aquí no hay ninguna marca de clasificación, y el repositorio es privado. `insumos/` sigue fuera para cuando lleguen documentos que sí la tengan |
| V8 | `interfaz.md` I4 dice «la marca la pone el harness». I5 dice que la línea gráfica es del producto, nunca del harness | Los SVG de Linktic se quedan en `harness/vista-modulos/` | Parecían contaminación de un negocio y no lo son: esas pantallas son herramienta interna y se ven igual en todos los proyectos. La que nunca entra al harness es la línea gráfica **del cliente** |

---

## 2 · Por decidir

| # | La pregunta | Qué bloquea | Recomendación |
|---|---|---|---|
| Q1 | `[E1]` **¿Cómo se distingue una capa que flota, sin usar sombra?** El sistema de diseño no tiene ni un token de sombra, y es una decisión escrita —«sin elevación decorativa»—. shadcn las necesita para Popover, Dialog y DropdownMenu | Cualquier componente flotante. Hoy las ocho variables salen en `none` y eso está marcado como hueco, no como valor decidido | Decidirlo **antes del primer componente flotante**, no después. `contraste.md` ya avisa que «los bordes decorativos sutiles no identifican controles», así que la respuesta probablemente no es solo un borde más oscuro |
| Q2 | `[B3]` **¿Qué versión de GOV.CO aplica?** La v4 publica dos azules y Montserrat/Work Sans; existe una v5 que se identifica como QA; y hay un PDF de MinTIC que menciona otras tipografías. El manual oficial daba 404 al consultarlo | Cerrar marca, tipografía institucional y los componentes transversales. **No bloquea construir**: los tokens ya separan la identidad institucional del significado de las acciones justamente para esto | Preguntarlo junto con la entidad operadora, en el mismo momento. Urgente antes de la primera pieza pública |

---

## 3 · Datos que faltan

| Qué falta | Qué desbloquea | A quién se le pide |
|---|---|---|
| Las seis decisiones del pliego | El modelo de datos entero. La P3 toca las diez tablas | Miguel Gómez — [`preguntas/decisiones-que-bloquean-la-construccion.md`](preguntas/decisiones-que-bloquean-la-construccion.md) |
| El prototipo navegable de v0.5 | Traducir los nueve patrones a React con una referencia de interacción, no solo de estilo. Las validaciones prueban un artefacto que no vino en la carpeta | Al equipo de diseño |
| Las siete máquinas de estado | Los módulos de revisión, gestión, convocatoria y eventos | Es una sesión de diseño, no un pliego |

---

## Cuando una entrada resulta falsa

No se borra: se reescribe diciendo que era falsa y por qué. Un registro que se corrige a sí
mismo es el que se sigue leyendo; uno que solo acumula aciertos, nadie lo cree.
