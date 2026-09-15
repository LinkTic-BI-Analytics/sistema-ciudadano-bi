"use client";

import { useEffect, useRef, useState } from "react";
import { subirGrabacion } from "./acciones.ts";

// Contar hablando (ADR 0013).
//
// **Una máquina de estados ligada a hechos reales**, que es lo que el sistema de
// diseño pide literalmente: *«no basta cambiar un texto en pantalla»*. Los
// estados se mueven con lo que de verdad pasa —el permiso, el `MediaRecorder`,
// la respuesta del servidor— y nunca con un `setTimeout`.
//
// Y lo que no hace, que importa más:
//
//   · **no promete audio recuperable si no fue almacenado**. Mientras graba no
//     hay nada guardado, y lo dice;
//   · no borra lo escrito al cambiar de modo, ni al revés;
//   · no presenta la transcripción como un hecho: se oyó eso, puede estar mal,
//     y la persona manda.

type Estado =
  | "listo"        // nada ha pasado todavía
  | "permiso"      // el navegador está preguntando
  | "grabando"
  | "subiendo"     // el audio va camino del servidor
  | "revisando"    // llegó la transcripción y está por confirmar
  | "sin_permiso"
  | "sin_micro"
  | "error";

const TOPE_SEGUNDOS = 180;

