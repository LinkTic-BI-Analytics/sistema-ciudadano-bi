---
description: Integra una tarea aprobada, en el orden del grafo y no en el de llegada.
argument-hint: "[T007]"
---

Vas a integrar una tarea que pasó las dos revisiones.

## Comprueba que de verdad pasó las dos

Cumplimiento **y** calidad. Si solo pasó una, no se integra — y dilo, porque la tentación
es que «ya casi».

## El orden es el del grafo

```
./scripts/construccion.sh
```

Mira el grafo, no la fecha en que llegó cada tarea. Integrar por orden de llegada es cómo se
integra algo que depende de lo que todavía no entró.

## Los conflictos se resuelven contra la autoridad

Cuando dos cambios chocan, **no gana el más reciente**. Se compara cada uno contra el módulo
y sus códigos, y gana el que lo cumple. Si los dos lo cumplen, es que el módulo no decidió
algo — y eso es una `Q` para `negocio/vacios.md`, no una moneda al aire.

## Corre las pruebas del conjunto, no las de la tarea

La tarea ya pasó las suyas sola. Lo que falta comprobar es lo otro:

```
./scripts/validar.sh
```

Y además:

- Las pruebas de contrato entre esta tarea y sus vecinas.
- La suite completa.
- **Las invariantes sobre el conjunto.** Una invariante puede estar bien implementada en
  cada tarea por separado y romperse cuando se juntan — es exactamente el caso que
  `metodo/construccion-solida-y-paralela.md` §2.1 pone primero: *ninguna línea paralela
  puede debilitar una invariante*.
- Las migraciones, si las hubo.

## Solo entonces, el tablero

Estado `terminado` con la evidencia: el comando que se corrió y lo que devolvió. Y la fila
del registro de progreso.

```
./scripts/construccion.sh
```

Otra vez, para que el bloque derivado del encabezado quede al día.

## Lo que no se hace

No se marca `terminado` porque un agente lo dijo. Se marca cuando el registro enlaza sus
pruebas, su revisión y su cambio integrado.

## Cómo entregas

Qué se integró, en qué orden, qué pruebas corrieron y qué devolvieron, y **qué queda
distinto en la ruta crítica ahora**. Si la ruta crítica no se movió, dilo: significa que lo
que se integró no era lo que estaba deteniendo el proyecto.
