"""
El estado de la construcción, derivado de los archivos.

`harness/interfaz.md` I2 lo dice para el descubrimiento: *la telemetría sale del
grafo, no se escribe a mano*. Y I6 lo dice para el juicio: *«¿alcanza para
construir la pantalla?» se deriva, no se declara*. Esto es lo mismo para la Capa B.

La hoja de ruta declara un estado por tarea porque **cambiar de estado es una
decisión con evidencia**, y una decisión la toma alguien. Lo que este archivo NO
hace es reescribir esos estados: lo que hace es **buscar dónde lo declarado y lo
que muestran los archivos no coinciden**.

Un tablero que se corrige solo miente distinto: dice que todo está bien porque él
mismo lo escribió. Un tablero que señala sus propias contradicciones se puede
creer.

De dónde sale cada cosa:

  construccion/hoja-de-ruta.md     las tareas, sus dependencias y su estado declarado
  construccion/tareas/T*.md        la superficie de archivos y la autoridad de cada una
  negocio/vacios.md                las preguntas abiertas que causan los bloqueos
  entregable/modulos/M*.md         los códigos que un módulo asigna
  .superpowers/sdd/*/progress.md   qué está ejecutando Superpowers ahora mismo
  git worktree list · git log      qué agentes están andando y desde cuándo

Lo único que este archivo escribe es el bloque `<!-- derivado -->` del encabezado
de la hoja de ruta, y `construccion/.estado.json`. Nada más.
"""

import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CONS = RAIZ / "construccion"
HOJA = CONS / "hoja-de-ruta.md"

# Los ocho de `metodo/construccion-solida-y-paralela.md` §5. No hay más, y
# "avanzado", "casi" y "pendiente" no están aquí a propósito: no dicen qué falta
# ni quién lo debe.
ESTADOS = [
    "candidato",
    "listo",
    "en construcción",
    "bloqueado",
    "en revisión",
    "en integración",
    "terminado",
    "caído",
]

# Un estado a partir del cual la tarea ya no consume trabajo de nadie.
CERRADOS = {"terminado", "caído"}
# Estados en los que alguien tiene la tarea en las manos.
ACTIVOS = {"en construcción", "en revisión", "en integración"}

# Cuántos días puede quedarse una tarea en un estado antes de que sea deterioro.
# `metodo/construccion-solida-y-paralela.md` §10 lo llama "riesgos de deterioro":
# trabajo construido sin revisar, integrar, validar o entregar.
PUDRICION = {"en revisión": 2, "en integración": 1, "en construcción": 5}

CODIGO = re.compile(r"\b(RF|C|P|R|I)(\d{1,3})\b")
FILA_TAREA = re.compile(r"^\|\s*(T\d{3})\s*\|")
SUPERFICIE = re.compile(r"^-\s*(Crear|Modificar|Leer|No modificar):\s*`([^`]+)`", re.M)
BLOQUEA = re.compile(r"^\*\*Bloqueada por:\*\*\s*(.+)$", re.M)


def _celdas(linea):
    """Las celdas de una fila de tabla markdown, sin los bordes."""
    partes = linea.strip().split("|")
    if len(partes) < 3:
        return []
    return [c.strip() for c in partes[1:-1]]


def _hoy():
    return datetime.now(timezone.utc)


# ── Lo que se lee ────────────────────────────────────────────────────────────


def leer_tareas():
    """Las filas de la tabla de tareas de la hoja de ruta.

    Ocho columnas, en el orden de la plantilla. Si alguien le agrega una columna
    sin avisar, esto lo dice en vez de adivinar: una fila mal leída en silencio
    es peor que una fila que no se lee.

    **Solo la tabla de tareas.** El documento tiene otras tablas que también
    empiezan con un identificador —la de bloqueos, por ejemplo— y leerlas como si
    fueran tareas inventa filas que nadie escribió. La tabla se reconoce por su
    encabezado y se deja de leer en cuanto termina.
    """
    if not HOJA.exists():
        return [], ["No existe `construccion/hoja-de-ruta.md`."]

    tareas, quejas = [], []
    dentro = False
    for n, linea in enumerate(HOJA.read_text(encoding="utf-8").splitlines(), 1):
        if _celdas(linea)[:2] == ["ID", "Resultado"]:
            dentro = True
            continue
        if dentro and not linea.lstrip().startswith("|"):
            dentro = False
        if not dentro or not FILA_TAREA.match(linea):
            continue
        c = _celdas(linea)
        if len(c) != 8:
            quejas.append(
                f"hoja-de-ruta.md:{n} — la fila tiene {len(c)} columnas y deben ser 8. No se leyó."
            )
            continue
        ident, resultado, codigos, depende, linea_, duenno, estado, evidencia = c
        if estado not in ESTADOS:
            quejas.append(
                f"hoja-de-ruta.md:{n} — `{ident}` tiene estado «{estado}», que no es uno de los ocho."
            )
        tareas.append(
            {
                "id": ident,
                "resultado": resultado,
                "codigos": [f"{a}{b}" for a, b in CODIGO.findall(codigos)],
                "depende_de": re.findall(r"T\d{3}", depende),
                "linea": linea_,
                "propietario": duenno,
                "estado": estado,
                "evidencia": evidencia,
                "fuente": n,
            }
        )
    return tareas, quejas


