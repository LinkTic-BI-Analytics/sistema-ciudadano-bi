"use server";

import { recibirAporte } from "../../captura/recibir.ts";
import { clienteServidor } from "../../datos/cliente.ts";
import { procesoVigente } from "../../datos/proceso.ts";
import { proponerSintesis, corregirSintesis, confirmarSintesis, sintesisDe } from "../../captura/sintesis.ts";
import { leer, PREGUNTABLES, esTema, type Lectura, type Preguntable } from "../../captura/lectura.ts";
import { precisarAporte } from "../../captura/precisar.ts";
import { guardarGrabacion } from "../../captura/voz.ts";
import {
  buscarMunicipios, buscarPorNombre, departamentos, municipiosDe, departamentoEn,
  type Candidato, type Departamento,
} from "../../territorio/emparejar.ts";
import { declararVoceria } from "../../captura/vocero.ts";
import type { ContextoHeredado } from "../../captura/contexto.ts";
import { resolverUbicacion, corregirUbicacionDelCiudadano } from "../../revision/ubicacion.ts";
import { leerConIA } from "../../captura/lectura-ia.ts";
import { canjearComprobante } from "../../comprobante/canjear.ts";
import { hayIndicio, levantarAlerta } from "../../alerta/urgencia.ts";

export type Resultado =
  | { ok: true; codigo: string; yaExistia: boolean; lectura: Lectura }
  | { ok: false; errores: string[] };

