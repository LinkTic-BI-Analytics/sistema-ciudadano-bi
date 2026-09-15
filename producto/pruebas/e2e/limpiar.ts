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
  sembrarAgenda();
  await calentar();
}

/**
 * Se asegura de que haya convocatoria y encuentros.
 *
 * Los recorridos de la portada los necesitan, y hasta ahora dependían de que
 * alguien hubiera corrido el sembrado a mano: la suite pasaba en esta máquina y
 * habría fallado en cualquier otra, que es la peor forma de fallar.
 *
 * `limpiar-desarrollo.sh` no los borra —como no borra el catálogo territorial—
 * así que sembrar una vez basta; el guion no duplica porque solo inserta cuando
 * no hay ninguna publicada.
 */
function sembrarAgenda() {
  try {
    execFileSync("../scripts/sembrar-agenda.sh", { stdio: "pipe" });
  } catch {
    // Si falla, los recorridos de la portada lo dirán con más claridad.
  }
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

/**
 * Y deja la base como la encontró.
 *
 * **No basta con limpiar al empezar.** La suite deja 115 aportes de mentira —33
 * de ellos repetidos, «la vereda El Salado» seis veces— y quien abre la consola
 * después no está mirando su producto: está mirando los fixtures. El único
 * aporte de una persona quedaba sepultado entre ellos.
 *
 * Lo encontró un agente contando la base, no una prueba: ninguna prueba puede
 * ver lo que pasa **después** de que terminan todas.
 *
 * Esto no protege lo que alguien haya capturado a mano —eso se lo lleva la
 * limpieza del arranque— y por eso falta lo de verdad: que los recorridos
 * escriban en su propio proceso. Mientras tanto, al menos lo que queda es una
 * base vacía y no un vertedero.
 */
export async function recoger() {
  try {
    execFileSync("../scripts/limpiar-desarrollo.sh", { stdio: "pipe" });
  } catch {
    // Si la base ya no está, no hay nada que recoger.
  }
  sembrarAgenda();
}
