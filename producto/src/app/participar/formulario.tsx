"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { enviarAporte, type Resultado } from "./acciones.ts";
import { claveEnvioVigente, olvidarClaveEnvio } from "../../captura/clave-envio.ts";
import { hayIndicio, ORIENTACION } from "../../alerta/urgencia.ts";
import { Afinado } from "./afinado.tsx";

export function Formulario() {
  const [resultado, accion, enviando] = useActionState<Resultado | null, FormData>(
    enviarAporte, null,
  );
  const [modo, setModo] = useState<"escribir" | "hablar">("escribir");
  // **El relato vive aquí y no en el campo.** Es lo que hace que cambiar de modo
  // no lo borre — `direccion-visual.md` lo pide, y perder lo escrito al tocar un
  // botón es la forma más rápida de que alguien abandone.
  const [relato, setRelato] = useState("");
  const [clave, setClave] = useState("");
  const resumen = useRef<HTMLDivElement>(null);
  // **Se evalúa mientras escribe, no al enviar.** Alguien que está reportando un
  // derrumbe no debería tener que terminar un formulario para ver a dónde
  // llamar. `V13`: la orientación se muestra «sin exigir que termine».
  const indicio = hayIndicio(relato);

  useEffect(() => setClave(claveEnvioVigente()), []);

  useEffect(() => {
    // El foco va al resumen de errores. Sin esto, quien usa lector de pantalla o
    // teclado no se entera de que algo falló: el mensaje aparece arriba y él
    // sigue abajo.
    if (resultado && !resultado.ok) resumen.current?.focus();
    // Recibido: la clave se olvida. El siguiente relato es otro aporte, aunque
    // lo escriba la misma persona en el mismo equipo.
    if (resultado?.ok && !resultado.yaExistia) olvidarClaveEnvio();
  }, [resultado]);

  // **No se muestra un «enviado» aquí.** El aporte se guardó —eso no se
  // negocia, `N02` y `DAT-01`— pero decirle a la persona que terminó en el
  // momento en que más dispuesta está a contar es perder la única oportunidad
  // de preguntarle lo que falta (ADR 0012). El comprobante va discreto durante
  // el afinado y grande al final.
  if (resultado?.ok) return <Afinado codigo={resultado.codigo} />;

  return (
    <form action={accion} noValidate>
      <input type="hidden" name="clave" value={clave} readOnly />

      {resultado && !resultado.ok && (
        <div className="pc-error-summary" role="alert" tabIndex={-1} ref={resumen}>
          <h2>Falta algo para poder enviarlo</h2>
          <ul>
            {resultado.errores.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      {indicio && (
        // Sale de más, nunca de menos: un falso positivo es un número de más en
        // la pantalla; un falso negativo es alguien en peligro que no lo ve.
        <div className="pc-callout" role="alert" data-prueba="orientacion">
          <p><strong>{ORIENTACION}</strong></p>
          <a className="pc-action" href="tel:123">Llamar al 123</a>
          <p className="pc-help">
            Lo que ya escribiste se conserva. Puedes llamar y volver.
          </p>
        </div>
      )}

      <div className="pc-modes" role="group" aria-label="Cómo quieres contarlo">
        <button type="button" className="pc-mode" aria-pressed={modo === "escribir"}
                onClick={() => setModo("escribir")}>Escribir</button>
        <button type="button" className="pc-mode" aria-pressed={modo === "hablar"}
                onClick={() => setModo("hablar")}>Hablar</button>
      </div>
      {modo === "hablar" && (
        // Decirlo es mejor que un botón que no hace nada. `IA-01` deja la voz
        // como ampliación, y prometerla aquí sería prometer lo que no hay.
        <p className="pc-mode-hint">
          Contar hablando todavía no está disponible. Lo que escribas se conserva si vuelves a
          «Escribir».
        </p>
      )}

      <div className="pc-field">
        <label className="pc-label" htmlFor="relato">¿Qué está pasando?</label>
        <textarea
          id="relato" name="relato" className="pc-input" rows={6}
          value={relato} onChange={(e) => setRelato(e.target.value)}
          aria-invalid={resultado && !resultado.ok && !relato ? true : undefined}
          aria-describedby="relato-ayuda"
        />
        <p className="pc-help" id="relato-ayuda">
          Cuéntalo con tus palabras y sin apuro: qué pasa, dónde, a quiénes les pasa y desde
          cuándo. No necesitas saber qué entidad responde ni proponer una solución.
        </p>
      </div>

      {/* Aquí solo se cuenta. El lugar, a quiénes afecta, desde cuándo, qué
          debería cambiar y la solución sugerida **se preguntan después**, y
          solo las que la persona no haya dicho ya (`afinado.tsx`).

          Pedirlas aquí convertía una caja en un formulario de seis campos
          antes de que hubiera nada guardado, y quien lo cerraba se iba sin
          dejar nada. Ahora lo primero que pasa es que su relato queda. */}

      <button type="submit" className="pc-action" disabled={enviando}>
        {enviando ? "Guardando…" : "Continuar"}
      </button>
    </form>
  );
}
