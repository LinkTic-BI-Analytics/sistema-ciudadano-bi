"use client";

import { useState } from "react";
import { IconoComprobante, IconoCopiar } from "../../producto/iconos.tsx";

/**
 * El código, que es lo único que la persona se lleva.
 *
 * **Se pintaba con `.pc-key`.** Esa clase no es un estilo de código: es la
 * leyenda de color del muestrario del sistema de diseño, dentro del bloque que
 * su propia hoja rotula «no se usa en el producto». Resultado: doce caracteres
 * en 14 px, con la tipografía del cuerpo, sin caja y sin tracking — más
 * pequeños que el párrafo que hay debajo explicando para qué sirven.
 *
 * Y mientras tanto `layout.tsx` carga JetBrains Mono con un comentario que dice
 * exactamente para qué: *«las cifras que se comparan entre sí —el código del
 * comprobante, los conteos—»*. Estaba cargada y sin usar.
 *
 * ## Tres cosas que no se negocian
 *
 * **El nodo de texto es el código crudo.** Nada de agrupar con espacios de
 * verdad: rompería copiar y pegar, y los recorridos leen ese nodo para volver a
 * usarlo en `/mis-aportes`. El agrupamiento visual lo hace `letter-spacing`.
 *
 * **El alfabeto ya está pensado para leerse en voz alta** —sin O, sin I, sin L,
 * porque se confunden al dictarlo por teléfono (`captura/recibir.ts`)—, así que
 * la tipografía de cifras no es adorno: es lo que hace que un 0 y una O no
 * puedan confundirse tampoco al mirarlo.
 *
 * **«Copiado» no se desvanece.** Un aviso que se va solo no comunica un estado,
 * y aquí el estado importa: quien copió tiene que poder comprobarlo. Va en un
 * `<output>` que ocupa su sitio desde el principio, así que al aparecer no
 * empuja el botón que la persona acaba de tocar.
 */
export function Comprobante({ codigo, rotulo }: {
  codigo: string;
  /** Qué es este código en esta pantalla. */
  rotulo: string;
}) {
  const [copiado, setCopiado] = useState<"si" | "no" | null>(null);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado("si");
    } catch {
      // Sin permiso, sin portapapeles o fuera de un contexto seguro. No es un
      // error de la persona y no se le habla como si lo fuera: se le dice qué
      // hacer en su lugar.
      setCopiado("no");
    }
  }

  return (
    <div className="pc-comprobante pc-entra">
      <span className="pc-label-display">
        <IconoComprobante />
        {rotulo}
      </span>
      <b data-prueba="codigo">{codigo}</b>
      {/* El rótulo del botón no cambia: lo que cambia es el aviso de abajo. Un
          botón que se renombra al pulsarlo deja de poder pulsarse dos veces. */}
      <button type="button" className="pc-text-action" onClick={copiar}>
        <IconoCopiar />
        Copiar el código
      </button>
      <output aria-live="polite">
        {copiado === "si" && "Copiado. Pégalo donde lo vayas a guardar."}
        {copiado === "no" && "No se pudo copiar solo: selecciónalo y cópialo a mano."}
      </output>
    </div>
  );
}
