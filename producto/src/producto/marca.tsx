import Link from "next/link";
import { BotonTema } from "./tema.tsx";
import { Escudo, NOMBRE_SISTEMA } from "./escudo.tsx";

/**
 * Las tres piezas de marca que se repiten en todas las pantallas ciudadanas.
 *
 * Estaban copiadas en cuatro archivos, y cada copia se quedó con una versión
 * distinta del rótulo: «Participación Ciudadana» en una, «Participación
 * ciudadana · Plan Nacional de Desarrollo» en otra. Quien llega desde un QR y ve
 * dos nombres distintos en dos pantallas seguidas no sabe si sigue en el mismo
 * sitio. Por eso el nombre sale de `escudo.tsx` y no se escribe aquí.
 */

/** Los tres guiones de la bandera. Es la firma de la línea gráfica. */
export function Tricolor() {
  return (
    <span className="pc-tricolor" aria-hidden>
      <i /><i /><i />
    </span>
  );
}

/**
 * La franja institucional: quién convoca y para qué.
 *
 * **Sigue sin la marca del Gobierno.** `direccion-visual.md` condiciona los
 * activos institucionales al manual que confirme el cliente (`Q34` de
 * `vacios.md`). El escudo sí entró, en la cabecera: lo pidió el equipo el
 * 2026-09-21 junto con el nombre nuevo, y quedó anotado en `vacios.md`.
 */
export function FranjaInstitucional() {
  return (
    <div className="pc-institution">
      <span>Plan Nacional de Desarrollo</span>
      <span>{NOMBRE_SISTEMA}</span>
    </div>
  );
}

export function Cabecera({ volver = true }: { volver?: boolean }) {
  return (
    <header className="pc-header">
      <div className="pc-brand-mark">
        {/* El escudo en el sitio del tricolor, que sigue en cada rótulo de
            sección. En teléfono el tricolor se retiraba de aquí; el escudo se
            queda, más pequeño. */}
        <Escudo alto={40} className="pc-brand-escudo" />
        <p className="pc-brand">
          {volver ? <Link href="/">{NOMBRE_SISTEMA}</Link> : NOMBRE_SISTEMA}
          <span className="pc-brand-sub">Plan Nacional de Desarrollo</span>
        </p>
      </div>
      <BotonTema />
    </header>
  );
}

/**
 * El pie. Lleva el aviso de emergencia y nada más.
 *
 * Decía una frase para el analista de BI —«el número de aportes no representa a
 * la población de un territorio»— que leída desde la vereda suena a «lo tuyo no
 * cuenta». Esa advertencia importa, pero le importa a quien lee los datos: su
 * sitio es la consola y el corte, donde ya está.
 */
export function Pie() {
  return (
    <footer className="pc-footer">
      <p>
        {NOMBRE_SISTEMA} · Plan Nacional de Desarrollo.{" "}
        <strong>Si hay personas en peligro ahora, llama al 123</strong>: esta página no
        atiende emergencias.
      </p>
    </footer>
  );
}
