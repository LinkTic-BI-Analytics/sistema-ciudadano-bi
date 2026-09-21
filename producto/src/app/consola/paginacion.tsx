import Link from "next/link";
import { IconoAnterior, IconoSiguientePagina } from "../../producto/iconos.tsx";

/**
 * Páginas de la bandeja: «‹ Anterior · 1 2 3 … 8 · Siguiente ›».
 *
 * Antes no había páginas: había un enlace «Ver 50 más» que **alargaba la
 * misma página**. Con ciento veinte aportes, la bandeja medía tres pantallas y
 * seguía creciendo; era lo que el cliente llamó «un informe vertical largo».
 *
 * Son enlaces y no botones porque la página es parte de la dirección, como
 * todos los filtros: una página se puede guardar, mandar y volver a abrir. Y
 * cambiar cualquier filtro vuelve a la primera (`FiltrosActivos` ya quita el
 * parámetro al construir sus direcciones).
 *
 * `aria-current="page"` en la actual, y los extremos deshabilitados son
 * `<span>` y no enlaces muertos: un enlace que no lleva a ninguna parte
 * confunde al lector de pantalla y al pulgar.
 */

type Consulta = Record<string, string | string[] | undefined>;

/** Qué números enseñar: siempre el 1 y el último, y una ventana de ±1 alrededor de la actual. */
function ventana(pagina: number, paginas: number): (number | "…")[] {
  const vistas = new Set<number>([1, paginas, pagina - 1, pagina, pagina + 1]);
  const lista = [...vistas].filter((n) => n >= 1 && n <= paginas).sort((a, b) => a - b);
  const salida: (number | "…")[] = [];
  for (const [i, n] of lista.entries()) {
    if (i > 0 && n - lista[i - 1]! > 1) salida.push("…");
    salida.push(n);
  }
  return salida;
}

export function Paginacion({
  pagina, paginas, consulta, mostrando, total, porPagina,
}: {
  pagina: number;
  paginas: number;
  consulta: Consulta;
  /** Cuántas filas hay en esta página, para la línea de conteo. */
  mostrando: number;
  total: number;
  porPagina: number;
}) {
  if (paginas <= 1) return null;

  const a = (n: number) => ({ pathname: "/consola", query: { ...consulta, pagina: String(n) } });
  const desde = (pagina - 1) * porPagina + 1;

  return (
    <nav className="bo-paginacion" aria-label="Páginas de la bandeja">
      {pagina > 1
        ? <Link href={a(pagina - 1)} rel="prev"><IconoAnterior />Anterior</Link>
        : <span aria-disabled="true"><IconoAnterior />Anterior</span>}

      {ventana(pagina, paginas).map((n, i) =>
        n === "…"
          ? <span key={`p-${i}`} className="bo-puntos" aria-hidden>…</span>
          : <Link key={n} href={a(n)} aria-current={n === pagina ? "page" : undefined}
                  aria-label={`Página ${n}`}>{n}</Link>)}

      {pagina < paginas
        ? <Link href={a(pagina + 1)} rel="next">Siguiente<IconoSiguientePagina /></Link>
        : <span aria-disabled="true">Siguiente<IconoSiguientePagina /></span>}

      <p className="bo-muted">
        del {desde} al {desde + mostrando - 1} de {total}
      </p>
    </nav>
  );
}
