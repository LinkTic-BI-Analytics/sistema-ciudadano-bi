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
  // **Apagado explícito, para los recorridos.** Vaciar la variable no bastaba:
  // Next carga `.env.local` del disco al arrancar, y si una cadena vacía cuenta
  // o no como «ya definida» depende de la versión. Un interruptor propio no
  // depende de eso, y se lee por lo que es.
  //
  // Hace falta porque con IA el flujo depende de lo que el modelo encuentre
  // —cuántas partes halle cambia cuántas vueltas ve la persona— y una prueba
  // que depende del humor de un modelo no prueba el producto.
  if (process.env.SIN_IA === "1") return null;

  const or = process.env.OPENROUTER_API_KEY?.trim();
  if (or) {
    return {
      // Se puede apuntar a otro sitio: una pasarela de la entidad, o el
      // proveedor falso con el que corren los recorridos. Sin esto, todo lo que
      // la IA decide —cuántas vueltas ve la persona, si contó una cosa o tres—
      // era imposible de probar sin salir a la red y sin depender de lo que el
      // modelo contestara esa vez.
      url: process.env.IA_URL?.trim() || "https://openrouter.ai/api/v1/chat/completions",
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
5. Un mismo fragmento puede ir en DOS campos. Si el lugar viene dentro de otra frase, extráelo igual: de "los niños de la vereda El Salado faltan", "afectados" es "los niños de la vereda El Salado" y "lugar" es "la vereda El Salado".
6. Antes de poner null, relee el relato buscando ese dato dentro de otras frases. Solo pon null si de verdad no está.
7. "afectados" son PERSONAS: quiénes o cuántos. Un sitio NUNCA va en "afectados". "en mi casa", "en el barrio", "en la vereda" son "lugar", no "afectados".
8. "lugar" incluye el municipio y el departamento si aparecen, aunque estén sueltos al final ("... y rionegro antioquia").
10. "problemas" separa cosas que necesitan respuestas DISTINTAS. "no hay agua, la vía está mala y el puesto de salud abre dos días" son TRES. Pero "no hay agua y cuando llega sale turbia" es UNA sola (el mismo problema descrito dos veces), y "se inunda la vía y por eso los niños no van al colegio" también es UNA (causa y consecuencia). Ante la duda, UNA. "problema" es siempre el primero de "problemas".
9a. Extrae el fragmento MÍNIMO que conteste, pero NUNCA quites de QUÉ o de QUIÉN se habla. Quita solo muletillas y verbos de relleno del principio: de "tenemos niños afectados" el valor es "niños afectados"; de "es que no hay agua" es "no hay agua"; de "somos como veinte familias" es "veinte familias". En cambio de "el internet no sirve para nada" el valor es "el internet no sirve para nada" COMPLETO: quitar "el internet" deja una frase que no dice de qué se habla. Ante la duda, deja más. Quita también las muletillas del final ("así", "pues", "ya", "y eso"): de "como un mes asi" el valor es "como un mes". Sigue siendo literal: solo se recorta, nunca se cambia una palabra.
9b. Cada valor tiene que decir algo por sí solo. NUNCA devuelvas un pronombre suelto ("nos", "les", "uno", "todos") ni una palabra vacía: si el relato no nombra a quiénes, devuelve null.
9. "lugar" tiene que ser un sitio que OTRA persona pueda encontrar: un barrio, una vereda, un municipio, un departamento, una vía, un punto conocido. "en mi casa", "aquí", "acá", "en mi barrio", "donde vivo" NO son lugares: devuelve null.

Devuelve SOLO un objeto JSON con estas claves:
{
  "problemas": ["un fragmento por cada problema DISTINTO que cuente; casi siempre uno"],
  "problema": "el fragmento que dice qué está pasando",
  "lugar": "el fragmento que dice dónde ocurre, o null",
  "afectados": "el fragmento que dice a quiénes les pasa o cuántos son, o null",
  "desdeCuando": "el fragmento que dice hace cuánto pasa, o null",
  "resultadoEsperado": "el fragmento que dice qué debería cambiar, o null",
  "solucionSugerida": "el fragmento que propone cómo resolverlo, o null"
}`;

type Clave = "problema" | "problemas" | (typeof PREGUNTABLES)[number];
type Cruda = Partial<Record<Clave, unknown>>;

// Palabras que, solas, no contestan nada. Un modelo que recorta a veces devuelve
// el pronombre más cercano —«nos», «les», «uno»— y eso está anclado en el relato
// pero no informa: a la pregunta «¿a quiénes les pasa?», «nos» no dice a quiénes.
//
// Mostrárselo a la persona es peor que no mostrar nada: la invita a confirmar un
// dato vacío, y después un revisor lee «afectados: nos» como si fuera una
// respuesta.
const VACÍAS = new Set([
  "nos", "les", "le", "me", "se", "uno", "una", "todos", "todo", "esto", "eso",
  "aqui", "alla", "alli", "ahi", "yo", "tu", "el", "ella", "ellos", "ellas",
  "mi", "mis", "su", "sus", "la", "lo", "los", "las", "un", "hay",
]);

const texto = (v: unknown): string | null => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  // «null» como cadena es lo que devuelve un modelo que entendió la instrucción
  // a medias. Tratarlo como texto le pondría la palabra «null» en la pantalla.
  if (!t || t.toLowerCase() === "null") return null;

  const palabras = t
    .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ\s]/gi, " ").split(/\s+/).filter(Boolean);
  // Si todo lo que devolvió son palabras que no dicen nada, no es una respuesta.
  if (palabras.length === 0 || palabras.every((w) => VACÍAS.has(w))) return null;
  return t;
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

    // La lista manda sobre el campo suelto: si el modelo separó dos cosas y
    // luego puso otra en `problema`, la que vale es la primera de la lista.
    const lista = (Array.isArray(cruda.problemas) ? cruda.problemas : [])
      .map(texto).filter((x): x is string => x !== null);
    const problema = lista[0] ?? texto(cruda.problema);
    if (!problema) return suelo;
    const otros = lista.slice(1);

    const partes = Object.fromEntries(
      PREGUNTABLES.map((k) => [k, texto(cruda[k])]),
    ) as Record<(typeof PREGUNTABLES)[number], string | null>;

    // El lugar que la persona escribió en su campo manda sobre el que la IA
    // encuentre en el relato: uno lo puso ella, el otro es una lectura nuestra.
    const declarado = lugar?.trim() || null;

    // **El guardián.** Basta con que una parte traiga una palabra que no estaba
    // para descartar la respuesta entera: si el modelo inventó en un campo, no
    // hay motivo para confiar en los otros cinco.
    const aVerificar = [problema, ...otros,
      ...PREGUNTABLES.map((k) => (k === "lugar" && declarado ? null : partes[k]))];
    if (!anclado(relato, ...aVerificar)) {
      console.warn("lectura-ia: respuesta descartada por no estar anclada en el relato");
      return suelo;
    }

    return {
      problema: recortar(problema),
      otrosProblemas: otros.map(recortar),
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
