# Registro — T039 · La captura como conversación

**Autoridad:** `decisiones/0012-la-captura-es-una-conversacion.md`, que cambia el requerimiento ·
`N02` y `DAT-01` (la recepción no depende de nada más) · `IA-01` · `PRI-01`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-14 | ADR 0012 escrito **antes** de tocar código | `decisiones/0012-*.md` |
| 2026-09-14 | 6 recorridos del flujo nuevo, escritos antes de la pantalla | `afinar.spec.ts` |
| 2026-09-14 | 3 pruebas de «solo lo que falta» | `lectura.test.ts` |
| 2026-09-14 | Proveedor a OpenRouter, con Mistral de suelo | `lectura-ia.test.ts` |

## La frase que ordenó todo

**«Solo tendríamos una oportunidad de obtener la información.»**

Quien escribe en `/participar` puede no volver nunca. No hay cuenta, no hay correo —`N05` lo
prohíbe— y el código se guarda o se pierde. El botón decía **«Enviar lo que conté»**: le
comunicaba a esa persona que ya había terminado, justo en el momento en que más dispuesta estaba
a contar. Todo lo que venía después, por bien hecho que estuviera, era esfuerzo extra.

Ahora dice **«Continuar»**, y hay una prueba que falla si la palabra «enviar» vuelve a aparecer en
ese formulario.

## Lo que no se movió, y no era negociable

**El aporte se guarda en el primer clic.** `N02` y `DAT-01` dicen que la recepción no depende de
nada más. Cambiar el texto del botón no puede cambiar eso, y por eso el código está **a la vista
desde el primer momento**, discreto: *«lo que contaste ya quedó guardado; si te vas ahora, tu
código es…»*.

No dice «terminaste» y no retiene nada. Hay una prueba que abandona en la primera vuelta y
comprueba que el código sirve en `/mis-aportes`.

**La IA sigue fuera del camino de la recepción.** `enviarAporte` no la llama. Se llama después,
con el aporte ya guardado.

## Lo que la IA aporta ahora: el hueco, no las palabras

Antes recortaba. Ahora además **dice qué no encontró**, y la pantalla pregunta **solo por eso**.

Es la mitad del valor. Preguntar por todo convierte la captura en un formulario de seis campos y
castiga a quien ya lo contó bien; preguntar solo por lo que falta hace que quien contó completo
vea casi nada, y quien contó poco vea justo lo que su caso necesita para poder revisarse.

El orden de las preguntas —lugar, a quiénes, desde cuándo, qué debería cambiar, la solución— no
es alfabético: va **de lo que más le sirve a la revisión a lo que menos**, para que si la persona
se cansa y se va a mitad, lo que quedó sin preguntar sea lo que menos falta hace.

**El guardián de `T038` sigue en pie**, ahora sobre seis campos en vez de cuatro: basta con que el
modelo invente una palabra en uno para descartar la respuesta entera.

## El requerimiento que cambió

Dos columnas nuevas en `aporte`, y la migración es aditiva:

- **`afectados`** — `PRI-01` usa la afectación como factor de prioridad, y hoy el revisor la
  infería del relato o la dejaba en `sin_establecer`.
- **`desde_cuando`** — distingue una avería de esta semana de un problema estructural de años, y
  eso cambia a quién compete.

**`desde_cuando` es texto y nunca una fecha.** «Hace tres meses» no es una fecha, y convertirlo en
una sería la inferencia que `I2` prohíbe: nadie sabe si son noventa días o el invierno pasado. Se
guarda como lo dijo y la consola lo muestra como lo dijo.

Se agregan ahora porque **una columna se puede llenar después, pero la información que nadie pidió
no se recupera nunca**.

## El proveedor

**OpenRouter**, que es el que este proyecto ya había usado para analizar sus propios documentos
fuente. Mistral queda de suelo si no hay llave de OpenRouter. Los dos hablan la API de *chat
completions*, así que es **un solo camino de código** y no dos integraciones.

## Lo que queda abierto

**`Q29` pesa más que ayer.** Antes era una llamada opcional; ahora es **una llamada por aporte**.
El plan gratuito de Mistral entrena con lo que se le manda, y OpenRouter enruta a proveedores
distintos según el modelo, cada uno con su política. Sin eso resuelto y fijado, esto no se
enciende con gente real.

Con ello siguen el aviso a la persona de que un tercero procesa su relato —la pantalla todavía no
lo dice— y el encargo de tratamiento de la Ley 1581.

**El costo de la experiencia.** Alguien que solo quería dejar una queja de una línea ahora ve dos
pantallas más. Se mitiga preguntando solo por lo que falta y dejando salir en cualquier punto,
pero **no está medido con gente real**. Es lo primero que habría que mirar en el piloto.
