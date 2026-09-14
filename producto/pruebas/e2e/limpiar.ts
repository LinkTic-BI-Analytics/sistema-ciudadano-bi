import { execFileSync } from "node:child_process";

/**
 * Deja la base sin rastro antes de empezar.
 *
 * Usa `limpiar-desarrollo.sh` y no `limpiar-pruebas.sh`: los recorridos escriben
 * en el **proceso sembrado**, no en uno marcado como escenario, así que el
 * segundo no los alcanzaba.
 *
 * Existe porque la bandeja se corta en 50 registros y las corridas acumulan: el
 * aporte que una prueba acaba de crear se salía de la lista y la prueba fallaba
 * sin que nada estuviera roto.
 *
 * **El síntoma fue que dos corridas seguidas daban resultados distintos**, y eso
 * es peor que fallar: una prueba que a veces pasa no dice nada.
 */
export default function limpiar() {
  try {
    execFileSync("../scripts/limpiar-desarrollo.sh", { stdio: "pipe" });
  } catch {
    // Si la base no está levantada, las pruebas van a decirlo con más claridad
    // que esto.
  }
}
