import Link from "next/link";
import { procesoVigente } from "../datos/proceso.ts";
import { convocatoriaVigente, proximosEncuentros, type Encuentro } from "../convocatoria/agenda.ts";

// La portada (`M06`, `RF10`).
//
// El módulo pide *«sección pública permanente… accesible sin cuenta, con
// próximos encuentros en portada»*, y el caso `AGE-01` es literal: **un
// ciudadano encuentra un encuentro desde la portada y aporta sin inscribirse**.
// Por eso contar no depende de ningún encuentro y el botón principal lleva
// directo a `/participar`.
//
// Lo que esta pantalla NO puede hacer, en orden de gravedad:
//
//   · prometer recepción cuando la convocatoria está cerrada (`RF10`);
//   · esconder un encuentro cancelado, que es cómo alguien acaba en la puerta;
//   · presentar la participación como representativa, o prometer obra.

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Participación Ciudadana · Plan Nacional de Desarrollo",
  description:
    "Cuéntanos qué necesita mejorar en tu comunidad. Sin cuenta y sin correo. Consulta las convocatorias y los próximos encuentros.",
};

const DIA = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function cuando(iso: string, zona: string) {
  const f = new Date(iso);
  const hora = f.toLocaleTimeString("es-CO", { timeZone: zona, hour: "2-digit", minute: "2-digit" });
  // La zona horaria se dice siempre. Un encuentro «a las 9» no dice nada sin
  // decir dónde son las 9, y quien se conecta desde otro huso llega tarde.
  return `${DIA[f.getDay()]} · ${hora} (${zona.split("/")[1]?.replace("_", " ") ?? zona})`;
}

