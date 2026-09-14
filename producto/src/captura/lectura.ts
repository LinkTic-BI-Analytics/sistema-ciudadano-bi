/**
 * Lo que entendimos, para devolvérselo a la persona y que lo confirme.
 *
 * **No hay IA aquí, y no es una carencia.** `IA-01` la deja como ampliación y
 * exige que todo funcione sin ella; `integraciones.md` todavía no tiene un
 * proveedor elegido. Poner una dependencia externa en el camino de la recepción
 * sería hacer que recibir un aporte dependa de que un tercero responda.
 *
 * Así que esto **no interpreta: segmenta**. Le devuelve a la persona lo que
 * dijo, separado en las partes que `N03` pide, y le pregunta si es eso. La
 * pantalla no dice «creemos entender» sino «esto es lo que nos contaste».
 *
 * La diferencia importa: una lectura inventada que la persona acepta por inercia
 * contamina el expediente con palabras que nadie dijo. Una segmentación fiel
 * puede estar mal cortada, y para eso está el botón de corregir.
 *
 * El día que haya proveedor, lo único que cambia es esta función. El flujo, las
 * versiones y la última palabra de la persona (`V14`) siguen igual.
 */

export type Lectura = {
  /** El problema, en una frase. Sale del relato, sin agregar nada. */
  problema: string;
  /** Tal como lo dijo. `I2`: no se normaliza ni se le pone código. */
  lugar: string | null;
};

/** Hasta dónde llega «una frase». Más largo que esto ya no se lee de un vistazo. */
const LARGO = 180;

export function leer(relato: string, lugar?: string | null): Lectura {
  const limpio = relato.replace(/\s+/g, " ").trim();

  // El primer corte de oración. Si no hay punto, o la primera frase es tan
  // corta que no dice nada («No hay agua.»), se toma el relato entero: es
  // preferible devolver de más que devolver un fragmento que la persona no
  // reconozca como suyo.
  const corte = limpio.search(/[.;]\s/);
  const primera = corte > 40 ? limpio.slice(0, corte) : limpio;

  const problema = primera.length > LARGO ? `${primera.slice(0, LARGO - 1).trimEnd()}…` : primera;

  return { problema, lugar: lugar?.trim() || null };
}
