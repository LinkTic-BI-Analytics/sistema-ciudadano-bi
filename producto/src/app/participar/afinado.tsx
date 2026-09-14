"use client";

import { useActionState, useEffect, useState } from "react";
import { confirmarLectura, completarSintesis, prepararLectura, type PasoAfinado } from "./acciones.ts";
import type { Lectura } from "../../captura/lectura.ts";

// Afinar lo que la persona contó, en dos vueltas cortas y **después** de que el
// aporte ya está recibido.
//
// El orden no es una preferencia de pantalla. `N02` y `DAT-01` dicen que la
// recepción no depende de nada más, así que el comprobante sale primero y se
// queda a la vista mientras se afina: quien abandone aquí ya tiene con qué
// consultar lo suyo.
//
// Por qué dos vueltas y no un formulario de cinco campos: la primera devuelve lo
// que la persona ya dijo y solo pide confirmarlo; la segunda pide lo único que
// no dijo. Son dos preguntas distintas —*¿es esto?* y *¿qué falta?*— y juntarlas
// convierte una confirmación en un trámite.
//
// **Tope de tres cajas por vuelta.** No es estética: cada campo más es gente que
// cierra la pestaña, y a quien esto quiere escuchar es justamente a quien no
// tiene paciencia para un formulario.

function Error_({ paso }: { paso: PasoAfinado | null }) {
  if (!paso || paso.ok) return null;
  return <p className="pc-error" role="alert">{paso.error}</p>;
}

