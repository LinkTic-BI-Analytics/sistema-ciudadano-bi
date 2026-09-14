# Integraciones

> Con quién habla este sistema que no es este sistema. Una integración que no
> está aquí es una dependencia que nadie está vigilando.

Cada ficha contesta las tres preguntas de `plantillas/fronteras.md` y declara su
**nivel de simulación**: 1 = se usa de verdad · 2 = se simula con contrato
acordado · 3 = se simula con contrato inventado por nosotros.

---

## OpenRouter (o Mistral) — el corte de la captura

| | |
|---|---|
| **Código** | `INT-01` |
| **Qué hace por nosotros** | Separa un relato libre en las partes que la revisión necesita —problema, dónde, a quiénes, desde cuándo, qué debería cambiar, solución sugerida— y **dice cuáles no encontró**, para preguntar solo por esas (ADR 0012) |
| **Nivel** | 1 · se usa de verdad, y es **opcional** |
| **Dónde vive** | `producto/src/captura/lectura-ia.ts`, nivel de acción de servidor (`AGENTS.md` §8) |
| **Proveedor** | OpenRouter si hay `OPENROUTER_API_KEY`; si no, Mistral directo. Los dos hablan la API de *chat completions*, así que es un solo camino de código |
| **Modelo** | `mistralai/mistral-small-3.2-24b-instruct` por defecto, configurable. Temperatura 0, respuesta en JSON |
| **Credencial** | `OPENROUTER_API_KEY` o `MISTRAL_API_KEY` en `.env.local`, **sin** `NEXT_PUBLIC_` |

### ¿Qué pasa si no está?

**La captura sigue completa; la experiencia empeora.** Se usa la segmentación
determinista de `lectura.ts` y se le pregunta a la persona por las cinco partes
en vez de solo por las que le falten. `IA-01` lo exige: *«no impide captura por
ausencia de IA»*.

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

**La política de datos de la cuenta.** El plan gratuito «Experiment» de Mistral
**entrena con lo que se le manda**, y OpenRouter **enruta a proveedores distintos
según el modelo**, cada uno con su propia política. Lo que se manda aquí son
relatos ciudadanos que pueden traer salud, amenazas, nombres y direcciones. Sin
esto resuelto y fijado, esto no se enciende.

Sube de importancia con el ADR 0012: antes era una llamada opcional, ahora es
**una llamada por aporte**.

**El aviso a la persona.** Hoy la pantalla no dice que un tercero procesa su
relato. Mientras el plan no esté resuelto no hay qué avisar; cuando lo esté, el
aviso es parte de la decisión, no un añadido.

**El encargo de tratamiento** (Ley 1581 de 2012). Mistral sería encargado de
datos personales por cuenta de la entidad responsable. Quién es esa entidad
depende de `P4` y `Q18`, que siguen abiertas.

> Ninguna de las tres bloquea construir ni probar en local. Las tres bloquean
> encenderlo con gente real.
