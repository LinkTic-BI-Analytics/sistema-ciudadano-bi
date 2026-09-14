import { clienteServidor } from "../datos/cliente.ts";

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

/** La historia de un expediente, en orden. Conserva quién y por qué. */
export async function historiaDe(expedienteId: string): Promise<Actuacion[]> {
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.from("actuacion")
    .select("id, tipo, autor, ocurrida_en, motivo, destino, aceptada_en, siguiente_paso")
    .eq("expediente_id", expedienteId).order("ocurrida_en", { ascending: true });
  if (error) throw new Error(`no se pudo leer la historia: ${error.message}`);
  return (data ?? []).map((a: any) => ({
    actuacionId: a.id, tipo: a.tipo, autor: a.autor, ocurridaEn: a.ocurrida_en,
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
  const f = (Array.isArray(data) ? data[0] : data) as any;
  return {
    estado: f.estado,
    ultimaActuacion: f.ultima_actuacion,
    diasSinActuar: Number(f.dias_sin_actuar),
    remisionPendiente: f.remision_pendiente,
  };
}
