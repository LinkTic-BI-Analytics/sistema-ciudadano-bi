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
