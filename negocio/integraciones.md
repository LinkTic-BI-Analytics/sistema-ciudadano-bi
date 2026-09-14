# Integraciones

> Con quién habla este sistema que no es este sistema. Una integración que no
> está aquí es una dependencia que nadie está vigilando.

Cada ficha contesta las tres preguntas de `plantillas/fronteras.md` y declara su
**nivel de simulación**: 1 = se usa de verdad · 2 = se simula con contrato
acordado · 3 = se simula con contrato inventado por nosotros.

---

## Mistral — el corte de la captura

| | |
|---|---|
| **Código** | `INT-01` |
| **Qué hace por nosotros** | Separa un relato libre en las tres partes de `N03` (problema, lo que se espera, la solución sugerida) y señala el fragmento donde la persona dice dónde ocurre |
| **Nivel** | 1 · se usa de verdad, y es **opcional** |
| **Dónde vive** | `producto/src/captura/lectura-ia.ts`, nivel de acción de servidor (`AGENTS.md` §8) |
| **Modelo** | `mistral-small-latest`, temperatura 0, respuesta en JSON |
| **Credencial** | `MISTRAL_API_KEY` en `.env.local`, **sin** `NEXT_PUBLIC_` |

### ¿Qué pasa si no está?

**Nada que la persona note.** Se usa la segmentación determinista de
`lectura.ts`, que es el camino por defecto y no un apaño. `IA-01` lo exige:
*«no impide captura por ausencia de IA»*.

Todos los caminos de error terminan en el mismo sitio y ninguno lanza: sin
llave, sin red, respuesta tardía (más de 6 s), `401`, JSON roto, o respuesta que
no pasa el guardián. Hay pruebas para los seis.

**La IA no está en el camino de la recepción.** Se llama *después* de que el
comprobante está en pantalla y el aporte guardado. Si Mistral tarda, lo que se
retrasa es el corte, nunca el registro.

### ¿Qué le mandamos, y qué le creemos?

Le mandamos **el relato tal como lo escribió la persona**. No le mandamos el
código de comprobante, ni el identificador del aporte, ni contacto: nada que
permita volver de un texto a una persona.

Y **no le creemos**. Lo que devuelve pasa por `anclado()` antes de mostrarse: si
cualquier parte trae una palabra que no está en el relato, se descarta la
respuesta entera. La invariante del producto —*ninguna palabra que la persona no
haya dicho*— es la misma con IA y sin ella, y por eso encenderla no cambia lo
que el producto promete.

La razón no es purismo. Un modelo redacta mejor que quien está apurado
escribiendo desde un teléfono; una lectura así se acepta por inercia, y entonces
el expediente queda diciendo algo que la persona nunca dijo — y alguien decide
sobre eso creyéndolo suyo.

### Lo que falta decidir antes de abrir a ciudadanía

**El plan contratado.** El gratuito «Experiment» de Mistral **entrena con lo que
se le manda**, y lo que se le manda aquí son relatos ciudadanos que pueden traer
salud, amenazas, nombres y direcciones. Con ese plan esto no se enciende.

**El aviso a la persona.** Hoy la pantalla no dice que un tercero procesa su
relato. Mientras el plan no esté resuelto no hay qué avisar; cuando lo esté, el
aviso es parte de la decisión, no un añadido.

**El encargo de tratamiento** (Ley 1581 de 2012). Mistral sería encargado de
datos personales por cuenta de la entidad responsable. Quién es esa entidad
depende de `P4` y `Q18`, que siguen abiertas.

> Ninguna de las tres bloquea construir ni probar en local. Las tres bloquean
> encenderlo con gente real.
