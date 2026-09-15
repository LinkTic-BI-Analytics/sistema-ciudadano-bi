import { clienteServidor } from "../../../../datos/cliente.ts";

// El audio de un aporte hablado, para el revisor (ADR 0013).
//
// **Pasa por el servidor, siempre.** El depósito es privado y así se queda: la
// voz identifica a una persona aunque las palabras no lo hagan, y una dirección
// pública del depósito sería identidad al alcance de cualquiera que la tenga.
// Aquí se lee con la llave de servicio y se entrega el contenido, sin exponer
// nunca dónde está guardado.
//
// Guardar la grabación como original y no poder oírla es medio sentido
// desperdiciado: el revisor tiene que poder comprobar la transcripción contra
// lo que de verdad se dijo.

export const dynamic = "force-dynamic";

export async function GET(_pedido: Request, { params }: { params: Promise<{ aporte: string }> }) {
  const { aporte } = await params;
  const sb = clienteServidor();

  const { data: a } = await sb.schema("participacion")
    .from("aporte").select("grabacion_id").eq("id", aporte).maybeSingle();
  if (!a?.grabacion_id) return new Response("ese aporte no tiene grabación", { status: 404 });

  const { data: g } = await sb.schema("participacion")
    .from("grabacion").select("ruta, tipo_mime").eq("id", a.grabacion_id).single();
  if (!g) return new Response("la grabación ya no está", { status: 404 });

  const { data: archivo, error } = await sb.storage.from("grabaciones").download(g.ruta);
  if (error || !archivo) {
    // La fila existe y el archivo no. Es un caso que no debería pasar y que hay
    // que poder distinguir de «no hay grabación»: uno es normal, el otro es que
    // se perdió un original.
    console.error("audio: la fila apunta a un archivo que no está", g.ruta, error);
    return new Response("la grabación se registró pero el archivo no está", { status: 410 });
  }

  return new Response(await archivo.arrayBuffer(), {
    headers: {
      "content-type": g.tipo_mime,
      // Sin caché en intermediarios: es la voz de una persona.
      "cache-control": "private, no-store",
    },
  });
}
