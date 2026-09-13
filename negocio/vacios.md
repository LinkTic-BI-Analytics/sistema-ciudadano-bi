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
| V10 | `[C3]` ¿Cuál es la lista oficial de lugares? **(cerraba P1, primera mitad)** | **DIVIPOLA, del DANE.** Departamento 2 dígitos + municipio 3 = el código de 5 con que se identifica cualquier municipio; los centros poblados llevan 3 más. Cubre también las áreas no municipalizadas | `AGENTS.md` §9 · decidido por Miguel Gómez el 2026-09-13 |
| V11 | `[B2]` ¿Un aporte retirado se borra o se apaga? **(cerraba P3)** — «la que bloquea todo lo demás» | **Borrado lógico.** La fila se queda y se marca; no se borra físicamente. El modelo es append-only con lápidas | `AGENTS.md` §9 · decidido por Miguel Gómez el 2026-09-13 |

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
| Q4 | `[C2]` **DIVIPOLA no tiene barrios.** Llega hasta municipio y centro poblado —caseríos, corregimientos, inspecciones de policía—, que es rural. La visión dice que una necesidad se puede perder *«dentro de una ciudad o de una misma comunidad»*, y eso es barrio urbano | El mapa de cobertura dentro de una ciudad, y la promesa de no dejar perder voces dentro de un mismo municipio | Decidir si el barrio se captura como **texto libre sin catálogo** —lo que `I2` permite: queda «por aclarar» y no se infiere— o si se adopta un segundo catálogo urbano. **Antes de modelar la ubicación**, que es ya |
| Q5 | `[B3]` **¿Qué versión de DIVIPOLA, y qué pasa con la anterior?** No es hipotético: en 1997 los centros poblados pasaron de 2 dígitos a 3, así que un código histórico significa cosas distintas según la versión. Y los municipios se crean | Que un corte exportado en marzo siga siendo reproducible en octubre, que es lo que `R2` exige por escrito | Fijar la versión vigente al arrancar y guardarla **en cada registro**, no en una tabla aparte. La correspondencia entre versiones se escribe cuando haya la segunda. **Antes de la primera migración** |
| Q6 | `[A2]` **¿Cuáles son los municipios del piloto?** Es la otra mitad de la P1, y sigue abierta | Sin esa lista no hay denominador: el mapa de cobertura muestra conteos, **nunca un porcentaje** | Va con la entidad operadora, en la misma conversación. Antes del primer tablero que alguien de la institución vaya a mirar |
| Q7 | `[A3]` **El borrado lógico deja abierta la parte jurídica.** La Ley 1581 de 2012 da derecho a la **supresión** del dato personal, y una fila marcada sigue estando ahí | Nada del modelo: la separación física entre identidad y dato analítico que ya pide `AGENTS.md` §9 permite las dos cosas a la vez | La lectura natural es **borrar de verdad la identidad y el contacto, y dejar lógico el registro analítico**. Pero eso no lo decide el equipo técnico: hay que confirmarlo con quien responda por la política de tratamiento. **Antes del primer dato real de una persona** |
| Q8 | `[B2]` **Un aporte retirado, ¿sigue contando?** «Borrado lógico» dice qué pasa con la fila; no dice si sigue en el total publicado, en el denominador de `R2`, o en la necesidad donde ya estaba agrupado | Las cuentas del BI y la coherencia entre un corte viejo y uno nuevo | Las tres respuestas son defendibles y cambian los números. **Antes de implementar `R1` y `R2`**, que es lo primero que se va a construir del BI |
| Q9 | `[A1]` **¿Cuál es la unidad de pertenencia?** `metodo/frentes.md` dice que es lo único que de verdad no se puede agregar después: no es una restricción sobre una tabla, es una columna en **todas**. La especificación no la nombra, pero describe el acceso interno como «rol + tarea + convocatoria + territorio» | **Todo el esquema.** Agregarla después obliga a revisar cada consulta escrita hasta entonces, y basta con que una se escape | Que «convocatoria × territorio» sea la unidad es una lectura del texto, no una decisión. **Es la siguiente pregunta, y va antes que la primera tabla** |

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
