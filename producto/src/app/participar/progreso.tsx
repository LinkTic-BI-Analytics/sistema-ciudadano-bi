/**
 * Dónde va la persona dentro de la captura.
 *
 * **La queja era literal**: *«cuesta entender en qué punto de la recolección de
 * los datos se encuentra»*. Y tenía razón hasta en lo pequeño: lo único que lo
 * decía era un párrafo de 14 px en gris —«Paso 3 de 5»— del mismo tamaño y del
 * mismo color que la ayuda que iba justo debajo. Se leía como un pie de foto.
 *
 * Peor: **se apagaba justo al final**. La pantalla de la vocería lo cambiaba por
 * «Última pregunta» y la de cierre no ponía nada, así que el indicador
 * desaparecía en los dos pasos donde alguien está a punto de irse.
 *
 * ## Tres decisiones
 *
 * **La barra no sustituye al texto, va con él.** `interfaz.md` pide que un
 * estado nunca se comunique solo por color, y una barra sin cifra es
 * exactamente eso: un rectángulo dorado que hay que medir con el ojo.
 *
 * **Va en el `.pc-topline` que ya existe**, con `flex-basis: 100%`, así que cae
 * en su propio renglón debajo del texto y del botón de volver. Nada cambia de
 * sitio al avanzar: el botón «Volver» se queda exactamente donde estaba.
 *
 * **Y el paso final se dice, no se cuenta.** Con la captura terminada, «Paso 5
 * de 5» es una cuenta; «Listo» es la respuesta. La barra queda llena.
 */
export function Progreso({
  actual, total, terminado, volver,
}: {
  /** En qué paso va, empezando en 1. */
  actual: number;
  total: number;
  /** La captura ya terminó: la barra va llena y el rótulo lo dice. */
  terminado?: boolean;
  /** El botón de volver, si desde aquí se puede. */
  volver?: React.ReactNode;
}) {
  // Nunca cero y nunca más de cien: la dirección y el estado se pueden
  // desincronizar en un reintento, y una barra que se sale del riel se lee como
  // que la pantalla está rota.
  const porcentaje = terminado
    ? 100
    : Math.min(100, Math.max(0, Math.round((actual / Math.max(total, 1)) * 100)));

  return (
    <div className="pc-topline">
      <p className="pc-help" aria-live="polite">
        {terminado ? "Listo · terminaste" : `Paso ${actual} de ${total}`}
      </p>
      {volver}
      {/* El hilo de pasos: puntos numerados, los hechos con check y el actual
          en dorado. Es lo mismo que dicen el texto y la barra, dicho de forma
          que se ve de un vistazo cuánto falta; por eso va `aria-hidden` —el
          lector de pantalla ya oye «Paso 3 de 5»— y se esconde en teléfono,
          donde no cabe con dignidad. */}
      {total > 1 && (
        <div className="pc-hilo" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
            const hecho = terminado || n < actual;
            return (
              <span key={n} data-hecho={hecho ? "true" : undefined}
                    aria-current={!terminado && n === actual ? "step" : undefined}>
                {hecho ? "✓" : n}
              </span>
            );
          }).flatMap((punto, i) => (i === 0 ? [punto] : [<i key={`hilo-${i}`} />, punto]))}
        </div>
      )}
      {/* El `aria-label` lleva la misma frase que se ve: quien usa un lector de
          pantalla oye el paso, no un porcentaje que nadie escribió. */}
      <div
        className="pc-progreso"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={terminado ? total : actual}
        aria-label={terminado ? "Captura terminada" : `Paso ${actual} de ${total}`}
      >
        <span className="pc-progreso-barra" style={{ width: `${porcentaje}%` }} />
      </div>
    </div>
  );
}
