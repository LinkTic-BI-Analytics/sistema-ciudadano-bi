import { clienteServidor } from "../datos/cliente.ts";

/**
 * Cuántos más hay como este (`CLA-03`).
 *
 * **Se calcula, nunca se declara.** Sale del grafo, como toda la telemetría de
 * este proyecto (`interfaz.md` I2): nadie lo teclea y nadie lo puede ajustar.
 *
 * Y dice su denominador: es **cuántos aportes**, no cuánta gente. Dos aportes
 * pueden ser de la misma persona, y veinte vecinos de un barrio pueden no haber
 * contado ninguno. Presentarlo como población es justo lo que `BI-02` prohíbe.
 *
 * **No ordena nada.** Un caso único no se va al final de la fila por ser único:
 * ordenar por recurrencia sería la puntuación que `PRI-01` no tiene.
 */
export type Recurrencia = {
  /** Otros aportes del mismo tema en el mismo municipio. Sin contar este. */
  otros: number;
  tema: string | null;
  municipio: string | null;
};

export async function recurrenciaDe(aporteId: string): Promise<Recurrencia> {
  const p = clienteServidor().schema("participacion");

  const { data: a } = await p.from("aporte")
    .select("proceso_id, tema").eq("id", aporteId).maybeSingle();
  if (!a?.tema) return { otros: 0, tema: null, municipio: null };

  // El municipio aceptado, no el declarado: comparar textos libres juntaría
  // «la parte alta» de dos municipios distintos.
  const { data: u } = await p.from("ubicacion")
    .select("territorio_codigo, territorio_version")
    .eq("aporte_id", aporteId).eq("estado", "confirmada").maybeSingle();
  if (!u?.territorio_codigo) return { otros: 0, tema: a.tema, municipio: null };

  const { data: vecinos } = await p.from("ubicacion")
    .select("aporte_id")
    .eq("proceso_id", a.proceso_id).eq("estado", "confirmada")
    .eq("territorio_codigo", u.territorio_codigo);

  const ids = (vecinos ?? []).map((v) => v.aporte_id as string).filter((id) => id !== aporteId);
  if (!ids.length) return { otros: 0, tema: a.tema, municipio: u.territorio_codigo };

  const { count } = await p.from("aporte")
    .select("id", { count: "exact", head: true })
    .in("id", ids).eq("tema", a.tema).is("retirado_en", null);

  return { otros: count ?? 0, tema: a.tema, municipio: u.territorio_codigo };
}
