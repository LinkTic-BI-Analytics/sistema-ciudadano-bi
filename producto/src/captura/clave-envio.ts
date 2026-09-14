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

/** La clave de este formulario: la que ya había, o una nueva. */
export function claveEnvioVigente(almacen?: Storage): string {
  const s = almacen ?? (typeof sessionStorage !== "undefined" ? sessionStorage : undefined);
  if (!s) return nuevaClaveEnvio();   // sin almacén, cada envío es uno nuevo
  const guardada = s.getItem(LLAVE);
  if (guardada) return guardada;
  const nueva = nuevaClaveEnvio();
  s.setItem(LLAVE, nueva);
  return nueva;
}

/** Se llama cuando el aporte ya quedó recibido. El siguiente relato es otro. */
export function olvidarClaveEnvio(almacen?: Storage): void {
  const s = almacen ?? (typeof sessionStorage !== "undefined" ? sessionStorage : undefined);
  s?.removeItem(LLAVE);
}
