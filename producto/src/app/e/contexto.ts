/**
 * El contexto que trae un QR, camino de la captura (`QR-02`, `QR-03`).
 *
 * Tres cosas distintas que no se pueden mezclar:
 *
 *   · **de dónde vino** el enlace — el evento al que apuntaba el QR;
 *   · **en qué evento dice participar** la persona — que puede ser otro;
 *   · **dónde ocurre el problema** — que se pregunta aparte, en la captura.
 *
 * Viaja por el navegador y no por la dirección: las UTMs sí van en la URL
 * porque las pone quien difunde, pero lo que la persona decide es suyo y no
 * tiene por qué quedar en el registro de ningún servidor intermedio.
 */

export type ContextoEvento = {
  enlaceId: string;
  /** El encuentro al que apuntaba el QR. Nunca cambia. */
  eventoOrigenId: string;
  /** El que la persona escogió. `null` si dijo que no está en ninguno. */
  eventoConfirmadoId: string | null;
  estado: "confirmado" | "cambiado" | "sin_evento";
  utms: Record<string, string> | null;
};

export const LLAVE_EVENTO = "pc:contexto-evento";

export function guardarContextoEvento(c: ContextoEvento): void {
  try { sessionStorage.setItem(LLAVE_EVENTO, JSON.stringify(c)); } catch { /* se sigue sin contexto */ }
}

/**
 * Lo lee y lo deja puesto.
 *
 * **No se borra al leerlo**, al revés que el contexto entre problemas: si la
 * persona recarga la página de captura, el enlace por el que entró sigue
 * siendo el mismo. `QR-03`: *«volver a entrar por otro enlace no debe sustituir
 * silenciosamente el origen de un borrador activo»*.
 */
export function leerContextoEvento(): ContextoEvento | null {
  try {
    const crudo = sessionStorage.getItem(LLAVE_EVENTO);
    return crudo ? (JSON.parse(crudo) as ContextoEvento) : null;
  } catch {
    return null;
  }
}

export function olvidarContextoEvento(): void {
  try { sessionStorage.removeItem(LLAVE_EVENTO); } catch { /* nada que hacer */ }
}
