import type { FilaBandeja, Opciones } from "../../revision/bandeja.ts";
import { Territorio } from "./territorio.tsx";
import { TEMAS } from "../../captura/lectura.ts";
import { sectorDe } from "../../producto/sectores.ts";
import {
  IconoAlertaCirculo, IconoBuscar, IconoCuando, IconoFiltro, IconoHechoCirculo, IconoUrgencia,
} from "../../producto/iconos.tsx";
import {
  COMO_SE_LEE_ANTIGUEDAD, COMO_SE_LEE_ALCANCE, ALCANCES,
} from "../../revision/normalizar.ts";

// Las señales que cambian cómo se revisa un aporte.
//
// No son decoración: cada una dice **qué hacer distinto**. Una transcripción
// puede estar mal y hay audio que oír; un grupo tiene a quién responderle y
// nadie verificó que hable por él; una urgencia se mira antes.
//
// **Con hue de verdad desde la ronda 2.** La urgencia iba mapeada a `review`,
// que con la paleta corregida es azul: una alerta azul no alerta a nadie. Cada
// señal lleva ahora el color de lo que significa: rojo la urgencia, violeta la
// voz (la transcripción es una lectura de máquina), azul el grupo, verde el
// encuentro. El texto lo dice entero; el color solo acompaña.
const COMO_SE_LEE = {
  voz: { texto: "por voz · la transcripción puede estar mal", estado: "voz" },
  grupo: { texto: "dice hablar por un grupo · sin verificar", estado: "info" },
  urgencia: { texto: "alerta de urgencia", estado: "alert" },
  evento: { texto: "viene de un encuentro", estado: "ok" },
} as const;

/**
 * De qué habla el aporte, con el color de su sector.
 *
 * **Sin tema no se puede enrutar a ninguna mesa**, y por eso se dice en vez de
 * dejar la celda vacía: un hueco parece un fallo de la pantalla; «sin tema» es
 * un dato sobre el aporte. Sale gris con el riel punteado: es «falta», no un
 * noveno color.
 */
export function DeQue({ tema }: { tema: string | null }) {
  const sector = sectorDe(tema);
  if (!sector) return <span className="bo-sector">sin tema</span>;
  return <span className="bo-sector" data-sector={sector}>{tema}</span>;
}

/**
 * Dónde ocurre: municipio y **departamento**.
 *
 * Sin municipio aceptado se muestra lo que la persona dijo, **en cursiva y
 * marcado como suyo**: enseñarlo como si fuera un municipio aceptado sería la
 * inferencia que `I2` prohíbe.
 */
