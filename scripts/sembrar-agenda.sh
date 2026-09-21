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
#
# Los 12 encuentros regionales de octubre de 2026 sí son los oficiales del
# cronograma de despliegue territorial. Para sembrarlos en una base que no es
# la local —la de Vercel, por ejemplo— se pasa la cadena de conexión:
#   DB_URL='postgresql://postgres.<ref>:<clave>@aws-0-<region>.pooler.supabase.com:5432/postgres' ./scripts/sembrar-agenda.sh
# Con `DB_URL` no se toca Docker: corre `psql` de esta máquina contra esa base.
set -euo pipefail
C=${DB_CONTENEDOR:-supabase_db_participacion}
if [ -n "${DB_URL:-}" ]; then
  PSQL=(psql "$DB_URL")
else
  PSQL=(docker exec -i "$C" psql -U postgres -d postgres)
fi
"${PSQL[@]}" -v ON_ERROR_STOP=1 -qAt \
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
),
-- **La convocatoria a la que se cuelgan los encuentros**: la recién sembrada, o
-- la que ya estaba publicada en este proceso. Antes los encuentros solo se
-- sembraban junto con la convocatoria, así que volver a correr esto sobre una
-- base que ya la tenía no hacía nada — y el cronograma oficial no entraba.
la_conv as (
  select id, proceso_id from conv
  union all
  select c.id, c.proceso_id from participacion.convocatoria c
  join proc on proc.id = c.proceso_id
  where c.estado = 'publicada'
),
-- Los doce encuentros oficiales del cronograma de despliegue territorial
-- (DNP, septiembre de 2026), con su fecha real. **Son los que ve la portada.**
--
-- Lo que la imagen no trae y por eso queda anotado como dato que falta: la
-- hora (se pone 9:00 a. m.) y el sitio exacto dentro de cada ciudad (se pone
-- la ciudad). Los «equipos» y los días de «alistamiento» son logística interna
-- y no entran. Los rótulos de semana y el festivo viven en
-- `producto/src/convocatoria/cronograma.ts`.
oficiales as (
  select * from (values
    ('Encuentro regional · Pereira',       timestamptz '2026-10-05 09:00 America/Bogota', 'Pereira'),
    ('Encuentro regional · Quibdó',        timestamptz '2026-10-07 09:00 America/Bogota', 'Quibdó'),
    ('Encuentro regional · Ibagué',        timestamptz '2026-10-09 09:00 America/Bogota', 'Ibagué'),
    ('Encuentro regional · Popayán',       timestamptz '2026-10-14 09:00 America/Bogota', 'Popayán'),
    ('Encuentro regional · Cúcuta',        timestamptz '2026-10-15 09:00 America/Bogota', 'Cúcuta'),
    ('Encuentro regional · Leticia',       timestamptz '2026-10-16 09:00 America/Bogota', 'Leticia'),
    ('Encuentro regional · Villavicencio', timestamptz '2026-10-20 09:00 America/Bogota', 'Villavicencio'),
    ('Encuentro regional · Tunja',         timestamptz '2026-10-21 09:00 America/Bogota', 'Tunja'),
    ('Encuentro regional · Medellín',      timestamptz '2026-10-23 09:00 America/Bogota', 'Medellín'),
    ('Encuentro regional · Bogotá D.C.',   timestamptz '2026-10-27 09:00 America/Bogota', 'Bogotá D.C.'),
    ('Encuentro regional · Barranquilla',  timestamptz '2026-10-28 09:00 America/Bogota', 'Barranquilla'),
    ('Encuentro regional · Cali',          timestamptz '2026-10-30 09:00 America/Bogota', 'Cali')
  ) as t(titulo, comienza_en, lugar)
),
sembrados as (
  insert into participacion.encuentro
    (proceso_id, convocatoria_id, titulo, tema, modalidad, comienza_en, lugar, cupos, estado)
  select la_conv.proceso_id, la_conv.id, o.titulo, null, 'presencial', o.comienza_en, o.lugar, null, 'programado'
  from la_conv, oficiales o
  -- Idempotente por título: volver a sembrar no duplica.
  where not exists (
    select 1 from participacion.encuentro e
    where e.convocatoria_id = la_conv.id and e.titulo = o.titulo
  )
  returning id
)
-- **Los casos de prueba, solo en el proceso de los recorridos** (cuando viene
-- `PROCESO_NOMBRE`). Un cancelado y un reprogramado con fecha relativa: son los
-- dos que se ven mal si la pantalla los esconde, y `pruebas/e2e/portada.spec.ts`
-- los busca por su texto. En desarrollo no se siembran: la portada enseña el
-- cronograma oficial limpio.
insert into participacion.encuentro
  (proceso_id, convocatoria_id, titulo, tema, modalidad, comienza_en, lugar, sala, ayudas, cupos, estado, comenzaba_en, motivo_cambio)
select la_conv.proceso_id, la_conv.id, t.titulo, t.tema, t.modalidad,
       now() + (t.dias || ' days')::interval, t.lugar, t.sala, t.ayudas, t.cupos,
       t.estado, case when t.estado='reprogramado' then now() + interval '4 days' end, t.motivo
from la_conv, (values
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
) as t(titulo, tema, modalidad, dias, lugar, sala, ayudas, cupos, estado, motivo)
where :'nombre' <> ''
  and not exists (
    select 1 from participacion.encuentro e
    where e.convocatoria_id = la_conv.id and e.titulo = t.titulo
  );

select '  convocatoria: ' || count(*) from participacion.convocatoria where estado='publicada';
select '  encuentros:   ' || count(*) from participacion.encuentro;
commit;
SQL