def leer_contratos():
    """La superficie de archivos que declara cada contrato de tarea.

    Es lo que permite responder si dos tareas se pisan sin abrir el código. Una
    tarea sin contrato no tiene superficie declarada, y por lo tanto **no se
    puede despachar en paralelo con nada**: no se sabe qué toca.
    """
    contratos = {}
    d = CONS / "tareas"
    if not d.is_dir():
        return contratos
    for f in sorted(d.glob("T*.md")):
        ident = f.stem.split("-")[0]
        texto = f.read_text(encoding="utf-8")
        superficie = {"Crear": [], "Modificar": [], "Leer": [], "No modificar": []}
        for verbo, ruta in SUPERFICIE.findall(texto):
            if not ruta.startswith("<"):  # la plantilla sin llenar
                superficie[verbo].append(ruta)
        autoridad = ""
        m = re.search(r"^\*\*Autoridad:\*\*\s*(.+)$", texto, re.M)
        if m:
            autoridad = m.group(1).strip()
        # Qué pregunta abierta la bloquea. Una tarea que no lo declara no es una
        # tarea sin bloqueos: es una que no se revisó.
        mb = BLOQUEA.search(texto)
        espera = re.findall(r"\b([QP]\d{1,3})\b", mb.group(1)) if mb else []
        declara_bloqueo = mb is not None
        contratos[ident] = {
            "archivo": str(f.relative_to(RAIZ)),
            "superficie": superficie,
            "autoridad": autoridad,
            "codigos": [f"{a}{b}" for a, b in CODIGO.findall(autoridad)],
            # Una casilla de verificación sin marcar no es un defecto; una
            # sección de casos vacía sí.
            "espera": espera,
            "declara_bloqueo": declara_bloqueo,
            "casos": len(re.findall(r"^- \[[ x]\] .+→", texto, re.M)),
            "sin_llenar": texto.count("> ➤"),
        }
    return contratos


def leer_vacios():
    """Las preguntas abiertas del negocio. Son la causa de los bloqueos reales."""
    for ruta in ("negocio/vacios.md", "negocio/especificacion-v0-2026-09-13/vacios.md"):
        f = RAIZ / ruta
        if f.exists():
            texto = f.read_text(encoding="utf-8")
            codigos = re.findall(r"^\|\s*(Q\d{1,3})\s*\|", texto, re.M)
            if not codigos:  # la tabla v0, que numera con la forma de pregunta
                codigos = [l.split("|")[1].strip() for l in texto.splitlines()
                           if re.match(r"^\|\s*\[?[A-F]\d", l.strip())]
            return {"archivo": ruta, "abiertas": len(codigos), "codigos": sorted(set(codigos))}
    return {"archivo": None, "abiertas": 0, "codigos": []}


def leer_pliegos():
    """Las preguntas del pliego que siguen sin responder.

    Se leen aparte de `vacios.md` porque viven en otro archivo y las numera `P`,
    pero bloquean igual: la `P4` —la identidad— no la responde ningún documento
    y sin ella no hay permisos de servidor.
    """
    abiertas = []
    d = RAIZ / "negocio" / "preguntas"
    if not d.is_dir():
        return abiertas
    for f in sorted(d.glob("*.md")):
        for linea in f.read_text(encoding="utf-8").splitlines():
            m = re.match(r"^### (P\d+) ·", linea)
            if m and "RESPONDIDA" not in linea:
                abiertas.append(m.group(1))
    return sorted(set(abiertas))


def preguntas_abiertas():
    v = leer_vacios()
    return sorted(set(v["codigos"]) | set(leer_pliegos()))


