"""
El grafo del negocio, hecho explícito.

`metodo/codigos.md` ya dice que el documento es un grafo: cuando `R7` cita a `P3`
eso es una flecha, y el conjunto de flechas permite preguntar *"si cambio esto,
¿qué se rompe?"*. Pero ese grafo vive en prosa, y recorrerlo obliga a leer los
documentos enteros.

Eso no escala. Con siete reglas son 18.000 palabras; con setenta serían 180.000,
y cada pregunta pequeña —*"¿qué necesito para construir el módulo 2?"*— costaría
leerlo todo.

Este archivo lo extrae y lo deja consultable. De ahí salen dos cosas:

  1. **Rebanadas.** `grafo.sh R3` devuelve R3 y todo lo que toca, y nada más.
  2. **Telemetría.** En qué etapas vamos, qué información tenemos, qué falta y
     de qué clase es lo que falta.

No inventa nada: solo lee lo que ya está escrito. Si un dato no está en
`negocio/`, aquí tampoco.
"""

import json
import re
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
NEG = RAIZ / "negocio"

CODIGO = re.compile(r"\b(RF|C|P|R|I|V|Q)(\d{1,3})\b")

# Cómo se dice cada flecha en la prosa. El método pide que cada regla cite de
# dónde sale y qué sostiene, y lo dice siempre con estas palabras.
FLECHAS = [
    (re.compile(r"[Ss]e deriva de ([^.]+)"), "se deriva de"),
    (re.compile(r"[Ss]ostiene a ([^.]+)"), "sostiene a"),
    (re.compile(r"[Cc]ierra (?:el|los) vacíos? ([^.]+)"), "cierra"),
]


def _texto(p):
    return (NEG / p).read_text(encoding="utf-8") if (NEG / p).exists() else ""


def _codigos(txt, excluir=None):
    fuera = excluir or set()
    return sorted({m.group(0) for m in CODIGO.finditer(txt)} - fuera,
                  key=lambda c: (re.sub(r"\d", "", c), int(re.sub(r"\D", "", c))))


# ─────────────────────────────────────────────────────────── nodos

def _reglas(esp):
    """Las R viven en subsecciones propias: `### R3 — Título`."""
    out = {}
    partes = re.split(r"\n### (R\d+) — ([^\n]+)\n", esp)
    for i in range(1, len(partes), 3):
        cod, titulo, cuerpo = partes[i], partes[i + 1].strip(), partes[i + 2]
        cuerpo = cuerpo.split("\n### ")[0].split("\n## ")[0]
        n = {"tipo": "regla", "titulo": titulo, "cita": [], "sostiene": [], "cierra": []}
        for rx, clase in FLECHAS:
            for m in rx.finditer(cuerpo):
                destino = {"se deriva de": "cita", "sostiene a": "sostiene", "cierra": "cierra"}[clase]
                n[destino] += _codigos(m.group(1))
        # Lo que la regla dice que le falta, en sus propias palabras.
        falta = re.search(r"\*\*Qué pasa si falta un dato\.\*\*\s*([^\n]+(?:\n[^\n*][^\n]*)*)", cuerpo)
        if falta:
            n["falta"] = " ".join(falta.group(1).split())[:300]
        n["resumen"] = " ".join(cuerpo.strip().split())[:220]
        out[cod] = n
    return out