/** Lo que devuelve cada vuelta de afinado. Nunca bloquea: el aporte ya está. */
export type PasoAfinado =
  | {
      ok: true;
      municipios?: Candidato[];
      /** El departamento nombrado, para no volver a preguntarlo. */
      departamento?: Departamento | null;
      /**
       * Lo que se acaba de guardar, devuelto a la pantalla.
       *
       * La pantalla solo conocía lo que había leído la IA, no lo que la persona
       * escribió después. Así, al ofrecerle el contexto para su segundo
       * problema, solo tenía el municipio: lo demás lo había escrito ella y se
       * había ido al servidor sin dejar rastro aquí.
       */
      precisado?: {
        lugar: string | null; afectados: string | null; desdeCuando: string | null;
        resultadoEsperado: string | null; solucionSugerida: string | null;
      };
    }
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
  // Si habló, el aporte apunta a la grabación: **es el original** (ADR 0013).
  const grabacionId = String(datos.get("grabacion") ?? "").trim() || undefined;

  // El contexto del QR (`QR-03`), en columnas separadas: de dónde vino el
  // enlace, en qué evento dice participar, y —más adelante— dónde ocurre el
  // problema. Los tres pueden ser distintos.
  const enlaceId = String(datos.get("enlace") ?? "").trim() || null;
  const eventoConfirmado = String(datos.get("eventoConfirmado") ?? "").trim() || null;
  const estadoContexto = String(datos.get("estadoContexto") ?? "").trim() || null;

  const errores: string[] = [];
  if (!relato) errores.push("Cuéntanos qué está pasando. Es lo único que necesitamos para empezar.");
  if (!clave) errores.push("Algo falló al preparar el envío. Recarga la página e inténtalo de nuevo.");
  if (errores.length) return { ok: false, errores };

  try {
    const r = await recibirAporte({
      procesoId: await procesoVigente(),
      claveEnvio: clave,
      relato,
      canal: grabacionId ? "voz_transcrita" : "web",
      grabacionId,
      enlaceId, eventoConfirmadoId: eventoConfirmado,
      estadoContexto: estadoContexto as never,
      utms: (() => { try { return JSON.parse(String(datos.get("utms") ?? "null")); } catch { return null; } })(),
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
    // El tema viaja con el mismo envío (`CLA-01`). Guardarlo en un `onClick`
    // aparte suspendía el manejador del botón y el formulario no se enviaba.
    // **El error se mira.** No se miraba, y por eso un tema que la base
    // rechazaba —porque la lista del código se amplió y la restricción del
    // esquema no— dejaba el aporte sin tema **en silencio**: la pantalla decía
    // «la lectura propuso Empleo e ingresos» y el campo estaba vacío. Nadie se
    // enteró hasta que alguien miró una ficha.
    //
    // No se lanza: `N02` manda, y el aporte ya está guardado. Se anota, que es
    // lo que faltaba.
    const temaDicho = String(datos.get("tema") ?? "").trim();
    if (temaDicho === "" || esTema(temaDicho)) {
      const { error } = await clienteServidor().schema("participacion").from("aporte")
        .update({ tema: temaDicho || null }).eq("id", aporteId);
      if (error) console.error("confirmarLectura · no se pudo guardar el tema", temaDicho, error);
    } else {
      console.error("confirmarLectura · llegó un tema que no es de la lista", temaDicho);
    }

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
    // También se mira el departamento: si escribió «Cúcuta, Norte de
    // Santander» con una errata en el municipio, el departamento ya está dicho.
    const [municipios, departamento] = lugar
      ? await Promise.all([buscarMunicipios(lugar), departamentoEn(lugar)])
      : [[], null];

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
    return {
      ok: true, municipios, departamento,
      precisado: {
        lugar, afectados: dato("afectados"), desdeCuando: dato("desdeCuando"),
        resultadoEsperado: resultado, solucionSugerida: solucion,
      },
    };
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
export type LecturaPreparada = {
  lectura: Lectura;
  municipios: Candidato[];
  /**
   * El departamento que la persona nombró, si lo nombró.
   *
   * No resuelve nada por sí solo —hace falta el municipio— pero **evita volver
   * a preguntar lo que ya dijo**: si el relato dice «Norte de Santander» y el
   * municipio viene con una errata, el selector arranca con el departamento
   * puesto en vez de en blanco.
   */
  departamento: Departamento | null;
};

export async function prepararLectura(codigo: string): Promise<LecturaPreparada | null> {
  try {
    const c = await canjearComprobante(codigo, await procesoVigente());
    if (!c) return null;

    const lectura = await leerConIA(c.relato, c.lugarDeclarado);

    // Lo que propuso la lectura queda escrito desde ya, aunque la persona lo
    // cambie después: sin el propuesto no se puede medir cuánto se equivoca la
    // máquina, y eso es lo único que dirá si la lista de temas sirve (`Q32`).
    if (lectura.tema) {
      await clienteServidor().schema("participacion").from("aporte")
        .update({ tema_propuesto: lectura.tema }).eq("id", c.aporteId);
    }

    await proponerSintesis({
      aporteId: c.aporteId, autor: "sistema",
      problema: lectura.problema,
      resultadoEsperado: lectura.resultadoEsperado ?? undefined,
      solucionSugerida: lectura.solucionSugerida ?? undefined,
    });
    // Se busca el municipio **en el relato entero**, no solo en el fragmento que
    // el modelo marcó como lugar: alguien puede nombrar su municipio en mitad de
    // una frase que habla de otra cosa.
    const texto = `${c.relato} ${lectura.lugar ?? ""}`;
    const [municipios, departamento] = await Promise.all([
      buscarMunicipios(texto),
      departamentoEn(texto),
    ]);
    return { lectura, municipios, departamento };
  } catch (e) {
    console.error("prepararLectura", e);
    return null;
  }
}

/**
 * Lo que la persona escribe **con sus palabras**, convertido en candidatos.
 *
 * Es lo que permite que la pregunta sea una sola: escribe «la vereda La
 * Martinita, en Rionegro Antioquia» y debajo aparecen el municipio y el
 * departamento, sin cambiar de pantalla. Antes eso solo pasaba si el municipio
 * venía en el relato; quien lo escribía después no recibía ninguna ayuda.
 *
 * **No elige nada** (`I2`): si hay dos Rionegro, salen los dos.
 */
export async function ubicarTexto(
  texto: string,
): Promise<{ municipios: Candidato[]; departamento: Departamento | null }> {
  const dicho = texto.trim();
  if (dicho.length < 4) return { municipios: [], departamento: null };
  try {
    const [municipios, departamento] = await Promise.all([
      buscarMunicipios(dicho), departamentoEn(dicho),
    ]);
    return { municipios, departamento };
  } catch (e) {
    console.error("ubicarTexto", e);
    return { municipios: [], departamento: null };
  }
}

/** Para la caja de búsqueda del paso del municipio. */
export async function buscarMunicipio(texto: string): Promise<Candidato[]> {
  try {
    return await buscarPorNombre(texto);
  } catch (e) {
    console.error("buscarMunicipio", e);
    return [];
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
/**
 * El lugar **con sus palabras**: el barrio, la vereda, la referencia.
 *
 * Va en la misma pantalla que el municipio y no en una vuelta aparte, porque
 * preguntar dos veces dónde ocurre algo —una en texto libre y otra por
 * departamento y municipio— es preguntar lo mismo dos veces. Para quien vive en
 * una vereda dispersa, la segunda pregunta no agrega nada y sí da motivos para
 * cerrar la página.
 *
 * Se guarda **tal como lo escribió**. Es lo que exige `I2`, y es lo único que
 * mantiene reversible haber aplazado el barrio (`Q26`): si alguien decide
 * mañana que el barrio importa, el texto está ahí.
 *
 * **Solo llena lo que estaba vacío** (`precisarAporte`): quien vuelve a pasar
 * por aquí no pisa lo que ya había declarado.
 */
export async function anotarLugar(codigo: string, texto: string): Promise<PasoAfinado> {
  const dicho = texto.trim();
  if (!dicho) return { ok: true };
  try {
    const aporteId = await aporteDelCodigo(codigo);
    if (!aporteId) return { ok: false, error: "No encontramos ese aporte." };
    await precisarAporte({ aporteId, lugarDeclarado: dicho });
    return { ok: true };
  } catch (e) {
    console.error("anotarLugar", e);
    return { ok: false, error: "No pudimos guardar el lugar. Tu aporte ya quedó registrado." };
  }
}

export async function confirmarMunicipio(
  codigo: string, territorio: string, version: string,
  origen: "lo_dijo" | "vive_ahi" = "lo_dijo",
  /**
   * La persona ya había confirmado uno y volvió atrás a cambiarlo.
   *
   * Sin esto, volver atrás dejaba **los dos municipios confirmados** y el aporte
   * se sumaba en dos territorios. Corregir no es agregar.
   */
  corrige = false,
): Promise<PasoAfinado> {
  try {
    const aporteId = await aporteDelCodigo(codigo);
    if (!aporteId) return { ok: false, error: "No encontramos ese aporte." };
    if (corrige) {
      await corregirUbicacionDelCiudadano({
        aporteId, codigo: territorio, version,
        motivo: "la persona volvió atrás y corrigió el municipio durante la captura",
      });
      return { ok: true };
    }
    await resolverUbicacion({
      aporteId, codigo: territorio, version,
      autor: "ciudadano",
      // El motivo distingue las dos rutas, y no es un detalle: `GEO-01` dice que
      // **una dirección residencial no es el lugar del problema sin
      // confirmación**. Cuando el municipio sale de dónde vive, se le preguntó
      // aparte si el problema ocurre ahí, y eso queda escrito para que un
      // revisor pueda pesarlo distinto.
      motivo: origen === "vive_ahi"
        ? "la persona vive en ese municipio y confirmó que el problema ocurre ahí"
        : "la persona lo confirmó al contar su aporte",
    });
    return { ok: true };
  } catch (e) {
    console.error("confirmarMunicipio", e);
    return { ok: false, error: "No pudimos guardar el municipio. Tu aporte ya quedó registrado." };
  }
}


/** Los 33 departamentos, para escoger de lo macro a lo micro. */
export async function listarDepartamentos(): Promise<Departamento[]> {
  try { return await departamentos(); } catch (e) { console.error("listarDepartamentos", e); return []; }
}

/** Los municipios de un departamento. Dentro de uno no hay nombres repetidos. */
export async function listarMunicipios(departamento: string): Promise<Candidato[]> {
  try { return await municipiosDe(departamento); } catch (e) { console.error("listarMunicipios", e); return []; }
}

/**
 * La persona dice que habla por un grupo.
 *
 * Se guarda **el nombre del grupo**, no el suyo: el aporte es del colectivo y no
 * del vocero (`V19`), así que si mañana cambia quién lo representa, el aporte no
 * se mueve.
 */
export async function declararGrupo(codigo: string, colectivo: string): Promise<PasoAfinado> {
  try {
    const aporteId = await aporteDelCodigo(codigo);
    if (!aporteId) return { ok: false, error: "No encontramos ese aporte." };
    await declararVoceria({ aporteId, colectivo });
    return { ok: true };
  } catch (e) {
    console.error("declararGrupo", e);
    return { ok: false, error: "No pudimos guardarlo. Tu aporte ya quedó registrado." };
  }
}


/**
 * Aplica al aporte nuevo lo que la persona confirmó que vale también aquí.
 *
 * **Confirmado, no heredado.** Se llama solo después de que ella diga que sí:
 * dar por hecho que el segundo problema ocurre donde el primero es la
 * inferencia que `I2` prohíbe, y el motivo que queda escrito en la ubicación lo
 * dice para que un revisor sepa de dónde salió.
 */
export async function aplicarContexto(codigo: string, c: ContextoHeredado): Promise<PasoAfinado> {
  try {
    const aporteId = await aporteDelCodigo(codigo);
    if (!aporteId) return { ok: false, error: "No encontramos ese aporte." };

    await precisarAporte({
      aporteId,
      lugarDeclarado: c.lugarDeclarado,
      afectados: c.afectados,
      desdeCuando: c.desdeCuando,
    });
    if (c.municipio) {
      await resolverUbicacion({
        aporteId, codigo: c.municipio.codigo, version: c.municipio.version,
        autor: "ciudadano",
        motivo: "la persona confirmó que ocurre en el mismo municipio que su aporte anterior",
      });
    }
    if (c.colectivo) await declararVoceria({ aporteId, colectivo: c.colectivo });
    return { ok: true };
  } catch (e) {
    console.error("aplicarContexto", e);
    return { ok: false, error: "No pudimos guardarlo. Tu aporte ya quedó registrado." };
  }
}


/**
 * Recibe la grabación y devuelve lo que se oyó, para que la persona lo revise.
 *
 * **El audio queda guardado aquí, antes de cualquier otra cosa.** Es el
 * original: si la transcripción sale mal —y sale mal: «La Martinita» volvió
 * como «La Martinica»— hay con qué volver atrás y transcribirlo otra vez.
 *
 * El aporte todavía no existe. Se crea cuando la persona continúe.
 */
export async function subirGrabacion(
  _previo: unknown, datos: FormData,
): Promise<{ ok: true; grabacionId: string; texto: string | null } | { ok: false; error: string }> {
  const archivo = datos.get("audio");
  if (!(archivo instanceof File) || archivo.size === 0) {
    return { ok: false, error: "No llegó la grabación. Inténtalo otra vez." };
  }
  const segundos = Number(datos.get("segundos") ?? 0) || undefined;

  try {
    const g = await guardarGrabacion({
      procesoId: await procesoVigente(),
      audio: new Uint8Array(await archivo.arrayBuffer()),
      tipoMime: archivo.type || "audio/webm",
      segundos,
    });
    return { ok: true, grabacionId: g.grabacionId, texto: g.transcripcion };
  } catch (e) {
    console.error("subirGrabacion", e);
    return { ok: false, error: "No pudimos guardar la grabación. Puedes escribirlo mientras tanto." };
  }
}


