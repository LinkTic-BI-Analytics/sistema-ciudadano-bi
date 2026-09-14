# Registro — T038 · El corte de la captura, apoyado por Mistral

**Autoridad:** `N03` (las tres partes; la síntesis nunca sustituye el original) ·
`IA-01` (*«no impide captura por ausencia de IA»*) · `INT-01` (`negocio/integraciones.md`)

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-14 | 10 pruebas de la lectura y del proveedor | `lectura.test.ts`, `lectura-ia.test.ts` |
| 2026-09-14 | **Visto fallar**: apagado el guardián, el modelo que inventa pasa | 2 pruebas en rojo |
| 2026-09-14 | Primera integración catalogada del proyecto | `negocio/integraciones.md` |

## El problema que había que resolver

La lectura tenía una invariante probada desde `T037`: **ninguna palabra que la persona no haya
dicho**. `leer()` la cumple por construcción, porque solo corta. **Un modelo parafrasea.**

Así que la IA no redacta: **recorta**. Se le pide que copie fragmentos literales del relato y los
reparta en las tres partes de `N03`, y que devuelva `null` en la que la persona no haya dicho.
Temperatura 0 — la temperatura es exactamente la perilla que convierte recortar en redactar.

## Y no se le cree

Lo que devuelve pasa por `anclado()` **antes de mostrarse**. Si cualquier parte trae una palabra
que no está en el relato, se descarta la respuesta entera y se usa la segmentación.

Basta con que invente en un campo para tirar los cuatro: un modelo que inventó en uno no da
motivo para creerle los otros.

**`anclado()` es la misma función que usan las pruebas.** No una copia parecida — la misma. Dos
implementaciones de la misma regla se separan sin que nadie lo note, y el día que se separan la
prueba sigue verde mientras el producto ya no cumple.

Por qué tanto cuidado, dicho sin adornos: un modelo redacta mejor que quien está apurado
escribiendo desde un teléfono. Una lectura así se acepta por inercia, el expediente queda
diciendo algo que la persona nunca dijo, y más adelante alguien decide sobre esas palabras
creyéndolas suyas.

## La IA no está en el camino de la recepción

`IA-01` no se cumple con buenas intenciones: se cumple **no poniéndola ahí**. `enviarAporte` no
llama a Mistral. Recibe, guarda y devuelve el comprobante con la segmentación instantánea.

El corte llega después, con `prepararLectura`, ya con el aporte guardado y el código en pantalla.
Si Mistral tarda, lo que se retrasa es el corte — nunca el registro.

Seis caminos de error, todos al mismo sitio y ninguno lanza: sin llave, sin red, más de 6 s,
`401`, JSON roto, y respuesta no anclada. **Hay una prueba para cada uno**, y la de la llave
inválida sale de verdad a la red a comerse el 401.

## Lo que se le manda y lo que no

Se le manda **el relato tal como lo escribió la persona**. No el código de comprobante, no el
identificador del aporte, no contacto: nada con lo que se pueda volver de un texto a una persona.

## Lo que queda esperando

**`Q29`, nueva y con nombre propio: el plan contratado.** El gratuito «Experiment» de Mistral
**entrena con lo que se le manda**, y lo que se le manda aquí son relatos ciudadanos que pueden
traer salud, amenazas, nombres y direcciones. Con ese plan esto no se enciende.

Con ello van el aviso a la persona de que un tercero procesa su relato —hoy la pantalla no lo
dice— y el encargo de tratamiento de la Ley 1581, cuyo responsable depende de `P4` y `Q18`.

> Ninguna de las tres bloquea construir ni probar en local. Las tres bloquean encenderlo con
> gente real.

**`Q28` sigue abierta**: falta una clase de síntesis para «la persona la completó».
