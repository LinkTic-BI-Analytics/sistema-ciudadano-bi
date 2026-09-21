/**
 * El cronograma oficial de despliegue territorial, tal como lo entregó el
 * cliente (DNP, «Cronograma despliegue territorial», septiembre de 2026).
 *
 * **Aquí va solo lo que le sirve a la ciudadanía**: cómo se llama cada semana y
 * qué día es festivo. Los encuentros —ciudad, fecha, hora, lugar— **no van
 * aquí**: viven en la base como cualquier otro encuentro, sembrados por
 * `scripts/sembrar-agenda.sh`, y por eso administración los puede cancelar o
 * reprogramar y la portada se entera.
 *
 * Lo que la imagen trae y **no** se copia, a propósito: los «equipos 1, 2 y 3»
 * y los días de «alistamiento». Son logística interna del despliegue; a quien
 * va a ir a un encuentro no le dicen nada, y no existen en el modelo. Los tres
 * colores de la bandera se conservan como ritmo visual del calendario, sin
 * llamarlos equipo.
 *
 * Es un archivo estático porque es lo que es: un calendario publicado, con
 * fecha. Cuando cambie, cambia aquí y se ve en el diff.
 */

export type SemanaOficial = {
  /** El lunes, como fecha civil `AAAA-MM-DD`. */
  lunes: string;
  numero: number;
  /** Cómo la nombra el cronograma. */
  tema: string;
};

export const CRONOGRAMA: readonly SemanaOficial[] = [
  { lunes: "2026-10-05", numero: 1, tema: "Reestructuración" },
  { lunes: "2026-10-12", numero: 2, tema: "Seguridad" },
  { lunes: "2026-10-19", numero: 3, tema: "Productividad" },
  { lunes: "2026-10-26", numero: 4, tema: "Productividad" },
];

/** Festivos dentro del cronograma. Solo los que caen entre semana: un festivo
 *  en domingo no cambia nada de lo que se ve. */
export const FESTIVOS: Readonly<Record<string, string>> = {
  "2026-10-12": "Festivo nacional",
};
