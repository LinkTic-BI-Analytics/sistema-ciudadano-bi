import { clienteServidor } from "../datos/cliente.ts";
import { transcribir } from "./transcribir.ts";

/**
 * Recibe un aporte hablado (ADR 0013).
 *
 * **El orden importa y no es negociable: primero se guarda el audio.** Es el
 * original. Si la transcripción falla, el aporte existe igual y la persona
 * puede escribir lo suyo; si se perdiera el audio, no habría con qué volver
 * atrás nunca.
 *
 * Por eso el aporte se crea **al final**, apuntando a una grabación que ya
 * existe: así la base puede exigir con una simple comprobación que un aporte
 * por voz tenga su original, sin disparadores ni transacciones que PostgREST
 * no puede dar.
 *
 * Si algo falla después de subir el archivo, se borra: un archivo sin fila es
 * basura que nadie va a encontrar para limpiar.
 */

export type Grabada = {
  grabacionId: string;
  /** La primera transcripción, o `null` si no se entendió nada. */
  transcripcion: string | null;
};

const DEPOSITO = "grabaciones";

/**
 * Guarda el audio y lo transcribe. **No crea el aporte todavía.**
 *
 * El diseño lo pide así: el botón principal es *«añadir transcripción»*, y la
 * persona revisa lo que se oyó antes de seguir. El aporte se crea después,
 * apuntando a esta grabación.
 *
 * Si algo falla después de subir el archivo, se borra: un archivo sin fila es
 * la voz de alguien guardada sin ningún registro de por qué está ahí.
 */
export async function guardarGrabacion(e: {
  procesoId: string;
  audio: Uint8Array;
  tipoMime: string;
  segundos?: number;
}): Promise<Grabada> {
  if (e.audio.byteLength === 0) throw new Error("una grabación vacía no es un aporte");

  const sb = clienteServidor();
  const p = sb.schema("participacion");

  // El navegador entrega «audio/webm;codecs=opus» y el depósito solo admite el
  // tipo a secas. El códec no aporta nada a quien lo va a reproducir después.
  const mime = e.tipoMime.split(";")[0]!.trim();
  const extension = mime.split("/")[1]?.replace("x-", "") ?? "webm";
  const ruta = `${e.procesoId}/${crypto.randomUUID()}.${extension}`;

  const { error: eSubida } = await sb.storage.from(DEPOSITO)
    .upload(ruta, e.audio, { contentType: mime, upsert: false });
  if (eSubida) throw new Error(`no se pudo guardar la grabación: ${eSubida.message}`);

  try {
    const { data: g, error: eG } = await p.from("grabacion").insert({
      proceso_id: e.procesoId, ruta, tipo_mime: mime,
      bytes: e.audio.byteLength, segundos: e.segundos ?? null,
    }).select("id").single();
    if (eG) throw new Error(`no se pudo registrar la grabación: ${eG.message}`);

    // Se transcribe **después** de tener el original a salvo. Si el proveedor
    // se cae, la grabación sigue ahí y se puede volver a intentar más tarde:
    // es justo lo que el ADR 0013 quería posible.
    const leido = await transcribir(e.audio, mime);
    if (leido) {
      const { error: eT } = await p.from("transcripcion").insert({
        proceso_id: e.procesoId, grabacion_id: g!.id, version: 1,
        texto: leido.texto, autor: leido.modelo,
      });
      if (eT) throw new Error(`no se pudo guardar la transcripción: ${eT.message}`);
    }

    return { grabacionId: g!.id, transcripcion: leido?.texto ?? null };
  } catch (fallo) {
    await sb.storage.from(DEPOSITO).remove([ruta]);
    throw fallo;
  }
}

/**
 * La persona corrige lo que la máquina entendió.
 *
 * **Versión nueva, nunca sobreescritura.** La del modelo se queda diciendo lo
 * que dijo: el día que alguien pregunte por qué el expediente habla de La
 * Martinica y la persona dice Martinita, hay que poder mostrar las dos.
 *
 * Esto es distinto de corregir la síntesis: aquí se corrige **lo que se oyó**,
 * no lo que se entendió.
 */
export async function corregirTranscripcion(e: {
  aporteId: string; texto: string; motivo?: string;
}): Promise<void> {
  if (!e.texto?.trim()) throw new Error("una corrección vacía no es una corrección");

  const p = clienteServidor().schema("participacion");
  const { data: a } = await p.from("aporte")
    .select("grabacion_id, proceso_id").eq("id", e.aporteId).single();
  if (!a?.grabacion_id) throw new Error("ese aporte no tiene grabación: no hay nada que transcribir");
  const g = { id: a.grabacion_id as string, proceso_id: a.proceso_id as string };

  const { data: ultima } = await p.from("transcripcion")
    .select("version").eq("grabacion_id", g.id)
    .order("version", { ascending: false }).limit(1);

  const { error } = await p.from("transcripcion").insert({
    proceso_id: g.proceso_id, grabacion_id: g.id,
    version: (ultima?.[0]?.version ?? 0) + 1,
    texto: e.texto.trim(), autor: "ciudadano", motivo: e.motivo ?? null,
  });
  if (error) throw new Error(`no se pudo corregir la transcripción: ${error.message}`);
}

/** Todas las versiones, en orden. La historia completa, nunca recortada. */
export async function transcripcionesDe(aporteId: string) {
  const p = clienteServidor().schema("participacion");
  const { data: a } = await p.from("aporte").select("grabacion_id").eq("id", aporteId).single();
  if (!a?.grabacion_id) return [];
  const g = { id: a.grabacion_id as string };
  const { data } = await p.from("transcripcion")
    .select("version, texto, autor, motivo, creada_en")
    .eq("grabacion_id", g.id).order("version");
  return data ?? [];
}
