import { anclado, leer, recortar, PREGUNTABLES, type Lectura } from "./lectura.ts";

/**
 * La lectura apoyada por un modelo.
 *
 * **Lo que aporta no son palabras: es el corte y, sobre todo, el hueco.** Se le
 * pide que reparta fragmentos literales del relato en las partes que la revisión
 * necesita, y que deje en `null` las que la persona no dijo. Con eso la pantalla
 * pregunta **solo por lo que falta** — que es la mitad del valor, porque
 * preguntar por todo convierte la captura en un formulario de seis campos.
 *
 * Y no se le cree. Lo que devuelve pasa por `anclado()` antes de mostrarse: si
 * cualquier parte trae una palabra que no está en el relato, se descarta la
 * respuesta **entera**. La invariante del producto —ninguna palabra que la
 * persona no haya dicho— es la misma con IA y sin ella, y por eso encenderla no
 * cambia lo que el producto promete.
 *
 * `IA-01`: *«no impide captura por ausencia de IA»*. Todos los caminos de error
 * —sin llave, sin red, tarde, JSON roto, modelo inventando— terminan en el mismo
 * sitio: `leer()`. Ninguno lanza.
 */

/**
 * Dos proveedores, una sola forma de hablarles: los dos exponen la API de
 * *chat completions* de OpenAI. OpenRouter primero porque es el que el proyecto
 * ya usó para analizar sus propios documentos; Mistral queda como suelo.
 */
function proveedor(): { url: string; llave: string; modelo: string; cabeceras: Record<string, string> } | null {
  const or = process.env.OPENROUTER_API_KEY?.trim();
  if (or) {
    return {
      url: "https://openrouter.ai/api/v1/chat/completions",
      llave: or,
      modelo: process.env.OPENROUTER_MODELO?.trim() || "mistralai/mistral-small-3.2-24b-instruct",
      // OpenRouter las usa para atribuir el tráfico. No llevan datos de nadie.
      cabeceras: { "X-Title": "Participacion Ciudadana" },
    };
  }
  const mi = process.env.MISTRAL_API_KEY?.trim();
  if (mi) {
    return {
      url: "https://api.mistral.ai/v1/chat/completions",
      llave: mi,
      modelo: process.env.MISTRAL_MODELO?.trim() || "mistral-small-latest",
      cabeceras: {},
    };
  }
  return null;
}

// Corto a propósito. Esto corre con la persona esperando en pantalla, y el
// aporte **ya está guardado**: tardar es peor que no usar la IA.
const ESPERA_MS = 8_000;

const INSTRUCCION = `Eres un asistente que SEPARA un relato ciudadano en partes. NO redactas.

Reglas absolutas:
1. Copia fragmentos LITERALES del relato. No cambies ni una palabra, no corrijas ortografía, no resumas con palabras tuyas.
2. Si el relato no dice algo, devuelve null. NUNCA lo inventes, lo deduzcas ni lo completes.
3. No agregues causas, culpables, entidades responsables ni soluciones que la persona no haya escrito.
4. "desdeCuando" es el texto tal cual ("hace tres meses", "desde el invierno"). NUNCA lo conviertas en fecha.

Devuelve SOLO un objeto JSON con estas claves:
{
  "problema": "el fragmento que dice qué está pasando",
  "lugar": "el fragmento que dice dónde ocurre, o null",
  "afectados": "el fragmento que dice a quiénes les pasa o cuántos son, o null",
  "desdeCuando": "el fragmento que dice hace cuánto pasa, o null",
  "resultadoEsperado": "el fragmento que dice qué debería cambiar, o null",
  "solucionSugerida": "el fragmento que propone cómo resolverlo, o null"
}`;

type Clave = "problema" | (typeof PREGUNTABLES)[number];
type Cruda = Partial<Record<Clave, unknown>>;

const texto = (v: unknown): string | null => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  // «null» como cadena es lo que devuelve un modelo que entendió la instrucción
  // a medias. Tratarlo como texto le pondría la palabra «null» en la pantalla.
  return t && t.toLowerCase() !== "null" ? t : null;
};

async function preguntar(relato: string): Promise<Cruda | null> {
  const p = proveedor();
  if (!p) return null;

  const r = await fetch(p.url, {
    method: "POST",
    signal: AbortSignal.timeout(ESPERA_MS),
    headers: { "content-type": "application/json", authorization: `Bearer ${p.llave}`, ...p.cabeceras },
    body: JSON.stringify({
      model: p.modelo,
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
  if (!r.ok) throw new Error(`${p.url} respondió ${r.status}`);
  const cuerpo = await r.json();
  const contenido = cuerpo?.choices?.[0]?.message?.content;
  return typeof contenido === "string" ? JSON.parse(contenido) : null;
}

export async function leerConIA(relato: string, lugar?: string | null): Promise<Lectura> {
  const suelo = leer(relato, lugar);
  if (!proveedor()) return suelo;

  try {
    const cruda = await preguntar(relato);
    if (!cruda) return suelo;

    const problema = texto(cruda.problema);
    if (!problema) return suelo;

    const partes = Object.fromEntries(
      PREGUNTABLES.map((k) => [k, texto(cruda[k])]),
    ) as Record<(typeof PREGUNTABLES)[number], string | null>;

    // El lugar que la persona escribió en su campo manda sobre el que la IA
    // encuentre en el relato: uno lo puso ella, el otro es una lectura nuestra.
    const declarado = lugar?.trim() || null;

    // **El guardián.** Basta con que una parte traiga una palabra que no estaba
    // para descartar la respuesta entera: si el modelo inventó en un campo, no
    // hay motivo para confiar en los otros cinco.
    const aVerificar = [problema, ...PREGUNTABLES.map((k) => (k === "lugar" && declarado ? null : partes[k]))];
    if (!anclado(relato, ...aVerificar)) {
      console.warn("lectura-ia: respuesta descartada por no estar anclada en el relato");
      return suelo;
    }

    return {
      problema: recortar(problema),
      lugar: declarado ?? (partes.lugar && recortar(partes.lugar)),
      afectados: partes.afectados && recortar(partes.afectados),
      desdeCuando: partes.desdeCuando && recortar(partes.desdeCuando),
      resultadoEsperado: partes.resultadoEsperado && recortar(partes.resultadoEsperado),
      solucionSugerida: partes.solucionSugerida && recortar(partes.solucionSugerida),
      fuente: "ia",
    };
  } catch (e) {
    // Nada de esto llega a la persona. Su aporte ya está guardado, y lo único
    // que pasa es que se le pregunta por todo en vez de por lo que falta.
    console.warn("lectura-ia: se usa la segmentación —", e instanceof Error ? e.message : e);
    return suelo;
  }
}
