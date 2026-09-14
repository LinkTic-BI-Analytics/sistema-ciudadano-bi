# TNNN — <resultado verificable, en una frase>

> ➤ Copia este archivo a `construccion/tareas/TNNN-<nombre-corto>.md`. El número es corrido
> y no se recicla nunca (`metodo/codigos.md`). Esto es lo que recibe un agente constructor:
> **tiene que poder leerse sin conocer el resto del proyecto.**

**Objetivo:** <una frase observable. Qué se va a poder hacer que hoy no se puede>
**Autoridad:** <módulo, versión y códigos exactos. Ej: `M01-captura.md` v1 · RF5, I1, I2>
**Propietario:** <persona o agente. UNO solo>
**Depende de:** <IDs, o «ninguna»>
**Puede ejecutarse en paralelo con:** <IDs y la razón por la que no se pisan>
**Bloqueada por:** <`Q7`, `P4`… o «ninguna»>

> ➤ **La última línea no es decorativa.** `scripts/construccion.sh` la lee y se niega a dejar
> pasar a `terminado` una tarea cuya pregunta siga abierta en `negocio/vacios.md`. Es lo que
> convierte la lista de pendientes en algo que se comprueba en vez de recordarse.
>
> Y una tarea bloqueada **no se para entera**: la guía §5 pide decir siempre **qué sí se puede
> construir sin la respuesta**. Eso va en «Dentro del alcance».

## Contexto suficiente

> ➤ Lo que el ejecutor necesita saber sin leer todo el proyecto. No la historia de la
> conversación: el estado del mundo hoy y por qué esta tarea existe.

## Dentro del alcance

- <resultado autorizado>

## Fuera del alcance

- <lo que no debe tocarse, aunque se vea mal>

## Superficie asignada

> ➤ **Esta sección la lee `scripts/paralelismo.sh` para detectar si dos tareas se pisan.**
> Una ruta por línea, entre comillas invertidas, con uno de los cuatro verbos exactos.
> Si una tarea no declara su superficie, no se puede despachar en paralelo con nada.

- Crear: `<ruta>`
- Modificar: `<ruta>`
- Leer: `<ruta>`
- No modificar: `<ruta o componente compartido>`

## Interfaces

**Consume:**
- `<nombre exacto, entrada y qué garantiza>`

**Produce:**
- `<nombre exacto, salida y qué garantiza>`

> ➤ El implementador solo ve su tarea. Este bloque es como se entera de los nombres y tipos
> que usan las tareas vecinas. Un nombre distinto aquí y allá es un error de integración
> que nadie ve hasta el final.

## Invariantes aplicables

- `I_`: <cómo se protege, en qué nivel de los cuatro del ADR 0006, y cómo se prueba>

> ➤ Si esta tarea no toca ninguna invariante, escríbelo: «ninguna». Dejarlo vacío se lee
> como que no se revisó.

## Casos de verificación

> ➤ Salen de la §9 de la especificación o del módulo. **El resultado esperado se calcula a
> mano**, nunca con lo que devolvió una implementación (`AGENTS.md` §7).

- [ ] <caso literal> → <resultado esperado>

## Pasos de ejecución

- [ ] Escribir o ajustar una prueba que falle por la ausencia del comportamiento.
- [ ] Ejecutarla y registrar la falla esperada, con el mensaje exacto.
- [ ] Implementar el cambio mínimo.
- [ ] Ejecutar la prueba y registrar el resultado.
- [ ] Ejecutar las verificaciones de la superficie afectada.
- [ ] Preparar el paquete de revisión.

## Terminado cuando

- [ ] Cumple los códigos asignados y no agrega alcance.
- [ ] Las pruebas de la tarea pasan.
- [ ] No modifica superficies ajenas.
- [ ] Pasó revisión de cumplimiento.
- [ ] Pasó revisión técnica.
- [ ] Está listo para la prueba de integración indicada.

## Entrega esperada

- Archivos cambiados.
- Pruebas ejecutadas y resultados.
- Decisiones técnicas tomadas.
- Riesgos o supuestos residuales.