export function Donde({ fila }: { fila: FilaBandeja }) {
  // **Solo contenido de frase, y `<br>` para el salto.** En la lista de
  // tarjetas esto va dentro de un `<p>`: un `<div>` aquí es HTML inválido.
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
 * Dónde va la gestión, en una sola celda: **¿esto ya está en manos de
 * alguien?** Verde si lo recibieron, ámbar si se remitió y nadie ha aceptado,
 * azul si hay expediente, gris si no hay nada.
 */
export function Gestion({ fila }: { fila: FilaBandeja }) {
  if (fila.escalado === "recibido") {
    return <span className="bo-badge" data-state="ok">lo recibieron</span>;
  }
  if (fila.escalado === "pendiente") {
    return <span className="bo-badge" data-state="clarify">remitido · sin aceptar</span>;
  }
  if (fila.conExpediente) {
    return <span className="bo-badge" data-state="info">expediente abierto</span>;
  }
  return <span className="bo-badge" data-state="draft">sin expediente</span>;
}

/**
 * Qué le falta al aporte para poder revisarse: en ámbar con icono cuando
 * falta algo, en verde cuando no. Antes era texto gris igual que todo.
 */
export function Falta({ fila }: { fila: FilaBandeja }) {
  if (fila.falta.length === 0) {
    return <span className="bo-falta" data-nada><IconoHechoCirculo />no le falta nada</span>;
  }
  return <span className="bo-falta"><IconoAlertaCirculo />{fila.falta.join(", ")}</span>;
}

/**
 * El aporte, leído en dos líneas, con sus palabras debajo (`NOR-03`).
 *
 * **El relato no se esconde.** `N03` no admite que la síntesis lo sustituya:
 * si lo confirmado va arriba, el original va debajo y se puede leer.
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
 * Cuándo llegó, corto: «20 sep · 3:41 p. m.». La fecha entera con año y
 * segundos —«20/9/2026, 3:41:17 p. m.»— ocupaba una línea y no se comparaba
 * entre filas. Hora de Bogotá siempre, y explícita. El año va en el `title`
 * para quien lo necesite.
 */
export function Fecha({ iso }: { iso: string }) {
  const f = new Date(iso);
  const dia = f.toLocaleDateString("es-CO", { timeZone: "America/Bogota", day: "numeric", month: "short" });
  const hora = f.toLocaleTimeString("es-CO", { timeZone: "America/Bogota", hour: "numeric", minute: "2-digit" });
  const completa = f.toLocaleString("es-CO", { timeZone: "America/Bogota" });
  return (
    <span className="bo-fecha" title={completa}>
      <IconoCuando />
      <time dateTime={iso}>{dia.replace(".", "")} · {hora}</time>
    </span>
  );
}

/**
 * Hace cuánto y a cuántos, en rango (`NOR-01`, `NOR-02`). **El texto declarado
 * va al lado**, porque el rango es una lectura nuestra y lo que ella dijo es el
 * dato.
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
    <span className="bo-senales">
      {fila.señales.map((s) => (
        <span key={s} className="bo-badge" data-state={COMO_SE_LEE[s].estado}>
          {COMO_SE_LEE[s].texto}
        </span>
      ))}
    </span>
  );
}

/** Un control segmentado: radios con nombre, estilizados como pestañas. */
function Segmento({
  rotulo, name, valor, opciones,
}: {
  rotulo: string;
  name: string;
  valor: string;
  opciones: [string, string][];
}) {
  return (
    <div className="bo-segmento">
      <span className="bo-label-tag">{rotulo}</span>
      <div role="group" aria-label={rotulo}>
        {opciones.map(([v, texto], i) => {
          // El primero conserva el `id` del selector que había —`#ubicacion`,
          // `#gestion`— por si alguien lo enlazó; los demás llevan su valor.
          const id = i === 0 ? name : `${name}-${v || "cualquiera"}`;
          return (
            <span key={v}>
              <input type="radio" id={id} name={name} value={v} defaultChecked={valor === v} />
              <label htmlFor={id}>{texto}</label>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Búsqueda y filtros, en tres niveles.
 *
 * Van por la dirección y no por estado de cliente: así un revisor puede
 * **guardar o mandar un enlace a lo que estaba mirando**, que es media razón de
 * que exista una bandeja compartida.
 *
 * **Diez selectores en una rejilla plana no tienen jerarquía**: todos pesan lo
 * mismo y nadie sabe por dónde empezar. Era la queja literal —«no tiene una
 * distribución lógica»—. Ahora:
 *
 *   1. Buscar, con el orden y el botón, en una fila.
 *   2. Las vistas rápidas —ubicación, gestión, alerta— como pestañas pequeñas:
 *      son las tres preguntas con las que se entra a revisar.
 *   3. Afinar por territorio, tema y tiempo, plegable y abierto por defecto.
 *
 * Todo sigue dentro de `.bo-filters`, que es lo que los recorridos buscan.
 * **Y sigue sin enviarse solo al cambiar un control**: un formulario que se
 * manda al soltar un radio sorprende al teclado.
 */
export function Filtros({
  texto, ubicacion, orden, opciones, departamento, municipio, tema, gestion,
  soloAlerta, antiguedad, alcance,
}: {
  texto: string;
  ubicacion: string;
  orden: string;
  opciones: Opciones;
  departamento: string;
  municipio: string;
  tema: string;
  gestion: string;
  soloAlerta: boolean;
  antiguedad: string;
  alcance: string;
}) {
  return (
    <form className="bo-filters" method="get" action="/consola">
      <div className="bo-filtros-buscar">
        <div className="bo-field">
          <label className="bo-label-tag" htmlFor="q">Buscar</label>
          <div className="bo-search-field">
            <IconoBuscar />
            {/* Relato, lugar, territorio, departamento o tema. Sin tildes ni
                mayúsculas: nadie escribe «Abriaquí» con tilde buscando deprisa. */}
            <input id="q" name="q" defaultValue={texto} type="search"
                   placeholder="relato, lugar, municipio o tema" />
          </div>
        </div>
        <div className="bo-field">
          <label className="bo-label-tag" htmlFor="orden">Orden</label>
          {/* **Ninguno de los dos es una puntuación.** El de trabajo manda por
              defecto —el que lleva más esperando se atiende primero—. `BI-02`
              prohíbe ordenar por popularidad, y eso no cambia. */}
          <select id="orden" name="orden" defaultValue={orden}>
            <option value="antiguos">Los que llevan más esperando</option>
            <option value="recientes">Los últimos que llegaron</option>
          </select>
        </div>
        <button className="bo-button" data-variant="primary"><IconoFiltro />Filtrar</button>
      </div>

      <div className="bo-filtros-rapidos">
        <Segmento rotulo="Ubicación" name="ubicacion" valor={ubicacion} opciones={[
          ["todos", "Todos"], ["por_aclarar", "Por aclarar"], ["ubicados", "Ya ubicados"],
        ]} />
        <Segmento rotulo="Gestión" name="gestion" valor={gestion} opciones={[
          ["", "Como esté"], ["sin_expediente", "Sin expediente"], ["con_expediente", "Con expediente"],
          ["pendiente", "Remitido"], ["recibido", "Recibido"],
        ]} />
        {/* Ocho alertas activas y ninguna forma de listarlas: se miran antes
            que todo lo demás. El chip se enciende en rojo. */}
        <label className="bo-conmutador" htmlFor="alerta">
          <input id="alerta" name="alerta" type="checkbox" value="1" defaultChecked={soloAlerta} />
          <IconoUrgencia />
          Solo con alerta de urgencia
        </label>
      </div>

      {/* Abierto por defecto: los recorridos escogen departamento y municipio
          directamente, y un `<details>` cerrado los deja fuera de alcance. */}
      <details className="bo-plegable" open>
        <summary><IconoFiltro />Afinar por territorio, tema y tiempo</summary>
        <div className="bo-afinar">
          {/* Solo salen los departamentos y municipios donde de verdad llegó
              algo. Van encadenados y por eso corren en el navegador
              (`territorio.tsx`). */}
          <Territorio opciones={opciones} departamento={departamento} municipio={municipio} />
          <div className="bo-field">
            <label className="bo-label-tag" htmlFor="tema">De qué</label>
            <select id="tema" name="tema" defaultValue={tema}>
              <option value="">Cualquier tema</option>
              <option value="sin_tema">Sin tema</option>
              {TEMAS.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
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
            <select id="alcance" name="alcance" defaultValue={alcance}>
              <option value="">Cualquiera</option>
              {ALCANCES.map((x) => (
                <option key={x} value={x}>{COMO_SE_LEE_ALCANCE[x]}</option>
              ))}
            </select>
          </div>
        </div>
      </details>
    </form>
  );
}
