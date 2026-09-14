"use server";

import { canjearComprobante } from "../../comprobante/canjear.ts";
import { procesoVigente } from "../../datos/proceso.ts";

export type Consulta =
  | { estado: "encontrado"; relato: string; lugarDeclarado: string | null; estadoUbicacion: string | null; recibidoEn: string }
  | { estado: "sin_resultado" }
  | { estado: "vacio" };

/**
 * Canjea el código.
 *
 * **No encontrar no es un error.** Si lo fuera, la diferencia entre «ese código
 * no existe» y «ese código no es tuyo» serviría para averiguar qué códigos
 * existen probando.
 */
export async function consultar(_previo: Consulta | null, datos: FormData): Promise<Consulta> {
  const codigo = String(datos.get("codigo") ?? "").trim();
  if (!codigo) return { estado: "vacio" };

  const c = await canjearComprobante(codigo, await procesoVigente());
  if (!c) return { estado: "sin_resultado" };
  return {
    estado: "encontrado",
    relato: c.relato,
    lugarDeclarado: c.lugarDeclarado,
    estadoUbicacion: c.estadoUbicacion,
    recibidoEn: c.recibidoEn,
  };
}
