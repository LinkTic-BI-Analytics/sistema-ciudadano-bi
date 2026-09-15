import { headers } from "next/headers";
import { clienteServidor } from "../../../../../datos/cliente.ts";
import { resolverEnlace } from "../../../../../convocatoria/enlaces.ts";
import { piezaSVG, piezaPNG, FORMATOS, type DatosPieza, type Formato } from "../../../../../convocatoria/pieza.ts";

// Descarga de la pieza gráfica (`PIE-01`).
//
// La pieza sale **del registro**, no de lo que alguien copió a mano. Si el
// encuentro cambió, la pieza siguiente sale bien — y la ya repartida no cambia,
// que es lo que `PIE-04` obliga a no prometer.

export const dynamic = "force-dynamic";

export async function GET(
  pedido: Request,
  { params }: { params: Promise<{ enlace: string; formato: string }> },
) {
  const { enlace, formato } = await params;
  const f = formato.replace(/\.(svg|png)$/, "") as Formato;
  const png = formato.endsWith(".png");
  if (!(f in FORMATOS)) return new Response("formato desconocido", { status: 404 });

  const r = await resolverEnlace(enlace.toUpperCase());
  if (!r.existe) return new Response("no existe ese material", { status: 404 });

  const p = clienteServidor().schema("participacion");
  const { data: e } = await p.from("encuentro")
    .select("titulo, tema, comienza_en, zona_horaria, modalidad, lugar, sala, ayudas, cupos, estado, convocatoria_id")
    .eq("id", r.enlace.encuentroId).single();
  if (!e) return new Response("el encuentro ya no está", { status: 404 });

  const { data: c } = await p.from("convocatoria").select("nombre").eq("id", e.convocatoria_id).single();

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? new URL(pedido.url).host;
  const protocolo = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  const datos: DatosPieza = {
    convocatoria: c?.nombre ?? "Participación ciudadana",
    titulo: e.titulo, tema: e.tema,
    comienzaEn: e.comienza_en, zonaHoraria: e.zona_horaria,
    modalidad: e.modalidad, lugar: e.lugar ?? e.sala,
    ayudas: e.ayudas, cupos: e.cupos, estado: e.estado,
    enlaceId: r.enlace.id, base: `${protocolo}://${host}`,
  };

  try {
    const nombre = `${f}-${r.enlace.id}.${png ? "png" : "svg"}`;
    const cuerpo = png ? await piezaPNG(datos, f) : await piezaSVG(datos, f);
    return new Response(cuerpo as BodyInit, {
      headers: {
        "content-type": png ? "image/png" : "image/svg+xml; charset=utf-8",
        "content-disposition": `attachment; filename="${nombre}"`,
        // Nunca en caché: si el encuentro cambió, la pieza siguiente sale con
        // los datos nuevos. Una pieza cacheada es la fecha vieja otra vez.
        "cache-control": "no-store",
      },
    });
  } catch (fallo) {
    // `porQueNo` explica por qué no se puede: cancelado, o sin lugar. Es una
    // respuesta, no un error del servidor.
    return new Response(fallo instanceof Error ? fallo.message : "no se pudo generar", { status: 409 });
  }
}
