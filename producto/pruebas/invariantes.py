"""
¿Las invariantes se cumplen en la base, o solo en los comentarios?

`AGENTS.md` §8 lo dice: una invariante baja hasta donde **se vuelve imposible**,
no hasta donde se valida. Una que solo vive en una acción de servidor es una que
un `curl` rompe.

Entonces esto no comprueba que el servidor las respete: comprueba que **la base
las rechaza**. Cada caso intenta violarlas y pasa cuando Postgres se niega.

Los casos salen de la §9 de la especificación y de los criterios de `DAT-01`,
`GEO-01` y `NEC-01`, con el resultado calculado a mano.
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]


def cliente():
    if shutil.which("psql"):
        url = os.environ.get("DB_URL", "postgresql://postgres:postgres@127.0.0.1:54822/postgres")
        return ["psql", url]
    c = os.environ.get("DB_CONTENEDOR", "supabase_db_participacion")
    return ["docker", "exec", "-i", c, "psql", "-U", "postgres", "-d", "postgres"]


def correr(sql):
    r = subprocess.run([*cliente(), "-v", "ON_ERROR_STOP=1", "-qAt", "-f", "-"],
                       input=sql, capture_output=True, text=True)
    return r.returncode, r.stdout.strip(), r.stderr.strip()


PREPARA = """
begin;
select id as proceso from participacion.proceso limit 1 \\gset
"""

# (nombre, sql, ¿debe ser rechazado?, qué invariante protege)
CASOS = [
    ("I1 · un reintento con la misma clave no crea otro aporte",
     """insert into participacion.aporte (proceso_id, clave_envio, relato_original, canal)
        select id, 'k-igual', 'el agua no llega', 'web' from participacion.proceso limit 1;
        insert into participacion.aporte (proceso_id, clave_envio, relato_original, canal)
        select id, 'k-igual', 'el agua no llega', 'web' from participacion.proceso limit 1;""",
     True, "I1"),

    ("I1 · dos personas en el mismo equipo SÍ crean dos aportes",
     """insert into participacion.aporte (proceso_id, clave_envio, relato_original, canal)
        select id, 'k-uno', 'el agua no llega', 'web' from participacion.proceso limit 1;
        insert into participacion.aporte (proceso_id, clave_envio, relato_original, canal)
        select id, 'k-dos', 'no hay transporte', 'web' from participacion.proceso limit 1;""",
     False, "I1"),

    ("I2 · una ubicación «por aclarar» no puede llevar código",
     """insert into participacion.aporte (proceso_id, clave_envio, relato_original, canal)
        select id, 'k-i2a', 'agua', 'web' from participacion.proceso limit 1;
        insert into participacion.ubicacion (proceso_id, aporte_id, estado, territorio_codigo, territorio_version)
        select p.id, a.id, 'por_aclarar', '05001', 'junio 2026'
        from participacion.proceso p, participacion.aporte a where a.clave_envio='k-i2a' limit 1;""",
     True, "I2"),

    ("I2 · una ubicación «confirmada» no puede ir sin código",
     """insert into participacion.aporte (proceso_id, clave_envio, relato_original, canal)
        select id, 'k-i2b', 'agua', 'web' from participacion.proceso limit 1;
        insert into participacion.ubicacion (proceso_id, aporte_id, estado)
        select p.id, a.id, 'confirmada'
        from participacion.proceso p, participacion.aporte a where a.clave_envio='k-i2b' limit 1;""",
     True, "I2"),

    ("I2 · «por aclarar» sin código sí se acepta, que es el caso normal",
     """insert into participacion.aporte (proceso_id, clave_envio, relato_original, canal, lugar_declarado)
        select id, 'k-i2c', 'agua', 'web', 'cerca de San José' from participacion.proceso limit 1;
        insert into participacion.ubicacion (proceso_id, aporte_id, estado)
        select p.id, a.id, 'por_aclarar'
        from participacion.proceso p, participacion.aporte a where a.clave_envio='k-i2c' limit 1;""",
     False, "I2"),

    ("I4 · un vínculo aporte→expediente no puede ir sin motivo",
     """insert into participacion.aporte (proceso_id, clave_envio, relato_original, canal)
        select id, 'k-i4', 'agua', 'web' from participacion.proceso limit 1;
        insert into participacion.expediente (proceso_id, descripcion)
        select id, 'baja presión en la parte alta' from participacion.proceso limit 1;
        insert into participacion.vinculo_aporte_expediente (proceso_id, aporte_id, expediente_id, autor)
        select p.id, a.id, e.id, 'revisora'
        from participacion.proceso p, participacion.aporte a, participacion.expediente e
        where a.clave_envio='k-i4' limit 1;""",
     True, "I4"),

    ("I4 · un aporte SÍ puede alimentar dos expedientes",
     """insert into participacion.aporte (proceso_id, clave_envio, relato_original, canal)
        select id, 'k-dos-exp', 'agua contaminada y no hay transporte escolar', 'web'
        from participacion.proceso limit 1;
        insert into participacion.expediente (proceso_id, descripcion)
        select id, 'agua contaminada' from participacion.proceso limit 1;
        insert into participacion.expediente (proceso_id, descripcion)
        select id, 'transporte escolar' from participacion.proceso limit 1;
        insert into participacion.vinculo_aporte_expediente (proceso_id, aporte_id, expediente_id, autor, motivo)
        select p.id, a.id, e.id, 'revisora', 'el relato menciona las dos'
        from participacion.proceso p, participacion.aporte a, participacion.expediente e
        where a.clave_envio='k-dos-exp';""",
     False, "V12"),

    ("catálogo · un código que no compone con su padre se rechaza",
     """insert into participacion.territorio (codigo, version, nivel, nombre, padre)
        values ('99001', 'junio 2026', 'municipio', 'INVENTADO', '05');""",
     True, "R1"),

    ("catálogo · un municipio con código de 4 dígitos se rechaza",
     """insert into participacion.territorio (codigo, version, nivel, nombre)
        values ('0500', 'junio 2026', 'municipio', 'CORTO');""",
     True, "R1"),

    ("catálogo · un país con código de dígitos se rechaza",
     """insert into participacion.territorio (codigo, version, nivel, nombre)
        values ('05', 'CLDR 48.0', 'pais', 'INVENTADO');""",
     True, "Q5"),

    ("catálogo · un departamento con código de letras se rechaza",
     """insert into participacion.territorio (codigo, version, nivel, nombre)
        values ('ES', 'junio 2026', 'departamento', 'INVENTADO');""",
     True, "Q5"),

    ("contacto · internacional con código de municipio se rechaza",
     """insert into participacion.aporte
          (proceso_id, clave_envio, relato_original, canal,
           contacto_ambito, contacto_codigo, contacto_version)
        select id, 'k-con-1', 'la vía está rota', 'web', 'internacional', '05001', 'junio 2026'
        from participacion.proceso limit 1;""",
     True, "I2"),

    ("contacto · un código sin versión de catálogo se rechaza",
     """insert into participacion.aporte
          (proceso_id, clave_envio, relato_original, canal,
           contacto_ambito, contacto_codigo)
        select id, 'k-con-2', 'la vía está rota', 'web', 'internacional', 'ES'
        from participacion.proceso limit 1;""",
     True, "Q5"),

    ("contacto · un aporte sin decir desde dónde se acepta",
     """insert into participacion.aporte (proceso_id, clave_envio, relato_original, canal)
        select id, 'k-con-3', 'la vía está rota', 'web'
        from participacion.proceso limit 1;""",
     False, "N02"),

    ("proceso · un compromiso fuera de los tres se rechaza",
     """insert into participacion.proceso (nombre, compromiso)
        values ('otro', 'vinculante');""",
     True, "Q17"),

    ("retiro · retirar sin motivo se rechaza",
     """insert into participacion.aporte (proceso_id, clave_envio, relato_original, canal, retirado_en)
        select id, 'k-ret', 'agua', 'web', now() from participacion.proceso limit 1;""",
     True, "V11"),
]


def main():
    fallos = []
    for nombre, sql, debe_fallar, codigo in CASOS:
        rc, _, err = correr("begin;\n" + sql + "\nrollback;")
        rechazado = rc != 0
        ok = rechazado == debe_fallar
        marca = "ok   " if ok else "FALLA"
        print(f"  {marca} [{codigo}] {nombre}")
        if not ok:
            linea = next((l for l in err.splitlines() if "ERROR" in l), err[:160])
            esperado = "que la base lo rechazara" if debe_fallar else "que la base lo aceptara"
            fallos.append(f"{nombre}: se esperaba {esperado}. {linea}")

    # La auditoría no se puede editar: no lanza error, simplemente no hace nada.
    correr("""insert into participacion.auditoria (proceso_id, actor, accion, entidad)
              select id, 'prueba', 'crear', 'aporte' from participacion.proceso limit 1;""")
    _, antes, _ = correr("select count(*) from participacion.auditoria;")
    correr("delete from participacion.auditoria;")
    _, despues, _ = correr("select count(*) from participacion.auditoria;")
    ok = antes == despues and int(antes or 0) > 0
    print(f"  {'ok   ' if ok else 'FALLA'} [C1] auditoría · un delete no borra nada")
    if not ok:
        fallos.append(f"la auditoría se pudo borrar: {antes} → {despues}")
    correr("truncate participacion.auditoria;")  # truncate sí, que es lo que la regla no cubre

    print()
    if fallos:
        print(f"{len(fallos)} invariantes no se cumplen en la base:")
        for f in fallos:
            print(f"  - {f}")
        return 1
    print(f"Las {len(CASOS) + 1} comprobaciones pasan: la base rechaza lo que debe rechazar.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