def esperando(tareas, contratos, abiertas):
    """Tareas que declaran esperar una pregunta que sigue abierta.

    Devuelve dos cosas distintas y la segunda es la que duele:

      `esperan`  — están declaradas como bloqueadas y su pregunta sigue abierta.
                   Es correcto, y lo que hay que saber es **qué sí se puede
                   hacer sin la respuesta**, que va en su contrato.

      `cerradas_en_falso` — dicen `terminado` o `en integración` y su pregunta
                   NUNCA se respondió. Es la forma en que una lista de pendientes
                   se convierte en una lista que nadie miró.
    """
    abiertas = set(abiertas)
    esperan, falso = [], []
    for t in tareas:
        c = contratos.get(t["id"])
        if not c:
            continue
        pendientes = [q for q in c["espera"] if q in abiertas]
        if not pendientes:
            continue
        if t["estado"] in CERRADOS:
            falso.append({"id": t["id"], "estado": t["estado"], "espera": pendientes})
        else:
            esperan.append({"id": t["id"], "estado": t["estado"], "espera": pendientes,
                            "resultado": t["resultado"]})
    return esperan, falso


def leer_modulos():
    """Los módulos entregados y los códigos que cada uno asigna.

    Un módulo es la autoridad de un plan (ADR 0011). Mientras `entregable/modulos/`
    esté vacío, ninguna tarea puede tener autoridad de verdad, y eso se dice.
    """
    modulos = {}
    d = RAIZ / "entregable" / "modulos"
    if not d.is_dir():
        return modulos
    for f in sorted(d.glob("M*.md")):
        texto = f.read_text(encoding="utf-8")
        marcadas = len(re.findall(r"^- \[x\]", texto, re.M))
        totales = len(re.findall(r"^- \[[ x]\]", texto, re.M))
        modulos[f.stem.split("-")[0]] = {
            "archivo": str(f.relative_to(RAIZ)),
            "codigos": sorted({f"{a}{b}" for a, b in CODIGO.findall(texto)}),
            "sobre_cerrado": {"marcadas": marcadas, "totales": totales},
            "sin_llenar": texto.count("> ➤"),
        }
    return modulos


def leer_ledger():
    """Lo que Superpowers está ejecutando ahora mismo.

    Su propia skill avisa por qué esto importa: *«controllers that lost their
    place have re-dispatched entire completed task sequences — the single most
    expensive failure observed»*. El ledger es el mapa de recuperación.
    """
    planes = {}
    d = RAIZ / ".superpowers" / "sdd"
    if not d.is_dir():
        return planes
    for prog in sorted(d.glob("*/progress.md")):
        texto = prog.read_text(encoding="utf-8")
        completas = sorted(set(re.findall(r"Task (\d+): complete", texto)))
        rondas = re.findall(r"[Rr]ound (\d+)", texto)
        planes[prog.parent.name] = {
            "archivo": str(prog.relative_to(RAIZ)),
            "tareas_completas": completas,
            "ultima_ronda_de_arreglo": rondas[-1] if rondas else None,
            "modificado": datetime.fromtimestamp(
                prog.stat().st_mtime, timezone.utc
            ).isoformat(timespec="seconds"),
        }
    return planes


def _git(*args):
    try:
        return subprocess.run(
            ["git", *args], cwd=RAIZ, capture_output=True, text=True, timeout=15
        ).stdout.strip()
    except Exception:
        return ""


def leer_agentes():
    """Qué agentes están andando, leído de los worktrees.

    El paralelismo vive entre planes, y cada plan tiene su worktree (ADR 0011).
    Por eso un worktree es un agente: no hace falta preguntarle a nadie.
    """
    agentes = []
    salida = _git("worktree", "list", "--porcelain")
    actual, principal = {}, True
    for linea in salida.splitlines() + [""]:
        if linea.startswith("worktree "):
            actual = {"ruta": linea.split(" ", 1)[1]}
        elif linea.startswith("branch "):
            actual["rama"] = linea.split("/")[-1]
        elif linea == "" and actual:
            if principal:
                principal = False  # el primero es el repo, no un agente
            else:
                fecha = _git("-C", actual["ruta"], "log", "-1", "--format=%cI")
                actual["ultimo_commit"] = fecha or None
                actual["dias_sin_commit"] = _dias(fecha)
                agentes.append(actual)
            actual = {}
    return agentes


