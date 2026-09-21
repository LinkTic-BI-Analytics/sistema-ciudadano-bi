"use client";

import Link from "next/link";
import { Armazon } from "../../producto/armazon.tsx";
import { IconoUrgencia } from "../../producto/iconos.tsx";

/**
 * Cuando algo revienta en administración.
 *
 * Lo que aquí hay que decir es distinto de lo de la consola, y por eso no
 * comparten archivo: **un material ya generado no se puede volver a generar sin
 * saber si el primero quedó**. Si el fallo ocurrió al crear un enlace, lo
 * primero es mirar la lista antes de repetir — un encuentro con dos QR
 * distintos circulando es un afiche impreso de más.
 */
export default function Error_({
  error, reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Armazon seccion="Administración" vista="convocatoria" kicker="Algo falló">
      <div className="bo-empty">
        <IconoUrgencia />
        <h2>No se pudo cargar esto</h2>
        <p>
          Los encuentros y los materiales que ya existían siguen ahí.{" "}
          <strong>Antes de volver a crear algo, mira la lista</strong>: si la acción alcanzó a
          guardarse, repetirla deja dos.
        </p>
        <div className="bo-actions">
          <button className="bo-button" data-variant="primary" onClick={reset}>
            Volver a intentar
          </button>
          <Link className="bo-button" href="/administracion">Ver la lista</Link>
        </div>
        {error.digest && (
          <p className="bo-small">
            Si hay que reportarlo, este es el número del fallo: <code>{error.digest}</code>
          </p>
        )}
      </div>
    </Armazon>
  );
}
