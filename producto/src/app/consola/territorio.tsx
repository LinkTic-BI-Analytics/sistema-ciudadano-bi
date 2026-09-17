"use client";

import { useState } from "react";
import type { Opciones } from "../../revision/bandeja.ts";

/**
 * Departamento y municipio, **encadenados**.
 *
 * Los dos desplegables vivían dentro del formulario de servidor, y el de
 * municipios se acotaba leyendo el departamento **de la dirección**. La
 * consecuencia era que escoger un departamento no hacía nada hasta darle a
 * «Filtrar»: hasta ese momento seguían ofreciéndose los municipios de todo el
 * país, y se podía pedir Cogua —de Cundinamarca— con Antioquia escogido. Eso no
 * es un filtro con dos campos: son dos filtros que no se hablan, y la
 * combinación imposible devuelve cero aportes sin decir por qué.
 *
 * Por eso esto es lo único de la bandeja que corre en el navegador: la cadena
 * tiene que responder **al escoger**, no al enviar.
 *
 * **Sin JavaScript sigue funcionando**, y no es un adorno: el municipio se
 * habilita igual cuando el departamento ya viene en la dirección, que es lo que
 * pasa después de cualquier «Filtrar». Se pierde la reacción inmediata, no la
 * regla.
 *
 * Dos decisiones que van juntas y hay que mirarlas juntas:
 *
 *   · **el municipio nace deshabilitado.** Un desplegable con los municipios de
 *     veintidós departamentos revueltos no es una lista para escoger: es una
 *     lista para buscar, y quien revisa ya sabe de qué departamento habla.
 *   · **cambiar de departamento borra el municipio.** Dejarlo puesto es
 *     exactamente cómo se arma la combinación que no devuelve nada.
 *
 * El estado vive aquí, pero **lo que manda sigue siendo la dirección**: los dos
 * campos se envían con el formulario y la bandeja se sigue pudiendo compartir
 * por enlace, que es media razón de que exista.
 */
export function Territorio({
  opciones, departamento, municipio,
}: {
  opciones: Opciones;
  departamento: string;
  municipio: string;
}) {
  // **Un enlace viejo con solo el municipio sigue sirviendo.** Se deduce su
  // departamento y el desplegable aparece escogido: sin esto, una dirección
  // `?municipio=25200` se vería con el municipio apagado y la lista filtrada
  // por Cogua igual — la pantalla diciendo una cosa y los resultados otra.
  const [dep, setDep] = useState(
    departamento || opciones.municipios.find((m) => m.codigo === municipio)?.departamento || "",
  );
  const [mun, setMun] = useState(municipio);

  // Sin departamento la lista va vacía, no completa: el desplegable está
  // deshabilitado y ofrecer ahí dentro los 52 municipios sueltos sería
  // prometer algo que no se puede escoger.
  const suyos = dep ? opciones.municipios.filter((m) => m.departamento === dep) : [];
  const nombreDep = opciones.departamentos.find((d) => d.codigo === dep)?.nombre;

  return (
    <>
      <div className="bo-field">
        <label className="bo-label-tag" htmlFor="departamento">Departamento</label>
        <select id="departamento" name="departamento" value={dep}
                onChange={(e) => { setDep(e.target.value); setMun(""); }}>
          <option value="">Todos</option>
          {opciones.departamentos.map((d) => (
            <option key={d.codigo} value={d.codigo}>{d.nombre}</option>
          ))}
        </select>
      </div>

      <div className="bo-field">
        <label className="bo-label-tag" htmlFor="municipio">Municipio</label>
        {/* Deshabilitado, el navegador no lo envía: la dirección queda sin
            `municipio` en vez de arrastrar uno viejo, que es lo mismo que se
            quiere evitar. */}
        <select id="municipio" name="municipio" value={mun} disabled={!dep}
                aria-describedby="municipio-ayuda"
                onChange={(e) => setMun(e.target.value)}>
          <option value="">{dep ? "Todos" : "Escoge un departamento"}</option>
          {suyos.map((m) => (
            <option key={m.codigo} value={m.codigo}>{m.nombre}</option>
          ))}
        </select>
        {/* **Por qué está apagado, dicho.** Un control deshabilitado y mudo se
            lee como una pantalla rota; con la razón al lado se lee como un
            orden. */}
        <p className="bo-small" id="municipio-ayuda">
          {!dep
            ? "Primero el departamento."
            : suyos.length === 0
              ? "No hay aportes ubicados en ese departamento."
              : `Los ${suyos.length} de ${nombreDep} donde llegó algo.`}
        </p>
      </div>
    </>
  );
}
