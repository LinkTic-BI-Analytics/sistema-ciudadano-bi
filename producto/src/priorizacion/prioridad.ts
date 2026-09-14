import { clienteServidor } from "../datos/cliente.ts";
import type { FilaPrioridad } from "../datos/filas.ts";

export type Nivel = "alta" | "media" | "baja";

export type Prioridad = {
  id: string;
  autor: string;
  motivo: string;
  registradaEn: string;
  urgenciaReportada: string | null;
  afectacion: string | null;
  recurrencia: string | null;
  competencia: string | null;
  incertidumbre: string | null;
  vigenteHasta: string | null;
};

/**
 * Registra qué examinar primero y **por qué**.
 *
 * `PRI-01`: *«ordenaciones y filtros son ayudas; el acto de priorizar tiene
 * responsable»*. Por eso el motivo es obligatorio y el autor también — una
 * prioridad sin razón es una ordenación disfrazada de decisión.
 *
 * **Los cinco factores van por separado y todos son opcionales.** Registrar lo
 * que se sabe, no rellenar lo que no: dejar uno en nulo dice «no se estableció»,
 * que es información. Ponerle un valor por defecto sería inventarlo.
 *
 * Y no hay puntaje. No existe una función en este módulo que combine los cinco
 * en un número, y no es un olvido: los pesos no están acordados, y una fórmula
 * inventada decide a quién se atiende primero con una cuenta que nadie autorizó.
 */
export async function registrarPrioridad(e: {
  expedienteId: string;
  autor: string;
  motivo: string;
  urgenciaReportada?: Nivel | "sin_declarar";
  afectacion?: Nivel | "sin_establecer";
  recurrencia?: Nivel | "unica";
  competencia?: "clara" | "en_disputa" | "sin_establecer";
  incertidumbre?: string;
}): Promise<{ prioridadId: string }> {
  if (!e.motivo?.trim()) {
    throw new Error("priorizar exige motivo: sin razón es una ordenación, no una decisión (PRI-01)");
  }
  const p = clienteServidor().schema("participacion");
  const { data: exp } = await p.from("expediente")
    .select("proceso_id").eq("id", e.expedienteId).single();
  if (!exp) throw new Error(`no existe el expediente ${e.expedienteId}`);

  // La anterior deja de estar vigente, pero **se queda**. Una revisión posterior
  // conserva historia (`RF12`), y el día que alguien pregunte por qué cambió la
  // prioridad hay que poder mostrarlo.
  await p.from("prioridad_examen").update({
    vigente_hasta: new Date().toISOString(),
    no_vigente_motivo: "reemplazada por una prioridad posterior",
  }).eq("expediente_id", e.expedienteId).is("vigente_hasta", null);

  const { data, error } = await p.from("prioridad_examen").insert({
    proceso_id: exp.proceso_id,
    expediente_id: e.expedienteId,
    autor: e.autor,
    motivo: e.motivo,
    urgencia_reportada: e.urgenciaReportada ?? null,
    afectacion: e.afectacion ?? null,
    recurrencia: e.recurrencia ?? null,
    competencia: e.competencia ?? null,
    incertidumbre: e.incertidumbre ?? null,
  }).select("id").single();
  if (error || !data) throw new Error(`no se pudo registrar la prioridad: ${error?.message}`);

  await p.from("auditoria").insert({
    proceso_id: exp.proceso_id, actor: e.autor, accion: "priorizar",
    entidad: "expediente", entidad_id: e.expedienteId, motivo: e.motivo,
  });

  return { prioridadId: data.id };
}

/** La prioridad vigente, o nada. Nada significa que aún no se ha priorizado. */
export async function prioridadVigente(expedienteId: string): Promise<Prioridad | null> {
  const p = clienteServidor().schema("participacion");
  const { data } = await p.from("prioridad_examen").select("*")
    .eq("expediente_id", expedienteId).is("vigente_hasta", null)
    .order("registrada_en", { ascending: false }).limit(1);
  return data?.[0] ? mapear(data[0] as FilaPrioridad) : null;
}

/** Toda la historia, en orden. Nunca recortada. */
export async function historiaDePrioridad(expedienteId: string): Promise<Prioridad[]> {
  const p = clienteServidor().schema("participacion");
  const { data } = await p.from("prioridad_examen").select("*")
    .eq("expediente_id", expedienteId).order("registrada_en", { ascending: true });
  return ((data ?? []) as FilaPrioridad[]).map(mapear);
}

/**
 * Deja la prioridad no vigente porque el expediente se reabrió.
 *
 * `NEC-01`: desagrupar *«reabre examen de prioridad y respuestas sin heredar
 * aprobación»*. **No se borra: se señala.** Borrarla perdería la razón por la que
 * se había priorizado así.
 */
export async function invalidarPorReapertura(expedienteId: string, motivo: string): Promise<void> {
  const p = clienteServidor().schema("participacion");
  await p.from("prioridad_examen").update({
    vigente_hasta: new Date().toISOString(),
    no_vigente_motivo: `el expediente se reabrió: ${motivo}`,
  }).eq("expediente_id", expedienteId).is("vigente_hasta", null);
}

function mapear(r: FilaPrioridad): Prioridad {
  return {
    id: r.id, autor: r.autor, motivo: r.motivo, registradaEn: r.registrada_en,
    urgenciaReportada: r.urgencia_reportada, afectacion: r.afectacion,
    recurrencia: r.recurrencia, competencia: r.competencia,
    incertidumbre: r.incertidumbre, vigenteHasta: r.vigente_hasta,
  };
}
