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
  // **Solo su propio proceso.** Antes llamaba a `limpiar-desarrollo.sh`, que
  // vacía la base entera: cada corrida se llevaba por delante lo que alguien
  // hubiera capturado a mano probando la pantalla. Pasó dos veces con datos de
  // verdad, y la segunda con un aporte que se estaba usando para diagnosticar
  // un fallo.
  //
  // El guion crea el proceso de los recorridos y le siembra su agenda; el
  // servidor de la suite lo escoge por `PROCESO_VIGENTE`.
  // La base ya la preparó el arranque del servidor (`playwright.config.ts`):
  // tiene que existir antes de la primera petición. Aquí solo queda calentar.
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
    execFileSync("../scripts/recorridos-base.sh", ["recoger"], { stdio: "pipe" });
  } catch {
    // Si la base ya no está, no hay nada que recoger.
  }
}
