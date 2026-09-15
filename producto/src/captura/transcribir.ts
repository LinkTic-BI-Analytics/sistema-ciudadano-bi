/**
 * Convierte voz en texto. **El texto que sale es una lectura, no un hecho.**
 *
 * En la primera prueba, un audio que decía «la vereda La Martinita» volvió como
 * «La Martinica». Un nombre de vereda cambiado. Por eso lo que devuelve esto
 * entra al producto como **versión 1 de una transcripción**, firmada con el
 * nombre del modelo, y la persona la corrige antes de confirmar (ADR 0013).
 *
 * Va por el mismo proveedor que la lectura —OpenRouter acepta audio de entrada
 * en 45 de sus modelos— así que no hace falta una llave más ni otra integración
 * que vigilar.
 */

export type Transcripcion = { texto: string; modelo: string };

const MODELO = "google/gemini-3.8-flash";

// Más largo que el de la lectura: un minuto de audio tarda más en subir y en
// procesarse que una frase de texto. Sigue siendo un tope: el aporte todavía no
// existe cuando esto corre, así que aquí **sí** se está haciendo esperar a
// alguien.
const ESPERA_MS = 60_000;

const INSTRUCCION = `Transcribe literalmente el audio en español de Colombia.

Reglas:
1. Escribe exactamente lo que se dice. No corrijas la gramática, no completes frases, no resumas.
2. Si no entiendes una palabra, escríbela como suene. NO la adivines ni la reemplaces por una parecida.
3. Presta especial atención a los nombres de veredas, barrios, municipios y a las cantidades: son lo que más se equivoca al transcribir.
4. Si el audio está vacío o no se entiende nada, devuelve exactamente: (no se entiende)
5. Devuelve SOLO la transcripción, sin comillas, sin comentarios y sin explicar nada.`;

function proveedor(): { llave: string; url: string } | null {
  if (process.env.SIN_IA === "1") return null;
  const llave = process.env.OPENROUTER_API_KEY?.trim();
  if (!llave) return null;
  return {
    llave,
    url: process.env.IA_URL?.trim() || "https://openrouter.ai/api/v1/chat/completions",
  };
}

export function hayTranscripcion(): boolean {
  return proveedor() !== null;
}

/**
 * Devuelve `null` cuando no se pudo transcribir, y **eso no es un error que la
 * persona tenga que resolver**: su grabación ya está guardada y es el original.
 * Se le enseña que no entendimos y se le ofrece escribirlo.
 */
export async function transcribir(audio: Uint8Array, tipoMime: string): Promise<Transcripcion | null> {
  const p = proveedor();
  if (!p) return null;

  // `webm` y `ogg` llevan el códec pegado al tipo; el proveedor quiere el
  // formato a secas.
  const formato = (tipoMime.split(";")[0]?.split("/")[1] ?? "webm").replace("x-", "");

  try {
    const r = await fetch(p.url, {
      method: "POST",
      signal: AbortSignal.timeout(ESPERA_MS),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${p.llave}`,
        "X-Title": "Participacion Ciudadana",
      },
      body: JSON.stringify({
        model: MODELO,
        temperature: 0,
        messages: [
          { role: "system", content: INSTRUCCION },
          {
            role: "user",
            content: [{
              type: "input_audio",
              input_audio: { data: Buffer.from(audio).toString("base64"), format: formato },
            }],
          },
        ],
      }),
    });
    if (!r.ok) throw new Error(`${p.url} respondió ${r.status}`);

    const cuerpo = await r.json();
    const texto = String(cuerpo?.choices?.[0]?.message?.content ?? "").trim();
    // El modelo tiene una salida para «no entendí», y se respeta: inventar un
    // relato a partir de ruido es lo peor que puede pasar aquí.
    if (!texto || texto === "(no se entiende)") return null;

    return { texto, modelo: `modelo:${MODELO}` };
  } catch (e) {
    console.warn("transcribir:", e instanceof Error ? e.message : e);
    return null;
  }
}
