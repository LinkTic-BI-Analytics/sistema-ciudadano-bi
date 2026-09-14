import Link from "next/link";
import { porAclarar } from "../../revision/ubicacion.ts";
import { procesoVigente } from "../../datos/proceso.ts";
import { clienteServidor } from "../../datos/cliente.ts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Consola de revisión" };

// Hora de Bogotá siempre, y explícita. El servidor puede estar en otro huso, y
// una bandeja que ordena por antigüedad con horas corridas es una bandeja que
// miente sobre a quién le toca primero.
const fecha = (iso: string) =>
  new Date(iso).toLocaleString("es-CO", { timeZone: "America/Bogota" });

export default async function Consola() {
  const procesoId = await procesoVigente();
  const pendientes = await porAclarar(procesoId, 50);

  const p = clienteServidor().schema("participacion");
  const { count: total } = await p.from("aporte")
    .select("id", { count: "exact", head: true })
    .eq("proceso_id", procesoId).is("retirado_en", null);
  const { data: exps } = await p.from("expediente")
    .select("id, descripcion, abierto_en, reabierto_en")
    .eq("proceso_id", procesoId).is("retirado_en", null)
    .order("abierto_en", { ascending: false }).limit(20);

  return (
    <div className="pc-backoffice">
      <div className="bo-shell">
        <aside className="bo-sidebar">
          <div className="bo-brand">Consola</div>
          <p className="bo-nav-label">Revisión</p>
          <Link className="bo-link" href="/consola">Por aclarar</Link>
          <div className="bo-sidebar-bottom">
            <p className="bo-small">
              <strong>Sin permisos.</strong> Cualquiera que abra esta dirección ve esto.
              La política la decide <code>T032</code>, bloqueada por <code>P4</code> y{" "}
              <code>Q18</code>. <strong>No desplegar.</strong>
            </p>
          </div>
        </aside>

        <div className="bo-workspace">
          <header className="bo-topbar">
            <span className="bo-kicker">Bandeja de calidad</span>
            <span className="bo-results-line">
              {pendientes.length} por aclarar · {total ?? 0} aportes · {exps?.length ?? 0} expedientes
            </span>
          </header>

          <main className="bo-main">
            <section className="bo-section-head">
              <h1>Ubicación por aclarar</h1>
              <p className="bo-muted">
                Los más antiguos primero. <strong>Sin orden por popularidad</strong>: un aporte
                de una vereda dispersa pesa lo mismo que uno de una avenida.
              </p>
            </section>

            {pendientes.length === 0 ? (
              <p className="bo-empty">
                Nada por aclarar. Si acabas de sembrar la base, manda un aporte desde{" "}
                <Link className="bo-link" href="/participar">/participar</Link>.
              </p>
            ) : (
              <>
              {/* **Las dos estructuras, con los mismos datos.** No es
                  duplicación: es el contrato del sistema de diseño, que en
                  `backoffice.css` oculta `.bo-table-desktop` bajo 36rem y
                  enciende `.bo-card-list`. Exactamente una de las dos se ve, y
                  `display:none` la saca también del árbol de accesibilidad, así
                  que un lector de pantalla lee una sola lista.

                  La regla obliga a lo de abajo: **toda lista de esta consola
                  necesita sus dos formas**. Una sección con solo `.bo-card-list`
                  no se ve en un escritorio, que es lo que le pasaba a los
                  expedientes.

                  `backoffice-especificacion.md`: la degradación a lista es «sin
                  ocultar datos ni bajar de 16px». */}
              <ul className="bo-card-list">
                {pendientes.map((a) => (
                  <li key={a.aporteId} className="bo-record-card">
                    <Link className="bo-record-link" href={`/consola/${a.aporteId}`}>
                      {a.relato.slice(0, 90)}{a.relato.length > 90 ? "…" : ""}
                    </Link>
                    <div className="bo-card-meta">
                      {a.lugarDeclarado
                        ? <em>«{a.lugarDeclarado}»</em>
                        : <span>no precisó el lugar</span>}
                    </div>
                    <p>{fecha(a.recibidoEn)}</p>
                  </li>
                ))}
              </ul>

              <table className="bo-table bo-table-desktop">
                <thead>
                  <tr>
                    <th>Aporte</th>
                    <th>Dónde dijo que ocurre</th>
                    <th>Recibido</th>
                  </tr>
                </thead>
                <tbody>
                  {pendientes.map((a) => (
                    <tr key={a.aporteId}>
                      <td>
                        <Link className="bo-record-link" href={`/consola/${a.aporteId}`}>
                          {a.relato.slice(0, 70)}{a.relato.length > 70 ? "…" : ""}
                        </Link>
                      </td>
                      <td>
                        {a.lugarDeclarado
                          ? <em>«{a.lugarDeclarado}»</em>
                          : <span className="bo-muted">no lo precisó</span>}
                      </td>
                      <td className="bo-small">{fecha(a.recibidoEn)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </>
            )}

            <section className="bo-history-section">
              <h2>Expedientes abiertos</h2>
              {(exps?.length ?? 0) === 0 ? (
                <p className="bo-empty">Todavía ninguno.</p>
              ) : (
                <>
                  <ul className="bo-card-list">
                    {exps!.map((e) => (
                      <li key={e.id} className="bo-record-card">
                        <strong>{e.descripcion}</strong>
                        <div className="bo-card-meta">
                          <span>{fecha(e.abierto_en)}</span>
                          {e.reabierto_en && (
                            <span className="bo-badge" data-state="clarify">
                              reabierto · su prioridad dejó de estar vigente
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <table className="bo-table bo-table-desktop">
                    <thead>
                      <tr>
                        <th>Expediente</th>
                        <th>Abierto</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exps!.map((e) => (
                        <tr key={e.id}>
                          <td>{e.descripcion}</td>
                          <td className="bo-small">{fecha(e.abierto_en)}</td>
                          <td>
                            {e.reabierto_en ? (
                              <span className="bo-badge" data-state="clarify">
                                reabierto · su prioridad dejó de estar vigente
                              </span>
                            ) : (
                              <span className="bo-muted">abierto</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </section>
          </main>

          <footer className="bo-footer">
            <p className="bo-bottom-note">
              Abrir un expediente inicia una revisión. <strong>No aprueba nada, no asigna
              recursos y no declara resuelto nada.</strong>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
