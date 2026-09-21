"use client";

import Link from "next/link";
import { Armazon } from "../../producto/armazon.tsx";
import { IconoUrgencia } from "../../producto/iconos.tsx";

/**
 * Cuando algo revienta en la consola.
 *
 * **No había ninguno.** Las ocho acciones de la ficha lanzan cuando la base
 * falla —`accionCambiarTema` hace `throw` con todas las letras— y lo que veía
 * quien revisa era la pantalla de error de Next: fondo blanco, tipografía del
 * sistema y «Application error: a client-side exception has occurred».
 * Ninguna pista de qué se perdió ni forma de volver.
 *
 * Tres cosas que esta pantalla sí dice:
 *
 * - **Qué NO se perdió.** Es lo primero que alguien se pregunta después de
 *   pulsar «Remitir» y ver un error: los aportes están guardados; lo que puede
 *   no haber quedado es la última acción.
 * - **Cómo reintentar sin recargar.** `reset()` vuelve a montar el segmento, y
 *   una acción de servidor que falló por un corte de red funciona a la segunda.
 * - **El identificador del fallo**, si Next lo trae. Es lo único que permite ir
 *   a buscarlo en los registros; sin él, «se cayó» no es un reporte.
 */
export default function Error_({
  error, reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Armazon seccion="Consola" vista={null} kicker="Algo falló">
      <div className="bo-empty">
        <IconoUrgencia />
        <h2>No se pudo cargar esto</h2>
        <p>
          <strong>Nada de lo que ya estaba guardado se perdió</strong> — los aportes, los
          expedientes y la historia siguen ahí. Lo que puede no haber quedado es la última acción
          que pulsaste.
        </p>
        <div className="bo-actions">
          <button className="bo-button" data-variant="primary" onClick={reset}>
            Volver a intentar
          </button>
          <Link className="bo-button" href="/consola">Ir a la bandeja</Link>
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
