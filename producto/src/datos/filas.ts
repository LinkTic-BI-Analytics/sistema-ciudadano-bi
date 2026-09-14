/**
 * Las formas de fila que devuelve la base.
 *
 * Existen porque `any` en una función de mapeo es **exactamente donde un cambio
 * de columna pasa desapercibido**: se renombra `motivo` a `razon`, el mapeo
 * devuelve `undefined`, y la pantalla muestra un hueco sin que nada falle.
 *
 * No pretenden ser el esquema completo: son lo que cada consulta pide.
 */

export type FilaSintesis = {
  version: number; texto: string; clase: string; autor: string;
  motivo: string | null; creada_en: string; confirmada_en: string | null;
};

export type FilaActuacion = {
  id: string; tipo: string; autor: string; ocurrida_en: string;
  motivo: string | null; destino: string | null;
  aceptada_en: string | null; siguiente_paso: string | null;
};

export type FilaEstadoAtencion = {
  estado: string; ultima_actuacion: string | null;
  dias_sin_actuar: string | number; remision_pendiente: boolean;
};

export type FilaVinculo = {
  aporte_id: string; expediente_id: string;
  motivo: string; autor: string; creado_en: string;
};

export type FilaPrioridad = {
  id: string; autor: string; motivo: string; registrada_en: string;
  urgencia_reportada: string | null; afectacion: string | null;
  recurrencia: string | null; competencia: string | null;
  incertidumbre: string | null; vigente_hasta: string | null;
};

export type FilaCorte = {
  id: string; tomado_en: string; zona_horaria: string; catalogo_version: string;
  filtro_desde: string | null; filtro_hasta: string | null;
  indicadores: Record<string, number | null>; universo: string[];
};

/** La bandeja: una ubicación con el aporte que cuelga de ella. */
export type FilaPendiente = {
  aporte_id: string;
  aporte: {
    relato_original: string;
    lugar_declarado: string | null;
    recibido_en: string;
    retirado_en: string | null;
  } | null;
};
