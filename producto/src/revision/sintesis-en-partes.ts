/**
 * La síntesis, partida en los campos que de verdad es.
 *
 * `componer()` la escribe como «Problema: … / Lo que se espera: … / Solución
 * sugerida: …» y la consola la enseñaba como un párrafo corrido con saltos de
 * línea. Son tres campos, y leerlos como prosa es parte de lo que hacía que la
 * ficha pareciera una transcripción y no una ficha de gestión.
 *
 * **Se corta solo por las etiquetas que escribimos nosotros**, no por cualquier
 * cosa antes de dos puntos. Un corte ingenuo partía «el problema es este: el
 * agua llega turbia» en una etiqueta y un valor, y eso le cambia el sentido a lo
 * que la persona dijo — que es exactamente lo que `N03` y `V14` no permiten.
 *
 * Si el texto no trae ninguna etiqueta conocida, sale entero: inventarle
 * campos sería peor que no ponerlos.
 */

/** Las que escribe `componer()` en `src/captura/sintesis.ts`, y no hay otras. */
const ETIQUETAS = ["Problema", "Lo que se espera", "Solución sugerida"] as const;

export function enPartes(texto: string): [string, string][] {
  const partes: [string, string][] = [];
  let actual: [string, string] | null = null;

  for (const linea of texto.split("\n")) {
    const etiqueta = ETIQUETAS.find((e) => linea.startsWith(`${e}:`));
    if (etiqueta) {
      actual = [etiqueta, linea.slice(etiqueta.length + 1).trim()];
      partes.push(actual);
    } else if (linea.trim() && actual) {
      // Una línea suelta debajo de un campo es su continuación, no otro campo.
      actual[1] = `${actual[1]} ${linea.trim()}`.trim();
    } else if (linea.trim()) {
      actual = ["Lo que entendimos", linea.trim()];
      partes.push(actual);
    }
  }

  return partes.length ? partes : [["Lo que entendimos", texto]];
}
