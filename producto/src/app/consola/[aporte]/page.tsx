import Link from "next/link";
import { Fragment } from "react";
import { recurrenciaDe } from "../../../revision/recurrencia.ts";
import { TEMAS } from "../../../captura/lectura.ts";
import { Campo, Opciones } from "../campos.tsx";
import { enPartes } from "../../../revision/sintesis-en-partes.ts";
import {
  antiguedadDe, alcanceDe, COMO_SE_LEE_ANTIGUEDAD, COMO_SE_LEE_ALCANCE,
} from "../../../revision/normalizar.ts";
import { clienteServidor } from "../../../datos/cliente.ts";
import { todas } from "../../../datos/leer.ts";
import { procesoVigente } from "../../../datos/proceso.ts";
import { expedientesDe } from "../../../revision/expediente.ts";
import { prioridadVigente, historiaDePrioridad } from "../../../priorizacion/prioridad.ts";
import { historiaDe, estadoDeAtencion } from "../../../gestion/actuacion.ts";
import {
  accionResolver, accionDevolver, accionCrearExpediente, accionPriorizar,
  accionCorregirMunicipio, accionRemitir, accionAceptarRemision, accionCambiarTema,
} from "../acciones.ts";

export const dynamic = "force-dynamic";

/**
 * Los factores de prioridad, **sueltos y sin sumar** (`PRI-01`).
 *
 * No hay puntaje ni ranking: los pesos no existen, y una fórmula inventada
 * decidiría a quién se atiende primero con una cuenta que nadie autorizó. Eso
 * estaba escrito en la pantalla y ahí sobraba — quien revisa ve cuatro
 * selectores sueltos y no hay ningún número que sumar.
 */
const FACTORES: [string, string, string[]][] = [
  ["afectacion", "Afectación", ["alta", "media", "baja", "sin_establecer"]],
  ["urgencia", "Urgencia reportada", ["alta", "media", "baja", "sin_declarar"]],
  ["recurrencia", "Recurrencia", ["alta", "media", "baja", "unica"]],
  ["competencia", "Competencia", ["clara", "en_disputa", "sin_establecer"]],
];

/** «por_clasificar» es como se guarda; no es como se lee. */
function enPalabras(valor: string | null | undefined): string {
  return (valor ?? "").replace(/_/g, " ");
}

