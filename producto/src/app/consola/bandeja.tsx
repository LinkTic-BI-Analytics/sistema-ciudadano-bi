import Link from "next/link";
import type { FilaBandeja } from "../../revision/bandeja.ts";
import { COMO_SE_LLAMA, esTema } from "../../captura/lectura.ts";

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

/**
 * De qué habla el aporte.
 *
 * **Sin tema no se puede enrutar a ninguna mesa**, y por eso se dice en vez de
 * dejar la celda vacía: un hueco parece un fallo de la pantalla; «sin tema» es
 * un dato sobre el aporte.
 */
export function DeQue({ tema }: { tema: string | null }) {
  if (!tema || !esTema(tema)) return <span className="bo-muted">sin tema</span>;
  return <strong>{COMO_SE_LLAMA[tema]}</strong>;
}

/**
 * Si ya salió hacia una mesa o un equipo.
 *
 * **«Remitido» no es «atendido».** Mientras la destinataria no confirme, sigue
 * pendiente, y el silencio no lo cierra.
 */
export function Escalado({ estado }: { estado: FilaBandeja["escalado"] }) {
  if (estado === "no") return <span className="bo-muted">no</span>;
  return (
    <span className="bo-badge" data-state={estado === "recibido" ? "validated" : "clarify"}>
      {estado === "recibido" ? "lo recibieron" : "remitido · sin aceptar"}
    </span>
  );
}

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
  texto, ubicacion, orden, siguiente,
}: {
  texto: string;
  ubicacion: string;
  orden: string;
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
        <label className="bo-label-tag" htmlFor="orden">Orden</label>
        {/* **Ninguno de los dos es una puntuación.** El de trabajo manda por
            defecto —el que lleva más esperando se atiende primero— y el otro
            contesta una pregunta distinta: qué acaba de entrar. `BI-02` prohíbe
            ordenar por popularidad, y eso no cambia. */}
        <select id="orden" name="orden" defaultValue={orden}>
          <option value="antiguos">Los que llevan más esperando</option>
          <option value="recientes">Los últimos que llegaron</option>
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
