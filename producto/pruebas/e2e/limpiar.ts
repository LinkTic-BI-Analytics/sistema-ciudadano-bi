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
export default async function limpiar() {
  try {
    execFileSync("../scripts/limpiar-desarrollo.sh", { stdio: "pipe" });
  } catch {
    // Si la base no está levantada, las pruebas van a decirlo con más claridad
    // que esto.
  }
  await calentar();
}

/**
 * Toca cada ruta una vez antes de que empiecen las pruebas.
 *
 * Next compila las rutas **la primera vez que alguien las pide**, y esa primera
 * vez puede tardar más que el tiempo de espera de una prueba. El síntoma era una
 * corrida con un solo fallo, siempre la primera después de cambiar código, y
 * nunca reproducible: exactamente el perfil de un arranque en frío.
 *
 * Que lo pague esta función y no la primera prueba que pase por ahí. Si alguna
 * ruta no responde, no se dice nada: las pruebas lo van a contar mejor.
 */
async function calentar() {
  const base = "http://127.0.0.1:3101";
  await Promise.all(
    ["/participar", "/mis-aportes", "/consola"].map((r) =>
      fetch(base + r, { signal: AbortSignal.timeout(120_000) }).catch(() => null),
    ),
  );
}
