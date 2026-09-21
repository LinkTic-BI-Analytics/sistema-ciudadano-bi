/**
 * La forma de lo que está llegando, mientras llega.
 *
 * Los filtros de la consola viajan en la dirección, así que **filtrar es una
 * navegación entera**: se pulsa «Filtrar» y la pantalla se queda con los
 * resultados viejos, sin una sola señal, hasta que el servidor contesta. Con
 * ciento veinte aportes y una consulta que pagina el catálogo de municipios,
 * eso es tiempo suficiente para volver a pulsar.
 *
 * ## Por qué esto NO lleva la barra lateral
 *
 * La primera versión sí la llevaba, para que la navegación no parpadeara. Y
 * producía un defecto peor: mientras React cambia el contenido de espera por el
 * de verdad, **los dos árboles conviven en el documento**, así que había dos
 * barras laterales, dos barras superiores y —esto es lo grave— **dos `<main>`**.
 * Un documento tiene un solo `main`; con dos, un lector de pantalla ofrece dos
 * «contenidos principales» y quien navega por regiones no sabe cuál es.
 *
 * Lo atrapó `pruebas/e2e/consola.spec.ts`, que mira la consola del navegador y
 * los duplicados: el recorrido encontró dos `.bo-main` y se cayó.
 *
 * **Lo que arregla esto de raíz es mover el armazón a un `layout.tsx`**, que es
 * donde el App Router quiere que viva lo que no cambia entre pantallas: se
 * dibujaría una sola vez y la espera solo sustituiría el cuerpo. No se hizo
 * ahora porque `/consola` y `/consola/[aporte]` comparten segmento y necesitan
 * cabeceras distintas, y eso pide reorganizar las rutas — un cambio de
 * estructura que no cabe en una refactorización visual. Queda anotado.
 *
 * **Sin brillo que recorre.** Un esqueleto animado es un pulso continuo, y
 * `direccion-visual.md` los prohíbe por su nombre. Lo que comunica aquí es la
 * forma —bloques del tamaño de lo que va a llegar—, no el movimiento.
 *
 * El `aria-hidden` no es descuido: la frase de al lado, en `role="status"`, es
 * lo que anuncia un lector de pantalla. Doce rectángulos no se leen en voz alta.
 */
export function Esqueleto({ filas = 6 }: { filas?: number }) {
  return (
    <div className="pc-backoffice">
      <div className="bo-espera">
        <p className="bo-muted" role="status">Cargando…</p>
        <div aria-hidden>
          <span className="bo-esqueleto" data-alto="titular" />
          {Array.from({ length: filas }, (_, i) => (
            <span key={i} className="bo-esqueleto" data-alto="fila" />
          ))}
        </div>
      </div>
    </div>
  );
}
