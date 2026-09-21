import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FormularioIngreso } from "./formulario.tsx";
import { BotonTema } from "../../producto/tema.tsx";
import { Escudo, NOMBRE_SISTEMA } from "../../producto/escudo.tsx";
import {
  COOKIE_ACCESO, COOKIE_RENOVACION, clavesDelEntorno, destinoSeguro, verificar,
} from "../../acceso/sesion.ts";

export const dynamic = "force-dynamic";
export const metadata = { title: `Ingresar · ${NOMBRE_SISTEMA}` };

/**
 * La puerta de la consola y la administración.
 *
 * Aquí llega el middleware con `?siguiente=` —a dónde iba la persona— y aquí se
 * vuelve después del token. Quien ya tiene sesión no ve el formulario: sigue de
 * largo, porque pedir el token dos veces enseña a pegarlo sin mirar dónde.
 */
export default async function Ingresar({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const siguiente = destinoSeguro(q.siguiente);

  const claves = clavesDelEntorno();
  if (claves) {
    const jar = await cookies();
    const acceso = jar.get(COOKIE_ACCESO)?.value;
    const renovacion = jar.get(COOKIE_RENOVACION)?.value;
    // Con la de renovación basta: el middleware firma la de acceso al llegar.
    if ((acceso && await verificar(acceso, "acceso", claves))
      || (renovacion && await verificar(renovacion, "renovacion", claves))) redirect(siguiente);
  }

  return (
    <div className="pc-backoffice">
      <main className="bo-ingreso">
        <div className="bo-ingreso-tarjeta">
          <div className="bo-ingreso-marca">
            <Escudo alto={64} />
            <p>{NOMBRE_SISTEMA}<span>Consola y administración</span></p>
          </div>
          <h1>Ingresar</h1>
          <p className="bo-muted">
            Escribe el token de acceso del equipo. La sesión dura una jornada —ocho horas— y
            después se vuelve a pedir.
          </p>
          <FormularioIngreso siguiente={siguiente} />
        </div>
        <BotonTema />
      </main>
    </div>
  );
}
