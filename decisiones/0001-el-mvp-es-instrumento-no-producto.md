# ADR 0001 — El MVP es un instrumento, no un producto

**Alcance:** método · **Estado:** aceptada

## Contexto

Lo que se construye en Fase 1 sirve para descubrir qué quiere la persona. Pero se ve como un
producto: tiene pantallas, tiene datos, funciona. Y la persona que lo pidió lo va a querer
usar — no por capricho, sino porque resuelve su problema mejor que la hoja de cálculo que
tenía.

El riesgo es concreto: termina en producción un sistema construido para tirarse, sin
pruebas, sin respaldos y sin nadie que lo mantenga. Y el requerimiento formal, que era el
punto, nunca se escribe — porque ya "está funcionando".

## Decisión

El MVP se construye para descubrir y para tirarse. En consecuencia:

- **No hay documento de salida a producción en esta plantilla, y no se escribe uno.** Lo que
  hay es `plantillas/mostrar-el-mvp.md`: cómo se le enseña a la persona y qué se observa
  mientras lo usa. La ausencia es deliberada: si el repositorio no dice cómo lanzarlo, hay
  una fricción real y no solo una advertencia.
- Se dice en voz alta en la primera sesión, mirando a la persona. Está en
  `PUESTA-EN-MARCHA.md §0`.
- No se optimiza lo que no se va a mantener. Rendimiento y escalabilidad no son criterios.
- **Sí se respetan las invariantes.** Un MVP que permite lo prohibido enseña un dominio
  falso, y las conclusiones que salgan de usarlo van a ser falsas.

## Consecuencias

Se pierde la posibilidad de que un MVP bueno se quede en producción y ahorre un desarrollo.
Es un costo real y se paga a propósito: ese ahorro es aparente, porque lo que se ahorra en
construir se paga en mantener algo que nadie diseñó para durar.

Y hay que decirlo en cada arranque. Un documento no basta: la conversación con la persona es
lo que evita el malentendido.
