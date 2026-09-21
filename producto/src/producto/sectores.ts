import { TEMAS, esTema } from "../captura/lectura.ts";

/**
 * Qué tono le toca a cada tema.
 *
 * Los veinticuatro temas son los sectores del Estado (`TEMAS`), y en pantalla
 * salían todos iguales: texto en negrita, del mismo color que todo lo demás.
 * Con ocho tonos que rotan por índice, dos aportes de sectores distintos se
 * distinguen de un vistazo en la bandeja, y el mismo sector se ve igual en la
 * bandeja, en la ficha y en el calendario de la portada.
 *
 * **Es por índice y no por nombre**, a propósito: el orden de `TEMAS` es el
 * que entregó el cliente y no cambia, así que el color de un sector es estable
 * mientras la lista no se reordene — y `BI-02` ya prohíbe reordenarla.
 *
 * Devuelve `undefined` sin tema: la hoja pinta gris con el riel punteado, que
 * es «falta», no un noveno color.
 */
export function sectorDe(tema: string | null | undefined): number | undefined {
  if (!tema || !esTema(tema)) return undefined;
  return (TEMAS.indexOf(tema) % 8) + 1;
}
