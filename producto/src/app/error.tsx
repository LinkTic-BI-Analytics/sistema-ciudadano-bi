"use client";

import Link from "next/link";
import { Cabecera, Pie, Tricolor } from "../producto/marca.tsx";
import { IconoAviso } from "../producto/iconos.tsx";

/**
 * Cuando algo revienta en una pantalla ciudadana.
 *
 * **No había ninguna**, y aquí importa más que en la consola: quien revisa
 * vuelve a entrar mañana; quien cuenta puede no volver nunca. Lo que veía era
 * la pantalla blanca de Next con «Application error» — en inglés, sin marca y
 * sin el aviso del 123.
 *
 * Lo que esta pantalla tiene que decir, en este orden:
 *
 * 1. **Que lo suyo no se perdió**, si ya había pulsado «Continuar». El aporte
 *    se guarda en ese primer clic y eso no depende de nada más (ADR 0012), así
 *    que el código que tenga a la vista sigue sirviendo.
 * 2. **Cómo seguir** sin tener que entender qué pasó.
 * 3. **El 123**, que es la única cosa de este producto que no puede faltar en
 *    ninguna pantalla. Lo pone el pie, que es el mismo de todas.
 */
export default function Error_({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="pc-ui">
      <div className="pc-shell">
        <Cabecera />
        <main className="pc-main">
          <p className="pc-eyebrow"><Tricolor />Algo falló</p>
          <h1>No pudimos cargar esta página</h1>
          <div className="pc-callout">
            <p>
              <IconoAviso />{" "}
              <strong>Si ya te dimos un código, lo que contaste está guardado.</strong> El código
              sirve igual: con él puedes volver a ver tu aporte cuando quieras.
            </p>
          </div>
          <p className="pc-intro">
            Puede ser la conexión o puede ser nuestro. No hace falta que lo averigües: vuelve a
            intentarlo y, si sigue igual, inténtalo más tarde. No pierdes nada por esperar.
          </p>
          <div className="pc-actions">
            <button type="button" className="pc-action" onClick={reset}>
              Volver a intentar
            </button>
            <Link className="pc-text-action" href="/">Ir al inicio</Link>
          </div>
        </main>
        <Pie />
      </div>
    </div>
  );
}
