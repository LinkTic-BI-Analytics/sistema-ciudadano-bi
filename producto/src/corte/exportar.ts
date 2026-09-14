import { clienteServidor } from "../datos/cliente.ts";

export type EntradaDiccionario = { definicion: string; advertencia: string };

export type Exportacion = {
  procedencia: {
    corteId: string;
    tomadoEn: string;
    zonaHoraria: string;
    catalogoVersion: string;
    filtroDesde: string | null;
    filtroHasta: string | null;
  };
  indicadores: Record<string, number | null>;
  diccionario: Record<string, EntradaDiccionario>;
  universo: string[];
};

/**
 * El diccionario de datos, **textual de la §7 del paquete**.
 *
 * Cada indicador viene con su advertencia obligatoria, y no es adorno: son las
 * frases que impiden que otro equipo construya un tablero correcto sobre una
 * lectura equivocada. *«No son personas ni votos»* es la diferencia entre un
 * dato y una afirmación sobre el país.
 *
 * Van copiadas, no parafraseadas. Una advertencia reescrita es una advertencia
 * distinta.
 */
export const DICCIONARIO: Record<string, EntradaDiccionario> = {
  aportes_recibidos: {
    definicion: "IDs distintos recibidos en el periodo y universo filtrado, excluyendo solo reintentos técnicos del mismo envío.",
    advertencia: "No son personas ni votos.",
  },
  aportes_ubicados: {
    definicion: "Aportes con al menos un vínculo municipal aceptado, contados una sola vez.",
    advertencia: "Múltiples municipios no multiplican el numerador.",
  },
  aportes_pendientes: {
    definicion: "Aportes del universo sin ubicación municipal resuelta.",
    advertencia: "No desaparecen del total: cuentan en aportes recibidos y en pendientes.",
  },
  ubicacion_resuelta: {
    definicion: "Aportes con al menos un vínculo municipal aceptado / aportes del universo × 100.",
    advertencia: "Mostrar denominador y casos pendientes; múltiples municipios no multiplican el numerador.",
  },
  municipios_con_aportes: {
    definicion: "Municipios distintos con al menos un aporte ubicado en el universo.",
    advertencia: "No mide representación de sus habitantes. Sin alcance territorial definido, no calcular porcentaje de cobertura.",
  },
  necesidades: {
    definicion: "IDs distintos de expedientes vinculados a aportes del universo.",
    advertencia: "La agrupación es revisable; mostrar fecha del corte. Una necesidad en varios municipios cuenta una vez.",
  },
};

/**
 * Exporta un corte.
 *
 * **No vuelve a consultar nada.** Lee lo que el corte congeló: sus indicadores y
 * su universo de IDs. Es lo que hace cierta la frase de `TRA-01` —*«otro
 * analista reproduce el total a partir del mismo corte y regla»*— y lo que
 * impide que `I6` se rompa: *«ni ofrecer mapas y exportaciones con universos
 * contradictorios»*.
 *
 * Si esto recalculara, dos exportaciones del mismo corte podrían diferir, y
 * entonces el corte dejaría de ser una foto.
 *
 * **Y no lleva relatos, contactos ni códigos de comprobante.** `SEG-01`: *«sin
 * exponer identidad innecesaria»*. Un corte lleva conteos y códigos
 * territoriales; el relato de una persona en un municipio pequeño la identifica.
 */
export async function exportarCorte(corteId: string): Promise<Exportacion> {
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.from("corte")
    .select("id, tomado_en, zona_horaria, catalogo_version, filtro_desde, filtro_hasta, indicadores, universo")
    .eq("id", corteId).single();
  if (error || !data) throw new Error(`no existe el corte ${corteId}: ${error?.message}`);

  // Solo los indicadores que el diccionario documenta. Un número sin definición
  // ni advertencia es un número que alguien va a interpretar como quiera.
  const indicadores: Record<string, number | null> = {};
  for (const clave of Object.keys(DICCIONARIO)) {
    indicadores[clave] = (data.indicadores as any)[clave] ?? null;
  }

  return {
    procedencia: {
      corteId: data.id,
      tomadoEn: data.tomado_en,
      zonaHoraria: data.zona_horaria,
      catalogoVersion: data.catalogo_version,
      filtroDesde: data.filtro_desde,
      filtroHasta: data.filtro_hasta,
    },
    indicadores,
    diccionario: DICCIONARIO,
    universo: (data.universo ?? []) as string[],
  };
}
