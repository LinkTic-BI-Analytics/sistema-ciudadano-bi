import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Los valores de los tokens, resueltos.
 *
 * Existe por una razón concreta: **una pieza gráfica descargada no puede leer
 * variables CSS.** Un SVG que se va a imprimir lleva los colores dentro.
 *
 * Y copiarlos a mano sería el error que este proyecto ya cometió tres veces con
 * las clases: un valor copiado se queda quieto mientras el sistema de diseño se
 * mueve, y nadie se entera hasta que la pieza sale de otro color que la web.
 * Así que se leen de la misma hoja que usa el producto, que `scripts/tokens.sh`
 * mantiene al día con el JSON que es la fuente.
 */

let cache: Map<string, string> | null = null;

function cargar(): Map<string, string> {
  if (cache) return cache;
  const css = readFileSync(join(process.cwd(), "src/producto/tokens/participacion.css"), "utf-8");
  const crudos = new Map<string, string>();
  for (const coincidencia of css.matchAll(/(--pc-[\w-]+):\s*([^;]+);/g)) {
    const [, nombre, valor] = coincidencia;
    if (nombre && valor) crudos.set(nombre, valor.trim());
  }

  // Los alias se resuelven en cadena: `brand-ink` → `blue-900` → `#1B3A6B`.
  // Con tope, porque un ciclo en los tokens colgaría el servidor — y el
  // validador del sistema de diseño ya comprueba que no los haya, pero
  // depender de eso desde aquí sería depender de otro repositorio.
  const resuelto = new Map<string, string>();
  for (const [nombre] of crudos) {
    let valor = crudos.get(nombre)!;
    for (let i = 0; i < 10 && valor.startsWith("var("); i++) {
      const alias = valor.slice(4, valor.indexOf(")")).trim();
      valor = crudos.get(alias) ?? valor;
    }
    resuelto.set(nombre, valor);
  }
  cache = resuelto;
  return resuelto;
}

/** Devuelve el valor literal de un token. Falla si no existe: un color inventado se ve. */
export function token(nombre: string): string {
  const v = cargar().get(nombre);
  if (!v || v.startsWith("var(")) {
    throw new Error(`el token ${nombre} no existe o no resuelve: la pieza saldría de otro color`);
  }
  return v;
}
