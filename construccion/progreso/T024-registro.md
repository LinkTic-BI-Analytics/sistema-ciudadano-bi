# Registro — T024 · La pantalla de captura

**Contrato:** `construccion/tareas/T024-la-pantalla-de-captura.md`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-13 | Ocho recorridos escritos antes, **vistos fallar** (la página no existía) | 8 failed |
| 2026-09-13 | Implementado. 16 de 16 — ocho casos × escritorio y teléfono | `npx playwright test` |

## Un defecto de mi propia prueba

La prueba «en ninguna parte se pide correo» buscaba la palabra *correo* en la página y falló —
porque la página dice **«no necesitas correo»**, que es lo contrario de pedirlo.

Se afinó: ahora comprueba que no haya campo de correo, que ningún campo se llame así, y que si
la palabra aparece sea en una frase que diga que **no** hace falta. Buscar una palabra no es
comprobar una intención.

## Decisiones del orquestador

| Qué chocaba | Qué se decidió | Contra qué autoridad |
|---|---|---|
| El modo «hablar» no tiene transcripción | **El botón existe y dice que todavía no está** | `IA-01` deja la voz como ampliación. Un botón que no hace nada es peor que decirlo: la persona no sabe si falló ella. Y el relato se conserva al volver a «Escribir», que es lo que `direccion-visual.md` pide |
| ¿El relato en el campo o en el estado de React? | **En el estado** | Es lo que hace que cambiar de modo no lo borre. Perder lo escrito al tocar un botón es la forma más rápida de que alguien abandone |

## Lo que esta tarea NO prueba

**Si se entiende.** Ninguna de las dieciséis lo contesta. `/validar` existe para eso —pasar la
pantalla por personas que no la construyeron— y **no se ha corrido**. Las personas validadoras
tampoco están escritas: `plantillas/persona.md` las pide con vida y con una pregunta propia, y
`AGENTS.md` §6 dice que no se inventan solas.

Hasta entonces esto es una pantalla que funciona, no una pantalla que sirve.

## Hallazgos aparcados

Ninguno.