export function Microfono({
  onTranscripcion,
}: {
  /** Se llama cuando la persona acepta lo que se oyó. */
  onTranscripcion: (texto: string, grabacionId: string) => void;
}) {
  const [estado, setEstado] = useState<Estado>("listo");
  const [segundos, setSegundos] = useState(0);
  const [oido, setOido] = useState<string | null>(null);
  const [grabacionId, setGrabacionId] = useState<string | null>(null);

  const grabador = useRef<MediaRecorder | null>(null);
  const trozos = useRef<Blob[]>([]);
  const reloj = useRef<ReturnType<typeof setInterval> | null>(null);

  // Al desmontar se suelta el micrófono. Sin esto, el punto rojo del navegador
  // se queda encendido después de salir de la captura, que es la forma más
  // rápida de que alguien no vuelva a confiar en la pantalla.
  useEffect(() => () => {
    if (reloj.current) clearInterval(reloj.current);
    grabador.current?.stream.getTracks().forEach((t) => t.stop());
  }, []);

  async function comenzar() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setEstado("sin_micro");
      return;
    }
    setEstado("permiso");
    let señal: MediaStream;
    try {
      señal = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      // Negar el micrófono no es un error: es una decisión. Se le ofrece
      // escribir y no se le vuelve a insistir.
      setEstado("sin_permiso");
      return;
    }

    trozos.current = [];
    const g = new MediaRecorder(señal);
    g.ondataavailable = (ev) => { if (ev.data.size > 0) trozos.current.push(ev.data); };
    g.onstop = () => {
      señal.getTracks().forEach((t) => t.stop());
      void enviar(new Blob(trozos.current, { type: g.mimeType }));
    };
    grabador.current = g;
    g.start();

    setSegundos(0);
    setEstado("grabando");
    reloj.current = setInterval(() => {
      setSegundos((s) => {
        // Un tope, y se corta solo. Un micrófono abierto que nadie cierra graba
        // una conversación que nadie quiso mandar.
        if (s + 1 >= TOPE_SEGUNDOS) { terminar(); return TOPE_SEGUNDOS; }
        return s + 1;
      });
    }, 1000);
  }

  function terminar() {
    if (reloj.current) { clearInterval(reloj.current); reloj.current = null; }
    if (grabador.current?.state === "recording") grabador.current.stop();
  }

  async function enviar(audio: Blob) {
    setEstado("subiendo");
    const datos = new FormData();
    datos.append("audio", audio, `grabacion.${audio.type.includes("ogg") ? "ogg" : "webm"}`);
    datos.append("segundos", String(segundos));

    const r = await subirGrabacion(null, datos);
    if (!r.ok) { setEstado("error"); return; }

    setGrabacionId(r.grabacionId);
    setOido(r.texto);
    setEstado("revisando");
  }

  const reloj_ = `${String(Math.floor(segundos / 60)).padStart(2, "0")}:${String(segundos % 60).padStart(2, "0")}`;

  return (
    <div className="pc-voice" data-prueba="microfono" data-estado={estado}>
      {estado === "listo" && (
        <>
          <p className="pc-voice-status">Contar hablando</p>
          {/* Se le dice **antes** de grabar, no en una política que nadie lee.
              Si guardamos su voz, tiene que saberlo cuando aprieta el botón. */}
          <p className="pc-help">
            Guardamos la grabación: <strong>tu voz es el original</strong>, y el texto que salga de
            ella lo puedes corregir. Hasta {TOPE_SEGUNDOS / 60} minutos.
          </p>
          <button type="button" className="pc-action pc-voice-trigger" onClick={comenzar}>
            Empezar a grabar
          </button>
        </>
      )}

      {estado === "permiso" && (
        <p className="pc-voice-status" aria-live="polite">
          Tu navegador te está pidiendo permiso para usar el micrófono…
        </p>
      )}

      {estado === "grabando" && (
        <>
          <p className="pc-voice-status" aria-live="polite">Grabando · {reloj_}</p>
          <p className="pc-help">
            {/* «No prometer audio recuperable si no fue almacenado»: mientras
                graba no hay nada guardado, y callarlo sería prometerlo. */}
            Todavía no se ha guardado nada. Si se corta aquí, no queda grabación.
          </p>
          <button type="button" className="pc-action pc-voice-trigger" onClick={terminar}>
            Terminar y guardar
          </button>
        </>
      )}

      {estado === "subiendo" && (
        <p className="pc-voice-status" aria-live="polite">Guardando lo que dijiste…</p>
      )}

      {estado === "revisando" && (
        <>
          <p className="pc-voice-status">Esto fue lo que oímos</p>
          {oido ? (
            <>
              <p className="pc-summary-text">{oido}</p>
              {/* Lo que más se equivoca al transcribir, dicho donde se revisa. */}
              <p className="pc-help">
                Revisa sobre todo los <strong>nombres de veredas y barrios</strong>, las{" "}
                <strong>cantidades</strong> y los <strong>noes</strong>: es lo que más se equivoca.
                Tu grabación queda guardada igual.
              </p>
              <div className="pc-actions">
                <button type="button" className="pc-action"
                        onClick={() => onTranscripcion(oido, grabacionId!)}>
                  Añadir al relato
                </button>
                <button type="button" className="pc-text-action" onClick={() => setEstado("listo")}>
                  Grabar otra vez
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="pc-help">
                No entendimos lo que dijiste — puede ser el ruido o la señal.{" "}
                <strong>Tu grabación quedó guardada</strong> y alguien la puede escuchar.
              </p>
              <div className="pc-actions">
                <button type="button" className="pc-action"
                        onClick={() => onTranscripcion("(no se entendió la grabación)", grabacionId!)}>
                  Mandarla así
                </button>
                <button type="button" className="pc-text-action" onClick={() => setEstado("listo")}>
                  Grabar otra vez
                </button>
              </div>
            </>
          )}
        </>
      )}

      {estado === "sin_permiso" && (
        <p className="pc-help">
          No diste permiso para el micrófono, y está bien. <strong>Puedes escribirlo</strong> en el
          campo de arriba.
        </p>
      )}
      {estado === "sin_micro" && (
        <p className="pc-help">
          Este navegador no deja grabar. <strong>Puedes escribirlo</strong> en el campo de arriba.
        </p>
      )}
      {estado === "error" && (
        <>
          <p className="pc-error" role="alert">
            No pudimos guardar la grabación. Puedes escribirlo mientras tanto.
          </p>
          <button type="button" className="pc-action pc-voice-trigger" onClick={() => setEstado("listo")}>
            Intentar otra vez
          </button>
        </>
      )}
    </div>
  );
}
