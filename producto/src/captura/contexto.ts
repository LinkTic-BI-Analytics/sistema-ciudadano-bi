/**
 * Lo que la persona ya contó y **puede valer también para el problema
 * siguiente**.
 *
 * Quien cuenta dos cosas vive en el mismo sitio, le pasan a la misma gente y
 * suelen venir de la misma época. Volver a preguntárselo todo desde cero es lo
 * que hace que abandone en el segundo — y entonces la segunda necesidad se
 * pierde, que es justo lo que partir en dos venía a evitar.
 *
 * **Se propone, no se hereda.** `I2` prohíbe inferir la ubicación, y dar por
 * hecho que el segundo problema ocurre donde el primero sería exactamente eso:
 * alguien puede contar lo del agua de su casa y lo de la vía del colegio de sus
 * hijos, que está en otro municipio. Así que se le enseña y ella dice si vale.
 *
 * Viaja por el navegador, nunca por la dirección ni por el servidor: son datos
 * de su aporte y no tienen por qué pasar por ningún registro intermedio.
 */

export type ContextoHeredado = {
  lugarDeclarado: string | null;
  municipio: { codigo: string; version: string; nombre: string; departamento: string } | null;
  afectados: string | null;
  desdeCuando: string | null;
  colectivo: string | null;
  /**
   * Desde dónde nos contacta.
   *
   * Es lo **menos** probable que cambie entre un aporte y el siguiente —quien
   * cuenta dos cosas no se mudó de país entre una pantalla y otra— y aun así se
   * propone en vez de heredarse, como todo lo demás de aquí. `nombre` es solo
   * para poder enseñárselo: lo que se guarda es el código con su versión.
   */
  contacto: {
    ambito: "nacional" | "internacional";
    codigo: string;
    version: string;
    nombre: string;
  } | null;
};

export const LLAVE_RELATO = "pc:otro-relato";
export const LLAVE_CONTEXTO = "pc:contexto";

/** ¿Trae algo que valga la pena preguntar? Un contexto vacío no se pregunta. */
export function tieneAlgo(c: ContextoHeredado | null): c is ContextoHeredado {
  return !!c && Boolean(
    c.lugarDeclarado || c.municipio || c.afectados || c.desdeCuando || c.colectivo || c.contacto,
  );
}

export function guardarContexto(relato: string, c: ContextoHeredado): void {
  try {
    sessionStorage.setItem(LLAVE_RELATO, relato);
    if (tieneAlgo(c)) sessionStorage.setItem(LLAVE_CONTEXTO, JSON.stringify(c));
  } catch { /* sin almacenamiento, se vuelve a preguntar; nada se rompe */ }
}

/** Lo lee y lo borra: vale para el aporte siguiente y para ninguno más. */
export function tomarContexto(): ContextoHeredado | null {
  try {
    const crudo = sessionStorage.getItem(LLAVE_CONTEXTO);
    sessionStorage.removeItem(LLAVE_CONTEXTO);
    return crudo ? (JSON.parse(crudo) as ContextoHeredado) : null;
  } catch {
    return null;
  }
}
