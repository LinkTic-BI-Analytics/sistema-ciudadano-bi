"use server";

import { recibirAporte } from "../../captura/recibir.ts";
import { procesoVigente } from "../../datos/proceso.ts";
import { proponerSintesis, corregirSintesis, confirmarSintesis, sintesisDe } from "../../captura/sintesis.ts";
import { leer, PREGUNTABLES, type Lectura, type Preguntable } from "../../captura/lectura.ts";
import { precisarAporte } from "../../captura/precisar.ts";
import { buscarMunicipios, type Candidato } from "../../territorio/emparejar.ts";
import { resolverUbicacion } from "../../revision/ubicacion.ts";
import { leerConIA } from "../../captura/lectura-ia.ts";
import { canjearComprobante } from "../../comprobante/canjear.ts";
import { hayIndicio, levantarAlerta } from "../../alerta/urgencia.ts";

export type Resultado =
  | { ok: true; codigo: string; yaExistia: boolean; lectura: Lectura }
  | { ok: false; errores: string[] };

/** Lo que devuelve cada vuelta de afinado. Nunca bloquea: el aporte ya está. */
export type PasoAfinado =
  | { ok: true; municipios?: Candidato[] }
  | { ok: false; error: string };

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
    // **Aquí no se llama a la IA.** `IA-01` dice que la recepción no depende de
    // ella, y eso se cumple de una sola forma: no poniéndola en este camino. La
    // lectura que vuelve es la segmentación, instantánea, y el comprobante sale
    // ya. El corte de Mistral llega después, con `prepararLectura`, y con el
    // aporte guardado detrás — si tarda o falla, nadie se entera.
    const lectura = leer(relato, lugar);

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

    // Si `prepararLectura` no alcanzó a guardar la versión 1 —se cayó la red, o
    // la base tardó— no se pierde lo que la persona acaba de decidir: se guarda
    // aquí lo que tenía en pantalla. Confirmar algo que no existe fallaría, y
    // fallaría justo después de que ella hizo su parte.
    const mostrado = String(datos.get("mostrado") ?? "").trim();
    if (mostrado && (await sintesisDe(aporteId)).length === 0) {
      await proponerSintesis({ aporteId, autor: "sistema", problema: mostrado });
    }

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
 * Lo que la persona precisó en las vueltas de afinado.
 *
 * **Se puede llamar varias veces y saltar entera.** Cada vuelta manda lo suyo;
 * lo que llegue vacío no borra nada, porque vacío significa *no lo dijo*, no
 * *bórralo*.
 *
 * Las cinco partes no van al mismo sitio, y no es un detalle de implementación:
 * lugar, a quiénes y desde cuándo son **hechos declarados** y viven en el
 * aporte; lo que debería cambiar y la solución sugerida son **la síntesis** de
 * `N03`, que lleva versión y autor porque la persona puede cambiar de opinión.
 */
export async function guardarPrecisiones(_previo: PasoAfinado | null, datos: FormData): Promise<PasoAfinado> {
  const codigo = String(datos.get("codigo") ?? "");
  const dato = (k: Preguntable) => String(datos.get(k) ?? "").trim() || null;

  if (PREGUNTABLES.every((k) => !dato(k))) return { ok: true };

  try {
    const aporteId = await aporteDelCodigo(codigo);
    if (!aporteId) return { ok: false, error: "No encontramos ese aporte. Tu código sigue sirviendo en «Consultar mi aporte»." };

    await precisarAporte({
      aporteId,
      lugarDeclarado: dato("lugar"),
      afectados: dato("afectados"),
      desdeCuando: dato("desdeCuando"),
    });

    // Si nombró un sitio, se buscan los municipios que encajan **para que ella
    // los confirme**. No se elige ninguno aquí: `I2` prohíbe inferir, y si el
    // texto dice «Rionegro» y nada más, hay dos y escoge ella.
    const lugar = dato("lugar");
    const municipios = lugar ? await buscarMunicipios(lugar) : [];

    const resultado = dato("resultadoEsperado");
    const solucion = dato("solucionSugerida");
    if (resultado || solucion) {
      await proponerSintesis({
        aporteId, autor: "ciudadano",
        problema: String(datos.get("problema") ?? "").trim(),
        resultadoEsperado: resultado ?? undefined,
        solucionSugerida: solucion ?? undefined,
      });
      await confirmarSintesis({ aporteId, autor: "ciudadano" });
    }
    return { ok: true, municipios };
  } catch (e) {
    console.error("guardarPrecisiones", e);
    return { ok: false, error: "No pudimos guardarlo. Tu aporte ya quedó registrado; puedes intentarlo luego." };
  }
}

/**
 * La lectura que se le va a mostrar, ya con IA si la hay.
 *
 * Corre **después** de que el comprobante está en pantalla. El aporte ya está
 * guardado, así que el peor caso de esta función es que la persona vea la
 * segmentación en vez del corte de Mistral.
 *
 * Guarda lo que se va a mostrar como **versión 1, firmada por el sistema**.
 * Guardarlo antes de enseñarlo es lo que permite que, si la persona dice «no es
 * eso», quede registrado *qué* le habíamos propuesto: una corrección sin el
 * texto corregido al lado no se puede leer después.
 */
export async function prepararLectura(codigo: string): Promise<Lectura | null> {
  try {
    const c = await canjearComprobante(codigo, await procesoVigente());
    if (!c) return null;

    const lectura = await leerConIA(c.relato, c.lugarDeclarado);
    await proponerSintesis({
      aporteId: c.aporteId, autor: "sistema",
      problema: lectura.problema,
      resultadoEsperado: lectura.resultadoEsperado ?? undefined,
      solucionSugerida: lectura.solucionSugerida ?? undefined,
    });
    return lectura;
  } catch (e) {
    console.error("prepararLectura", e);
    return null;
  }
}


/**
 * La persona confirma en qué municipio ocurre.
 *
 * **Es su papel, no un atajo nuestro.** La especificación dice que el ciudadano
 * *«cuenta qué pasa, confirma la síntesis del problema y el lugar afectado»*, y
 * él es quien lo sabe: hoy esa confirmación la hace un revisor que no estuvo
 * ahí y que solo tiene el texto delante.
 *
 * El motivo queda escrito en la ubicación, porque `I2` pide que resolverla sea
 * **un acto de alguien** y no una deducción. Aquí el alguien es la persona.
 *
 * Y el texto que escribió se queda igual en `lugar_declarado`: el código no lo
 * sustituye. Es lo que mantiene reversible haber aplazado el barrio (`Q26`).
 */
export async function confirmarMunicipio(
  codigo: string, territorio: string, version: string,
): Promise<PasoAfinado> {
  try {
    const aporteId = await aporteDelCodigo(codigo);
    if (!aporteId) return { ok: false, error: "No encontramos ese aporte." };
    await resolverUbicacion({
      aporteId, codigo: territorio, version,
      autor: "ciudadano",
      motivo: "la persona lo confirmó al contar su aporte",
    });
    return { ok: true };
  } catch (e) {
    console.error("confirmarMunicipio", e);
    return { ok: false, error: "No pudimos guardar el municipio. Tu aporte ya quedó registrado." };
  }
}
