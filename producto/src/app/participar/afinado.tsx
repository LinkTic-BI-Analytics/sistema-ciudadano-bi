"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  confirmarLectura, guardarPrecisiones, prepararLectura, confirmarMunicipio,
  listarDepartamentos, listarMunicipios, declararGrupo, aplicarContexto, type PasoAfinado,
} from "./acciones.ts";
import type { Candidato, Departamento } from "../../territorio/emparejar.ts";
import { guardarContexto, tomarContexto, tieneAlgo, type ContextoHeredado } from "../../captura/contexto.ts";
import { loQueFalta, COMO_SE_PREGUNTA, COMO_SE_RESUME, type Lectura, type Preguntable } from "../../captura/lectura.ts";

// La captura, después de la narrativa. **Sigue siendo capturar, no un trámite
// añadido** (ADR 0012).
//
// El negocio lo puso en una frase: *solo tendríamos una oportunidad de obtener
// la información*. Quien escribe aquí puede no volver nunca —no hay cuenta ni
// correo, `N05` lo prohíbe— y lo que no diga ahora no lo dice nadie después.
//
// De ahí las tres decisiones de esta pantalla:
//
//   1. No dice «enviado». Dice qué entendimos y sigue preguntando.
//   2. Pregunta **solo por lo que falta**. Si el relato ya lo dijo todo, esto
//      pasa casi en blanco; si contó poco, pide justo lo que su caso necesita
//      para poder revisarse.
//   3. Nunca retiene nada. El aporte se guardó en el primer clic y el código
//      está a la vista desde el primer momento: quien se vaya, se va con lo
//      suyo guardado.

const POR_VUELTA = 3;

function Error_({ paso }: { paso: PasoAfinado | null }) {
  if (!paso || paso.ok) return null;
  return <p className="pc-error" role="alert">{paso.error}</p>;
}

/**
 * De qué va este aporte, en todos los pasos que vienen después.
 *
 * Sin esto, quien corrige lo que entendimos ve desaparecer su texto y lo
 * siguiente que le sale son tres cajas vacías: no hay forma de saber si la
 * corrección se guardó ni de qué se está hablando ya.
 *
 * Y cuando contó varias cosas importa el doble: las preguntas que vienen —dónde,
 * a quiénes, desde cuándo— son de **uno** de los problemas, y sin decir cuál se
 * contestan de memoria.
 */
function SobreQue({ problema }: { problema: string }) {
  return (
    <p className="pc-note" data-prueba="sobre-que">
      Estamos hablando de: <strong>{problema}</strong>
    </p>
  );
}

/** El código, discreto mientras se afina. No es un «ya terminaste». */
function Guardado({ codigo }: { codigo: string }) {
  return (
    <p className="pc-help" data-prueba="guardado">
      Lo que contaste <strong>ya quedó guardado</strong>. Si te vas ahora, tu código es{" "}
      <strong data-prueba="codigo">{codigo}</strong>.
    </p>
  );
}

