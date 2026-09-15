"use client";

import { useState } from "react";
import { guardarContextoEvento } from "../contexto.ts";

// La pregunta que hace `QR-02`, con sus tres salidas:
//
//   > Este enlace corresponde a «Encuentro de agua — Municipio A — 20 de
//   > octubre». ¿Es el encuentro en el que quieres participar?
//
// **Sí, continuar · Cambiar de evento · Aportar sin estar en un evento.**
//
// Lo que no hace, y es la mitad del requerimiento: **no afirma «estás aquí» ni
// «asististe» por abrir el QR.** Un enlace reenviado por un vecino no prueba
// que nadie haya ido a ningún sitio.

export function Confirmar({
  enlaceId, eventoOrigenId, tituloOrigen, utms, puedeAsistir, agenda,
}: {
  enlaceId: string;
  eventoOrigenId: string;
  tituloOrigen: string;
  utms: Record<string, string> | null;
  puedeAsistir: boolean;
  agenda: { id: string; titulo: string; cuando: string }[];
}) {
  const [cambiando, setCambiando] = useState(false);

  function seguir(eventoConfirmadoId: string | null, estado: "confirmado" | "cambiado" | "sin_evento") {
    // El origen **no se reescribe nunca**: «la corrección del evento no
    // reescribe el enlace inicial». Saber por dónde circuló el material es
    // justamente lo que permite arreglar la difusión.
    guardarContextoEvento({ enlaceId, eventoOrigenId, eventoConfirmadoId, estado, utms });
    location.href = "/participar";
  }

  if (cambiando) {
    return (
      <div data-prueba="cambiar-evento">
        <h2>¿En cuál estás?</h2>
        <p className="pc-help">
          Estos son los encuentros publicados. Si no está el tuyo, puedes contar lo tuyo sin
          evento: <strong>tu aporte cuenta igual</strong>.
        </p>
        <div className="pc-actions">
          {agenda.map((e) => (
            <button key={e.id} type="button" className="pc-action"
                    onClick={() => seguir(e.id, e.id === eventoOrigenId ? "confirmado" : "cambiado")}>
              {e.titulo} · {e.cuando}
            </button>
          ))}
        </div>
        <button type="button" className="pc-text-action" onClick={() => setCambiando(false)}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div data-prueba="confirmar-evento">
      {puedeAsistir ? (
        <>
          <h2>¿Es este el encuentro en el que quieres participar?</h2>
          <p className="pc-help">
            Este enlace corresponde a «{tituloOrigen}». <strong>Abrirlo no te inscribe ni registra
            que hayas asistido</strong> — puede que te lo haya reenviado alguien.
          </p>
          <div className="pc-actions">
            <button type="button" className="pc-action" onClick={() => seguir(eventoOrigenId, "confirmado")}>
              Sí, continuar
            </button>
            <button type="button" className="pc-text-action" onClick={() => setCambiando(true)}>
              Cambiar de evento
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>Puedes contar lo tuyo igual</h2>
          <p className="pc-help">
            Este encuentro no está disponible, pero <strong>tu aporte no depende de él</strong>.
          </p>
        </>
      )}
      <button type="button" className="pc-text-action" onClick={() => seguir(null, "sin_evento")}>
        Aportar sin estar en un evento
      </button>
    </div>
  );
}
