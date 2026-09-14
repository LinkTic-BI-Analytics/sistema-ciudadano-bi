# 0012 · La captura es una conversación, no un formulario

**Fecha:** 2026-09-14 · **Estado:** aceptada · **Decide:** Miguel Gómez

## Contexto

La captura estaba construida como *enviar y listo*: un relato libre, un botón que decía **«Enviar
lo que conté»**, y el afinado después, presentado como opcional.

El problema con eso lo puso el negocio en una frase: **«solo tendríamos una oportunidad de obtener
la información»**.

Quien escribe en `/participar` puede no volver nunca. No hay cuenta, no hay correo —`N05` lo
prohíbe— y el código de comprobante se guarda o se pierde. Un botón que dice *enviar* le comunica
a esa persona que ya terminó, justo en el momento en que más dispuesta está a contar. Lo que
viene después, por muy bien hecho que esté, ya es un esfuerzo extra que la mayoría no hace.

Y la información que falta no es decorativa. La bandeja de revisión recibe hoy relatos sin lugar
preciso, sin a quién afecta y sin desde cuándo, y **ninguna de esas tres se puede reconstruir
después**: la única persona que las sabe ya se fue.

## Decisión

**La captura no termina en el primer botón. Termina cuando la persona confirma lo que
entendimos.**

1. El primer botón dice **«Continuar»**, no «Enviar». Lo que sigue es parte de contar, no un
   trámite añadido.
2. **El aporte se guarda en ese primer clic, en silencio.** Esto no se negocia: `N02` y `DAT-01`
   dicen que la recepción no depende de nada más, y quien abandone en cualquier punto deja su
   relato guardado igual.
3. El comprobante se entrega **al final**, como señal de que terminó — y también a quien
   abandona, si intenta salir.
4. En medio, la IA lee el relato y **dice qué entendió y qué le falta**. Se pregunta solo por lo
   que falta, en vueltas de máximo tres cajas.

## Lo que cambia en el requerimiento

`N03` pedía separar tres partes: problema, resultado esperado y solución sugerida. **Se agregan
dos que la revisión necesita y hoy no se piden:**

| Lo nuevo | Por qué | Cómo se guarda |
|---|---|---|
| **A quién afecta** | `PRI-01` usa afectación como factor de prioridad, y hoy el revisor la infiere del relato o la deja en `sin_establecer` | Texto libre, tal como lo dijo |
| **Desde cuándo** | Distingue una avería de esta semana de un problema estructural de años, y eso cambia a quién compete | **Texto libre, nunca fecha.** «Hace tres meses» no es una fecha, y convertirlo en una sería la inferencia que `I2` prohíbe |

Ninguna de las dos es obligatoria. Si la persona no lo dice, se queda vacío — y vacío es una
respuesta, no un hueco por llenar.

## Lo que NO cambia

**El relato original sigue intacto y la síntesis nunca lo sustituye** (`N03`). Todo lo que se
afina se guarda aparte y con versión.

**La IA no entra al camino de la recepción** (`IA-01`). El aporte se guarda antes de llamarla; si
tarda o falla, la persona ve la segmentación determinista y nadie se entera.

**La IA recorta, no redacta.** El guardián de `T038` sigue en pie: lo que no está anclado en el
relato se descarta entero.

## Consecuencias, incluidas las malas

**Se alarga el camino.** Alguien que solo quería dejar una queja de una línea ahora ve dos
pantallas más. Se mitiga preguntando **solo por lo que falta** —si el relato ya lo dijo todo, las
vueltas quedan casi vacías— y dejando salir en cualquier punto.

**Aparece una dependencia de IA en el camino visible**, aunque no en el crítico. Si el proveedor
está caído, las vueltas preguntan por todo en vez de por lo que falta: peor experiencia, misma
captura.

**Dos columnas nuevas en `aporte`.** Se agregan ahora porque una columna se puede llenar después,
pero la información que nadie pidió no se recupera nunca.

**Sube lo que se le manda al proveedor.** Antes era el relato; sigue siendo el relato. Pero la
frecuencia pasa a ser una llamada por aporte, y eso hace que `Q29` —qué plan se contrata— importe
más, no menos.
