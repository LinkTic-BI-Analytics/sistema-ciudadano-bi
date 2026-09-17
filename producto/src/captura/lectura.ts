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
 * Los temas con los que se enruta y se agrupa (`CLA-01`).
 *
 * **Son los sectores administrativos del Estado, y esa es la decisión.** Antes
 * eran diecisiete etiquetas escritas desde lo que cuenta la gente («agua»,
 * «vías», «basuras»). Se leían mejor, y tenían un defecto que no se arregla
 * escribiéndolas mejor: **no decían a quién le toca**. Un aporte de agua
 * potable y uno de basuras van los dos a Vivienda, Ciudad y Territorio, y con
 * la lista anterior había que saberlo de memoria para enrutarlos.
 *
 * Con los sectores, el tema y la entidad que responde son lo mismo, que es lo
 * que `CLA-01` necesita para que agrupar sirva de algo.
 *
 * **Lo que cuesta, y hay que mirarlo en la validación:** quien cuenta no habla
 * en sectores. Nadie dice «esto es de Vivienda, Ciudad y Territorio»; dice «no
 * llega el agua». Por eso `QUE_CUBRE` está escrito en las palabras de la gente
 * y no en las del organigrama: es lo que traduce una cosa en la otra, para la
 * lectura con IA y para quien escoge en la pantalla.
 *
 * Siguen siendo **provisionales** mientras `T018` y `Q32` estén abiertos.
 *
 * **`otro` no es un cajón que se ignora**: sale marcado en la bandeja, y que un
 * mismo asunto se repita ahí es la señal de que a esta lista le falta algo
 * (`Q32`). Con veinticuatro sectores todo *cabe* en alguno, y por eso hace más
 * falta que antes: sin él, la lectura mete a la fuerza en un sector lo que no
 * supo clasificar, y nadie se entera de que no supo.
 *
 * El orden es el que entregó el cliente. No es alfabético ni por frecuencia, y
 * no se reordena: un orden por cuántos aportes tiene cada uno sería un ranking,
 * y `BI-02` prohíbe eso.
 */
export const TEMAS = [
  "salud", "vivienda", "transporte", "educacion", "ambiente", "defensa",
  "agricultura", "comercio", "minas", "inclusion", "presidencia", "tic",
  "deporte", "justicia", "culturas", "interior", "exteriores", "funcion_publica",
  "hacienda", "ciencia", "planeacion", "trabajo", "estadistica", "inteligencia",
  "otro",
] as const;

export type Tema = (typeof TEMAS)[number];

export const COMO_SE_LLAMA: Record<Tema, string> = {
  salud: "Salud y Protección Social",
  vivienda: "Vivienda, Ciudad y Territorio",
  transporte: "Transporte",
  educacion: "Educación",
  ambiente: "Ambiente y Desarrollo Sostenible",
  defensa: "Defensa",
  agricultura: "Agricultura y Desarrollo Rural",
  comercio: "Comercio, Industria y Turismo",
  minas: "Minas y Energía",
  inclusion: "Inclusión Social y Reconciliación",
  presidencia: "Presidencia de la República",
  tic: "Tecnologías de la Información y la Comunicación",
  deporte: "Deporte y Recreación",
  justicia: "Justicia",
  culturas: "Culturas",
  interior: "Interior",
  exteriores: "Relaciones Exteriores",
  funcion_publica: "Función Pública",
  hacienda: "Hacienda",
  ciencia: "Ciencia, Tecnología e Innovación",
  planeacion: "Planeación",
  trabajo: "Trabajo",
  estadistica: "Estadística",
  inteligencia: "Inteligencia",
  otro: "Otra cosa",
};

/**
 * Qué cubre cada tema, **en las palabras con las que la gente lo cuenta**.
 *
 * No es documentación: va dentro del prompt, y es además lo único que hace
 * usable una lista de sectores. Nadie cuenta su problema diciendo «esto es de
 * Vivienda, Ciudad y Territorio»; dice «no llega el agua». Sin esta columna, la
 * lectura tendría que adivinar el organigrama colombiano, y quien escoge en la
 * pantalla tendría que conocerlo.
 *
 * Las fronteras dudosas se dicen aquí, no se dejan a la interpretación: con
 * veinticuatro sectores hay muchas más que con diecisiete temas, y son las que
 * deciden dónde cae «me toca caminar dos horas para cobrar el subsidio».
 */
export const QUE_CUBRE: Record<Tema, string> = {
  salud: "puestos y centros de salud, citas, medicamentos, ambulancias, salud mental, la EPS, vacunación, pensiones",
  vivienda: "la casa —vivienda, mejoramiento, titulación—, el agua que llega sucia o no llega, acueducto, alcantarillado, pozos, basuras y reciclaje, parques y espacio público",
  transporte: "vías, puentes, andenes, transporte público y escolar, cómo salir del pueblo",
  educacion: "colegios, profesores, alimentación escolar, cupos, internet para estudiar, universidad",
  ambiente: "contaminación, deforestación, ríos, efecto de la minería, riesgo de derrumbe o inundación, animales callejeros y maltrato animal",
  defensa: "delitos, extorsión, grupos armados, presencia de la policía o el ejército, inseguridad en el barrio",
  agricultura: "cultivos, tierra, riego, crédito y asistencia técnica al campesino, precios, comprar y vender la cosecha",
  comercio: "negocios y tiendas, turismo, formalizar o montar una empresa, industria",
  minas: "luz, cortes de energía, alumbrado público, gas, combustible, la minería y quién la hace",
  inclusion: "hambre, subsidios que no llegan, adulto mayor sin ingresos, discapacidad, primera infancia, víctimas del conflicto, habitante de calle, violencia contra la mujer e intrafamiliar, cuidado de niños o enfermos",
  presidencia: "atención de emergencias y desastres, derechos humanos, y lo que la persona le dirige a la Presidencia sin que haya un sector que lo reciba",
  tic: "internet, señal de celular, telefonía, correo, páginas del Estado que no cargan",
  deporte: "canchas, escenarios deportivos, escuelas de deporte, recreación",
  justicia: "denuncias sin respuesta, no hay a quién reclamar ante la ley, cárceles, conflictos entre vecinos que nadie resuelve, drogas",
  culturas: "casas de la cultura, bibliotecas, patrimonio, fiestas y tradiciones, artistas",
  interior: "convivencia, juntas de acción comunal y participación, líderes amenazados, asuntos étnicos, bomberos",
  exteriores: "pasaporte, visa, consulados, colombianos que viven afuera, migrantes, la frontera",
  funcion_publica: "trámites de una entidad que no avanzan, mala atención al ciudadano, empleo público, corrupción de un funcionario",
  hacienda: "impuestos, predial, acceso a crédito y bancos, plata pública",
  ciencia: "investigación, innovación, becas de posgrado",
  planeacion: "el Sisbén y su puntaje, planes de desarrollo, regalías, en qué se invierte",
  trabajo: "no hay trabajo, informalidad, salarios, capacitación para trabajar, el SENA, riesgos laborales",
  estadistica: "el censo, encuestas del DANE, cifras oficiales",
  inteligencia: "inteligencia del Estado",
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