function Encuentros({ lista }: { lista: Encuentro[] }) {
  return (
    <ul className="pc-event-list pc-event-grid">
      {lista.map((e) => {
        const f = new Date(e.comienzaEn);
        return (
          <li key={e.id} className="pc-event-row" data-status={e.estado === "cancelado" ? "cancelled" : undefined}>
            <div className="pc-event-date" aria-hidden>
              <strong>{f.getDate()}</strong>
              <span>{MES[f.getMonth()]?.toUpperCase()}</span>
            </div>
            <div>
              {e.tema && <p className="pc-event-category">{e.tema}</p>}
              <p className="pc-event-title"><span>{e.titulo}</span></p>
              <p className="pc-event-when">{cuando(e.comienzaEn, e.zonaHoraria)}</p>
              <p className="pc-event-where">
                {e.modalidad === "virtual" ? "Virtual" : e.lugar}
                {e.modalidad === "mixta" && " · también virtual"}
                {e.cupos !== null && ` · ${e.cupos} cupos`}
              </p>
              {e.ayudas && <p className="pc-event-where">{e.ayudas}</p>}

              {/* Un encuentro cancelado **se queda en la lista**. Quitarlo es la
                  forma más rápida de que alguien se presente en la puerta. */}
              {e.estado === "cancelado" && (
                <span className="pc-event-state">
                  Cancelado{e.motivoCambio && `: ${e.motivoCambio}`}. Puedes contar lo tuyo por
                  internet igual.
                </span>
              )}
              {e.estado === "reprogramado" && e.comenzabaEn && (
                <span className="pc-event-state">
                  Cambió de fecha: antes era el {new Date(e.comenzabaEn).getDate()} de{" "}
                  {MES[new Date(e.comenzabaEn).getMonth()]}
                  {e.motivoCambio && ` · ${e.motivoCambio}`}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default async function Portada() {
  const procesoId = await procesoVigente();
  const [convocatoria, encuentros] = await Promise.all([
    convocatoriaVigente(procesoId),
    proximosEncuentros(procesoId),
  ]);
  const abierta = convocatoria?.recibeAportes ?? true;

  return (
    <div className="pc-ui">
      <div className="pc-shell">
        <div className="pc-institution">
          <span>Plan Nacional de Desarrollo</span>
          <span>Participación ciudadana</span>
        </div>

        <header className="pc-header">
          <p className="pc-brand">
            Participación ciudadana
            <span className="pc-brand-sub">Plan Nacional de Desarrollo</span>
          </p>
          <nav className="pc-nav" aria-label="Secciones">
            <Link className="pc-text-action" href="/participar">Contar una necesidad</Link>
            <Link className="pc-text-action" href="/mis-aportes">Consultar mi aporte</Link>
          </nav>
        </header>

        <main className="pc-main" data-layout="home">
          <section className="pc-hero">
            <p className="pc-eyebrow">{convocatoria?.nombre ?? "Escucha permanente"}</p>
            <div className="pc-hero-layout">
              <div>
                <h1>Cuéntanos qué <em>necesita mejorar</em> donde vives</h1>
                <p className="pc-hero-intro">
                  {convocatoria?.proposito ??
                    "Lo que cuentes se registra con tus palabras y llega a quien responde por tu territorio."}
                </p>
                <div className="pc-actions">
                  {abierta ? (
                    <Link className="pc-action" href="/participar">Contar una necesidad</Link>
                  ) : (
                    // `RF10`: **no prometer recepción en convocatoria cerrada.**
                    // Dejar el botón sería recibir algo que nadie va a mirar.
                    <p className="pc-note" data-prueba="cerrada">
                      Esta convocatoria <strong>ya cerró</strong> y no está recibiendo aportes.
                      Lo que se recibió antes sigue su curso.
                    </p>
                  )}
                  <Link className="pc-text-action" href="/mis-aportes">Ya aporté: ver qué pasó</Link>
                </div>
                <p className="pc-hero-help">
                  No necesitas cuenta ni correo. Tampoco saber qué entidad responde ni proponer
                  una solución.
                </p>
              </div>

              <div className="pc-how">
                <p className="pc-eyebrow">Cómo funciona</p>
                <ol className="pc-steps">
                  <li>
                    <span className="pc-step-number">1</span>
                    <div>
                      <strong>Cuentas lo que pasa</strong>
                      <span>Con tus palabras y sin apuro. Una cosa a la vez.</span>
                    </div>
                  </li>
                  <li>
                    <span className="pc-step-number">2</span>
                    <div>
                      <strong>Te decimos qué entendimos</strong>
                      <span>Si no es eso, lo corriges tú. Mandas tú.</span>
                    </div>
                  </li>
                  <li>
                    <span className="pc-step-number">3</span>
                    <div>
                      <strong>Te damos un código</strong>
                      <span>Con él vuelves a ver tu aporte y qué pasó con él.</span>
                    </div>
                  </li>
                </ol>
                <p className="pc-how-note">
                  {convocatoria?.efecto ??
                    "Que quede registrado no significa que haya un compromiso de obra: significa que alguien lo va a revisar."}
                </p>
              </div>
            </div>
          </section>

          <section className="pc-section" data-prueba="agenda">
            <div className="pc-section-header">
              <div>
                <p className="pc-eyebrow">Agenda</p>
                <h2>Próximos encuentros</h2>
              </div>
            </div>

            {encuentros.length === 0 ? (
              // Que no haya encuentros **no es que no haya dónde participar**:
              // el módulo dice que una convocatoria puede recibir aportes por
              // internet sin ninguna reunión.
              <p className="pc-empty" data-prueba="sin-encuentros">
                No hay encuentros programados por ahora.{" "}
                {abierta && <>No hace falta esperar a uno: <Link className="pc-text-action" href="/participar">puedes contar lo tuyo por internet</Link>.</>}
              </p>
            ) : (
              <>
                <Encuentros lista={encuentros} />
                <p className="pc-note">
                  {/* Dos cosas que el módulo prohíbe confundir, dichas donde se
                      confundirían: entrar a un encuentro no es haber aportado, y
                      aportar no exige ir a ninguno. */}
                  Puedes <strong>aportar sin asistir</strong> y asistir sin aportar. Entrar a un
                  encuentro no registra tu necesidad: para eso, cuéntala.
                </p>
              </>
            )}
          </section>

          <section className="pc-section">
            <h2>Qué pasa con lo que cuentas</h2>
            <p className="pc-note">
              {convocatoria?.alcance ??
                "Alguien lo revisa, lo ubica en su territorio y lo agrupa con lo de tus vecinos si es lo mismo."}
            </p>
            <p className="pc-privacy">
              No pedimos tu nombre, tu cédula ni tu correo. Si cuentas algo que te pone en riesgo,
              la pantalla te muestra a dónde llamar — <strong>esto no es un canal de
              emergencias</strong>.
            </p>
          </section>
        </main>

        <footer className="pc-footer">
          <p>
            Participación ciudadana · Plan Nacional de Desarrollo. La participación aquí es
            voluntaria: <strong>el número de aportes no representa a la población</strong> de un
            territorio.
          </p>
        </footer>
      </div>
    </div>
  );
}
