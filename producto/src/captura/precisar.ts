import { clienteServidor } from "../datos/cliente.ts";

/**
 * Lo que la persona precisó después de contar, en las vueltas de afinado.
 *
 * **Solo llena lo que estaba vacío.** Nunca pisa lo que ya había: si la persona
 * declaró un lugar al contar y después la IA propone otro, manda el suyo. Y si
 * vuelve a pasar por aquí —porque reintentó, o porque el navegador reenvió— lo
 * ya dicho se queda como estaba.
 *
 * `desde_cuando` entra **tal cual**. «Hace tres meses» no es una fecha y
 * convertirlo en una sería la inferencia que `I2` prohíbe: nadie sabe si son
 * noventa días o el invierno pasado (ADR 0012).
 */
export async function precisarAporte(e: {
  aporteId: string;
  lugarDeclarado?: string | null;
  afectados?: string | null;
  desdeCuando?: string | null;
}): Promise<void> {
  const p = clienteServidor().schema("participacion");

  const { data: actual, error: eLectura } = await p.from("aporte")
    .select("lugar_declarado, afectados, desde_cuando").eq("id", e.aporteId).single();
  if (eLectura) throw new Error(`no se pudo leer el aporte: ${eLectura.message}`);
  if (!actual) throw new Error(`no existe el aporte ${e.aporteId}`);

  const nuevo: Record<string, string> = {};
  const poner = (columna: string, tenia: unknown, llega?: string | null) => {
    const v = llega?.trim();
    if (v && !tenia) nuevo[columna] = v;
  };
  poner("lugar_declarado", actual.lugar_declarado, e.lugarDeclarado);
  poner("afectados", actual.afectados, e.afectados);
  poner("desde_cuando", actual.desde_cuando, e.desdeCuando);

  if (Object.keys(nuevo).length === 0) return;

  const { error } = await p.from("aporte").update(nuevo).eq("id", e.aporteId);
  if (error) throw new Error(`no se pudo precisar el aporte: ${error.message}`);
}
