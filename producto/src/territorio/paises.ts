import { clienteServidor } from "../datos/cliente.ts";

/**
 * Los países, para la pregunta «¿desde dónde nos contactas?».
 *
 * **Solo para esa pregunta.** Dónde ocurre un problema que este sistema pueda
 * atender es siempre un municipio colombiano —eso lo dice DIVIPOLA y vive en
 * `participacion.ubicacion`—. Lo que esto responde es otra cosa: dónde está la
 * persona que escribe, que puede estar en Neiva o en Madrid y en los dos casos
 * está contando lo que le pasa a su vereda.
 *
 * Vienen de la misma tabla que DIVIPOLA, con `nivel = 'pais'` y **su propia
 * versión de catálogo** (`Q5`): los nombres de los países cambian —«Swazilandia»
 * es «Esuatini» desde 2018— y lo que se guarda en el aporte tiene que poder
 * volver a leerse dentro de un año.
 */

export type Pais = { codigo: string; version: string; nombre: string };

let cache: Pais[] | null = null;

/**
 * Los 249 de ISO 3166-1, en orden alfabético español.
 *
 * **En una sola página, y eso no es casualidad.** PostgREST corta en 1.000 filas
 * sin avisar, y esa es la trampa que dejó 122 municipios fuera del buscador
 * durante semanas (`emparejar.ts`). Aquí no llega: son 249. La prueba que
 * cuenta está igual, porque «hoy caben» no es una garantía.
 */
export async function paises(): Promise<Pais[]> {
  if (cache) return cache;
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.from("territorio")
    .select("codigo, version, nombre").eq("nivel", "pais").order("nombre");
  if (error) throw new Error(`no se pudieron leer los países: ${error.message}`);

  // El orden alfabético lo pone Postgres con su propia intercalación, y
  // «Alemania» y «Álava» no se ordenan igual en todas. Se reordena aquí con la
  // del español para que la lista se vea igual venga de donde venga.
  cache = ((data ?? []) as Pais[]).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  return cache;
}

/** ¿Existe ese país en esa versión? Lo que se guarda pasa por aquí. */
export async function esPais(codigo: string): Promise<Pais | null> {
  return (await paises()).find((p) => p.codigo === codigo) ?? null;
}
