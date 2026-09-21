"use client";

import { useFormStatus } from "react-dom";

/**
 * El botón de un formulario que dice cuándo está trabajando.
 *
 * La ficha de un aporte tiene **ocho formularios** y ninguno daba señal de
 * nada: se pulsaba «Aceptar el municipio», el servidor hacía su trabajo,
 * revalidaba la ruta y volvía a pintar la página. Entre una cosa y la otra la
 * pantalla se quedaba exactamente igual, con el botón intacto. Quien revisa
 * cuarenta aportes al día vuelve a pulsar, y volver a pulsar en un formulario
 * que ya se envió es cómo se abren dos expedientes para el mismo aporte.
 *
 * **Por qué `useFormStatus` y no `useActionState`.** `useActionState` cambia la
 * firma de la acción —`(previo, datos)` en vez de `(datos)`— y estas ocho son
 * acciones de servidor con su contrato escrito, sus permisos pendientes y sus
 * pruebas. `useFormStatus` lee el estado del `<form>` que lo contiene **sin
 * tocar la acción**: el servidor no se entera de que este componente existe.
 *
 * Tiene que ser hijo del `<form>`, no el `<form>` mismo: lee el contexto que el
 * formulario publica, y desde fuera ese contexto no existe.
 *
 * **El rótulo cambia, y eso es a propósito.** Un botón que solo se apaga se lee
 * como un botón roto. Los recorridos lo localizan por su nombre de reposo, que
 * es el que está puesto cuando alguien va a pulsarlo.
 */
export function BotonEnvio({
  children, mientras, variante,
}: {
  /** Lo que dice en reposo. Es el nombre por el que se le llama. */
  children: string;
  /** Lo que dice mientras el servidor trabaja. */
  mientras: string;
  variante?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  return (
    <button className="bo-button" data-variant={variante} disabled={pending}>
      {pending ? mientras : children}
    </button>
  );
}
