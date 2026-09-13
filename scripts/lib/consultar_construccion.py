"""
El reporte de la construcción, en los ocho puntos de siempre.

`metodo/construccion-solida-y-paralela.md` §10 fija el orden y no se cambia: el
valor de un reporte corto está en que se lee igual todos los días, y el ojo sabe
dónde mirar sin leerlo entero.

Termina en **una sola decisión**. Un reporte que termina en cinco cosas por hacer
no ayudó a decidir nada.

    ./scripts/construccion.sh            el reporte
    ./scripts/construccion.sh --json     el estado entero, para quien lo consuma
    ./scripts/construccion.sh --agentes  solo qué está andando ahora mismo
    ./scripts/construccion.sh --revisar  solo las contradicciones; devuelve 1 si hay
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import construccion as C  # noqa: E402

RAIZ = C.RAIZ


def _t(estado, ident):
    for t in estado["tareas"]:
        if t["id"] == ident:
            return t
    return None


def _objetivo():
    if not C.HOJA.exists():
        return "—"
    lineas = C.HOJA.read_text(encoding="utf-8").splitlines()
    for i, linea in enumerate(lineas):
        if not linea.startswith("**Objetivo vigente:**"):
            continue
        partes = [linea.split("**", 2)[2].strip()]
        for sig in lineas[i + 1:]:
            if not sig.strip() or sig.startswith("**"):
                break
            partes.append(sig.strip())
        return " ".join(partes)
    return "—"


def informe(estado):
    o = []
    w = o.append

    # 1 · Objetivo
    w(f"**Objetivo vigente.** {_objetivo()}")
    w("")

    # 2 · Dónde vamos
    pe = estado["por_estado"]
    total = len(estado["tareas"])
    w(
        f"**Dónde vamos.** {len(pe['terminado'])} de {total} terminadas. "
        f"{len(pe['listo'])} listas, {len(pe['candidato'])} todavía candidatas, "
        f"{len(pe['bloqueado'])} bloqueadas."
    )
    mods = estado["modulos"]
    if not mods:
        w(
            "  Ningún módulo ha pasado el sobre cerrado, así que **ninguna tarea tiene "
            "autoridad de verdad todavía** (ADR 0011, nivel 2 de la cadena)."
        )
    else:
        for k, m in sorted(mods.items()):
            sc = m["sobre_cerrado"]
            w(f"  {k}: sobre cerrado {sc['marcadas']}/{sc['totales']}")
    w("")

    # 3 · En construcción — y quién está andando
    w("**En construcción.**")
    activas = [t for t in estado["tareas"] if t["estado"] in C.ACTIVOS]
    if not activas:
        w("  Nada. Ninguna tarea está en manos de nadie ahora mismo.")
    for t in activas:
        w(f"  {t['id']} · línea {t['linea']} · {t['propietario']} · {t['estado']}")
        w(f"      {t['resultado']}")
    ag = estado["agentes"]
    if ag:
        w("")
        w(f"  Agentes andando: {len(ag)}")
        for a in ag:
            d = a.get("dias_sin_commit")
            cuando = "sin commits todavía" if d is None else f"último commit hace {d} d"
            w(f"      {a.get('rama', '?')} · {cuando} · {a['ruta']}")
    else:
        w("  Sin worktrees aparte del principal: no hay trabajo aislado corriendo.")
    for nombre, p in estado["planes_de_superpowers"].items():
        w(
            f"  Plan «{nombre}»: {len(p['tareas_completas'])} tareas completas en el ledger"
            + (f", ronda de arreglo {p['ultima_ronda_de_arreglo']}" if p["ultima_ronda_de_arreglo"] else "")
        )
    w("")

    # 4 · Qué puede empezar ahora
    w("**Qué puede empezar ahora.**")
    listas = pe["listo"]
    if listas:
        for ident in listas:
            t = _t(estado, ident)
            w(f"  {ident} · línea {t['linea']} · {t['propietario']}")
            w(f"      {t['resultado']}")
    else:
        w("  Ninguna tarea en `listo`.")
    if estado["deberia_estar_listo"]:
        w("")
        w(
            "  Y estas están en `candidato` pero ya cumplen todo — trabajo que se puede "
            "empezar hoy y el tablero no lo dice:"
        )
        for ident in estado["deberia_estar_listo"]:
            w(f"      {ident} — {_t(estado, ident)['resultado']}")
    if estado["listas_sin_contrato"]:
        w("")
        w("  Listas, pero **no despachables a un agente** hasta que tengan contrato:")
        for c in estado["listas_sin_contrato"]:
            w(f"      {c['id']} — " + "; ".join(c["falta"]))
    par = [p for p in estado["paralelismo"]["pares"] if p["decision"] == "paralelo"]
    if par:
        w("")
        w(f"  Pares que sí pueden ir a la vez: " + ", ".join("+".join(p["par"]) for p in par[:8]))
    w("")

    # 5 · Bloqueos
    w("**Bloqueos.**")
    if not estado["bloqueos"]:
        w("  Ninguno declarado.")
    for b in estado["bloqueos"]:
        w(f"  {b['id']} · línea {b['linea']} — {b['resultado']}")
    v = estado["vacios"]
    if v["archivo"] and v["abiertas"]:
        w(
            f"  Hay {v['abiertas']} preguntas abiertas en `{v['archivo']}`. "
            "Una tarea que dependa de una de ellas **no pasa de candidato** por muy lista "
            "que se vea (guía §13, «paralelizar antes de decidir»)."
        )
    w("")

    # 6 · Ruta crítica
    rc = estado["ruta_critica"]
    w("**Ruta crítica.** " + (" → ".join(rc) if rc else "—"))
    if rc:
        w(
            f"  {len(rc)} tareas. Es el tiempo mínimo restante y **ninguna cantidad de "
            "agentes en paralelo lo acorta.**"
        )
    if estado["ciclos"]:
        w("  ⚠ Hay ciclos en el grafo: " + "; ".join(" → ".join(c) for c in estado["ciclos"]))
    w("")

    # 7 · Deterioro
    w("**Se está deteriorando.**")
    det = estado["deterioro"]
    if not det:
        w("  Nada. Ninguna tarea lleva más tiempo del debido en su estado.")
    for d in det:
        w(f"  {d['id']} · {d['por_que']}")
    contra = estado["dice_listo_pero_no"]
    if contra:
        w("")
        w("  **Contradicciones del tablero** — dicen estar listas y les falta algo:")
        for c in contra:
            w(f"      {c['id']} (dice «{c['estado']}»): " + "; ".join(c["falta"]))
    for q in estado["defectos_del_tablero"]:
        w(f"  ⚠ {q}")
    for h in estado["dependencias_huerfanas"]:
        w(f"  ⚠ {h}")
    sin = estado["paralelismo"]["sin_superficie_declarada"]
    if sin:
        w(
            "  Sin superficie declarada (no se pueden paralelizar con nada): "
            + ", ".join(sin)
        )
    cob = estado["cobertura"]
    if cob["comprobable"]:
        if cob["codigos_sin_tarea"]:
            w("  Códigos del módulo sin ninguna tarea: " + ", ".join(cob["codigos_sin_tarea"]))
        if cob["tareas_sin_autoridad"]:
            w("  Tareas sin autoridad: " + ", ".join(cob["tareas_sin_autoridad"]))
    w("")

    # 8 · Siguiente decisión — una sola
    w("**Siguiente.** " + siguiente(estado))
    return "\n".join(o)


def siguiente(estado):
    """Una sola acción. En orden de qué duele más si se deja.

    El orden no es caprichoso: primero lo que hace que el tablero mienta, porque
    un tablero que miente hace que todo lo demás se decida mal.
    """
    if estado["defectos_del_tablero"]:
        return "arreglar el tablero: " + estado["defectos_del_tablero"][0]
    if estado["ciclos"]:
        c = estado["ciclos"][0]
        return f"romper el ciclo {' → '.join(c)}: mientras exista, no hay ruta crítica de verdad."
    if estado["dice_listo_pero_no"]:
        c = estado["dice_listo_pero_no"][0]
        return (
            f"{c['id']} dice «{c['estado']}» y {c['falta'][0]}. "
            "Alguien la va a despachar creyendo que está lista."
        )
    if estado["deterioro"]:
        d = estado["deterioro"][0]
        return f"{d['id']}: {d['por_que']}."
    if estado["listas_sin_contrato"]:
        c = estado["listas_sin_contrato"][0]
        return (
            f"escribir el contrato de {c['id']} con `plantillas/tarea.md`. "
            "Sin superficie declarada no se puede despachar a nadie."
        )
    if estado["bloqueos"]:
        b = estado["bloqueos"][0]
        return f"destrabar {b['id']} — o confirmar qué sí se puede construir sin esa respuesta."
    if estado["deberia_estar_listo"]:
        ids = ", ".join(estado["deberia_estar_listo"])
        return f"pasar a `listo` lo que ya cumple todo: {ids}."
    rc = estado["ruta_critica"]
    if rc:
        t = _t(estado, rc[0])
        return f"{rc[0]} — es la cabeza de la ruta crítica. {t['resultado']}"
    return "nada pendiente en el tablero."


def revisar(estado):
    """Solo las contradicciones. Devuelve 1 si hay alguna.

    Esto es lo que entra a `scripts/validar.sh`: un chequeo que hay que acordarse
    de correr no es un chequeo.
    """
    problemas = []
    problemas += [f"tablero: {q}" for q in estado["defectos_del_tablero"]]
    problemas += [f"dependencia huérfana: {h}" for h in estado["dependencias_huerfanas"]]
    problemas += [f"ciclo: {' → '.join(c)}" for c in estado["ciclos"]]
    problemas += [
        f"{c['id']} dice «{c['estado']}» pero: " + "; ".join(c["falta"])
        for c in estado["dice_listo_pero_no"]
    ]
    problemas += [
        f"se pisan {'+'.join(p['par'])}: " + ", ".join(p["comparten"])
        for p in estado["paralelismo"]["pares"]
        if p["comparten"] and not p["una_espera_a_la_otra"]
    ]
    cob = estado["cobertura"]
    if cob["comprobable"]:
        problemas += [f"código sin tarea: {c}" for c in cob["codigos_sin_tarea"]]
    return problemas


def main(argv):
    estado = C.recoger()

    if "--json" in argv:
        print(json.dumps(estado, ensure_ascii=False, indent=2))
        return 0

    destino = C.CONS / ".estado.json"
    destino.write_text(
        json.dumps(estado, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    C.escribir_bloque_derivado(estado)

    if "--revisar" in argv:
        problemas = revisar(estado)
        if not problemas:
            print("Sin contradicciones.")
            return 0
        print(f"{len(problemas)} contradicciones:")
        for p in problemas:
            print(f"  - {p}")
        return 1

    if "--agentes" in argv:
        ag = estado["agentes"]
        if not ag:
            print("Ningún worktree aparte del principal.")
        for a in ag:
            print(f"{a.get('rama','?'):24} {a['ruta']}")
        for n, p in estado["planes_de_superpowers"].items():
            print(f"plan {n}: {len(p['tareas_completas'])} completas · {p['archivo']}")
        return 0

    print(informe(estado))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
