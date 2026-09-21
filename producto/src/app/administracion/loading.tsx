import { Esqueleto } from "../../producto/esqueleto.tsx";

/**
 * Lo que se ve mientras administración carga.
 *
 * Esta pantalla dibuja **un QR por material en el servidor**, así que con
 * veinte materiales tarda de verdad.
 */
export default function Cargando() {
  return <Esqueleto filas={4} />;
}
