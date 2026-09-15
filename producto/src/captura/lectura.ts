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
  /**
   * Las **otras** cosas distintas que contó, si contó más de una.
   *
   * Mucha gente llega con todo junto: «no hay agua, la vía está mala y el
   * puesto de salud abre dos días». Son tres necesidades, y el modelo entero
   * —expediente, prioridad, territorio, quién responde— asume **una**.
   * Mezclarlas en un aporte hace que ninguna se pueda atender: no hay a quién
   * remitirla ni con qué compararla.
   *
   * Aquí no se descarta ninguna. Se le enseñan y **ella escoge de cuál habla**;
   * las demás siguen enteras en su relato original, y se le ofrece contarlas
   * aparte.
   */
  otrosProblemas: string[];
  /** Tal como lo dijo. `I2`: no se normaliza ni se le pone código. */
  lugar: string | null;
  /** A quién afecta. `PRI-01` lo usa como factor, y hoy el revisor lo infiere. */
  afectados: string | null;
  /** **Texto, nunca fecha.** «Hace tres meses» no es una fecha (ADR 0012). */
  desdeCuando: string | null;
  /** Qué debería cambiar. `N03`. */
  resultadoEsperado: string | null;
  /** `N03` la deja opcional y la visión insiste en que no sea requisito. */
  solucionSugerida: string | null;
  /**
   * El tema que propone la lectura. **Lo confirma la persona** (`CLA-01`), y
   * hasta entonces no es el tema del aporte: es lo que leyó una máquina.
   */
  tema: Tema | null;
  /** De dónde salió esta lectura. La pantalla no lo muestra; el registro sí. */
  fuente: "segmentacion" | "ia";
};

/**
 * Las partes que se le pueden preguntar a la persona si no las dijo.
 *
 * El orden **es el orden en que se preguntan**, y va de lo que más le sirve a
 * la revisión a lo que menos. Si la persona se cansa y se va a mitad de camino,
 * lo que quedó sin preguntar es lo que menos falta hace.
 */
export const PREGUNTABLES = [
  "lugar", "afectados", "desdeCuando", "resultadoEsperado", "solucionSugerida",
] as const;

export type Preguntable = (typeof PREGUNTABLES)[number];

/**
 * Cómo se nombra cada parte **cuando se le devuelve lo entendido**.
 *
 * Son afirmaciones, no preguntas: en el formulario se pregunta, y aquí se le
 * enseña lo que contó. Mezclar las dos formas hacía que el resumen se leyera
 * como medio cuestionario.
 */
export const COMO_SE_RESUME: Record<Preguntable | "problema", string> = {
  problema: "El problema",
  lugar: "Dónde ocurre",
  afectados: "A quiénes les pasa",
  desdeCuando: "Desde cuándo",
  resultadoEsperado: "Qué debería cambiar",
  solucionSugerida: "Una solución que propones",
};

export const COMO_SE_PREGUNTA: Record<Preguntable, { etiqueta: string; ayuda: string }> = {
  lugar: {
    etiqueta: "¿Dónde ocurre?",
    // Se le piden las tres cosas juntas porque así es como la gente lo dice
    // —«la vereda La Martinita, Rionegro, Antioquia»— y porque el municipio y el
    // departamento son lo que permite ofrecerle el código de DIVIPOLA para que
    // lo confirme. Sin ellos, su aporte llega a la bandeja sin ubicación.
    ayuda: "El barrio o la vereda, el municipio y el departamento. Si solo sabes una parte, escríbela igual.",
  },
  afectados: {
    etiqueta: "¿A quiénes les pasa?",
    ayuda: "Si son solo ustedes, una cuadra, una vereda entera. Un número aproximado sirve; si no lo sabes, dilo con tus palabras.",
  },
  desdeCuando: {
    etiqueta: "¿Desde cuándo pasa?",
    // «Invierno» era un ejemplo mal traído: en Colombia no hay invierno, y un
    // ejemplo que no es del país enseña a contestar cualquier cosa.
    ayuda: "Como lo recuerdes: «hace dos meses», «desde que empezaron las lluvias», «desde diciembre». Si viene pasando hace años, dilo así.",
  },
  resultadoEsperado: {
    etiqueta: "¿Qué debería cambiar?",
    ayuda: "Cómo se vería tu día si esto estuviera resuelto. No hace falta que sepas quién debe hacerlo.",
  },
  solucionSugerida: {
    etiqueta: "¿Se te ocurre cómo?",
    ayuda: "No hace falta proponer una solución para que el problema se escuche. Si no se te ocurre ninguna, déjalo en blanco.",
  },
};

/**
 * Lo que la persona no dijo, en el orden en que se le va a preguntar.
 *
 * **Es la mitad del valor de leer con IA.** Preguntar por todo convierte la
 * captura en un formulario de seis campos; preguntar solo por lo que falta hace
 * que quien ya lo contó todo no vea casi nada — y quien contó poco vea justo lo
 * que hace falta para que su caso se pueda revisar.
 */
export function loQueFalta(l: Lectura): Preguntable[] {
  return PREGUNTABLES.filter((k) => !l[k]);
}

/**
 * Los temas (`CLA-01`). **Provisional**: la especificación dejó las taxonomías
 * sin cerrar (`T018`, `Q32`), así que esto es un punto de partida y no una
 * clasificación acordada.
 *
 * `otro` no es un cajón que se ignora: es la señal de que a la lista le falta
 * algo, y por eso sale marcado en la bandeja en vez de esconderse.
 */
