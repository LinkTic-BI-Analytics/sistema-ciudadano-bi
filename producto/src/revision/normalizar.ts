/**
 * De lo que la persona escribió a un rango con el que se puede agrupar.
 *
 * **Lo derivado nunca sustituye lo dicho** (`NOR-01`, `NOR-02`). Aquí no se
 * calcula ninguna fecha ni ningún número: se devuelve un rango, y el texto
 * original sigue siendo el dato. ADR 0012 lo dejó dicho: «hace tres meses» no
 * es una fecha, y nadie sabe si son noventa días o el año pasado.
 *
 * **Falla hacia `sin_decir`.** Es mejor una bandeja que admite que no sabe que
 * una que agrupa mal sin que nadie se entere: un rango vacío dice que no se
 * precisó; un rango inventado es una mentira que después alguien usa para
 * decidir presupuesto.
 */

export type Antiguedad =
  | "menos_de_un_ano" | "entre_uno_y_cuatro" | "mas_de_cuatro" | "sin_decir";

export type Alcance =
  | "una_familia" | "varias_familias" | "una_comunidad" | "sin_decir";

const plano = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Los números que la gente escribe con letras. Nadie pone «4» en una frase. */
const EN_LETRAS: Record<string, number> = {
  un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6,
  siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, quince: 15,
  veinte: 20, treinta: 30, cincuenta: 50, cien: 100,
};

function numeroEn(texto: string): number | null {
  const cifra = texto.match(/\d+/);
  if (cifra) return Number(cifra[0]);
  for (const [palabra, valor] of Object.entries(EN_LETRAS)) {
    if (new RegExp(`\\b${palabra}\\b`).test(texto)) return valor;
  }
  return null;
}

export const COMO_SE_LEE_ANTIGUEDAD: Record<Antiguedad, string> = {
  menos_de_un_ano: "menos de un año",
  entre_uno_y_cuatro: "entre uno y cuatro años",
  mas_de_cuatro: "más de cuatro años",
  sin_decir: "no dijo desde cuándo",
};

export const COMO_SE_LEE_ALCANCE: Record<Alcance, string> = {
  una_familia: "una familia",
  varias_familias: "varias familias",
  una_comunidad: "una vereda o un barrio",
  sin_decir: "no dijo a cuántos",
};

/**
 * Hace cuánto, según lo que ella escribió.
 *
 * **Dice qué declaró el día que lo contó, y eso no cambia después.** Un aporte
 * no se muda de rango porque haya pasado un año: lo que se conserva es su
 * declaración, no una cuenta viva.
 */
export function antiguedadDe(texto: string | null | undefined): Antiguedad {
  if (!texto?.trim()) return "sin_decir";
  const t = plano(texto);

  // «Siempre», «toda la vida», «desde que tengo memoria». Es lo más crónico que
  // alguien puede decir y se dice así, sin números.
  if (/\b(siempre|toda la vida|de toda la vida|tengo memoria|nos acordamos|hace muchisimo)\b/.test(t)) {
    return "mas_de_cuatro";
  }

  const n = numeroEn(t);

  if (/\banos?\b|\banios?\b/.test(t)) {
    // «Hace años», sin número: son varios, pero cuántos no lo dijo. Meterlo en
    // «más de cuatro» sería decidir por ella.
    if (n === null) return /\bmuchos\b/.test(t) ? "mas_de_cuatro" : "entre_uno_y_cuatro";
    // «Más de cuatro años» son cinco o más; «cuatro años» son cuatro.
    if (/\bmas de\b|\bmas d\b/.test(t)) return n >= 4 ? "mas_de_cuatro" : "entre_uno_y_cuatro";
    if (n >= 5) return "mas_de_cuatro";
    if (n >= 1) return "entre_uno_y_cuatro";
    return "sin_decir";
  }

  // Días, semanas y meses caen todos por debajo del año, incluso «hace 18
  // meses» — no: eso son más de doce.
  if (/\bmes(es)?\b/.test(t)) {
    if (n !== null && n >= 60) return "mas_de_cuatro";
    if (n !== null && n >= 12) return "entre_uno_y_cuatro";
    return "menos_de_un_ano";
  }
  if (/\b(dia|dias|semana|semanas|ayer|anoche|hoy)\b/.test(t)) return "menos_de_un_ano";

  // Un mes del año, sin más: «desde diciembre». Es de este año o del pasado, y
  // en cualquier caso no llega a cuatro.
  if (/\b(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\b/.test(t)) {
    return "menos_de_un_ano";
  }

  // «Desde que empezaron las lluvias», «desde que se fue el contratista». Es una
  // referencia real y no sabemos ponerle tiempo. Se dice que no se sabe.
  return "sin_decir";
}

/**
 * A cuántos, según lo que ella escribió.
 *
 * **El rango es menos preciso a propósito.** «Doce familias de la vereda X»
 * identifica, y eso choca con `C2`; `Q11` sigue abierto ahí. Un rango se puede
 * enseñar donde el número no.
 */
export function alcanceDe(texto: string | null | undefined): Alcance {
  if (!texto?.trim()) return "sin_decir";
  const t = plano(texto);

  // Lo colectivo manda sobre el número: «unas veinte familias de la vereda» es
  // una comunidad, no veinte casas sueltas.
  if (/\b(vereda|barrio|corregimiento|comunidad|resguardo|municipio|pueblo|escuela|colegio|todos|todo el)\b/.test(t)) {
    return "una_comunidad";
  }
  if (/\b(mi casa|mi familia|nosotros|nosotras|mi hogar|una familia|solo yo|yo solo|yo sola)\b/.test(t)) {
    return "una_familia";
  }

  const n = numeroEn(t);
  if (n !== null) {
    if (n <= 1) return "una_familia";
    if (n <= 20) return "varias_familias";
    return "una_comunidad";
  }

  if (/\b(varias|varios|unas cuantas|algunas|la cuadra|vecinos|familias)\b/.test(t)) {
    return "varias_familias";
  }

  return "sin_decir";
}
