# Mapa de módulos

Qué módulos hay, qué necesita cada uno para poder existir, y **cuáles se pueden construir a
la vez**. Lo pide `metodo/construccion-solida-y-paralela.md` §4.

**Actualizado:** 2026-09-13 · derivado de `negocio/especificacion-v0-2026-09-13/`

## El objetivo, decidido el 2026-09-13

**Este sistema es una línea de alimentación al Sistema Nacional de Planeación.** Ese es el
valor, y ordena todo lo que sigue.

La investigación ya lo tenía escrito sin nombrarlo así. Es la **«ruta de política nacional»**
de su §11.1 — *traducir patrones de necesidades, brechas estructurales y obstáculos
regulatorios en opciones de política, metas, programas o cambios normativos*, y hacerlo
**«sin exigir éxito previo en un ranking municipal»**, conservando el vínculo de cada opción
con los contextos que la originaron.

Y el modo de operar sale de su §1.2: **registro permanente con cortes anunciados** para cada
ciclo de formulación, presupuesto y evaluación. No es una convocatoria que abre y cierra.

### El calendario no es nuestro, es de la Ley 152 de 1994

| Momento | Fecha límite |
|---|---|
| El proyecto de plan llega al Consejo Nacional de Planeación | 15 de noviembre |
| El CNP emite concepto y recomendaciones | antes del 10 de enero |
| El Gobierno lo presenta al Congreso | antes del 7 de febrero |
| En territorio: el proyecto llega al CTP | dentro de los 2 primeros meses desde la posesión |
| El CTP conceptúa | 1 mes |

De ahí sale la frase que más manda sobre el producto: **«el calendario obliga a anticipar la
escucha»**. Una convocatoria que recibe miles de aportes cuando el texto está prácticamente
cerrado no alcanza a convertirlos en nada.

### Y el límite que hay que decir en voz alta

**El concepto de un consejo de planeación no aprueba gasto ni obliga a incorporar cada
recomendación.** Escuchar un concepto es distinto de adoptarlo. Por eso el producto tiene que
declarar **qué puede decidir la ciudadanía y qué es una recomendación que la autoridad
examinará** — y con cuál de los tres niveles de compromiso se está comprometiendo: consulta,
deliberación con compromiso de respuesta, o decisión presupuestal autorizada. *Nunca
«vinculante» como promesa genérica* (`Q17`).

---

> ## Lo primero, porque cambia cómo se lee todo lo demás
>
> **Los diez módulos declaran `Depende de: —`.** Ninguna dependencia está escrita en la
> especificación. El grafo de este documento está **inferido** de las entradas y salidas que
> describe cada requerimiento funcional, y va marcado como tal en cada fila.
>
> Eso no lo invalida: lo vuelve una hipótesis con dueño. Cuando `T018` cierre la §10 de la
> especificación, **se revisa cada fila de aquí y cada tarea que la cite** — que es
> exactamente la última regla de actualización de la hoja de ruta.

## El número no es el orden

La especificación ya les puso número (M01 Captura … M10 Administración) y `metodo/codigos.md`
prohíbe reciclar códigos, así que **no se renumeran**. Pero el orden de construcción es otro:
el que tiene el número más alto, M10, es la raíz del grafo y va primero.

Leer la columna «ola», no el número.

## Los diez

| Cód | Módulo | RF | Superficie | Complejidad | Necesita antes (inferido) | Ola |
|---|---|---|---|---|---|---|
| M10 | Administración | RF14 | interna, pero **define las tres superficies** | alta | — · es la raíz | 0 |
| M01 | Captura | RF1, 2, 4, 5, 15 | **pública** + asistida | alta | M10 · M06 mínimo | 1 |
| M06 | Convocatoria y divulgación | RF10 | **pública** + interna | media-alta | M10 · campañas ← M03 | 1 |
| M09 | Contexto documental | RF13 | interna | baja-media | M10, débil · **casi aislado** | 1 |
| M02 | Revisión | RF7 | interna | **muy alta** | M01, M10 | 2 |
| M05 | Eventos y facilitación | RF9, RF16 | **pública** + interna | alta | M06, M01, M10 | 2 |
| M03 | BI institucional | RF6 | interna | alta | M01, M02, M10 | 3 |
| M04 | Gestión | RF3, RF8 | **pública** + interna | media-alta | M02, M10 · ← M08 | 3 |
| M07 | Discusión | RF11 | **pública** + interna | baja-media en P0 | M02, M10 | 3 |
| M08 | Priorización | RF12 | interna | media en P0 | M02, M03, M10 | 4 |

## El grafo

