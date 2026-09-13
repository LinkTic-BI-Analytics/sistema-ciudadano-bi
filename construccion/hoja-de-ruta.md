# Hoja de ruta — Participación Ciudadana Colombia

**Objetivo vigente:** que un módulo entregable pase la prueba del sobre cerrado y
`/planear-construccion` produzca su plan sin contradicciones ni interfaces sin definir.
**Fuente:** todavía ninguna. `entregable/modulos/` está vacío — por eso el objetivo es
llegar al primero. Hasta entonces gobierna `negocio/especificacion-v0-2026-09-13/`, que
**no pasa la compuerta de la Capa B** (ver su `ESTADO.md`).
**Actualizada:** 2026-09-13 · orquestador

> **Los estados de esta tabla se escriben a mano, y eso es a propósito.** Cambiar de estado
> es una decisión con evidencia, y una decisión la toma alguien. Lo que `scripts/construccion.sh`
> hace no es corregirlos: es **señalar dónde lo declarado aquí y lo que muestran los archivos
> no coinciden**. Un tablero que se corrige solo dice que todo está bien porque él mismo lo
> escribió; uno que señala sus contradicciones se puede creer.

<!-- derivado · lo escribe scripts/construccion.sh · NO editar a mano -->
**Ruta crítica:** T016 → T020 → T018 → T019
**Líneas paralelas activas:** ninguna
<!-- /derivado -->

> Este tablero arranca con las tareas de su propia estructuración. No es un truco: es el
> Paso 1 de adopción de `metodo/construccion-solida-y-paralela.md` §14 — *«comprobar si el
> mapa representa el trabajo real antes de automatizarlo»*. Si el tablero no sirve para
> llevar estas diecinueve filas, tampoco va a servir para las del producto.

## Las dos pistas

**Pista B — andamiaje** (líneas `base`, `A`, `B`, `C`). No depende de ninguna de las 12
decisiones abiertas. Puede correr sin esperar a nadie.

**Pista A — descubrimiento** (línea `D`). Necesita a la persona responsable del negocio.
Es la que cierra la compuerta que hoy está cerrada.

Las dos son independientes según §2.2 de la guía, y por eso corren a la vez. Se juntan en
T019, que es la primera tarea con autoridad real.

## Las tareas

