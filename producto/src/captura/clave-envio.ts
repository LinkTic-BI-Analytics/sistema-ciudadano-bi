// La clave de envío: lo que hace que `I1` se cumpla de verdad.
//
// **La genera el navegador, no el servidor**, y esa es toda la idea. Si la
// generara el servidor, cada reintento traería una distinta y habría dos
// aportes — que es exactamente lo que `I1` prohíbe.
//
// Se crea una vez, al abrir el formulario, y se reusa en cada reintento del
// mismo envío. Cuando el aporte queda recibido, se descarta: el siguiente relato
// es otro aporte, aunque lo escriba la misma persona en el mismo equipo.
//
// `DAT-01` es explícito sobre lo que NO se puede usar en su lugar: *«similitud
// textual no basta para borrar aportes»*. Ni la IP: un centro comunitario
// comparte dispositivo, y `N17` dice que cincuenta aportes desde un punto de
// ayuda no son bots.

const LLAVE = "pc.clave-envio";

export function nuevaClaveEnvio(): string {
  return crypto.randomUUID();
}

/**
 * La clave de este formulario: la que ya había, o la que ya venía puesta.
 *
 * **`reserva` es la que el servidor dibujó en el HTML**, y existe porque el
 * formulario se puede enviar antes de que el navegador hidrate. Hasta ahora la
 * clave se creaba en el primer efecto, así que durante esos milisegundos —o
 * segundos, en un teléfono lento— el campo iba vacío y el servidor rechazaba el
 * aporte con «algo falló al preparar el envío». La persona veía un error y
 * perdía su relato.
 *
 * Adoptarla en vez de crear otra es lo que mantiene `I1`: si alguien alcanzó a
 * enviar con la del servidor y reintenta ya hidratado, las dos son la misma y
 * hay **un** aporte, no dos.
 */
export function claveEnvioVigente(opciones: { almacen?: Storage; reserva?: string } = {}): string {
  const s = opciones.almacen ?? (typeof sessionStorage !== "undefined" ? sessionStorage : undefined);
  // Sin almacén, cada envío es uno nuevo — salvo que el servidor ya haya puesto
  // una, que es mejor que inventarse otra.
  if (!s) return opciones.reserva ?? nuevaClaveEnvio();
  const guardada = s.getItem(LLAVE);
  if (guardada) return guardada;
  const nueva = opciones.reserva ?? nuevaClaveEnvio();
  s.setItem(LLAVE, nueva);
  return nueva;
}

/** Se llama cuando el aporte ya quedó recibido. El siguiente relato es otro. */
export function olvidarClaveEnvio(almacen?: Storage): void {
  const s = almacen ?? (typeof sessionStorage !== "undefined" ? sessionStorage : undefined);
  s?.removeItem(LLAVE);
}
