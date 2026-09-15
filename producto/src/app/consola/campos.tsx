// Un campo con su etiqueta **visible**.
//
// La etiqueta no es el placeholder, y esta consola se construyó como si lo
// fuera. Un placeholder desaparece en cuanto la persona escribe, un lector de
// pantalla no lo anuncia como nombre del campo, y en gris sobre blanco no pasa
// el contraste que el propio sistema de diseño valida.
//
// La pantalla ciudadana tiene una prueba contra esto desde el primer día
// —«el campo de relato tiene etiqueta visible, no solo placeholder»— y la
// consola cayó justo en lo que esa prueba impide afuera.
//
// El otro error que esto corrige: `.bo-search-field` es el **contenedor** de
// una caja de búsqueda con icono (`position:relative` y un `svg` encima), no
// una clase para el `<input>`. Puesta en el campo no hace nada, y al usarla en
// su lugar los campos se quedaron sin `.bo-field`, que es lo único que les da
// separación. Por eso se veían pegados unos a otros.

import type { ReactNode } from "react";

function Envoltura({ id, etiqueta, opcional, ayuda, ejemplo, children }: {
  id: string; etiqueta: string; opcional?: boolean; ayuda?: string; ejemplo?: string;
  children: ReactNode;
}) {
  return (
    <div className="bo-field">
      <label className="bo-label-tag" htmlFor={id}>
        {etiqueta}
        {opcional && <span className="bo-muted"> · opcional</span>}
      </label>
      {children}
      {(ayuda || ejemplo) && (
        <p className="bo-small">
          {ayuda}
          {ayuda && ejemplo && " "}
          {ejemplo && <span className="bo-muted">Por ejemplo: {ejemplo}</span>}
        </p>
      )}
    </div>
  );
}

export function Campo({ id, name, etiqueta, opcional, ayuda, ejemplo, defaultValue }: {
  id: string; name: string; etiqueta: string;
  opcional?: boolean; ayuda?: string; ejemplo?: string; defaultValue?: string;
}) {
  return (
    <Envoltura id={id} etiqueta={etiqueta} opcional={opcional} ayuda={ayuda}>
      {/* `required` va por ausencia de `opcional`: un campo obligatorio que no
          lo dice hasta que fallas es una trampa. */}
      {/* **Sin `placeholder`.** En una pantalla de revisión, un ejemplo que es
          una frase plausible sobre otro caso se lee como el dato de este: el
          campo «la afectación» salía con «sin agua en la parte alta desde hace
          tres meses» sobre un aporte de canchas rotas en Tunja.

          El ejemplo va debajo, dicho como lo que es. */}
      <input id={id} name={name} required={!opcional} defaultValue={defaultValue} />
    </Envoltura>
  );
}

export function Opciones({ id, name, etiqueta, opcional, ayuda, defaultValue, children }: {
  id: string; name: string; etiqueta: string;
  opcional?: boolean; ayuda?: string;
  /** Lo que ya está puesto. Corregir algo empieza por ver qué hay. */
  defaultValue?: string;
  children: ReactNode;
}) {
  return (
    <Envoltura id={id} etiqueta={etiqueta} opcional={opcional} ayuda={ayuda}>
      <select id={id} name={name} required={!opcional} defaultValue={defaultValue ?? ""}>
        {children}
      </select>
    </Envoltura>
  );
}
