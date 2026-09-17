#!/usr/bin/env bash
# Aportes de muestra que ejercitan **todo** lo que hoy se captura.
#
# La semilla anterior metía cinco relatos y nada más: ni municipio, ni a
# quiénes, ni desde cuándo, ni voz, ni grupo, ni urgencia. Con eso la bandeja se
# veía siempre igual —todo por aclarar, todo sin señales— y no servía para ver
# si la pantalla ayuda a distinguir unas cosas de otras.
#
# Cada caso de abajo existe para que en la bandeja se vea **una fila distinta**:
#
#   1. completo y ubicado   → no le falta nada; sirve de contraste
#   2. sin lugar ninguno    → el caso duro: «en mi casa», y con el tema
#                              propuesto por la máquina y sin confirmar
#   3. por voz              → la transcripción puede estar mal (lo siembra
#                              `sembrar-voz.ts`, porque la base exige que un
#                              aporte hablado tenga su grabación **de verdad**)
#   4. de un colectivo      → hay a quién responderle, sin verificar
#   5. con urgencia         → se mira antes que lo demás
#   6. lugar sin municipio  → dijo dónde, pero no lleva a ningún código, y la
#                              persona **corrigió el tema**: la máquina leyó
#                              «vía» y propuso transporte; el alumbrado lo
#                              responde Minas y Energía. Para eso están las dos
#                              columnas, y sin un caso así no se ve la
#                              diferencia
#
# Los temas son los **sectores del Estado**, así que el agua va en «Vivienda,
# Ciudad y Territorio» y el alumbrado en «Minas y Energía». La semilla lo
# siembra a propósito: es la traducción que hay que ver funcionando antes de
# llevar la lista al piloto.
#
# **Solo para desarrollo.** Los relatos son inventados.
set -euo pipefail
C=${DB_CONTENEDOR:-supabase_db_participacion}
docker exec -i "$C" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -qAt <<'SQL'
begin;
with proc as (
  select id from participacion.proceso where retirado_en is null order by creado_en limit 1
),
-- Rionegro, Antioquia: el municipio que se usa en todas las pruebas.
mun as (
  select codigo, version from participacion.territorio
  where nivel = 'municipio' and nombre = 'RIONEGRO' and codigo like '05%' limit 1
),
nuevos as (
  insert into participacion.aporte
    (proceso_id, clave_envio, relato_original, canal, lugar_declarado, afectados, desde_cuando,
     es_colectivo, colectivo_declarado, tema, tema_propuesto, recibido_en)
  select proc.id, 'muestra-' || t.n, t.relato, t.canal, t.lugar, t.afectados, t.desde,
         t.colectivo, t.nombre_grupo, t.tema, t.tema_propuesto,
         now() - (t.n || ' hours')::interval
  from proc, (values
    -- Los temas son los sectores del Estado, y por eso el agua va en
    -- Vivienda: agua potable y saneamiento los responde Vivienda, Ciudad y
    -- Territorio. Es la traducción que la lista anterior no hacía, y sembrarla
    -- es la única forma de verla funcionar antes del piloto.
    --
    -- El segundo llega **propuesto y sin confirmar**: la persona no escogió
    -- tema, y esa fila enseña en la bandeja lo que leyó la máquina sin dar por
    -- hecho que ella lo aceptó (`CLA-01`).
    (1, 'el agua llega turbia desde hace tres meses y no se puede cocinar', 'web',
     'la vereda El Salado', 'unas veinte familias', 'desde hace tres meses', false, null,
     'Vivienda, Ciudad y Territorio', 'Vivienda, Ciudad y Territorio'),
    (2, 'está llegando el agua con olor a gasolina en mi casa', 'web',
     null, null, null, false, null,
     null, 'Vivienda, Ciudad y Territorio'),
    (4, 'el puesto de salud abre dos dias a la semana y toca viajar dos horas', 'web',
     'el corregimiento', 'toda la comunidad', 'hace como un año', true,
     'la junta de acción comunal de la vereda El Salado',
     'Salud y Protección Social', 'Salud y Protección Social'),
    (5, 'se está cayendo el muro de contención sobre las casas de abajo', 'web',
     'la parte alta', 'ocho casas', 'empeoró esta semana', false, null,
     'Ambiente y Desarrollo Sostenible', 'Ambiente y Desarrollo Sostenible'),
    (6, 'no hay alumbrado en la via de entrada y la gente no sale de noche', 'web',
     'la entrada del corregimiento', null, null, false, null,
     'Minas y Energía', 'Transporte')
  ) as t(n, relato, canal, lugar, afectados, desde, colectivo, nombre_grupo,
         tema, tema_propuesto)
  where not exists (select 1 from participacion.aporte where clave_envio = 'muestra-1')
  returning id, clave_envio, proceso_id
),
-- La ubicación nace por aclarar, como en la captura real.
ubicadas as (
  insert into participacion.ubicacion (proceso_id, aporte_id, estado)
  select proceso_id, id, 'por_aclarar' from nuevos returning aporte_id
)
select '  sembrados' where exists (select 1 from ubicadas);

-- El primero y el cuarto sí llegaron con municipio confirmado por la persona:
-- son los que hacen ver la diferencia entre una fila resuelta y una que no.
--
-- Va en su propia sentencia: dentro de la anterior, el `update` no vería las
-- filas de ubicación que ella misma acababa de insertar —comparten la misma
-- instantánea— y se quedaba sin hacer nada, en silencio.
update participacion.ubicacion u
   set estado = 'confirmada',
       territorio_codigo = (select codigo from participacion.territorio
                            where nivel='municipio' and nombre='RIONEGRO' and codigo like '05%' limit 1),
       territorio_version = (select version from participacion.territorio
                             where nivel='municipio' and nombre='RIONEGRO' and codigo like '05%' limit 1),
       autor = 'ciudadano',
       motivo = 'la persona lo confirmó al contar su aporte'
  from participacion.aporte a
 where u.aporte_id = a.id and a.clave_envio in ('muestra-1','muestra-4');

-- Una alerta de urgencia en el del muro. `V13`: la detecta una señal de texto,
-- **no una persona diciendo que es una emergencia**, y eso queda en `origen`.
insert into participacion.alerta (proceso_id, aporte_id, origen, indicio)
select a.proceso_id, a.id, 'senal', 'se está cayendo'
from participacion.aporte a
where a.clave_envio = 'muestra-5'
  and not exists (select 1 from participacion.alerta where aporte_id = a.id);

select '  aportes de muestra: ' || count(*) from participacion.aporte where clave_envio like 'muestra-%';
select '  ubicados:           ' || count(*) from participacion.ubicacion where estado='confirmada';
select '  con alerta:         ' || count(*) from participacion.alerta;
commit;
SQL

# El de voz va aparte: la base rechaza un aporte hablado sin grabación, y con
# razón —sería un aporte cuyo original se perdió (ADR 0013)—. Así que hay que
# subir audio de verdad, y eso no se hace desde `psql`.
cd "$(dirname "$0")/../producto"
set -a; [ -f .env.local ] && . ./.env.local; set +a
SIN_IA=1 node --experimental-strip-types ../scripts/sembrar-voz.ts