export default async function Ficha({ params }: { params: Promise<{ aporte: string }> }) {
  const { aporte: aporteId } = await params;
  const procesoId = await procesoVigente();
  const p = clienteServidor().schema("participacion");

  const { data: a } = await p.from("aporte")
    .select("id, relato_original, lugar_declarado, afectados, desde_cuando, es_colectivo, colectivo_declarado, canal, recibido_en, estado_clasificacion, estado_confirmacion, estado_revision, grabacion_id, enlace_id, evento_confirmado_id, estado_contexto, utms_recibidas, tema, tema_propuesto")
    .eq("id", aporteId).single();
  if (!a) return <div className="pc-backoffice"><p className="bo-empty">No existe ese aporte.</p></div>;

  const { data: ubi } = await p.from("ubicacion")
    .select("estado, territorio_codigo, territorio_version, motivo, autor")
    .eq("aporte_id", aporteId).order("creada_en");
  const { data: sint } = await p.from("sintesis")
    .select("version, texto, clase, autor, confirmada_en").eq("aporte_id", aporteId).order("version");
  const { data: alerta } = await p.from("alerta")
    .select("origen, indicio, orientacion_mostrada_en, contacto_intentado_en, recepcion_confirmada_en, devuelta_en")
    .eq("aporte_id", aporteId).maybeSingle();
  // Las versiones de la transcripción, si habló. **Es el corazón del ADR
  // 0013**: sin poder comparar lo que oyó la máquina con lo que corrigió la
  // persona, guardar el audio no sirve de nada.
  const transcripciones = a?.grabacion_id
    ? (await p.from("transcripcion")
        .select("version, texto, autor, motivo, creada_en")
        .eq("grabacion_id", a.grabacion_id).order("version")).data ?? []
    : [];

  // El contexto del enlace (`QR-03`): de dónde vino y en qué evento dice
  // participar. Son cosas distintas y el revisor tiene que verlas separadas.
  const enlace = a?.enlace_id
    ? (await p.from("enlace").select("id, pieza, encuentro_id, utm_source, utm_medium, utm_campaign")
        .eq("id", a.enlace_id).maybeSingle()).data
    : null;
  const encuentros = (enlace || a?.evento_confirmado_id)
    ? (await p.from("encuentro").select("id, titulo, comienza_en")
        .in("id", [enlace?.encuentro_id, a?.evento_confirmado_id].filter(Boolean) as string[])).data ?? []
    : [];
  const tituloDe = (id: string | null | undefined) =>
    encuentros.find((e) => e.id === id)?.titulo ?? null;

  /**
   * Lo que el formulario de expediente propone (`CLA-04`).
   *
   * Sale de lo que **la persona confirmó**, no de lo que leyó la máquina: la
   * versión vigente de la síntesis. Si ella corrigió «Martinica» por
   * «Martinita», el expediente nace con lo suyo.
   */
  const propuestaDeExpediente = (() => {
    const vigente = sint?.[sint.length - 1]?.texto ?? "";
    const parte = (etiqueta: string) =>
      vigente.split("\n").find((l: string) => l.startsWith(etiqueta))?.slice(etiqueta.length).trim() ?? "";
    const descripcion = [parte("Problema:"), a?.lugar_declarado, a?.desde_cuando]
      .filter(Boolean).join(" · ");
    return {
      descripcion: descripcion || (a?.relato_original ?? "").slice(0, 120),
      cambio: parte("Lo que se espera:"),
    };
  })();

  const vigente = sint?.[sint.length - 1] ?? null;

  // Cuántos más hay como este (`CLA-03`). Se calcula, nunca se declara.
  const recurrencia = await recurrenciaDe(aporteId);
  // **El municipio aceptado sale de la ubicación, no de la recurrencia.**
  // Salía de `recurrenciaDe()`, que devuelve `municipio: null` cuando el aporte
  // no tiene tema —porque sin tema no hay nada que contar—. Resultado: la
  // cabecera decía «sin municipio aceptado» justo encima de una sección que
  // decía «confirmada · ANSERMA». Dos afirmaciones contrarias sobre el mismo
  // dato, en la misma pantalla.
  //
  // Un dato no se toma de un cálculo que existe para otra cosa.
  const aceptada = ubi?.find((u) => u.estado === "confirmada" && u.territorio_codigo) ?? null;
  const departamentoDelMunicipio = aceptada?.territorio_codigo
    ? (await (async () => {
        const { data: m } = await p.from("territorio").select("padre")
          .eq("codigo", aceptada!.territorio_codigo!).eq("nivel", "municipio").limit(1).maybeSingle();
        if (!m?.padre) return null;
        const { data: d } = await p.from("territorio").select("nombre")
          .eq("codigo", m.padre).eq("nivel", "departamento").limit(1).maybeSingle();
        return d?.nombre ?? null;
      })())
    : null;
  const nombreDelMunicipio = aceptada?.territorio_codigo
    ? (await p.from("territorio").select("nombre").eq("codigo", aceptada.territorio_codigo)
        .eq("nivel", "municipio").limit(1).maybeSingle()).data?.nombre ?? null
    : null;

  // Los 1.122 municipios, por páginas. `.limit(1200)` no los traía: PostgREST
  // corta en 1.000 por respuesta y devuelve un `200`, así que los 122 del final
  // del alfabeto —de Yotoco para abajo— no se podían escoger al confirmar la
  // ubicación. Es el mismo corte que dejó la periferia fuera del buscador.
  const mun = await todas<{ codigo: string; version: string; nombre: string; departamento: string | null }>(
    "el catálogo de municipios", (desde, hasta) =>
      p.from("territorio").select("codigo, version, nombre, departamento:padre")
        .eq("nivel", "municipio").order("nombre").range(desde, hasta));
  // El nombre por código, para no enseñar «15001» a quien revisa.
  const nombreDe = new Map(mun.map((m) => [m.codigo, m.nombre]));

  const expIds = await expedientesDe(aporteId);
  const exp = expIds[0]
    ? (await p.from("expediente").select("id, descripcion, reabierto_en").eq("id", expIds[0]).single()).data
    : null;
  const prio = exp ? await prioridadVigente(exp.id) : null;
  const historia = exp ? await historiaDePrioridad(exp.id) : [];
  // Lo que se hizo con el expediente y el estado que de ahí se deriva. **Nunca
  // almacenado**: un campo `estado` se desincroniza de sus hechos, y entonces la
  // pantalla afirma algo que la historia contradice.
  const actuaciones = exp ? await historiaDe(exp.id) : [];
  const atencion = exp ? await estadoDeAtencion(exp.id) : null;
  const remisiones = actuaciones.filter((x) => x.tipo === "remision");

  return (
    <div className="pc-backoffice">
      <div className="bo-shell">
        <aside className="bo-sidebar">
          <div className="bo-brand">Consola</div>
          <Link className="bo-back" href="/consola">← Volver a la bandeja</Link>
          <div className="bo-sidebar-bottom">
            <p className="bo-small"><strong>Sin permisos.</strong> No desplegar.</p>
          </div>
        </aside>

        <div className="bo-workspace">
          <header className="bo-topbar">
            <span className="bo-record-code">{aporteId.slice(0, 8)}</span>
            <span className="bo-results-line">{a.canal} · {new Date(a.recibido_en).toLocaleString("es-CO")}</span>
          </header>

          <main className="bo-main">
            {alerta && !alerta.devuelta_en && (
              <section className="bo-error">
                <h2>Alerta urgente</h2>
                <p>
                  La levantó <strong>{alerta.origen === "senal" ? "una señal de texto" : alerta.origen}</strong>
                  {alerta.indicio && <> · indicio: «{alerta.indicio}»</>}
                </p>
                <p className="bo-small">
                  Orientación mostrada: {alerta.orientacion_mostrada_en ? "sí" : "no"} ·
                  Contacto intentado: {alerta.contacto_intentado_en ? "sí" : "no"} ·
                  Recepción confirmada: {alerta.recepcion_confirmada_en ? "sí" : "no"}
                </p>
                <p className="bo-small">
                  <strong>Mostrar un teléfono no es haber contactado, y contactar no es que
                  alguien haya recibido.</strong>
                </p>
              </section>
            )}

            <div className="bo-review-layout">
              <div>
                {/* **Lo que hay que ver antes de leer el relato** (`CLA-02`).
                    Sin esto el revisor tenía que leerse cada aporte entero para
                    saber siquiera si hablaba de agua o de una vía, y no había
                    con qué clasificar ni priorizar. */}
                <dl className="bo-context-grid" data-prueba="cabecera">
                  <dt className="bo-small">De qué</dt>
                  <dd>
                    {a.tema
                      ? <strong>{a.tema}</strong>
                      : <span className="bo-muted">sin tema · no se puede enrutar</span>}
                    {a.tema_propuesto && a.tema !== a.tema_propuesto && (
                      <span className="bo-small">
                        {" "}· la lectura propuso «{a.tema_propuesto}»
                      </span>
                    )}
                  </dd>

                  <dt className="bo-small">Dónde</dt>
                  <dd>
                    {/* El municipio **aceptado**, no el texto declarado: mostrar
                        el declarado como si fuera el aceptado es la inferencia
                        que `I2` prohíbe.

                        Y con su departamento: se capturaba y esta ficha lo
                        traía de la base sin llegar a enseñarlo nunca. */}
                    {nombreDelMunicipio
                      ? <strong>{nombreDelMunicipio}{departamentoDelMunicipio && `, ${departamentoDelMunicipio}`}</strong>
                      : <span className="bo-muted">sin municipio aceptado</span>}
                    {a.lugar_declarado && (
                      <span className="bo-small"> · dijo: «{a.lugar_declarado}»</span>
                    )}
                  </dd>

                  {/* **Suben aquí desde debajo del relato.** `CLA-02` los pide
                      de un vistazo, antes de leer: enterrados entre párrafos,
                      había que leerse el aporte entero para saber a cuánta
                      gente le pasa. */}
                  <dt className="bo-small">A quiénes</dt>
                  <dd>
                    {/* El rango primero, su frase después. El rango es una
                        lectura nuestra para poder agrupar (`NOR-02`); lo que
                        ella dijo es el dato, y por eso va al lado y no se
                        sustituye. */}
                    {a.afectados ? (
                      <>
                        <strong>{COMO_SE_LEE_ALCANCE[alcanceDe(a.afectados)]}</strong>
                        <span className="bo-small"> · «{a.afectados}»</span>
                      </>
                    ) : (
                      <span className="bo-muted">no lo dijo</span>
                    )}
                  </dd>

                  <dt className="bo-small">Desde cuándo</dt>
                  <dd>
                    {/* Tal cual. «Hace tres meses» no es una fecha, y volverlo
                        una sería la inferencia que `I2` prohíbe. */}
                    {a.desde_cuando ? (
                      <>
                        <strong>{COMO_SE_LEE_ANTIGUEDAD[antiguedadDe(a.desde_cuando)]}</strong>
                        <span className="bo-small"> · «{a.desde_cuando}»</span>
                      </>
                    ) : (
                      <span className="bo-muted">no lo dijo</span>
                    )}
                  </dd>

                  <dt className="bo-small">Cuántos más como este</dt>
                  <dd>
                    {/* Dice **cuál** de los dos falta. «Falta tema o
                        municipio» obligaba a ir a buscar cuál era, y muchas
                        veces uno de los dos estaba ahí mismo, dos filas arriba. */}
                    {!a.tema || !aceptada ? (
                      <span className="bo-muted">
                        sin contar · falta {!a.tema && !aceptada ? "el tema y el municipio"
                          : !a.tema ? "el tema" : "el municipio"}
                      </span>
                    ) : recurrencia.otros === 0 ? (
                      <>Ninguno todavía. <span className="bo-muted">Ser el único no lo hace menos grave.</span></>
                    ) : (
                      <>
                        <strong>{recurrencia.otros} aportes más</strong> del mismo tema en este
                        municipio · <span className="bo-muted">son aportes, no personas</span>
                      </>
                    )}
                  </dd>
                </dl>

                {/* **Corregir el tema.** `GES-02` la lista entre lo que se
                    puede corregir, y no existía: 114 de 115 aportes estaban sin
                    tema y no había ninguna forma de ponérselo. Un aporte sin
                    tema no se puede enrutar a ninguna mesa. */}
                <details className="bo-plegable" data-prueba="corregir-tema">
                  <summary>{a.tema ? "Corregir el tema" : "Poner un tema"}</summary>
                  <div className="bo-plegado">
                    <form action={accionCambiarTema}>
                      <input type="hidden" name="aporteId" value={aporteId} />
                      <Opciones id="tema-codigo" name="tema" etiqueta="De qué habla"
                                defaultValue={a.tema ?? ""}>
                        <option value="">Sin tema</option>
                        {TEMAS.map((x) => (
                          <option key={x} value={x}>{x}</option>
                        ))}
                      </Opciones>
                      <Campo id="tema-motivo" name="motivo" etiqueta="Por qué"
                             ejemplo="habla del acueducto, no de la vía" />
                      <Campo id="tema-autor" name="autor" etiqueta="Tu nombre" opcional />
                      <button className="bo-button">Guardar el tema</button>
                      {/* Que es una etiqueta nuestra y no algo que la persona
                          afirmó ya lo dice el formulario: pide motivo y firma. Y
                          la cabecera enseña «la lectura propuso …» cuando
                          difiere. Decirlo además en un párrafo era repetírselo a
                          quien abre cuarenta fichas al día. */}
                    </form>
                  </div>
                </details>

                {/* **El orden es el de decidir, no el de escribir.**

                    Iba: relato → grabación → de dónde llegó → lo que entendimos
                    → ubicación. La ubicación quedaba de penúltima, después del
                    contexto del QR y de las versiones viejas de la síntesis —y
                    es lo primero que hay que resolver para que el aporte sirva
                    de algo.

                    Ahora: **ubicación** (que es trabajo pendiente) → el relato →
                    lo que la persona confirmó → y al final lo que solo se mira
                    para profundizar: el audio y de dónde llegó el enlace. */}
                <section className="bo-history-section" data-prueba="ubicacion">
                  <h2>Ubicación</h2>
                  {ubi?.map((u, i) => (
                    <p key={i} data-prueba="territorio">
                      {/* En palabras, no como está en la base: salía
                          «por_aclarar», con guion bajo. */}
                      <span className="bo-badge" data-state={u.estado === "confirmada" ? "validated" : "clarify"}>
                        {u.estado === "por_aclarar" ? "por aclarar" : u.estado}
                      </span>{" "}
                      {/* **El nombre, y el código al lado.** Decía «15001» y
                          nada más: quien revisa no trabaja con códigos DANE de
                          memoria, y un dato que hay que ir a buscar a otra
                          parte es un dato que no está. */}
                      {u.territorio_codigo
                        ? <><strong>{nombreDe.get(u.territorio_codigo) ?? "un municipio que no está en el catálogo"}</strong>
                            {" "}<span className="bo-small">({u.territorio_codigo})</span></>
                        : <span className="bo-muted">sin municipio</span>}
                      {u.motivo && <span className="bo-small"> · {u.motivo}</span>}
                    </p>
                  ))}

                  {/* **Corregir en un paso.** Cambiar un municipio mal aceptado
                      obligaba a devolverlo a «por aclarar» y aceptarlo otra vez:
                      dos formularios y dos motivos para arreglar una letra. Y
                      entre los dos pasos el aporte pasaba por un estado que no
                      era cierto.

                      Corregir **reemplaza**, no agrega: dos territorios
                      significan que el problema cruza dos municipios (`GEO-01`),
                      y un error de dedo no es eso. */}
                  {/* **Plegados.** Los tres iban abiertos a la vez, y cada
                      uno lleva dentro un desplegable con los 1.122 municipios
                      del país: al abrir un aporte, lo primero que aparecía era
                      un muro de listas antes de llegar al relato. Cerrados,
                      esto vuelve a ser una ficha. */}
                  {ubi?.some((u) => u.estado === "confirmada") && (
                    <details className="bo-plegable">
                    <summary>Corregir el municipio</summary>
                    <div className="bo-plegado">
                    <form action={accionCorregirMunicipio} data-prueba="corregir-municipio">
                      <input type="hidden" name="aporteId" value={aporteId} />
                      <input type="hidden" name="version" value={mun[0]?.version ?? ""} />
                      <Opciones id="cor-codigo" name="codigo" etiqueta="Municipio correcto">
                        <option value="">Escoge uno…</option>
                        {mun.map((m) => (
                          <option key={m.codigo} value={m.codigo}>{m.nombre} ({m.codigo})</option>
                        ))}
                      </Opciones>
                      <Campo id="cor-motivo" name="motivo" etiqueta="Por qué estaba mal"
                             ejemplo="dice El Salado de Rionegro, no el de Bello" />
                      <Campo id="cor-autor" name="autor" etiqueta="Tu nombre" opcional />
                      <button className="bo-button">Corregir</button>
                      <p className="bo-small">
                        <strong>Reemplaza el municipio, no agrega un segundo.</strong> El cambio
                        queda registrado con tu nombre y el motivo.
                      </p>
                    </form>
                    </div>
                    </details>
                  )}

                  {ubi?.some((u) => u.estado === "confirmada") && (
                    <details className="bo-plegable">
                    <summary>Devolver a «por aclarar»</summary>
                    <div className="bo-plegado">
                    <form action={accionDevolver}>
                      <input type="hidden" name="aporteId" value={aporteId} />
                      <Campo id="dev-motivo" name="motivo" etiqueta="Por qué vuelve a «por aclarar»"
                             ejemplo="la persona dijo otra cosa al llamarla" />
                      <Campo id="dev-autor" name="autor" etiqueta="Tu nombre" opcional />
                      <button className="bo-button">Devolver a por aclarar</button>
                      {/* Por qué el código se borra en vez de quedarse de
                          adorno —sería el cuarto estado implícito que `I2`
                          prohíbe— está en `src/revision/ubicacion.ts`. Aquí solo
                          hace falta la consecuencia. */}
                      <p className="bo-small">El municipio se quita hasta que se aclare.</p>
                    </form>
                    </div>
                    </details>
                  )}

                  {/* Este NO se pliega: es el trabajo pendiente del aporte, lo
                      que la persona que abre la ficha vino a hacer. */}
                  {ubi?.some((u) => u.estado === "por_aclarar") && (
                    <form action={accionResolver}>
                      <input type="hidden" name="aporteId" value={aporteId} />
                      <input type="hidden" name="version" value={mun[0]?.version ?? ""} />
                      <Opciones id="ubi-codigo" name="codigo" etiqueta="Municipio">
                        <option value="">Escoge uno…</option>
                        {mun.map((m) => (
                          <option key={m.codigo} value={m.codigo}>{m.nombre} ({m.codigo})</option>
                        ))}
                      </Opciones>
                      <Campo id="ubi-motivo" name="motivo" etiqueta="Por qué este municipio"
                             ejemplo="la persona lo confirmó / la referencia solo existe ahí…" />
                      <Campo id="ubi-autor" name="autor" etiqueta="Tu nombre" opcional />
                      <button className="bo-button" data-variant="primary">Aceptar el municipio</button>
                      <p className="bo-small">
                        Acepta <strong>el lugar del problema</strong>, no la dirección de quien
                        escribió.
                      </p>
                    </form>
                  )}
                </section>

                <section className="bo-source">
                  <h2>Lo que la persona contó</h2>
                  <blockquote>{a.relato_original}</blockquote>
                  {/* **El techo de esta pantalla, dicho en la pantalla.**
                      Sin decirlo, «corregir» y «reescribir» se parecen
                      demasiado — y la diferencia entre las dos es todo el valor
                      de esto: si la consola puede cambiar el sentido de lo que
                      alguien contó, lo que sube ya no es lo que la gente dijo. */}
                  {/* **Aquí iba un párrafo de cinco líneas y ya no está.**
                      Explicaba `N03` y `V14` citando los códigos, y quien revisa
                      lo leía cuarenta veces al día sin que le cambiara ninguna
                      decisión. Lo que impide reescribir el relato no es un
                      aviso: es que no existe ningún campo para hacerlo — y de
                      eso se encarga una prueba, no una frase. */}
                  {/* Lo que la persona precisó al contar, **con sus palabras**
                      (ADR 0012). Lo que no dijo no aparece: un campo vacío es
                      información —nadie se lo preguntó o no lo sabía— y
                      rellenarlo con «sin dato» lo disfrazaría de omisión suya.

                      `desde_cuando` se muestra tal cual y no se convierte en
                      fecha: «hace tres meses» no es una fecha, y volverlo una
                      sería la inferencia que `I2` prohíbe. */}
                  {/* **Declarado, no verificado.** La especificación dice que
                      *«vocero exige verificar representación y destinatario
                      autorizado»*, y nadie verificó nada: lo dijo quien escribió.
                      Ponerlo sin ese aviso invitaría a tratarlo como probado, y
                      el colectivo ni siquiera existe como entidad todavía
                      (`Q23`). */}
                  {a.es_colectivo && (
                    <p className="bo-observation">
                      <strong>Dice hablar por un grupo:</strong>{" "}
                      <em>«{a.colectivo_declarado ?? "sin nombrarlo"}»</em>{" "}
                      <span className="bo-muted">· nadie verificó que lo represente</span>
                    </p>
                  )}
                  {/* Lo que precisó —dónde, a quiénes, desde cuándo— está
                      arriba, en la cabecera. Repetirlo aquí era la mitad del
                      muro de texto. */}
                </section>

                {(sint?.length ?? 0) > 0 && (
                  <section className="bo-synthesis" data-prueba="sintesis">
                    <h2>Lo que entendimos</h2>
                    {/* **Solo la vigente, y en sus partes.** Se imprimían las
                        dos, tres o cuatro versiones enteras, una detrás de
                        otra, y como cada vuelta confirma la suya, todas decían
                        «la confirmó la persona»: el revisor no sabía cuál
                        manda. Eso —más el texto corrido de un campo que en
                        realidad son dos— es lo que hacía que la ficha se leyera
                        como una transcripción.

                        Las anteriores no se borran: se pliegan. Sirven para ver
                        qué cambió, no para leerlas como el dato. */}
                    <span className="bo-badge" data-state={vigente!.confirmada_en ? "validated" : "draft"}>
                      v{vigente!.version} · {vigente!.clase}
                      {vigente!.confirmada_en ? " · la confirmó la persona" : " · sin confirmar"}
                    </span>
                    <dl className="bo-context-grid">
                      {enPartes(vigente!.texto).map(([etiqueta, valor]) => (
                        <Fragment key={etiqueta}>
                          <dt className="bo-small">{etiqueta}</dt>
                          <dd>{valor}</dd>
                        </Fragment>
                      ))}
                    </dl>
                    <p className="bo-small">
                      Que la persona confirme <strong>no significa que los hechos estén
                      verificados</strong>.
                    </p>

                    {sint!.length > 1 && (
                      <details className="bo-plegable" data-prueba="versiones-anteriores">
                        <summary>Ver las {sint!.length - 1} versiones anteriores</summary>
                        <div className="bo-plegado">
                          {sint!.slice(0, -1).map((s) => (
                            <div key={s.version} className="bo-check">
                              <span className="bo-badge" data-state="draft">
                                v{s.version} · {s.clase} · sustituida por la v{vigente!.version}
                              </span>
                              <p style={{ whiteSpace: "pre-wrap" }}>{s.texto}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </section>
                )}

                {a.canal === "voz_transcrita" && (
                  <section className="bo-history-section" data-prueba="grabacion">
                    <h2>Lo contó hablando</h2>
                    {/* **El audio es el original** (ADR 0013). El texto de
                        arriba es la lectura de una máquina, y las máquinas se
                        equivocan con los nombres de veredas: en la primera
                        prueba «La Martinita» volvió como «La Martinica». */}
                    <p className="bo-small">
                      <strong>El original es la grabación</strong>, no el texto. Escúchala antes de
                      dar por buena una vereda, una cantidad o un «no».
                    </p>
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <audio controls preload="none" src={`/consola/audio/${aporteId}`} style={{ width: "100%" }} />

                    {transcripciones.length > 0 ? (
                      <dl className="bo-context-grid">
                        {transcripciones.map((v) => (
                          <div key={v.version}>
                            <dt className="bo-small">
                              v{v.version} · {v.autor.startsWith("modelo:")
                                ? <>la transcribió <code>{v.autor.replace("modelo:", "")}</code></>
                                : "la corrigió la persona"}
                            </dt>
                            <dd>{v.texto}{v.motivo && <span className="bo-small"> · {v.motivo}</span>}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="bo-observation">
                        No se pudo transcribir. <strong>El audio queda guardado.</strong>
                      </p>
                    )}
                  </section>
                )}

                {(enlace || a.evento_confirmado_id) && (
                  <section className="bo-history-section" data-prueba="contexto">
                    <h2>De dónde llegó</h2>
                    {/* `QR-03` obliga a distinguir tres cosas que la gente
                        mezcla. Juntarlas haría creer que quien escaneó el
                        afiche de A asistió a A. */}
                    <dl className="bo-context-grid">
                      {enlace && (
                        <div>
                          <dt className="bo-small">Enlace por el que entró</dt>
                          <dd>
                            <code>{enlace.id}</code> · pieza «{enlace.pieza}»
                            {tituloDe(enlace.encuentro_id) && <> · apuntaba a «{tituloDe(enlace.encuentro_id)}»</>}
                          </dd>
                        </div>
                      )}
                      <div>
                        <dt className="bo-small">Evento en el que dice participar</dt>
                        <dd>
                          {a.evento_confirmado_id
                            ? tituloDe(a.evento_confirmado_id) ?? "un encuentro que ya no está"
                            : <span className="bo-muted">ninguno</span>}
                          {" · "}<span className="bo-muted">{a.estado_contexto}</span>
                        </dd>
                      </div>
                      {a.utms_recibidas && (
                        <div>
                          <dt className="bo-small">Campaña que traía el enlace</dt>
                          <dd>
                            <code>{JSON.stringify(a.utms_recibidas)}</code>{" "}
                            <span className="bo-muted">· sin verificar</span>
                          </dd>
                        </div>
                      )}
                    </dl>
                    <p className="bo-small">
                      <strong>Abrir el enlace no prueba que estuvo en el evento.</strong>
                    </p>
                  </section>
                )}
              </div>

              <aside className="bo-inspector">
                <h2>Gestión</h2>
                {/* Que los cuatro estados se muevan por separado (`CAL-01`) es
                    una decisión nuestra, no algo que quien revisa tenga que
                    hacer. Y se veía raro: aquí solo salen tres, porque el de la
                    ubicación vive arriba. */}
                <p className="bo-small">
                  {enPalabras(a.estado_clasificacion)} · {enPalabras(a.estado_confirmacion)} ·
                  {" "}{enPalabras(a.estado_revision)}
                </p>

                {!exp ? (
                  <form action={accionCrearExpediente}>
                    <input type="hidden" name="aporteId" value={aporteId} />
                    <input type="hidden" name="procesoId" value={procesoId} />
                    <h3>Abrir expediente</h3>
                    {/* **Llega medio lleno con lo que la persona confirmó**
                        (`CLA-04`). Rellenar no es decidir: el expediente se abre
                        por un acto del revisor y queda a su nombre, con su
                        motivo. Lo propuesto se puede cambiar entero. */}
                    <Campo id="exp-descripcion" name="descripcion" etiqueta="La afectación, en una frase"
                           defaultValue={propuestaDeExpediente.descripcion} />
                    <Campo id="exp-cambio" name="cambioEsperado" etiqueta="Qué debería cambiar" opcional
                           defaultValue={propuestaDeExpediente.cambio} />
                    <Campo id="exp-motivo" name="motivo" etiqueta="Por qué se abre" />
                    <Campo id="exp-autor" name="autor" etiqueta="Tu nombre" opcional />
                    <button className="bo-button" data-variant="primary">Abrir</button>
                    <p className="bo-small">
                      <strong>Un expediente por afectación</strong>, aunque compartan tema o
                      municipio.
                    </p>
                  </form>
                ) : (
                  <>
                    <h3>Expediente</h3>
                    <p>{exp.descripcion}</p>
                    {exp.reabierto_en && (
                      <p className="bo-badge" data-state="clarify">
                        reabierto · la prioridad dejó de estar vigente
                      </p>
                    )}

                    <h3>Prioridad de examen</h3>
                    {prio ? (
                      <div className="bo-context-grid">
                        <p><strong>{prio.motivo}</strong></p>
                        <p className="bo-small">
                          afectación: {prio.afectacion ?? "—"} · urgencia: {prio.urgenciaReportada ?? "—"} ·
                          recurrencia: {prio.recurrencia ?? "—"} · competencia: {prio.competencia ?? "—"}
                        </p>
                        {prio.incertidumbre && <p className="bo-observation">Incertidumbre: {prio.incertidumbre}</p>}
                        <p className="bo-small">por {prio.autor}</p>
                      </div>
                    ) : (
                      <p className="bo-muted">Sin priorizar.</p>
                    )}

                    <details className="bo-plegable">
                    <summary>{prio ? "Cambiar la prioridad de examen" : "Registrar prioridad de examen"}</summary>
                    <div className="bo-plegado">
                    <form action={accionPriorizar}>
                      <input type="hidden" name="expedienteId" value={exp.id} />
                      <Campo id="pri-motivo" name="motivo" etiqueta="Por qué examinar esto primero"
                             ejemplo="afecta a menores y es una sola fuente de agua" />
                      {FACTORES.map(([n, etiqueta, ops]) => (
                        <Opciones key={n} id={`pri-${n}`} name={n} etiqueta={etiqueta} opcional>
                          <option value="">sin registrar</option>
                          {ops.map((o) => <option key={o} value={o}>{enPalabras(o)}</option>)}
                        </Opciones>
                      ))}
                      <Campo id="pri-incertidumbre" name="incertidumbre" etiqueta="Qué no sabemos" opcional />
                      <Campo id="pri-autor" name="autor" etiqueta="Tu nombre" opcional />
                      <button className="bo-button">Registrar prioridad</button>
                      {/* Por qué los factores van por separado y no hay
                          puntaje está junto a `FACTORES`, arriba. En pantalla
                          sobraba: quien revisa ve cuatro selectores sueltos y no
                          hay ningún número que sumar. Además decía «cinco». */}
                    </form>
                    </div>
                    </details>

                    {/* **Escalar: a dónde va esto y quién puede desagregarlo.**
                        Faltaba entero: la ficha sabía abrir el expediente y
                        priorizarlo, pero no sacarlo de aquí. Y un aporte que
                        describe una necesidad que no es una sola cosa lo parte
                        el equipo que conoce el territorio, no quien lo recibió.

                        Lo que se registra es un **hecho**, no un estado: remitir
                        no es haber atendido, y esta pantalla no mueve nada hacia
                        «resuelto». */}
                    <section data-prueba="escalar">
                      <h3>Escalar</h3>
                      {atencion && (
                        <p className="bo-small">
                          Estado de atención: <strong>{atencion.estado.replace(/_/g, " ")}</strong>
                          {" · "}{atencion.diasSinActuar} días sin actuar
                          {atencion.remisionPendiente && (
                            <> · <span className="bo-badge" data-state="clarify">remisión sin aceptar</span></>
                          )}
                        </p>
                      )}

                      {remisiones.map((r) => (
                        <div key={r.actuacionId} className="bo-check">
                          <span className="bo-badge" data-state={r.aceptadaEn ? "validated" : "clarify"}>
                            {r.aceptadaEn ? "recibida" : "pendiente de aceptación"}
                          </span>
                          <p>
                            <strong>{r.destino}</strong>
                            {r.motivo && <span className="bo-small"> · {r.motivo}</span>}
                            <span className="bo-small"> · por {r.autor}</span>
                          </p>
                          {!r.aceptadaEn && (
                            <form action={accionAceptarRemision} data-prueba="aceptar-remision">
                              <input type="hidden" name="actuacionId" value={r.actuacionId} />
                              <Campo id={`ace-${r.actuacionId}`} name="motivo"
                                     etiqueta="Quién confirmó que lo recibió"
                                     ejemplo="la secretaría lo radicó con el número 4471" />
                              <button className="bo-button">Confirmar recepción</button>
                            </form>
                          )}
                        </div>
                      ))}

                      <details className="bo-plegable" data-prueba="remitir">
                      <summary>{remisiones.length ? "Remitir a otra mesa" : "Remitir a una mesa o un equipo"}</summary>
                      <div className="bo-plegado">
                      <form action={accionRemitir}>
                        <input type="hidden" name="expedienteId" value={exp.id} />
                        <Campo id="rem-destino" name="destino" etiqueta="A qué mesa o equipo"
                               ejemplo="mesa técnica de agua del Huila / equipo de infraestructura educativa" />
                        <Campo id="rem-motivo" name="motivo" etiqueta="Por qué se escala"
                               ejemplo="necesita desagregarse: son tres necesidades en una" opcional />
                        <Campo id="rem-autor" name="autor" etiqueta="Tu nombre" opcional />
                        <button className="bo-button" data-variant="primary">Remitir</button>
                        <p className="bo-small">
                          <strong>Remitir no es haber atendido:</strong> queda pendiente hasta que
                          la mesa confirme que lo recibió.
                        </p>
                      </form>
                      </div>
                      </details>
                    </section>

                    {historia.length > 1 && (
                      <details className="bo-plegable">
                        <summary>Historia de la prioridad ({historia.length})</summary>
                        <div className="bo-plegado">
                          {historia.map((h) => (
                            <p key={h.id} className="bo-small">
                              {h.vigenteHasta ? "· " : "▸ "}{h.motivo} — {h.autor}
                            </p>
                          ))}
                        </div>
                      </details>
                    )}
                  </>
                )}
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
