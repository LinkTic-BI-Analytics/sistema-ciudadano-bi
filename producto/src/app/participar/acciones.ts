"use server";

import { recibirAporte } from "../../captura/recibir.ts";
import { procesoVigente } from "../../datos/proceso.ts";
import { proponerSintesis, corregirSintesis, confirmarSintesis } from "../../captura/sintesis.ts";
import { leer, type Lectura } from "../../captura/lectura.ts";
import { canjearComprobante } from "../../comprobante/canjear.ts";
import { hayIndicio, levantarAlerta } from "../../alerta/urgencia.ts";

export type Resultado =
  | { ok: true; codigo: string; yaExistia: boolean; lectura: Lectura }
  | { ok: false; errores: string[] };

/** Lo que devuelve cada vuelta de afinado. Nunca bloquea: el aporte ya está. */
export type PasoAfinado = { ok: true } | { ok: false; error: string };

/**
 * Resuelve el código a un aporte.
 *
 * **Las vueltas de afinado viajan con el código, no con el `aporteId`.** Si el
 * navegador llevara el id interno, cualquiera podría mandar el de otra persona y
 * confirmar una síntesis ajena — y confirmar es precisamente el acto que dice
 * «esto es mío y dice lo que quise decir».
 *
 * El código ya lo tiene solo quien hizo el aporte, y el canje deja rastro en
 * auditoría acierte o no.
 */
async function aporteDelCodigo(codigo: string): Promise<string | null> {
  const c = await canjearComprobante(codigo, await procesoVigente());
  return c?.aporteId ?? null;
}

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
    // **La lectura que le vamos a mostrar se guarda como versión 1, y va firmada
    // por el sistema.** Guardarla antes de enseñarla es lo que permite que, si
    // la persona dice «no es eso», quede registrado *qué* le habíamos propuesto.
    // Una corrección sin el texto corregido al lado no se puede leer después.
    const lectura = leer(relato, lugar);
    if (!r.yaExistia) {
      await proponerSintesis({ aporteId: r.aporteId, autor: "sistema", problema: lectura.problema });
    }

    // Si el relato trae un indicio, la alerta se levanta. **No bloquea el
    // envío**: `N02` pide aceptar relato libre, y retener a alguien que está
    // reportando un derrumbe es peor que inútil.
    const indicio = hayIndicio(relato);
    if (indicio && !r.yaExistia) {
      await levantarAlerta({ aporteId: r.aporteId, origen: "senal", indicio });
    }

    return { ok: true, codigo: r.codigoComprobante, yaExistia: r.yaExistia, lectura };
  } catch (e) {
    // El mensaje técnico no se le muestra a nadie: no ayuda y a veces cuenta de
    // más. Pero el error no se traga — sube al registro del servidor.
    console.error("enviarAporte", e);
    return { ok: false, errores: ["No pudimos recibir tu aporte. Vuelve a intentarlo en un momento."] };
  }
}


/**
 * Primera vuelta: la persona lee lo que entendimos y dice si es eso.
 *
 * Si dice que sí, se confirma la versión que ya existe. Si dice que no, su texto
 * entra como versión nueva con clase `mal_interpretado` — **la anterior se queda
 * diciendo lo que decía**, porque el día que alguien pregunte por qué cambió hay
 * que poder mostrar las dos.
 *
 * `V14`: la última palabra sobre su síntesis es suya.
 */
export async function confirmarLectura(_previo: PasoAfinado | null, datos: FormData): Promise<PasoAfinado> {
  const codigo = String(datos.get("codigo") ?? "");
  const texto = String(datos.get("problema") ?? "").trim();
  const corrigio = String(datos.get("corrigio") ?? "") === "si";

  try {
    const aporteId = await aporteDelCodigo(codigo);
    if (!aporteId) return { ok: false, error: "No encontramos ese aporte. Tu código sigue sirviendo en «Consultar mi aporte»." };

    if (corrigio) {
      if (!texto) return { ok: false, error: "Escribe con tus palabras cuál es el problema." };
      await corregirSintesis({ aporteId, texto, clase: "mal_interpretado", autor: "ciudadano" });
    }
    await confirmarSintesis({ aporteId, autor: "ciudadano" });
    return { ok: true };
  } catch (e) {
    console.error("confirmarLectura", e);
    return { ok: false, error: "No pudimos guardarlo. Tu aporte ya quedó registrado; puedes intentarlo luego." };
  }
}

/**
 * Segunda vuelta: lo que debería cambiar y, si se le ocurre, cómo.
 *
 * **Las dos son opcionales y se puede saltar entera.** La visión lo dice sin
 * rodeos: *«una solución sugerida es bienvenida, pero no debería ser requisito
 * para que un problema sea escuchado»*.
 *
 * Queda como una versión más de la síntesis, con clase `propuesta` y firmada por
 * la persona: es ella proponiendo qué dice su propia síntesis.
 */
export async function completarSintesis(_previo: PasoAfinado | null, datos: FormData): Promise<PasoAfinado> {
  const codigo = String(datos.get("codigo") ?? "");
  const problema = String(datos.get("problema") ?? "").trim();
  const resultado = String(datos.get("resultado") ?? "").trim();
  const solucion = String(datos.get("solucion") ?? "").trim();

  // Sin nada que agregar no se escribe una versión igual a la anterior. Una
  // versión que no cambia nada ensucia la historia que las versiones existen
  // para contar.
  if (!resultado && !solucion) return { ok: true };

  try {
    const aporteId = await aporteDelCodigo(codigo);
    if (!aporteId) return { ok: false, error: "No encontramos ese aporte. Tu código sigue sirviendo en «Consultar mi aporte»." };
    await proponerSintesis({
      aporteId, autor: "ciudadano",
      problema, resultadoEsperado: resultado, solucionSugerida: solucion,
    });
    await confirmarSintesis({ aporteId, autor: "ciudadano" });
    return { ok: true };
  } catch (e) {
    console.error("completarSintesis", e);
    return { ok: false, error: "No pudimos guardarlo. Tu aporte ya quedó registrado; puedes intentarlo luego." };
  }
}