/**
 * Los temas con los que se enruta y se agrupa.
 *
 * **Son sectores, no capítulos de un programa.** La lista se amplió leyendo un
 * programa político —que es un buen inventario de en qué se va a gobernar— pero
 * los nombres salen del sector, no del programa: lo que se le pone encima a lo
 * que alguien contó no puede llevar el encuadre de nadie. Un PND lo escribe
 * quien gane, y una taxonomía amarrada a una campaña obliga a reclasificar todo
 * lo capturado el día que cambie el gobierno.
 *
 * Los seis últimos antes de `otro` son los que faltaban, y cada uno es alguien
 * que hoy no tenía dónde contar lo suyo: una mujer que reporta violencia
 * intrafamiliar, quien dice «aquí no hay trabajo», quien no tiene qué comer,
 * quien lleva dos años sin que le respondan un trámite.
 *
 * **`otro` no es un cajón que se ignora**: sale marcado en la bandeja, y que un
 * mismo asunto se repita ahí es la señal de que a esta lista le falta algo
 * (`Q32`).
 */
export const TEMAS = [
  "agua", "vias", "salud", "educacion", "energia", "residuos",
  "conectividad", "vivienda", "ambiente", "seguridad",
  "mujeres", "campo", "empleo", "apoyo", "justicia", "cultura", "animales",
  "otro",
] as const;

export type Tema = (typeof TEMAS)[number];

export const COMO_SE_LLAMA: Record<Tema, string> = {
  agua: "Agua y saneamiento",
  vias: "Vías y transporte",
  salud: "Salud",
  educacion: "Educación",
  energia: "Energía y alumbrado",
  residuos: "Basuras y residuos",
  conectividad: "Internet y telefonía",
  vivienda: "Vivienda y espacio público",
  ambiente: "Ambiente y riesgo",
  seguridad: "Seguridad y convivencia",
  mujeres: "Mujeres, violencia de género y cuidado",
  campo: "Campo y producción rural",
  empleo: "Empleo e ingresos",
  apoyo: "Alimentación y apoyo social",
  justicia: "Justicia y acceso al Estado",
  cultura: "Cultura, deporte y recreación",
  animales: "Animales",
  otro: "Otra cosa",
};

/**
 * Qué cubre cada tema, **en las palabras con las que la gente lo cuenta**.
 *
 * No es documentación: va dentro del prompt. Con diecisiete etiquetas, el
 * nombre solo no alcanza para decidir dónde cae «me toca caminar dos horas para
 * cobrar el subsidio» —¿transporte, apoyo social o acceso al Estado?—, y una
 * lista sin fronteras devuelve `otro` o devuelve cualquier cosa.
 *
 * Las fronteras dudosas se dicen aquí, no se dejan a la interpretación.
 */
export const QUE_CUBRE: Record<Tema, string> = {
  agua: "acueducto, alcantarillado, pozos, agua que llega sucia o no llega",
  vias: "vías, puentes, andenes, transporte público y escolar, cómo salir del pueblo",
  salud: "puestos y centros de salud, citas, medicamentos, ambulancias, salud mental",
  educacion: "colegios, profesores, alimentación escolar, cupos, internet para estudiar",
  energia: "luz, cortes de energía, alumbrado público, gas",
  residuos: "recolección de basuras, puntos críticos, reciclaje",
  conectividad: "internet, señal de celular, telefonía",
  vivienda: "vivienda, mejoramiento, titulación, parques y espacio público",
  ambiente: "contaminación, deforestación, minería y su efecto, riesgo de derrumbe o inundación",
  seguridad: "delitos, extorsión, grupos armados, convivencia, violencia en el barrio",
  mujeres: "violencia contra la mujer, violencia intrafamiliar, cuidado de niños o enfermos, autonomía económica de las mujeres",
  campo: "cultivos, tierra, crédito y asistencia técnica, precios, comprar y vender la cosecha",
  empleo: "no hay trabajo, informalidad, emprender, capacitación para trabajar",
  apoyo: "hambre, subsidios que no llegan, adulto mayor sin pensión, discapacidad, primera infancia",
  justicia: "trámites que no avanzan, corrupción, no hay a quién reclamar, denuncias sin respuesta",
  cultura: "cultura, deporte, recreación, casas de la cultura, canchas y escenarios",
  animales: "animales callejeros, maltrato animal, esterilización",
  otro: "nada de lo anterior encaja",
};

export function esTema(v: unknown): v is Tema {
  return typeof v === "string" && (TEMAS as readonly string[]).includes(v);
}

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
    // Sin IA no se propone tema: adivinarlo con palabras sueltas enrutaría un
    // aporte a la entidad equivocada, y eso cuesta más que no proponer nada.
    tema: null,
    // Separar problemas con reglas de texto sería adivinar dónde termina uno:
    // «no hay agua y cuando llega sale turbia» es una sola cosa, y un punto en
    // medio no lo dice. Sin IA no se intenta.
    otrosProblemas: [],
    lugar: lugar?.trim() || null,
    // Sin IA no se separan las otras partes: sacarlas con reglas de texto sería
    // adivinar cuál frase era el deseo y cuál la propuesta, y equivocarse ahí le
    // pone a la persona una opinión en la boca. `null` dice la verdad —no lo
    // sabemos— y el resultado es que se le pregunta por todas.
    afectados: null,
    desdeCuando: null,
    resultadoEsperado: null,
    solucionSugerida: null,
    fuente: "segmentacion",
  };
}
