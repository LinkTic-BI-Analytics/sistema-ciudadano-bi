import Link from "next/link";
import type { FilaBandeja, Opciones } from "../../revision/bandeja.ts";
import { COMO_SE_LLAMA, esTema, TEMAS } from "../../captura/lectura.ts";

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
 * Dónde ocurre: municipio y **departamento**.
 *
 * El departamento se capturaba y no se enseñaba en ninguna parte —la ficha lo
 * traía de la base y no lo usaba—, así que para saber si un aporte era de
 * Boyacá había que saberse los municipios de memoria.
 *
 * Sin municipio aceptado se muestra lo que la persona dijo, **en cursiva y
 * marcado como suyo**: enseñarlo como si fuera un municipio aceptado sería la
 * inferencia que `I2` prohíbe.
 */
export function Donde({ fila }: { fila: FilaBandeja }) {
  if (fila.territorio) {
    return (
      <>
        <strong>{fila.territorio}</strong>
        {fila.departamento && <div className="bo-muted">{fila.departamento}</div>}
      </>
    );
  }
  if (fila.lugarDeclarado) {
    return (
      <>
        <span className="bo-muted">sin municipio</span>
        <div><em className="bo-muted">«{fila.lugarDeclarado}»</em></div>
      </>
    );
  }
  return <span className="bo-muted">no lo dijo</span>;
}

/**
 * Dónde va la gestión, en una sola celda.
 *
 * Abrir el expediente y remitirlo son cosas distintas y pasan en momentos
 * distintos, pero en la bandeja la pregunta es una: **¿esto ya está en manos de
 * alguien?**
 */
export function Gestion({ fila }: { fila: FilaBandeja }) {
  if (fila.escalado === "recibido") {
    return <span className="bo-badge" data-state="validated">lo recibieron</span>;
  }
  if (fila.escalado === "pendiente") {
    return <span className="bo-badge" data-state="clarify">remitido · sin aceptar</span>;
  }
  if (fila.conExpediente) {
    return <span className="bo-badge" data-state="draft">expediente abierto</span>;
  }
  return <span className="bo-muted">sin expediente</span>;
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
  texto, ubicacion, orden, siguiente, opciones, departamento, municipio, tema, gestion, soloAlerta,
}: {
  texto: string;
  ubicacion: string;
  orden: string;
  siguiente: string | null;
  opciones: Opciones;
  departamento: string;
  municipio: string;
  tema: string;
  gestion: string;
  soloAlerta: boolean;
}) {
  // Si hay un departamento escogido, el desplegable de municipios se queda con
  // los suyos. Ofrecer los de todo el país después de haber escogido uno es
  // ofrecer combinaciones que no devuelven nada.
  const municipios = departamento
    ? opciones.municipios.filter((m) => m.departamento === departamento)
    : opciones.municipios;

  return (
    <form className="bo-filters" method="get" action="/consola">
      <div className="bo-field bo-search">
        <label className="bo-label-tag" htmlFor="q">Buscar</label>
        {/* Relato, lugar, territorio, departamento o tema. Sin tildes ni
            mayúsculas: nadie escribe «Abriaquí» con tilde buscando deprisa. */}
        <input id="q" name="q" defaultValue={texto} type="search"
               placeholder="relato, lugar, municipio o tema" />
      </div>

      {/* **El territorio, que es lo que se capturaba y no se podía filtrar.**
          Solo salen los departamentos y municipios donde de verdad llegó algo:
          un desplegable con los 1.122 del país no es un filtro. */}
      <div className="bo-field">
        <label className="bo-label-tag" htmlFor="departamento">Departamento</label>
        <select id="departamento" name="departamento" defaultValue={departamento}>
          <option value="">Todos</option>
          {opciones.departamentos.map((d) => (
            <option key={d.codigo} value={d.codigo}>{d.nombre}</option>
          ))}
        </select>
      </div>
      <div className="bo-field">
        <label className="bo-label-tag" htmlFor="municipio">Municipio</label>
        <select id="municipio" name="municipio" defaultValue={municipio}>
          <option value="">Todos</option>
          {municipios.map((m) => (
            <option key={m.codigo} value={m.codigo}>{m.nombre}</option>
          ))}
        </select>
      </div>
      <div className="bo-field">
        <label className="bo-label-tag" htmlFor="tema">De qué</label>
        <select id="tema" name="tema" defaultValue={tema}>
          <option value="">Cualquier tema</option>
          <option value="sin_tema">Sin tema</option>
          {TEMAS.map((x) => <option key={x} value={x}>{COMO_SE_LLAMA[x]}</option>)}
        </select>
      </div>
      <div className="bo-field">
        <label className="bo-label-tag" htmlFor="gestion">Gestión</label>
        <select id="gestion" name="gestion" defaultValue={gestion}>
          <option value="">Como esté</option>
          <option value="sin_expediente">Sin expediente</option>
          <option value="con_expediente">Con expediente</option>
          <option value="pendiente">Remitido · sin aceptar</option>
          <option value="recibido">Lo recibieron</option>
        </select>
      </div>
      <div className="bo-field">
        <label className="bo-label-tag" htmlFor="ubicacion">Ubicación</label>
        <select id="ubicacion" name="ubicacion" defaultValue={ubicacion}>
          <option value="todos">Todos</option>
          <option value="por_aclarar">Por aclarar</option>
          <option value="ubicados">Ya ubicados</option>
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
      {/* Ocho alertas activas y ninguna forma de listarlas: se miran antes que
          todo lo demás, y hasta ahora había que ir aporte por aporte. */}
      <div className="bo-field">
        {/* Una sola etiqueta, la que envuelve la casilla. Poner además un
            `bo-label-tag` dejaría dos etiquetas apuntando al mismo control. */}
        <label className="bo-check" htmlFor="alerta">
          <input id="alerta" name="alerta" type="checkbox" value="1" defaultChecked={soloAlerta} />
          Solo con alerta de urgencia
        </label>
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
