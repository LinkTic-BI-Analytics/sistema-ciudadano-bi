import type { CSSProperties } from "react";
import type { Encuentro } from "../convocatoria/agenda.ts";
import { agruparPorMes, agruparPorSemana, fechaLocal, type Semana as SemanaDeCalendario } from "../convocatoria/calendario.ts";
import { sectorDe } from "../producto/sectores.ts";
import { IconoFestivo } from "../producto/iconos.tsx";

/**
 * El calendario de encuentros de la portada.
 *
 * Viene del cronograma de despliegue territorial del DNP: semanas como filas
 * con su rótulo, los cinco días de la semana, y cada encuentro como un bloque
 * con uno de los tres colores de la bandera. Adaptado a la identidad de la
 * aplicación —tricolor, Montserrat, dorado— y sin el escudo ni el logo, que
 * siguen esperando el manual institucional (`Q34`).
 *
 * **Los encuentros son los de la base**, como en la lista que había antes:
 * lo que administración cree, cancele o reprograme sale aquí. El cronograma
 * estático solo pone los rótulos de semana y el festivo.
 *
 * ## Lo que los recorridos exigen, y se conserva
 *
 * Cada encuentro sigue siendo un `.pc-event-row` con su `.pc-event-when` en
 * el formato de siempre —«lun 5 de oct · 9:00 a. m.»—, `data-status="cancelled"`
 * cuando se canceló y `.pc-event-state` con el texto que la prueba busca. Y
 * cada encuentro se dibuja **una sola vez**: el teléfono y el escritorio son
 * la misma estructura con otra hoja, no dos árboles.
 */

export const DIA = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"] as const;
export const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"] as const;

/**
 * «lun 5 de oct · 9:00 a. m.» — y si el encuentro es en otra zona horaria, se
 * dice. Bogotá no se dice: es lo normal, y decirlo hacía dudar.
 */
export function cuando(iso: string, zona: string) {
  const f = new Date(iso);
  const hora = f.toLocaleTimeString("es-CO", { timeZone: zona, hour: "numeric", minute: "2-digit" });
  const otroHuso = zona !== "America/Bogota";
  const donde = otroHuso ? ` (hora de ${zona.split("/")[1]?.replace(/_/g, " ") ?? zona})` : "";
  return `${DIA[f.getDay()]} ${f.getDate()} de ${MES[f.getMonth()]} · ${hora}${donde}`;
}

/** El día de la semana de una fecha civil, sin que el huso lo mueva. */
function diaDe(fecha: string): number {
  return new Date(`${fecha}T12:00:00Z`).getUTCDay();
}

/**
 * El título, con el prefijo en pequeño si lo tiene. «Encuentro regional ·
 * Pereira» en una celda de 200 px son tres renglones; la ciudad es lo que se
 * busca. El texto completo sigue ahí: es el mismo título, partido en dos.
 */
function Titulo({ texto }: { texto: string }) {
  const corte = texto.indexOf(" · ");
  if (corte < 0) return <>{texto}</>;
  return <><small>{texto.slice(0, corte + 3)}</small>{texto.slice(corte + 3)}</>;
}

const MODALIDAD = { presencial: "Presencial", virtual: "Virtual", mixta: "Presencial y virtual" } as const;

