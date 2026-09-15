import Link from "next/link";
import type { FilaBandeja, Opciones } from "../../revision/bandeja.ts";
import { COMO_SE_LLAMA, esTema, TEMAS } from "../../captura/lectura.ts";
import {
  COMO_SE_LEE_ANTIGUEDAD, COMO_SE_LEE_ALCANCE, ALCANCES,
} from "../../revision/normalizar.ts";

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
  // **Solo contenido de frase, y `<br>` para el salto.** Llevaba un `<div>`, y
  // en la lista de tarjetas esto va dentro de un `<p>`: HTML inválido, y React
  // lo canta como error de hidratación. El navegador además cierra el párrafo
  // por su cuenta, así que lo que se ve no es lo que se escribió.
  //
  // Es el mismo fallo que el `<div>` dentro del `<dl>`, por otro camino: un
  // componente que decide su propia estructura de bloque no sabe dónde lo van a
  // meter.
  if (fila.territorio) {
    return (
      <>
        <strong>{fila.territorio}</strong>
        {fila.departamento && <><br /><span className="bo-muted">{fila.departamento}</span></>}
      </>
    );
  }
  if (fila.lugarDeclarado) {
    return (
      <>
        <span className="bo-muted">sin municipio</span>
        <br />
        <em className="bo-muted">«{fila.lugarDeclarado}»</em>
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

/**
 * El aporte, leído en dos líneas, con sus palabras debajo (`NOR-03`).
 *
 * La fila enseñaba los primeros 70 caracteres del relato crudo: había que leer
 * redacción para saber de qué se trataba, y con un relato largo —el único
 * aporte humano de la base mide 226 caracteres, cinco veces la mediana— el
 * corte dejaba fuera justo lo que importa.
 *
 * **El relato no se esconde.** `N03` no admite que la síntesis lo sustituya, ni
 * en la ficha ni en una lista: si lo confirmado va arriba, el original va
 * debajo y se puede leer. Y mientras no haya síntesis confirmada, manda el
 * relato, que es lo único que hay.
 */
export function ElAporte({ fila }: { fila: FilaBandeja }) {
  if (!fila.problema) {
    return <>{recortar(fila.relato, 110)}</>;
  }
  return (
    <>
      {recortar(fila.problema, 90)}
      {fila.loQueSeEspera && (
        <>
          <br />
          <span className="bo-small">Espera: {recortar(fila.loQueSeEspera, 70)}</span>
        </>
      )}
      <br />
      {/* Sus palabras, en pequeño y en cursiva: se distinguen de lo que
          escribimos nosotros sin necesitar una clase nueva. */}
      <em className="bo-small bo-muted">«{recortar(fila.relato, 120)}»</em>
    </>
  );
}

/** Corta por palabras: partir a mitad de una deja frases que no se entienden. */
function recortar(texto: string, largo: number): string {
  if (texto.length <= largo) return texto;
  const corte = texto.slice(0, largo);
  const ultimo = corte.lastIndexOf(" ");
  return `${ultimo > largo * 0.6 ? corte.slice(0, ultimo) : corte}…`;
}

/**
 * Hace cuánto y a cuántos, en rango (`NOR-01`, `NOR-02`).
 *
 * **El texto declarado va al lado**, porque el rango es una lectura nuestra y
 * lo que ella dijo es el dato. Sin el texto, «más de cuatro años» parece un
 * hecho medido.
 */
export function Rangos({ fila }: { fila: FilaBandeja }) {
  return (
    <>
      <span className={fila.antiguedad === "sin_decir" ? "bo-muted" : undefined}>
        {COMO_SE_LEE_ANTIGUEDAD[fila.antiguedad]}
      </span>
      {fila.desdeCuando && <span className="bo-muted"> · «{fila.desdeCuando}»</span>}
      <br />
      <span className={fila.alcance === "sin_decir" ? "bo-muted" : undefined}>
        {COMO_SE_LEE_ALCANCE[fila.alcance]}
      </span>
      {fila.afectados && <span className="bo-muted"> · «{fila.afectados}»</span>}
    </>
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
  texto, ubicacion, orden, siguiente, opciones, departamento, municipio, tema, gestion,
  soloAlerta, antiguedad, alcance,
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
  antiguedad: string;
  alcance: string;
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
      {/* **La pregunta del negocio, filtrable.** «Qué comunidades tienen más
          afectaciones del agua con más de cuatro años» son tres filtros: tema,
          territorio y hace cuánto. Se contesta filtrando y leyendo el total —no
          con una tabla ordenada de mayor a menor, que es lo que `BI-02`
          prohíbe. */}
      <div className="bo-field">
        <label className="bo-label-tag" htmlFor="antiguedad">Hace cuánto</label>
        <select id="antiguedad" name="antiguedad" defaultValue={antiguedad}>
          <option value="">Cualquiera</option>
          <option value="mas_de_cuatro">Más de cuatro años</option>
          <option value="entre_uno_y_cuatro">Entre uno y cuatro años</option>
          <option value="menos_de_un_ano">Menos de un año</option>
          <option value="sin_decir">No lo dijo</option>
        </select>
      </div>
      <div className="bo-field">
        <label className="bo-label-tag" htmlFor="alcance">A cuántos</label>
        {/* De más a menos, que es como se lee «a cuántos afecta». La lista
            sale de un sitio para que no se desincronice de los rangos. */}
        <select id="alcance" name="alcance" defaultValue={alcance}>
          <option value="">Cualquiera</option>
          {ALCANCES.map((x) => (
            <option key={x} value={x}>{COMO_SE_LEE_ALCANCE[x]}</option>
          ))}
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
