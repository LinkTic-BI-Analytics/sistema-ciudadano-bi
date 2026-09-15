"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { enviarAporte, type Resultado } from "./acciones.ts";
import { claveEnvioVigente, olvidarClaveEnvio } from "../../captura/clave-envio.ts";
import { hayIndicio, ORIENTACION } from "../../alerta/urgencia.ts";
import { Afinado } from "./afinado.tsx";
import { Microfono } from "./microfono.tsx";
import { LLAVE_RELATO } from "../../captura/contexto.ts";
import { leerContextoEvento, type ContextoEvento } from "../e/contexto.ts";

export function Formulario({ claveDeReserva }: {
  /**
   * La clave que el servidor dibujó en el HTML, para que el formulario se pueda
   * enviar desde el primer instante y no solo después de hidratar.
   *
   * La página es dinámica (`force-dynamic`), así que es distinta en cada visita:
   * si se cacheara, todo el mundo compartiría la misma y `I1` juntaría aportes
   * de personas distintas en uno.
   */
  claveDeReserva: string;
}) {
  const [resultado, accion, enviando] = useActionState<Resultado | null, FormData>(
    enviarAporte, null,
  );
  const [modo, setModo] = useState<"escribir" | "hablar">("escribir");
  // **El relato vive aquí y no en el campo.** Es lo que hace que cambiar de modo
  // no lo borre — `direccion-visual.md` lo pide, y perder lo escrito al tocar un
  // botón es la forma más rápida de que alguien abandone.
  const [relato, setRelato] = useState("");
  // **La caja no la controla React, y es a propósito.**
  //
  // Iba con `value={relato}`, y eso significa que lo que alguien escriba antes
  // de que el navegador hidrate **se pierde**: React toma el control, ve su
  // estado vacío y borra la caja. Quien tecleó deprisa en un teléfono lento
  // veía «cuéntanos qué está pasando» después de haber contado.
  //
  // Con `defaultValue` React no pisa el DOM, así que lo escrito sobrevive. El
  // estado sigue existiendo —lo necesita `hayIndicio` mientras escribe— pero es
  // un espejo, no la fuente. Quien escriba ahí desde el código tiene que usar
  // `ponerRelato`, que mueve los dos.
  const caja = useRef<HTMLTextAreaElement>(null);
  function ponerRelato(texto: string) {
    setRelato(texto);
    if (caja.current) caja.current.value = texto;
  }
  // Lo que ya estuviera escrito al hidratar pasa al estado: si no, la
  // orientación de urgencia (`V13`) no vería las primeras palabras.
  useEffect(() => {
    const escrito = caja.current?.value;
    if (escrito) setRelato(escrito);
  }, []);
  // **Llega dibujada desde el servidor.** Empezaba vacía y se llenaba en el
  // primer efecto: si alguien enviaba antes de que el navegador hidratara —un
  // teléfono lento, una red mala— el campo iba vacío, el servidor rechazaba el
  // aporte y la persona veía «algo falló al preparar el envío». Con una sola
  // oportunidad de escuchar a alguien (ADR 0012), eso es perderla.
  const [clave, setClave] = useState(claveDeReserva);
  // La grabación, si habló. Va con el envío: el aporte apunta a ella porque
  // **es el original** (ADR 0013).
  const [grabacion, setGrabacion] = useState("");
  // El contexto del QR, si entró por uno. **El origen no se reescribe**: lo que
  // la persona confirme cambia el evento, nunca de dónde vino el enlace.
  const [evento, setEvento] = useState<ContextoEvento | null>(null);
  useEffect(() => setEvento(leerContextoEvento()), []);
  const resumen = useRef<HTMLDivElement>(null);
  // **Se evalúa mientras escribe, no al enviar.** Alguien que está reportando un
  // derrumbe no debería tener que terminar un formulario para ver a dónde
  // llamar. `V13`: la orientación se muestra «sin exigir que termine».
  const indicio = hayIndicio(relato);

  // Se adopta la del servidor si no había ninguna guardada: así la clave no
  // cambia entre lo que se envió antes de hidratar y lo que se reintenta
  // después, que es lo que hace que `I1` cuente un solo aporte.
  useEffect(() => setClave(claveEnvioVigente({ reserva: claveDeReserva })), [claveDeReserva]);

  // Si viene de terminar otro aporte donde contó varias cosas, la caja llega con
  // la que quedó pendiente. Va por `sessionStorage` y no por la dirección: un
  // relato en la URL acaba en los registros del servidor.
  useEffect(() => {
    try {
      const otro = sessionStorage.getItem(LLAVE_RELATO);
      if (otro) { ponerRelato(otro); sessionStorage.removeItem(LLAVE_RELATO); }
    } catch { /* sin storage, la caja empieza vacía y no pasa nada */ }
  }, []);

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
      <input type="hidden" name="grabacion" value={grabacion} readOnly />
      {evento && (
        <>
          <input type="hidden" name="enlace" value={evento.enlaceId} readOnly />
          <input type="hidden" name="eventoConfirmado" value={evento.eventoConfirmadoId ?? ""} readOnly />
          <input type="hidden" name="estadoContexto" value={evento.estado} readOnly />
          <input type="hidden" name="utms" value={JSON.stringify(evento.utms ?? null)} readOnly />
        </>
      )}

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
        <Microfono
          onTranscripcion={(texto, id) => {
            // **Se añade, no se reemplaza.** Si ya había escrito algo, borrarlo
            // castiga a quien empezó a teclear y se cansó — que es justo quien
            // más necesita hablar.
            ponerRelato(relato.trim() ? `${relato.trim()}\n${texto}` : texto);
            setGrabacion(id);
            setModo("escribir");
          }}
        />
      )}

      <div className="pc-field">
        <label className="pc-label" htmlFor="relato">¿Qué está pasando?</label>
        <textarea
          id="relato" name="relato" className="pc-input" rows={6}
          ref={caja} defaultValue="" onChange={(e) => setRelato(e.target.value)}
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
