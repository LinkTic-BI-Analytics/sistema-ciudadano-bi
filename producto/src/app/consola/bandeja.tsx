import Link from "next/link";
import type { FilaBandeja } from "../../revision/bandeja.ts";

// Las señales que cambian cómo se revisa un aporte.
//
// No son decoración: cada una dice **qué hacer distinto**. Una transcripción
// puede estar mal y hay audio que oír; un grupo tiene a quién responderle y
// nadie verificó que hable por él; una urgencia se mira antes.
const COMO_SE_LEE = {
  voz: { texto: "por voz · la transcripción puede estar mal", estado: "clarify" },
  grupo: { texto: "dice hablar por un grupo · sin verificar", estado: "referred" },
  urgencia: { texto: "alerta de urgencia", estado: "review" },
  evento: { texto: "viene de un encuentro", estado: "validated" },
} as const;

export function Señales({ fila }: { fila: FilaBandeja }) {
  if (fila.señales.length === 0) return null;
  return (
    <>
      {fila.señales.map((s) => (
        <span key={s} className="bo-badge" data-state={COMO_SE_LEE[s].estado}>
          {COMO_SE_LEE[s].texto}
        </span>
      ))}
    </>
  );
}

/**
 * Búsqueda y filtros.
 *
 * Van por la dirección y no por estado de cliente: así un revisor puede
 * **guardar o mandar un enlace a lo que estaba mirando**, que es media razón de
 * que exista una bandeja compartida.
 */
export function Filtros({
  texto, ubicacion, siguiente,
}: {
  texto: string;
  ubicacion: string;
  siguiente: string | null;
}) {
  return (
    <form className="bo-filters" method="get" action="/consola">
      <div className="bo-field bo-search">
        <label className="bo-label-tag" htmlFor="q">Buscar</label>
        {/* Relato, lugar o territorio. Sin tildes ni mayúsculas: nadie escribe
            «Abriaquí» con tilde cuando está buscando deprisa. */}
        <input id="q" name="q" defaultValue={texto} type="search"
               placeholder="relato, lugar o municipio" />
      </div>
      <div className="bo-field">
        <label className="bo-label-tag" htmlFor="ubicacion">Ubicación</label>
        <select id="ubicacion" name="ubicacion" defaultValue={ubicacion}>
          <option value="por_aclarar">Por aclarar</option>
          <option value="ubicados">Ya ubicados</option>
          <option value="todos">Todos</option>
        </select>
      </div>
      <div className="bo-field">
        <button className="bo-button">Filtrar</button>{" "}
        {/* «Abrir siguiente» abre el primero visible **por fecha de
            recepción**, no el más grave: no hay puntuación de prioridad, y no
            haberla es la decisión. */}
        {siguiente
          ? <Link className="bo-button" data-variant="primary" href={`/consola/${siguiente}`}>Abrir siguiente</Link>
          : <button className="bo-button" data-variant="primary" disabled>Abrir siguiente</button>}
      </div>
    </form>
  );
}
