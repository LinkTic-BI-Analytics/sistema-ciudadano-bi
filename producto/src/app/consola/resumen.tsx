/**
 * Las tres cifras con las que alguien decide si hoy hay trabajo.
 *
 * Iban en un `<span class="bo-results-line">` dentro de la barra superior, en
 * 12 px y separadas por puntos medios: *«115 en la lista · 120 aportes · 12
 * expedientes»*. Tres datos distintos escritos como una frase, en la esquina
 * donde nadie mira, y con una clase que el sistema de diseño había hecho para
 * otra cosa — `.bo-results-line` es el bloque que va **entre los filtros y la
 * tabla**, y ahí es donde vuelve.
 *
 * **No es un ranking.** `BI-02` prohíbe ordenar por popularidad, y esto no
 * ordena nada: son los totales del universo que se está mirando. La cifra va en
 * la tipografía de cifras con numerales tabulares, que es lo que la línea
 * gráfica pide para un número que se compara con otro.
 *
 * **Y no son tarjetas que se puedan tocar.** Un conteo que además filtra
 * mezcla dos cosas: la navegación ya tiene sus vistas de trabajo, con su
 * rótulo y su estado activo. Una cifra que a veces filtra y a veces no es
 * justo lo que obliga a probar a ver qué pasa.
 */
export function Resumen({
  enLaLista, aportes, expedientes, filtrada,
}: {
  /** Cuántos hay con el filtro puesto. */
  enLaLista: number;
  /** Cuántos hay en el proceso, sin filtrar. */
  aportes: number;
  expedientes: number;
  /** Si hay algún filtro puesto. Cambia el rótulo y dónde va el acento. */
  filtrada: boolean;
}) {
  return (
    <div className="bo-resumen">
      {/* El borde dorado señala **dónde está el trabajo**, y solo cuando hay un
          filtro puesto: sin filtro, «en esta vista» y «recibidos» son el mismo
          número y acentuar uno de los dos no dice nada.
          El color no va solo — el rótulo lo dice con palabras. */}
      <div data-foco={filtrada ? "true" : undefined}>
        <span className="bo-label-tag">{filtrada ? "En esta vista" : "En la bandeja"}</span>
        <strong>{enLaLista}</strong>
        <p>{filtrada ? `de ${aportes} recibidos en total` : "todo lo que ha llegado"}</p>
      </div>

      <div>
        <span className="bo-label-tag">Aportes recibidos</span>
        <strong>{aportes}</strong>
        <p>en este proceso, sin contar los retirados</p>
      </div>

      <div>
        <span className="bo-label-tag">Expedientes abiertos</span>
        <strong>{expedientes}</strong>
        {/* Lo dice aquí porque es donde alguien ve el número y se le ocurre
            leerlo como un avance. Abrir un expediente es empezar a revisar. */}
        <p>abrir uno no aprueba ni compromete nada</p>
      </div>
    </div>
  );
}
