import { clienteServidor } from "../datos/cliente.ts";

/**
 * Desde dónde nos contacta la persona.
 *
 * **No es dónde ocurre el problema, y confundirlos es el error que `GEO-01` ya
 * tiene nombrado** para la residencia: *«una dirección residencial no se usa
 * como lugar del problema sin confirmación»*. Quien escribe desde Madrid sobre
 * la vía de su vereda en Caldas está diciendo dos cosas distintas, y el
 * municipio afectado sigue siendo el de Caldas.
 *
 * Por eso esto **no toca `participacion.ubicacion`**: ahí vive dónde ocurre, un
 * aporte puede tener varias y es lo que cuentan `R1` y `R2`. Escribir el
 * contacto ahí sumaría a esta persona en un territorio donde no pasa nada —el
 * numerador que `R2` existe para proteger—.
 *
 * ## Dos ámbitos y un solo catálogo
 *
 *   nacional       un municipio de DIVIPOLA, el mismo selector de siempre
 *   internacional  un país de ISO 3166-1, `nivel = 'pais'` en la misma tabla
 *
 * La versión viaja con el código (`Q5`) y son distintas: la de DIVIPOLA es
 * 'junio 2026' y la de los países, la del CLDR con que se escribieron los
 * nombres.
 *
 * **Que el código cuadre con el ámbito lo impide la base, no esto** (`AGENTS.md`
 * §8): la restricción `el_contacto_cuadra_con_el_ambito` rechaza
 * «internacional · 05001», y la clave foránea rechaza un código que no exista en
 * esa versión. Repetir aquí esas dos comprobaciones sería tener la misma regla
 * en dos niveles, que es justo lo que §8 prohíbe — el día que una cambie, la
 * otra se queda y nadie sabe cuál se estaba aplicando.
 *
 * Y **no contestar es una respuesta** (`N02`): quien prefiere no decirlo no pasa
 * por aquí y las tres columnas se quedan vacías, que es distinto de un
 * «desconocido» inventado (`I2`).
 */
export async function declararDesdeDonde(e: {
  aporteId: string;
  ambito: "nacional" | "internacional";
  /** Municipio de 5 dígitos si es nacional; país de 2 letras si es internacional. */
  codigo: string;
  /** La del catálogo de donde salió el código. No es la misma en los dos. */
  version: string;
}): Promise<void> {
  const codigo = e.codigo.trim();
  const version = e.version.trim();
  if (!codigo || !version) {
    throw new Error("decir desde dónde nos contacta exige el código y su versión de catálogo");
  }

  const p = clienteServidor().schema("participacion");
  const { error } = await p.from("aporte")
    .update({ contacto_ambito: e.ambito, contacto_codigo: codigo, contacto_version: version })
    .eq("id", e.aporteId);
  if (error) throw new Error(`no se pudo guardar desde dónde nos contacta: ${error.message}`);
}
