import type { CSSProperties } from "react";
import { headers } from "next/headers";
import { clienteServidor } from "../../datos/cliente.ts";
import { procesoVigente } from "../../datos/proceso.ts";
import { direccionDe, qrDe } from "../../convocatoria/enlaces.ts";
import { CrearEncuentro, GenerarEnlace } from "./formularios.tsx";
import Link from "next/link";
import { Armazon } from "../../producto/armazon.tsx";
import {
  IconoAgenda, IconoAviso, IconoComprobante, IconoEnlace, IconoLugar,
} from "../../producto/iconos.tsx";

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

/** Cómo se lee cada estado de encuentro, y con qué color. */
const ESTADO_ENCUENTRO: Record<string, { texto: string; estado: string }> = {
  programado: { texto: "programado", estado: "ok" },
  reprogramado: { texto: "reprogramado", estado: "clarify" },
  cancelado: { texto: "cancelado", estado: "alert" },
};

export default async function Administracion({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // **Dos pestañas por propósito**, y van en la dirección como todo lo demás.
  // La pantalla era una sola columna con cuatro secciones apiladas —crear
  // encuentro, lista de encuentros, generar material, lista de materiales— y
  // la queja fue literal: «no se entiende qué componente sirve para qué».
  // Ahora hay dos cosas, cada una con su lista a la izquierda y su formulario
  // de crear a la derecha: lo que hay, y cómo se añade.
  const q = await searchParams;
  const seccion = q.seccion === "materiales" ? "materiales" : "encuentros";

  const procesoId = await procesoVigente();
  const p = clienteServidor().schema("participacion");

  const { data: encuentros } = await p.from("encuentro")
    .select("id, titulo, tema, modalidad, comienza_en, zona_horaria, lugar, sala, estado")
    .eq("proceso_id", procesoId).order("comienza_en");

  // Desde cuándo está publicada. El módulo dice que «publicación y cambios de
  // fase deben tener versión y fundamento», y quien va a colgar un encuentro
  // necesita saber a qué convocatoria lo está colgando y desde cuándo recibe.
  const { data: convocatoria } = await p.from("convocatoria")
    .select("nombre, publicada_en, cierra_en").eq("proceso_id", procesoId)
    .eq("estado", "publicada").order("abre_en", { ascending: false }).limit(1).maybeSingle();

  const { data: enlaces } = await p.from("enlace")
    .select("id, encuentro_id, pieza, estado, utm_source, utm_medium, utm_campaign, creado_por")
    .eq("proceso_id", procesoId).order("creado_en", { ascending: false });

  // El QR se dibuja aquí, en el servidor. Se previsualiza el destino **antes**
  // de descargar el material (`QR-01`): un afiche con el QR equivocado ya está
  // impreso cuando alguien se da cuenta. Solo en su pestaña: veinte QR que no
  // se van a ver no se dibujan.
  const BASE = await base();
  const qrs = new Map<string, string>();
  if (seccion === "materiales") {
    for (const e of enlaces ?? []) qrs.set(e.id, await qrDe(direccionDe(e.id, BASE)));
  }

  const nEncuentros = encuentros?.length ?? 0;
  const nMateriales = enlaces?.length ?? 0;

  return (
    <Armazon
      seccion="Administración"
      vista="convocatoria"
      kicker={seccion === "materiales" ? "Materiales y QR" : "Encuentros"}
      pie={
        <p className="bo-bottom-note">
          Un acceso por este enlace <strong>no es una asistencia, ni una persona única, ni un
          apoyo</strong>. Puede venir de un enlace reenviado por otra persona.
        </p>
      }
    >
      <div className="bo-page-head">
        <div>
          <h1>Encuentros y materiales</h1>
          <p className="bo-muted">
            Lo que se crea aquí sale en el calendario de la portada y en los códigos QR que se
            imprimen. Un encuentro cuelga de la convocatoria publicada; los materiales cuelgan del
            encuentro.
          </p>
        </div>
      </div>

      {/* Las dos cifras, y cada una lleva a su pestaña. */}
      <div className="bo-resumen">
        <Link href="/administracion" data-tinte="azul" className="pc-entra">
          <span className="bo-resumen-icono"><IconoAgenda /></span>
          <span className="bo-label-tag">Encuentros</span>
          <strong>{nEncuentros}</strong>
          <p>programados, reprogramados y cancelados</p>
        </Link>
        <Link href="/administracion?seccion=materiales" data-tinte="verde" className="pc-entra"
              style={{ "--pc-orden": 1 } as CSSProperties}>
          <span className="bo-resumen-icono"><IconoComprobante /></span>
          <span className="bo-label-tag">Materiales</span>
          <strong>{nMateriales}</strong>
          <p>cada uno con su QR y su dirección corta</p>
        </Link>
      </div>

      <nav className="bo-tabs" aria-label="Secciones de administración">
        <Link className="bo-tab" href="/administracion"
              aria-current={seccion === "encuentros" ? "page" : undefined}>
          <IconoAgenda />Encuentros <span>{nEncuentros}</span>
        </Link>
        <Link className="bo-tab" href="/administracion?seccion=materiales"
              aria-current={seccion === "materiales" ? "page" : undefined}>
          <IconoComprobante />Materiales y QR <span>{nMateriales}</span>
        </Link>
      </nav>

      {seccion === "encuentros" ? (
        <div className="bo-dos-columnas">
          {/* ── Lo que hay ─────────────────────────────────────────────── */}
          <section>
            <div className="bo-section-head">
              <h2>Encuentros creados</h2>
              <p className="bo-muted">Del más próximo en adelante.</p>
            </div>
            {nEncuentros === 0 ? (
              <div className="bo-empty">
                <IconoAgenda />
                <h3>Todavía no hay encuentros</h3>
                <p>El primero que crees sale en la portada y ya se le puede generar material.</p>
              </div>
            ) : (
              <ul className="bo-event-list">
                {encuentros!.map((e) => {
                  const est = ESTADO_ENCUENTRO[e.estado] ?? { texto: e.estado, estado: "draft" };
                  return (
                    <li key={e.id} className="pc-entra">
                      <div className="bo-inline">
                        <span className="bo-label-tag">{e.modalidad}</span>
                        <span className="bo-badge" data-state={est.estado}>{est.texto}</span>
                      </div>
                      <h3>{e.titulo}</h3>
                      <p>
                        <IconoLugar />{" "}
                        {cuando(e.comienza_en, e.zona_horaria)}
                        {" · "}
                        {e.lugar ?? e.sala ?? "sin lugar todavía"}
                        {e.tema && <> · {e.tema}</>}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* ── Cómo se añade ──────────────────────────────────────────── */}
          <aside className="bo-panel">
            <div className="bo-panel-cabecera">
              <h2><IconoAgenda />Crear un encuentro</h2>
            </div>
            {convocatoria ? <CrearEncuentro /> : (
              // **No se ofrece lo que va a fallar.** Sin convocatoria publicada
              // el formulario se podía llenar entero y reventaba al enviarlo.
              <div className="bo-empty" data-prueba="sin-convocatoria">
                <IconoAviso />
                <p>
                  <strong>No hay convocatoria publicada.</strong> Un encuentro cuelga de una
                  convocatoria, así que primero hay que publicar una — y eso todavía se hace por
                  guion (<code>scripts/sembrar-agenda.sh</code>), porque publicar exige un actor
                  autorizado y todavía no hay forma de saber quién es quién.
                </p>
              </div>
            )}
            <div className="bo-event-preview">
              <span className="bo-label-tag">A qué cuelga</span>
              {convocatoria ? (
                <dl>
                  <dt>Convocatoria</dt>
                  <dd>{convocatoria.nombre}</dd>
                  <dt>Publicada</dt>
                  <dd>{cuando(convocatoria.publicada_en, "America/Bogota")}</dd>
                  <dt>Recibe aportes</dt>
                  <dd>
                    {convocatoria.cierra_en
                      ? `hasta el ${cuando(convocatoria.cierra_en, "America/Bogota")}`
                      : "sin fecha de cierre"}
                  </dd>
                </dl>
              ) : (
                <p className="bo-small">Ninguna publicada todavía.</p>
              )}
              <p className="bo-small">
                Sale en la portada en cuanto se crea: <strong>no hay borrador todavía</strong>, y
                eso es una carencia, no una decisión.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <div className="bo-dos-columnas">
          {/* ── Lo que hay ─────────────────────────────────────────────── */}
          <section>
            <div className="bo-section-head">
              <h2>Materiales generados</h2>
              <p className="bo-muted">El QR y su dirección corta van juntos: quien no puede escanear, teclea.</p>
            </div>
            {nMateriales === 0 ? (
              <div className="bo-empty">
                <IconoComprobante />
                <h3>Ningún material todavía</h3>
                <p>Genera uno al lado y aquí aparece con su QR, su dirección y sus piezas para imprimir.</p>
              </div>
            ) : (
              <ul className="bo-event-list">
                {enlaces!.map((l) => {
                  const encuentro = encuentros?.find((e) => e.id === l.encuentro_id);
                  const url = direccionDe(l.id, BASE);
                  return (
                    // **Sin un solo icono dentro de esta tarjeta, a propósito.**
                    // Un recorrido comprueba que el QR se dibuja aquí y no en un
                    // servicio externo (`QR-01`) buscando «el `svg` de la
                    // tarjeta»; con dos, la prueba deja de saber cuál mirar.
                    <li key={l.id} className="bo-record-card pc-entra">
                      <div className="bo-inline">
                        <div data-qr dangerouslySetInnerHTML={{ __html: qrs.get(l.id) ?? "" }} />
                        <div>
                          <span className="bo-label-tag">{l.pieza}</span>
                          <h3>{encuentro?.titulo ?? "encuentro retirado"}</h3>
                          <p className="bo-observation"><code>{url}</code></p>
                          <p className="bo-small">Generado por {l.creado_por}</p>
                          {(l.utm_source || l.utm_campaign) && (
                            <p className="bo-small">
                              UTMs: {[l.utm_source, l.utm_medium, l.utm_campaign].filter(Boolean).join(" · ")}
                              {" — "}<span className="bo-muted">describen difusión; no dan permisos</span>
                            </p>
                          )}
                          {/* Generar la pieza (`PIE-01`). Sale del registro. */}
                          <p className="bo-small">
                            Pieza gráfica:{" "}
                            {(["afiche", "volante", "publicacion", "historia"] as const).map((f) => (
                              <span key={f}>
                                <a className="bo-link" href={`/administracion/pieza/${l.id}/${f}.png`}>{f}</a>
                                {" · "}
                              </span>
                            ))}
                            <a className="bo-link" href={`/administracion/pieza/${l.id}/afiche.svg`}>afiche en SVG</a>
                          </p>
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

          {/* ── Cómo se añade ──────────────────────────────────────────── */}
          <aside className="bo-panel">
            <div className="bo-panel-cabecera">
              <h2><IconoEnlace />Generar material</h2>
            </div>
            <GenerarEnlace encuentros={(encuentros ?? []).map((e) => ({ id: e.id, titulo: e.titulo }))} />
            <div className="bo-event-preview">
              <span className="bo-label-tag">Qué es una pieza</span>
              <p className="bo-small">
                Un enlace por <strong>pieza</strong>: afiche, volante, publicación. Todas apuntan
                al mismo encuentro — <strong>distinguir la pieza no parte el evento en dos</strong>.
              </p>
              <p className="bo-small">
                Las UTMs describen por dónde se difundió. <strong>No dan permisos</strong> y no
                prueban que alguien haya asistido.
              </p>
            </div>
          </aside>
        </div>
      )}
    </Armazon>
  );
}
