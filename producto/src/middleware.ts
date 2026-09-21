import { NextResponse, type NextRequest } from "next/server";
import {
  COOKIE_ACCESO, COOKIE_RENOVACION, DURACION_ACCESO,
  clavesDelEntorno, firmar, opcionesCookie, verificar,
} from "./acceso/sesion.ts";

/**
 * La puerta de la zona interna: `/consola` y `/administracion`, con todo lo que
 * cuelga de ellas —fichas, audios, piezas descargables—.
 *
 * Tres casos:
 *
 *   · token de acceso vigente → pasa;
 *   · vencido pero con renovación vigente → se firma uno nuevo y pasa. El nuevo
 *     va en la respuesta **y en la petición**: sin lo segundo, una acción de
 *     servidor en esta misma petición leería el vencido y mandaría al login a
 *     quien acaba de renovar;
 *   · ninguno → al login, recordando a dónde iba.
 *
 * Sin `ACCESS_TOKEN` o sin `JWT_SECRET` en el entorno, nadie pasa. Una puerta
 * que se abre sola cuando falta la configuración es una puerta que se abre sola
 * el día que alguien se equivoca en Vercel.
 *
 * Las acciones de servidor no dependen de esto: se invocan desde cualquier
 * dirección, y por eso cada una lo comprueba otra vez (`acceso/servidor.ts`).
 */
export async function middleware(request: NextRequest) {
  const claves = clavesDelEntorno();

  if (claves) {
    const acceso = request.cookies.get(COOKIE_ACCESO)?.value;
    if (acceso && await verificar(acceso, "acceso", claves)) return NextResponse.next();

    const renovacion = request.cookies.get(COOKIE_RENOVACION)?.value;
    if (renovacion && await verificar(renovacion, "renovacion", claves)) {
      const nuevo = await firmar("acceso", claves);
      request.cookies.set(COOKIE_ACCESO, nuevo);
      const respuesta = NextResponse.next({ request: { headers: request.headers } });
      respuesta.cookies.set(COOKIE_ACCESO, nuevo, opcionesCookie(DURACION_ACCESO));
      return respuesta;
    }
  }

  const login = new URL("/ingresar", request.url);
  login.searchParams.set("siguiente", request.nextUrl.pathname + request.nextUrl.search);
  const respuesta = NextResponse.redirect(login);
  // Las que haya, vencidas o de otro token, se van: no sirven para nada.
  respuesta.cookies.delete(COOKIE_ACCESO);
  respuesta.cookies.delete(COOKIE_RENOVACION);
  return respuesta;
}

export const config = {
  matcher: ["/consola", "/consola/:path*", "/administracion", "/administracion/:path*"],
};
