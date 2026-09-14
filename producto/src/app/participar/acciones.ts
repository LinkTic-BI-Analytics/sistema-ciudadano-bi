"use server";

import { recibirAporte } from "../../captura/recibir.ts";
import { procesoVigente } from "../../datos/proceso.ts";
import { proponerSintesis } from "../../captura/sintesis.ts";

export type Resultado =
  | { ok: true; codigo: string; yaExistia: boolean }
  | { ok: false; errores: string[] };

/**
 * Recibe lo que la persona escribió.
 *
 * **Valida poco a propósito.** `N02` pide aceptar relato libre y ubicación
 * incompleta: lo único obligatorio es que haya contado algo. Pedir más es
 * excluir a quien no sabe la entidad competente, que es justo a quien esto
 * quiere escuchar.
 *
 * El lugar se manda **tal como lo escribió**, sin tocar. Normalizarlo aquí sería
 * la inferencia que `I2` prohíbe, y perderlo es lo que haría irreversible
 * aplazar el barrio (`Q26`).
 */
export async function enviarAporte(_previo: Resultado | null, datos: FormData): Promise<Resultado> {
  const relato = String(datos.get("relato") ?? "").trim();
  const lugar = String(datos.get("lugar") ?? "").trim();
  const clave = String(datos.get("clave") ?? "").trim();

  const errores: string[] = [];
  if (!relato) errores.push("Cuéntanos qué está pasando. Es lo único que necesitamos para empezar.");
  if (!clave) errores.push("Algo falló al preparar el envío. Recarga la página e inténtalo de nuevo.");
  if (errores.length) return { ok: false, errores };

  try {
    const r = await recibirAporte({
      procesoId: await procesoVigente(),
      claveEnvio: clave,
      relato,
      canal: "web",
      lugarDeclarado: lugar || undefined,
    });
    // Las tres partes de `N03`, **todas opcionales**. Si la persona no llenó
    // ninguna, no hay síntesis — y eso está bien: contó lo suyo y con eso basta
    // para que alguien lo revise.
    const problema = String(datos.get("problema") ?? "").trim();
    const resultado = String(datos.get("resultado") ?? "").trim();
    const solucion = String(datos.get("solucion") ?? "").trim();
    if (!r.yaExistia && (problema || resultado || solucion)) {
      await proponerSintesis({
        aporteId: r.aporteId, autor: "ciudadano",
        problema, resultadoEsperado: resultado, solucionSugerida: solucion,
      });
    }

    return { ok: true, codigo: r.codigoComprobante, yaExistia: r.yaExistia };
  } catch (e) {
    // El mensaje técnico no se le muestra a nadie: no ayuda y a veces cuenta de
    // más. Pero el error no se traga — sube al registro del servidor.
    console.error("enviarAporte", e);
    return { ok: false, errores: ["No pudimos recibir tu aporte. Vuelve a intentarlo en un momento."] };
  }
}
