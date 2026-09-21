import { Esqueleto } from "../../producto/esqueleto.tsx";

/** Lo que se ve mientras la bandeja carga. El porqué, en `esqueleto.tsx`. */
export default function Cargando() {
  return <Esqueleto filas={8} />;
}
