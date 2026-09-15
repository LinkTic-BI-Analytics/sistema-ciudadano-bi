import { clienteServidor } from "../datos/cliente.ts";
import type { FilaActuacion, FilaEstadoAtencion } from "../datos/filas.ts";

/** Los cinco de `RES-01`, y no hay un sexto. */
export type TipoActuacion =
  | "recepcion" | "remision" | "decision" | "respuesta" | "siguiente_paso";

export type Actuacion = {
  actuacionId: string;
  tipo: TipoActuacion;
  autor: string;
  ocurridaEn: string;
  motivo: string | null;
  destino: string | null;
  aceptadaEn: string | null;
  siguientePaso: string | null;
};

export type EstadoAtencion = {
  estado: "sin_respuesta_registrada" | "recibido" | "remitido" | "respondido";
  ultimaActuacion: string | null;
  diasSinActuar: number;
  remisionPendiente: boolean;
};

/**
 * Registra un hecho. **Uno por fila.**
 *
 * No hay una función «cambiar estado» porque no hay un estado que cambiar: hay
 * hechos que se acumulan. Un expediente recibido y remitido pero sin responder
 * es el estado en que va a estar casi todo, y con un campo `estado` no se puede
 * decir.
 *
 * Y no hay una función «cerrar». `N13`: *la falta de respuesta institucional
 * queda visible para gestión* — **no se cierra por silencio**.
 */
export async function registrarActuacion(a: {
  expedienteId: string;
  tipo: TipoActuacion;
  autor: string;
  motivo?: string;
  destino?: string;
  siguientePaso?: string;
}): Promise<{ actuacionId: string }> {
  const p = clienteServidor().schema("participacion");

  const { data: exp } = await p.from("expediente")
    .select("proceso_id").eq("id", a.expedienteId).single();
  if (!exp) throw new Error(`no existe el expediente ${a.expedienteId}`);

  const { data, error } = await p.from("actuacion").insert({
    proceso_id: exp.proceso_id,
    expediente_id: a.expedienteId,
    tipo: a.tipo,
    autor: a.autor,
    motivo: a.motivo ?? null,
    destino: a.destino ?? null,
    siguiente_paso: a.siguientePaso ?? null,
  }).select("id").single();
  // La restricción del esquema es la que rechaza un tipo inventado. No se
  // comprueba antes: se deja fallar donde de verdad es imposible.
  if (error || !data) throw new Error(`no se pudo registrar la actuación: ${error?.message}`);

  await p.from("auditoria").insert({
    proceso_id: exp.proceso_id, actor: a.autor, accion: `actuacion_${a.tipo}`,
    entidad: "expediente", entidad_id: a.expedienteId, motivo: a.motivo ?? null,
  });

  return { actuacionId: data.id };
}

/**
 * La destinataria dice que lo recibió.
 *
 * **Es un hecho aparte, con su fecha.** No un booleano que alguien cambia sin
 * dejar cuándo: la especificación dice que *«remisión no aceptada sigue
 * pendiente»*, y eso solo se puede sostener si aceptar deja rastro.
 *
 * No existe la operación contraria por descuido: una remisión no se «des-acepta»
 * borrando la fecha. Si la destinataria se desdice, eso es otra actuación.
 */
export async function aceptarRemision(e: {
  actuacionId: string; autor: string; motivo: string;
}): Promise<void> {
  if (!e.motivo?.trim()) throw new Error("aceptar una remisión exige decir quién confirmó y cómo");
  const p = clienteServidor().schema("participacion");

  const { data: act } = await p.from("actuacion")
    .select("id, tipo, proceso_id, expediente_id, aceptada_en")
    .eq("id", e.actuacionId).single();
  if (!act) throw new Error(`no existe la actuación ${e.actuacionId}`);
  if (act.tipo !== "remision") throw new Error("solo una remisión se acepta");
  if (act.aceptada_en) return;

  const { error } = await p.from("actuacion")
    .update({ aceptada_en: new Date().toISOString() }).eq("id", e.actuacionId);
  if (error) throw new Error(`no se pudo aceptar la remisión: ${error.message}`);

  await p.from("auditoria").insert({
    proceso_id: act.proceso_id, actor: e.autor, accion: "aceptar_remision",
    entidad: "expediente", entidad_id: act.expediente_id, motivo: e.motivo,
  });
}

/** La historia de un expediente, en orden. Conserva quién y por qué. */
export async function historiaDe(expedienteId: string): Promise<Actuacion[]> {
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.from("actuacion")
    .select("id, tipo, autor, ocurrida_en, motivo, destino, aceptada_en, siguiente_paso")
    .eq("expediente_id", expedienteId).order("ocurrida_en", { ascending: true });
  if (error) throw new Error(`no se pudo leer la historia: ${error.message}`);
  return ((data ?? []) as FilaActuacion[]).map((a) => ({
    actuacionId: a.id, tipo: a.tipo as TipoActuacion, autor: a.autor, ocurridaEn: a.ocurrida_en,
    motivo: a.motivo, destino: a.destino, aceptadaEn: a.aceptada_en,
    siguientePaso: a.siguiente_paso,
  }));
}

/**
 * El estado de atención, **derivado de los hechos**.
 *
 * No se guarda en ninguna columna a propósito: un campo almacenado se
 * desincroniza de sus hechos, y entonces el tablero afirma algo que la historia
 * contradice.
 *
 * **Nunca devuelve «vencido»** ni «resuelto». Lo primero porque el plazo no
 * existe (`Q20`) y *«no inventar incumplimiento de plazo si no existe plazo
 * definido»*. Lo segundo porque `RES-01` dice que **respuesta no es resolución**,
 * y este módulo no sabe nada de si el problema se solucionó.
 */
export async function estadoDeAtencion(expedienteId: string): Promise<EstadoAtencion> {
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.rpc("estado_de_atencion", { p_expediente: expedienteId });
  if (error) throw new Error(`no se pudo derivar el estado: ${error.message}`);
  const f = (Array.isArray(data) ? data[0] : data) as FilaEstadoAtencion;
  return {
    estado: f.estado as EstadoAtencion["estado"],
    ultimaActuacion: f.ultima_actuacion,
    diasSinActuar: Number(f.dias_sin_actuar),
    remisionPendiente: f.remision_pendiente,
  };
}
