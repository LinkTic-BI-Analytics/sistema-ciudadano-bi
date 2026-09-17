#!/usr/bin/env bash
# Una convocatoria publicada y unos encuentros, para poder ver la portada.
#
# **Solo para desarrollo.** Son datos de ejemplo, no una convocatoria real: el
# módulo dice que publicar exige actor autorizado y campos coherentes, y aquí no
# hay ni lo uno ni lo otro.
#
# Incluye a propósito un encuentro cancelado y uno reprogramado: son los dos
# casos que se ven mal si la pantalla los esconde, y los que no se pueden probar
# a ojo sin tenerlos delante.
set -euo pipefail
C=${DB_CONTENEDOR:-supabase_db_participacion}
docker exec -i "$C" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -qAt \
  -v nombre="${PROCESO_NOMBRE:-}" <<'SQL'
begin;
-- Idempotente: si ya hay una convocatoria publicada, no se siembra otra. Los
-- recorridos llaman a esto en cada corrida.
with proc as (
  -- El proceso al que se le siembra. Por defecto el más antiguo activo —el de
  -- desarrollo—; con `PROCESO_NOMBRE`, el que se diga: los recorridos tienen el
  -- suyo y se siembra ahí, no en el de quien esté probando a mano.
  select id from participacion.proceso
  where retirado_en is null
    and (:'nombre' = '' or nombre = :'nombre')
  order by creado_en desc limit 1
),
conv as (
  insert into participacion.convocatoria
    (proceso_id, nombre, proposito, alcance, efecto, abre_en, cierra_en, estado, publicada_en)
  select id,
    'Escucha para el Plan Nacional de Desarrollo',
    'Queremos saber qué necesita mejorar donde vives, contado con tus palabras y no con las nuestras.',
    'Alguien lo revisa, lo ubica en tu municipio y lo agrupa con lo de tus vecinos cuando es lo mismo.',
    'Que quede registrado no significa que haya un compromiso de obra: significa que alguien lo va a revisar y que vas a poder ver qué pasó con ello.',
    now() - interval '10 days', now() + interval '60 days', 'publicada', now() - interval '10 days'
  from proc
  -- Idempotente **por proceso**, no en toda la base: si lo fuera en toda,
  -- sembrar la de los recorridos no haría nada porque ya existe la de
  -- desarrollo, y la portada de la suite saldría sin agenda.
  where not exists (
    select 1 from participacion.convocatoria c
    where c.estado = 'publicada' and c.proceso_id = proc.id
  )
  returning id, proceso_id
)
insert into participacion.encuentro
  (proceso_id, convocatoria_id, titulo, tema, modalidad, comienza_en, lugar, sala, ayudas, cupos, estado, comenzaba_en, motivo_cambio)
select conv.proceso_id, conv.id, t.titulo, t.tema, t.modalidad,
       now() + (t.dias || ' days')::interval, t.lugar, t.sala, t.ayudas, t.cupos,
       t.estado, case when t.estado='reprogramado' then now() + interval '4 days' end, t.motivo
from conv, (values
  -- El tema del encuentro se escribe con el nombre del sector, el mismo que
  -- lleva el aporte (`TEMAS` en `src/captura/lectura.ts`). El título
  -- sigue hablando como la gente —«el agua en la zona rural»— porque es lo que
  -- se lee en la portada: quien busca a qué ir no busca un sector.
  ('Mesa sobre el agua en la zona rural', 'Vivienda, Ciudad y Territorio', 'presencial', 5,
   'Caseta comunal de la vereda El Salado', null, 'Hay interpretación en lengua de señas y transporte desde la cabecera', 40, 'programado', null),
  ('Encuentro virtual: vías y transporte', 'Transporte', 'virtual', 9,
   null, 'https://encuentro.ejemplo/vias', 'Se puede entrar por teléfono, sin cámara', null, 'programado', null),
  ('Mesa sobre salud rural', 'Salud y Protección Social', 'presencial', 12,
   'Puesto de salud de la vereda alta', null, null, 25, 'reprogramado',
   'se cruzaba con la jornada de vacunación'),
  ('Encuentro sobre educación', 'Educación', 'mixta', 16,
   'Colegio del corregimiento', 'https://encuentro.ejemplo/educacion', null, null, 'cancelado',
   'la sede no estará disponible; se reprograma y se avisa aquí')
) as t(titulo, tema, modalidad, dias, lugar, sala, ayudas, cupos, estado, motivo);

select '  convocatoria: ' || count(*) from participacion.convocatoria where estado='publicada';
select '  encuentros:   ' || count(*) from participacion.encuentro;
commit;
SQL
