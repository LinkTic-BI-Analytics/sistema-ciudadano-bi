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
| T009 | Los cinco comandos: `/hoja-de-ruta` `/planear-construccion` `/despachar` `/revisar-tarea` `/integrar` | — | T004 | B | orquestador | terminado | los cinco con frontmatter; ninguno trae encabezados de plantilla adentro |
| T010 | `/donde-voy` extendido con la construcción, sin perder el diagnóstico de descubrimiento | — | T007 | B | orquestador | terminado | reporta las dos capas; corregida la ruta de tokens y el frontmatter de `/explorar` |
| T011 | `scripts/validar.sh` con seis chequeos, cada uno con su línea de «cómo hacerlo fallar» | — | T007, T008 | C | orquestador | terminado | **los seis se vieron fallar**, uno por uno, y volver a verde |
| T012 | `producto/`: Next 15.5, React 19.1, TS estricto, Supabase local con puertos propios, esquema declarativo vacío | — | T006 | A | orquestador | terminado | `build` pasa · `dev` HTTP 200 en 3100 · Supabase en `548xx` con id `participacion`, conviviendo con `depositos` · `noUncheckedIndexedAccess` se vio rechazar un índice sin comprobar |
| T013 | Pipeline de tokens v0.5 → `producto/`, con el contraste en la compuerta | — | T012 | B | orquestador | terminado | `tokens.sh` corre el generador entregado sin tocarlo · 319 tokens y 41 pares en el producto · dos chequeos nuevos, los dos vistos fallar |
| T014 | Vista `/construccion`, hermana de `/modulos` y `/telemetria`. Lee `.estado.json` en cada petición | — | T007, T012 | C | orquestador | terminado | HTTP 200 con estas 20 filas reales · chequeo de sincronía de vistas, visto fallar |
| T015 | Cosecha: sacar el negocio ajeno de `harness/vista-modulos/` **y hacer que el chequeo lo detecte** | — | T001 | C | orquestador | terminado | `1f29fe2` en la línea base. El chequeo se vio fallar contra la versión contaminada y pasar contra la limpia |
| T016 | `negocio/integraciones.md` con las 6 dependencias externas y su nivel de mock | — | — | D | negocio | listo | ninguna frontera sin sus tres preguntas respondidas |
| T017 | Pliego de las decisiones que bloquean la construcción, para quien decide el producto | — | — | D | negocio | terminado | `negocio/preguntas/decisiones-que-bloquean-la-construccion.md`: 6 decisiones + las 2 fijas, cada una con su porqué y qué bloquea |
| T020 | `negocio/especificacion.md` normalizada contra la plantilla, con `vacios.md` y `acuerdos.md` | — | T016, T017 | D | negocio | candidato | el escribano sin defectos · 0 códigos huérfanos |
| T018 | §3 Principios, §4 Taxonomías, §8 Rituales, §9 Fallas y §10 Estado cerradas | — | T020 | D | negocio | candidato | ninguna sección vacía · al menos una invariante suprema escogida |
| T019 | `/entregar M10` y `/entregar M01`: los dos primeros módulos que pasan el sobre cerrado | — | T018 | D | negocio | candidato | las 5 casillas del sobre cerrado marcadas, en los dos |
| T021 | La primera migración: `proceso_id` en todo, catálogo DIVIPOLA sembrado, aporte, ubicación, expediente y auditoría append-only | I1, I2, I4, R1 | T012, T020 | A | orquestador | terminado | 9.715 territorios sembrados · **12 comprobaciones de invariante contra la base, vistas fallar quitándole una restricción** |
| T022 | `R1` y `R2` en Postgres, y el corte inmutable | R1, R2, I6 | T021 | A | orquestador | terminado | **9 cuentas contra los números calculados a mano de la §9**, vistas fallar quitándole el `distinct` al numerador: daba 80% donde la spec dice 70% |
| T023 | Recibir un aporte: acción de servidor con `I1` de verdad y el lugar declarado guardado siempre | RF5, I1, I2, DAT-01 | T021 | A | orquestador | terminado | 7 casos vistos fallar antes · 10 más de acceso, vistos fallar abriéndole `territorio` a `anon` · registro en `construccion/progreso/T023-registro.md` |
| T024 | La pantalla «Cuéntanos qué pasa», con los tokens y el selector escribir/hablar | RF1, RF2, N02 | T023 | A | orquestador | candidato | una persona registra agua intermitente en una vereda sin saber la entidad ni adjuntar estudios, y recibe comprobante |
| T025 | Síntesis corregible y confirmada por la persona, versionada | RF2, N03, V14 | T024 | A | orquestador | candidato | paso 3: una transcripción cambia acueducto por alcantarillado, la persona corrige antes de validar |
| T026 | El comprobante: se emite tras persistir, y se consulta **sin correo** | RF4, RF5, RES-01 | T023 | A | orquestador | terminado | 7 casos vistos fallar antes · visto fallar otra vez quitándole el alcance por proceso a la función |
| T027 | Bandeja de aclaración de ubicación, con los cuatro estados separados | RF7, GEO-01, CAL-01, I2 | T021 | B | orquestador | terminado | 7 casos vistos fallar antes · los cuatro estados de `CAL-01` se mueven por separado, comprobado |
| T028 | Crear expediente y vincular aportes **con motivo**, y la prueba de decisión | RF7, NEC-01, I4, V12 | T027 | B | orquestador | terminado | 6 casos nuevos, 13 en la tanda · los tres casos de la tabla de `V12` están como pruebas textuales |
| T029 | Desagrupar conservando originales y **reabriendo prioridad sin heredar aprobación** | RF7, I4 | T028 | B | orquestador | terminado | 6 casos nuevos, 19 en la tanda · el corte tomado antes sigue devolviendo lo mismo, comprobado |
| T030 | Los cinco eventos de gestión separados: recepción, remisión, decisión, respuesta, siguiente paso | RF8, RES-01 | T021 | C | orquestador | terminado | 7 casos vistos fallar · el estado se **deriva**, nunca se almacena · nunca dice «vencido» ni «resuelto» |
| T031 | El corte exportable con su diccionario, filtros, zona horaria y versión de catálogo | RF6, TRA-01, R1, R2 | T022 | C | orquestador | listo | paso 8: otro analista reproduce el total a partir del mismo corte y regla |
| T032 | Permisos de servidor por rol y ámbito, **también por URL directa** | RF14, SEG-01, I6 | T021 | D | negocio | bloqueado | paso 8, segunda mitad: otro rol no accede a datos protegidos |
| T033 | El aporte colectivo y su vocería | RF16, V15, V19 | T028 | D | negocio | bloqueado | un cambio de vocero no transfiere notificaciones a alguien no validado |

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
| T019 | La especificación no pasa la compuerta: ningún módulo tiene una casilla del sobre cerrado marcada | negocio | antes de cualquier tarea con autoridad de módulo | **Todo lo demás.** Las tareas de producto se apoyan en las 21 decisiones ya tomadas, que sí están escritas |
| T032 | `P4` · no hay **nada** escrito sobre identidad en los 24 documentos fuente. Y `Q18`: si la visibilidad es aislamiento o jerarquía | negocio | antes de la primera pantalla interna que alguien use de verdad | **Toda la captura pública** (T023–T026), que no necesita cuenta. Y las pantallas internas **contra datos de ejemplo**, sin conectar el permiso |
| T033 | `Q23` · «colectivo» no existe como entidad en ningún documento. `Q24` · un expediente que mezcla aporte colectivo con individuales | negocio | antes del primer encuentro presencial | **El aporte individual completo.** La columna `es_colectivo` ya está y hoy solo se marca |

> Ninguna otra tarea está bloqueada hoy. Las de la línea `D` esperan a una persona, que no
> es lo mismo que estar bloqueadas: tienen propietario y pueden empezar.

## Las reglas de actualización

- Cada cambio de estado registra fecha y evidencia.
- Una tarea `bloqueado` indica **qué sí puede construirse sin la respuesta**.
- Una tarea nueva se agrega sin borrar la historia anterior.
- Una tarea reordenada conserva el porqué.
- Una tarea `terminado` **no se reabre en silencio**: vuelve a `listo` con la causa.
- Si cambia un código del módulo, se revisan todas las tareas que lo citan.
