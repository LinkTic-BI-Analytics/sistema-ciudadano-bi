"use client";

import Link from "next/link";
import { useEffect, useState, type SyntheticEvent } from "react";
import {
  IconoAbrirBarra, IconoAgenda, IconoBandeja, IconoDesplegar, IconoExpediente, IconoLugar,
  IconoMenu, IconoPlegarBarra, IconoQuitar, IconoUrgencia, IconoVolver,
} from "./iconos.tsx";

/**
 * La barra lateral del perfil interno.
 *
 * Es cliente por tres razones, y las tres son estado: bajo 48rem la
 * navegación se pliega detrás de un botón «Menú»; cada grupo —Revisión,
 * Convocatoria— se despliega y se recoge con su cabecera; y la barra entera
 * se puede plegar a un riel de iconos para ganar ancho en la tabla. Lo que
 * cada quien deja abierto o cerrado se recuerda en su navegador, y en nada
 * más: es una comodidad, no un dato.
 *
 * ## Lo que se ve
 *
 * Navy casi negro en los dos modos, como el pie de la portada: el lienzo dejó
 * de ser navy y la barra es el único sitio del interno donde la marca conserva
 * su azul. Cada renglón es icono en un disco tintado —dorado para revisión,
 * azul para convocatoria— más su rótulo, con aire entre los dos; el activo se
 * llena y lleva una barra dorada al borde. El aviso de permisos es una tarjeta
 * ámbar con icono, no un párrafo suelto.
 *
 * Las vistas siguen siendo la misma bandeja con un filtro puesto; por eso son
 * direcciones de `/consola` y no rutas. Y sigue sin haber recuentos al lado
 * de cada una: cada recuento es una consulta más por pantalla.
 */

/** La vista activa. `null` en una pantalla de detalle, que no es ninguna. */
export type VistaInterna =
  | "bandeja" | "por-aclarar" | "sin-expediente" | "urgentes" | "convocatoria" | null;

type Renglon = { clave: string; rotulo: string; href: string; Icono: typeof IconoBandeja };

const GRUPOS: ReadonlyArray<{ id: string; rotulo: string; renglones: ReadonlyArray<Renglon> }> = [
  {
    id: "revision", rotulo: "Revisión", renglones: [
      { clave: "bandeja", rotulo: "Todo lo que llegó", href: "/consola", Icono: IconoBandeja },
      { clave: "por-aclarar", rotulo: "Falta el lugar", href: "/consola?ubicacion=por_aclarar", Icono: IconoLugar },
      { clave: "sin-expediente", rotulo: "Sin expediente", href: "/consola?gestion=sin_expediente", Icono: IconoExpediente },
      { clave: "urgentes", rotulo: "Con alerta", href: "/consola?alerta=1", Icono: IconoUrgencia },
    ],
  },
  {
    id: "convocatoria", rotulo: "Convocatoria", renglones: [
      { clave: "convocatoria", rotulo: "Encuentros y materiales", href: "/administracion", Icono: IconoAgenda },
    ],
  },
];

/** Lo que cada quien dejó abierto, en su navegador. Sin navegador, el valor por defecto. */
function recordado(llave: string, porDefecto: boolean): boolean {
  try {
    const v = localStorage.getItem(llave);
    return v === null ? porDefecto : v === "1";
  } catch { return porDefecto; }
}
function recordar(llave: string, valor: boolean) {
  try { localStorage.setItem(llave, valor ? "1" : "0"); } catch { /* sin storage, no se recuerda y no pasa nada */ }
}

/**
 * Un grupo desplegable. Va abierto al llegar, y **siempre** abierto si tiene
 * la vista activa dentro: plegar el grupo donde estás sería esconderte.
 */
