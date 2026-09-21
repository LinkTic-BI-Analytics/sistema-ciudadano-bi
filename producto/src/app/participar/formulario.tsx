"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { enviarAporte, type Resultado } from "./acciones.ts";
import { claveEnvioVigente, olvidarClaveEnvio } from "../../captura/clave-envio.ts";
import { hayIndicio, ORIENTACION } from "../../alerta/urgencia.ts";
import { Afinado } from "./afinado.tsx";
import { Microfono } from "./microfono.tsx";
import { Llamada } from "./llamada.tsx";
import { LLAVE_RELATO } from "../../captura/contexto.ts";
import { leerContextoEvento, type ContextoEvento } from "../e/contexto.ts";
import { IconoEscribir, IconoLlamada, IconoMicrofono, IconoTelefono } from "../../producto/iconos.tsx";

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
  // **«Te llamamos» es un modo más, no otra pantalla.** Quien no puede escribir
  // y tampoco quiere grabar tiene que encontrar la salida en el mismo sitio
  // donde ya está mirando, no detrás de un enlace en el pie.
  const [modo, setModo] = useState<"escribir" | "hablar" | "llamada">("escribir");
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
    <>
      {indicio && (
        // Sale de más, nunca de menos: un falso positivo es un número de más en
        // la pantalla; un falso negativo es alguien en peligro que no lo ve.
        //
        // **Fuera del formulario, y por eso se ve en los tres modos.** Estaba
        // dentro: quien escribía un indicio y luego tocaba «Te llamamos» perdía
        // el 123 de vista justo cuando más falta le hacía. `V13` pide que la
        // orientación se muestre «sin exigir que termine», y cambiar de modo no
        // es terminar.
        <div className="pc-callout" role="alert" data-prueba="orientacion">
          <p><strong>{ORIENTACION}</strong></p>
          {/* El icono del teléfono y nada más: el texto de `ORIENTACION` es el
              acordado en `V13` y no se toca ni se le añade nada. */}
          <a className="pc-action" href="tel:123"><IconoTelefono />Llamar al 123</a>
          <p className="pc-help">
            Lo que ya escribiste se conserva. Puedes llamar y volver.
          </p>
        </div>
      )}

      {/* **El selector vive fuera de los dos formularios.** «Te llamamos» tiene
          el suyo, y un formulario dentro de otro no es HTML válido: al enviar el
          de adentro se enviaba también el de afuera. */}
      {/* Los tres modos, con su icono. `.pc-mode svg` está dimensionado en la
          hoja desde el principio y no había ninguno: tres palabras sueltas en
          una barra gris no se leen como tres formas de hacer lo mismo.
          El texto no cambia — es el nombre por el que se llaman. */}
      <div className="pc-modes" role="group" aria-label="Cómo quieres contarlo">
        <button type="button" className="pc-mode" aria-pressed={modo === "escribir"}
                onClick={() => setModo("escribir")}><IconoEscribir />Escribir</button>
        <button type="button" className="pc-mode" aria-pressed={modo === "hablar"}
                onClick={() => setModo("hablar")}><IconoMicrofono />Hablar</button>
        <button type="button" className="pc-mode" aria-pressed={modo === "llamada"}
                onClick={() => setModo("llamada")}><IconoLlamada />Te llamamos</button>
      </div>

      {modo === "llamada" && <Llamada />}

      {/* **Se oculta, no se desmonta.** La caja del relato no la controla React
          —lleva `defaultValue` para no perder lo que alguien teclee antes de
          hidratar— así que desmontarla borraría lo escrito. Con `hidden` el
          texto sigue ahí cuando vuelva a «Escribir», que es lo que
          `direccion-visual.md` pide de cambiar de modo. */}
      <form action={accion} noValidate hidden={modo === "llamada"}>
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
    </>
  );
}