def _tabla(esp, arranque, tipo, corte=None):
    """Las C, P, I y RF viven en tablas: `| C1 | ... |`.

    El código puede venir en negrita —`| **I2** |`— porque a la invariante
    suprema se le pone negrita al escribirla. Sin admitirlo, esa fila **se
    descartaba en silencio**: la telemetría decía "1 invariante" y la que
    faltaba era justo la que manda sobre todas. Un parser que pierde datos sin
    quejarse es peor que uno que falla.
    """
    if arranque not in esp:
        return {}
    tramo = esp[esp.index(arranque):]
    if corte and corte in tramo:
        tramo = tramo[:tramo.index(corte)]
    out = {}
    for l in tramo.split("\n"):
        m = re.match(r"\s*\|\s*\*{0,2}(RF|C|P|I)(\d{1,3})\*{0,2}\s*\|(.*)", l)
        if not m:
            continue
        cod = m.group(1) + m.group(2)
        celdas = [c.strip() for c in m.group(3).split("|")]
        out[cod] = {
            "tipo": tipo,
            "resumen": " ".join(" ".join(celdas).split())[:220],
            "cita": _codigos(" ".join(celdas), {cod}),
        }
    return out


def _vacios(vac):
    out = {}
    for l in vac.split("\n"):
        m = re.match(r"\s*\|\s*\*{0,2}(V|Q)(\d{1,3})\*{0,2}\s*\|(.*)", l)
        if not m:
            continue
        cod = m.group(1) + m.group(2)
        celdas = [c.strip() for c in m.group(3).split("|")]
        n = {
            "tipo": "vacío decidido" if cod[0] == "V" else "pregunta abierta",
            "resumen": " ".join(" ".join(celdas[:2]).split())[:220],
            "cita": _codigos(" ".join(celdas), {cod}),
        }
        if cod[0] == "Q":
            # Una recomendación siempre dice cuándo se vuelve urgente.
            n["bloquea"] = " ".join(celdas[1].split())[:200] if len(celdas) > 1 else ""
            n["urgente"] = " ".join(celdas[2].split())[:200] if len(celdas) > 2 else ""
        else:
            n["donde"] = celdas[-1] if celdas else ""
        out[cod] = n
    return out


# ─────────────────────────────────────────────────────────── frentes y faltantes

def _frentes(esp):
    out = []
    m = re.search(r"\| Orden \| Frente \| Reglas \| Estado \|\n\|[-| ]+\|\n((?:\|.*\n)+)", esp)
    if not m:
        return out
    for l in m.group(1).strip().split("\n"):
        c = [x.strip() for x in l.strip("|").split("|")]
        if len(c) < 4 or not c[0].isdigit():
            continue
        out.append({
            "orden": int(c[0]),
            "nombre": c[1],
            "codigos": _codigos(c[2]),
            "estado": re.sub(r"\*+", "", c[3]),
        })
    return out


def _faltan(esp):
    """La §11, con su tercera columna: qué se puede construir sin ese dato."""
    if "## 11." not in esp:
        return []
    tramo = esp[esp.index("## 11."):]
    out = []
    for l in tramo.split("\n"):
        if not l.startswith("| ") or l.startswith("| Qué falta") or set(l) <= set("|- "):
            continue
        c = [x.strip() for x in l.strip("|").split("|")]
        if len(c) < 2:
            continue
        out.append({
            "que_falta": re.sub(r"\*+", "", c[0])[:200],
            "desbloquea": re.sub(r"\*+", "", c[1])[:200],
            "sin_esto_se_puede": re.sub(r"\*+", "", c[2])[:300] if len(c) > 2 else "",
            # Lo que no se puede agregar después va primero, aunque el número falte.
            "va_primero": len(c) > 2 and ("va primero" in c[2] or "no se reconstruye" in c[2]
                                          or "hacia atrás" in c[2]),
        })
    return out


# ─────────────────────────────────────────────────────────── etapas

