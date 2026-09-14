-- La ruta de alerta urgente (`V13`).
--
-- **Es una entidad propia, no un estado del aporte.** Se abre desde un aporte
-- sin esperar a que exista un expediente: un formulario a medio llenar ya puede
-- tener alerta.
--
-- Y los tres momentos van separados porque la tentación es juntarlos:
--
--   orientación mostrada   le dijimos a la persona a dónde llamar
--   contacto intentado     intentamos avisarle a alguien
--   recepción confirmada   alguien confirmó que recibió el aviso
--
-- **Mostrar un teléfono no es haber contactado, y contactar no es que alguien
-- haya recibido.** Con un solo campo `estado` esas tres cosas se vuelven la
-- misma, y el tablero diría que una emergencia está atendida cuando lo único que
-- pasó es que alguien vio un número.

create table participacion.alerta (
  id            uuid primary key default gen_random_uuid(),
  proceso_id    uuid not null references participacion.proceso (id),
  aporte_id     uuid not null references participacion.aporte (id),

  -- Quién o qué la levantó. `V13`: puede activarla la persona, un facilitador,
  -- un revisor o una detección automática — y se distingue, porque una señal de
  -- texto no es lo mismo que alguien diciendo «esto es una emergencia».
  origen        text not null check (origen in ('persona','facilitador','revisor','senal')),
  indicio       text,

  levantada_en  timestamptz not null default now(),

  -- Los tres momentos. Cada uno con su fecha: nulo significa que no ha pasado.
  orientacion_mostrada_en timestamptz,
  contacto_intentado_en   timestamptz,
  contacto_canal          text,
  recepcion_confirmada_en timestamptz,
  recepcion_constancia    text,
  responsable             text,

  -- Volver al flujo ordinario exige justificación, y conserva todo (`V13`).
  devuelta_en     timestamptz,
  devuelta_motivo text,
  devuelta_autor  text,
  constraint devolucion_con_motivo
    check ((devuelta_en is null) = (devuelta_motivo is null)),

  -- I1 otra vez: un aporte, una alerta. Un reintento del mismo envío no crea
  -- otro aporte, luego tampoco otra alerta.
  constraint un_aporte_una_alerta unique (aporte_id),

  -- No se puede confirmar una recepción sin haber intentado el contacto. Es la
  -- secuencia, y sin esto un tablero podría decir «recibido» sin que nadie
  -- hubiera llamado.
  constraint recepcion_despues_del_intento
    check (recepcion_confirmada_en is null or contacto_intentado_en is not null)
);

create index on participacion.alerta (proceso_id, levantada_en desc)
  where devuelta_en is null;

comment on table participacion.alerta is
  'Entidad propia, no un estado. Se abre desde un aporte sin esperar expediente (V13).';
comment on column participacion.alerta.origen is
  'Una señal de texto no es lo mismo que una persona diciendo que es una emergencia. Se distingue.';

-- **No existe una función para desactivar una alerta.** `V13`: la IA puede
-- detectar, pero *«su valoración no puede impedir que una persona active la
-- alerta ni desactivarla por sí sola»*. Lo más parecido es devolverla al flujo
-- ordinario, que exige autor y motivo — es decir, una persona respondiendo.