| ID | Resultado | Códigos | Depende de | Línea | Propietario | Estado | Evidencia de cierre |
|---|---|---|---|---|---|---|---|
| T001 | Repositorio del negocio creado desde la línea base, con la especificación v0 y el sistema de diseño adentro | — | — | base | orquestador | terminado | `a9480d8` · 140 archivos · `git status` limpio |
| T002 | Superpowers 6.3.0 y las siete skills del stack instaladas y versionadas | — | T001 | base | orquestador | terminado | `3b5dfe8` · `claude plugin list` · 7 en `.claude/skills/` |
| T003 | ADR 0011: cadena de autoridad, artefacto puente, dónde vive el paralelismo, cuál registro manda | — | T001 | base | orquestador | terminado | `0cca435` · enlaces resueltos · 0 líneas `➤` |
| T004 | `construccion/` con su tablero y las cuatro plantillas de la Capa B | — | T003 | A | orquestador | terminado | este archivo + 4 plantillas + índice |
| T005 | `entregable/mapa-de-modulos.md`: grafo de los 10 módulos, olas, ciclos a romper y núcleo mínimo | — | T001 | B | orquestador | terminado | el grafo coincide con el que imprime `/hoja-de-ruta` |
| T006 | `AGENTS.md` §8 a §12 llenas: lógica, base de datos, interfaz, entornos, terminado del código | — | T003 | C | orquestador | terminado | `grep "(pendiente)" AGENTS.md` vacío |
| T007 | `scripts/construccion.sh` → `.estado.json` con grafo, ruta crítica, listas, bloqueos, deterioro y cobertura | — | T004 | A | orquestador | terminado | corre sobre estas 20 filas; encontró un error de parseo y 6 contradicciones reales |
| T008 | `scripts/paralelismo.sh`: matriz de solapamiento leída de la superficie asignada de cada contrato | — | T007 | A | orquestador | terminado | solapamiento inyectado → 1; quitado → 0. Se vio fallar |
| T009 | Los cinco comandos: `/hoja-de-ruta` `/planear-construccion` `/despachar` `/revisar-tarea` `/integrar` | — | T004 | B | orquestador | candidato | cada uno lee su plantilla en ejecución, ninguno trae encabezados adentro |
| T010 | `/donde-voy` extendido con la construcción, sin perder el diagnóstico de descubrimiento | — | T007 | B | orquestador | candidato | reporta las dos capas en una sola corrida |
| T011 | `scripts/validar.sh` con seis chequeos, cada uno con su línea de «cómo hacerlo fallar» | — | T007, T008 | C | orquestador | terminado | **los seis se vieron fallar**, uno por uno, y volver a verde |
| T012 | `producto/`: Next 15.5, React 19.1, TS estricto, Supabase local con puertos propios, esquema declarativo vacío | — | T006 | A | orquestador | listo | `npm run dev` levanta · `supabase start` sin choque de puertos |
| T013 | Pipeline de tokens v0.5 → `producto/`, con el contraste en la compuerta | — | T012 | B | orquestador | candidato | `tokens:build` no deja diferencias · romper un color hace fallar el `assert` |
| T014 | Vista `/construccion`, hermana de `/modulos` y `/telemetria` | — | T007, T012 | C | orquestador | candidato | muestra estas filas y aguanta 50 |
| T015 | Cosecha: quitar «Depósitos Judiciales» y la marca Linktic de `harness/vista-modulos/` | — | T001 | C | orquestador | listo | `base-limpia.sh` devuelve 0 en la línea base |
| T016 | `negocio/integraciones.md` con las 6 dependencias externas y su nivel de mock | — | — | D | negocio | listo | ninguna frontera sin sus tres preguntas respondidas |
| T017 | Pliego de las 12 decisiones abiertas, agrupado por quién puede responderlas | — | — | D | negocio | listo | cada pregunta con su porqué y con qué bloquea |
| T020 | `negocio/especificacion.md` normalizada contra la plantilla, con `vacios.md` y `acuerdos.md` | — | T016, T017 | D | negocio | candidato | el escribano sin defectos · 0 códigos huérfanos |
| T018 | §3 Principios, §4 Taxonomías, §8 Rituales, §9 Fallas y §10 Estado cerradas | — | T020 | D | negocio | candidato | ninguna sección vacía · al menos una invariante suprema escogida |
| T019 | `/entregar M10` y `/entregar M01`: los dos primeros módulos que pasan el sobre cerrado | — | T018 | D | negocio | candidato | las 5 casillas del sobre cerrado marcadas, en los dos |

> **Por qué T020 va después de T018 en el número y antes en la dependencia.** Los códigos
> son corridos y no se reciclan (`metodo/codigos.md`): la normalización apareció al montar
> el tablero, después de que T018 ya tuviera número. Se agrega al final y se ordena por la
> columna «depende de», no por el número.

## Los estados

| Estado | Qué significa |
|---|---|
| `candidato` | Apareció, pero todavía no tiene contrato suficiente |
| `listo` | Tiene autoridad, dependencias resueltas, propietario y prueba de cierre |
| `en construcción` | Su propietario está trabajando y no hay otro propietario activo |
| `bloqueado` | No puede avanzar. Incluye causa, dueño del desbloqueo y fecha de urgencia |
| `en revisión` | Implementación entregada, pendiente de una o ambas revisiones |
| `en integración` | Aprobada aislada, pendiente de verificarse con el conjunto |
| `terminado` | Integrada y comprobada con evidencia reciente |
| `caído` | Ya no se construirá. Conserva la razón y la decisión que lo retiró |

## Bloqueos

| Tarea | Causa | Dueño del desbloqueo | Urgente antes de | Qué SÍ se puede construir sin la respuesta |
|---|---|---|---|---|
| T019 | La especificación no pasa la compuerta: 12 decisiones sin tomar, `acuerdos.md` e `integraciones.md` vacíos, ningún módulo con una casilla del sobre cerrado marcada | negocio | antes de cualquier tarea de producto con autoridad | **Todo el andamiaje** — T004 a T015. Ninguna de esas tareas decide sobre una regla del negocio |

> Ninguna otra tarea está bloqueada hoy. Las de la línea `D` esperan a una persona, que no
> es lo mismo que estar bloqueadas: tienen propietario y pueden empezar.

## Las reglas de actualización

- Cada cambio de estado registra fecha y evidencia.
- Una tarea `bloqueado` indica **qué sí puede construirse sin la respuesta**.
- Una tarea nueva se agrega sin borrar la historia anterior.
- Una tarea reordenada conserva el porqué.
- Una tarea `terminado` **no se reabre en silencio**: vuelve a `listo` con la causa.
- Si cambia un código del módulo, se revisan todas las tareas que lo citan.
