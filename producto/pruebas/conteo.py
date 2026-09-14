"""
`R1` y `R2` contra los números que la especificación calculó a mano.

El caso es textual de la §9, y se copia entero porque es la autoridad:

  «corte con 10 aportes, 7 con municipio aceptado y 3 sin resolver. Total
   recibido=10; pendientes=3; ubicación resuelta=70%. **Si uno de los 7 tiene dos
   municipios, numerador sigue 7.** Al aclarar otro aporte se genera un corte
   nuevo 8/10, sin reescribir el corte exportado anterior.»

Las dos reglas son antiintuitivas, y por eso se prueban contra un número que
alguien sacó con la cabeza — nunca contra lo que devolvió la implementación
(`AGENTS.md` §7). Si la función y el documento no coinciden, **manda el
documento**.

Cada corrida siembra su propio escenario en una transacción y la deshace. No
deja rastro, y por lo tanto se puede correr las veces que haga falta.
"""

import os
import shutil
import subprocess
import sys


def cliente():
    if shutil.which("psql"):
        url = os.environ.get("DB_URL", "postgresql://postgres:postgres@127.0.0.1:54822/postgres")
        return ["psql", url]
    c = os.environ.get("DB_CONTENEDOR", "supabase_db_participacion")
    return ["docker", "exec", "-i", c, "psql", "-U", "postgres", "-d", "postgres"]


def correr(sql):
    r = subprocess.run([*cliente(), "-v", "ON_ERROR_STOP=1", "-qAt", "-F", "|", "-f", "-"],
                       input=sql, capture_output=True, text=True)
    if r.returncode:
        raise SystemExit("psql falló:\n" + r.stderr.strip()[:800])
    return [l for l in r.stdout.strip().splitlines() if l]


# El escenario de la §9, montado tal como lo describe.
#
# Diez aportes. A los siete primeros se les acepta un municipio; a los tres
# últimos se les deja la ubicación por aclarar, que es lo que `I2` obliga cuando
# la persona no pudo precisarla.
#
# Y al primero se le acepta un SEGUNDO municipio: es la trampa del caso, y lo que
# distingue contar aportes de contar vínculos.
ESCENARIO = """
begin;
-- Su propio proceso, no el sembrado. Contar sobre datos compartidos hace que
-- la prueba dependa de lo que dejó la de al lado, y entonces deja de probar las
-- reglas: prueba el orden en que se corrieron los archivos.
create temporary table _p on commit drop as
with nuevo as (
  insert into participacion.proceso (nombre, compromiso)
  values ('ESCENARIO DE PRUEBA — conteo', 'consulta')
  returning id
) select id from nuevo;

insert into participacion.aporte (proceso_id, clave_envio, relato_original, canal, lugar_declarado)
select (select id from _p), 'caso-' || n,
       'el agua no llega con presión suficiente', 'web', 'la parte alta'
from generate_series(1, 10) n;

-- Siete con municipio aceptado.
insert into participacion.ubicacion (proceso_id, aporte_id, estado, territorio_codigo, territorio_version, autor)
select (select id from _p), a.id, 'confirmada', m.codigo, m.version, 'revisora'
from participacion.aporte a
join lateral (
  select codigo, version from participacion.territorio
  where nivel = 'municipio' order by codigo
  offset (substring(a.clave_envio from 6)::int - 1) limit 1
) m on true
where a.clave_envio in ('caso-1','caso-2','caso-3','caso-4','caso-5','caso-6','caso-7');

-- Tres sin resolver. No llevan código: `I2` no admite un cuarto estado implícito.
insert into participacion.ubicacion (proceso_id, aporte_id, estado)
select (select id from _p), a.id, 'por_aclarar'
from participacion.aporte a
where a.clave_envio in ('caso-8','caso-9','caso-10');

-- **La trampa**: al primero se le acepta un segundo municipio.
insert into participacion.ubicacion (proceso_id, aporte_id, estado, territorio_codigo, territorio_version, autor)
select (select id from _p), a.id, 'confirmada', t.codigo, t.version, 'revisora'
from participacion.aporte a,
     lateral (select codigo, version from participacion.territorio
              where nivel='municipio' order by codigo offset 50 limit 1) t
where a.clave_envio = 'caso-1';
"""