def _etapas():
    """En qué etapas vamos. Se deriva del disco, no se pregunta."""
    insumos = NEG / "insumos"
    pdfs = list(insumos.glob("*.pdf")) + list(insumos.glob("*.png")) if insumos.exists() else []
    preguntas = sorted((NEG / "preguntas").glob("*.md")) if (NEG / "preguntas").exists() else []

    respondidas = 0
    abiertas = 0
    for p in preguntas:
        t = p.read_text(encoding="utf-8")
        respondidas += len(re.findall(r"\|\s*\*{0,2}cerrada\*{0,2}\s*\|", t))
        abiertas += len(re.findall(r"\|\s*\*{0,2}(?:abierta|parcial)\*{0,2}\s*\|", t))

    esp = _texto("especificacion.md")
    bit = _texto("bitacora.md")
    return [
        # Se nombran, no se cuentan. Un número que no se puede verificar no se
        # cree — y el analista dudó de este exacto contador.
        {"n": "0", "etapa": "Leer", "corrida": bool(pdfs),
         "detalle": ", ".join(p.name for p in pdfs) if pdfs else "sin documentos"},
        {"n": "1", "etapa": "Descubrir", "corrida": (NEG / "dominio.md").exists(),
         "detalle": "hay dominio.md" if (NEG / "dominio.md").exists()
                    else "**no se ha hecho la entrevista**"},
        {"n": "1b", "etapa": "Preguntar", "corrida": bool(preguntas),
         "detalle": f"{len(preguntas)} pliego(s) · {respondidas} cerradas, {abiertas} abiertas o parciales"},
        {"n": "2", "etapa": "Especificar", "corrida": bool(esp),
         "detalle": "especificación v0 escrita" if esp else "sin especificación"},
        {"n": "3", "etapa": "Construir", "corrida": bool(bit),
         "detalle": f"{len(re.findall(r'^## Frente', bit, re.M))} frente(s) en la bitácora" if bit else "nada construido"},
        {"n": "4", "etapa": "Registrar", "corrida": (NEG / "vacios.md").exists(),
         "detalle": "vacios.md al día" if (NEG / "vacios.md").exists() else "sin registro"},
        {"n": "5", "etapa": "Validar", "corrida": (NEG / "revision.md").exists(),
         "detalle": "hay revisión" if (NEG / "revision.md").exists()
                    else "**nadie que no lo construyó lo ha mirado**"},
        {"n": "6", "etapa": "Entregar", "corrida": bool(list((RAIZ / "entregable" / "modulos").glob("*.md"))),
         "detalle": "hay módulos entregados" if list((RAIZ / "entregable" / "modulos").glob("*.md"))
                    else "nada entregado"},
    ]


def _bitacora():
    """
    La bitácora de la construcción: una fila por interacción.

    **No se escribe a mano.** Sale de `git log`, por la misma razón que la
    telemetría sale del grafo: una bitácora que alguien mantiene a mano se
    desactualiza en la tercera semana y a partir de ahí miente.

    Cada commit es una interacción — no es exacto, pero es el único registro que
    ya existe y que nadie tiene que acordarse de llenar. Y dice de qué fue: si
    tocó el método, el negocio o el MVP.
    """
    import subprocess
    try:
        crudo = subprocess.run(
            ["git", "log", "--pretty=%x1e%h%x1f%aI%x1f%s", "--name-only"],
            cwd=RAIZ, capture_output=True, text=True, timeout=20).stdout
    except Exception:
        return []

    out = []
    for bloque in crudo.split("\x1e"):
        if "\x1f" not in bloque:
            continue
        cab, _, archivos = bloque.strip().partition("\n")
        h, fecha, titulo = cab.split("\x1f")
        tocado = set()
        for a in archivos.split("\n"):
            if a.startswith(("metodo/", "plantillas/", ".claude/", "decisiones/", "AGENTS")):
                tocado.add("método")
            elif a.startswith("negocio/"):
                tocado.add("negocio")
            elif a.startswith("mvp/"):
                tocado.add("MVP")
            elif a.startswith(("harness/", "scripts/")):
                tocado.add("harness")
        out.append({
            "id": h,
            "cuando": fecha[:16].replace("T", " "),
            "que": titulo,
            "toco": sorted(tocado),
        })
    return out


# ─────────────────────────────────────────────────────────── el grafo

