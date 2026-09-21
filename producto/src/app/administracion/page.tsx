import { headers } from "next/headers";
import { clienteServidor } from "../../datos/cliente.ts";
import { procesoVigente } from "../../datos/proceso.ts";
import { direccionDe, qrDe } from "../../convocatoria/enlaces.ts";
import { CrearEncuentro, GenerarEnlace } from "./formularios.tsx";
import { Armazon } from "../../producto/armazon.tsx";
import { IconoAgenda, IconoAviso, IconoComprobante } from "../../producto/iconos.tsx";

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
  // impreso cuando alguien se da cuenta.
  const BASE = await base();
  const qrs = new Map<string, string>();
  for (const e of enlaces ?? []) qrs.set(e.id, await qrDe(direccionDe(e.id, BASE)));

  return (
    <Armazon
      seccion="Administración"
      vista="convocatoria"
      kicker="Encuentros y materiales"
      pie={
        <p className="bo-bottom-note">
          Un acceso por este enlace <strong>no es una asistencia, ni una persona única, ni un
          apoyo</strong>. Puede venir de un enlace reenviado por otra persona.
        </p>
      }
    >
      {/* **El titular es el de la pantalla, no el de su primera sección.** Decía
          «Crear un encuentro», que es una de las cuatro cosas que se hacen aquí:
          quien entraba a generar un QR leía un titular que hablaba de otra cosa.
          Las cuatro secciones pasan a ser `h2` y la jerarquía queda de una sola
          pieza. */}
      <div className="bo-page-head">
        <div>
          <h1>Encuentros y materiales</h1>
          <p className="bo-muted">
            Lo que se crea aquí sale en la portada y en los códigos QR que se imprimen. Un
            encuentro cuelga de la convocatoria publicada; los materiales cuelgan del encuentro.
          </p>
        </div>
      </div>

      {/* Las dos cifras de la pantalla, que iban escritas como una frase de 12 px
          en una esquina de la barra de arriba. */}
      <div className="bo-resumen">
        <div>
          <span className="bo-label-tag">Encuentros</span>
          <strong>{encuentros?.length ?? 0}</strong>
          <p>programados, reprogramados y cancelados</p>
        </div>
        <div>
          <span className="bo-label-tag">Materiales</span>
          <strong>{enlaces?.length ?? 0}</strong>
          <p>cada uno con su QR y su dirección corta</p>
        </div>
      </div>

      {/* ── Crear un encuentro ───────────────────────────────────────────────
          **`.bo-event-form` es la rejilla que el sistema de diseño entregó para
          esto** —formulario a la izquierda, previsualización a la derecha— y no
          se estaba usando: el formulario iba a ancho completo y la información
          de la convocatoria, que es contra lo que se está creando, quedaba de
          párrafo suelto encima. */}
      <section className="bo-history-section">
        <div className="bo-section-head">
          <h2>Crear un encuentro</h2>
        </div>

        <div className="bo-event-form">
          <div>
            {convocatoria ? <CrearEncuentro /> : (
              // **No se ofrece lo que va a fallar.** Sin convocatoria publicada
              // el formulario se podía llenar entero y reventaba al enviarlo.
              // Un encuentro cuelga de una convocatoria: sin ella no hay a qué.
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
          </div>

          <aside className="bo-event-preview">
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
              Sale en la portada en cuanto se crea: <strong>no hay borrador todavía</strong>, y eso
              es una carencia, no una decisión.
            </p>
          </aside>
        </div>
      </section>

      {/* ── Encuentros ───────────────────────────────────────────────────────
          Era una `<table className="bo-table">` **sin** `bo-table-desktop`, o
          sea sin la variante de tarjetas que el sistema de diseño enciende bajo
          36rem: en un teléfono, cuatro columnas de ancho fijo se aplastaban.

          `.bo-event-list` es la clase que el paquete trae para una lista de
          encuentros del perfil interno —con su borde, su radio y su realce al
          pasar por encima— y tampoco se estaba usando. Se ve igual en los dos
          anchos, así que no hace falta duplicar el marcado. */}
      <section className="bo-history-section">
        <div className="bo-section-head">
          <h2>Encuentros</h2>
          <p className="bo-muted">Los que ya están creados, del más próximo en adelante.</p>
        </div>

        {(encuentros?.length ?? 0) === 0 ? (
          <div className="bo-empty">
            <IconoAgenda />
            <h3>Todavía no hay encuentros</h3>
            <p>El primero que crees sale en la portada y ya se le puede generar material.</p>
          </div>
        ) : (
          <ul className="bo-event-list">
            {encuentros!.map((e) => (
              <li key={e.id}>
                <div className="bo-inline">
                  {/* **La modalidad se guardaba y no se veía.** Estaba en la
                      consulta, se pedía en el formulario y no salía en ninguna
                      parte: para saber si un encuentro era virtual había que
                      deducirlo de que tuviera sala en vez de lugar. */}
                  <span className="bo-label-tag">{e.modalidad}</span>
                  {e.estado === "programado"
                    ? <span className="bo-muted">programado</span>
                    : <span className="bo-badge" data-state="clarify">{e.estado}</span>}
                </div>
                <h3>{e.titulo}</h3>
                <p>
                  {cuando(e.comienza_en, e.zona_horaria)}
                  {" · "}
                  {e.lugar ?? e.sala ?? "sin lugar todavía"}
                  {e.tema && <> · {e.tema}</>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Generar material ─────────────────────────────────────────────────── */}
      <section className="bo-history-section">
        <div className="bo-section-head">
          <h2>Generar material</h2>
        </div>

        {/* La misma rejilla que el formulario de arriba. Sin ella, ocho campos
            cortos —un `select`, una pieza y cuatro UTMs— se estiraban a los
            1.440 px de la pantalla: una caja de texto de un palmo de alto y un
            metro de ancho para escribir «whatsapp». */}
        <div className="bo-event-form">
          <GenerarEnlace encuentros={(encuentros ?? []).map((e) => ({ id: e.id, titulo: e.titulo }))} />
          <aside className="bo-event-preview">
            <span className="bo-label-tag">Qué es una pieza</span>
            <p className="bo-small">
              Un enlace por <strong>pieza</strong>: afiche, volante, publicación. Todas apuntan al
              mismo encuentro — <strong>distinguir la pieza no parte el evento en dos</strong>.
            </p>
            <p className="bo-small">
              Las UTMs describen por dónde se difundió. <strong>No dan permisos</strong> y no
              prueban que alguien haya asistido.
            </p>
          </aside>
        </div>
      </section>

      {/* ── Materiales generados ─────────────────────────────────────────────
          El contenedor era `<ul className="bo-card-list" style={{display:"block"}}>`:
          `.bo-card-list` nace apagada porque es **la mitad de un contrato** —la
          alternativa a una tabla bajo 36rem— y aquí no hay tabla que alternar,
          así que había que encenderla a la fuerza con un estilo en línea.
          `.bo-event-list` es una rejilla que se ve siempre, que es lo que esto
          necesitaba desde el principio. */}
      <section className="bo-history-section">
        <div className="bo-section-head">
          <h2>Materiales generados</h2>
          <p className="bo-muted">
            El QR y su dirección corta van juntos: quien no puede escanear, teclea.
          </p>
        </div>

        {(enlaces?.length ?? 0) === 0 ? (
          <div className="bo-empty">
            <IconoComprobante />
            <h3>Ningún material todavía</h3>
            <p>Genera uno arriba y aquí aparece con su QR, su dirección y sus piezas para imprimir.</p>
          </div>
        ) : (
          <ul className="bo-event-list">
            {enlaces!.map((l) => {
              const encuentro = encuentros?.find((e) => e.id === l.encuentro_id);
              const url = direccionDe(l.id, BASE);
              return (
                // **Sin un solo icono dentro de esta tarjeta, a propósito.** Un
                // recorrido comprueba que el QR se dibuja aquí y no en un
                // servicio externo (`QR-01`) buscando «el `svg` de la tarjeta»;
                // con dos, la prueba deja de saber cuál mirar.
                <li key={l.id} className="bo-record-card">
                  <div className="bo-inline">
                    {/* El QR y su dirección legible, juntos: `QR-01` pide
                        «mostrar dirección corta alternativa al QR». */}
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
                      {/* Generar la pieza (`PIE-01`). Sale del registro, no de
                          lo que alguien copie a mano: si el encuentro cambió, la
                          siguiente sale bien. */}
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
    </Armazon>
  );
}
