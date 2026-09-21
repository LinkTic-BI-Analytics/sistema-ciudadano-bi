import { Esqueleto } from "../../../producto/esqueleto.tsx";

/**
 * Lo que se ve mientras una ficha carga.
 *
 * Es la pantalla más lenta del producto —una docena de consultas en secuencia,
 * incluido el catálogo entero de municipios por páginas— y la única a la que
 * alguien llega **desde un clic**, esperando ver algo.
 */
export default function Cargando() {
  return <Esqueleto filas={5} />;
}
