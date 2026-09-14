import { clienteServidor } from "../datos/cliente.ts";
import type { FilaSintesis } from "../datos/filas.ts";

export type ClaseCorreccion = "mal_interpretado" | "cambio_de_posicion";

export type Sintesis = {
  version: number;
  texto: string;
  clase: "propuesta" | ClaseCorreccion;
  autor: string;
  motivo: string | null;
  creadaEn: string;
  confirmadaEn: string | null;
};

/**
 * Arma el texto de la síntesis a partir de las tres partes que `N03` pide
 * separar: problema, resultado esperado y solución sugerida.
 *
 * **Las tres son opcionales.** La visión lo dice sin rodeos: *«una solución
 * sugerida es bienvenida, pero no debería ser requisito para que un problema sea
 * escuchado»*. Lo único que no puede faltar es que haya alguna.
 */
function componer(p: { problema?: string; resultadoEsperado?: string; solucionSugerida?: string }): string {
  const partes: string[] = [];
  if (p.problema?.trim()) partes.push(`Problema: ${p.problema.trim()}`);
  if (p.resultadoEsperado?.trim()) partes.push(`Lo que se espera: ${p.resultadoEsperado.trim()}`);
  if (p.solucionSugerida?.trim()) partes.push(`Solución sugerida: ${p.solucionSugerida.trim()}`);
  return partes.join("\n");
}

async function siguienteVersion(aporteId: string): Promise<{ version: number; procesoId: string }> {
  const p = clienteServidor().schema("participacion");
  const { data: a } = await p.from("aporte").select("proceso_id").eq("id", aporteId).single();
  if (!a) throw new Error(`no existe el aporte ${aporteId}`);
  const { data } = await p.from("sintesis").select("version")
    .eq("aporte_id", aporteId).order("version", { ascending: false }).limit(1);
  return { version: (data?.[0]?.version ?? 0) + 1, procesoId: a.proceso_id };
}

/**
 * Guarda lo que la persona dice que es su problema.
 *
 * **Aquí no hay IA, y no es una carencia.** `IA-01` la deja como ampliación y
 * exige que todo funcione sin ella. El camino manual no es un apaño: es
 * preguntarle a la persona, después de que contó libremente, por las tres partes
 * que `N03` pide separar.
 *
 * Proponer sin que la persona pueda corregir sería decidir por ella, y `V14`
 * dice que la última palabra sobre su síntesis es suya.
 */
export async function proponerSintesis(e: {
  aporteId: string; autor: string;
  problema?: string; resultadoEsperado?: string; solucionSugerida?: string;
}): Promise<void> {
  const texto = componer(e);
  if (!texto) throw new Error("una síntesis vacía no se guarda: falta al menos una de las tres partes");

  const p = clienteServidor().schema("participacion");
  const { version, procesoId } = await siguienteVersion(e.aporteId);
  const { error } = await p.from("sintesis").insert({
    proceso_id: procesoId, aporte_id: e.aporteId, version,
    texto, clase: "propuesta", autor: e.autor,
  });
  if (error) throw new Error(`no se pudo guardar la síntesis: ${error.message}`);
}

/**
 * La persona confirma que entendimos bien.
 *
 * **Mueve `estado_confirmacion` y nada más.** `backoffice-especificacion.md` es
 * explícito: *«validar una síntesis no equivale a verificar los hechos»*. Tocar
 * también `estado_revision` aquí sería afirmar que alguien de la institución ya
 * la miró, y no la ha mirado nadie.
 */
export async function confirmarSintesis(e: { aporteId: string; autor: string }): Promise<void> {
  const p = clienteServidor().schema("participacion");
  const { data: ultima } = await p.from("sintesis").select("id")
    .eq("aporte_id", e.aporteId).order("version", { ascending: false }).limit(1).single();
  if (!ultima) throw new Error("no hay síntesis que confirmar");

  const { error } = await p.from("sintesis")
    .update({ confirmada_en: new Date().toISOString() }).eq("id", ultima.id);
  if (error) throw new Error(`no se pudo confirmar: ${error.message}`);

  const { error: e2 } = await p.from("aporte")
    .update({ estado_confirmacion: "confirmado" }).eq("id", e.aporteId);
  if (e2) throw new Error(`no se pudo marcar como confirmado: ${e2.message}`);
}

/**
 * La persona corrige.
 *
 * **Versión nueva, nunca sobreescritura.** La anterior se queda diciendo lo que
 * decía, porque el día que alguien pregunte por qué cambió hay que poder
 * mostrarlo.
 *
 * Las dos clases se distinguen porque `V14` dice que **tienen efectos distintos
 * sobre el registro histórico**. Cuáles exactamente sigue abierto (`Q15`): aquí
 * se guarda la distinción, no se usa. Guardarla ahora es lo que permite decidir
 * después sin haber perdido el dato.
 */
export async function corregirSintesis(e: {
  aporteId: string; texto: string; clase: ClaseCorreccion; autor: string; motivo?: string;
}): Promise<void> {
  if (!e.texto?.trim()) throw new Error("una corrección vacía no es una corrección");

  const p = clienteServidor().schema("participacion");
  const { version, procesoId } = await siguienteVersion(e.aporteId);
  // La restricción del esquema es la que rechaza una clase inventada.
  const { error } = await p.from("sintesis").insert({
    proceso_id: procesoId, aporte_id: e.aporteId, version,
    texto: e.texto.trim(), clase: e.clase, autor: e.autor, motivo: e.motivo ?? null,
  });
  if (error) throw new Error(`no se pudo corregir: ${error.message}`);
}

/** Todas las versiones, en orden. La historia completa, nunca recortada. */
export async function sintesisDe(aporteId: string): Promise<Sintesis[]> {
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.from("sintesis")
    .select("version, texto, clase, autor, motivo, creada_en, confirmada_en")
    .eq("aporte_id", aporteId).order("version", { ascending: true });
  if (error) throw new Error(`no se pudo leer la síntesis: ${error.message}`);
  return ((data ?? []) as FilaSintesis[]).map((s) => ({
    version: s.version, texto: s.texto, clase: s.clase as Sintesis["clase"], autor: s.autor,
    motivo: s.motivo, creadaEn: s.creada_en, confirmadaEn: s.confirmada_en,
  }));
}
