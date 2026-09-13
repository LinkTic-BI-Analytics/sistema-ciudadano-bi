"""
DIVIPOLA del DANE: de los tres `.xlsx` a tres `.csv` sembrables.

**La fuente es `geoportal.dane.gov.co`, no una republicación.** En datos.gov.co
hay una copia de los municipios atribuida a una gobernación departamental, con
corte a diciembre de 2024; el geoportal del DANE publica junio de 2026. Para un
catálogo del que dependen todos los agregados territoriales, la procedencia no
es un detalle.

Los `.xlsx` se conservan **tal como se bajaron**. Este archivo no los edita:
produce un `.csv` al lado y anota de dónde salió cada uno.

## Lo que hay que saber de la forma del archivo

La hoja de datos **no es la primera** —la primera es `ESRI_MAPINFO_SHEET`, que es
metadato de la herramienta con que se exportó—. Y la tabla no empieza en la fila
1: arriba hay un título con la versión, y abajo notas al pie sobre deslindes y
municipios en verificación. Las notas se conservan en el LEEME: explican por qué
un código puede moverse.

## Los códigos

    departamento     2 dígitos          05
    municipio        2 + 3 = 5          05001
    centro poblado   5 + 3 = 8          05001000

El de centro poblado pasó de 2 a 3 dígitos en 1997. Un código histórico escrito
antes de ese cambio significa otra cosa, y por eso **la versión viaja con el
dato**, no en una tabla aparte (`AGENTS.md` §9, `Q5`).
"""

import csv
import re
import sys
from pathlib import Path

import openpyxl

RAIZ = Path(__file__).resolve().parents[2]
DIR = RAIZ / "producto/datos/divipola"

# archivo, hoja, primera fila de datos, columnas que se conservan (índice → nombre)
FUENTES = [
    ("DIVIPOLA_Departamentos", "Departamentos", 11,
     {0: "cod_departamento", 1: "departamento", 2: "latitud", 3: "longitud"}),
    ("DIVIPOLA_Municipios", "Municipios", 12,
     {0: "cod_departamento", 1: "departamento", 2: "cod_municipio", 3: "municipio",
      4: "tipo", 5: "longitud", 6: "latitud", 7: "nota"}),
    ("DIVIPOLA_CentrosPoblados", "Cabeceras - Centros Poblados", 12,
     {0: "cod_departamento", 1: "departamento", 2: "cod_municipio", 3: "municipio",
      4: "cod_centro_poblado", 5: "centro_poblado", 6: "tipo", 7: "longitud",
      8: "latitud", 9: "nota"}),
]

LARGO = {"cod_departamento": 2, "cod_municipio": 5, "cod_centro_poblado": 8}


def version(ws):
    """La versión sale del título de la hoja. Si no está, se para.

    Un catálogo sin versión no se puede sembrar: `R2` exige que un corte
    exportado siga siendo reproducible, y sin saber contra qué versión se
    escribió un código no se puede.
    """
    for fila in ws.iter_rows(max_row=9, values_only=True):
        for celda in fila:
            if celda and "DIVIPOLA" in str(celda):
                m = re.search(r"DIVIPOLA\s+(.+)$", str(celda).strip())
                if m:
                    return m.group(1).strip()
    raise SystemExit("No se encontró la versión en el título. No se siembra sin versión.")


def limpiar(valor, columna):
    if valor is None:
        return ""
    v = str(valor).strip()
    # Excel se come el cero de la izquierda en los códigos. Se repone por largo.
    if columna in LARGO and v and not v.startswith("#"):
        v = v.zfill(LARGO[columna])
    return v


def main():
    versiones, resumen = set(), []
    for archivo, hoja, desde, columnas in FUENTES:
        origen = DIR / f"{archivo}.xlsx"
        if not origen.exists():
            raise SystemExit(f"Falta {origen.name}. Corre ./scripts/divipola.sh --bajar")
        wb = openpyxl.load_workbook(origen, read_only=True, data_only=True)
        ws = wb[hoja]
        versiones.add(version(ws))

        filas = []
        for n, fila in enumerate(ws.iter_rows(values_only=True), 1):
            if n < desde:
                continue
            cod = limpiar(fila[0] if fila else None, "cod_departamento")
            # Las notas al pie viven en la misma columna que los datos y no
            # tienen código de dos dígitos. Es cómo se sabe dónde termina la tabla.
            if not re.fullmatch(r"\d{2}", cod):
                continue
            filas.append({nombre: limpiar(fila[i], nombre) for i, nombre in columnas.items()})
        wb.close()

        destino = DIR / f"{archivo.replace('DIVIPOLA_', '').lower()}.csv"
        with destino.open("w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=list(columnas.values()))
            w.writeheader()
            w.writerows(filas)
        resumen.append((destino.name, len(filas)))

    if len(versiones) != 1:
        raise SystemExit(f"Los tres archivos no son de la misma versión: {versiones}")
    v = versiones.pop()

    print(f"  versión DIVIPOLA: {v}")
    for nombre, n in resumen:
        print(f"  {nombre:22} {n:>6} filas")
    (DIR / "VERSION").write_text(v + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
