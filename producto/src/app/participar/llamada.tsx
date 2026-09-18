"use client";

import { useActionState, useEffect, useRef } from "react";
import { pedirLlamada, type ResultadoLlamada } from "./acciones.ts";

// «Te llamamos» — el tercer modo, al lado de escribir y de hablar.
//
// Existe por la misma razón que el micrófono: a quien le cuesta escribir no se
// le puede pedir que escriba para poder participar. Aquí ni siquiera hace falta
// tener saldo ni datos: deja el número y la llamada la pagamos nosotros.
//
// **Va en `pc-voice` y no en una clase propia.** Es el panel que abre el
// selector de modo, el mismo papel visual que el del micrófono, y el sistema de
// diseño no tiene hoy un contenedor neutro para eso. Inventar la clase aquí la
// dejaría sin estilo y sin que nada falle (`clases_inventadas.py` existe por eso
// exactamente); lo limpio es pedirle al diseño un `pc-panel`, y hasta entonces
// esto se reusa a conciencia.
//
// Lo que esta pantalla NO hace:
//
//   · **no presenta la llamada como atención de una emergencia.** El pie de la
//     página lo dice y el 123 sigue siendo la acción principal si hay indicio;
//   · no promete cuándo. «En breve» es lo que se acordó, y poner una hora sería
//     un plazo que nadie se comprometió a cumplir — el único plazo del sistema
//     es el de la alerta urgente (`V13`);
//   · no confirma con un aviso que se va solo. `AGENTS.md` §10: *una
//     confirmación no es un aviso que se va solo*, y el estado nunca se
//     comunica solo por color.

export function Llamada() {
  const [resultado, accion, guardando] = useActionState<ResultadoLlamada | null, FormData>(
    pedirLlamada, null,
  );
  const resumen = useRef<HTMLDivElement>(null);

  // El foco va al resumen de errores. Sin esto, quien usa lector de pantalla o
  // teclado no se entera de que algo falló: el mensaje sale arriba y él sigue
  // abajo. Es lo mismo que hace el formulario del relato.
  useEffect(() => {
    if (resultado && !resultado.ok) resumen.current?.focus();
  }, [resultado]);

  if (resultado?.ok) {
    return (
      <div className="pc-voice" data-prueba="llamada-guardada">
        {/* `role="status"` y no `role="alert"`: esto no interrumpe, se anuncia.
            Y se queda en pantalla — quien mire después tiene que poder ver que
            sí quedó pedida. */}
        <p className="pc-success" role="status">Te llamamos en breve.</p>
        <p className="pc-help">
          Guardamos tu nombre y tu teléfono <strong>solo para llamarte</strong>. Si mientras
          tanto quieres contarlo por escrito, vuelve a <strong>Escribir</strong> arriba.
        </p>
      </div>
    );
  }

  return (
    <div className="pc-voice" data-prueba="llamada">
      <p className="pc-voice-status">Te llamamos</p>
      {/* **Por qué pedimos esto, dicho aquí y no en una política que nadie
          lee.** Es el único sitio del producto donde se pide un dato personal, y
          la portada promete justo lo contrario para el camino normal. Callarlo
          convertiría esa promesa en algo que la persona descubre rompiéndose. */}
      <p className="pc-help">
        Déjanos tu nombre y tu teléfono y te llamamos nosotros. Es lo único que se guarda, y
        se guarda <strong>aparte de lo que cuentes</strong>: no se publica ni aparece en
        ningún listado público.
      </p>

      {resultado && !resultado.ok && (
        <div className="pc-error-summary" role="alert" tabIndex={-1} ref={resumen}>
          <h2>Falta algo para poder llamarte</h2>
          <ul>
            {resultado.errores.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* Un formulario propio, y **fuera del formulario del relato**: uno dentro
          de otro no es HTML válido, y al enviar el de adentro se enviaba el de
          afuera. Por eso el selector de modo vive fuera de los dos. */}
      <form action={accion} noValidate>
        {/* Colombia mientras no haya con qué preguntarlo. Va en el envío y no
            solo en el suelo de la base, para que lo guardado diga con qué
            indicativo se pidió y no con cuál estaba configurado ese día. */}
        <input type="hidden" name="codigoPais" value="57" readOnly />

        <div className="pc-field">
          <label className="pc-label" htmlFor="llamada-nombre">Tu nombre</label>
          <input
            id="llamada-nombre" name="nombre" className="pc-input" type="text"
            autoComplete="name" aria-required="true"
            aria-invalid={resultado && !resultado.ok ? true : undefined}
            aria-describedby="llamada-nombre-ayuda"
          />
          <p className="pc-help" id="llamada-nombre-ayuda">
            Como quieras que te digamos. No hace falta el nombre completo ni la cédula.
          </p>
        </div>

        <div className="pc-field">
          <label className="pc-label" htmlFor="llamada-telefono">Tu teléfono</label>
          <input
            id="llamada-telefono" name="telefono" className="pc-input"
            // `tel` más `inputMode` numérico: en un teléfono abre el teclado de
            // marcar, que es el que esta persona sabe usar.
            type="tel" inputMode="numeric" autoComplete="tel" aria-required="true"
            aria-invalid={resultado && !resultado.ok ? true : undefined}
            aria-describedby="llamada-telefono-ayuda"
          />
          <p className="pc-help" id="llamada-telefono-ayuda">
            Celular o fijo con indicativo. Si es de otra persona, avísale que vamos a llamar.
          </p>
        </div>

        <button type="submit" className="pc-action" disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