```
                    ┌──────────────────────────────┐
                    │  M10 · ADMINISTRACIÓN        │   la raíz
                    │  permisos por acción×registro│   nadie depende de nada
                    │  ×campo · catálogos          │   todos dependen de esto
                    │  versionados · fases ·       │
                    │  auditoría append-only       │
                    └──────────────┬───────────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
   ┌─────────────────┐   ┌──────────────────┐   ┌───────────────────┐
   │ M06 CONVOCATORIA│──▶│  M01 CAPTURA     │   │ M09 CONTEXTO DOC. │
   │ el contenedor   │   │  el aporte       │   │ casi sin ataduras │
   └────────┬────────┘   └────────┬─────────┘   └─────────┬─────────┘
            │                     │                       │
            ▼                     ▼                       │
   ┌─────────────────┐   ┌──────────────────┐             │
   │ M05 EVENTOS Y   │──▶│  M02 REVISIÓN    │◀────────────┘
   │   FACILITACIÓN  │   │  aporte →        │
   └─────────────────┘   │  expediente      │
                         └──┬────┬────┬─────┘
                            │    │    │
              ┌─────────────┘    │    └─────────────┐
              ▼                  ▼                  ▼
      ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
      │ M03 BI       │──▶│ M08 PRIORIZ. │   │ M07 DISCUSIÓN│
      └──────┬───────┘   └──────┬───────┘   └──────────────┘
             │                  ▼
             │          ┌──────────────┐
             └─────────▶│ M04 GESTIÓN  │──▶ cierra el ciclo en M01:
       (campañas M06)   └──────────────┘    el comprobante que emitió
                                            Captura es la llave de consulta
```

**Ruta crítica: M10 → M01 → M02 → M03.** Cuatro módulos, y tres de ellos de complejidad alta
o muy alta. Es la secuencia que determina el tiempo mínimo, y ninguna cantidad de agentes en
paralelo la acorta.

## Las olas

| Ola | Qué va a la vez | Se destraba con |
|---|---|---|
| **0 · cimientos** | **M10** + el modelo de datos común + el motor de conteo `R1`/`R2` + el catálogo geográfico versionado + el contrato del comprobante. **Secuencial: nadie más empieza antes** | — |
| **1 · entrada** | **M01** · **M06** sin campañas · **M09** | ola 0 |
| **2 · transformación** | **M02** · **M05** | M01, M06 |
| **3 · el entregable** | **M03** — es lo que recibe el Sistema Nacional. Con **M04** y **M07** en paralelo | M02 |
| **4 · cierre** | **M08** · las campañas de M06 (`CAM-01/02` y los QR) | M03 |

> **Corrección del 2026-09-13.** Este grafo ponía el BI como «explotación», después de todo lo
> demás. **Estaba mal, y el paquete lo decía:** *«el BI institucional es parte del núcleo
> inicial: no se pospone como un adorno posterior a la captura»*
> (`especificacion_datos_y_bi_v1.md` §2).
>
> Con la línea de alimentación decidida, la razón se ve: **el corte trazable y reproducible ES
> el entregable al Sistema Nacional.** Un sistema que captura y responde pero no produce un
> corte que un consejo de planeación pueda recibir y verificar no es una línea de alimentación
> — es un buzón.
>
> La ola no se mueve de número, porque M03 sí necesita que M01 y M02 existan para tener qué
> mostrar. Lo que cambia es **que M03 entra al núcleo mínimo**, abajo.

**Lo que de verdad se puede paralelizar.** M09 es casi independiente: puede arrancar el
primer día, en su propio worktree. M07 en P0 es pequeño y solo necesita el expediente. M05 y
M02 no se tocan. M03 y M04 tampoco.

## Los cuatro ciclos, y cómo se rompen

Un ciclo en el grafo no se resuelve escogiendo un lado: se rompe extrayendo lo compartido o
aplazando una mitad. Los cuatro, con su corte:

| Ciclo | Por qué existe | Cómo se rompe |
|---|---|---|
| **M03 ⇄ M06** | Las campañas de escucha nacen de la brecha que detecta el mapa de cobertura del BI | M06 se construye **sin campañas**; `CAM-01/02` entran después de M03 |
| **M02 ⇄ M03** | Revisión tiene que **mostrar el efecto en los conteos antes de confirmar** una agrupación | El motor de conteo `R1`/`R2` se extrae como pieza compartida **desde el día 1**, y los dos lo consumen. Si cada uno hace su cuenta, `I6` se rompe sola |
| **M01 ⇄ M04** | El comprobante que emite Captura es la llave con que Gestión sirve la consulta | El contrato `Comprobante` se define en la ola 0, y M04 lo consume |
| **M02 → M08/M04** | Desagrupar **reabre** prioridad y respuestas sin heredar aprobación | Eventos de dominio (`NecesidadDesagrupada`) desde el principio. Nunca un estado derivado que no se recalcula |

## El núcleo mínimo

El conjunto más pequeño que produce algo de principio a fin:

> **M10 mínimo → M01 → M02 mínimo → M03 mínimo → M04 mínimo**

**Son dos recorridos y el núcleo tiene que cerrar los dos**, porque el sistema le debe algo a
dos partes distintas.