export function Afinado({ codigo }: { codigo: string }) {
  const [lect, setLect] = useState<Lectura | null>(null);
  const [leyendo, setLeyendo] = useState(true);
  const [paso, setPaso] = useState<
    "escoger" | "entendimos" | "heredado" | "falta" | "municipio"
    | "confirmar-residencia" | "voceria" | "listo"
  >("entendimos");
  // Lo que contó en el aporte anterior y puede valer también para este. Se le
  // enseña y ella dice si vale: heredarlo en silencio sería inferir.
  const [heredado, setHeredado] = useState<ContextoHeredado | null>(null);
  // Lo que se lleva al siguiente, si decide contar otra cosa.
  const [municipioPuesto, setMunicipioPuesto] = useState<Candidato | null>(null);
  const [grupoPuesto, setGrupoPuesto] = useState<string | null>(null);
  // Decidir el paso siguiente **después** de que el estado esté puesto. Hacerlo
  // dentro del clic leía la lectura vieja y volvía a preguntar lo que se acababa
  // de aplicar.
  const [rutear, setRutear] = useState(false);
  // Lo que contó y no es de lo que hablamos en este aporte. No se pierde: sigue
  // entero en su relato, y al final se le ofrece contarlo aparte.
  const [otros, setOtros] = useState<string[]>([]);
  const [grupo, setGrupo] = useState("");
  const [porGrupo, setPorGrupo] = useState(false);
  const [guardandoVoz, setGuardandoVoz] = useState(false);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [guardandoMun, setGuardandoMun] = useState(false);
  const [deptos, setDeptos] = useState<Departamento[]>([]);
  const [depto, setDepto] = useState("");
  const [delDepto, setDelDepto] = useState<Candidato[]>([]);
  const [filtro, setFiltro] = useState("");
  const [porResidencia, setPorResidencia] = useState(false);
  const [elegido, setElegido] = useState<Candidato | null>(null);
  // A qué vuelta se vuelve al salir del municipio. Se fija **al entrar**, porque
  // se puede llegar ahí desde dos sitios: desde «esto es lo que entendimos»
  // —cuando el municipio salió del relato y aún no se ha hecho ninguna vuelta— o
  // desde la vuelta que preguntó el lugar. Avanzar siempre `vuelta + 1` se
  // saltaba la primera vuelta entera en el primer caso.
  const [vueltaAlVolver, setVueltaAlVolver] = useState(0);
  const [vuelta, setVuelta] = useState(0);
  const [corrigiendo, setCorrigiendo] = useState(false);
  const [problema, setProblema] = useState("");

  const [r1, accion1, guardando1] = useActionState<PasoAfinado | null, FormData>(confirmarLectura, null);
  const [r2, accion2, guardando2] = useActionState<PasoAfinado | null, FormData>(guardarPrecisiones, null);

  // **Una sola vez.** `tomarContexto()` borra la llave al leerla, y React monta
  // dos veces en desarrollo: la segunda lectura devolvía vacío y pisaba la
  // primera. El contexto desaparecía sin que nada fallara.
  const contextoLeido = useRef(false);
  useEffect(() => {
    if (contextoLeido.current) return;
    contextoLeido.current = true;
    setHeredado(tomarContexto());
  }, []);

  useEffect(() => {
    if (!rutear) return;
    setRutear(false);
    if (lect?.lugar && !municipioPuesto) { setVueltaAlVolver(0); setPaso("municipio"); return; }
    setPaso(vueltas.length ? "falta" : "voceria");
    // `vueltas` sale de `lect`, y se quiere el valor recién puesto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rutear, lect, municipioPuesto]);

  useEffect(() => {
    let vigente = true;
    prepararLectura(codigo)
      .then((r) => {
        if (!vigente || !r) return;
        setLect(r.lectura);
        setProblema(r.lectura.problema);
        setCandidatos(r.municipios);
        repartir(r.lectura, r.municipios.length > 0);
        // Si contó varias cosas, lo primero es escoger de cuál hablamos: todo lo
        // que viene después —el lugar, a quiénes, la prioridad— es de **un**
        // problema, y mezclarlos hace que ninguno se pueda atender.
        if (r.lectura.otrosProblemas.length > 0) {
          setOtros(r.lectura.otrosProblemas);
          setPaso("escoger");
        }
      })
      .finally(() => { if (vigente) setLeyendo(false); });
    return () => { vigente = false; };
  }, [codigo]);

  // Lo que falta, repartido en vueltas de tres. Si no falta nada, no hay vueltas
  // y la persona pasa directo al final: preguntarle por lo que ya dijo sería
  // castigarla por haberlo contado bien.
  //
  // **Se fijan una vez y no se recalculan a mitad.** Al guardar lo que escribe,
  // esas partes dejan de faltar; si las vueltas se recalcularan, el reparto
  // cambiaría bajo sus pies y el paso 3 de 5 pasaría a no existir. Solo se
  // rehacen cuando de verdad cambia lo que hay que preguntar: al llegar la
  // lectura, y al aceptar el contexto del aporte anterior.
  const [vueltas, setVueltas] = useState<Preguntable[][]>([]);

  function repartir(l: Lectura, hayCandidatos: boolean) {
    const faltan = loQueFalta(l).filter((k) => !(k === "lugar" && hayCandidatos));
    const trozos: Preguntable[][] = [];
    for (let i = 0; i < faltan.length; i += POR_VUELTA) trozos.push(faltan.slice(i, i + POR_VUELTA));
    setVueltas(trozos);
    return trozos;
  }

  // Los 33 departamentos, al entrar al paso del municipio. No antes: la mayoría
  // de la gente nombra su municipio al contar y nunca llega aquí.
  useEffect(() => {
    if (paso === "municipio" && deptos.length === 0) listarDepartamentos().then(setDeptos);
  }, [paso, deptos.length]);

  useEffect(() => {
    if (!r1?.ok) return;
    // **Si ya dijo dónde, el paso del municipio va aquí**, haya candidatos o no.
    // Que la IA encontrara un lugar no significa que sea ubicable: «la vereda
    // está intransitable» es un lugar en la frase y no lleva a ningún
    // municipio. Dábamos la ubicación por contestada y no volvíamos a
    // preguntar — el mismo agujero que «en mi casa», por otro camino.
    //
    // Si no dijo dónde, la pregunta va en su vuelta y el municipio viene detrás.
    if (tieneAlgo(heredado)) { setPaso("heredado"); return; }
    if (lect?.lugar) { setVueltaAlVolver(0); setPaso("municipio"); return; }
    setPaso(vueltas.length ? "falta" : "voceria");
  }, [r1]);
  useEffect(() => {
    if (!r2?.ok) return;
    // Lo que acaba de escribir pasa a ser lo que la pantalla sabe: si no, al
    // ofrecerle el contexto para su segundo problema solo tendríamos lo que
    // leyó la IA.
    if (r2.precisado) {
      const p = r2.precisado;
      setLect((l) => l && {
        ...l,
        lugar: p.lugar ?? l.lugar,
        afectados: p.afectados ?? l.afectados,
        desdeCuando: p.desdeCuando ?? l.desdeCuando,
      });
    }
    // Si nombró un sitio y DIVIPOLA encontró candidatos, se le enseñan antes de
    // seguir: es el único momento en que está la persona que de verdad lo sabe.
    // **El municipio se pregunta siempre que se haya preguntado el lugar**, haya
    // candidatos o no. Que la persona escriba «en mi casa» no es una respuesta:
    // es un sitio que solo ella puede encontrar, y un problema que no se puede
    // asociar a un territorio no se puede sumar a ningún lado.
    if (vueltas[vuelta]?.includes("lugar")) {
      setCandidatos(r2.municipios ?? []);
      setVueltaAlVolver(vuelta + 1);
      setPaso("municipio");
      return;
    }
    setVuelta((v) => {
      const siguiente = v + 1;
      if (siguiente >= vueltas.length) setPaso("voceria");
      return siguiente;
    });
  }, [r2]);

  const sinTildes = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Nadie escribe «ABRIAQUÍ» con tilde ni en mayúsculas.
  const filtrados = filtro.trim()
    ? delDepto.filter((m) => sinTildes(m.nombre).includes(sinTildes(filtro.trim())))
    : delDepto;

  async function escogerDepartamento(codigo: string) {
    setDepto(codigo);
    setDelDepto([]);
    setFiltro("");
    if (codigo) setDelDepto(await listarMunicipios(codigo));
  }

  /**
   * Lo único que escribe el municipio. Escoger de la lista solo **propone**.
   *
   * Si viene de dónde vive la persona, todavía falta lo que `GEO-01` exige:
   * que confirme que el problema ocurre ahí, que no siempre es lo mismo.
   */
  async function confirmarElegido() {
    if (!elegido) return;
    if (porResidencia) { setPaso("confirmar-residencia"); return; }
    setGuardandoMun(true);
    await confirmarMunicipio(codigo, elegido.codigo, elegido.version, "lo_dijo");
    setMunicipioPuesto(elegido);
    setGuardandoMun(false);
    seguirDespuesDelMunicipio();
  }

  // Al salir del municipio se sigue donde iba, sin repetir la vuelta.
  function seguirDespuesDelMunicipio() {
    setCandidatos([]);
    setDepto(""); setDelDepto([]); setFiltro(""); setPorResidencia(false); setElegido(null);
    setVuelta(vueltaAlVolver);
    setPaso(vueltaAlVolver >= vueltas.length ? "voceria" : "falta");
  }

  if (leyendo) {
    return (
      <section className="pc-section" data-prueba="afinar">
        {/* **El código sale ya, antes de leer nada.** Lo tenía detrás de la
            lectura, y eso contradecía el ADR 0012: el aporte se guarda en el
            primer clic y el comprobante es lo único que la persona necesita de
            nosotros. Si el servidor tardaba, se quedaba esperando sin él.

            Lo encontró una prueba fallando de forma intermitente. Parecía un
            problema de tiempos y era de orden. */}
        <Guardado codigo={codigo} />
        <p className="pc-help" data-prueba="leyendo" aria-live="polite">Leyendo lo que contaste…</p>
      </section>
    );
  }

  if (!lect) {
    // La lectura no salió. No se pierde nada: el aporte está guardado y el
    // código es lo único que la persona necesita de nosotros.
    return (
      <section className="pc-section" data-prueba="afinar">
        <h2>Recibimos lo que nos contaste</h2>
        <p className="pc-status" data-prueba="codigo" style={{ fontSize: "1.5rem", letterSpacing: "0.1em" }}>
          {codigo}
        </p>
        <p className="pc-help">Guárdalo. Con él puedes volver a ver tu aporte, sin correo ni cuenta.</p>
        <a className="pc-action" href="/mis-aportes">Consultar mi aporte</a>
      </section>
    );
  }

  if (paso === "voceria") {
    return (
      <section className="pc-section" data-prueba="voceria">
        <p className="pc-help" aria-live="polite">Última pregunta</p>
        <Guardado codigo={codigo} />
        <h2>¿Hablas por ti o por un grupo?</h2>
        {!porGrupo ? (
          <>
            <p className="pc-help">
              Muchos aportes salen de una junta de acción comunal, un cabildo, una asociación o
              una mesa de trabajo. Saberlo cambia a quién hay que responderle.
            </p>
            <div className="pc-actions">
              <button type="button" className="pc-action" onClick={() => setPaso("listo")}>
                Hablo por mí
              </button>
              <button type="button" className="pc-text-action" onClick={() => setPorGrupo(true)}>
                Hablo por un grupo
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="pc-field">
              <label className="pc-label" htmlFor="grupo">¿Qué grupo?</label>
              <input id="grupo" className="pc-input" type="text" value={grupo}
                     onChange={(e) => setGrupo(e.target.value)}
                     aria-describedby="grupo-ayuda" />
              <p className="pc-help" id="grupo-ayuda">
                Como se llame: «la junta de acción comunal de la vereda El Salado», «la mesa de
                mujeres del barrio». <strong>Quedará escrito que lo dices tú</strong>: no lo
                verificamos con nadie, y el aporte queda a nombre del grupo, no del tuyo.
              </p>
            </div>
            <div className="pc-actions">
              <button type="button" className="pc-action" disabled={guardandoVoz || !grupo.trim()}
                      onClick={async () => {
                        setGuardandoVoz(true);
                        await declararGrupo(codigo, grupo);
                        setGrupoPuesto(grupo);
                        setGuardandoVoz(false);
                        setPaso("listo");
                      }}>
                {guardandoVoz ? "Guardando…" : "Listo"}
              </button>
              <button type="button" className="pc-text-action" onClick={() => setPaso("listo")}>
                Mejor no
              </button>
            </div>
          </>
        )}
      </section>
    );
  }

  if (paso === "listo") {
    return (
      <>
        <section className="pc-section" data-prueba="afinado-listo" aria-live="polite">
          <h2>Listo. Quedó registrado con tus palabras</h2>
          {/* `.pc-success` es un estilo de texto, no una caja: va en la frase
              que da la buena noticia y en nada más. Puesto en la sección teñía
              de verde y agrandaba todo lo de dentro, avisos incluidos. */}
          <p className="pc-success">Guarda este código.</p>
          <p className="pc-key" data-prueba="codigo">{codigo}</p>
          <p className="pc-help">
            Con él vuelves a ver tu aporte y qué pasó con él, <strong>sin dar correo ni crear una
            cuenta</strong>. Anótalo o tómale una foto: no te lo podemos volver a mostrar, porque
            en nuestro sistema solo queda una huella del código, no el código.
          </p>
          <p className="pc-note">
            Esto no significa que el problema esté resuelto ni que haya un compromiso de obra.
            Significa que quedó registrado y que alguien lo va a revisar.
          </p>
          <div className="pc-actions">
            <a className="pc-action" href="/mis-aportes">Consultar mi aporte</a>
          </div>
        </section>

        {otros.length > 0 && (
          // Sección aparte, no pegada debajo del comprobante: son dos cosas
          // distintas —tu aporte quedó / y además nos contaste esto— y juntas se
          // leían como una sola lista de botones azules compitiendo.
          <section className="pc-section" data-prueba="pendientes">
            <h2>También nos contaste esto</h2>
            <p className="pc-help">
              Queda guardado en tu relato, pero <strong>como aporte aparte se puede atender
              aparte</strong>: va a otra entidad y sigue su propio camino.
            </p>
            <div className="pc-actions">
              {otros.map((x) => (
                <button key={x} type="button" className="pc-action" data-variant="secondary"
                        onClick={() => {
                          // Se lleva también lo que ya contó: quien cuenta dos
                          // cosas vive en el mismo sitio y le pasan a la misma
                          // gente. Volver a preguntárselo todo es lo que hace
                          // que abandone en el segundo — y entonces la segunda
                          // necesidad se pierde.
                          guardarContexto(x, {
                            lugarDeclarado: lect?.lugar ?? null,
                            municipio: municipioPuesto,
                            afectados: lect?.afectados ?? null,
                            desdeCuando: lect?.desdeCuando ?? null,
                            colectivo: grupoPuesto,
                          });
                          location.href = "/participar";
                        }}>
                  Contar: {x}
                </button>
              ))}
            </div>
          </section>
        )}
      </>
    );
  }

  const total = 3 + vueltas.length + (candidatos.length ? 1 : 0) + (paso === "escoger" ? 1 : 0);
  const actual = paso === "entendimos" ? 2 : paso === "municipio" ? 2 + vuelta + 2 : 2 + vuelta + 1;

  return (
    <section className="pc-section" data-prueba="afinar">
      {/* Decir cuánto falta es lo que impide que alguien abandone creyendo que
          esto no se acaba nunca. */}
      <p className="pc-help" aria-live="polite">Paso {actual} de {total}</p>
      <Guardado codigo={codigo} />
      {paso !== "entendimos" && paso !== "escoger" && <SobreQue problema={problema} />}

      {paso === "escoger" && lect && (
        <div data-prueba="escoger">
          <h2>Nos contaste {otros.length + 1} cosas</h2>
          <p className="pc-help">
            Cada una va a una entidad distinta y se atiende por separado, así que{" "}
            <strong>vamos de a una</strong>. ¿Por cuál empezamos?
          </p>
          <div className="pc-actions">
            {[problema, ...otros].map((x) => (
              <button key={x} type="button" className="pc-action"
                      onClick={() => {
                        const todas = [problema, ...otros];
                        setProblema(x);
                        setOtros(todas.filter((y) => y !== x));
                        setPaso("entendimos");
                      }}>
                {x}
              </button>
            ))}
          </div>
          <button type="button" className="pc-text-action"
                  onClick={() => { setOtros([]); setPaso("entendimos"); }}>
            En realidad es una sola cosa
          </button>
          {/* Que no se pierde nada es lo primero que hay que decir: si no,
              escoger se siente como que le estamos borrando lo demás. */}
          <p className="pc-help">
            <strong>No se pierde nada.</strong> Todo lo que escribiste queda guardado tal cual, y
            al final te ofrecemos contar las otras.
          </p>
        </div>
      )}

      {paso === "entendimos" && (
        <div data-prueba="vuelta-1">
          <h2>Esto es lo que entendimos</h2>

          {!corrigiendo ? (
            <>
              {/* Se le devuelve **lo que dijo**, no una interpretación. La
                  pantalla no dice «creemos entender»: dice esto es lo que nos
                  contaste, porque eso es exactamente lo que hay. */}
              {/* **Un solo bloque.** El relato y lo que entendimos estaban en
                  dos cajas grises separadas por un hueco, y se leían como dos
                  cosas sin relación. Son lo mismo: lo que contaste, partido. */}
              {/* `dt` y `dd` como **hijos directos**. Envueltos en un `div`,
                  todos los `dt` pasaban a ser `:first-child` y la hoja les
                  quitaba el margen de arriba: la respuesta de una pregunta
                  quedaba pegada al título de la siguiente. */}
              <dl className="pc-detail-facts">
                <dt>{COMO_SE_RESUME.problema}</dt>
                <dd>{problema}</dd>
                {(["lugar", "afectados", "desdeCuando", "resultadoEsperado", "solucionSugerida"] as const)
                  .filter((k) => lect[k])
                  .flatMap((k) => [
                    <dt key={`t-${k}`}>{COMO_SE_RESUME[k]}</dt>,
                    <dd key={`d-${k}`}>{lect[k]}</dd>,
                  ])}
              </dl>
              <p className="pc-help">Si no es eso, corrígelo — mandas tú.</p>
              <Error_ paso={r1} />
              {/* Los dos en el mismo grupo. Estaban en cajas distintas —uno
                  dentro del formulario y otro fuera— y salían desalineados y de
                  tamaños distintos. `.pc-actions` es lo que el sistema de diseño
                  tiene para una decisión con dos salidas. */}
              <form action={accion1} className="pc-actions">
                <input type="hidden" name="codigo" value={codigo} readOnly />
                <input type="hidden" name="corrigio" value="no" readOnly />
                <input type="hidden" name="mostrado" value={problema} readOnly />
                <button type="submit" className="pc-action" disabled={guardando1}>
                  {guardando1 ? "Guardando…" : "Sí, es eso"}
                </button>
                <button type="button" className="pc-text-action" onClick={() => setCorrigiendo(true)}>
                  No es eso — déjame corregirlo
                </button>
              </form>
            </>
          ) : (
            <form action={accion1}>
              <input type="hidden" name="codigo" value={codigo} readOnly />
              <input type="hidden" name="corrigio" value="si" readOnly />
              <input type="hidden" name="mostrado" value={lect.problema} readOnly />
              <div className="pc-field">
                <label className="pc-label" htmlFor="problema-correccion">
                  Escríbelo con tus palabras
                </label>
                {/* **Llega con lo que ya había escrito, no en blanco.** La
                    especificación lo pide literal —«conservar texto ya
                    escrito»— y vaciarlo castiga justamente a quien se tomó el
                    trabajo de corregirnos. */}
                <textarea id="problema-correccion" name="problema" className="pc-input" rows={4}
                          defaultValue={problema}
                          onChange={(e) => setProblema(e.target.value)} />
              </div>
              <Error_ paso={r1} />
              <button type="submit" className="pc-action" disabled={guardando1}>
                {guardando1 ? "Guardando…" : "Guardar y seguir"}
              </button>
            </form>
          )}
        </div>
      )}

      {paso === "municipio" && !elegido && (
        <div data-prueba="municipio">
          {candidatos.length > 0 ? (
            <>
              <h2>{candidatos.length === 1 ? "¿Es aquí?" : "¿Cuál de estos es?"}</h2>
              <p className="pc-help">
                Lo buscamos en el listado oficial de municipios del DANE por lo que escribiste.
                {candidatos.length > 1 && <> Hay más de uno con ese nombre, <strong>y solo tú sabes cuál es</strong>.</>}
              </p>
              <div className="pc-actions">
                {candidatos.map((c) => (
                  <button key={c.codigo} type="button" className="pc-action" disabled={guardandoMun}
                          onClick={() => setElegido(c)}>
                    {c.nombre}, {c.departamento}
                  </button>
                ))}
              </div>
              <button type="button" className="pc-text-action" onClick={() => { setCandidatos([]); setDepto(""); }}>
                Ninguno de estos
              </button>
            </>
          ) : (
            <>
              {/* **Aquí está el arreglo.** Antes, si lo que escribió no llegaba a
                  un municipio, la pregunta se daba por contestada y seguíamos.
                  «En mi casa» pasaba de largo, y el aporte llegaba a la bandeja
                  sin territorio al que sumarlo — que es como no tenerlo.

                  Ahora se insiste, se le explica para qué sirve, y se le da una
                  segunda vía: dónde vive. Salir sigue siendo posible: `N02` pide
                  aceptar ubicación incompleta, y exigirla excluiría justo a quien
                  menos puede precisarla. */}
              <h2>{porResidencia ? "¿Dónde vives?" : "¿Dónde queda?"}</h2>
              <p className="pc-help">
                {porResidencia ? (
                  <>Sirve para acercarnos. Después te preguntamos si el problema ocurre ahí mismo.</>
                ) : (
                  <>
                    Sin municipio, tu aporte <strong>no se puede sumar al de tus vecinos</strong> ni
                    llegar a quien responde por ese territorio.
                  </>
                )}
              </p>

              {/* **De lo macro a lo micro, y con buscador.** Escoger primero
                  el departamento baja la lista de 1.122 a 125 como mucho y
                  quita los nombres repetidos. Pero 125 en un desplegable siguen
                  siendo imposibles de recorrer, así que se filtran escribiendo.

                  Y **no avanza solo**. Escoger era irreversible: un toque en el
                  municipio equivocado y la persona ya no podía corregirlo.
                  Ahora dice cuál entendió y espera. */}
              <div className="pc-field">
                <label className="pc-label" htmlFor="departamento">Departamento</label>
                <select id="departamento" className="pc-input" value={depto}
                        onChange={(e) => escogerDepartamento(e.target.value)}>
                  <option value="">Escoge uno…</option>
                  {deptos.map((d) => <option key={d.codigo} value={d.codigo}>{d.nombre}</option>)}
                </select>
              </div>

              {depto && (
                <div className="pc-field">
                  <label className="pc-label" htmlFor="filtro-municipio">Municipio</label>
                  <input id="filtro-municipio" className="pc-input" type="text" value={filtro}
                         onChange={(e) => setFiltro(e.target.value)}
                         aria-describedby="filtro-ayuda" />
                  <p className="pc-help" id="filtro-ayuda">
                    {delDepto.length
                      ? `Escribe las primeras letras. Hay ${delDepto.length} en ${deptos.find((d) => d.codigo === depto)?.nombre ?? "este departamento"}.`
                      : "Cargando…"}
                  </p>
                  <div className="pc-actions">
                    {filtrados.slice(0, 8).map((m) => (
                      <button key={m.codigo} type="button" className="pc-action"
                              onClick={() => setElegido(m)}>
                        {m.nombre}
                      </button>
                    ))}
                  </div>
                  {filtro.trim() && filtrados.length === 0 && (
                    <p className="pc-note">Ninguno se llama así en ese departamento.</p>
                  )}
                  {!filtro.trim() && delDepto.length > 8 && (
                    <p className="pc-help">
                      Mostrando los primeros 8 de {delDepto.length}. Escribe para encontrar el tuyo.
                    </p>
                  )}
                </div>
              )}

              {!porResidencia ? (
                <button type="button" className="pc-text-action"
                        onClick={() => { setPorResidencia(true); setDepto(""); setDelDepto([]); }}>
                  No sé en qué municipio queda
                </button>
              ) : (
                <button type="button" className="pc-text-action" onClick={seguirDespuesDelMunicipio}>
                  Prefiero no decirlo
                </button>
              )}
              <p className="pc-help">
                Lo que escribiste se guarda igual, tal como lo escribiste. Si no llegamos al
                municipio, alguien lo revisa a mano — <strong>no lo vamos a suponer</strong>.
              </p>
            </>
          )}
        </div>
      )}

      {paso === "municipio" && elegido && (
        <div data-prueba="confirmar-municipio">
          {/* **Nada se guarda hasta aquí.** Antes, tocar un municipio lo
              confirmaba y pasaba de largo: quien se equivocaba de fila no tenía
              cómo volver. Un municipio equivocado es peor que ninguno, porque
              parece un dato. */}
          <h2>¿Es {elegido.nombre}, {elegido.departamento}?</h2>
          <div className="pc-actions">
            <button type="button" className="pc-action" disabled={guardandoMun}
                    onClick={() => confirmarElegido()}>
              {guardandoMun ? "Guardando…" : "Sí, es ahí"}
            </button>
            <button type="button" className="pc-text-action" onClick={() => setElegido(null)}>
              No, cambiar
            </button>
          </div>
        </div>
      )}

      {paso === "confirmar-residencia" && elegido && (
        <div data-prueba="confirmar-residencia">
          <h2>¿El problema ocurre en {elegido.nombre}?</h2>
          {/* `GEO-01`: **una dirección residencial no es el lugar del problema
              sin confirmación.** Preguntar dónde vive acerca, pero dar por hecho
              que el problema ocurre ahí es el error que esa regla nombra. */}
          <p className="pc-help">
            Nos dijiste que vives ahí. Lo que necesitamos saber es dónde <strong>ocurre el
            problema</strong>, que no siempre es lo mismo.
          </p>
          <div className="pc-actions">
            <button type="button" className="pc-action" disabled={guardandoMun}
                    onClick={async () => {
                      setGuardandoMun(true);
                      await confirmarMunicipio(codigo, elegido.codigo, elegido.version, "vive_ahi");
                      setGuardandoMun(false);
                      seguirDespuesDelMunicipio();
                    }}>
              Sí, ocurre ahí
            </button>
          </div>
          <button type="button" className="pc-text-action"
                  onClick={() => { setElegido(null); setPaso("municipio"); }}>
            No, ocurre en otra parte
          </button>
        </div>
      )}

      {paso === "heredado" && heredado && (
        <div data-prueba="heredado">
          <h2>¿Esto también es así?</h2>
          <p className="pc-help">
            Es lo que nos contaste hace un momento. Si vale igual para esto,{" "}
            <strong>no hace falta que lo repitas</strong>.
          </p>
          <dl className="pc-detail-facts">
            {heredado.municipio && (<><dt>Dónde ocurre</dt>
              <dd>{heredado.municipio.nombre}, {heredado.municipio.departamento}</dd></>)}
            {heredado.lugarDeclarado && (<><dt>Con tus palabras</dt><dd>{heredado.lugarDeclarado}</dd></>)}
            {heredado.afectados && (<><dt>A quiénes les pasa</dt><dd>{heredado.afectados}</dd></>)}
            {heredado.desdeCuando && (<><dt>Desde cuándo</dt><dd>{heredado.desdeCuando}</dd></>)}
            {heredado.colectivo && (<><dt>Hablas por</dt><dd>{heredado.colectivo}</dd></>)}
          </dl>
          <Error_ paso={r2} />
          <div className="pc-actions">
            <button type="button" className="pc-action" disabled={guardandoMun}
                    onClick={async () => {
                      setGuardandoMun(true);
                      await aplicarContexto(codigo, heredado);
                      setGuardandoMun(false);
                      // Lo aplicado deja de faltar, así que no se vuelve a preguntar.
                      if (lect) {
                        const nueva = {
                          ...lect,
                          lugar: heredado.lugarDeclarado ?? lect.lugar,
                          afectados: heredado.afectados ?? lect.afectados,
                          desdeCuando: heredado.desdeCuando ?? lect.desdeCuando,
                        };
                        setLect(nueva);
                        repartir(nueva, Boolean(heredado.municipio));
                      }
                      setMunicipioPuesto(heredado.municipio);
                      setGrupoPuesto(heredado.colectivo);
                      setHeredado(null);
                      setRutear(true);
                    }}>
              {guardandoMun ? "Guardando…" : "Sí, es igual"}
            </button>
            <button type="button" className="pc-text-action"
                    onClick={() => { setHeredado(null); setRutear(true); }}>
              No, esto es distinto
            </button>
          </div>
          {/* **No se hereda: se propone.** `I2` prohíbe inferir la ubicación, y
              dar por hecho que el segundo problema ocurre donde el primero sería
              justo eso: alguien puede contar lo del agua de su casa y lo de la
              vía del colegio, que está en otro municipio. */}
          <p className="pc-help">
            Si no es igual, te lo preguntamos como si fuera la primera vez.
          </p>
        </div>
      )}

      {paso === "falta" && vueltas[vuelta] && (
        <div data-prueba={`vuelta-${vuelta + 2}`}>
          <h2>{vuelta === 0 ? "Nos falta poco" : "Y lo último"}</h2>
          <p className="pc-help">
            Esto no lo encontramos en lo que contaste. <strong>Lo que no sepas, déjalo en
            blanco</strong> — no vamos a suponerlo.
          </p>
          <form action={accion2} key={vuelta}>
            <input type="hidden" name="codigo" value={codigo} readOnly />
            <input type="hidden" name="problema" value={problema} readOnly />
            {vueltas[vuelta].map((k) => (
              <div className="pc-field" key={k}>
                <label className="pc-label" htmlFor={k}>{COMO_SE_PREGUNTA[k].etiqueta}</label>
                <input id={k} name={k} className="pc-input" type="text" aria-describedby={`${k}-ayuda`} />
                <p className="pc-help" id={`${k}-ayuda`}>{COMO_SE_PREGUNTA[k].ayuda}</p>
              </div>
            ))}
            <Error_ paso={r2} />
            <button type="submit" className="pc-action" disabled={guardando2}>
              {guardando2 ? "Guardando…" : vuelta + 1 >= vueltas.length ? "Listo" : "Continuar"}
            </button>
            <button type="button" className="pc-text-action" onClick={() => setPaso("voceria")}>
              Terminar aquí
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
