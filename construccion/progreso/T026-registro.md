# Registro — T026 · El comprobante

**Contrato:** `construccion/tareas/T026-el-comprobante.md`

## Corridas

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-13 | Prueba escrita antes del código, **vista fallar** | `ERR_MODULE_NOT_FOUND: …/canjear.ts` |
| 2026-09-13 | Implementado. 7 de 7 | `node --test pruebas/comprobante.test.ts` |
| 2026-09-13 | **Vista fallar de nuevo**: se le quitó a la función el alcance por proceso | `AssertionError: el código no cruza procesos` |

## Decisiones del orquestador

| Qué chocaba | Qué se decidió | Contra qué autoridad |
|---|---|---|
| Un código inexistente ¿es error o es `null`? | **`null`, y nunca lanza** | Si un código inexistente lanzara y uno equivocado devolviera otra cosa, la diferencia serviría para averiguar qué códigos existen probando. La respuesta es una sola: no encontramos nada |
| El límite de intentos | **No se inventa el número** | `N17`: *«cincuenta aportes desde un punto de ayuda no se descartan como bots»*. Limitar por origen castiga al centro comunitario. Queda como `Q27`, junto a `Q22` |

## Lo que apareció construyendo

**La función de canje es la única puerta de lectura a `identidad`**, y recibe el hash, nunca el
código. Si recibiera el código quedaría en el registro de sentencias de Postgres, que es donde
nadie lo busca y cualquiera con acceso lo puede leer.

**Devuelve un aporte o nada, nunca una lista.** `N16` lo pide y la firma de la función lo hace
imposible de otra forma: no hay manera de que devuelva dos.

**El proceso va en la condición**, no solo en el filtro del servidor. Un código no cruza
procesos, y eso se comprueba en la base — que es donde `AGENTS.md` §8 dice que tiene que estar.

## Hallazgos aparcados

Ninguno. `Q27` no es un hallazgo aparcado: es una decisión de negocio registrada, con su
momento de urgencia escrito.
