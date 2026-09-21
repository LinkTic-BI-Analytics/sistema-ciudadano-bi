"use client";

import { useActionState } from "react";
import { ingresar, type Intento } from "./acciones.ts";
import { IconoIngresar } from "../../producto/iconos.tsx";

export function FormularioIngreso({ siguiente }: { siguiente: string }) {
  const [intento, accion, revisando] = useActionState<Intento, FormData>(ingresar, null);
  return (
    <form action={accion}>
      <input type="hidden" name="siguiente" value={siguiente} />
      <div className="bo-field">
        <label className="bo-label-tag" htmlFor="token">Token de acceso</label>
        {/* `password`: el token se escribe con gente alrededor, en una sala o
            compartiendo pantalla. */}
        <input id="token" name="token" type="password" autoComplete="current-password" required
               aria-invalid={intento ? true : undefined}
               aria-describedby={intento ? "token-error" : undefined} />
      </div>
      {intento && <p id="token-error" className="bo-error" role="alert">{intento.error}</p>}
      <button type="submit" className="bo-button" data-variant="primary" disabled={revisando}>
        <IconoIngresar />
        {revisando ? "Revisando…" : "Ingresar"}
      </button>
    </form>
  );
}
