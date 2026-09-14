-- Emitir un comprobante sin exponer `identidad` por la API.
--
-- **Es una decisión, no una comodidad.** `identidad` guarda contacto y
-- comprobantes, y existe como partición física para que el permiso se dé o se
-- niegue de una sola vez (`SEG-01`, `I6`, `C2`). Exponerla a PostgREST la
-- volvería alcanzable por URL directa, que es justo lo que `SEG-01` prohíbe:
-- los permisos aplican *«también por URL directa»*.
--
-- Entonces el servidor no escribe ahí: pide que se escriba. La función corre con
-- los privilegios de su dueño y devuelve solo el identificador del aporte.
--
-- **El código nunca entra ni sale por aquí.** Se genera en el servidor, se pasa
-- su hash, y el código en claro solo existe en la respuesta al navegador. Si la
-- función recibiera el código, quedaría en el registro de sentencias de Postgres.

create or replace function participacion.emitir_comprobante(
  p_proceso uuid,
  p_aporte  uuid,
  p_hash    text
) returns void
language plpgsql
security definer
set search_path = identidad, participacion, pg_temp
as $$
begin
  if length(coalesce(p_hash, '')) <> 64 then
    raise exception 'el comprobante se guarda como hash sha256, no como código';
  end if;
  insert into identidad.comprobante (proceso_id, aporte_id, codigo_hash)
  values (p_proceso, p_aporte, p_hash);
end;
$$;

revoke all on function participacion.emitir_comprobante(uuid, uuid, text) from public;

comment on function participacion.emitir_comprobante is
  'La única puerta a identidad.comprobante. El esquema identidad no se expone por la API a propósito (SEG-01).';

-- Limpieza de pruebas. `identidad` no se expone por la API, así que una prueba
-- que crea comprobantes necesita una puerta para llevárselos. Es de pruebas y lo
-- dice el nombre: si apareciera en código de producto, se ve.
create or replace function participacion.borrar_comprobantes_de_prueba(p_aportes uuid[])
returns void
language plpgsql
security definer
set search_path = identidad, participacion, pg_temp
as $$
begin
  delete from identidad.comprobante where aporte_id = any(p_aportes);
end;
$$;

revoke all on function participacion.borrar_comprobantes_de_prueba(uuid[]) from public;

-- Canjear un comprobante. **La única puerta de lectura a `identidad`.**
--
-- Recibe el hash, nunca el código: si recibiera el código quedaría en el
-- registro de sentencias de Postgres, que es donde nadie lo busca y todo el
-- mundo lo puede leer.
--
-- Devuelve **un aporte o nada**. Nunca una lista — `N16`: *«consulta por
-- comprobante no expone expedientes ajenos»*. Y el proceso va en la condición:
-- un código no cruza procesos.
create or replace function participacion.canjear_comprobante(
  p_proceso uuid,
  p_hash    text
) returns table (
  aporte_id        uuid,
  relato           text,
  lugar_declarado  text,
  estado_ubicacion text,
  recibido_en      timestamptz
)
language sql
security definer
set search_path = identidad, participacion, pg_temp
as $$
  select a.id, a.relato_original, a.lugar_declarado,
         (select ub.estado from participacion.ubicacion ub
           where ub.aporte_id = a.id order by ub.creada_en desc limit 1),
         a.recibido_en
  from identidad.comprobante c
  join participacion.aporte a on a.id = c.aporte_id
  where c.codigo_hash = p_hash
    and c.proceso_id = p_proceso
    and c.revocado_en is null
    and a.retirado_en is null
  limit 1;
$$;

revoke all on function participacion.canjear_comprobante(uuid, text) from public;

comment on function participacion.canjear_comprobante is
  'Un comprobante abre UN aporte, nunca una lista (N16). Recibe el hash: el código en claro no entra a la base.';

-- Solo para pruebas: comprueba que el código en claro no quedó guardado en
-- ninguna parte de la tabla. Existe porque es la única forma de probarlo sin
-- exponer `identidad`, y el nombre lo dice para que se vea si se cuela.
create or replace function participacion.buscar_texto_en_comprobantes_de_prueba(p_texto text)
returns bigint
language sql
security definer
set search_path = identidad, participacion, pg_temp
as $$
  select count(*) from identidad.comprobante
  where codigo_hash = p_texto or codigo_hash ilike '%' || p_texto || '%';
$$;

revoke all on function participacion.buscar_texto_en_comprobantes_de_prueba(text) from public;
