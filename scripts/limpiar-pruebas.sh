#!/usr/bin/env bash
# Se lleva lo que dejaron las pruebas en la base local.
#
# Las pruebas limpian lo suyo, pero una que falla a mitad no alcanza a hacerlo.
# Esto existe porque ya pasó dos veces: datos residuales de una prueba hicieron
# fallar a la de al lado, y el síntoma —una clave duplicada— no se parecía en
# nada a la causa.
#
# Solo toca lo que se llama ESCENARIO DE PRUEBA. Si algún día borra otra cosa,
# es que alguien le puso ese nombre a algo de verdad.
set -euo pipefail
C=${DB_CONTENEDOR:-supabase_db_participacion}
docker exec -i "$C" psql -U postgres -d postgres -qAt <<'SQL'
with p as (
  select id from participacion.proceso
  where nombre like 'ESCENARIO DE PRUEBA%' and nombre <> 'ESCENARIO DE PRUEBA — no es un proceso real'
), a as (
  select id from participacion.aporte where proceso_id in (select id from p)
), e as (
  select id from participacion.expediente where proceso_id in (select id from p)
), d1 as (delete from participacion.expediente_territorio where expediente_id in (select id from e) returning 1),
   d2 as (delete from participacion.vinculo_aporte_expediente where proceso_id in (select id from p) returning 1),
   d3 as (delete from participacion.ubicacion where proceso_id in (select id from p) returning 1),
   d4 as (delete from participacion.sintesis where proceso_id in (select id from p) returning 1),
   d5 as (delete from participacion.auditoria where proceso_id in (select id from p) returning 1),
   d6 as (delete from participacion.expediente where id in (select id from e) returning 1),
   d7 as (delete from participacion.aporte where id in (select id from a) returning 1),
   d8 as (delete from participacion.proceso where id in (select id from p) returning 1)
select 'limpiados: ' || (select count(*) from d7) || ' aportes, '
                     || (select count(*) from d6) || ' expedientes, '
                     || (select count(*) from d8) || ' procesos de prueba';
SQL
