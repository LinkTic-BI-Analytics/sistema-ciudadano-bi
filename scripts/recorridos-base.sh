#!/usr/bin/env bash
# La base de los recorridos de navegador, **aparte de la de desarrollo**.
#
# Antes compartían proceso: la suite limpiaba al arrancar y al terminar, y se
# llevaba por delante lo que alguien hubiera capturado a mano probando la
# pantalla. Pasó dos veces con datos de verdad, y la segunda con un aporte que
# se estaba usando para diagnosticar un fallo.
#
# Ahora los recorridos tienen su propio proceso y esto solo toca ese. Lo que
# haya en el de desarrollo no se entera.
#
#   preparar  · retira el proceso anterior, crea uno limpio y le siembra agenda
#   recoger   · borra sus datos y lo retira
set -euo pipefail
cd "$(dirname "$0")/.."
C=${DB_CONTENEDOR:-supabase_db_participacion}
NOMBRE=${PROCESO_VIGENTE:-"ESCENARIO DE PRUEBA — recorridos de navegador"}
ACCION=${1:-preparar}

limpiar() {
  docker exec -i "$C" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -qAt \
    -v nombre="$NOMBRE" <<'SQL'
begin;
create temporary table _p on commit drop as
  select id from participacion.proceso where nombre = :'nombre';

-- **El orden importa, y no es el intuitivo.** Un aporte apunta a su enlace de
-- QR y a su grabación, así que borrar los enlaces primero falla por clave
-- foránea. Se va de lo que cuelga hacia lo que sostiene: primero lo que cuelga
-- del aporte, después el aporte, y al final el contexto del que nació.
delete from participacion.prioridad_examen where proceso_id in (select id from _p);
delete from participacion.actuacion   where proceso_id in (select id from _p);
delete from participacion.alerta      where proceso_id in (select id from _p);
delete from participacion.expediente_territorio
 where expediente_id in (select id from participacion.expediente where proceso_id in (select id from _p));
delete from participacion.vinculo_aporte_expediente where proceso_id in (select id from _p);
delete from participacion.sintesis    where proceso_id in (select id from _p);
delete from participacion.ubicacion   where proceso_id in (select id from _p);
delete from identidad.comprobante     where proceso_id in (select id from _p);
delete from identidad.contacto        where proceso_id in (select id from _p);
delete from participacion.expediente  where proceso_id in (select id from _p);

delete from participacion.aporte      where proceso_id in (select id from _p);

delete from participacion.transcripcion
 where grabacion_id in (select id from participacion.grabacion where proceso_id in (select id from _p));
delete from participacion.grabacion   where proceso_id in (select id from _p);
delete from participacion.enlace      where proceso_id in (select id from _p);
delete from participacion.encuentro   where proceso_id in (select id from _p);
delete from participacion.convocatoria where proceso_id in (select id from _p);

-- El proceso se RETIRA, no se borra: sus asientos de auditoría lo sostienen y
-- esos no se van. Es el borrado lógico que `V11` fijó para todo.
update participacion.proceso
   set retirado_en = now(), retirado_motivo = 'recorridos de navegador, limpiado'
 where nombre = :'nombre' and retirado_en is null;
commit;
SQL
}

case "$ACCION" in
  preparar)
    limpiar
    docker exec -i "$C" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -qAt \
      -v nombre="$NOMBRE" <<'SQL'
insert into participacion.proceso (nombre, compromiso) values (:'nombre', 'consulta');
SQL
    PROCESO_NOMBRE="$NOMBRE" ./scripts/sembrar-agenda.sh >/dev/null
    echo "base de recorridos lista · proceso ${NOMBRE}"
    ;;
  recoger)
    limpiar
    echo "base de recorridos recogida · el proceso de desarrollo no se tocó"
    ;;
  *) echo "uso: $0 [preparar|recoger]"; exit 1 ;;
esac
