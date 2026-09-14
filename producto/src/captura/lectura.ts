/**
 * Lo que entendimos, para devolvérselo a la persona y que lo confirme.
 *
 * Hay dos caminos y **una sola regla**: ninguna palabra que la persona no haya
 * dicho. `leer()` la cumple por construcción, porque solo corta. La IA
 * (`lectura-ia.ts`) la cumple porque se le verifica, y si no la cumple no se
 * usa.
 *
 * Esa regla no es una preferencia de estilo. Una lectura que redacta mejor que
 * la persona es una lectura que la persona acepta por inercia, y entonces el
 * expediente queda con palabras que nadie dijo — y más adelante alguien decide
 * sobre esas palabras creyéndolas suyas.
 */

export type Lectura = {
  /** El problema, en una frase. Sale del relato, sin agregar nada. */
  problema: string;
  /** Solo si la persona lo dijo. `null` es una respuesta: no lo dijo. */
  resultadoEsperado: string | null;
  /** Igual. `N03` la deja opcional y la visión insiste en que no sea requisito. */
  solucionSugerida: string | null;
  /** Tal como lo dijo. `I2`: no se normaliza ni se le pone código. */
  lugar: string | null;
  /** De dónde salió esta lectura. La pantalla no lo muestra; el registro sí. */
  fuente: "segmentacion" | "ia";
};

/** Hasta dónde llega «una frase». Más largo que esto ya no se lee de un vistazo. */
export const LARGO = 180;

/** Normaliza para comparar: minúsculas, sin tildes, sin puntuación, un espacio. */
function plano(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * ¿Todo lo que dice esta lectura estaba en el relato?
 *
 * **Es el guardián de la IA en tiempo de ejecución, no solo una prueba.** Un
 * modelo al que se le pide recortar a veces redacta igual, y la diferencia entre
 * recortar y redactar es justamente la que este proyecto no puede perder.
 *
 * Compara palabra por palabra y no frase por frase a propósito: reordenar o
 * saltarse un conector es recortar; meter un sustantivo nuevo no lo es.
 */
export function anclado(relato: string, ...partes: (string | null | undefined)[]): boolean {
  const origen = new Set(plano(relato).split(" "));
  return partes.every((parte) => {
    if (!parte) return true;
    const palabras = plano(parte).split(" ").filter(Boolean);
    return palabras.length > 0 && palabras.every((p) => origen.has(p));
  });
}

export function recortar(texto: string): string {
  const limpio = texto.replace(/\s+/g, " ").trim();
  return limpio.length > LARGO ? `${limpio.slice(0, LARGO - 1).trimEnd()}…` : limpio;
}

/**
 * La segmentación sin IA. **No interpreta: corta.**
 *
 * Es el camino por defecto y el suelo del otro: `IA-01` exige que todo funcione
 * sin IA, así que esto no es un apaño para cuando falle el proveedor — es lo que
 * pasa siempre que la IA no esté, no conteste, o conteste algo que no está
 * anclado en el relato.
 */
export function leer(relato: string, lugar?: string | null): Lectura {
  const limpio = relato.replace(/\s+/g, " ").trim();

  // El primer corte de oración. Si no hay punto, o la primera frase es tan
  // corta que no dice nada («No hay agua.»), se toma el relato entero: es
  // preferible devolver de más que devolver un fragmento que la persona no
  // reconozca como suyo.
  const corte = limpio.search(/[.;]\s/);
  const primera = corte > 40 ? limpio.slice(0, corte) : limpio;

  return {
    problema: recortar(primera),
    // Sin IA no se separan las otras dos partes: sacarlas con reglas de texto
    // sería adivinar cuál frase era el deseo y cuál la propuesta, y equivocarse
    // ahí le pone a la persona una opinión en la boca.
    resultadoEsperado: null,
    solucionSugerida: null,
    lugar: lugar?.trim() || null,
    fuente: "segmentacion",
  };
}
