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
 *
 * ## Por qué hay que decir el modo
 *
 * Desde la línea gráfica Patria hay dos: el oscuro, que es el de la pantalla, y
 * el claro. **El papel es claro siempre.** Sin esta separación, un afiche de
 * carta saldría con el fondo navy del modo oscuro: 816 × 1056 px de tinta en
 * una impresora de oficina, y un texto pensado para pantalla encima.
 *
 * Por eso el modo se pide y no se adivina, y el que trae por defecto es el
 * claro: el único consumidor de este módulo es la pieza impresa.
 */

export type Modo = "claro" | "oscuro";

const cache = new Map<Modo, Map<string, string>>();

/**
 * Lee TODOS los bloques `selector { … }` de una hoja y devuelve sus
 * declaraciones superpuestas en orden de aparición, como hace el navegador.
 *
 * Todos y no el primero: `globals.css` abre `[data-tema="claro"]` dos veces
 * —una para `color-scheme`, otra para la paleta— y leer solo la primera dejaba
 * la paleta entera fuera sin que nada fallara.
 */
function declaraciones(css: string, inicio: string): Map<string, string> {
  const m = new Map<string, string>();
  let desde = css.indexOf(inicio);
  while (desde >= 0) {
    const hasta = css.indexOf("}", desde);
    for (const c of css.slice(desde, hasta).matchAll(/(--pc-[\w-]+):\s*([^;]+);/g)) {
      const [, nombre, valor] = c;
      if (nombre && valor) m.set(nombre, valor.trim());
    }
    desde = css.indexOf(inicio, hasta);
  }
  return m;
}

function cargar(modo: Modo): Map<string, string> {
  const hecho = cache.get(modo);
  if (hecho) return hecho;

  const css = readFileSync(join(process.cwd(), "src/producto/tokens/participacion.css"), "utf-8");
  // `:root` trae los 372 tokens; el bloque del claro solo las hojas que cambian.
  // Se superponen en ese orden, igual que hace el navegador.
  const crudos = declaraciones(css, "\n:root {");
  if (modo === "claro") {
    for (const [k, v] of declaraciones(css, '[data-tema="claro"] {')) crudos.set(k, v);
  }

  // **Y encima, lo que este proyecto le corrige y le agrega al paquete.** La
  // paleta extendida vive en `globals.css` y redefine semánticos del oscuro
  // —el lienzo dejó de ser navy— y añade estados y sectores en los dos modos.
  // Sin leerla aquí, una pieza descargada y esta misma prueba de paleta
  // trabajarían con colores que el navegador ya no pinta.
  const globales = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf-8");
  const propio = modo === "claro"
    ? declaraciones(globales, '[data-tema="claro"] {')
    : declaraciones(globales, ':root:not([data-tema="claro"]) {');
  for (const [k, v] of propio) crudos.set(k, v);

  // Los alias se resuelven en cadena: `brand-ink` → `blue-850` → `#0A2C46`.
  //
  // **Y con su respaldo**, que es lo que necesitan las familias tipográficas:
  // valen `var(--pc-fuente-display, Montserrat), Arial, sans-serif`, donde la
  // primera variable la define `next/font` en el navegador y aquí no existe.
  // Sin leer el respaldo, un afiche se quedaba sin tipografía y este módulo
  // lanzaba «no resuelve» — que es lo correcto para un color y falso para esto.
  //
  // Con tope de diez vueltas, porque un ciclo en los tokens colgaría el
  // servidor. El validador del sistema de diseño ya comprueba que no los haya,
  // pero depender de eso desde aquí sería depender de otro repositorio.
  const resuelto = new Map<string, string>();
  for (const [nombre] of crudos) {
    let valor = crudos.get(nombre)!;
    for (let i = 0; i < 10 && ALIAS.test(valor); i++) {
      valor = valor.replace(ALIAS, (_, ref: string, respaldo?: string) =>
        crudos.get(ref) ?? respaldo?.trim() ?? "");
    }
    resuelto.set(nombre, valor.trim());
  }
  cache.set(modo, resuelto);
  return resuelto;
}

/** `var(--x)` o `var(--x, respaldo)`. Sin paréntesis anidados: los tokens no los tienen. */
const ALIAS = /var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*))?\)/;

/** Devuelve el valor literal de un token. Falla si no existe: un color inventado se ve. */
export function token(nombre: string, modo: Modo = "claro"): string {
  const v = cargar(modo).get(nombre);
  if (!v || v.includes("var(")) {
    throw new Error(`el token ${nombre} no existe o no resuelve en modo ${modo}: la pieza saldría de otro color`);
  }
  return v;
}
