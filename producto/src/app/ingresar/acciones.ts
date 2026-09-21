"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  COOKIE_ACCESO, COOKIE_RENOVACION, DURACION_ACCESO, DURACION_RENOVACION,
  clavesDelEntorno, destinoSeguro, firmar, mismoToken, opcionesCookie,
} from "../../acceso/sesion.ts";

export type Intento = { error: string } | null;

/**
 * Cambia el `ACCESS_TOKEN` por una sesión: el de acceso y el de renovación.
 *
 * **Un token equivocado tarda.** Sin cuentas no hay a quién bloquear después de
 * cinco intentos, y un token de trece caracteres se prueba por fuerza bruta si
 * cada intento contesta al instante. Casi un segundo por intento no molesta a
 * quien se equivocó una vez y le quita a un guion la mayor parte de su ritmo.
 * No es un límite: es lo que se puede hacer sin una base de intentos.
 */
export async function ingresar(_previo: Intento, datos: FormData): Promise<Intento> {
  const claves = clavesDelEntorno();
  if (!claves) {
    console.error("ingresar: falta ACCESS_TOKEN, o JWT_SECRET tiene menos de 32 caracteres");
    return { error: "El acceso no está configurado en este servidor: falta ACCESS_TOKEN o JWT_SECRET." };
  }

  if (!(await mismoToken(String(datos.get("token") ?? ""), claves.token))) {
    await new Promise((listo) => setTimeout(listo, 800));
    return { error: "Ese no es el token. Revisa mayúsculas, números y símbolos." };
  }

  const jar = await cookies();
  jar.set(COOKIE_ACCESO, await firmar("acceso", claves), opcionesCookie(DURACION_ACCESO));
  jar.set(COOKIE_RENOVACION, await firmar("renovacion", claves), opcionesCookie(DURACION_RENOVACION));
  redirect(destinoSeguro(datos.get("siguiente")));
}

/** Borra las dos cookies. Un JWT no se puede revocar; lo que sí se puede es no tenerlo. */
export async function salir(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_ACCESO);
  jar.delete(COOKIE_RENOVACION);
  redirect("/ingresar");
}
