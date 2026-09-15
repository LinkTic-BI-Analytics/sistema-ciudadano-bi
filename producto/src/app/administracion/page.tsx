import Link from "next/link";
import { headers } from "next/headers";
import { clienteServidor } from "../../datos/cliente.ts";
import { procesoVigente } from "../../datos/proceso.ts";
import { direccionDe, qrDe } from "../../convocatoria/enlaces.ts";
import { CrearEncuentro, GenerarEnlace } from "./formularios.tsx";

// Administración de encuentros y materiales (`M06` · `RF10` · `QR-01`).
//
// **Sin permisos, igual que la consola.** El módulo exige actor autorizado
// —*«Comunicaciones prepara; Responsable de proceso valida y publica mediante
// permiso asignado»*— y `T032` sigue bloqueada por `P4`. Lo que hay aquí es la
// mecánica, no la autorización, y la pantalla lo dice en vez de disimularlo.

export const dynamic = "force-dynamic";
export const metadata = { title: "Administración de encuentros" };

/**
 * La dirección que se imprime sale de **la petición**, no de una variable.
 *
 * Con una variable, el QR de un afiche puede apuntar a un sitio distinto de
 * aquel donde lo están generando — y eso no se nota hasta que el afiche está
 * impreso y pegado. Salió de una prueba: el material decía `:3100` mientras el
 * recorrido corría en `:3101`.
 */
async function base(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3100";
  const protocolo = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocolo}://${host}`;
}

const cuando = (iso: string, zona: string) =>
  new Date(iso).toLocaleString("es-CO", { timeZone: zona, dateStyle: "medium", timeStyle: "short" });

export default async function Administracion() {
  const procesoId = await procesoVigente();
  const p = clienteServidor().schema("participacion");

  const { data: encuentros } = await p.from("encuentro")
    .select("id, titulo, tema, modalidad, comienza_en, zona_horaria, lugar, sala, estado")
    .eq("proceso_id", procesoId).order("comienza_en");

  const { data: enlaces } = await p.from("enlace")
    .select("id, encuentro_id, pieza, estado, utm_source, utm_medium, utm_campaign, creado_por")
    .eq("proceso_id", procesoId).order("creado_en", { ascending: false });

  // El QR se dibuja aquí, en el servidor. Se previsualiza el destino **antes**
  // de descargar el material (`QR-01`): un afiche con el QR equivocado ya está
  // impreso cuando alguien se da cuenta.
  const BASE = await base();
  const qrs = new Map<string, string>();
  for (const e of enlaces ?? []) qrs.set(e.id, await qrDe(direccionDe(e.id, BASE)));

  return (
    <div className="pc-backoffice">
      <div className="bo-shell">
        <aside className="bo-sidebar">
          <div className="bo-brand">Administración</div>
          <p className="bo-nav-label">Convocatoria</p>
          <Link className="bo-link" href="/administracion">Encuentros y materiales</Link>
          <Link className="bo-link" href="/consola">Bandeja de revisión</Link>
          <div className="bo-sidebar-bottom">
            <p className="bo-small">
              <strong>Sin permisos.</strong> El módulo exige actor autorizado para publicar;
              eso es <code>T032</code>, bloqueada por <code>P4</code>. <strong>No desplegar.</strong>
            </p>
          </div>
        </aside>

        <div className="bo-workspace">
          <header className="bo-topbar">
            <span className="bo-kicker">Encuentros y materiales</span>
            <span className="bo-results-line">
              {encuentros?.length ?? 0} encuentros · {enlaces?.length ?? 0} enlaces
            </span>
          </header>

          <main className="bo-main">
            <section className="bo-section-head">
              <h1>Crear un encuentro</h1>
              <p className="bo-muted">
                Cuelga de la convocatoria publicada. Sale en la portada en cuanto se crea:
                <strong> no hay borrador todavía</strong>, y eso es una carencia, no una decisión.
              </p>
            </section>
            <CrearEncuentro />

            <section className="bo-history-section">
              <h2>Encuentros</h2>
              {(encuentros?.length ?? 0) === 0 ? (
                <p className="bo-empty">Todavía ninguno.</p>
              ) : (
                <table className="bo-table">
                  <thead>
                    <tr><th>Encuentro</th><th>Cuándo</th><th>Dónde</th><th>Estado</th></tr>
                  </thead>
                  <tbody>
                    {encuentros!.map((e) => (
                      <tr key={e.id}>
                        <td>{e.titulo}{e.tema && <span className="bo-small"> · {e.tema}</span>}</td>
                        <td className="bo-small">{cuando(e.comienza_en, e.zona_horaria)}</td>
                        <td className="bo-small">{e.lugar ?? e.sala ?? "—"}</td>
                        <td>
                          {e.estado === "programado"
                            ? <span className="bo-muted">programado</span>
                            : <span className="bo-badge" data-state="clarify">{e.estado}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            <section className="bo-history-section">
              <h2>Generar material</h2>
              <p className="bo-muted">
                Un enlace por <strong>pieza</strong>: afiche, volante, publicación. Todas apuntan
                al mismo encuentro — <strong>distinguir la pieza no parte el evento en dos</strong>.
              </p>
              <GenerarEnlace encuentros={(encuentros ?? []).map((e) => ({ id: e.id, titulo: e.titulo }))} />
            </section>

            <section className="bo-history-section">
              <h2>Materiales generados</h2>
              {(enlaces?.length ?? 0) === 0 ? (
                <p className="bo-empty">Ninguno todavía.</p>
              ) : (
                <ul className="bo-card-list" style={{ display: "block" }}>
                  {enlaces!.map((l) => {
                    const encuentro = encuentros?.find((e) => e.id === l.encuentro_id);
                    const url = direccionDe(l.id, BASE);
                    return (
                      <li key={l.id} className="bo-record-card">
                        <div className="bo-inline" style={{ alignItems: "flex-start" }}>
                          {/* El QR y su dirección legible, juntos: `QR-01` pide
                              «mostrar dirección corta alternativa al QR». Quien
                              no puede escanear teclea. */}
                          <div style={{ width: 128 }} dangerouslySetInnerHTML={{ __html: qrs.get(l.id) ?? "" }} />
                          <div>
                            <p><strong>{encuentro?.titulo ?? "encuentro retirado"}</strong></p>
                            <p className="bo-small">Pieza: {l.pieza} · por {l.creado_por}</p>
                            <p className="bo-observation"><code>{url}</code></p>
                            {(l.utm_source || l.utm_campaign) && (
                              <p className="bo-small">
                                UTMs: {[l.utm_source, l.utm_medium, l.utm_campaign].filter(Boolean).join(" · ")}
                                {" — "}<span className="bo-muted">describen difusión; no dan permisos</span>
                              </p>
                            )}
                            {l.estado === "retirado" && (
                              <p className="bo-badge" data-state="clarify">
                                retirado · lo que entró por él sigue ahí
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </main>

          <footer className="bo-footer">
            <p className="bo-bottom-note">
              Un acceso por este enlace <strong>no es una asistencia, ni una persona única, ni un
              apoyo</strong>. Puede venir de un enlace reenviado por otra persona.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
