import { clienteServidor } from "../datos/cliente.ts";
import type { FilaPendiente } from "../datos/filas.ts";

export type PendienteUbicacion = {
  aporteId: string;
  relato: string;
  lugarDeclarado: string | null;
  recibidoEn: string;
};

export type ResolverUbicacion = {
  aporteId: string;
  codigo: string;
  version: string;
  autor: string;
  motivo: string;
};

/**
 * Los aportes cuya ubicación quedó por aclarar.
 *
 * Salen los más viejos primero: `backoffice-especificacion.md` fija el orden en
 * *«más antiguo → más reciente»* y **sin puntaje de prioridad**, porque ordenar
 * por popularidad es justo lo que `BI-02` prohíbe como pantalla por defecto.
 */
export async function porAclarar(procesoId: string, limite = 50): Promise<PendienteUbicacion[]> {
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p
    .from("ubicacion")
    .select("aporte_id, aporte:aporte_id (relato_original, lugar_declarado, recibido_en, retirado_en)")
    .eq("proceso_id", procesoId)
    .eq("estado", "por_aclarar")
    .limit(limite);
  if (error) throw new Error(`no se pudo leer la bandeja: ${error.message}`);

  return ((data ?? []) as unknown as FilaPendiente[])
    .filter((u) => u.aporte !== null && u.aporte.retirado_en === null)
    .map((u) => ({
      aporteId: u.aporte_id,
      relato: u.aporte!.relato_original,
      lugarDeclarado: u.aporte!.lugar_declarado,
      recibidoEn: u.aporte!.recibido_en,
    }))
    .sort((a, b) => a.recibidoEn.localeCompare(b.recibidoEn));
}

/**
 * Acepta un territorio para un aporte.
 *
 * **El motivo es obligatorio y se comprueba aquí antes de tocar la base.** No es
 * duplicar una restricción: `I2` dice que resolver es un acto de alguien, y un
 * motivo vacío que la base aceptara dejaría un acto sin razón — que es
 * indistinguible de una inferencia automática, justo lo que `I2` prohíbe.
 *
 * Un aporte puede tener varios territorios: `GEO-01` lo permite, y `R2` ya se
 * encarga de que eso no multiplique el numerador.
 */
export async function resolverUbicacion(e: ResolverUbicacion): Promise<void> {
  if (!e.motivo?.trim()) {
    throw new Error("resolver una ubicación exige motivo: I2 pide que sea un acto de alguien, no una inferencia");
  }
  const sb = clienteServidor();
  const p = sb.schema("participacion");

  const { data: aporte, error: eAporte } = await p
    .from("aporte").select("proceso_id").eq("id", e.aporteId).single();
  if (eAporte || !aporte) throw new Error(`no existe el aporte ${e.aporteId}`);

  // Si ya hay una fila `por_aclarar`, se resuelve esa. Si no, se agrega otra:
  // el segundo territorio es un vínculo más, no un reemplazo.
  const { data: pendiente } = await p
    .from("ubicacion").select("id")
    .eq("aporte_id", e.aporteId).eq("estado", "por_aclarar").limit(1);

  const fila = {
    estado: "confirmada",
    territorio_codigo: e.codigo,
    territorio_version: e.version,
    autor: e.autor,
    motivo: e.motivo,
  };

  const { error } = pendiente?.length
    ? await p.from("ubicacion").update(fila).eq("id", pendiente[0]!.id)
    : await p.from("ubicacion").insert({ ...fila, proceso_id: aporte.proceso_id, aporte_id: e.aporteId });
  // La clave foránea contra (codigo, version) es la que rechaza un código que no
  // existe en esa versión del catálogo. No se comprueba antes: se deja fallar.
  if (error) throw new Error(`no se pudo resolver la ubicación: ${error.message}`);

  await p.from("auditoria").insert({
    proceso_id: aporte.proceso_id, actor: e.autor, accion: "resolver_ubicacion",
    entidad: "ubicacion", entidad_id: e.aporteId, motivo: e.motivo,
    despues: { codigo: e.codigo, version: e.version },
  });
}

/**
 * Devuelve un aporte a la bandeja.
 *
 * **Borra el código**, no lo deja de adorno con otro estado: un código guardado
 * bajo `por_aclarar` es exactamente el cuarto estado implícito que `I2` prohíbe,
 * y la restricción del esquema tampoco lo permitiría.
 *
 * El caso típico tiene nombre en `GEO-01`: *«una dirección residencial no se usa
 * como lugar del problema sin confirmación»*.
 */
export async function devolverAPorAclarar(
  e: { aporteId: string; autor: string; motivo: string },
): Promise<void> {
  if (!e.motivo?.trim()) throw new Error("devolver a por aclarar exige motivo");
  const p = clienteServidor().schema("participacion");

  const { data: aporte } = await p.from("aporte").select("proceso_id").eq("id", e.aporteId).single();
  if (!aporte) throw new Error(`no existe el aporte ${e.aporteId}`);

  const { error } = await p.from("ubicacion")
    .update({ estado: "por_aclarar", territorio_codigo: null, territorio_version: null,
              autor: e.autor, motivo: e.motivo })
    .eq("aporte_id", e.aporteId);
  if (error) throw new Error(`no se pudo devolver a por aclarar: ${error.message}`);

  await p.from("auditoria").insert({
    proceso_id: aporte.proceso_id, actor: e.autor, accion: "devolver_ubicacion",
    entidad: "ubicacion", entidad_id: e.aporteId, motivo: e.motivo,
  });
}
