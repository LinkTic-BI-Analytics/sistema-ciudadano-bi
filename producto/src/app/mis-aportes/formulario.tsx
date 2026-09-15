"use client";

import { useActionState } from "react";
import { consultar, type Consulta } from "./acciones.ts";

const COMO_VA: Record<string, string> = {
  por_aclarar: "Estamos aclarando dónde ocurre lo que contaste.",
  confirmada: "Ya confirmamos dónde ocurre.",
  desconocida: "No pudimos ubicarlo todavía.",
};

export function Consultar() {
  const [r, accion, consultando] = useActionState<Consulta | null, FormData>(consultar, null);

  return (
    <>
      <form action={accion} noValidate>
        <div className="pc-field">
          <label className="pc-label" htmlFor="codigo">Tu código</label>
          <input id="codigo" name="codigo" className="pc-input" type="text"
                 autoComplete="off" spellCheck={false} aria-describedby="codigo-ayuda" />
          <p className="pc-help" id="codigo-ayuda">
            El que te dimos cuando enviaste tu aporte. Puedes escribirlo con espacios o en
            minúscula: da igual.
          </p>
        </div>
        <button type="submit" className="pc-action" disabled={consultando}>
          {consultando ? "Buscando…" : "Consultar"}
        </button>
      </form>

      {r?.estado === "sin_resultado" && (
        // No es un error: es una respuesta. Y dice lo mismo para un código que
        // no existe y para uno mal escrito, a propósito.
        <p className="pc-empty" data-prueba="sin-resultado" aria-live="polite">
          No encontramos nada con ese código. Revisa que esté completo — son doce caracteres.
        </p>
      )}

      {r?.estado === "encontrado" && (
        <section className="pc-summary-item" aria-live="polite">
          <h2 className="pc-summary-head">Esto fue lo que nos contaste</h2>
          <p className="pc-summary-text" data-prueba="relato">{r.relato}</p>
          {r.canal === "voz_transcrita" && (
            // Que sepa que lo suyo entró hablando: el texto de arriba es lo que
            // entendió una máquina, y su grabación es el original (ADR 0013).
            <p className="pc-meta">
              Lo contaste hablando. <strong>Tu grabación es el original</strong>; lo de arriba es
              lo que entendimos de ella.
            </p>
          )}

          {/* **Todo lo que quedó registrado, devuelto.** Antes solo veía el
              relato y el lugar, y había contestado el doble. No poder ver lo
              que uno mismo contó es lo que hace dejar de creer que sirvió. */}
          <dl className="pc-detail-facts" data-prueba="lo-registrado">
            {r.municipio && (<><dt>Municipio</dt><dd>{r.municipio}</dd></>)}
            {r.lugarDeclarado && (<><dt>Dónde dijiste que ocurre</dt><dd>{r.lugarDeclarado}</dd></>)}
            {r.afectados && (<><dt>A quiénes les pasa</dt><dd>{r.afectados}</dd></>)}
            {r.desdeCuando && (<><dt>Desde cuándo</dt><dd>{r.desdeCuando}</dd></>)}
            {r.colectivo && (<><dt>Dijiste hablar por</dt><dd>{r.colectivo}</dd></>)}
            {r.sintesis && (<><dt>Lo que quedó escrito</dt><dd>{r.sintesis}</dd></>)}
          </dl>
          <p className="pc-status">{COMO_VA[r.estadoUbicacion ?? ""] ?? "Está en revisión."}</p>
          <p className="pc-help">
            Que esté registrado no significa que se haya resuelto ni que haya un compromiso de
            obra.
          </p>
        </section>
      )}
    </>
  );
}
