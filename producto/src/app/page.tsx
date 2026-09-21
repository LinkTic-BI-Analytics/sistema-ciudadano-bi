import Link from "next/link";
import type { CSSProperties } from "react";
import { procesoVigente } from "../datos/proceso.ts";
import { convocatoriaVigente, proximosEncuentros } from "../convocatoria/agenda.ts";
import { Calendario } from "./calendario.tsx";
import { Cabecera, FranjaInstitucional, Pie, Tricolor } from "../producto/marca.tsx";
import {
  IconoAviso, IconoBases, IconoInstalacion, IconoMesas, IconoPlenaria, IconoRegistro, IconoSinCuenta,
} from "../producto/iconos.tsx";

/** El retardo de entrada de cada pieza del hero. Entra en cascada, no de golpe. */
const orden = (n: number) => ({ "--pc-orden": n }) as CSSProperties;

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

// Dentro de una frase el mes va entero: «14 de nov de 2026» se lee como una
// abreviatura de formulario, no como una fecha que alguien te está diciendo.
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
               "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** El día y el mes, en palabras. Para fechas dentro de una frase. */
function enPalabras(iso: string) {
  const f = new Date(iso);
  return `${f.getDate()} de ${MESES[f.getMonth()]} de ${f.getFullYear()}`;
}

/** Los seis ejes del resumen del DNP, cada uno con un tono de la paleta de sectores. */
const CAMINOS: [string, number][] = [
  ["Reconstrucción, Transformación y Resiliencia", 1],
  ["Patriotismo Constitucional", 2],
  ["Milagro Social", 3],
  ["Milagro Económico", 4],
  ["Colombia de las Regiones", 5],
  ["Transformación del Estado", 6],
];

