"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  confirmarLectura, guardarPrecisiones, prepararLectura, confirmarMunicipio,
  listarDepartamentos, listarMunicipios, declararGrupo, aplicarContexto, anotarLugar, ubicarTexto,
  type PasoAfinado,
} from "./acciones.ts";
import type { Candidato, Departamento } from "../../territorio/emparejar.ts";
import { guardarContexto, tomarContexto, tieneAlgo, type ContextoHeredado } from "../../captura/contexto.ts";
import { loQueFalta, COMO_SE_PREGUNTA, COMO_SE_RESUME, PREGUNTABLES, TEMAS, type Lectura, type Preguntable, type Tema } from "../../captura/lectura.ts";
import { Progreso } from "./progreso.tsx";
import { Comprobante } from "./comprobante.tsx";
import { IconoGrupo, IconoIdea } from "../../producto/iconos.tsx";

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
  // El tema que la persona confirma. Lo propuesto vive en `lect.tema`.
  const [tema, setTema] = useState<Tema | null>(null);
  // Decidir el paso siguiente **después** de que el estado esté puesto. Hacerlo
  // dentro del clic leía la lectura vieja y volvía a preguntar lo que se acababa
  // de aplicar.
  const [rutear, setRutear] = useState(false);
  // **Si ya se pasó por el municipio.** Es la red de seguridad: ningún camino
  // llega al final sin haber preguntado dónde, salvo que ya esté resuelto.
  const [municipioVisto, setMunicipioVisto] = useState(false);
  // Lo que contó y no es de lo que hablamos en este aporte. No se pierde: sigue
  // entero en su relato, y al final se le ofrece contarlo aparte.
  const [otros, setOtros] = useState<string[]>([]);
  // Que hubo que escoger entre varias cosas no deja de ser cierto cuando la
  // persona las junta en una: el paso existió y cuenta.
  const [huboEscoger, setHuboEscoger] = useState(false);
  const [grupo, setGrupo] = useState("");
  const [porGrupo, setPorGrupo] = useState(false);
  const [guardandoVoz, setGuardandoVoz] = useState(false);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [guardandoMun, setGuardandoMun] = useState(false);
  const [deptos, setDeptos] = useState<Departamento[]>([]);
  const [depto, setDepto] = useState("");
  const [delDepto, setDelDepto] = useState<Candidato[]>([]);
  const [filtro, setFiltro] = useState("");
  // Lo detectado en lo que la persona escribió: **no se resuelve solo, pero
  // tampoco se tira**. Arrancar el selector en blanco después de que alguien
  // acaba de escribir dónde vive pierde el rastro y le hace repetirlo.
  const [detectado, setDetectado] = useState<Departamento | null>(null);
  // «Con tus palabras»: el barrio, la vereda, la referencia. Va en la misma
  // pantalla que el municipio y no en una vuelta aparte.
  const [conSusPalabras, setConSusPalabras] = useState("");
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
    if (!municipioPuesto) { setVueltaAlVolver(0); setPaso("municipio"); return; }
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
        setDetectado(r.departamento);
        setConSusPalabras(r.lectura.lugar ?? "");
        repartir(r.lectura);
        // Si contó varias cosas, lo primero es escoger de cuál hablamos: todo lo
        // que viene después —el lugar, a quiénes, la prioridad— es de **un**
        // problema, y mezclarlos hace que ninguno se pueda atender.
        if (r.lectura.otrosProblemas.length > 0) {
          setOtros(r.lectura.otrosProblemas);
          setHuboEscoger(true);
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

  function repartir(l: Lectura) {
    // **El lugar nunca va en una vuelta.** Se preguntaba dos veces: primero
    // «¿dónde ocurre?» en texto libre y después departamento y municipio. Para
    // alguien de una vereda dispersa, que ya escribió dónde vive, la segunda
    // pregunta es la misma pregunta — y es la pantalla donde más se abandona.
    //
    // Ahora el paso del municipio las junta: departamento, municipio y «con tus
    // palabras» en la misma pantalla. `GEO-01` sigue cumpliéndose, porque el
    // texto declarado se conserva igual: lo que cambia es que se pide una vez.
    const faltan = loQueFalta(l).filter((k) => k !== "lugar");
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

  // **Lo que escribe con sus palabras busca solo.** Es lo que hace que la
  // pregunta pueda ser una: escribe «la vereda La Martinita, Rionegro Antioquia»
  // y debajo aparecen el municipio y el departamento. Antes esa ayuda solo
  // existía si el municipio venía en el relato.
  //
  // Espera a que deje de escribir: buscar en cada tecla manda una consulta por
  // letra y hace parpadear la lista mientras la persona todavía está pensando.
  const ultimoBuscado = useRef("");
  useEffect(() => {
    if (paso !== "municipio" || porResidencia || elegido) return;
    const dicho = conSusPalabras.trim();
    if (dicho === ultimoBuscado.current) return;
    const t = setTimeout(async () => {
      ultimoBuscado.current = dicho;
      const r = await ubicarTexto(dicho);
      setCandidatos(r.municipios);
      // El departamento detectado se pone solo si ella no ha escogido ninguno:
      // pisarle su elección con lo que leímos sería decidir por ella.
      if (r.departamento && !depto) setDetectado(r.departamento);
    }, 600);
    return () => clearTimeout(t);
  }, [conSusPalabras, paso, porResidencia, elegido, depto]);

  // El departamento que la persona nombró llega puesto, con sus municipios
  // cargados. Es lo que convierte «escoge entre 1.122» en «confirma el tuyo».
  useEffect(() => {
    if (paso !== "municipio" || !detectado || depto) return;
    void escogerDepartamento(detectado.codigo);
  }, [paso, detectado, depto]);

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
    // **Con candidatos también.** Antes esto decía solo `lect?.lugar`, y con un
    // relato como «las canchas de tunja boyaca están rotas» la lectura no traía
    // lugar pero sí había candidatos — así que se quitaba «dónde» de las
    // preguntas *y* se saltaba el paso de confirmarlo. A esa persona no se le
    // preguntó nada de ubicación, con Tunja escrito en su primera línea.
    // El lugar se pregunta siempre y **siempre aquí**: es el primer paso
    // después de confirmar lo que entendimos, y el único que lo pregunta.
    setVueltaAlVolver(0);
    setPaso("municipio");
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
        resultadoEsperado: p.resultadoEsperado ?? l.resultadoEsperado,
        solucionSugerida: p.solucionSugerida ?? l.solucionSugerida,
      });
    }
    // Aquí ya no se ramifica por el lugar: para cuando la persona llega a las
    // vueltas, el municipio ya se preguntó. Antes esta rama mandaba de vuelta al
    // selector a mitad de las vueltas, y era la segunda vez que se le preguntaba
    // dónde ocurre lo mismo.
    setVuelta((v) => {
      const siguiente = v + 1;
      if (siguiente >= vueltas.length) setPaso(haciaElFinal());
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
    await confirmarMunicipio(codigo, elegido.codigo, elegido.version, "lo_dijo", municipioPuesto !== null);
    setMunicipioPuesto(elegido);
    setGuardandoMun(false);
    await seguirDespuesDelMunicipio();
  }

  // Al salir del municipio se sigue donde iba, sin repetir la vuelta.
  /**
   * A dónde ir cuando no quedan vueltas.
   *
   * **Nunca al final sin haber preguntado el municipio.** Es la red de
   * seguridad, y existe porque el fallo que la motivó no fue un despiste en una
   * condición: fue que había dos caminos hacia el final y solo uno miraba la
   * ubicación. Con una sola puerta, no puede volver a pasar.
   */
  /**
   * A dónde lleva «Volver».
   *
   * Se podía ir para adelante y no para atrás: quien se daba cuenta en la
   * vuelta 2 de que había escogido mal el problema, o de que el municipio no
   * era ese, no tenía más salida que cerrar la página y perder el hilo — con el
   * aporte ya guardado, pero a medio contar.
   *
   * Devuelve `null` cuando de verdad no hay a dónde volver, y entonces el botón
   * no se dibuja: un «Volver» que no vuelve es peor que no tenerlo.
   */
  function atras(): (() => void) | null {
    if (paso === "entendimos") {
      return otros.length ? () => setPaso("escoger") : null;
    }
    if (paso === "municipio") {
      if (elegido) return () => setElegido(null);
      // De «¿dónde vives?» se vuelve a «¿dónde queda?», no dos pantallas atrás.
      if (porResidencia) return () => { setPorResidencia(false); setDepto(""); setDelDepto([]); };
      return () => setPaso("entendimos");
    }
    if (paso === "confirmar-residencia") return () => { setElegido(null); setPaso("municipio"); };
    if (paso === "falta" || paso === "voceria") {
      // A la vuelta anterior; desde la primera, al municipio. Volver al
      // municipio no repregunta desde cero: lo confirmado sigue puesto y
      // cambiarlo **corrige** el territorio en vez de agregar otro.
      const desde = paso === "voceria" ? vueltas.length : vuelta;
      if (desde > 0) return () => { setVuelta(desde - 1); setPaso("falta"); };
      return () => { setVueltaAlVolver(0); setPaso("municipio"); };
    }
    return null;
  }

  function haciaElFinal(): "municipio" | "voceria" {
    if (municipioPuesto || municipioVisto) return "voceria";
    setVueltaAlVolver(99);
    return "municipio";
  }

  /**
   * La única salida del paso del municipio.
   *
   * Guarda **el lugar con sus palabras** antes de seguir: el barrio o la vereda
   * se preguntan aquí, en la misma pantalla, y no en una vuelta aparte. Si se
   * perdiera en esta transición, el aporte llegaría a la consola sin una sola
   * línea de dónde ocurre — que es exactamente lo que se quería arreglar.
   */
  async function seguirDespuesDelMunicipio() {
    await anotarLugar(codigo, conSusPalabras);
    setCandidatos([]);
    setDepto(""); setDelDepto([]); setFiltro(""); setPorResidencia(false); setElegido(null);
    setMunicipioVisto(true);
    setVuelta(vueltaAlVolver);
    setPaso(vueltaAlVolver >= vueltas.length ? "voceria" : "falta");
  }

  // **Cuántos pasos hay, y que no cambien a mitad.** El total se contaba con
  // `candidatos.length`, que sube y baja mientras la persona busca su
  // municipio: el «de 5» se volvía «de 4» sin que ella hubiera hecho nada. Y
  // escoger problema dejaba de contarse al juntarlos en uno.
  //
  // Los pasos son fijos desde el principio: escoger (si contó varias cosas) ·
  // lo que entendimos · el contexto heredado (si viene de otro aporte) · dónde
  // ocurre · las vueltas de lo que falta · quién habla.
  //
  // **Sube aquí desde más abajo, y eso es lo que arregla la queja.** Estaba
  // calculado después de las salidas de `voceria` y de `listo`, así que en esos
  // dos pasos no existía: el indicador se apagaba justo al final, que es donde
  // alguien se pregunta cuánto falta.
  const antes = (huboEscoger ? 1 : 0) + (tieneAlgo(heredado) ? 1 : 0);
  const total = antes + 3 + vueltas.length;
  const actual =
    paso === "escoger" ? 1
    : paso === "entendimos" ? (huboEscoger ? 2 : 1)
    : paso === "heredado" ? (huboEscoger ? 3 : 2)
    : paso === "falta" ? antes + 3 + vuelta
    // La vocería es el último de los pasos fijos; el municipio, el anterior.
    : paso === "voceria" ? total
    : antes + 2;

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
      <section className="pc-section pc-entra" data-prueba="afinar">
        <h2>Recibimos lo que nos contaste</h2>
        {/* **El mismo comprobante que el del final**, no una versión hecha con
            estilos en línea. Este es el camino de cuando la lectura no sale: la
            persona no pierde nada —el aporte está guardado— y lo único que
            necesita de nosotros es esto, así que tiene que verse igual de bien
            que cuando todo funciona. */}
        <Comprobante codigo={codigo} rotulo="Tu código" />
        <p className="pc-help">Guárdalo. Con él puedes volver a ver tu aporte, sin correo ni cuenta.</p>
        <a className="pc-action" href="/mis-aportes">Consultar mi aporte</a>
      </section>
    );
  }

  const volverDeVoceria = atras();
  if (paso === "voceria") {
    return (
      <section className="pc-section pc-entra" key="voceria" data-prueba="voceria">
        {/* **El indicador también aquí.** Decía «Última pregunta» y quitaba el
            «Paso X de Y», así que el contador desaparecía justo en el paso
            donde alguien está decidiendo si sigue o se va. La vocería es el
            último de los pasos fijos: va en `total` de `total`.

            También aquí se puede volver: es la última pantalla antes de
            terminar, y es justo donde alguien se acuerda de que escribió mal el
            municipio. */}
        <Progreso actual={total} total={total} volver={volverDeVoceria && (
          <button type="button" className="pc-text-action" data-prueba="volver"
                  onClick={volverDeVoceria}>
            Volver
          </button>
        )} />
        <Guardado codigo={codigo} />

        {/* **Esta no es una pregunta más, y se veía como una más.** Cambia a
            quién hay que responderle y a nombre de quién queda el aporte —si es
            de un colectivo, el expediente deja de ser de una persona—. Lleva el
            mismo realce que «¿Se te ocurre cómo?»: no es decoración, es lo que
            distingue una pregunta que decide algo de una que solo completa. */}
        <div className="pc-destacada">
          <span className="pc-label-display">
            <IconoGrupo />
            Antes de terminar
          </span>
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
        </div>
      </section>
    );
  }

  if (paso === "listo") {
    return (
      <>
        <section className="pc-section pc-entra" key="listo" data-prueba="afinado-listo" aria-live="polite">
          {/* **El indicador llega hasta el final.** Aquí no había nada, así que
              la barra que acompañó a la persona durante cinco pantallas
              desaparecía en la única donde se cierra. Llena, y diciendo
              «Listo»: con la captura terminada, «Paso 5 de 5» es una cuenta y
              lo que hace falta es la respuesta. */}
          <Progreso actual={total} total={total} terminado />
          <h2>Listo. Quedó registrado con tus palabras</h2>
          {/* `.pc-success` es un estilo de texto, no una caja: va en la frase
              que da la buena noticia y en nada más. Puesto en la sección teñía
              de verde y agrandaba todo lo de dentro, avisos incluidos. */}
          <p className="pc-success">Guarda este código.</p>
          <Comprobante codigo={codigo} rotulo="Tu código" />
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

  // **Dos cosas distintas.** Que en su relato ya dijera dónde cambia el tono:
  // lo suyo viene traído, no se le pregunta de nuevo. Que además hayamos
  // encontrado municipios cambia la pregunta entera: ahí solo hay que confirmar.
  //
  // Escribir «en mi casa» en la caja no es ninguna de las dos: se sigue
  // preguntando dónde queda, porque eso es un sitio que solo ella encuentra.
  const traiamosSuLugar = (lect?.lugar ?? "").trim().length > 0;
  const hayQueConfirmar = candidatos.length > 0;
  const volver = atras();

  // Si la vuelta que toca es **solo la propuesta**. Con cuatro preguntables
  // repartidas de tres en tres, es el caso corriente: la segunda vuelta queda
  // con `solucionSugerida` sola, y es la que la persona ve casi siempre.
  const soloLaPropuesta =
    vueltas[vuelta]?.length === 1 && vueltas[vuelta]?.[0] === "solucionSugerida";

  return (
    // **Cada paso entra, y por eso se nota que es otro.** `key={paso}` obliga a
    // React a montar una sección nueva en cada avance, así que `.pc-entra`
    // —que ya existe, ya vive dentro de `prefers-reduced-motion` y ya tiene su
    // rama de `@media print`— vuelve a dispararse. Sin la `key`, React reusa el
    // mismo nodo y la animación corre una vez y nunca más: la pantalla cambiaba
    // de contenido sin que nada dijera que había cambiado de pregunta.
    <section className="pc-section pc-entra" key={paso} data-prueba="afinar">
      {/* Decir cuánto falta es lo que impide que alguien abandone creyendo que
          esto no se acaba nunca. */}
      <Progreso actual={actual} total={total} volver={volver && (
        <button type="button" className="pc-text-action" data-prueba="volver" onClick={volver}>
          Volver
        </button>
      )} />
      <Guardado codigo={codigo} />
      {paso !== "entendimos" && paso !== "escoger" && <SobreQue problema={problema} />}

      {paso === "escoger" && lect && (
        <div data-prueba="escoger">
          <h2>Nos contaste {otros.length + 1} cosas</h2>
          {/* **«Puede que»**, no «cada una va». A veces son dos formas de decir
              lo mismo —«problemas con el agua» y «el agua llega negra»— y
              afirmarlo de entrada empuja a partir algo que no había que
              partir. */}
          <p className="pc-help">
            Puede que cada una vaya a una entidad distinta, y por eso se atienden por separado.
            ¿Por cuál empezamos?
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
          {/* **Juntarlas, no descartarlas.** Antes esto decía «en realidad es
              una sola cosa» y se quedaba con el primer fragmento: «esas aguas
              llegan con un color negro» desaparecía del problema. El relato
              entero seguía guardado, pero lo que el revisor iba a leer ya no lo
              decía.

              Separar de más es tan malo como juntar de más: dos expedientes
              para lo mismo es justo lo que `R1` existe para evitar. */}
          <button type="button" className="pc-text-action" data-prueba="juntar"
                  onClick={() => {
                    setProblema([problema, ...otros].join(". "));
                    setOtros([]);
                    setPaso("entendimos");
                  }}>
            Son lo mismo — júntalas en una
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
              {/* **El tema, confirmado por ella.** Va aquí y no en una
                  pantalla propia: es una pregunta más en una pantalla que ya
                  está, y sin él no se puede agrupar lo que se repite ni saber a
                  qué entidad compete.

                  La lista es provisional (`Q32`) y por eso hay «otra cosa»: un
                  tema que se repite ahí es la señal de que a la lista le falta
                  algo, no un cajón para esconderlo. */}
              <div className="pc-field">
                <label className="pc-label" htmlFor="tema">¿De qué se trata?</label>
                <select id="tema" className="pc-input" value={tema ?? lect.tema ?? ""}
                        onChange={(e) => setTema((e.target.value || null) as Tema | null)}>
                  <option value="">Prefiero no decirlo</option>
                  {TEMAS.map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
                <p className="pc-help">
                  {lect.tema
                    ? "Lo escogimos por lo que contaste. Cámbialo si no es eso."
                    : "Nos ayuda a llevarlo a quien responde por ese asunto."}
                </p>
              </div>

              <p className="pc-help">Si no es eso, corrígelo — mandas tú.</p>
              <Error_ paso={r1} />
              {/* Los dos en el mismo grupo. Estaban en cajas distintas —uno
                  dentro del formulario y otro fuera— y salían desalineados y de
                  tamaños distintos. `.pc-actions` es lo que el sistema de diseño
                  tiene para una decisión con dos salidas. */}
              <form action={accion1} className="pc-actions">
                <input type="hidden" name="codigo" value={codigo} readOnly />
                <input type="hidden" name="corrigio" value="no" readOnly />
                <input type="hidden" name="tema" value={tema ?? lect.tema ?? ""} readOnly />
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
                <input type="hidden" name="tema" value={tema ?? lect.tema ?? ""} readOnly />
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
          {/* **Una sola pregunta, una sola pantalla, y siempre la misma.**
              Antes el lugar se preguntaba dos veces —texto libre en una vuelta y
              municipio en otra— y además esta pantalla se partía en dos ramas
              que se alternaban solas: con candidatos enseñaba una lista, sin
              ellos un selector, y escribir hacía saltar de una a otra bajo los
              dedos.

              Ahora es una: se dice con las palabras de uno, y debajo va lo que
              encontramos con eso. Si acertamos, es un toque. Si no, el selector
              está ahí mismo. Nadie tiene que volver atrás para corregir. */}
          {/* **Si ya lo dijo, esto no es una pregunta nueva.** Recorriendo el
              flujo como una persona se ve el problema que quedaba: la pantalla
              anterior le muestra «Dónde ocurre: la vereda La Martinita,
              Rionegro» y la siguiente le pregunta «¿dónde queda?» con eso mismo
              escrito en la caja. Son dos pantallas, pero se siente como que no
              la escuchamos.

              Con lo suyo delante, la pantalla **confirma**; sin nada, pregunta. */}
          <h2>
            {porResidencia ? "¿Dónde vives?" : hayQueConfirmar ? "¿Es aquí?" : "¿Dónde queda?"}
          </h2>
          <p className="pc-help">
            {porResidencia ? (
              <>Sirve para acercarnos. Después te preguntamos si el problema ocurre ahí mismo.</>
            ) : hayQueConfirmar ? (
              <>
                Esto es lo que entendimos de dónde ocurre. <strong>Solo falta el municipio</strong>,
                que es lo que permite sumarlo al de tus vecinos.
              </>
            ) : (
              <>
                Sin municipio, tu aporte <strong>no se puede sumar al de tus vecinos</strong> ni
                llegar a quien responde por ese territorio.
              </>
            )}
          </p>

          {!porResidencia && (
            <div className="pc-field">
              <label className="pc-label" htmlFor="con-sus-palabras">
                {traiamosSuLugar ? "Dónde ocurre, con tus palabras" : "Dilo con tus palabras"}
              </label>
              <input id="con-sus-palabras" className="pc-input" type="text"
                     value={conSusPalabras}
                     onChange={(e) => setConSusPalabras(e.target.value)}
                     aria-describedby="palabras-ayuda" />
              <p className="pc-help" id="palabras-ayuda">
                {traiamosSuLugar ? (
                  <>
                    Lo tomamos de lo que contaste. <strong>Cámbialo si no es exacto</strong> — se
                    guarda tal como lo escribas.
                  </>
                ) : (
                  <>
                    El barrio, la vereda, el municipio o una referencia: «la vereda El Salado, en
                    Rionegro». <strong>Se guarda tal como lo escribas.</strong>
                  </>
                )}
              </p>
            </div>
          )}

          {/* Lo que encontramos con eso. **No elige nada**: `I2` prohíbe
              inferir, y si hay dos Rionegro escoge la persona. */}
          {!porResidencia && candidatos.length > 0 && (
            <div data-prueba="sugerencias">
              <p className="pc-note">
                {candidatos.length === 1
                  ? <>Por lo que escribiste, puede ser <strong>este</strong>. Tócalo si es.</>
                  : <>Hay más de uno con ese nombre, <strong>y solo tú sabes cuál es</strong>.</>}
              </p>
              <div className="pc-actions">
                {candidatos.map((c) => (
                  <button key={c.codigo} type="button" className="pc-action" disabled={guardandoMun}
                          onClick={() => setElegido(c)}>
                    {c.nombre}, {c.departamento}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* **De lo macro a lo micro, y con buscador.** Escoger primero el
              departamento baja la lista de 1.122 a 125 como mucho y quita los
              nombres repetidos. Pero 125 en un desplegable siguen siendo
              imposibles de recorrer, así que se filtran escribiendo.

              Está siempre visible, también cuando hay sugerencias: si ninguna
              es la suya, no hace falta decir «ninguna» ni volver atrás. */}
          {detectado && !porResidencia && (
            <p className="pc-note" data-prueba="detectado">
              Por lo que contaste, parece <strong>{detectado.nombre}</strong>. Ya está puesto —
              cámbialo si no es.
            </p>
          )}
          <div className="pc-field">
            <label className="pc-label" htmlFor="departamento">Departamento</label>
            <select id="departamento" className="pc-input" value={depto}
                    onChange={(e) => escogerDepartamento(e.target.value)}>
              <option value="">Escoge uno…</option>
              {/* Mientras cargan los 33, el detectado ya es una opción: si no,
                  el selector enseñaba «Escoge uno…» justo debajo de un aviso
                  que decía «ya está puesto». */}
              {deptos.length === 0 && detectado && (
                <option value={detectado.codigo}>{detectado.nombre}</option>
              )}
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
                    onClick={() => { setPorResidencia(true); setDepto(""); setDelDepto([]); setFiltro(""); }}>
              No sé en qué municipio queda
            </button>
          ) : (
            <button type="button" className="pc-text-action"
                    onClick={() => void seguirDespuesDelMunicipio()}>
              Prefiero no decirlo
            </button>
          )}
          <p className="pc-help">
            Lo que escribiste se guarda igual, tal como lo escribiste. Si no llegamos al
            municipio, alguien lo revisa a mano — <strong>no lo vamos a suponer</strong>.
          </p>
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
                      await confirmarMunicipio(codigo, elegido.codigo, elegido.version, "vive_ahi",
                                               municipioPuesto !== null);
                      setGuardandoMun(false);
                      await seguirDespuesDelMunicipio();
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
                        repartir(nueva);
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
          {/* **Cuando la vuelta es solo la propuesta, la vuelta entera cambia de
              tono.** El encabezado genérico decía «Esto no lo encontramos en lo
              que contaste», y eso es cierto de un dato que falta —dónde, a
              quiénes, desde cuándo— pero no de una solución: no es algo que se
              nos escapó, es algo que nadie está obligado a traer. Presentarla
              igual que las demás es lo que la hacía parecer «una pregunta
              cualquiera del cuestionario». */}
          <h2>
            {soloLaPropuesta ? "Una última cosa, y es opcional"
              : vuelta === 0 ? "Nos falta poco" : "Y lo último"}
          </h2>
          <p className="pc-help">
            {soloLaPropuesta ? (
              <>
                Nadie tiene que traer la solución para que el problema se escuche.{" "}
                <strong>Si se te ocurre algo, aquí queda con tus palabras.</strong>
              </>
            ) : (
              <>
                Esto no lo encontramos en lo que contaste. <strong>Lo que no sepas, déjalo en
                blanco</strong> — no vamos a suponerlo.
              </>
            )}
          </p>
          <form action={accion2} key={vuelta}>
            <input type="hidden" name="codigo" value={codigo} readOnly />
            <input type="hidden" name="problema" value={problema} readOnly />
            {/* **Lo ya contestado viaja con cada vuelta.** La síntesis se
                compone con lo que llega en el formulario, así que sin esto la
                vuelta siguiente la reescribía con sus dos campos y **perdía lo
                de la anterior**: una persona escribió «techarlas y hacerles
                mantenimiento» en una vuelta y la versión vigente acabó sin esa
                frase. */}
            {PREGUNTABLES.filter((k) => !vueltas[vuelta]!.includes(k) && lect[k]).map((k) => (
              <input key={k} type="hidden" name={k} value={lect[k]!} readOnly />
            ))}
            {vueltas[vuelta].map((k) => k === "solucionSugerida" ? (
              /* **La pregunta que no es una más.** Salía del mismo bucle que las
                 demás: misma etiqueta, misma caja de una línea, mismo gris. Y no
                 es lo mismo — las otras cuatro completan un registro; esta es lo
                 único de toda la captura donde la persona propone, y el propio
                 requisito insiste en que no puede ser un requisito.

                 Tres cosas la separan, y ninguna es un color de texto nuevo:
                 el bloque con borde dorado y elevación, la versalita con icono
                 que dice de qué va, y una caja de tres renglones en vez de una
                 — porque una propuesta no cabe en una línea, y una caja de una
                 línea le dice a la persona cuánto se espera que escriba. */
              <div className="pc-destacada" key={k}>
                <span className="pc-label-display">
                  <IconoIdea />
                  Tu propuesta
                </span>
                <div className="pc-field">
                  <label className="pc-label" htmlFor={k}>{COMO_SE_PREGUNTA[k].etiqueta}</label>
                  <textarea id={k} name={k} className="pc-input" rows={3}
                            defaultValue={lect[k] ?? ""} aria-describedby={`${k}-ayuda`} />
                  <p className="pc-help" id={`${k}-ayuda`}>{COMO_SE_PREGUNTA[k].ayuda}</p>
                </div>
              </div>
            ) : (
              <div className="pc-field" key={k}>
                <label className="pc-label" htmlFor={k}>{COMO_SE_PREGUNTA[k].etiqueta}</label>
                {/* Lo que ya escribió vuelve puesto. Sin esto, volver atrás y
                    seguir mandaba el campo vacío y la síntesis perdía lo que
                    había dicho en esa vuelta. */}
                <input id={k} name={k} className="pc-input" type="text"
                       defaultValue={lect[k] ?? ""} aria-describedby={`${k}-ayuda`} />
                <p className="pc-help" id={`${k}-ayuda`}>{COMO_SE_PREGUNTA[k].ayuda}</p>
              </div>
            ))}
            <Error_ paso={r2} />
            <button type="submit" className="pc-action" disabled={guardando2}>
              {guardando2 ? "Guardando…" : vuelta + 1 >= vueltas.length ? "Listo" : "Continuar"}
            </button>
            {/* **Terminar termina.** La red de seguridad del municipio vale
                para el camino automático, no para cuando la persona dice basta:
                `N02` no deja exigir la ubicación, y un botón que dice terminar
                y saca una pantalla más es una promesa rota — justo lo que hace
                abandonar a quien ya se estaba yendo. */}
            <button type="button" className="pc-text-action" onClick={() => setPaso("voceria")}>
              Terminar aquí
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
