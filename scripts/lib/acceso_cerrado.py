"""
¿Alguna tabla quedó sin acceso a nivel de fila?

Apareció al agregar `actuacion`: los permisos vivían en un archivo que corría
antes que la tabla, así que nació abierta. El síntoma fue «permission denied» al
leerla desde el servidor — y lo peligroso es el caso contrario, una tabla que
nace **sin** el interruptor puesto y nadie se entera porque todo funciona.

Enumerar las tablas a mano es cómo se olvida una. Esto las recorre.
"""

import os
import shutil
import subprocess
import sys

SQL = """
select schemaname || '.' || tablename
from pg_tables t
where schemaname in ('participacion','identidad')
  and not exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = t.schemaname and c.relname = t.tablename and c.relrowsecurity
  )
order by 1;
"""


def main():
    if shutil.which("psql"):
        url = os.environ.get("DB_URL", "postgresql://postgres:postgres@127.0.0.1:54822/postgres")
        cliente = ["psql", url]
    else:
        c = os.environ.get("DB_CONTENEDOR", "supabase_db_participacion")
        cliente = ["docker", "exec", "-i", c, "psql", "-U", "postgres", "-d", "postgres"]

    r = subprocess.run([*cliente, "-qAt", "-f", "-"], input=SQL, capture_output=True, text=True)
    if r.returncode:
        print("no se pudo consultar la base")
        return 1
    abiertas = [l for l in r.stdout.strip().splitlines() if l]
    if abiertas:
        print(f"{len(abiertas)} tablas sin acceso a nivel de fila — nacen abiertas:")
        for a in abiertas:
            print(f"  {a}")
        return 1

    r2 = subprocess.run([*cliente, "-qAt", "-c",
        "select count(*) from pg_tables where schemaname in ('participacion','identidad');"],
        capture_output=True, text=True)
    print(f"las {r2.stdout.strip()} tablas tienen el acceso a nivel de fila encendido")
    return 0


if __name__ == "__main__":
    sys.exit(main())
