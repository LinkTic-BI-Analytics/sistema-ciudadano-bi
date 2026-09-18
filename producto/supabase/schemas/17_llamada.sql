-- «Te llamamos»: quien prefiere que lo llamen en vez de escribir o de hablarle
-- al micrófono.
--
-- **Va en `identidad` y no en `participacion`, y eso no es una preferencia de
-- estilo.** Un nombre y un teléfono son contacto, y `AGENTS.md` §9 dice que el
-- contacto vive en una partición física aparte del dato analítico. Es lo que
-- hace cumplible que Comunicaciones no pueda descargar contactos (`SEG-01`,
-- `I6`, `C2`), y lo que permite borrar de verdad un dato personal —Ley 1581 de
-- 2012, `Q7`— sin tocar ningún registro analítico.
--
-- Consecuencia directa: **el esquema `identidad` no se expone por la API**
-- (`supabase/config.toml`), así que aquí no se escribe por REST. Se escribe por
-- una función de `participacion`, igual que `identidad.comprobante`.
--
-- **Y por eso tampoco lleva lápida.** El borrado lógico de `AGENTS.md` §9 existe
-- para que el registro analítico no se pueda desaparecer; `identidad` es justo
-- la partición donde el borrado sí puede ser físico, que es lo que `Q7` pide.
-- `identidad.contacto` tampoco la lleva.
--
-- ── Y una excepción declarada, que no se hereda ──────────────────────────────
--
-- **Esta tabla NO lleva `proceso_id`**, y `AGENTS.md` §9 dice que va en todas.
-- Es una decisión del negocio del 2026-09-18, tomada a propósito y con su razón:
-- *pedir que te llamen no es participar en un proceso*. Quien deja su número no
-- ha contado nada todavía; está pidiendo que alguien lo llame.
--
-- Lo que eso cuesta, dicho para que nadie lo descubra después:
--
--   · **no hay sobre qué escribir la política de acceso** de `Q9`/`Q18`. Cuando
--     llegue, esta tabla se decide aparte. Hoy no duele porque `identidad` no se
--     expone por la API y solo se entra por función;
--   · **no se puede limpiar por proceso.** Los guiones que vacían un escenario
--     de prueba borran por `proceso_id`, y aquí tienen que ir por la auditoría.
--
-- Y lo que NO se pierde: **de qué proceso vino queda en `participacion.auditoria`**,
-- que es append-only. El vínculo se movió de dato a rastro; no desapareció.
--
-- **La excepción es de esta tabla y de ninguna otra.** Cualquier tabla nueva de
-- `participacion` sigue naciendo con su `proceso_id`.

create schema if not exists identidad;

create table identidad.llamadas (
  id           uuid primary key default gen_random_uuid(),

  -- Obligatorio, y la restricción está **aquí**, no en el formulario. Un `if` en
  -- el servidor lo rompe un `curl`; esto no (`AGENTS.md` §8: la regla baja hasta
  -- donde se vuelve imposible, no hasta donde se valida).
  nombre       varchar not null check (length(btrim(nombre)) > 0),

  -- Colombia por defecto. Es una columna y no una constante del código porque el
  -- día que alguien pida la llamada desde fuera, lo guardado tiene que decir a
  -- qué indicativo se le llama — y un «+57» puesto al marcar no se puede
  -- corregir después sobre lo que ya se capturó.
  codigo_pais  varchar not null default '57'
               check (codigo_pais ~ '^[0-9]{1,4}$'),

  -- **Tal como lo escribió, sin formatear.** Quien llama necesita los dígitos;
  -- quien revisa necesita ver lo que la persona tecleó. Normalizarlo aquí es la
  -- misma inferencia que `I2` prohíbe en la ubicación: si guardamos solo nuestra
  -- versión, el día que el número no sirva nadie puede saber si lo escribió mal
  -- ella o lo arreglamos mal nosotros.
  --
  -- La restricción exige dígitos suficientes para marcar: un teléfono sin
  -- números no es un teléfono, y esta tabla existe para poder llamar.
  telefono     varchar not null
               check (length(regexp_replace(telefono, '[^0-9]', '', 'g')) between 7 and 15),

  created_up   timestamptz not null default now(),
  updated_up   timestamptz not null default now()
);

-- Lo más nuevo primero: una bandeja de llamadas pendientes se lee por fecha, que
-- es el orden en que hay que llamar.
create index on identidad.llamadas (created_up desc);