# `R1`: un expediente que abarca dos municipios y reúne dos aportes sigue siendo
# UNA necesidad. Es la otra mitad del ejemplo de la especificación.
R1 = """
insert into participacion.expediente (proceso_id, descripcion)
select (select id from _p), 'baja presión de agua en la parte alta';

insert into participacion.expediente_territorio (proceso_id, expediente_id, territorio_codigo, territorio_version)
select (select id from _p), e.id, t.codigo, t.version
from participacion.expediente e,
     lateral (select codigo, version from participacion.territorio
              where nivel='municipio' order by codigo limit 2) t
where e.descripcion like 'baja presión%';

insert into participacion.vinculo_aporte_expediente (proceso_id, aporte_id, expediente_id, autor, motivo)
select (select id from _p), a.id, e.id, 'revisora', 'describen la misma afectación'
from participacion.aporte a, participacion.expediente e
where a.clave_envio in ('caso-1','caso-2') and e.descripcion like 'baja presión%';
"""

ACLARAR_UNO_MAS = """
update participacion.ubicacion ub
set estado = 'confirmada',
    territorio_codigo = t.codigo,
    territorio_version = t.version
from participacion.aporte a,
     lateral (select codigo, version from participacion.territorio
              where nivel='municipio' order by codigo offset 7 limit 1) t
where ub.aporte_id = a.id and a.clave_envio = 'caso-8' and ub.estado = 'por_aclarar';
"""

LEER = """
select aportes_recibidos, aportes_ubicados, aportes_pendientes,
       ubicacion_resuelta, municipios_con_aportes, necesidades
from participacion.indicadores((select id from _p));
"""


def main():
    salida = correr(
        ESCENARIO + R1
        + "\\echo ANTES\n" + LEER
        + "\\echo CORTE\n"
        + "select participacion.tomar_corte((select id from _p));\n"
        + ACLARAR_UNO_MAS
        + "\\echo DESPUES\n" + LEER
        + "\\echo CONGELADO\n"
        + "select (indicadores->>'aportes_ubicados') || '|' || (indicadores->>'ubicacion_resuelta')"
          " from participacion.corte order by tomado_en desc limit 1;\n"
        + "rollback;"
    )

    bloques = {}
    actual = None
    for linea in salida:
        if linea in ("ANTES", "CORTE", "DESPUES", "CONGELADO"):
            actual = linea
            bloques[actual] = []
        elif actual:
            bloques[actual].append(linea)

    antes = bloques["ANTES"][0].split("|")
    despues = bloques["DESPUES"][0].split("|")
    congelado = bloques["CONGELADO"][0].split("|")

    casos = [
        ("total recibido = 10",                          antes[0], "10"),
        ("ubicados = 7 — el de dos municipios cuenta UNO", antes[1], "7"),
        ("pendientes = 3",                               antes[2], "3"),
        ("ubicación resuelta = 70%",                     antes[3], "70.00"),
        ("R1 · un expediente en dos municipios es UNA necesidad", antes[5], "1"),
        ("al aclarar uno más: ubicados = 8",             despues[1], "8"),
        ("y el porcentaje pasa a 80%",                   despues[3], "80.00"),
        ("el corte anterior sigue diciendo 7",           congelado[0], "7"),
        ("y sigue diciendo 70% — no se reescribió",      congelado[1], "70.00"),
    ]

    fallos = []
    for nombre, obtenido, esperado in casos:
        ok = obtenido == esperado
        print(f"  {'ok   ' if ok else 'FALLA'} {nombre}")
        if not ok:
            fallos.append(f"{nombre}: la especificación dice {esperado}, la función devolvió {obtenido}")

    print()
    if fallos:
        print(f"{len(fallos)} cuentas no coinciden con los números calculados a mano:")
        for f in fallos:
            print(f"  - {f}")
        print("  Manda el documento, no la función.")
        return 1
    print(f"Las {len(casos)} cuentas coinciden con la §9 de la especificación.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
