-- El expediente: el registro de trabajo y seguimiento de una necesidad situada
-- (`V12`, nivel 2 de 3). Puede nacer de un solo aporte, y no hace falta conocer
-- la causa técnica para abrirlo.
--
-- **Abrir un expediente no aprueba nada.** No asigna recursos, no compromete una
-- intervención y no declara resuelto nada.

create table participacion.expediente (
  id                uuid primary key default gen_random_uuid(),
  proceso_id        uuid not null references participacion.proceso (id),

  descripcion       text not null,   -- la afectación
  cambio_esperado   text,

  -- `Q10`: «desde hace tres meses» es una fecha relativa y guardada literalmente
  -- deja de ser cierta mañana. Por eso se guarda la fecha del reporte y la
  -- duración declarada por separado, y la frase se deriva.
  problema_desde    date,
  duracion_declarada text,
  recurrencia       text check (recurrencia in ('puntual','recurrente','desconocida')),

  -- `Q11`: choca con C2 —«doce familias de la vereda X» identifica—. Queda como
  -- texto declarado, no como cifra, y su publicación espera el umbral.
  poblacion_declarada text,

  responsable       text,
  abierto_en        timestamptz not null default now(),

  retirado_en       timestamptz,
  retirado_motivo   text,
  constraint retiro_con_motivo
    check ((retirado_en is null) = (retirado_motivo is null)),

  -- Fusionar y dividir NO destruyen filas (`I4` leída bien: lo que prohíbe es
  -- fusionar *automáticamente por palabras compartidas*). Una fusión escribe un
  -- expediente nuevo y apunta los anteriores hacia él.
  fusionado_en_id   uuid references participacion.expediente (id),
  constraint fusionado_no_es_el_mismo check (fusionado_en_id is distinct from id)
);

create index on participacion.expediente (proceso_id, abierto_en desc);

-- **Un aporte puede alimentar varios expedientes, y un expediente reunir varios
-- aportes** (`V12`). Es muchos a muchos, no una columna `expediente_id` en el
-- aporte. El vínculo lleva autor, fecha y motivo, y es reversible: desagrupar
-- marca la fila, no la borra (`I4`).
create table participacion.vinculo_aporte_expediente (
  id              uuid primary key default gen_random_uuid(),
  proceso_id      uuid not null references participacion.proceso (id),
  aporte_id       uuid not null references participacion.aporte (id),
  expediente_id   uuid not null references participacion.expediente (id),

  autor           text not null,
  motivo          text not null,   -- obligatorio: I4 pide conservar el porqué
  creado_en       timestamptz not null default now(),

  desvinculado_en     timestamptz,
  desvinculado_motivo text,
  desvinculado_autor  text,
  constraint desvinculo_con_motivo
    check ((desvinculado_en is null) = (desvinculado_motivo is null))
);

create index on participacion.vinculo_aporte_expediente (expediente_id) where desvinculado_en is null;
create index on participacion.vinculo_aporte_expediente (aporte_id) where desvinculado_en is null;

-- **Un expediente puede abarcar varios territorios y conserva el seguimiento de
-- cada uno** (`V12`). Un expediente intermunicipal no es uno con un territorio
-- «promedio»: es uno con varios, cada uno con su propio estado de atención.
create table participacion.expediente_territorio (
  id                 uuid primary key default gen_random_uuid(),
  proceso_id         uuid not null references participacion.proceso (id),
  expediente_id      uuid not null references participacion.expediente (id),
  territorio_codigo  text not null,
  territorio_version text not null,
  estado_atencion    text not null default 'sin_atender',
  foreign key (territorio_codigo, territorio_version)
    references participacion.territorio (codigo, version),
  unique (expediente_id, territorio_codigo, territorio_version)
);

comment on table participacion.expediente is
  'La necesidad situada. Le pertenece al proceso, no a la convocatoria: sobrevive a su cierre.';
comment on column participacion.expediente.fusionado_en_id is
  'Una fusión no destruye filas: apunta el viejo al nuevo y conserva los vínculos (I4).';

-- Desagrupar **reabre** lo que dependía de la agrupación.
--
-- `I4` pide conservar originales, diferencias, motivos y vínculos. Y `NEC-01`
-- añade la mitad que se olvida: *«reabre examen de prioridad y respuestas **sin
-- heredar aprobación**»*.
--
-- Si un aporte sale de un expediente y la prioridad se queda como estaba, el
-- sistema afirma algo que ya no sustenta. Estas columnas son la marca de que hay
-- que volver a mirarlo — no borran la prioridad, la señalan como no vigente.
alter table participacion.expediente
  add column reabierto_en     timestamptz,
  add column reabierto_motivo text,
  add constraint reapertura_con_motivo
    check ((reabierto_en is null) = (reabierto_motivo is null));

comment on column participacion.expediente.reabierto_en is
  'Marcado al desagrupar. La prioridad y la respuesta dejan de estar vigentes: no se heredan (NEC-01).';
