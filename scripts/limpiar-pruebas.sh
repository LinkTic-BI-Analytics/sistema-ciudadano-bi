#!/usr/bin/env bash
# Se lleva lo que dejaron las pruebas en la base local.
#
# **La auditoría no se toca, y eso no es una limitación: es la invariante.** Una
# auditoría que se puede borrar no es una auditoría, y la regla de Postgres que
# lo impide hizo fallar la primera versión de este guion. Se adaptó el guion, no
# la regla.
#
# Consecuencia: un proceso de prueba con asientos de auditoría **no se puede
# borrar** —la clave foránea lo sostiene—, así que se **retira**, que es lo que
# el propio modelo dice que se hace con todo (borrado lógico, V11).
#
# Existe porque ya pasó dos veces: datos residuales de una prueba hicieron fallar
# a la de al lado, y el síntoma —una clave duplicada— no se parecía a la causa.
set -euo pipefail
C=${DB_CONTENEDOR:-supabase_db_participacion}
docker exec -i "$C" psql -U postgres -d postgres -qAt <<'SQL'
begin;
create temporary table _p on commit drop as
  select id from participacion.proceso
  where nombre like 'ESCENARIO DE PRUEBA%'
    and nombre <> 'ESCENARIO DE PRUEBA — no es un proceso real';

delete from participacion.alerta      where proceso_id in (select id from _p);
delete from participacion.actuacion   where proceso_id in (select id from _p);
delete from participacion.expediente_territorio
 where expediente_id in (select id from participacion.expediente where proceso_id in (select id from _p));
delete from participacion.vinculo_aporte_expediente where proceso_id in (select id from _p);
delete from participacion.ubicacion  where proceso_id in (select id from _p);
delete from participacion.sintesis   where proceso_id in (select id from _p);
delete from identidad.comprobante    where proceso_id in (select id from _p);
delete from identidad.contacto       where proceso_id in (select id from _p);
delete from participacion.expediente where proceso_id in (select id from _p);
delete from participacion.aporte     where proceso_id in (select id from _p);

-- El proceso se RETIRA, no se borra: sus asientos de auditoría lo sostienen, y
-- esos no se van. Es el borrado lógico que V11 fijó para todo.
update participacion.proceso
   set retirado_en = now(), retirado_motivo = 'escenario de prueba, limpiado'
 where id in (select id from _p) and retirado_en is null;

select 'retirados ' || count(*) || ' procesos de prueba; la auditoría se queda, como debe'
  from _p;
commit;
SQL
