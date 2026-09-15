import { createHash } from "node:crypto";
import { clienteServidor } from "../datos/cliente.ts";

export type Consulta = {
  aporteId: string;
  relato: string;
  lugarDeclarado: string | null;
  estadoUbicacion: string | null;
  recibidoEn: string;
  /** Lo que precisó después de contar. Es suyo y tiene derecho a verlo. */
  afectados: string | null;
  desdeCuando: string | null;
  canal: string;
  /** Solo si alguien lo aceptó. El declarado no se devuelve como si lo fuera. */
  municipio: string | null;
  colectivo: string | null;
  /** La versión vigente de la síntesis, que es la que manda. */
  sintesis: string | null;
};

/**
 * Cómo lo va a escribir una persona: con espacios, en minúscula, dictado por
 * teléfono. El alfabeto del código no tiene O ni I ni L justamente porque se
 * confunden al dictarlo — aquí se deshace lo que la mano agregó.
 */
export function normalizar(codigo: string): string {
  return codigo.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

/**
 * Canjea un comprobante. Devuelve **un aporte o nada**.
 *
 * `null` no es un error, es una respuesta. Si un código inexistente lanzara y
 * uno equivocado devolviera otra cosa, la diferencia serviría para averiguar qué
 * códigos existen probando — y entonces el comprobante dejaría de proteger nada.
 *
 * Por lo mismo el trabajo es el mismo en los dos casos: se normaliza, se hace el
 * hash y se pregunta. No hay un atajo para el código corto o mal formado.
 */
export async function canjearComprobante(
  codigo: string,
  procesoId: string,
): Promise<Consulta | null> {
  const sb = clienteServidor();
  const participacion = sb.schema("participacion");

  const limpio = normalizar(codigo);
  const hash = createHash("sha256").update(limpio).digest("hex");

  const { data, error } = await participacion.rpc("canjear_comprobante", {
    p_proceso: procesoId,
    p_hash: hash,
  });
  if (error) throw new Error(`no se pudo consultar el comprobante: ${error.message}`);

  const fila = Array.isArray(data) ? data[0] : null;

  // Queda el rastro, acierte o no. Una consulta que no se registra no se puede
  // investigar después, y el intento fallido es justo el que interesa mirar.
  await participacion.from("auditoria").insert({
    proceso_id: procesoId,
    actor: "ciudadano",
    accion: "consultar_comprobante",
    entidad: "comprobante",
    entidad_id: fila?.aporte_id ?? null,
    motivo: fila ? null : "sin coincidencia",
  });

  if (!fila) return null;
  return {
    aporteId: fila.aporte_id,
    relato: fila.relato,
    lugarDeclarado: fila.lugar_declarado,
    estadoUbicacion: fila.estado_ubicacion,
    recibidoEn: fila.recibido_en,
    afectados: fila.afectados,
    desdeCuando: fila.desde_cuando,
    canal: fila.canal,
    municipio: fila.municipio,
    colectivo: fila.colectivo,
    sintesis: fila.sintesis,
  };
}