def _dias(iso):
    if not iso:
        return None
    try:
        return round((_hoy() - datetime.fromisoformat(iso)).total_seconds() / 86400, 1)
    except ValueError:
        return None


def _dias_del_estado(tarea):
    """Hace cuánto esta tarea no se toca, según el último commit que la nombra.

    Se busca por el identificador en el mensaje del commit. Si nadie lo escribió,
    no se sabe — y no saberlo se dice, no se rellena con la fecha de hoy.
    """
    fecha = _git("log", "-1", "--format=%cI", f"--grep={tarea['id']}")
    return _dias(fecha)


# ── Lo que se calcula ────────────────────────────────────────────────────────


def grafo(tareas):
    por_id = {t["id"]: t for t in tareas}
    aristas = []
    huerfanas = []
    for t in tareas:
        for dep in t["depende_de"]:
            if dep in por_id:
                aristas.append({"de": dep, "a": t["id"]})
            else:
                huerfanas.append(f"`{t['id']}` depende de `{dep}`, que no existe en el tablero.")
    return aristas, huerfanas


def ruta_critica(tareas):
    """El camino más largo por dependencias. Es el tiempo mínimo restante.

    Ninguna cantidad de agentes en paralelo lo acorta: por eso se mira antes de
    decidir dónde poner gente.

    Solo cuenta lo que falta. Una tarea terminada ya no está en la ruta crítica
    de nadie, aunque otras dependan de ella.
    """
    por_id = {t["id"]: t for t in tareas}
    memo, en_curso = {}, set()

    def largo(ident):
        if ident in memo:
            return memo[ident]
        if ident in en_curso:  # ciclo: se corta y se reporta aparte
            return []
        en_curso.add(ident)
        t = por_id.get(ident)
        mejor = []
        if t:
            for dep in t["depende_de"]:
                cam = largo(dep)
                if len(cam) > len(mejor):
                    mejor = cam
        en_curso.discard(ident)
        propio = [] if (t and t["estado"] in CERRADOS) else [ident]
        memo[ident] = mejor + propio
        return memo[ident]

    mejor = []
    for t in tareas:
        cam = largo(t["id"])
        if len(cam) > len(mejor):
            mejor = cam
    return mejor


def ciclos(tareas):
    por_id = {t["id"]: t for t in tareas}
    visto, pila, encontrados = set(), [], []

    def caminar(ident):
        if ident in pila:
            encontrados.append(pila[pila.index(ident):] + [ident])
            return
        if ident in visto or ident not in por_id:
            return
        visto.add(ident)
        pila.append(ident)
        for dep in por_id[ident]["depende_de"]:
            caminar(dep)
        pila.pop()

    for t in tareas:
        caminar(t["id"])
    return encontrados


