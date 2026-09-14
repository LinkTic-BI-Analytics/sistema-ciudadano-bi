import { anclado, leer, recortar, type Lectura } from "./lectura.ts";

/**
 * La lectura apoyada por Mistral.
 *
 * **Lo que la IA aporta es el corte, no las palabras.** Se le pide que copie
 * fragmentos del relato y los reparta en las tres partes de `N03` —problema, lo
 * que se espera, la solución sugerida— y que deje en `null` la que la persona no
 * haya dicho. No redacta, no resume, no completa.
 *
 * Y no se le cree. Lo que devuelve pasa por `anclado()` antes de mostrarse: si
 * cualquier parte trae una palabra que no está en el relato, **se descarta
 * entera** y se usa la segmentación. La invariante es la misma con IA y sin
 * ella, y por eso encenderla no cambia lo que el producto promete.
 *
 * `IA-01`: *«no impide captura por ausencia de IA»*. Aquí eso significa que
 * todos los caminos de error —sin llave, sin red, tarde, JSON roto, modelo
 * inventando— terminan en el mismo sitio: `leer()`. Ninguno lanza.
 */

const MODELO = "mistral-small-latest";
// Corto a propósito. Esto corre con la persona esperando en pantalla, y el
// aporte **ya está guardado**: tardar es peor que no usar la IA.
const ESPERA_MS = 6_000;

const INSTRUCCION = `Eres un asistente que SEPARA un relato ciudadano en partes. NO redactas.

Reglas absolutas:
1. Copia fragmentos LITERALES del relato. No cambies ni una palabra, no corrijas ortografía, no resumas con palabras tuyas.
2. Si el relato no dice algo, devuelve null. NUNCA lo inventes ni lo deduzcas.
3. No agregues causas, culpables, entidades responsables ni soluciones que la persona no haya escrito.

Devuelve SOLO un objeto JSON con estas claves:
{
  "problema": "el fragmento que dice qué está pasando",
  "resultadoEsperado": "el fragmento que dice qué debería cambiar, o null",
  "solucionSugerida": "el fragmento que propone cómo resolverlo, o null",
  "lugar": "el fragmento que dice dónde ocurre, o null"
}`;

type Cruda = Partial<Record<"problema" | "resultadoEsperado" | "solucionSugerida" | "lugar", unknown>>;

const texto = (v: unknown): string | null => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  // «null» como cadena es lo que devuelve un modelo que entendió la instrucción
  // a medias. Tratarlo como texto le pondría la palabra «null» en la pantalla.
  return t && t.toLowerCase() !== "null" ? t : null;
};

async function preguntar(relato: string, llave: string): Promise<Cruda | null> {
  const corte = AbortSignal.timeout(ESPERA_MS);
  const r = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    signal: corte,
    headers: { "content-type": "application/json", authorization: `Bearer ${llave}` },
    body: JSON.stringify({
      model: MODELO,
      // Sin creatividad: la tarea es recortar, y la temperatura es exactamente
      // la perilla que convierte recortar en redactar.
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: INSTRUCCION },
        { role: "user", content: relato },
      ],
    }),
  });
  if (!r.ok) throw new Error(`mistral respondió ${r.status}`);
  const cuerpo = await r.json();
  const contenido = cuerpo?.choices?.[0]?.message?.content;
  return typeof contenido === "string" ? JSON.parse(contenido) : null;
}

export async function leerConIA(relato: string, lugar?: string | null): Promise<Lectura> {
  const suelo = leer(relato, lugar);
  const llave = process.env.MISTRAL_API_KEY?.trim();
  if (!llave) return suelo;

  try {
    const cruda = await preguntar(relato, llave);
    if (!cruda) return suelo;

    const problema = texto(cruda.problema);
    const resultadoEsperado = texto(cruda.resultadoEsperado);
    const solucionSugerida = texto(cruda.solucionSugerida);
    // El lugar que la persona escribió aparte manda sobre el que la IA
    // encuentre en el relato: uno lo puso ella en el campo de lugar, el otro es
    // una lectura nuestra.
    const lugarIA = lugar?.trim() || texto(cruda.lugar);

    if (!problema) return suelo;

    // **El guardián.** Basta con que una parte traiga una palabra que no estaba
    // para descartar la respuesta entera: si el modelo inventó en un campo, no
    // hay motivo para confiar en los otros tres.
    if (!anclado(relato, problema, resultadoEsperado, solucionSugerida, lugar ? null : lugarIA)) {
      console.warn("lectura-ia: respuesta descartada por no estar anclada en el relato");
      return suelo;
    }

    return {
      problema: recortar(problema),
      resultadoEsperado: resultadoEsperado && recortar(resultadoEsperado),
      solucionSugerida: solucionSugerida && recortar(solucionSugerida),
      lugar: lugarIA,
      fuente: "ia",
    };
  } catch (e) {
    // Nada de esto llega a la persona. Su aporte ya está guardado, y lo único
    // que pasa es que ve la segmentación en vez del corte de la IA.
    console.warn("lectura-ia: se usa la segmentación —", e instanceof Error ? e.message : e);
    return suelo;
  }
}
