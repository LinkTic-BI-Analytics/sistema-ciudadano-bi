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

  // **Los recorridos escriben en su propio proceso.** Compartían este con quien
  // estuviera probando a mano, y la limpieza de la suite —que corre al arrancar
  // y al terminar— se llevaba por delante lo que esa persona había capturado.
  // Pasó dos veces con datos de verdad.
  //
  // Va por variable de entorno y no por una bandera en el código porque es una
  // propiedad del **servidor que está corriendo**, no del build: el de la suite
  // arranca con ella puesta, el de desarrollo no.
  const nombre = process.env.PROCESO_VIGENTE?.trim();
  if (nombre) {
    const { data: suyo } = await p.from("proceso")
      .select("id").eq("nombre", nombre).is("retirado_en", null)
      .order("creado_en", { ascending: false }).limit(1).maybeSingle();
    if (suyo) return suyo.id;
    throw new Error(
      `PROCESO_VIGENTE dice «${nombre}» y no hay ninguno activo con ese nombre. ` +
      "Lo siembra scripts/recorridos-base.sh preparar",
    );
  }

  const { data, error } = await p.from("proceso")
    .select("id").is("retirado_en", null).order("creado_en").limit(1).single();
  if (error || !data) {
    throw new Error("no hay ningún proceso vigente: corre ./scripts/sembrar.sh");
  }
  return data.id;
}