def revisar_listas(tareas, contratos, modulos):
    """Qué hace falta para `listo`, y qué hace falta además para despachar.

    **Son dos compuertas distintas y confundirlas hace daño en los dos sentidos.**

    `metodo/construccion-solida-y-paralela.md` §5 define `listo` con cuatro cosas:
    autoridad, dependencias resueltas, propietario y prueba de cierre. Nada más.
    Las nueve casillas de §7 son otra cosa: son las de **ejecución paralela**, y
    entre ellas está el contrato con su superficie de archivos.

    Una tarea puede estar legítimamente `listo` sin contrato: alguien puede
    empezarla él solo. Lo que no puede es despacharse a un agente, porque sin
    superficie declarada no se sabe si va a pisar a otro.

    Devuelve tres cosas:

      `deberia_estar_listo` — está en `candidato` y ya cumple las cuatro de §5.
      Es trabajo que se puede empezar hoy y el tablero no lo dice.

      `dice_listo_pero_no` — dice `listo` o más y le falta alguna de las cuatro.
      Es la contradicción peligrosa: alguien la va a tomar.

      `sin_contrato` — está `listo` pero no se puede despachar todavía.
    """
    por_id = {t["id"]: t for t in tareas}
    hay_modulos = bool(modulos)
    deberia, no_deberia, sin_contrato = [], [], []

    for t in tareas:
        if t["estado"] in CERRADOS:
            continue

        # `bloqueado` no se mide contra las condiciones de `listo`, y confundirlo
        # produce una contradicción falsa: una tarea bloqueada tiene las
        # dependencias sin resolver **por definición**. Lo que sí tiene que tener
        # es una causa declarada, y eso se comprueba aparte.
        if t["estado"] == "bloqueado":
            c = contratos.get(t["id"])
            if c is None or not c["espera"]:
                no_deberia.append({
                    "id": t["id"], "estado": "bloqueado",
                    "falta": ["dice «bloqueado» y no declara qué pregunta la bloquea "
                              "(**Bloqueada por:** en su contrato)"]})
            continue

        # Las cuatro de §5.
        faltan = []
        deps = [por_id.get(d) for d in t["depende_de"]]
        sin_terminar = [d["id"] for d in deps if d is not None and d["estado"] != "terminado"]
        if sin_terminar:
            faltan.append("sus dependencias no están terminadas: " + ", ".join(sin_terminar))
        if any(d is None for d in deps):
            faltan.append("depende de una tarea que no existe")
        if not t["propietario"] or t["propietario"] == "—":
            faltan.append("no tiene un propietario único")
        if not t["evidencia"] or t["evidencia"] == "—":
            faltan.append("no dice con qué evidencia se cierra")
        if hay_modulos and not t["codigos"]:
            faltan.append("no cita ningún código: no tiene autoridad")

        if t["estado"] == "candidato" and not faltan:
            deberia.append(t["id"])
        elif t["estado"] != "candidato" and faltan:
            no_deberia.append({"id": t["id"], "estado": t["estado"], "falta": faltan})

        # Las de §7, que son además y solo aplican a lo que ya está listo.
        if t["estado"] != "listo" or faltan:
            continue
        c = contratos.get(t["id"])
        pendiente = []
        if c is None:
            pendiente.append("no tiene contrato en `construccion/tareas/`")
        else:
            if c["sin_llenar"]:
                pendiente.append(
                    f"su contrato tiene {c['sin_llenar']} instrucciones de plantilla sin quitar"
                )
            if not (c["superficie"]["Crear"] or c["superficie"]["Modificar"]):
                pendiente.append("su contrato no declara superficie")
            if not c["casos"]:
                pendiente.append("su contrato no tiene casos de verificación")
        if pendiente:
            sin_contrato.append({"id": t["id"], "falta": pendiente})

    return deberia, no_deberia, sin_contrato


def matriz_paralelismo(tareas, contratos):
    """Qué pares de tareas activas se pisan.

    La prueba de la guía §7: dos tareas solo van en paralelo si no modifican los
    mismos archivos. Aquí se compara lo que cada contrato declara que va a crear
    o modificar; leer no cuenta, porque leer no rompe nada.

    Una tarea sin contrato aparece como `sin superficie declarada`, que es
    distinto de «no se pisa con nadie»: es que no se sabe.
    """
    activas = [t for t in tareas if t["estado"] in ACTIVOS or t["estado"] == "listo"]
    pares, sin_declarar = [], []

    def escribe(ident):
        c = contratos.get(ident)
        if not c:
            return None
        return set(c["superficie"]["Crear"]) | set(c["superficie"]["Modificar"])

    for i, a in enumerate(activas):
        sa = escribe(a["id"])
        if sa is None:
            sin_declarar.append(a["id"])
            continue
        for b in activas[i + 1:]:
            sb = escribe(b["id"])
            if sb is None:
                continue
            choque = sorted(sa & sb)
            depende = b["id"] in a["depende_de"] or a["id"] in b["depende_de"]
            pares.append(
                {
                    "par": [a["id"], b["id"]],
                    "comparten": choque,
                    "una_espera_a_la_otra": depende,
                    "decision": (
                        "secuencial" if (choque or depende) else "paralelo"
                    ),
                }
            )
    return pares, sorted(set(sin_declarar))


def deterioro(tareas):
    """Trabajo construido que nadie ha revisado, integrado o cerrado.

    `metodo/construccion-solida-y-paralela.md` §10 lo pone como punto fijo del
    reporte, y con razón: es lo que no duele hoy y cuesta el viernes.
    """
    pudriendose = []
    for t in tareas:
        limite = PUDRICION.get(t["estado"])
        if limite is None:
            continue
        dias = _dias_del_estado(t)
        if dias is None:
            pudriendose.append(
                {
                    "id": t["id"],
                    "estado": t["estado"],
                    "dias": None,
                    "por_que": "ningún commit la nombra, así que no se sabe desde cuándo",
                }
            )
        elif dias > limite:
            pudriendose.append(
                {
                    "id": t["id"],
                    "estado": t["estado"],
                    "dias": dias,
                    "por_que": f"lleva {dias} días en «{t['estado']}» y el límite es {limite}",
                }
            )
    return pudriendose