export function Afinado({ codigo, lectura }: { codigo: string; lectura: Lectura }) {
  const [vuelta, setVuelta] = useState<1 | 2 | 3>(1);
  // La lectura empieza siendo la segmentación y se reemplaza cuando llega la de
  // Mistral. **Se espera a que llegue antes de mostrar la vuelta 1**: enseñar
  // una lectura y cambiarla debajo de quien la está leyendo es peor que
  // esperarle dos segundos, y el comprobante ya está arriba mientras tanto.
  const [leyendo, setLeyendo] = useState(true);
  const [lect, setLect] = useState<Lectura>(lectura);
  const [corrigiendo, setCorrigiendo] = useState(false);
  // El problema vigente: el nuestro hasta que la persona lo cambie. Va a la
  // segunda vuelta para componer la síntesis completa sin volver a la base.
  const [problema, setProblema] = useState(lectura.problema);
  useEffect(() => setProblema(lect.problema), [lect]);

  const [r1, accion1, guardando1] = useActionState<PasoAfinado | null, FormData>(confirmarLectura, null);
  const [r2, accion2, guardando2] = useActionState<PasoAfinado | null, FormData>(completarSintesis, null);

  useEffect(() => {
    let vigente = true;
    prepararLectura(codigo)
      .then((l) => { if (vigente && l) setLect(l); })
      .finally(() => { if (vigente) setLeyendo(false); });
    return () => { vigente = false; };
  }, [codigo]);

  useEffect(() => { if (r1?.ok) setVuelta(2); }, [r1]);
  useEffect(() => { if (r2?.ok) setVuelta(3); }, [r2]);

  if (vuelta === 3) {
    return (
      <section className="pc-success" data-prueba="afinado-listo" aria-live="polite">
        <h2>Listo. Gracias por afinarlo</h2>
        <p>
          Quedó registrado con tus palabras. <strong>Nadie va a reescribir lo que contaste</strong>:
          lo que afinaste se guarda aparte del relato original, y las dos cosas se conservan.
        </p>
        <a className="pc-action" href="/mis-aportes">Consultar mi aporte</a>
      </section>
    );
  }

  return (
    <section className="pc-refine" data-prueba="afinar">
      <p className="pc-help">
        Tu aporte <strong>ya quedó registrado</strong>. Lo que sigue es opcional y son dos pasos
        cortos: nos ayuda a entenderlo mejor, y puedes irte cuando quieras.
      </p>

      {leyendo && (
        <p className="pc-help" data-prueba="leyendo" aria-live="polite">
          Separando lo que contaste…
        </p>
      )}

      {!leyendo && vuelta === 1 && (
        <div data-prueba="vuelta-1">
          <h2>Esto es lo que entendimos</h2>

          {!corrigiendo ? (
            <>
              {/* Se le devuelve **lo que dijo**, no una interpretación. La
                  pantalla no dice «creemos entender»: dice esto es lo que nos
                  contaste, porque eso es exactamente lo que hay. */}
              <blockquote className="pc-quote">{problema}</blockquote>
              {lect.lugar && (
                <p>Y que ocurre en: <strong>{lect.lugar}</strong>.</p>
              )}
              <p className="pc-help">
                Lo separamos así para poder revisarlo. Si no es eso, corrígelo — mandas tú.
              </p>
              <Error_ paso={r1} />
              <form action={accion1}>
                <input type="hidden" name="codigo" value={codigo} readOnly />
                <input type="hidden" name="corrigio" value="no" readOnly />
                <input type="hidden" name="mostrado" value={problema} readOnly />
                <button type="submit" className="pc-action" disabled={guardando1}>
                  {guardando1 ? "Guardando…" : "Sí, es eso"}
                </button>
              </form>
              <button type="button" className="pc-mode" onClick={() => setCorrigiendo(true)}>
                No es eso — déjame corregirlo
              </button>
            </>
          ) : (
            <form action={accion1}>
              <input type="hidden" name="codigo" value={codigo} readOnly />
              <input type="hidden" name="corrigio" value="si" readOnly />
              <input type="hidden" name="mostrado" value={lect.problema} readOnly />
              <div className="pc-field">
                <label className="pc-label" htmlFor="problema-correccion">
                  Escríbelo con tus palabras
                </label>
                {/* **Llega con lo que ya había escrito, no en blanco.** La
                    especificación lo pide literal —«conservar texto ya
                    escrito»— y vaciarlo castiga justamente a quien se tomó el
                    trabajo de corregirnos. */}
                <textarea id="problema-correccion" name="problema" className="pc-input" rows={4}
                          defaultValue={problema}
                          onChange={(e) => setProblema(e.target.value)} />
              </div>
              <Error_ paso={r1} />
              <button type="submit" className="pc-action" disabled={guardando1}>
                {guardando1 ? "Guardando…" : "Guardar y seguir"}
              </button>
            </form>
          )}
        </div>
      )}

      {vuelta === 2 && (
        <div data-prueba="vuelta-2">
          <h2>Nos falta una cosa</h2>
          <form action={accion2}>
            <input type="hidden" name="codigo" value={codigo} readOnly />
            <input type="hidden" name="problema" value={problema} readOnly />
            <div className="pc-field">
              <label className="pc-label" htmlFor="resultado">¿Qué debería cambiar?</label>
              {/* Si la persona ya dijo qué debería cambiar, la caja llega con
                  sus palabras y solo tiene que confirmarlas. Si no lo dijo,
                  llega vacía: rellenarla con una suposición nuestra sería
                  ponerle un deseo en la boca. */}
              <input id="resultado" name="resultado" className="pc-input" type="text"
                     defaultValue={lect.resultadoEsperado ?? ""}
                     aria-describedby="resultado-ayuda" />
              <p className="pc-help" id="resultado-ayuda">
                Cómo se vería si esto estuviera resuelto.
              </p>
            </div>
            <div className="pc-field">
              <label className="pc-label" htmlFor="solucion">¿Se te ocurre cómo? <span className="pc-help">· opcional</span></label>
              <input id="solucion" name="solucion" className="pc-input" type="text"
                     defaultValue={lect.solucionSugerida ?? ""}
                     aria-describedby="solucion-ayuda" />
              <p className="pc-help" id="solucion-ayuda">
                <strong>No hace falta proponer una solución</strong> para que el problema se
                escuche. Si no se te ocurre ninguna, déjalo en blanco.
              </p>
            </div>
            <Error_ paso={r2} />
            <button type="submit" className="pc-action" disabled={guardando2}>
              {guardando2 ? "Guardando…" : "Listo"}
            </button>
            <button type="button" className="pc-mode" onClick={() => setVuelta(3)}>
              Saltar esto
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
