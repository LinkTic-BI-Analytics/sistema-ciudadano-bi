-- Las cuentas. Viven aquí y no en el servidor: `AGENTS.md` §8, nivel 2.
--
-- **JavaScript formatea, no calcula.** Y la razón no es de estilo: si el mapa,
-- la lista y la exportación hacen cada uno su propia cuenta, `I6` se rompe sola
-- —«ni ofrecer mapas y exportaciones con universos contradictorios»—.
--
-- Las dos reglas son antiintuitivas y por eso se prueban contra números
-- calculados a mano, no contra lo que devolvió la primera implementación
-- (`AGENTS.md` §7):
--
--   R1  una necesidad en N municipios sigue siendo UNA necesidad nacional.
--       No se suman subtotales que se solapan.
--   R2  un aporte sin ubicación cuenta en el total recibido y en pendientes,
--       pero NO en el denominador municipal. Y un aporte con dos municipios
--       **no mueve el numerador**.

-- El universo de un corte: los IDs sobre los que se cuenta. Todo indicador sale
-- de aquí, que es lo que hace que mapa, lista y exportación coincidan.
create or replace function participacion.universo(
  p_proceso uuid,
  p_desde   timestamptz default null,
  p_hasta   timestamptz default null
) returns table (aporte_id uuid)
language sql stable as $$
  select a.id
  from participacion.aporte a
  where a.proceso_id = p_proceso
    and a.retirado_en is null
    and (p_desde is null or a.recibido_en >= p_desde)
    and (p_hasta is null or a.recibido_en <  p_hasta);
$$;

comment on function participacion.universo is
  'Los IDs del corte. Un indicador que no salga de aquí puede contradecir a otro (I6).';

-- R2 · ubicación municipal resuelta.
--
-- El numerador cuenta **aportes distintos** con al menos un vínculo municipal
-- aceptado. Por eso un aporte en dos municipios sigue sumando uno: el `distinct`
-- es la regla, no una optimización.
create or replace function participacion.indicadores(
  p_proceso uuid,
  p_desde   timestamptz default null,
  p_hasta   timestamptz default null
) returns table (
  aportes_recibidos     bigint,
  aportes_ubicados      bigint,
  aportes_pendientes    bigint,
  ubicacion_resuelta    numeric,
  municipios_con_aportes bigint,
  necesidades           bigint
)
language sql stable as $$
  with u as (select aporte_id from participacion.universo(p_proceso, p_desde, p_hasta)),
  ubicados as (
    select distinct ub.aporte_id
    from participacion.ubicacion ub
    join u on u.aporte_id = ub.aporte_id
    join participacion.territorio t
      on t.codigo = ub.territorio_codigo and t.version = ub.territorio_version
    where ub.estado = 'confirmada' and t.nivel = 'municipio'
  )
  select
    (select count(*) from u),
    (select count(*) from ubicados),
    (select count(*) from u) - (select count(*) from ubicados),
    -- Sin aportes no hay porcentaje. Devolver 0 diría «cero por ciento resuelto»,
    -- que es distinto de «no hay nada que resolver».
    case when (select count(*) from u) = 0 then null
         else round((select count(*) from ubicados)::numeric
                    * 100 / (select count(*) from u), 2) end,
    (select count(distinct ub.territorio_codigo)
       from participacion.ubicacion ub
       join u on u.aporte_id = ub.aporte_id
       join participacion.territorio t
         on t.codigo = ub.territorio_codigo and t.version = ub.territorio_version
      where ub.estado = 'confirmada' and t.nivel = 'municipio'),
    -- R1 · expedientes distintos. Uno que abarca dos municipios sigue siendo uno.
    (select count(distinct v.expediente_id)
       from participacion.vinculo_aporte_expediente v
       join u on u.aporte_id = v.aporte_id
      where v.desvinculado_en is null);
$$;

comment on function participacion.indicadores is
  'R1 y R2. El distinct del numerador ES la regla: un aporte en dos municipios no lo mueve.';

-- El corte: una foto **inmutable**. `R2` lo exige por escrito — *al aclarar otro
-- aporte se genera un corte nuevo, sin reescribir el exportado anterior*.
--
-- Guarda los números **y** la versión de catálogo con que se calcularon, porque
-- DIVIPOLA cambia (`Q5`).
create table participacion.corte (
  id                 uuid primary key default gen_random_uuid(),
  proceso_id         uuid not null references participacion.proceso (id),
  tomado_en          timestamptz not null default now(),
  zona_horaria       text not null default 'America/Bogota',
  filtro_desde       timestamptz,
  filtro_hasta       timestamptz,
  catalogo_version   text not null,
  indicadores        jsonb not null,
  -- Los IDs exactos. Es lo que permite que otro analista reproduzca el total
  -- (`TRA-01`), y lo que hace comprobable que mapa, lista y exportación
  -- hablan del mismo universo.
  universo           uuid[] not null
);

create index on participacion.corte (proceso_id, tomado_en desc);

-- Un corte no se reescribe. Nunca.
create rule corte_sin_update as on update to participacion.corte do instead nothing;
create rule corte_sin_delete as on delete to participacion.corte do instead nothing;

create or replace function participacion.tomar_corte(
  p_proceso uuid,
  p_desde   timestamptz default null,
  p_hasta   timestamptz default null
) returns uuid
language plpgsql as $$
declare v_id uuid; v_cat text;
begin
  -- **La versión de DIVIPOLA, no la de la tabla entera.** Desde que los países
  -- viven aquí, `participacion.territorio` tiene dos catálogos con versiones
  -- distintas —'junio 2026' y 'CLDR 48.0'— y el corte se calcula sobre
  -- municipios. Un `max(version)` sobre todo anotaría en el corte una versión
  -- que no es la del catálogo con que se contó, y el corte dejaría de ser
  -- reproducible justo por el campo que existe para que lo sea (`Q5`, `R2`).
  select max(version) into v_cat from participacion.territorio
   where nivel in ('departamento','municipio','centro_poblado');
  if v_cat is null then
    raise exception 'no hay catálogo territorial sembrado: un corte sin versión de catálogo no es reproducible';
  end if;
  insert into participacion.corte
    (proceso_id, filtro_desde, filtro_hasta, catalogo_version, indicadores, universo)
  select p_proceso, p_desde, p_hasta, v_cat, to_jsonb(i),
         array(select aporte_id from participacion.universo(p_proceso, p_desde, p_hasta))
  from participacion.indicadores(p_proceso, p_desde, p_hasta) i
  returning id into v_id;
  return v_id;
end;
$$;

comment on table participacion.corte is
  'Inmutable por regla. R2: un corte nuevo no reescribe el anterior.';
