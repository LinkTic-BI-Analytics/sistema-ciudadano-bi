import Link from "next/link";
import type { Opciones } from "../../revision/bandeja.ts";
import {
  COMO_SE_LEE_ANTIGUEDAD, COMO_SE_LEE_ALCANCE,
  type Antiguedad, type Alcance,
} from "../../revision/normalizar.ts";
import { IconoQuitar } from "../../producto/iconos.tsx";

/**
 * Qué filtros están puestos, en palabras, y cómo quitar cada uno.
 *
 * La bandeja tiene diez controles y salía sin ninguna señal de cuáles estaban
 * aplicados: la lista mostraba nueve aportes de ciento veinte y la explicación
 * estaba metida dentro de un `<select>` a media pantalla de distancia. Para
 * saber por qué veías lo que veías había que recorrer los diez.
 *
 * **La «×» es un enlace, no un botón.** Los filtros viven en la dirección
 * justamente para que un revisor pueda guardar o mandar lo que estaba mirando;
 * si quitarlos fuera un botón con JavaScript, quitar uno dejaría de producir
 * una dirección. Así sigue siendo una dirección, y además funciona sin JS.
 *
 * **No se usa `.bo-badge`**, que se le parece mucho: el punto que esa clase
 * pinta con `::before` significa *estado del aporte* —recibido, en revisión,
 * remitido— y un filtro no es un estado de nada. Reusarla enseñaría a leer un
 * punto que unas veces dice una cosa y otras veces otra.
 */

const UBICACION: Record<string, string> = {
  por_aclarar: "Por aclarar",
  ubicados: "Ya ubicados",
};

const GESTION: Record<string, string> = {
  sin_expediente: "Sin expediente",
  con_expediente: "Con expediente",
  pendiente: "Remitido · sin aceptar",
  recibido: "Lo recibieron",
};

type Consulta = Record<string, string | string[] | undefined>;

/** Lo que se muestra. `orden` y `ver` no entran: no recortan el universo. */
const FILTRABLES = [
  "q", "departamento", "municipio", "tema", "antiguedad", "alcance",
  "gestion", "ubicacion", "alerta",
] as const;

function comoSeLee(
  clave: string, valor: string, opciones: Opciones,
): { campo: string; valor: string } | null {
  switch (clave) {
    case "q":
      return { campo: "Busca", valor: `«${valor}»` };
    case "departamento":
      return {
        campo: "Departamento",
        valor: opciones.departamentos.find((d) => d.codigo === valor)?.nombre ?? valor,
      };
    case "municipio":
      return {
        campo: "Municipio",
        valor: opciones.municipios.find((m) => m.codigo === valor)?.nombre ?? valor,
      };
    case "tema":
      return { campo: "De qué", valor: valor === "sin_tema" ? "Sin tema" : valor };
    case "antiguedad":
      // El `?? valor` no es defensa de más: la dirección la escribe cualquiera,
      // y un valor que no está en la lista tiene que poder quitarse igual.
      return { campo: "Hace cuánto", valor: COMO_SE_LEE_ANTIGUEDAD[valor as Antiguedad] ?? valor };
    case "alcance":
      return { campo: "A cuántos", valor: COMO_SE_LEE_ALCANCE[valor as Alcance] ?? valor };
    case "gestion":
      return { campo: "Gestión", valor: GESTION[valor] ?? valor };
    case "ubicacion":
      // «Todos» es el valor por defecto: enseñarlo como filtro sería decir que
      // hay algo puesto cuando no hay nada puesto.
      return valor === "todos" ? null : { campo: "Ubicación", valor: UBICACION[valor] ?? valor };
    case "alerta":
      return valor === "1" ? { campo: "Solo", valor: "con alerta de urgencia" } : null;
    default:
      return null;
  }
}

/** La misma dirección sin ese parámetro. Y sin `ver`: al cambiar el filtro, la
 *  paginación acumulada deja de tener sentido y traer 300 filas de otra cosa
 *  es lento y confunde. */
function sin(consulta: Consulta, clave: string): Consulta {
  const resto: Consulta = {};
  for (const [k, v] of Object.entries(consulta)) {
    if (k !== clave && k !== "ver") resto[k] = v;
  }
  return resto;
}

export function FiltrosActivos({
  consulta, opciones,
}: {
  consulta: Consulta;
  opciones: Opciones;
}) {
  const puestos = FILTRABLES.flatMap((clave) => {
    const crudo = consulta[clave];
    if (typeof crudo !== "string" || !crudo) return [];
    const leido = comoSeLee(clave, crudo, opciones);
    return leido ? [{ clave, ...leido }] : [];
  });

  if (puestos.length === 0) return null;

  return (
    <div className="bo-chips">
      {puestos.map(({ clave, campo, valor }) => (
        <span key={clave} className="bo-chip">
          <span>
            {campo}: <b>{valor}</b>
          </span>
          <Link
            href={{ pathname: "/consola", query: sin(consulta, clave) }}
            aria-label={`Quitar el filtro ${campo}: ${valor}`}
          >
            <IconoQuitar />
          </Link>
        </span>
      ))}
      {/* Con dos o más, quitarlos uno por uno son dos o más recargas de la
          pantalla. Con uno solo sobra: la «×» que tiene al lado hace lo mismo. */}
      {puestos.length > 1 && (
        <Link className="bo-link" href="/consola">Quitar todos</Link>
      )}
    </div>
  );
}
