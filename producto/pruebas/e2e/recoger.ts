import { recoger } from "./limpiar.ts";

/**
 * Lo que corre cuando ya terminaron todas las pruebas.
 *
 * Playwright pide un módulo aparte para el cierre, así que este archivo existe
 * solo para apuntar a `recoger()`, que vive junto a la limpieza del arranque
 * porque son la misma idea vista por los dos extremos.
 */
export default recoger;
