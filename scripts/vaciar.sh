#!/usr/bin/env bash
# Deja la base en blanco para probar desde cero.
#
# Distinto de `limpiar-desarrollo.sh`, que corre antes de cada suite de pruebas:
# ese conserva la agenda sembrada. Este se lleva **todo lo que no es catálogo**,
# incluidas convocatorias y encuentros.
#
# Dos cosas NO se borran, y conviene saber por qué:
#
#   · **El catálogo territorial.** No es semilla: son los 9.715 territorios del
#     DANE. Borrarlos dejaría el buscador de municipios sin nada.
#
#   · **La auditoría.** Es `append-only` por regla —una restricción de la base,
#     no una convención— y esa es la razón de que exista: un registro que se
#     puede borrar no sirve para investigar nada. Por eso los procesos de prueba
#     se **retiran** en vez de borrarse (`V11` aplicándose a sí misma).
#
# El proceso vigente se conserva: sin él no se puede recibir ningún aporte.
#
# **Solo para desarrollo.**
set -euo pipefail
cd "$(dirname "$0")/.."
C=${DB_CONTENEDOR:-supabase_db_participacion}

# Las grabaciones se van del depósito además de la base: una fila borrada que
# deja el archivo detrás es la voz de alguien sin nada que explique por qué está
# ahí.
(cd producto && set -a && [ -f .env.local ] && . ./.env.local; set +a
 node --experimental-strip-types ../scripts/vaciar-grabaciones.ts 2>/dev/null || true)

docker exec -i "$C" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -qAt <<'SQL'
begin;
-- En orden de dependencia: lo que apunta a algo, antes que aquello a lo que apunta.
delete from participacion.prioridad_examen;
delete from participacion.actuacion;
delete from participacion.alerta;
delete from participacion.corte;
delete from participacion.vinculo_aporte_expediente;
delete from participacion.expediente_territorio;
delete from participacion.expediente;
delete from participacion.sintesis;
delete from participacion.ubicacion;
delete from participacion.transcripcion;
delete from identidad.comprobante;
delete from identidad.contacto;

-- El aporte suelta sus referencias antes de irse.
--
-- `estado_contexto` vuelve a «sin resolver» en la misma sentencia porque la base
-- no admite un contexto confirmado sin evento — y hace bien: decir que confirmó
-- un encuentro sin decir cuál no significa nada.
update participacion.aporte
   set grabacion_id = null, enlace_id = null, evento_confirmado_id = null,
       estado_contexto = 'sin_resolver',
       canal = case when canal = 'voz_transcrita' then 'web' else canal end;
delete from participacion.aporte;

delete from participacion.grabacion;
delete from participacion.enlace;
delete from participacion.encuentro;
delete from participacion.convocatoria;

select '  aportes:        ' || count(*) from participacion.aporte;
select '  encuentros:     ' || count(*) from participacion.encuentro;
select '  convocatorias:  ' || count(*) from participacion.convocatoria;
select '  grabaciones:    ' || count(*) from participacion.grabacion;
select '  territorios:    ' || count(*) || '  (catálogo, no se borra)' from participacion.territorio;
select '  auditoría:      ' || count(*) || '  (append-only por regla, no se borra)' from participacion.auditoria;
select '  proceso vigente: ' || nombre from participacion.proceso where retirado_en is null;
commit;
SQL
