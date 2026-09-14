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

/** Se lee una vez. Son 1.122 filas y no cambian mientras corre el proceso. */
async function municipios(): Promise<Fila[]> {
  if (catalogo) return catalogo;
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.from("territorio")
    .select("codigo, version, nombre, padre").eq("nivel", "municipio");
  if (error) throw new Error(`no se pudo leer el catálogo: ${error.message}`);

  const { data: deps } = await p.from("territorio")
    .select("codigo, nombre").eq("nivel", "departamento");
  const nombreDe = new Map((deps ?? []).map((d) => [d.codigo as string, d.nombre as string]));

  catalogo = (data ?? []).map((m) => ({
    codigo: m.codigo as string,
    version: m.version as string,
    nombre: m.nombre as string,
    departamento: nombreDe.get(m.padre as string) ?? "",
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
