import type { ReactNode } from "react";
import { BotonTema } from "./tema.tsx";
import { BarraLateral, type VistaInterna } from "./barra-lateral.tsx";
import { IconoSiguiente } from "./iconos.tsx";

export type { VistaInterna };

/**
 * El armazón de las pantallas internas: barra lateral, barra superior y pie.
 *
 * **Estaba copiado tres veces** —bandeja, ficha de aporte y administración— y
 * las tres copias se habían desviado. Es el equivalente interno de
 * [`marca.tsx`](./marca.tsx), que existe por lo mismo.
 *
 * La barra lateral vive en su propio archivo porque necesita estado para el
 * menú del teléfono (`barra-lateral.tsx`). Lo demás es servidor.
 *
 * ## La barra superior
 *
 * Lleva el rastro —«Consola › Bandeja de calidad»— y no solo la versalita: en
 * una pantalla de detalle, saber de dónde se viene es la mitad de saber dónde
 * se está. A la derecha, lo que cada pantalla tenga que decir y el botón de
 * tema, que el interno no tenía.
 */
export function Armazon({
  seccion, vista, volver, kicker, meta, pie, children,
}: {
  /** El rótulo de la marca, arriba a la izquierda. */
  seccion: string;
  vista: VistaInterna;
  /** Solo en pantallas de detalle: a dónde se vuelve. */
  volver?: { href: string; texto: string };
  /** Dónde estás, para el rastro de la barra superior. */
  kicker: string;
  /** Lo que va a la derecha de la barra superior, antes del botón de tema. */
  meta?: ReactNode;
  pie?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="pc-backoffice">
      <div className="bo-shell">
        <BarraLateral seccion={seccion} vista={vista} volver={volver} />

        <div className="bo-workspace">
          <header className="bo-topbar">
            <p className="bo-rastro">
              <span>{seccion}</span>
              <IconoSiguiente />
              <strong>{kicker}</strong>
            </p>
            <div className="bo-inline">
              {meta}
              <BotonTema />
            </div>
          </header>

          <main className="bo-main">{children}</main>

          {pie && <footer className="bo-footer">{pie}</footer>}
        </div>
      </div>
    </div>
  );
}
