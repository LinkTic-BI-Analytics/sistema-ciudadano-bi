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

function Envoltura({ id, etiqueta, opcional, ayuda, children }: {
  id: string; etiqueta: string; opcional?: boolean; ayuda?: string; children: ReactNode;
}) {
  return (
    <div className="bo-field">
      <label className="bo-label-tag" htmlFor={id}>
        {etiqueta}
        {opcional && <span className="bo-muted"> · opcional</span>}
      </label>
      {children}
      {ayuda && <p className="bo-small">{ayuda}</p>}
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
      <input id={id} name={name} required={!opcional} placeholder={ejemplo}
             defaultValue={defaultValue} />
    </Envoltura>
  );
}

export function Opciones({ id, name, etiqueta, opcional, ayuda, children }: {
  id: string; name: string; etiqueta: string;
  opcional?: boolean; ayuda?: string; children: ReactNode;
}) {
  return (
    <Envoltura id={id} etiqueta={etiqueta} opcional={opcional} ayuda={ayuda}>
      <select id={id} name={name} required={!opcional} defaultValue="">{children}</select>
    </Envoltura>
  );
}
