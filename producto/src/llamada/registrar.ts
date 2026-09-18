import { clienteServidor } from "../datos/cliente.ts";

/**
 * «Te llamamos»: la persona deja su nombre y su teléfono, y la llamamos nosotros.
 *
 * Es el tercer modo de la captura, al lado de escribir y de hablar, y existe por
 * la misma razón que el micrófono: a quien le cuesta escribir no se le puede
 * pedir que escriba para poder participar.
 *
 * **Lo que esto NO es:** un aporte. No hay relato, no hay comprobante y no hay
 * nada que revisar todavía — hay una persona esperando una llamada. Meterlo en
 * `participacion.aporte` haría que `R1` contara como necesidad registrada algo
 * que nadie ha contado aún, y `R1` es una cuenta de necesidades, no de contactos.
 *
 * **Y no pertenece a ningún proceso** (decisión del negocio, 2026-09-18): pedir
 * que te llamen no es participar. La consecuencia buena es que esto **no depende
 * de que haya un proceso sembrado**: si `procesoVigente()` fallara, la petición
 * se guarda igual. De qué proceso vino queda en la auditoría, no aquí.
 */

export type EntradaLlamada = {
  nombre: string;
  telefono: string;
  /** Colombia salvo que se diga otra cosa. La base tiene el mismo suelo. */
  codigoPais?: string;
};

export const CODIGO_PAIS_POR_DEFECTO = "57";

/**
 * Guarda la petición y devuelve su identificador.
 *
 * **Pasa por una función y no por la tabla**, porque `identidad` no se expone
 * por la API (`supabase/config.toml`): es la partición que guarda contacto, y
 * exponerla la volvería alcanzable por URL directa (`SEG-01`).
 *
 * Lanza si la base rechaza. El que llama decide qué hacer con eso — aquí no se
 * traga un error de guardado, porque una persona que ve «te llamamos en breve»
 * y no está en ninguna tabla es una persona a la que nadie va a llamar.
 */
export async function registrarLlamada(entrada: EntradaLlamada): Promise<{ llamadaId: string }> {
  const { data, error } = await clienteServidor()
    .schema("participacion")
    .rpc("registrar_llamada", {
      p_nombre: entrada.nombre,
      p_codigo_pais: entrada.codigoPais ?? CODIGO_PAIS_POR_DEFECTO,
      p_telefono: entrada.telefono,
    });

  if (error) throw new Error(`no se pudo registrar la llamada: ${error.message}`);
  if (!data) throw new Error("la llamada se guardó pero la base no devolvió su identificador");

  return { llamadaId: String(data) };
}
