import { clienteServidor } from "../datos/cliente.ts";
import { todas, porLotes, type Respuesta } from "../datos/leer.ts";
import { antiguedadDe, alcanceDe, type Antiguedad, type Alcance } from "./normalizar.ts";
import { enPartes } from "./sintesis-en-partes.ts";

/**
 * La bandeja de revisión (`backoffice-especificacion.md` · «Bandeja de aportes»).
 *
 * Hasta ahora mostraba **solo los que tenían la ubicación por aclarar**, y con
 * tres datos: relato, lugar y fecha. Se diseñó cuando el formulario capturaba
 * tres cosas. Hoy captura diez, y el revisor seguía sin poder distinguir un
 * aporte de otro — ni ver los que ya estaban ubicados.
 *
 * Lo que trae ahora es lo que la especificación pide —aporte, territorio,
 * estado, responsable— más **las señales que cambian cómo se revisa**:
 *
 *   · llegó **por voz**: la transcripción puede estar mal, y hay audio que oír;
 *   · **habla por un grupo**: hay a quién responderle, y nadie lo verificó;
 *   · tiene **alerta de urgencia**: se mira antes que lo demás;
 *   · **qué le falta**: sin municipio, sin a quiénes, sin desde cuándo.
 *
 * Lo que **no** trae, y es deliberado: ninguna puntuación. El orden es de la
 * más antigua a la más reciente, y se conserva al filtrar. `BI-02` prohíbe
 * ordenar por popularidad, y una columna de puntaje es una puntuación aunque se
 * llame de otra forma.
 */

export type Señal = "voz" | "grupo" | "urgencia" | "evento";

export type FilaBandeja = {
  aporteId: string;
  relato: string;
  /**
   * El problema y lo que se espera, **como la persona los confirmó** (`V14`).
   *
   * La fila enseñaba los primeros 70 caracteres del relato crudo: había que
   * leer redacción para saber de qué se trata, y con un relato largo el corte
   * dejaba fuera justo lo que importa. `NOR-03`.
   *
   * `null` cuando todavía no hay síntesis confirmada — entonces manda el
   * relato, que es lo que hay.
   */
  problema: string | null;
  loQueSeEspera: string | null;
  /** Hace cuánto, en rango. El texto declarado sigue siendo el dato (`NOR-01`). */
  antiguedad: Antiguedad;
  /** A cuántos, en rango (`NOR-02`). */
  alcance: Alcance;
  desdeCuando: string | null;
  afectados: string | null;
  recibidoEn: string;
  /** El municipio aceptado, o `null` si nadie lo ha resuelto todavía. */
  territorio: string | null;
  /** Su código DIVIPOLA, para filtrar sin depender de cómo se escriba. */
  territorioCodigo: string | null;
  /**
   * El departamento del municipio aceptado.
   *
   * **Se capturaba y no se veía en ninguna parte.** La ficha lo traía de la
   * base y no lo usaba; la bandeja ni lo cargaba. Sin él no hay forma de mirar
   * «lo de Boyacá» sin saberse los municipios de memoria.
   */
  departamento: string | null;
  departamentoCodigo: string | null;
  lugarDeclarado: string | null;
  estadoUbicacion: string;
  estadoRevision: string;
  /** Quién lo tiene. `null` es «nadie», y es una respuesta, no un hueco. */
  responsable: string | null;
  /**
   * De qué habla, confirmado por la persona. `null` es «sin tema», y eso
   * también se dice: un aporte sin tema no se puede enrutar a ninguna mesa.
   */
  tema: string | null;
  /**
   * Si ya salió hacia una mesa o un equipo, y si allá lo aceptaron.
   *
   * Sin esto, dos personas remiten lo mismo dos veces — y la segunda no tiene
   * forma de saberlo sin abrir el aporte.
   */
  escalado: "no" | "pendiente" | "recibido";
  /**
   * Si ya tiene un expediente abierto.
   *
   * Es distinto de estar escalado: abrir el expediente es reconocer la
   * necesidad, remitirlo es mandarla a alguien. Lo primero pasa mucho antes.
   */
  conExpediente: boolean;
  señales: Señal[];
  /** Lo que la persona no dijo y el revisor va a echar en falta. */
  falta: string[];
};

