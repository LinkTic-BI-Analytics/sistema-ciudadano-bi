import type { CSSProperties } from "react";
import { IconoBandeja, IconoExpediente, IconoRevisar } from "../../producto/iconos.tsx";

/**
 * Las tres cifras con las que alguien decide si hoy hay trabajo.
 *
 * Iban en un `<span class="bo-results-line">` dentro de la barra superior, en
 * 12 px y separadas por puntos medios. En la ronda 2 cada una lleva un disco
 * de color con su icono —dorado para lo que hay en la vista, azul para lo
 * recibido, verde para los expedientes— y entran en cascada.
 *
 * **No es un ranking.** `BI-02` prohíbe ordenar por popularidad, y esto no
 * ordena nada: son los totales del universo que se está mirando. La cifra va en
 * la tipografía de cifras con numerales tabulares.
 *
 * **Y no son tarjetas que se puedan tocar.** La navegación ya tiene sus vistas
 * de trabajo, con su rótulo y su estado activo.
 */
export function Resumen({
  enLaLista, aportes, expedientes, filtrada,
}: {
  enLaLista: number;
  aportes: number;
  expedientes: number;
  filtrada: boolean;
}) {
  const orden = (n: number) => ({ "--pc-orden": n }) as CSSProperties;
  return (
    <div className="bo-resumen">
      <div className="pc-entra" style={orden(0)} data-foco={filtrada ? "true" : undefined}>
        <span className="bo-resumen-icono"><IconoRevisar /></span>
        <span className="bo-label-tag">{filtrada ? "En esta vista" : "En la bandeja"}</span>
        <strong>{enLaLista}</strong>
        <p>{filtrada ? `de ${aportes} recibidos en total` : "todo lo que ha llegado"}</p>
      </div>

      <div className="pc-entra" style={orden(1)} data-tinte="azul">
        <span className="bo-resumen-icono"><IconoBandeja /></span>
        <span className="bo-label-tag">Aportes recibidos</span>
        <strong>{aportes}</strong>
        <p>en este proceso, sin contar los retirados</p>
      </div>

      <div className="pc-entra" style={orden(2)} data-tinte="verde">
        <span className="bo-resumen-icono"><IconoExpediente /></span>
        <span className="bo-label-tag">Expedientes abiertos</span>
        <strong>{expedientes}</strong>
        <p>abrir uno no aprueba ni compromete nada</p>
      </div>
    </div>
  );
}