export default async function Portada() {
  const procesoId = await procesoVigente();
  const [convocatoria, encuentros] = await Promise.all([
    convocatoriaVigente(procesoId),
    // Sesenta y no los seis por defecto: el cronograma oficial trae doce y
    // administración puede añadir más. Cortar en seis dejaba tres semanas del
    // calendario vacías con encuentros en la base.
    proximosEncuentros(procesoId, 60),
  ]);
  const abierta = convocatoria?.recibeAportes ?? true;

  return (
    <div className="pc-ui">
      <div className="pc-shell">
        <FranjaInstitucional />

        {/* **Sin menú, y es a propósito.** Tenía dos enlaces que llevaban a
            los mismos dos sitios que el botón y el enlace del hero: cuatro
            cosas tocables para dos destinos, con tres rótulos distintos para el
            mismo par. En un teléfono de 360 px eso empujaba el botón principal
            **debajo del pliegue** —lo primero tocable eran dos enlaces grises— y
            la persona que entra una sola vez no llegaba a verlo.

            Lo único que se le añadió es el botón de tema, que no compite con
            nada: no lleva a ninguna parte.

            Otro efecto del menú viejo: con la convocatoria cerrada seguía
            ofreciendo «Contar una necesidad» y llevando a un formulario que ya
            no recibe nada. `RF10` lo prohíbe, y era por este camino. */}
        <Cabecera volver={false} />

        <main className="pc-main" data-layout="home">
          <section className="pc-hero">
            <p className="pc-eyebrow pc-entra" style={orden(0)}>
              <Tricolor />
              {convocatoria?.nombre ?? "Escucha permanente"}
            </p>
            <div className="pc-hero-layout">
              <div>
                {/* La entrada va pieza por pieza, y **nunca sobre el botón**:
                    `translateY` no mueve a los hermanos, pero sí a lo que
                    envuelve. Un botón que todavía se está acomodando cuando
                    alguien ya apuntó el dedo es un botón que se falla. */}
                <h1 className="pc-entra" style={orden(1)}>
                  Cuéntanos qué <em>necesita mejorar</em> donde vives
                </h1>
                <p className="pc-hero-intro pc-entra" style={orden(2)}>
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
                {/* **Un `<span>` dentro, y no es un capricho.** `pc-hero-help`
                    es `display:flex` porque está pensada para un icono y una
                    línea de texto: metiéndole un párrafo con `<strong>`, cada
                    trozo se vuelve una columna y el texto sale repartido en
                    tres columnas ilegibles. Con un solo hijo, el texto fluye
                    como texto.

                    Es el mismo error que ya cometimos con `.bo-search-field`:
                    usar como estilo de texto una clase que es un contenedor. */}
                {/* **Y el icono que esa clase esperaba.** `.pc-hero-help svg`
                    está dimensionado en la hoja con su `margin-top` de dos
                    píxeles para que caiga alineado con la primera línea, y no
                    había ninguno: la regla llevaba ahí desde el primer día
                    apuntando a un elemento que nadie ponía.
                    Va `aria-hidden` y nunca solo: el texto lo dice entero. */}
                <p className="pc-hero-help">
                  <IconoSinCuenta />
                  <span>Sin cuenta, sin correo y sin cédula. Puedes escribirlo o contarlo hablando.</span>
                </p>
                <p className="pc-hero-help">
                  <IconoAviso />
                  <span>
                    Registrarlo no es una promesa de obra: es que alguien lo lea y tú puedas ver
                    qué pasó.
                  </span>
                </p>
                {convocatoria?.cierraEn && abierta && (
                  // **Hasta cuándo.** Es lo que decide si lo hace ahora o
                  // «después» — y después no vuelve. En `pc-note` y no en
                  // `pc-hero-help`: una fecha con la que hay que contar días no
                  // se pone en el gris más pequeño de la pantalla.
                  <p className="pc-note" data-prueba="plazo">
                    Recibimos aportes hasta el <strong>{enPalabras(convocatoria.cierraEn)}</strong>.
                  </p>
                )}
              </div>

              <div className="pc-how pc-entra" style={orden(3)}>
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

          {/* **El calendario, no una lista.** Es el cronograma de despliegue
              territorial del DNP, en la identidad de la aplicación: semanas con
              su rótulo, cinco días, y cada encuentro como bloque con uno de los
              tres colores de la bandera. Los encuentros salen de la base; el
              rótulo de la semana y el festivo, de `convocatoria/cronograma.ts`.

              `.pc-entra` con retardo y no `.pc-revela`: la animación atada al
              desplazamiento dejaba media portada invisible en cualquier
              captura y depende de que el navegador la conozca. Con tiempo,
              todo se ve. */}
          <section className="pc-section pc-entra" style={orden(4)} data-prueba="agenda">
            <div className="pc-section-header">
              <div>
                <p className="pc-eyebrow"><Tricolor />Agenda</p>
                <h2>Encuentros regionales</h2>
              </div>
              <ul className="pc-leyenda" aria-label="Cómo leer el calendario">
                <li><i data-bandera="1" aria-hidden />Cada día con encuentro lleva un color de la bandera</li>
                <li><i data-cancelado aria-hidden />Cancelado</li>
              </ul>
            </div>

            {/* **Antes del calendario, no después.** La persona lee «Pereira ·
                lun 5 de oct» y saca la conclusión de que hay que ir, mucho antes
                de llegar a la frase que dice que no. */}
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
                <Calendario encuentros={encuentros} />
                <p className="pc-note">
                  Entrar a un encuentro <strong>no registra tu necesidad</strong>: para eso,
                  cuéntala.
                </p>
              </>
            )}
          </section>

          {/* **Cómo es un encuentro regional.** Del «Resumen Encuentro Regional»
              del DNP: cinco pasos desde la llegada hasta las Bases del Plan.
              Va después del calendario —primero cuándo y dónde, después qué
              pasa allí— y no repite el botón de contar: la portada tiene uno. */}
          <section className="pc-section pc-entra" style={orden(5)} data-prueba="como-es">
            <div className="pc-section-header">
              <div>
                <p className="pc-eyebrow"><Tricolor />En el encuentro</p>
                <h2>Cómo es un encuentro regional</h2>
              </div>
            </div>
            <p className="pc-note">Desde la llegada de los participantes hasta las Bases del Plan.</p>
            <ol className="pc-pasos-encuentro">
              <li>
                <span className="pc-paso-icono"><IconoRegistro /></span>
                <h3>Registro</h3>
                <p>
                  La ciudadanía se dirige a la mesa de registro, donde se toman sus datos y se le
                  orienta hacia el eje de su interés.
                </p>
              </li>
              <li>
                <span className="pc-paso-icono"><IconoInstalacion /></span>
                <h3>Instalación</h3>
                <p>
                  Los participantes escuchan en el escenario central las palabras de apertura del
                  gobierno nacional.
                </p>
              </li>
              <li>
                <span className="pc-paso-icono"><IconoMesas /></span>
                <h3>Mesas Milagro</h3>
                <p>
                  Los participantes dialogan sobre las problemáticas del territorio y construyen
                  propuestas y visiones para los próximos cuatro años. Cada mesa registra sus
                  acuerdos.
                </p>
              </li>
              <li>
                <span className="pc-paso-icono"><IconoPlenaria /></span>
                <h3>Plenaria</h3>
                <p>
                  Cada mesa comparte con todos las conclusiones y propuestas de su eje, y se
                  recogen observaciones.
                </p>
              </li>
              <li>
                <span className="pc-paso-icono"><IconoBases /></span>
                <h3>Bases del Plan</h3>
                <p>
                  Los aportes se sistematizan y se incorporan como insumo para las Bases del Plan
                  Nacional de Desarrollo.
                </p>
              </li>
            </ol>
          </section>

          {/* **Los seis caminos hacia la Patria Milagro.** Los ejes en los que
              se organizan las mesas. Cada uno con un color de la paleta de
              sectores, para que se distingan de un vistazo. */}
          <section className="pc-section pc-entra" style={orden(6)} data-prueba="caminos">
            <div className="pc-section-header">
              <div>
                <p className="pc-eyebrow"><Tricolor />Los ejes</p>
                <h2>Los seis caminos hacia la Patria Milagro</h2>
              </div>
            </div>
            <ol className="pc-caminos">
              {CAMINOS.map(([nombre, sector], i) => (
                <li key={nombre} className="pc-camino" data-sector={sector}>
                  <p className="pc-eyebrow">Eje {i + 1}</p>
                  <h3>{nombre}</h3>
                </li>
              ))}
            </ol>
          </section>

          <section className="pc-section pc-entra" style={orden(7)}>
            <p className="pc-eyebrow"><Tricolor />Después de contarlo</p>
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

        <Pie />
      </div>
    </div>
  );
}
