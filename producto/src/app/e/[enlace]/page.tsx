import Link from "next/link";
import { resolverEnlace, utmsLimpias } from "../../../convocatoria/enlaces.ts";
import { procesoVigente } from "../../../datos/proceso.ts";
import { proximosEncuentros } from "../../../convocatoria/agenda.ts";
import { Confirmar } from "./confirmar.tsx";

// Lo que pasa cuando alguien escanea el QR (`QR-02`, `QR-04`).
//
// La regla que gobierna toda esta pantalla: **abrir un enlace no es haber
// asistido a nada.** Por eso no dice «estás aquí» ni «asististe»: pregunta.
//
// Y un identificador que no existe **no se inventa**. `QR-04` es explícito:
// «ante ID inexistente se muestra selector/agenda sin inventar evento ni
// asociación».

export const dynamic = "force-dynamic";
export const metadata = { title: "Participar en un encuentro" };

const cuando = (iso: string, zona: string) =>
  new Date(iso).toLocaleString("es-CO", { timeZone: zona, dateStyle: "full", timeStyle: "short" });

export default async function PorEnlace({
  params, searchParams,
}: {
  params: Promise<{ enlace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { enlace: id } = await params;
  const crudos = await searchParams;

  // Las UTMs se limpian antes de tocarlas. Son texto de un desconocido y van a
  // acabar en una pantalla interna.
  const parametros = new URLSearchParams();
  for (const [k, v] of Object.entries(crudos)) if (typeof v === "string") parametros.set(k, v);
  const utms = utmsLimpias(parametros);

  const r = await resolverEnlace(id.toUpperCase());
  const procesoId = await procesoVigente();
  const agenda = await proximosEncuentros(procesoId, 6);

  const Marco = ({ children }: { children: React.ReactNode }) => (
    <div className="pc-ui">
      <div className="pc-shell">
        <main className="pc-main" data-layout="eventDetail">{children}</main>
      </div>
    </div>
  );

  if (!r.existe) {
    return (
      <Marco>
        <p className="pc-eyebrow">Enlace no encontrado</p>
        <h1>Este enlace no corresponde a ningún encuentro</h1>
        {/* No se inventa un evento ni se asocia a ninguno por parecido. */}
        <p className="pc-note">
          Puede estar mal copiado, o el material puede ser de otro proceso. Estos son los
          encuentros publicados.
        </p>
        <ul className="pc-event-list">
          {agenda.map((e) => (
            <li key={e.id} className="pc-event-row">
              <div><p className="pc-event-title"><span>{e.titulo}</span></p>
                <p className="pc-event-when">{cuando(e.comienzaEn, e.zonaHoraria)}</p></div>
            </li>
          ))}
        </ul>
        <div className="pc-actions">
          <Link className="pc-action" href="/participar">Contar sin estar en un encuentro</Link>
        </div>
      </Marco>
    );
  }

  const { encuentro } = r;
  const cancelado = encuentro.estado === "cancelado";
  const pasado = new Date(encuentro.comienzaEn).getTime() < Date.now();

  return (
    <Marco>
      <p className="pc-eyebrow">Encuentro</p>
      <h1>{encuentro.titulo}</h1>
      <dl className="pc-detail-facts">
        <dt>Cuándo</dt>
        <dd>{cuando(encuentro.comienzaEn, encuentro.zonaHoraria)}</dd>
        <dt>Dónde</dt>
        <dd>{encuentro.modalidad === "virtual" ? "Virtual" : encuentro.lugar}</dd>
      </dl>

      {/* `QR-04`: un enlace viejo explica el estado real y ofrece alternativas.
          Un QR cancelado **no invita a asistir** aunque el afiche siga pegado
          en la pared. */}
      {cancelado && (
        <p className="pc-note" data-prueba="cancelado">
          <strong>Este encuentro se canceló.</strong>
          {encuentro.motivoCambio && ` ${encuentro.motivoCambio}.`} No vayas al sitio. Puedes
          contar lo tuyo por internet igual.
        </p>
      )}
      {encuentro.estado === "reprogramado" && (
        <p className="pc-note" data-prueba="reprogramado">
          <strong>Cambió de fecha.</strong> La de arriba es la vigente
          {encuentro.motivoCambio && `: ${encuentro.motivoCambio}`}. El afiche impreso no cambia
          solo.
        </p>
      )}
      {pasado && !cancelado && (
        <p className="pc-note">Este encuentro ya pasó. Puedes contar lo tuyo por internet.</p>
      )}
      {!r.utilizable && (
        <p className="pc-note">Este material se retiró. Lo que se recibió por él sigue su curso.</p>
      )}

      <Confirmar
        enlaceId={r.enlace.id}
        eventoOrigenId={encuentro.id}
        tituloOrigen={encuentro.titulo}
        utms={utms}
        puedeAsistir={!cancelado && !pasado && r.utilizable}
        agenda={agenda.filter((e) => e.estado !== "cancelado").map((e) => ({
          id: e.id, titulo: e.titulo, cuando: cuando(e.comienzaEn, e.zonaHoraria),
        }))}
      />
    </Marco>
  );
}