def cobertura(tareas, modulos):
    """Que ningún código del módulo se quede sin tarea, y ninguna tarea sin autoridad.

    Es la compuerta de salida de la etapa 2 de la guía §8. Mientras no haya
    módulos entregados no se puede comprobar, y eso se dice en vez de devolver
    un cero tranquilizador.
    """
    if not modulos:
        return {
            "comprobable": False,
            "por_que": "`entregable/modulos/` está vacío: ningún módulo ha pasado el sobre cerrado",
            "codigos_sin_tarea": [],
            "tareas_sin_autoridad": [],
        }
    del_modulo = {c for m in modulos.values() for c in m["codigos"]}
    de_tareas = {c for t in tareas for c in t["codigos"]}
    return {
        "comprobable": True,
        "por_que": None,
        "codigos_sin_tarea": sorted(del_modulo - de_tareas),
        "tareas_sin_autoridad": sorted(
            t["id"] for t in tareas if not t["codigos"] and t["estado"] not in CERRADOS
        ),
    }


def bloqueos(tareas):
    return [
        {"id": t["id"], "resultado": t["resultado"], "linea": t["linea"]}
        for t in tareas
        if t["estado"] == "bloqueado"
    ]


# ── Lo que se escribe ────────────────────────────────────────────────────────


def recoger():
    tareas, quejas = leer_tareas()
    contratos = leer_contratos()
    modulos = leer_modulos()
    abiertas = preguntas_abiertas()
    esperan, cerradas_en_falso = esperando(tareas, contratos, abiertas)
    aristas, huerfanas = grafo(tareas)
    deberia, no_deberia, sin_contrato = revisar_listas(tareas, contratos, modulos)
    pares, sin_superficie = matriz_paralelismo(tareas, contratos)
    critica = ruta_critica(tareas)

    por_estado = {e: [t["id"] for t in tareas if t["estado"] == e] for e in ESTADOS}
    lineas_activas = sorted(
        {t["linea"] for t in tareas if t["estado"] in ACTIVOS} - {"", "—"}
    )

    return {
        "generado": _hoy().isoformat(timespec="seconds"),
        "aviso": "DERIVADO. Lo escribe scripts/construccion.sh. No se edita a mano.",
        "tareas": tareas,
        "por_estado": por_estado,
        "grafo": aristas,
        "ciclos": ciclos(tareas),
        "dependencias_huerfanas": huerfanas,
        "ruta_critica": critica,
        "lineas_activas": lineas_activas,
        "deberia_estar_listo": deberia,
        "dice_listo_pero_no": no_deberia,
        "listas_sin_contrato": sin_contrato,
        "paralelismo": {"pares": pares, "sin_superficie_declarada": sin_superficie},
        "bloqueos": bloqueos(tareas),
        "preguntas_abiertas": abiertas,
        "esperando_respuesta": esperan,
        "cerradas_en_falso": cerradas_en_falso,
        "deterioro": deterioro(tareas),
        "cobertura": cobertura(tareas, modulos),
        "modulos": modulos,
        "vacios": leer_vacios(),
        "agentes": leer_agentes(),
        "planes_de_superpowers": leer_ledger(),
        "defectos_del_tablero": quejas,
    }


def escribir_bloque_derivado(estado):
    """Mete la ruta crítica y las líneas activas en el encabezado de la hoja de ruta.

    Van ahí porque la guía §5 las pide en el encabezado, y se escriben solas
    porque `harness/interfaz.md` I2 prohíbe escribirlas a mano. El bloque va
    marcado para que nadie lo edite creyendo que es contenido.
    """
    if not HOJA.exists():
        return False
    texto = HOJA.read_text(encoding="utf-8")
    critica = " → ".join(estado["ruta_critica"]) or "—"
    lineas = ", ".join(estado["lineas_activas"]) or "ninguna"
    nuevo = (
        "<!-- derivado · lo escribe scripts/construccion.sh · NO editar a mano -->\n"
        f"**Ruta crítica:** {critica}\n"
        f"**Líneas paralelas activas:** {lineas}\n"
        "<!-- /derivado -->"
    )
    patron = re.compile(
        r"<!-- derivado.*?<!-- /derivado -->", re.S
    )
    if not patron.search(texto):
        return False
    HOJA.write_text(patron.sub(lambda _: nuevo, texto, count=1), encoding="utf-8")
    return True