export type Filtro = {
  /** Busca en relato, lugar, territorio, departamento y tema. Sin tildes. */
  texto?: string;
  /** Código DIVIPOLA del departamento. Filtrar por nombre rompe con las tildes. */
  departamento?: string;
  /** Código DIVIPOLA del municipio. */
  municipio?: string;
  /** Un tema de la lista, o `sin_tema` para los que nadie clasificó. */
  tema?: string;
  /** Solo los que traen una alerta de urgencia sin devolver. */
  soloAlerta?: boolean;
  /** Dónde va la gestión: sin expediente, con expediente, remitido, recibido. */
  gestion?: "sin_expediente" | "con_expediente" | "pendiente" | "recibido";
  /**
   * Hace cuánto, en rango.
   *
   * Es la mitad de la pregunta del negocio: *«qué comunidades tienen más
   * afectaciones del agua con más de cuatro años»*. La otra mitad son el tema y
   * el territorio, que ya se filtran.
   */
  antiguedad?: Antiguedad;
  alcance?: Alcance;
  /** `por_aclarar` · `ubicados` · `todos`. */
  ubicacion?: "por_aclarar" | "ubicados" | "todos";
  /**
   * `antiguos` es el orden de trabajo y el que manda por defecto: el que lleva
   * más esperando se atiende primero. `recientes` es para mirar qué acaba de
   * entrar, que es otra pregunta.
   *
   * Ninguno de los dos es una puntuación. `BI-02` prohíbe ordenar por
   * popularidad, y el día que llegue un aporte con mil apoyos tiene que seguir
   * esperando su turno igual que el de una vereda con uno.
   */
  orden?: "antiguos" | "recientes";
};

/**
 * Lo que se puede escoger en los filtros de territorio.
 *
 * **Salen de los aportes que hay, no del catálogo.** Un desplegable con los
 * 1.122 municipios de Colombia no es un filtro: es otro problema. Aquí solo
 * aparecen los sitios donde de verdad llegó algo.
 *
 * En orden alfabético y **sin el número de aportes al lado**. Ordenar por
 * cuántos hay convertiría el filtro en un ranking, y `BI-02` prohíbe justo eso:
 * el municipio con dieciocho no tiene por qué salir antes que el de uno.
 */
export type Opciones = {
  departamentos: { codigo: string; nombre: string }[];
  municipios: { codigo: string; nombre: string; departamento: string }[];
};

export type Pagina = {
  filas: FilaBandeja[];
  opciones: Opciones;
  /** Cuántos hay en total con ese filtro. **Se dice siempre.** */
  total: number;
  /** Si quedan más sin mostrar. Un corte callado es un dato perdido. */
  hayMas: boolean;
};

/**
 * La fila tal como llega de la base.
 *
 * Se escribe a mano porque el cliente no infiere tipos de un `select` con
 * muchas columnas, y dejarlo en `any` es cómo se cuela una columna mal escrita
 * que no falla hasta que alguien mira la pantalla.
 */
type FilaAporte = {
  id: string; relato_original: string; lugar_declarado: string | null;
  afectados: string | null; desde_cuando: string | null; canal: string;
  recibido_en: string; estado_revision: string;
  es_colectivo: boolean; colectivo_declarado: string | null;
  evento_confirmado_id: string | null;
  tema: string | null;
};

