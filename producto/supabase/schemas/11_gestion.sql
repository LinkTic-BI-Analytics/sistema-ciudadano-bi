-- Las actuaciones: **un hecho por fila**.
--
-- La tentación es un campo `estado` en el expediente con cinco valores. Es el
-- error que `RES-01` existe para impedir: *«recepción, respuesta, solución,
-- financiación y ejecución son cinco eventos distintos»*. Con un campo no se
-- puede decir que algo fue recibido y remitido **pero no respondido**, que es
-- justo el estado en que va a estar casi todo.
--
-- Y por eso el estado de atención **se deriva** de estas filas y no se guarda:
-- un campo almacenado se desincroniza de sus hechos, y entonces el tablero
-- afirma algo que la historia contradice.

create table participacion.actuacion (
  id             uuid primary key default gen_random_uuid(),
  proceso_id     uuid not null references participacion.proceso (id),
  expediente_id  uuid not null references participacion.expediente (id),

  -- Cinco, y no hay un sexto. `N14` distingue además recibido, examinado,
  -- incorporado, financiado, ejecutado y resultado — pero eso es incidencia, y
  -- la incidencia no está en esta entrega.
  tipo           text not null check (tipo in
                   ('recepcion','remision','decision','respuesta','siguiente_paso')),

  autor          text not null,
  ocurrida_en    timestamptz not null default now(),
  motivo         text,

  -- Solo en `remision`. **Una remisión no aceptada sigue pendiente** (`N13`), y
  -- por eso la aceptación es su propio hecho con su propia fecha: no un booleano
  -- que alguien cambia sin dejar cuándo.
  destino        text,
  aceptada_en    timestamptz,

  -- Solo en `siguiente_paso`. Nunca una promesa de plazo: `Q20` está abierta y
  -- el plazo no se inventa.
  siguiente_paso text,

  constraint destino_solo_en_remision
    check (destino is null or tipo = 'remision'),
  constraint aceptacion_solo_en_remision
    check (aceptada_en is null or tipo = 'remision'),
  constraint paso_solo_en_siguiente_paso
    check (siguiente_paso is null or tipo = 'siguiente_paso')
);

create index on participacion.actuacion (expediente_id, ocurrida_en);
create index on participacion.actuacion (proceso_id, tipo);

-- El estado de atención, **derivado**. Nunca almacenado.
--
-- Devuelve `sin_respuesta_registrada` cuando no hay respuesta, y **nunca
-- «vencido»**: el plazo no existe (`Q20`), y el paquete es explícito — *«no
-- inventar incumplimiento de plazo si no existe plazo definido»*.
create or replace function participacion.estado_de_atencion(p_expediente uuid)
returns table (
  estado           text,
  ultima_actuacion timestamptz,
  dias_sin_actuar  numeric,
  remision_pendiente boolean
)
language sql stable as $$
  select
    case
      when exists (select 1 from participacion.actuacion a
                    where a.expediente_id = p_expediente and a.tipo = 'respuesta')
        then 'respondido'
      when exists (select 1 from participacion.actuacion a
                    where a.expediente_id = p_expediente and a.tipo = 'remision')
        then 'remitido'
      when exists (select 1 from participacion.actuacion a
                    where a.expediente_id = p_expediente and a.tipo = 'recepcion')
        then 'recibido'
      else 'sin_respuesta_registrada'
    end,
    (select max(a.ocurrida_en) from participacion.actuacion a where a.expediente_id = p_expediente),
    round(extract(epoch from (now() - coalesce(
      (select max(a.ocurrida_en) from participacion.actuacion a where a.expediente_id = p_expediente),
      (select e.abierto_en from participacion.expediente e where e.id = p_expediente)))) / 86400, 1),
    exists (select 1 from participacion.actuacion a
             where a.expediente_id = p_expediente and a.tipo = 'remision' and a.aceptada_en is null);
$$;

comment on function participacion.estado_de_atencion is
  'Derivado de los hechos, nunca almacenado. Y nunca devuelve "vencido": el plazo no existe (Q20).';
