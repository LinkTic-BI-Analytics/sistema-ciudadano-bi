import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  COOKIE_ACCESO, COOKIE_RENOVACION, DURACION_ACCESO,
  clavesDelEntorno, destinoSeguro, firmar, opcionesCookie, verificar,
} from "./sesion.ts";

/**
 * La primera línea de toda acción de servidor de la zona interna.
 *
 * **El middleware no alcanza para las acciones.** Una acción de servidor de
 * Next se invoca con su identificador desde cualquier dirección, no solo desde
 * la página donde vive: un `POST /` con la cabecera `Next-Action` correcta la
 * corre igual, y ahí el middleware de `/consola` no pasa. Sin esta comprobación
 * el login cerraría la puerta y dejaría abierta la ventana.
 *
 * Con el de acceso vencido y el de renovación vigente, renueva aquí mismo, como
 * haría el middleware. Sin ninguno de los dos, manda al login y vuelve a la
 * pantalla desde la que se llamó.
 *
 * Va **antes** de cualquier `try`: `redirect()` funciona lanzando, y un
 * `catch` que la atrape convierte el «ve a ingresar» en un error genérico.
 */
export async function exigirSesion(): Promise<void> {
  const claves = clavesDelEntorno();
  const jar = await cookies();
  if (claves) {
    const acceso = jar.get(COOKIE_ACCESO)?.value;
    if (acceso && await verificar(acceso, "acceso", claves)) return;

    const renovacion = jar.get(COOKIE_RENOVACION)?.value;
    if (renovacion && await verificar(renovacion, "renovacion", claves)) {
      jar.set(COOKIE_ACCESO, await firmar("acceso", claves), opcionesCookie(DURACION_ACCESO));
      return;
    }
  }
  redirect(`/ingresar?siguiente=${encodeURIComponent(await deDonde())}`);
}

/** La pantalla desde la que se llamó la acción, si es una privada. */
async function deDonde(): Promise<string> {
  try {
    const r = (await headers()).get("referer");
    if (r) {
      const u = new URL(r);
      return destinoSeguro(u.pathname + u.search);
    }
  } catch {
    // Un `referer` que no es una URL: se vuelve a la consola.
  }
  return "/consola";
}