function Ficha({ e }: { e: Encuentro }) {
  const sector = sectorDe(e.tema);
  return (
    <li className="pc-event-row" data-status={e.estado === "cancelado" ? "cancelled" : undefined}>
      <div>
        {/* El sector con su color si lo hay; si no, la modalidad. */}
        <p className="pc-event-category" data-sector={sector}>
          {e.tema ?? MODALIDAD[e.modalidad]}
        </p>
        <p className="pc-event-title"><span><Titulo texto={e.titulo} /></span></p>
        <p className="pc-event-when">{cuando(e.comienzaEn, e.zonaHoraria)}</p>
        <p className="pc-event-where">
          {e.modalidad === "virtual" ? "Virtual" : e.lugar}
          {e.modalidad === "mixta" && " · también virtual"}
          {e.cupos !== null && ` · ${e.cupos} cupos`}
        </p>
        {e.ayudas && <p className="pc-event-where">{e.ayudas}</p>}

        {/* Un encuentro cancelado **se queda en el calendario**. Quitarlo es la
            forma más rápida de que alguien se presente en la puerta. */}
        {e.estado === "cancelado" && (
          <span className="pc-event-state">
            Cancelado{e.motivoCambio && `: ${e.motivoCambio}`}. Puedes contar lo tuyo por
            internet igual.
          </span>
        )}
        {e.estado === "reprogramado" && e.comenzabaEn && (
          <span className="pc-event-state">
            Cambió de fecha: antes era el {new Date(e.comenzabaEn).getDate()} de{" "}
            {MES[new Date(e.comenzabaEn).getMonth()]}
            {e.motivoCambio && ` · ${e.motivoCambio}`}
          </span>
        )}
      </div>
    </li>
  );
}

function Semana({ s }: { s: SemanaDeCalendario }) {
  // De lunes a viernes siempre; el fin de semana solo si tiene algo.
  const visibles = s.dias.filter((d) => d.diaSemana < 5 || d.encuentros.length > 0);
  const desde = s.dias[0]!.fecha;
  const hasta = s.dias[4]!.fecha;
  const rango = `del ${Number(desde.slice(8))} al ${Number(hasta.slice(8))} de ${MES[Number(hasta.slice(5, 7)) - 1]}`;
  return (
    <li className="pc-semana" data-extra={s.numero === null ? "true" : undefined}>
      <header className="pc-semana-rotulo">
        <p className="pc-eyebrow">{s.numero !== null ? `Semana ${s.numero}` : "Semana"}</p>
        <h4>{s.tema ?? rango}</h4>
        {s.tema && <p>{rango}</p>}
      </header>
      <ol className="pc-dias" style={{ "--pc-dias": visibles.length } as CSSProperties}>
        {visibles.map((d) => (
          <li key={d.fecha} className="pc-dia"
              data-vacio={d.encuentros.length === 0 ? "true" : undefined}
              data-festivo={d.festivo ? "true" : undefined}
              data-bandera={d.bandera ?? undefined}>
            <p className="pc-dia-numero">
              <time dateTime={d.fecha}>{Number(d.fecha.slice(8))}</time>
              <small>{DIA[diaDe(d.fecha)]}</small>
            </p>
            {d.festivo && (
              <p className="pc-festivo"><IconoFestivo />{d.festivo}</p>
            )}
            {d.encuentros.length > 0 && (
              <ul className="pc-dia-encuentros">
                {d.encuentros.map((e) => <Ficha key={e.id} e={e} />)}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </li>
  );
}

/**
 * Meses como bloques, cada uno con su cabecera y sus semanas. Con las semanas
 * una detrás de otra, la de «del 28 de sep al 2 de oct» y la «Semana 1 ·
 * Reestructuración» se leían como la misma cosa; con el mes encima se ve dónde
 * termina uno y empieza el otro, y cuántos encuentros hay en cada uno.
 */
export function Calendario({ encuentros }: { encuentros: Encuentro[] }) {
  const hoy = fechaLocal(new Date().toISOString(), "America/Bogota");
  const meses = agruparPorMes(agruparPorSemana(encuentros, { hoy }));

  return (
    <ol className="pc-calendario">
      {meses.map((m) => (
        <li key={m.clave} className="pc-mes">
          <header className="pc-mes-cabecera">
            <h3>{m.nombre}</h3>
            <p>
              {m.encuentros === 0 ? "sin encuentros publicados todavía"
                : m.encuentros === 1 ? "1 encuentro" : `${m.encuentros} encuentros`}
              {" · "}{m.semanas.length === 1 ? "1 semana" : `${m.semanas.length} semanas`}
            </p>
          </header>
          <ol className="pc-semanas">
            {m.semanas.map((s) => <Semana key={s.lunes} s={s} />)}
          </ol>
        </li>
      ))}
    </ol>
  );
}
