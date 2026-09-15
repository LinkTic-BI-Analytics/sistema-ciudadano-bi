"use server";

import { canjearComprobante } from "../../comprobante/canjear.ts";
import { procesoVigente } from "../../datos/proceso.ts";

export type Consulta =
  // **Todo lo suyo, devuelto.** No es filtrar nada: es su aporte, y no poder
  // ver lo que uno mismo contó es lo que hace dejar de creer que sirvió.
  | {
      estado: "encontrado";
      relato: string;
      lugarDeclarado: string | null;
      estadoUbicacion: string | null;
      recibidoEn: string;
      afectados: string | null;
      desdeCuando: string | null;
      canal: string;
      municipio: string | null;
      colectivo: string | null;
      sintesis: string | null;
    }
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
    afectados: c.afectados,
    desdeCuando: c.desdeCuando,
    canal: c.canal,
    municipio: c.municipio,
    colectivo: c.colectivo,
    sintesis: c.sintesis,
  };
}
