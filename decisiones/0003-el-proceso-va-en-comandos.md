# ADR 0003 — El proceso vive en comandos, y los comandos leen las plantillas

**Alcance:** método · **Estado:** aceptada

## Contexto

En el proyecto donde nació este método, el proceso vivía en la cabeza de quien lo corrió. No
había comandos: había un `AGENTS.md` con reglas y alguien que sabía en qué orden hacer las
cosas. Funcionó porque esa persona estaba ahí todos los días.

Fase 1 la va a operar un analista de negocio que no programa y que no vio ese proyecto. El
conocimiento tácito no se transfiere solo.

## Decisión

Cada etapa del ciclo tiene un comando en `.claude/commands/`, y hay un `/donde-voy` que dice
en cuál se va y cuál sigue.

Y una regla que gobierna a todos: **un comando no sabe la forma de un documento; la lee de su
plantilla en tiempo de ejecución.** Si un comando trae adentro los encabezados que va a
escribir, hay dos fuentes de verdad y en tres meses dicen cosas distintas.

La prueba: cambiar un encabezado en `plantillas/dominio.md` y verificar que `/descubrir` lo
respeta sin haber tocado el comando.

## Consecuencias

Los comandos son más largos de escribir: hay que decirles qué leer en vez de decirles qué
escribir.

Y hay una tentación permanente de "solo esta vez" poner la estructura adentro del comando,
porque es más rápido. Cada vez que se cede, la plantilla deja de mandar.
