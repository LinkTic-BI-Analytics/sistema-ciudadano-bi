/**
 * Leer de la base sin que se pierdan filas por el camino.
 *
 * Dos cosas cortan una consulta a PostgREST **sin que nada falle de forma
 * visible**, y las dos ya nos mordieron:
 *
 * 1. **El tope de 1.000 filas por respuesta.** Devuelve 1.000 con un `200` como
 *    si fueran todas. Así desaparecieron 122 municipios del buscador
 *    (`territorio/emparejar.ts` lo cuenta con nombres).
 * 2. **La longitud de la URL.** Un `.in("aporte_id", ids)` con 788 códigos
 *    arma una dirección de ~30 KB y la puerta de entrada la rechaza. Con 788
 *    aportes en la base, las consultas de ubicación, síntesis y vínculos
 *    devolvían `400` — y como el error se descartaba, la bandeja salía como si
 *    ningún aporte tuviera municipio: los desplegables de departamento y
 *    municipio quedaban con «Todos» y nada más.
 *
 * Por eso las dos funciones de aquí **lanzan cuando hay error**. Descartarlo es
 * lo que convirtió una consulta rota en una pantalla que mentía en silencio.
 */

/** Lo que devuelve una consulta de supabase-js, sin atarse a sus genéricos. */
export type Respuesta<T> = { data: T[] | null; error: { message: string } | null };

/** El tope de PostgREST. Si la página llega llena, puede haber más detrás. */
const PAGINA = 1000;

/**
 * Cuántos códigos caben en un `.in(...)`.
 *
 * Medido contra esta base: 300 pasan, 500 ya no. 100 deja margen de sobra y el
 * costo son ocho peticiones para 788 aportes — que en un instrumento que se
 * construye para descubrir no es un problema, y una fila perdida sí.
 */
const LOTE = 100;

/**
 * Todas las filas de una consulta, pidiéndolas por páginas.
 *
 * `que` es para el mensaje de error: «no se pudo leer la bandeja» dice dónde
 * mirar, «error» no.
 */
export async function todas<T>(
  que: string,
  consulta: (desde: number, hasta: number) => PromiseLike<Respuesta<T>>,
): Promise<T[]> {
  const filas: T[] = [];
  for (let desde = 0; ; desde += PAGINA) {
    const { data, error } = await consulta(desde, desde + PAGINA - 1);
    if (error) throw new Error(`no se pudo leer ${que}: ${error.message}`);
    const trozo = data ?? [];
    filas.push(...trozo);
    if (trozo.length < PAGINA) return filas;
  }
}

/**
 * Todas las filas de una consulta que filtra por una lista de códigos,
 * partiendo la lista en lotes que quepan en la URL.
 *
 * Cada lote se lee además por páginas: un aporte puede tener varias síntesis, y
 * 100 aportes pueden pasar de 1.000 filas.
 *
 * Los lotes van a la vez. En fila india, las cuatro consultas de la bandeja con
 * 788 aportes tardaban seis segundos en pantalla; a la vez, uno. Los lotes no
 * dependen unos de otros, así que esperarlos por turnos no compraba nada.
 */
export async function porLotes<T>(
  que: string,
  ids: string[],
  consulta: (lote: string[], desde: number, hasta: number) => PromiseLike<Respuesta<T>>,
): Promise<T[]> {
  const lotes: string[][] = [];
  for (let i = 0; i < ids.length; i += LOTE) lotes.push(ids.slice(i, i + LOTE));
  const trozos = await Promise.all(
    lotes.map((lote) => todas(que, (desde, hasta) => consulta(lote, desde, hasta))),
  );
  return trozos.flat();
}
