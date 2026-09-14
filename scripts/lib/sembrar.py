"""
Siembra: un proceso y el catálogo territorial.

**Lo único que se inventa a propósito es el proceso**, y es la excepción que
`AGENTS.md` §3 permite: los datos de la cuenta demo no son datos del negocio, son
un escenario para poder mirar. Su nombre lo dice en voz alta.

El catálogo no se inventa: sale de `producto/datos/divipola/`, que viene del
geoportal del DANE con su versión.
"""

import csv
import os
import shutil
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
DIV = RAIZ / "producto/datos/divipola"


def _cliente():
    """psql de la máquina si existe; si no, el del contenedor.

    No hace falta instalar Postgres en la máquina para trabajar contra la base
    local: el contenedor ya trae su cliente. Y el identificador del contenedor es
    el del proyecto, que se escogió para no chocar con los otros cinco de esta
    máquina (`AGENTS.md` §11).
    """
    if shutil.which("psql"):
        url = os.environ.get("DB_URL", "postgresql://postgres:postgres@127.0.0.1:54822/postgres")
        return ["psql", url]
    contenedor = os.environ.get("DB_CONTENEDOR", "supabase_db_participacion")
    return ["docker", "exec", "-i", contenedor, "psql", "-U", "postgres", "-d", "postgres"]


def psql(sql):
    r = subprocess.run([*_cliente(), "-v", "ON_ERROR_STOP=1", "-qAt", "-f", "-"],
                       input=sql, capture_output=True, text=True)
    if r.returncode:
        raise SystemExit(f"psql falló:\n{r.stderr.strip()[:600]}")
    return r.stdout.strip()


def escapar(v):
    return "NULL" if v in (None, "") else "'" + v.replace("'", "''") + "'"


def main():
    version = (DIV / "VERSION").read_text(encoding="utf-8").strip()

    proceso = psql("""
        insert into participacion.proceso (nombre, compromiso, entidad)
        values ('ESCENARIO DE PRUEBA — no es un proceso real', 'consulta', null)
        on conflict do nothing
        returning id;
    """) or psql("select id from participacion.proceso limit 1;")
    print(f"  proceso sembrado: {proceso}")

    # Padre primero: la clave foránea apunta hacia arriba dentro de la misma versión.
    niveles = [
        ("departamentos.csv",   "departamento",   "cod_departamento",   "departamento",   None, None),
        ("municipios.csv",      "municipio",      "cod_municipio",      "municipio",      "cod_departamento", "tipo"),
        ("centrospoblados.csv", "centro_poblado", "cod_centro_poblado", "centro_poblado", "cod_municipio",    "tipo"),
    ]
    for archivo, nivel, col_cod, col_nom, col_padre, col_tipo in niveles:
        filas = list(csv.DictReader((DIV / archivo).open(encoding="utf-8")))
        valores = []
        for f in filas:
            lat, lon = f.get("latitud", ""), f.get("longitud", "")
            valores.append(
                f"({escapar(f[col_cod])},{escapar(version)},{escapar(nivel)},"
                f"{escapar(f[col_nom])},{escapar(f.get(col_tipo, '') if col_tipo else '')},"
                f"{escapar(f.get(col_padre, '') if col_padre else '')},"
                f"{lat or 'NULL'},{lon or 'NULL'})"
            )
        # En bloques: una sentencia de 8.500 valores es un mensaje que psql no
        # pasa por la línea de comandos.
        for i in range(0, len(valores), 1000):
            psql("insert into participacion.territorio "
                 "(codigo, version, nivel, nombre, tipo, padre, latitud, longitud) values "
                 + ",".join(valores[i:i + 1000])
                 + " on conflict do nothing;")
        print(f"  {nivel:<15} {len(filas):>5} filas")

    print("  " + psql(
        "select 'total: ' || count(*) || ' territorios en la versión ' || max(version) "
        "from participacion.territorio;"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
