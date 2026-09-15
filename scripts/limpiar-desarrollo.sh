#!/usr/bin/env bash
# Vacía la base local de TODO lo que no sea catálogo.
#
# Distinto de `limpiar-pruebas.sh`, que solo toca los procesos marcados como
# escenario. Los recorridos de navegador escriben en el proceso sembrado, y ahí
# se acumulan: la bandeja muestra **los 50 más antiguos**, así que tras unas
# corridas el aporte recién creado quedaba fuera de la lista y la prueba fallaba
# sin que nada estuviera roto.
#
# El síntoma fue que las corridas daban números distintos. Una prueba que a veces
# pasa no dice nada.
#
# **Solo para desarrollo.** El catálogo territorial y el proceso sembrado se
# quedan; todo lo demás se va.
set -euo pipefail
C=${DB_CONTENEDOR:-supabase_db_participacion}
docker exec -i "$C" psql -U postgres -d postgres -qAt <<'SQL'
begin;
-- Los encuentros que crean los recorridos, y sus materiales. La agenda
-- sembrada se queda: sin ella la portada no tiene qué mostrar.
--
-- Hace falta por lo mismo que la limpieza de aportes: la portada muestra seis
-- encuentros y las corridas acumulan, así que el recién creado se salía de la
-- lista y la prueba fallaba sin que nada estuviera roto.
delete from participacion.enlace
 where encuentro_id in (select id from participacion.encuentro where titulo like 'Mesa de prueba%');
delete from participacion.encuentro where titulo like 'Mesa de prueba%';

delete from participacion.prioridad_examen;
delete from participacion.actuacion;
delete from participacion.alerta;
delete from participacion.expediente_territorio;
delete from participacion.vinculo_aporte_expediente;
delete from participacion.expediente;
delete from participacion.sintesis;
delete from participacion.ubicacion;
delete from identidad.comprobante;
delete from identidad.contacto;
delete from participacion.aporte;
delete from participacion.enlace;
delete from participacion.transcripcion;
delete from participacion.grabacion;
-- La auditoría NO se borra: es append-only por regla y eso es la invariante.
-- Por eso los procesos de prueba se retiran en vez de borrarse.
update participacion.proceso
   set retirado_en = now(), retirado_motivo = 'escenario de prueba, limpiado'
 where nombre like 'ESCENARIO DE PRUEBA%'
   and nombre <> 'ESCENARIO DE PRUEBA — no es un proceso real'
   and retirado_en is null;
select 'base de desarrollo vacía · quedan ' ||
       (select count(*) from participacion.territorio) || ' territorios y ' ||
       (select count(*) from participacion.auditoria) || ' asientos de auditoría';
commit;
SQL
