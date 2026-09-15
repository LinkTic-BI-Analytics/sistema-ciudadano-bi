-- Convocatorias y encuentros (`M06`, `RF10`).
--
-- La primera entrega que pide el módulo: *«sección pública permanente
-- Participa → Convocatorias y agenda, accesible sin cuenta, con próximos
-- encuentros en portada»*.
--
-- Lo que el modelo tiene que hacer imposible está escrito abajo, restricción
-- por restricción. Lo más importante: **una convocatoria cerrada no puede
-- prometer recepción**, y **cancelar un encuentro no lo borra**.

create table participacion.convocatoria (
  id            uuid primary key default gen_random_uuid(),
  proceso_id    uuid not null references participacion.proceso (id),

  nombre        text not null,
  -- `RF10`: propósito, alcance, fechas, canales y **efecto de participar**. El
  -- último no es decorativo: sin decir qué pasa con lo que se aporta, la
  -- convocatoria promete por omisión.
  proposito     text not null,
  alcance       text not null,
  efecto        text not null,

  -- Una convocatoria puede recibir aportes por internet **sin ninguna
  -- reunión**, así que la ventana es de la convocatoria y no de los encuentros.
  abre_en       timestamptz not null,
  cierra_en     timestamptz,

  estado        text not null default 'borrador'
                check (estado in ('borrador','publicada','cerrada')),
  -- El borrador no altera la versión pública: lo que no está publicado no se ve.
  publicada_en  timestamptz,
  constraint publicada_con_fecha
    check ((estado = 'borrador') = (publicada_en is null)),
  constraint cierra_despues_de_abrir
    check (cierra_en is null or cierra_en > abre_en)
);

create table participacion.encuentro (
  id              uuid primary key default gen_random_uuid(),
  proceso_id      uuid not null references participacion.proceso (id),
  convocatoria_id uuid not null references participacion.convocatoria (id),

  titulo          text not null,
  tema            text,
  modalidad       text not null check (modalidad in ('presencial','virtual','mixta')),

  -- Con zona horaria siempre. Un encuentro a las 9 no dice nada sin decir
  -- dónde son las 9, y la gente que se conecta desde otro huso llega tarde.
  comienza_en     timestamptz not null,
  zona_horaria    text not null default 'America/Bogota',

  -- Dónde, según la modalidad. Un encuentro presencial sin lugar y uno virtual
  -- sin sala son fichas que no sirven para ir.
  lugar           text,
  sala            text,
  constraint presencial_con_lugar check (modalidad = 'virtual' or lugar is not null),
  constraint virtual_con_sala     check (modalidad = 'presencial' or sala is not null),

  -- Las ayudas reales, dichas o no dichas. `null` es «no se dijo»; prometerlas
  -- sin tenerlas es peor que callarlas.
  ayudas          text,
  cupos           integer check (cupos is null or cupos > 0),

  estado          text not null default 'programado'
                  check (estado in ('programado','reprogramado','cancelado')),

  -- **Reprogramar conserva la ficha y muestra el cambio.** Por eso la fecha
  -- anterior se guarda: sin ella, quien ya se había organizado no puede saber
  -- que cambió.
  comenzaba_en    timestamptz,
  motivo_cambio   text,
  constraint reprogramado_dice_desde_cuando
    check ((estado = 'reprogramado') = (comenzaba_en is not null)),
  constraint cambio_con_motivo
    check (estado = 'programado' or motivo_cambio is not null)
);

create index on participacion.encuentro (proceso_id, comienza_en);
create index on participacion.convocatoria (proceso_id, estado);

-- ¿Está abierta de verdad ahora mismo?
--
-- Una sola función para que la portada, la ficha y cualquier aviso digan lo
-- mismo. «Publicada» no basta: una convocatoria publicada cuya ventana ya
-- cerró **no recibe**, y ofrecer participar ahí es la promesa que `RF10`
-- prohíbe —*«no promete recepción en convocatoria cerrada»*—.
create or replace function participacion.recibe_aportes(c participacion.convocatoria)
returns boolean language sql immutable as $$
  select c.estado = 'publicada'
     and c.abre_en <= now()
     and (c.cierra_en is null or c.cierra_en > now());
$$;
