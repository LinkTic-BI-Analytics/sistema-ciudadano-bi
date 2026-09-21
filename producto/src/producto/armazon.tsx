import Link from "next/link";
import type { ReactNode } from "react";
import { BotonTema } from "./tema.tsx";
import {
  IconoAgenda, IconoBandeja, IconoExpediente, IconoLugar, IconoUrgencia, IconoVolver,
} from "./iconos.tsx";

/**
 * El armazón de las pantallas internas: barra lateral, barra superior y pie.
 *
 * **Estaba copiado tres veces** —bandeja, ficha de aporte y administración— y
 * las tres copias se habían desviado, cada una en algo distinto: la ficha
 * perdió la tricolor; la bandeja tenía un solo enlace, que además decía «Por
 * aclarar» y llevaba a la bandeja entera sin filtrar; administración tenía dos
 * enlaces y ninguno marcaba en cuál estabas. Quien entra por cualquiera de las
 * tres no puede aprender una sola pantalla: aprende tres.
 *
 * Es el equivalente interno de [`marca.tsx`](./marca.tsx), que existe por lo
 * mismo y por el mismo hallazgo: cuatro copias del rótulo y cada una con una
 * versión distinta del nombre.
 *
 * ## La navegación, que es lo que de verdad faltaba
 *
 * El sistema de diseño trae el renglón de navegación entero desde el principio
 * —con su barra dorada a la izquierda cuando está activo, que existe porque
 * «el fondo solo, sobre navy, se confunde con el hover»— y **ninguna pantalla
 * lo usaba**. La bandeja tenía un `<Link>` suelto con estilo de enlace de
 * texto.
 *
 * Las vistas no son secciones distintas: son **la misma bandeja con un filtro
 * puesto**, y por eso son direcciones de `/consola` y no rutas nuevas. Lo que
 * aportan es que las cuatro preguntas con las que alguien entra a revisar
 * —¿qué hay?, ¿a qué le falta el lugar?, ¿qué no tiene expediente?, ¿qué está
 * urgente?— dejan de exigir armar un filtro a mano.
 *
 * **Sin recuentos al lado.** El hueco está en la hoja (`nav a span`) y se deja
 * vacío a propósito: cada recuento es una consulta más por cada carga de la
 * pantalla, y el encargo de esta refactorización dice no tocar lo que va al
 * servidor. Cuando se decida, el sitio ya está.
 */

/** La vista activa. `null` en una pantalla de detalle, que no es ninguna. */
export type VistaInterna =
  | "bandeja" | "por-aclarar" | "sin-expediente" | "urgentes" | "convocatoria" | null;

const REVISION = [
  { clave: "bandeja", rotulo: "Todo lo que llegó", href: "/consola", Icono: IconoBandeja },
  { clave: "por-aclarar", rotulo: "Falta el lugar", href: "/consola?ubicacion=por_aclarar", Icono: IconoLugar },
  { clave: "sin-expediente", rotulo: "Sin expediente", href: "/consola?gestion=sin_expediente", Icono: IconoExpediente },
  { clave: "urgentes", rotulo: "Con alerta", href: "/consola?alerta=1", Icono: IconoUrgencia },
] as const;

const CONVOCATORIA = [
  { clave: "convocatoria", rotulo: "Encuentros y materiales", href: "/administracion", Icono: IconoAgenda },
] as const;

/**
 * Un solo `<nav>` para los dos grupos, y no uno por grupo.
 *
 * No es cosmética: bajo 48rem la hoja apila la barra lateral en horizontal y le
 * da a `nav` una fila fija de la rejilla —`grid-row: 2`—. Con dos `<nav>` los
 * dos piden la misma fila y **se pintan uno encima del otro**. Con uno solo,
 * los rótulos se ocultan —la hoja ya lo hace— y los cinco renglones quedan en
 * una fila que envuelve.
 */
function Renglones({
  renglones, vista,
}: {
  renglones: ReadonlyArray<{ clave: string; rotulo: string; href: string; Icono: typeof IconoBandeja }>;
  vista: VistaInterna;
}) {
  return (
    <>
      {renglones.map(({ clave, rotulo, href, Icono }) => (
        <Link key={clave} href={href} aria-current={clave === vista ? "page" : undefined}>
          <Icono />
          {rotulo}
        </Link>
      ))}
    </>
  );
}

export function Armazon({
  seccion, vista, volver, kicker, meta, pie, children,
}: {
  /** El rótulo de la marca, arriba a la izquierda. */
  seccion: string;
  vista: VistaInterna;
  /** Solo en pantallas de detalle: a dónde se vuelve. */
  volver?: { href: string; texto: string };
  /** La versalita de la barra superior. Dice en qué pantalla estás. */
  kicker: string;
  /** Lo que va a la derecha de la barra superior, antes del botón de tema. */
  meta?: ReactNode;
  pie?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="pc-backoffice">
      <div className="bo-shell">
        <aside className="bo-sidebar">
          <div className="bo-brand">
            <span className="bo-tricolor" aria-hidden><i /><i /><i /></span>
            {seccion}
          </div>

          {/* `.bo-back` solo trae tamaño y margen: sin `.bo-link` al lado, el
              enlace sale con el azul subrayado del navegador, que es de otro
              sistema de diseño. */}
          {volver && (
            <Link className="bo-link bo-back" href={volver.href}>
              <IconoVolver />
              {volver.texto}
            </Link>
          )}

          <nav>
            <p className="bo-nav-label">Revisión</p>
            <Renglones renglones={REVISION} vista={vista} />
            <p className="bo-nav-label">Convocatoria</p>
            <Renglones renglones={CONVOCATORIA} vista={vista} />
          </nav>

          {/* **El aviso va aquí y en ninguna parte más.** Estaba escrito tres
              veces con tres redacciones, y dos de ellas citaban códigos
              internos —`T032`, `P4`, `Q18`— que no le dicen nada a quien
              revisa: su sitio es el comentario del código, no la pantalla. Es
              la misma regla que `pruebas/e2e/consola.spec.ts` ya exige del
              cuerpo de la ficha, aplicada también al margen. */}
          <div className="bo-sidebar-bottom">
            <p className="bo-small">
              <strong>Sin permisos.</strong> Cualquiera que abra esta dirección ve esto, y puede
              cambiarlo. Todavía no hay forma de saber quién es quién.{" "}
              <strong>No desplegar.</strong>
            </p>
          </div>
        </aside>

        <div className="bo-workspace">
          <header className="bo-topbar">
            <span className="bo-kicker">{kicker}</span>
            <div className="bo-inline">
              {meta}
              <BotonTema />
            </div>
          </header>

          <main className="bo-main">{children}</main>

          {pie && <footer className="bo-footer">{pie}</footer>}
        </div>
      </div>
    </div>
  );
}
