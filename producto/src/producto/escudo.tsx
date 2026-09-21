import Image from "next/image";

export { NOMBRE_SISTEMA } from "./nombre.ts";

/** Proporción del archivo: 403 × 430. */
const ANCHO_POR_ALTO = 403 / 430;

/**
 * El escudo de Colombia, de `negocio/linea-grafica/.../assets/escudo-colombia.png`.
 *
 * Lleva `alt` aunque vaya al lado del nombre: es lo único que dice que esto es
 * del Estado, y un lector de pantalla también tiene que poder decirlo.
 */
export function Escudo({ alto, className }: { alto: number; className?: string }) {
  return (
    <Image src="/marca/escudo-colombia.png" alt="Escudo de Colombia" className={className}
           width={Math.round(alto * ANCHO_POR_ALTO)} height={alto} />
  );
}