-- `updated_up` se mueve sola. Una columna que dice «actualizado» y no se
-- actualiza es una mentira barata: quien la lea después va a creer que esa fila
-- no se ha tocado desde que nació.
create or replace function identidad.tocar_llamada() returns trigger
language plpgsql as $$
begin
  new.updated_up := now();
  return new;
end;
$$;

create or replace trigger llamada_actualizada
  before update on identidad.llamadas
  for each row execute function identidad.tocar_llamada();

comment on table identidad.llamadas is
  'Peticiones de «te llamamos». Contacto puro: vive en identidad, no en participacion, y por eso aquí el borrado puede ser físico (Q7).';
comment on column identidad.llamadas.telefono is
  'Tal como lo escribió la persona. No se normaliza: guardar solo nuestra versión borra la prueba de quién se equivocó.';


-- La única puerta de escritura, porque `identidad` no se expone por la API.
--
-- Mismo patrón que `participacion.emitir_comprobante` y por la misma razón: si
-- la tabla fuera alcanzable por PostgREST, sería alcanzable por URL directa, que
-- es exactamente lo que `SEG-01` prohíbe.
-- **La firma cambió el 2026-09-18**: se le quitó `p_proceso`. Cambiar los
-- argumentos de una función en Postgres NO la reemplaza — crea una segunda con
-- otra firma, y entonces hay dos puertas y nadie sabe cuál se está usando. Por
-- eso la vieja se borra explícitamente antes.
drop function if exists participacion.registrar_llamada(uuid, text, text, text);

create or replace function participacion.registrar_llamada(
  p_nombre      text,
  p_codigo_pais text,
  p_telefono    text
) returns uuid
language plpgsql
security definer
set search_path = identidad, participacion, pg_temp
as $$
declare v_id uuid;
begin
  insert into identidad.llamadas (nombre, codigo_pais, telefono)
  values (
    btrim(p_nombre),
    coalesce(nullif(btrim(p_codigo_pais), ''), '57'),
    btrim(p_telefono)
  )
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function participacion.registrar_llamada(text, text, text) from public;

comment on function participacion.registrar_llamada is
  'La única puerta a identidad.llamadas. El esquema identidad no se expone por la API a propósito (SEG-01).';


-- Solo para pruebas: leer y limpiar lo que una prueba escribió. Existen porque
-- `identidad` no se expone por la API, así que sin esto una prueba no puede
-- comprobar qué quedó guardado ni llevarse lo suyo al terminar.
--
-- **El nombre lo dice**, igual que `borrar_comprobantes_de_prueba`: si alguna
-- apareciera en código de producto, se ve.
-- También cambió: ya no devuelve `proceso_id`. Cambiar el tipo de retorno de una
-- función tampoco lo hace `create or replace` — hay que borrarla antes.
drop function if exists participacion.leer_llamada_de_prueba(uuid);

create or replace function participacion.leer_llamada_de_prueba(p_id uuid)
returns table (
  nombre      text,
  codigo_pais text,
  telefono    text,
  created_up  timestamptz,
  updated_up  timestamptz
)
language sql
security definer
set search_path = identidad, participacion, pg_temp
as $$
  select l.nombre::text, l.codigo_pais::text, l.telefono::text,
         l.created_up, l.updated_up
  from identidad.llamadas l where l.id = p_id;
$$;

revoke all on function participacion.leer_llamada_de_prueba(uuid) from public;

-- Solo para pruebas: un `update` cualquiera, para ver que el disparador de
-- `updated_up` es de la base y no una promesa del comentario de arriba.
create or replace function participacion.renombrar_llamada_de_prueba(p_id uuid, p_nombre text)
returns void
language plpgsql
security definer
set search_path = identidad, participacion, pg_temp
as $$
begin
  update identidad.llamadas set nombre = p_nombre where id = p_id;
end;
$$;

revoke all on function participacion.renombrar_llamada_de_prueba(uuid, text) from public;

create or replace function participacion.borrar_llamadas_de_prueba(p_ids uuid[])
returns void
language plpgsql
security definer
set search_path = identidad, participacion, pg_temp
as $$
begin
  delete from identidad.llamadas where id = any(p_ids);
end;
$$;

revoke all on function participacion.borrar_llamadas_de_prueba(uuid[]) from public;
