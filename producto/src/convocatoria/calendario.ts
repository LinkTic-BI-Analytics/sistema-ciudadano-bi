import type { Encuentro } from "./agenda.ts";
import { CRONOGRAMA, FESTIVOS, type SemanaOficial } from "./cronograma.ts";

/**
 * Los encuentros, repartidos en semanas de lunes a domingo para dibujar el
 * calendario de la portada.
 *
 * Funciones puras, sin librerías de fechas: lo único que hace falta es pasar
 * de un instante a una fecha civil **en la zona del encuentro**, y de una
 * fecha civil a su lunes. `Intl` hace lo primero; lo segundo es aritmética
 * sobre la fecha civil en UTC, que no arrastra ningún huso.
 *
 * ## Las reglas
 *
 * - **Una semana existe si tiene encuentros, o si está en el cronograma y aún
 *   no terminó.** Una semana del plan que todavía no llegó se muestra aunque la
 *   base no tenga filas; una que ya pasó y quedó vacía, no.
 * - **Los tres colores de la bandera rotan por día con encuentro, dentro de
 *   cada semana**, empezando en amarillo. Es el patrón exacto de la imagen del
 *   DNP —primero dorado, segundo azul, tercero rojo— sin llamarlos «equipo».
 *   Es por día y no por encuentro para que dos encuentros el mismo día no se
 *   peleen el color: la marca es el número del día.
 * - Un día cuyo único encuentro está cancelado **sí consume color**: sigue
 *   siendo un día con ficha, y la ficha ya dice que se canceló.
 */

export type Bandera = 1 | 2 | 3;

export type Dia = {
  /** `AAAA-MM-DD`, en la zona del encuentro. */
  fecha: string;
  /** 0 = lunes … 6 = domingo. */
  diaSemana: number;
  festivo: string | null;
  encuentros: Encuentro[];
  /** Solo en días con encuentros. */
  bandera: Bandera | null;
};

export type Semana = {
  lunes: string;
  /** Del cronograma oficial; `null` en una semana que el plan no nombra. */
  numero: number | null;
  tema: string | null;
  dias: Dia[];
};

const DIA_MS = 86_400_000;

/** La fecha civil de un instante en una zona: `"2026-10-05"`. */
export function fechaLocal(iso: string, zona: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: zona, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date(iso));
}

function utcDe(fecha: string): number {
  const [a, m, d] = fecha.split("-").map(Number);
  return Date.UTC(a!, m! - 1, d!);
}

function civil(utc: number): string {
  return new Date(utc).toISOString().slice(0, 10);
}

export function sumarDias(fecha: string, n: number): string {
  return civil(utcDe(fecha) + n * DIA_MS);
}

/** El lunes de la semana de una fecha civil. */
export function lunesDe(fecha: string): string {
  const t = utcDe(fecha);
  const desdeLunes = (new Date(t).getUTCDay() + 6) % 7;
  return civil(t - desdeLunes * DIA_MS);
}

export function agruparPorSemana(
  encuentros: Encuentro[],
  {
    cronograma = CRONOGRAMA,
    festivos = FESTIVOS,
    hoy,
  }: { cronograma?: readonly SemanaOficial[]; festivos?: Readonly<Record<string, string>>; hoy: string },
): Semana[] {
  // 1. Cada encuentro, en su día civil.
  const porDia = new Map<string, Encuentro[]>();
  for (const e of encuentros) {
    const fecha = fechaLocal(e.comienzaEn, e.zonaHoraria || "America/Bogota");
    porDia.set(fecha, [...(porDia.get(fecha) ?? []), e]);
  }

  // 2. Qué semanas hay: las que tienen algo, más las del plan que no han terminado.
  const lunes = new Set<string>();
  for (const fecha of porDia.keys()) lunes.add(lunesDe(fecha));
  for (const s of cronograma) {
    if (sumarDias(s.lunes, 6) >= hoy) lunes.add(s.lunes);
  }

  // 3. Cada semana, con sus siete días y el color por día con encuentros.
  return [...lunes].sort().map((l) => {
    const oficial = cronograma.find((s) => s.lunes === l);
    let posicion = 0;
    const dias: Dia[] = Array.from({ length: 7 }, (_, i) => {
      const fecha = sumarDias(l, i);
      const del = (porDia.get(fecha) ?? [])
        .slice()
        .sort((a, b) => a.comienzaEn.localeCompare(b.comienzaEn));
      const bandera = del.length ? ((posicion++ % 3) + 1) as Bandera : null;
      return { fecha, diaSemana: i, festivo: festivos[fecha] ?? null, encuentros: del, bandera };
    });
    return { lunes: l, numero: oficial?.numero ?? null, tema: oficial?.tema ?? null, dias };
  });
}

export type Mes = {
  /** `"2026-10"`. */
  clave: string;
  /** «Octubre de 2026». */
  nombre: string;
  semanas: Semana[];
  /** Cuántos encuentros hay en el mes, contando los cancelados: siguen en el calendario. */
  encuentros: number;
};

const MES_LARGO = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
] as const;

/**
 * Las semanas, repartidas por mes para que el calendario tenga cabeceras.
 *
 * **Una semana pertenece al mes en que empieza** —el de su lunes—. Es la regla
 * más fácil de explicar: «del 28 de sep al 2 de oct» va en septiembre porque
 * ahí arranca. La alternativa de la ISO (el mes del jueves) parte semanas de
 * forma que nadie adivina mirando el rótulo.
 */
export function agruparPorMes(semanas: Semana[]): Mes[] {
  const meses: Mes[] = [];
  for (const s of semanas) {
    const clave = s.lunes.slice(0, 7);
    let mes = meses.at(-1);
    if (!mes || mes.clave !== clave) {
      const nombre = `${MES_LARGO[Number(clave.slice(5, 7)) - 1]} de ${clave.slice(0, 4)}`;
      mes = { clave, nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1), semanas: [], encuentros: 0 };
      meses.push(mes);
    }
    mes.semanas.push(s);
    mes.encuentros += s.dias.reduce((n, d) => n + d.encuentros.length, 0);
  }
  return meses;
}
