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
    "Cuéntanos qué necesita mejorar donde vives. Sin cuenta y sin correo. Consulta las convocatorias y los próximos encuentros.",
};

const DIA = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** El día del mes y el mes, en palabras. Para fechas dentro de una frase. */
function enPalabras(iso: string) {
  const f = new Date(iso);
  return `${f.getDate()} de ${MES[f.getMonth()]} de ${f.getFullYear()}`;
}

function cuando(iso: string, zona: string) {
  const f = new Date(iso);
  const hora = f.toLocaleTimeString("es-CO", { timeZone: zona, hour: "numeric", minute: "2-digit" });
  // **La zona solo si no es la del país.** Decía siempre «(Bogota)» —sin tilde—
  // justo al lado de «Caseta comunal de la vereda El Salado», y se leía como el
  // lugar: «¿es en Bogotá o en El Salado?». Para quien vive en la vereda esa no
  // es una duda de detalle: decide si va o no.
  //
  // Cuando de verdad es otro huso sí hace falta, porque quien se conecta desde
  // fuera llega tarde. Entonces se dice como lo que es: la hora de un sitio.
  const otroHuso = zona !== "America/Bogota";
  const donde = otroHuso ? ` (hora de ${zona.split("/")[1]?.replace(/_/g, " ") ?? zona})` : "";
  // **La fecha completa, también para quien no ve.** El recuadro grande del día
  // lleva `aria-hidden`, así que un lector de pantalla solo decía «dom»: el día
  // del mes no se oía en ninguna parte.
  return `${DIA[f.getDay()]} ${f.getDate()} de ${MES[f.getMonth()]} · ${hora}${donde}`;
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

        {/* **Sin menú, y es a propósito.** Tenía dos enlaces que llevaban a
            los mismos dos sitios que el botón y el enlace del hero: cuatro
            cosas tocables para dos destinos, con tres rótulos distintos para el
            mismo par. En un teléfono de 360 px eso empujaba el botón principal
            **debajo del pliegue** —lo primero tocable eran dos enlaces grises— y
            la persona que entra una sola vez no llegaba a verlo.

            Las páginas de dentro lo conservan; aquí compite con un botón que
            dice exactamente lo mismo.

            Otro efecto: con la convocatoria cerrada, ese menú seguía ofreciendo
            «Contar una necesidad» y llevando a un formulario que ya no recibe
            nada. `RF10` lo prohíbe, y era por este camino. */}
        <header className="pc-header">
          <p className="pc-brand">
            Participación ciudadana
            <span className="pc-brand-sub">Plan Nacional de Desarrollo</span>
          </p>
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
                {/* **Aquí va lo que decide si entra o no.** Dos cosas estaban
                    donde no se leen: que no piden cédula vivía en la tercera
                    pantalla, y el límite —que registrar algo no es una promesa
                    de obra— en `pc-how-note`, que el sistema de diseño **oculta
                    bajo 42rem**. Es decir: la persona a la que más hay que
                    decírselo, la que va a contar que no tiene agua desde un
                    teléfono, no lo veía nunca.

                    Y que se puede hablar en vez de escribir no estaba en
                    ninguna parte de la portada, aunque es el dato que decide si
                    entra alguien a quien le cuesta escribir. */}
                <p className="pc-hero-help">
                  Sin cuenta, sin correo y sin cédula. Puedes <strong>escribirlo o contarlo
                  hablando</strong>. Registrarlo no es una promesa de obra: es que alguien lo lea
                  y tú puedas ver qué pasó.
                </p>
                {convocatoria?.cierraEn && abierta && (
                  // **Hasta cuándo.** Es lo que decide si lo hace ahora o
                  // «después» — y después no vuelve. No estaba en ningún lado.
                  <p className="pc-hero-help" data-prueba="plazo">
                    Recibimos aportes hasta el <strong>{enPalabras(convocatoria.cierraEn)}</strong>.
                  </p>
                )}
              </div>

              <div className="pc-how">
                <p className="pc-eyebrow">Cómo funciona</p>
                <ol className="pc-steps">
                  <li>
                    <span className="pc-step-number">1</span>
                    <div>
                      {/* «Una cosa a la vez» no dice qué hacer, y «Mandas tú»
                          suena a chiste interno para quien nunca ha hecho un
                          trámite en línea. */}
                      <strong>Cuentas lo que pasa</strong>
                      <span>
                        Escribiendo o hablando, con tus palabras. Si son varias cosas, cuenta
                        primero la que más te afecta.
                      </span>
                    </div>
                  </li>
                  <li>
                    <span className="pc-step-number">2</span>
                    <div>
                      <strong>Te mostramos qué entendimos</strong>
                      <span>Si no es eso, lo corriges antes de enviar.</span>
                    </div>
                  </li>
                  <li>
                    <span className="pc-step-number">3</span>
                    <div>
                      <strong>Te damos un código</strong>
                      <span>Guárdalo: con él ves tu aporte y qué pasó con él.</span>
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

            {/* **Antes de la lista, no después.** Iba debajo de las cuatro
                tarjetas: la persona leía «Mesa sobre el agua · 40 cupos» y sacaba
                la conclusión de que había que ir, mucho antes de llegar a la
                frase que dice que no. */}
            {encuentros.length > 0 && (
              <p className="pc-note">
                <strong>Ir a un encuentro no es obligatorio.</strong> Puedes contar lo tuyo aquí,
                sin ir a ninguno.
              </p>
            )}

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
                {/* La otra mitad de lo mismo, y esta sí va detrás: importa
                    cuando ya miró los encuentros y está pensando en ir. */}
                <p className="pc-note">
                  Entrar a un encuentro <strong>no registra tu necesidad</strong>: para eso,
                  cuéntala.
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
          {/* **El pie decía una frase para el analista de BI** —«el número de
              aportes no representa a la población de un territorio»— que leída
              desde la vereda suena a «lo tuyo no cuenta». Esa advertencia importa,
              pero le importa a quien lee los datos, no a quien los cuenta: su
              sitio es la consola y el corte, donde ya está.

              Aquí va lo que esa persona necesita: a dónde llamar si hay peligro
              ahora. Es lo mismo que dice `/participar`, que sí da el número. */}
          <p>
            Participación ciudadana · Plan Nacional de Desarrollo.{" "}
            <strong>Si hay personas en peligro ahora, llama al 123</strong>: esta página no
            atiende emergencias.
          </p>
        </footer>
      </div>
    </div>
  );
}