**A la persona:** entra por una convocatoria sembrada → cuenta su problema con la ubicación
imprecisa → recibe un comprobante con código → alguien aclara la ubicación y crea el expediente
→ un responsable registra una respuesta → consulta su código **sin dar correo** y ve qué pasó.
Es la promesa de `negocio/vision.md`.

**Al Sistema Nacional de Planeación:** esos mismos expedientes producen **un corte con fecha,
filtros, catálogo y diccionario, que otro analista puede reproducir** — y que un consejo de
planeación puede recibir como evidencia de un concepto. Es `TRA-01`: *«otro analista reproduce
el total a partir del mismo corte y regla»*.

Sin el primero no hay confianza. **Sin el segundo no hay valor**, que es lo que el objetivo
acaba de decidir.

| Módulo | Lo imprescindible | Lo que se aplaza |
|---|---|---|
| **M10 min** | Las 3 superficies, permisos por rol y ámbito, catálogo geográfico versionado, auditoría append-only, contrato del comprobante | Permisos por campo, fases configurables, política de publicación, registro de exportaciones |
| **M01** | `RF5` completo: relato + ubicación imprecisa + síntesis corregible versionada + `I1` idempotencia + `I2` no inferir + comprobante sin correo | QR con triple contexto, tarjeta «Yo aporté», evidencia adjunta, síntesis con IA |
| **M02 min** | Bandeja de aclaración + creación del expediente + vínculo aporte→necesidad **con motivo y reversible** (`I4`) | Grupos analíticos, señales, comparación lado a lado, moderación |
| **M04 min** | Recepción + respuesta + consulta por comprobante, con los cinco eventos separados | Remisión y su seguimiento, decisión formal, directorio de entidades, control social |

**Por qué M06 y M03 no entran.** M06 se sustituye con una convocatoria sembrada: el gestor de
contenidos público completo es mucho trabajo para un recorrido que se demuestra con un
registro fijo. Y M03 no hace falta para cerrar el ciclo ciudadano — pero es **lo primero que
sigue**, porque es el primer valor institucional real y destraba M08 y las campañas de M06.

**Después del núcleo:** M03 → M06 completo → M05 → M08 → M07 → M09.

## Los seis bloqueos, ordenados por cuánto código invalidan

Ninguno es técnico. Los seis son decisiones que alguien tiene que tomar.

| # | Qué falta | Qué invalida si se decide tarde |
|---|---|---|
| 1 | **`[B2]` borrado contra ocultamiento** de un aporte retirado por seguridad | Define si el modelo es append-only con lápidas o admite borrado físico. **Toca las diez tablas.** El propio `vacios.md` la marca como «la que bloquea todo lo demás» |
| 2 | **Catálogo geográfico exacto y su versionado** | Sin él no se pueden implementar ni probar `R1`, `R2` ni el mapa de cobertura. Y sin «alcance territorial del piloto» no hay denominador: no hay porcentaje, solo conteos |
| 3 | **Mecanismo de identidad** | **No existe en ningún archivo.** Ni proveedor para los 9 roles internos, ni definición técnica del «comprobante seguro». Es una decisión de arquitectura completa, hoy en blanco |
| 4 | **Definición de «Expediente»** | El glosario lo declara **sin definir**, y «necesidad situada» —la unidad de decisión del sistema— queda abierta porque depende de él |
| 5 | **Taxonomías y máquinas de estado** | La sección está vacía. Hay al menos **siete máquinas de estado implícitas** sin escribir: ubicación, clasificación, confirmación, revisión, remisión, campaña y encuentro |
| 6 | **`[C2]` ruta de emergencia** | Una necesidad urgente que cae en la cola normal es un riesgo humano, no técnico. Necesita decisión antes del primer piloto real |

## Dos actores que no estaban en la lista

La lista de once roles no incluye a quien recibe lo que producimos.

| Quién | Qué recibe | Qué NO es |
|---|---|---|
| **Consejo Nacional de Planeación (CNP)** | Cortes con evidencia para sustentar su concepto sobre el proyecto de plan | No es un usuario que administra nada. Recibe un entregable con fecha |
| **Consejos Territoriales de Planeación (CTP)** | Lo mismo, acotado a su territorio | Tampoco administra. Y su alcance abre la `Q18` |

**No se agregan a la especificación desde aquí.** Eso lo hace `T020` con `/especificar`, y hay
que decidir antes si son usuarios del sistema o destinatarios de una exportación — que son dos
diseños muy distintos.

Y hay una ruta que este sistema **no sustituye** y tiene que saber reconocer: la **consulta
previa** de pueblos étnicos (Sentencia SU-123 de 2018). Un formulario general, un panel
ciudadano o una votación no la reemplazan (`Q19`).

## Estado de entrega

Ningún módulo ha pasado la prueba del sobre cerrado. **Cero de diez.** La tabla de
`entregable/README.md` está vacía a propósito y se llena con `/entregar`, uno por uno.
