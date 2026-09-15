import { clienteServidor } from "../datos/cliente.ts";

/**
 * La bandeja de revisión (`backoffice-especificacion.md` · «Bandeja de aportes»).
 *
 * Hasta ahora mostraba **solo los que tenían la ubicación por aclarar**, y con
 * tres datos: relato, lugar y fecha. Se diseñó cuando el formulario capturaba
 * tres cosas. Hoy captura diez, y el revisor seguía sin poder distinguir un
 * aporte de otro — ni ver los que ya estaban ubicados.
 *
 * Lo que trae ahora es lo que la especificación pide —aporte, territorio,
 * estado, responsable— más **las señales que cambian cómo se revisa**:
 *
 *   · llegó **por voz**: la transcripción puede estar mal, y hay audio que oír;
 *   · **habla por un grupo**: hay a quién responderle, y nadie lo verificó;
 *   · tiene **alerta de urgencia**: se mira antes que lo demás;
 *   · **qué le falta**: sin municipio, sin a quiénes, sin desde cuándo.
 *
 * Lo que **no** trae, y es deliberado: ninguna puntuación. El orden es de la
 * más antigua a la más reciente, y se conserva al filtrar. `BI-02` prohíbe
 * ordenar por popularidad, y una columna de puntaje es una puntuación aunque se
 * llame de otra forma.
 */

export type Señal = "voz" | "grupo" | "urgencia" | "evento";

export type FilaBandeja = {
  aporteId: string;
  relato: string;
  recibidoEn: string;
  /** El municipio aceptado, o `null` si nadie lo ha resuelto todavía. */
  territorio: string | null;
  lugarDeclarado: string | null;
  estadoUbicacion: string;
  estadoRevision: string;
  /** Quién lo tiene. `null` es «nadie», y es una respuesta, no un hueco. */
  responsable: string | null;
  señales: Señal[];
  /** Lo que la persona no dijo y el revisor va a echar en falta. */
  falta: string[];
};

export type Filtro = {
  /** Busca en relato, lugar y territorio. Sin tildes ni mayúsculas. */
  texto?: string;
  /** `por_aclarar` · `ubicados` · `todos`. */
  ubicacion?: "por_aclarar" | "ubicados" | "todos";
};

/**
 * La fila tal como llega de la base.
 *
 * Se escribe a mano porque el cliente no infiere tipos de un `select` con
 * muchas columnas, y dejarlo en `any` es cómo se cuela una columna mal escrita
 * que no falla hasta que alguien mira la pantalla.
 */
type FilaAporte = {
  id: string; relato_original: string; lugar_declarado: string | null;
  afectados: string | null; desde_cuando: string | null; canal: string;
  recibido_en: string; estado_revision: string;
  es_colectivo: boolean; colectivo_declarado: string | null;
  evento_confirmado_id: string | null;
};

const plano = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export async function bandeja(
  procesoId: string, filtro: Filtro = {}, limite = 50,
): Promise<FilaBandeja[]> {
  const p = clienteServidor().schema("participacion");

  const { data: aportes, error } = await p.from("aporte")
    .select("id, relato_original, lugar_declarado, afectados, desde_cuando, canal, " +
            "recibido_en, estado_revision, es_colectivo, colectivo_declarado, evento_confirmado_id")
    .eq("proceso_id", procesoId).is("retirado_en", null)
    .order("recibido_en", { ascending: true })
    .limit(300);
  if (error) throw new Error(`no se pudo leer la bandeja: ${error.message}`);
  const filasCrudas = (aportes ?? []) as unknown as FilaAporte[];
  if (!filasCrudas.length) return [];

  const ids = filasCrudas.map((a) => a.id);

  // Las tres consultas de al lado se hacen aparte y no con un `select` anidado:
  // los anidados de PostgREST recortan a 1.000 filas sin avisar, y ya perdimos
  // 122 municipios por eso una vez.
  const [{ data: ubicaciones }, { data: alertas }, { data: territorios }] = await Promise.all([
    p.from("ubicacion").select("aporte_id, estado, territorio_codigo, autor").in("aporte_id", ids),
    p.from("alerta").select("aporte_id, devuelta_en").in("aporte_id", ids),
    p.from("territorio").select("codigo, nombre, padre").eq("nivel", "municipio"),
  ]);

  const nombreMunicipio = new Map((territorios ?? []).map((t) => [t.codigo as string, t.nombre as string]));
  const porAporte = new Map<string, { estado: string; codigo: string | null; autor: string | null }>();
  for (const u of ubicaciones ?? []) {
    const actual = porAporte.get(u.aporte_id);
    // Si hay una confirmada, manda: es la que resolvió alguien.
    if (!actual || u.estado === "confirmada") {
      porAporte.set(u.aporte_id, { estado: u.estado, codigo: u.territorio_codigo, autor: u.autor });
    }
  }
  const conAlerta = new Set((alertas ?? []).filter((a) => !a.devuelta_en).map((a) => a.aporte_id));

  const filas: FilaBandeja[] = filasCrudas.map((a) => {
    const u = porAporte.get(a.id);
    const señales: Señal[] = [];
    if (a.canal === "voz_transcrita") señales.push("voz");
    if (a.es_colectivo) señales.push("grupo");
    if (conAlerta.has(a.id)) señales.push("urgencia");
    if (a.evento_confirmado_id) señales.push("evento");

    // Lo que falta se nombra en palabras, no con códigos: el revisor tiene que
    // saber qué preguntar, no qué columna está vacía.
    const falta: string[] = [];
    if (u?.estado !== "confirmada") falta.push("municipio");
    if (!a.afectados) falta.push("a quiénes");
    if (!a.desde_cuando) falta.push("desde cuándo");

    return {
      aporteId: a.id,
      relato: a.relato_original,
      recibidoEn: a.recibido_en,
      territorio: u?.codigo ? nombreMunicipio.get(u.codigo) ?? u.codigo : null,
      lugarDeclarado: a.lugar_declarado,
      estadoUbicacion: u?.estado ?? "sin_ubicacion",
      estadoRevision: a.estado_revision,
      responsable: u?.autor ?? null,
      señales, falta,
    };
  });

  const texto = filtro.texto?.trim() ? plano(filtro.texto.trim()) : null;
  return filas
    .filter((f) => {
      if (filtro.ubicacion === "por_aclarar" && f.estadoUbicacion === "confirmada") return false;
      if (filtro.ubicacion === "ubicados" && f.estadoUbicacion !== "confirmada") return false;
      if (!texto) return true;
      // Relato, lugar y territorio, sin tildes ni mayúsculas, como pide la
      // especificación del backoffice.
      return plano(`${f.relato} ${f.lugarDeclarado ?? ""} ${f.territorio ?? ""}`).includes(texto);
    })
    .slice(0, limite);
}
