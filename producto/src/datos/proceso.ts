import { clienteServidor } from "./cliente.ts";

/**
 * El proceso vigente.
 *
 * Hoy hay uno sembrado y esto lo busca. **Cuando exista la convocatoria (M06),
 * el proceso saldrá de ella** — el aporte ya lleva su columna `convocatoria`
 * esperando eso.
 *
 * Está aquí y no repetido en cada pantalla porque el día que cambie, cambia en
 * un sitio.
 */
export async function procesoVigente(): Promise<string> {
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.from("proceso")
    .select("id").is("retirado_en", null).order("creado_en").limit(1).single();
  if (error || !data) {
    throw new Error("no hay ningún proceso vigente: corre ./scripts/sembrar.sh");
  }
  return data.id;
}