function Grupo({ id, rotulo, renglones, vista }: {
  id: string; rotulo: string; renglones: ReadonlyArray<Renglon>; vista: VistaInterna;
}) {
  const contieneActiva = renglones.some((r) => r.clave === vista);
  const [abierto, setAbierto] = useState(true);
  useEffect(() => {
    if (!contieneActiva) setAbierto(recordado(`pc-nav-${id}`, true));
  }, [id, contieneActiva]);

  function alCambiar(e: SyntheticEvent<HTMLDetailsElement>) {
    const ahora = e.currentTarget.open;
    setAbierto(ahora);
    recordar(`pc-nav-${id}`, ahora);
  }

  return (
    <details className="bo-nav-grupo" data-grupo={id} open={abierto} onToggle={alCambiar}>
      <summary className="bo-nav-label">
        <span>{rotulo}</span>
        <IconoDesplegar />
      </summary>
      <div className="bo-nav-items">
        {renglones.map(({ clave, rotulo: texto, href, Icono }) => (
          <Link key={clave} href={href} className="bo-nav-item" title={texto}
                aria-current={clave === vista ? "page" : undefined}>
            <span className="bo-nav-icono"><Icono /></span>
            <span className="bo-nav-texto">{texto}</span>
          </Link>
        ))}
      </div>
    </details>
  );
}

export function BarraLateral({
  seccion, vista, volver,
}: {
  seccion: string;
  vista: VistaInterna;
  volver?: { href: string; texto: string };
}) {
  // Bajo 48rem: la navegación detrás de «Menú». Arriba: la barra entera se
  // puede plegar a un riel de iconos.
  const [abierta, setAbierta] = useState(false);
  const [plegada, setPlegada] = useState(false);
  useEffect(() => setPlegada(recordado("pc-barra-plegada", false)), []);

  function plegar(valor: boolean) {
    setPlegada(valor);
    recordar("pc-barra-plegada", valor);
  }

  return (
    <aside className="bo-sidebar" data-plegada={plegada ? "true" : undefined}>
      <div className="bo-brand">
        <span className="bo-tricolor" aria-hidden><i /><i /><i /></span>
        <span className="bo-brand-texto">
          {seccion}
          <span>Participación ciudadana</span>
        </span>
        {/* Solo de 48rem hacia arriba; en teléfono no hay riel que plegar. */}
        <button type="button" className="bo-plegar" onClick={() => plegar(!plegada)}
                aria-pressed={plegada} title={plegada ? "Desplegar el menú" : "Plegar el menú"}>
          {plegada ? <IconoAbrirBarra /> : <IconoPlegarBarra />}
          <span className="bo-visualmente-oculto">{plegada ? "Desplegar el menú" : "Plegar el menú"}</span>
        </button>
      </div>

      {/* Solo se ve bajo 48rem; arriba la hoja lo esconde y la navegación
          siempre está. `aria-expanded` dice el estado; el rótulo dice la acción. */}
      <button type="button" className="bo-menu-boton" aria-expanded={abierta}
              aria-controls="navegacion-interna" onClick={() => setAbierta(!abierta)}>
        {abierta ? <IconoQuitar /> : <IconoMenu />}
        {abierta ? "Cerrar" : "Menú"}
      </button>

      <nav id="navegacion-interna" data-abierta={abierta ? "true" : undefined}
           aria-label="Secciones de la consola">
        {volver && (
          <Link className="bo-nav-item bo-back" href={volver.href} title={volver.texto}>
            <span className="bo-nav-icono"><IconoVolver /></span>
            <span className="bo-nav-texto">{volver.texto}</span>
          </Link>
        )}
        {GRUPOS.map((g) => (
          <Grupo key={g.id} id={g.id} rotulo={g.rotulo} renglones={g.renglones} vista={vista} />
        ))}
      </nav>

      {/* **El aviso va aquí y en ninguna parte más.** Sin códigos internos: su
          sitio es el comentario del código, no la pantalla. Un recorrido exige
          que la barra diga «sin permisos» y «no desplegar». Plegada, queda el
          icono con el texto completo en el título. */}
      <div className="bo-sidebar-bottom">
        <div className="bo-aviso" role="note"
             title="Sin permisos. Cualquiera que abra esta dirección ve esto, y puede cambiarlo. No desplegar.">
          <IconoUrgencia />
          <p>
            <strong>Sin permisos.</strong> Cualquiera que abra esta dirección ve esto, y puede
            cambiarlo. Todavía no hay forma de saber quién es quién.{" "}
            <strong>No desplegar.</strong>
          </p>
        </div>
      </div>
    </aside>
  );
}
