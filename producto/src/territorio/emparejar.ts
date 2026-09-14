import { clienteServidor } from "../datos/cliente.ts";

/**
 * Busca en DIVIPOLA los municipios que la persona pudo haber nombrado.
 *
 * **Propone, no decide.** `I2` prohíbe inferir la ubicación, y esto no infiere:
 * encuentra candidatos y se los enseña a la persona para que ella confirme. Que
 * el ciudadano confirme el lugar es literalmente su papel en la especificación
 * —*«cuenta qué pasa, confirma la síntesis del problema y el lugar afectado»*— y
 * es quien mejor lo sabe. Hoy esa confirmación la hace un revisor que no estuvo
 * ahí.
 *
 * Nunca devuelve uno solo por descarte. «Rionegro» existe en Antioquia y en
 * Santander, y **elegir por ella sería exactamente lo que `I2` prohíbe**: si el
 * texto no distingue, se le muestran los dos.
 */

/** Cuántos municipios tiene cargados. Para comprobar que no falta ninguno. */
export async function cuantosMunicipios(): Promise<number> {
  return (await municipios()).length;
}

export type Candidato = {
  codigo: string;
  version: string;
  nombre: string;
  departamento: string;
};

/** Minúsculas, sin tildes, sin puntuación. «Chocó» y «choco» son el mismo sitio. */
export function plano(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Nombres que aparecen en cualquier frase y harían coincidir a un municipio con
// cualquier cosa. «La Paz», «La Unión» o «El Carmen» son municipios de verdad,
// pero sueltos generan más ruido que señal: solo cuentan si además aparece su
// departamento.
const DEMASIADO_COMUN = new Set([
  "la paz", "union", "la union", "el paso", "san juan", "santa fe", "el retiro",
  "la victoria", "el carmen", "la esperanza", "el rosario", "san pedro", "la plata",
  "el tambo", "la cruz", "la merced", "el dorado", "la primavera", "san jose",
]);

type Fila = { codigo: string; version: string; nombre: string; departamento: string };

let catalogo: Fila[] | null = null;

/**
 * Todos los municipios, leídos una vez.
 *
 * **Por páginas, y no es una optimización: es lo único que los trae todos.**
 * PostgREST corta en 1.000 filas por respuesta y no avisa — devuelve 1.000 con
 * un `200` como si fueran todas. Hay 1.122 municipios, así que **122 no
 * existían para el buscador**, y por el orden del código eran Amazonas,
 * Guainía, Vaupés, Vichada, Guaviare, Putumayo, Arauca, Casanare, San Andrés y
 * el Valle del Cauca entero.
 *
 * Es decir: la periferia. Quien viviera ahí escribía el nombre de su municipio
 * y le decíamos que no existe.
 *
 * Nada fallaba. Las pruebas usaban Rionegro, Medellín y Soacha, que están entre
 * los primeros mil. Por eso ahora hay una que cuenta.
 */
async function municipios(): Promise<Fila[]> {
  if (catalogo) return catalogo;
  const p = clienteServidor().schema("participacion");

  const PAGINA = 1000;
  const data: { codigo: string; version: string; nombre: string; padre: string }[] = [];
  for (let desde = 0; ; desde += PAGINA) {
    const { data: trozo, error } = await p.from("territorio")
      .select("codigo, version, nombre, padre").eq("nivel", "municipio")
      .order("codigo").range(desde, desde + PAGINA - 1);
    if (error) throw new Error(`no se pudo leer el catálogo: ${error.message}`);
    data.push(...((trozo ?? []) as typeof data));
    if ((trozo?.length ?? 0) < PAGINA) break;
  }

  const { data: deps } = await p.from("territorio")
    .select("codigo, nombre").eq("nivel", "departamento");
  const nombreDe = new Map((deps ?? []).map((d) => [d.codigo as string, d.nombre as string]));

  catalogo = data.map((m) => ({
    codigo: m.codigo,
    version: m.version,
    nombre: m.nombre,
    departamento: nombreDe.get(m.padre) ?? "",
  }));
  return catalogo;
}

/** ¿Aparece `aguja` en `pajar` como palabras completas? */
function contiene(pajar: string, aguja: string): boolean {
  if (!aguja) return false;
  let desde = 0;
  for (;;) {
    const i = pajar.indexOf(aguja, desde);
    if (i < 0) return false;
    const antes = i === 0 || pajar[i - 1] === " ";
    const despues = i + aguja.length === pajar.length || pajar[i + aguja.length] === " ";
    if (antes && despues) return true;
    desde = i + 1;
  }
}

export async function buscarMunicipios(texto: string, limite = 3): Promise<Candidato[]> {
  const t = plano(texto);
  if (t.length < 3) return [];

  const puntuados = (await municipios())
    .map((m) => {
      const nombre = plano(m.nombre);
      if (!contiene(t, nombre)) return null;
      const departamento = plano(m.departamento);
      const conDepartamento = departamento ? contiene(t, departamento) : false;
      if (DEMASIADO_COMUN.has(nombre) && !conDepartamento) return null;
      // Más palabras es más específico: «Santa Rosa de Osos» no coincide por azar.
      return { m, conDepartamento, punto: nombre.split(" ").length * 10 + (conDepartamento ? 100 : 0) };
    })
    .filter((x): x is { m: Fila; conDepartamento: boolean; punto: number } => x !== null)
    .sort((a, b) => b.punto - a.punto || a.m.nombre.localeCompare(b.m.nombre));

  if (puntuados.length === 0) return [];

  // **Si nombró el departamento, solo salen los de ese departamento.** No es
  // decidir por ella: lo dijo. Seguir ofreciéndole el Rionegro de Santander
  // cuando escribió «rionegro antioquia» es ruido, y el ruido en una lista de
  // botones se toca por error.
  const conDepto = puntuados.filter((x) => x.conDepartamento);
  const universo = conDepto.length ? conDepto : puntuados;

  // **Los empatados se devuelven todos.** Si el texto dice «Rionegro» y nada
  // más, hay dos y la persona escoge; recortar a uno sería decidir por ella.
  const mejor = universo[0]!.punto;
  const empatados = universo.filter((x) => x.punto === mejor);
  const resto = universo.filter((x) => x.punto < mejor);

  return [...empatados, ...resto]
    .slice(0, Math.max(limite, empatados.length))
    .map(({ m }) => ({ codigo: m.codigo, version: m.version, nombre: m.nombre, departamento: m.departamento }));
}


/**
 * Busca municipios por lo que la persona está escribiendo.
 *
 * Distinto de `buscarMunicipios`: aquel lee una frase entera y encuentra el
 * nombre dentro; este recibe un nombre a medio escribir y completa. Uno sirve
 * para leer el relato, el otro para una caja de búsqueda.
 *
 * Empieza por los que **empiezan** con lo escrito: quien teclea «rio» busca
 * Rionegro antes que Puerto Rico, y poner los que solo lo contienen arriba
 * obliga a leer una lista para encontrar lo obvio.
 */
export async function buscarPorNombre(parcial: string, limite = 8): Promise<Candidato[]> {
  const q = plano(parcial);
  if (q.length < 3) return [];

  const puntuados = (await municipios())
    .map((m) => {
      const nombre = plano(m.nombre);
      const departamento = plano(m.departamento);
      // También se busca «rionegro antioquia» escrito de corrido, porque es
      // como la gente lo dice y como lo va a teclear.
      const junto = `${nombre} ${departamento}`;
      let punto = 0;
      if (nombre === q) punto = 400;
      else if (nombre.startsWith(q)) punto = 300;
      else if (junto.startsWith(q)) punto = 250;
      else if (nombre.includes(q)) punto = 200;
      else if (junto.includes(q)) punto = 100;
      return punto ? { m, punto } : null;
    })
    .filter((x): x is { m: Fila; punto: number } => x !== null)
    .sort((a, b) => b.punto - a.punto || a.m.nombre.localeCompare(b.m.nombre));

  return puntuados.slice(0, limite).map(({ m }) => ({
    codigo: m.codigo, version: m.version, nombre: m.nombre, departamento: m.departamento,
  }));
}