def construir():
    esp, vac = _texto("especificacion.md"), _texto("vacios.md")

    nodos = {}
    nodos.update(_reglas(esp))
    nodos.update(_tabla(esp, "## 6. Invariantes", "invariante", "## 7."))
    nodos.update(_tabla(esp, "## 3. Principios", "principio", "## 4."))
    nodos.update(_tabla(esp, "### Cómo tiene que comportarse", "cualidad", "## 3."))
    nodos.update(_tabla(esp, "### Lo que el sistema hace", "requerimiento", "### Cómo"))
    nodos.update(_vacios(vac))

    aristas = []
    for cod, n in nodos.items():
        for clase in ("cita", "sostiene", "cierra"):
            for otro in n.get(clase, []):
                if otro in nodos and otro != cod:
                    aristas.append({"de": cod, "a": otro, "flecha": clase})

    # Quién me cita a mí: es la pregunta cara sin grafo — "si cambio esto, ¿qué se rompe?"
    for a in aristas:
        nodos[a["a"]].setdefault("citado_por", []).append(a["de"])

    frentes = _frentes(esp)
    faltan = _faltan(esp)
    etapas = _etapas()
    abiertas = [c for c, n in nodos.items() if n["tipo"] == "pregunta abierta"]

    return {
        "generado": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "nodos": nodos,
        "aristas": aristas,
        "frentes": frentes,
        "faltan": faltan,
        "etapas": etapas,
        "bitacora": _bitacora(),
        "telemetria": {
            "por_tipo": {t: sum(1 for n in nodos.values() if n["tipo"] == t)
                         for t in sorted({n["tipo"] for n in nodos.values()})},
            "preguntas_abiertas": len(abiertas),
            "datos_que_faltan": len(faltan),
            "datos_que_no_pueden_esperar": sum(1 for f in faltan if f["va_primero"]),
            "huerfanos_arriba": sorted(
                {a["a"] for a in aristas if a["a"] not in nodos}),
            "huerfanos_abajo": sorted(
                c for c, n in nodos.items()
                if not n.get("citado_por") and n["tipo"] in ("principio", "cualidad")),
        },
    }


def rebanada(g, codigo):
    """
    Todo lo que toca un código, y nada más.

    Es la razón de ser de este archivo: en vez de leer 18.000 palabras para
    entender una regla, se leen las diez líneas que la rodean en el grafo.
    """
    if codigo not in g["nodos"]:
        return None
    vecinos = {codigo}
    for a in g["aristas"]:
        if a["de"] == codigo:
            vecinos.add(a["a"])
        if a["a"] == codigo:
            vecinos.add(a["de"])
    return {
        "centro": codigo,
        "nodos": {c: g["nodos"][c] for c in sorted(vecinos) if c in g["nodos"]},
        "frentes": [f for f in g["frentes"] if codigo in f["codigos"]],
    }


def rebanada_frente(g, orden):
    """Todo lo que hace falta para construir un frente, y nada más."""
    f = next((x for x in g["frentes"] if x["orden"] == orden), None)
    if not f:
        return None
    # Un solo salto, y a propósito.
    #
    # A dos saltos la rebanada deja de rebanar: con 63 nodos trajo 53. La razón
    # es que los principios son **concentradores** —los cita todo el mundo— así
    # que pasar por uno lleva al resto del documento. Un salto desde los códigos
    # del frente da lo que hace falta para construirlo; lo demás es contexto que
    # se pide aparte si se necesita.
    nucleo = set(f["codigos"])
    vecinos = set(nucleo)
    for a in g["aristas"]:
        if a["de"] in nucleo:
            vecinos.add(a["a"])
        if a["a"] in nucleo:
            vecinos.add(a["de"])
    return {
        "frente": f,
        "nodos": {c: g["nodos"][c] for c in sorted(vecinos) if c in g["nodos"]},
        "faltan": [x for x in g["faltan"]
                   if any(c in x["desbloquea"] for c in f["codigos"])],
    }
