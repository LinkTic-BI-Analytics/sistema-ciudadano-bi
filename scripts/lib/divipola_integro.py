"""
¿El catálogo territorial cuadra consigo mismo?

Se comprueba porque de él dependen `R1`, `R2` y todo agregado territorial. Un
código roto no se nota al mirarlo: se nota cuando un total nacional no cuadra con
la suma de sus partes, y para entonces ya hay un corte exportado.

Y se comprueba **antes de sembrar**, porque después el error queda en filas.
"""

import csv
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
DIR = RAIZ / "producto/datos/divipola"
LARGO = {"cod_departamento": 2, "cod_municipio": 5, "cod_centro_poblado": 8}


def main():
    if not (DIR / "municipios.csv").exists():
        print("el catálogo territorial todavía no está descargado")
        return 0

    leer = lambda n: list(csv.DictReader((DIR / n).open(encoding="utf-8")))
    dep, mun, cp = leer("departamentos.csv"), leer("municipios.csv"), leer("centrospoblados.csv")
    version = (DIR / "VERSION").read_text(encoding="utf-8").strip() if (DIR / "VERSION").exists() else None

    fallos = []
    if not version:
        fallos.append("no hay archivo VERSION: un catálogo sin versión no se puede sembrar")

    cd = {d["cod_departamento"] for d in dep}
    cm = {m["cod_municipio"] for m in mun}

    huerfanos = [m["cod_municipio"] for m in mun if m["cod_departamento"] not in cd]
    if huerfanos:
        fallos.append(f"{len(huerfanos)} municipios con departamento inexistente: {huerfanos[:5]}")
    huerfanos = [c["cod_centro_poblado"] for c in cp if c["cod_municipio"] not in cm]
    if huerfanos:
        fallos.append(f"{len(huerfanos)} centros poblados con municipio inexistente: {huerfanos[:5]}")

    for nombre, filas, col in (("municipios", mun, "cod_municipio"),
                               ("centros poblados", cp, "cod_centro_poblado")):
        dup = len(filas) - len({f[col] for f in filas})
        if dup:
            fallos.append(f"{dup} códigos duplicados en {nombre}")

    # El código de abajo empieza por el de arriba. Es la regla de composición de
    # DIVIPOLA, y si se rompe, agrupar por departamento deja de funcionar.
    malos = [m["cod_municipio"] for m in mun
             if len(m["cod_municipio"]) != LARGO["cod_municipio"]
             or not m["cod_municipio"].startswith(m["cod_departamento"])]
    if malos:
        fallos.append(f"{len(malos)} municipios cuyo código no compone con su departamento: {malos[:5]}")
    malos = [c["cod_centro_poblado"] for c in cp
             if len(c["cod_centro_poblado"]) != LARGO["cod_centro_poblado"]
             or not c["cod_centro_poblado"].startswith(c["cod_municipio"])]
    if malos:
        fallos.append(f"{len(malos)} centros poblados cuyo código no compone con su municipio: {malos[:5]}")

    for f in fallos:
        print(f)
    if fallos:
        return 1
    print(f"DIVIPOLA {version}: {len(dep)} departamentos, {len(mun)} municipios, "
          f"{len(cp)} centros poblados, sin referencias rotas")
    return 0


if __name__ == "__main__":
    sys.exit(main())
