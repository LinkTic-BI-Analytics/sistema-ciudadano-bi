"""
La matriz de paralelismo de `metodo/construccion-solida-y-paralela.md` §7.

Antes de lanzar dos tareas a la vez hay que poder responder si se pisan. La
respuesta no se opina: sale de la sección **Superficie asignada** del contrato de
cada una, que declara qué archivos va a crear y cuáles va a modificar.

Leer no cuenta. Dos tareas pueden leer el mismo archivo sin problema; el conflicto
aparece cuando las dos escriben.

Una tarea **sin contrato no aparece como «no se pisa»: aparece como «no se sabe»**.
Es la distinción que evita el peor de los dos errores — despachar dos agentes
creyendo que están separados porque ninguno declaró nada.

    ./scripts/paralelismo.sh          la matriz
    ./scripts/paralelismo.sh --duro   devuelve 1 si dos tareas activas se pisan
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import construccion as C  # noqa: E402


def main(argv):
    tareas, quejas = C.leer_tareas()
    contratos = C.leer_contratos()
    pares, sin_declarar = C.matriz_paralelismo(tareas, contratos)

    duro = "--duro" in argv
    chocan = [
        p for p in pares if p["comparten"] and not p["una_espera_a_la_otra"]
    ]

    if not duro:
        print("| Par | ¿Comparten archivos? | ¿Una espera a la otra? | Decisión |")
        print("|---|---|---|---|")
        for p in pares:
            comp = ", ".join(f"`{x}`" for x in p["comparten"]) if p["comparten"] else "no"
            esp = "sí" if p["una_espera_a_la_otra"] else "no"
            print(f"| {' / '.join(p['par'])} | {comp} | {esp} | **{p['decision']}** |")
        if not pares:
            print("| — | — | — | no hay dos tareas activas con superficie declarada |")
        if sin_declarar:
            print()
            print(
                "Sin superficie declarada, así que **no se puede decidir sobre ellas**: "
                + ", ".join(sin_declarar)
            )
        for q in quejas:
            print(f"⚠ {q}")

    if chocan:
        print()
        for p in chocan:
            print(
                f"SE PISAN {' y '.join(p['par'])}: "
                + ", ".join(p["comparten"])
                + " — o se redefine la superficie, o van secuenciales."
            )
        return 1
    if duro:
        print("Ninguna pareja de tareas activas se pisa.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