const plano = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export async function bandeja(
  procesoId: string, filtro: Filtro = {}, limite = 50,
): Promise<Pagina> {
  const p = clienteServidor().schema("participacion");

  // Todos los aportes, no los primeros mil. Se leen enteros para poder contar y
  // filtrar en memoria; con `.limit(2000)` PostgREST devolvía 1.000 y un `200`,
  // así que el aporte 1.001 no existía para la bandeja ni para su total.
  const filasCrudas = await todas<FilaAporte>("la bandeja", (desde, hasta) =>
    p.from("aporte")
      .select("id, relato_original, lugar_declarado, afectados, desde_cuando, canal, " +
              "recibido_en, estado_revision, es_colectivo, colectivo_declarado, evento_confirmado_id, tema")
      .eq("proceso_id", procesoId).is("retirado_en", null)
      .order("recibido_en", { ascending: true })
      // El cliente no infiere la fila de un `select` partido en dos líneas: la
      // forma es `FilaAporte`, escrita arriba a mano por esa misma razón.
      .range(desde, hasta) as unknown as PromiseLike<Respuesta<FilaAporte>>);
  const vacia: Opciones = { departamentos: [], municipios: [] };
  if (!filasCrudas.length) return { filas: [], opciones: vacia, total: 0, hayMas: false };

  const ids = filasCrudas.map((a) => a.id);

  // Las tres consultas de al lado se hacen aparte y no con un `select` anidado:
  // los anidados de PostgREST recortan a 1.000 filas sin avisar, y ya perdimos
  // 122 municipios por eso una vez.
  //
  // **Y las que filtran por la lista de aportes van por lotes.** Con 788
  // aportes, un `.in("aporte_id", ids)` de un solo golpe arma una URL de ~30 KB
  // y la respuesta era `400`: la bandeja se quedaba sin ninguna ubicación, y
  // con ella sin un solo departamento ni municipio que ofrecer en los filtros.
  const [ubicaciones, alertas, territorios] = await Promise.all([
    porLotes<{ aporte_id: string; estado: string; territorio_codigo: string | null; autor: string | null }>(
      "las ubicaciones", ids, (lote, desde, hasta) =>
        p.from("ubicacion").select("aporte_id, estado, territorio_codigo, autor")
          .in("aporte_id", lote).order("aporte_id").range(desde, hasta)),
    porLotes<{ aporte_id: string; devuelta_en: string | null }>(
      "las alertas", ids, (lote, desde, hasta) =>
        p.from("alerta").select("aporte_id, devuelta_en")
          .in("aporte_id", lote).order("aporte_id").range(desde, hasta)),
    // Los 1.122 municipios del país, por páginas: de un tirón vienen 1.000 y un
    // `200`, y los 122 de la cola —la periferia, por orden de código— se
    // quedaban sin nombre y sin departamento.
    todas<{ codigo: string; nombre: string; padre: string | null }>(
      "el catálogo de municipios", (desde, hasta) =>
        p.from("territorio").select("codigo, nombre, padre").eq("nivel", "municipio")
          .order("codigo").range(desde, hasta)),
  ]);

  // La síntesis vigente de cada aporte: es lo que la persona confirmó, y lo que
  // se enseña en la fila. Aparte y no anidada, como las demás: los anidados de
  // PostgREST recortan a 1.000 filas sin avisar.
  const sintesis = await porLotes<{ aporte_id: string; version: number; texto: string }>(
    "las síntesis", ids, (lote, desde, hasta) =>
      p.from("sintesis").select("aporte_id, version, texto")
        .in("aporte_id", lote).order("version").range(desde, hasta));
  const vigenteDe = new Map<string, string>();
  for (const s of sintesis) {
    // Van ordenadas por versión, así que la última que pase es la vigente.
    vigenteDe.set(s.aporte_id, s.texto);
  }

  // Los 33 departamentos, para poder decir «Rionegro, Antioquia» y no «05615».
  const { data: deptos } = await p.from("territorio")
    .select("codigo, nombre").eq("nivel", "departamento");
  const nombreDepto = new Map((deptos ?? []).map((d) => [d.codigo as string, d.nombre as string]));
  const nombreMunicipio = new Map(territorios.map((t) => [t.codigo, t.nombre]));
  const padreDe = new Map(territorios.map((t) => [t.codigo, t.padre]));
  const porAporte = new Map<string, { estado: string; codigo: string | null; autor: string | null }>();
  for (const u of ubicaciones) {
    const actual = porAporte.get(u.aporte_id);
    // Si hay una confirmada, manda: es la que resolvió alguien.
    if (!actual || u.estado === "confirmada") {
      porAporte.set(u.aporte_id, { estado: u.estado, codigo: u.territorio_codigo, autor: u.autor });
    }
  }
  const conAlerta = new Set(alertas.filter((a) => !a.devuelta_en).map((a) => a.aporte_id));

  // **Si ya se escaló.** Va por el expediente, que es lo que se remite: el
  // aporte es de la persona y no se manda a ninguna parte. Dos consultas
  // sueltas, no un anidado: los anidados de PostgREST recortan a 1.000 filas
  // sin avisar.
  const vinculos = await porLotes<{ aporte_id: string; expediente_id: string }>(
    "los vínculos con expedientes", ids, (lote, desde, hasta) =>
      p.from("vinculo_aporte_expediente").select("aporte_id, expediente_id")
        .in("aporte_id", lote).is("desvinculado_en", null)
        .order("aporte_id").range(desde, hasta));
  const expedientes = [...new Set(vinculos.map((v) => v.expediente_id))];
  const remisiones = await porLotes<{ expediente_id: string; aceptada_en: string | null }>(
    "las remisiones", expedientes, (lote, desde, hasta) =>
      p.from("actuacion").select("expediente_id, aceptada_en")
        .in("expediente_id", lote).eq("tipo", "remision")
        .order("expediente_id").range(desde, hasta));
  const remisionDe = new Map<string, boolean>();
  for (const r of remisiones) {
    // Una aceptada manda sobre una pendiente: lo que importa es si alguien allá
    // lo tiene, no cuántas veces se mandó.
    const ya = remisionDe.get(r.expediente_id);
    remisionDe.set(r.expediente_id, ya === true || r.aceptada_en !== null);
  }
  const conExpediente = new Set(vinculos.map((v) => v.aporte_id));
  const escaladoDe = new Map<string, "no" | "pendiente" | "recibido">();
  for (const v of vinculos) {
    const estado = remisionDe.get(v.expediente_id);
    if (estado === undefined) continue;
    const actual = escaladoDe.get(v.aporte_id);
    if (actual !== "recibido") escaladoDe.set(v.aporte_id, estado ? "recibido" : "pendiente");
  }

  const filas: FilaBandeja[] = filasCrudas.map((a) => {
    const u = porAporte.get(a.id);
    const señales: Señal[] = [];
    if (a.canal === "voz_transcrita") señales.push("voz");
    if (a.es_colectivo) señales.push("grupo");
    if (conAlerta.has(a.id)) señales.push("urgencia");
    if (a.evento_confirmado_id) señales.push("evento");

    // Lo que falta se nombra en palabras, no con códigos: el revisor tiene que
    // saber qué preguntar, no qué columna está vacía.
    const falta: string[] = [];
    if (u?.estado !== "confirmada") falta.push("municipio");
    if (!a.afectados) falta.push("a quiénes");
    if (!a.desde_cuando) falta.push("desde cuándo");

    const padre = u?.codigo ? padreDe.get(u.codigo) ?? null : null;

    // De la síntesis salen las dos líneas que se leen primero. Si no hay, la
    // fila enseña el relato: `N03` no admite que falte el original, pero
    // tampoco obliga a esconder lo que la persona confirmó.
    const campos = new Map(vigenteDe.has(a.id) ? enPartes(vigenteDe.get(a.id)!) : []);

    return {
      aporteId: a.id,
      relato: a.relato_original,
      problema: campos.get("Problema") ?? null,
      loQueSeEspera: campos.get("Lo que se espera") ?? null,
      antiguedad: antiguedadDe(a.desde_cuando),
      alcance: alcanceDe(a.afectados),
      desdeCuando: a.desde_cuando,
      afectados: a.afectados,
      recibidoEn: a.recibido_en,
      territorio: u?.codigo ? nombreMunicipio.get(u.codigo) ?? u.codigo : null,
      territorioCodigo: u?.codigo ?? null,
      departamento: padre ? nombreDepto.get(padre) ?? null : null,
      departamentoCodigo: padre,
      lugarDeclarado: a.lugar_declarado,
      estadoUbicacion: u?.estado ?? "sin_ubicacion",
      estadoRevision: a.estado_revision,
      responsable: u?.autor ?? null,
      tema: a.tema,
      escalado: escaladoDe.get(a.id) ?? "no",
      conExpediente: conExpediente.has(a.id),
      señales, falta,
    };
  });

  // Las opciones salen de **todas** las filas, no de las filtradas: si se
  // calcularan después, escoger Antioquia dejaría el desplegable con Antioquia
  // como única opción y no habría forma de volver.
  const porCodigo = new Map<string, { codigo: string; nombre: string }>();
  const munPorCodigo = new Map<string, { codigo: string; nombre: string; departamento: string }>();
  for (const f of filas) {
    if (f.departamentoCodigo && f.departamento) {
      porCodigo.set(f.departamentoCodigo, { codigo: f.departamentoCodigo, nombre: f.departamento });
    }
    if (f.territorioCodigo && f.territorio) {
      munPorCodigo.set(f.territorioCodigo, {
        codigo: f.territorioCodigo, nombre: f.territorio,
        departamento: f.departamentoCodigo ?? "",
      });
    }
  }
  const alfabetico = (a: { nombre: string }, b: { nombre: string }) =>
    a.nombre.localeCompare(b.nombre, "es");
  const opciones: Opciones = {
    departamentos: [...porCodigo.values()].sort(alfabetico),
    municipios: [...munPorCodigo.values()].sort(alfabetico),
  };

  const texto = filtro.texto?.trim() ? plano(filtro.texto.trim()) : null;
  const coinciden = filas
    .filter((f) => {
      if (filtro.ubicacion === "por_aclarar" && f.estadoUbicacion === "confirmada") return false;
      if (filtro.ubicacion === "ubicados" && f.estadoUbicacion !== "confirmada") return false;
      // **Por código, no por nombre.** Filtrar por el nombre obliga a acertar
      // las tildes de «BOYACÁ» o «CHOCÓ», y el que filtra está escogiendo de una
      // lista: el código ya lo tiene.
      if (filtro.departamento && f.departamentoCodigo !== filtro.departamento) return false;
      if (filtro.municipio && f.territorioCodigo !== filtro.municipio) return false;
      // `sin_tema` no es lo mismo que no filtrar: es una respuesta sobre el
      // aporte —nadie lo pudo enrutar— y hay que poder pedirla.
      if (filtro.tema === "sin_tema" && f.tema) return false;
      if (filtro.tema && filtro.tema !== "sin_tema" && f.tema !== filtro.tema) return false;
      if (filtro.soloAlerta && !f.señales.includes("urgencia")) return false;
      if (filtro.antiguedad && f.antiguedad !== filtro.antiguedad) return false;
      if (filtro.alcance && f.alcance !== filtro.alcance) return false;
      if (filtro.gestion === "sin_expediente" && f.conExpediente) return false;
      if (filtro.gestion === "con_expediente" && !f.conExpediente) return false;
      if (filtro.gestion === "pendiente" && f.escalado !== "pendiente") return false;
      if (filtro.gestion === "recibido" && f.escalado !== "recibido") return false;
      if (!texto) return true;
      // Relato, lugar, territorio, departamento y tema, sin tildes ni
      // mayúsculas, como pide la especificación del backoffice.
      return plano(`${f.relato} ${f.lugarDeclarado ?? ""} ${f.territorio ?? ""} ` +
                   `${f.departamento ?? ""} ${f.tema ?? ""}`).includes(texto);
    });

  // `antiguos` es como vienen de la base. Para `recientes` se da la vuelta.
  const ordenadas = filtro.orden === "recientes" ? [...coinciden].reverse() : coinciden;

  // **Se devuelve el total, no solo la página.** Cortar en 50 sin decirlo es
  // cómo diez aportes recién registrados se volvieron invisibles: estaban en
  // las posiciones 97 a 106 de 106 y la pantalla no daba ninguna señal de que
  // hubiera más. Es el mismo defecto que dejó 122 municipios fuera del
  // buscador.
  return {
    filas: ordenadas.slice(0, limite),
    opciones,
    total: ordenadas.length,
    hayMas: ordenadas.length > limite,
  };
}
