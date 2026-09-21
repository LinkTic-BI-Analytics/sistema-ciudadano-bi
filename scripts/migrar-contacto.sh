#!/usr/bin/env bash
# «¿Desde dónde nos contactas?» sobre una base que ya tiene datos.
#
#   ./scripts/migrar-contacto.sh
#
# **Una base nueva no necesita esto.** El esquema declarativo es la fuente
# (`AGENTS.md` §9): `./scripts/esquema.sh` y un `db reset` la dejan bien sola.
# Esto existe para la otra base, la que ya tiene aportes de gente y no se puede
# botar para volverla a crear.
#
# Es idempotente: se puede correr dos veces y la segunda no hace nada. Y no
# borra ninguna fila — lo único que quita son dos restricciones para volverlas a
# poner más anchas.
#
# Se corre con la misma conexión que la siembra: `DB_URL` o el contenedor local.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "«Desde dónde nos contactas» · esquema"

SQL=$(cat <<'FIN'
begin;

-- 1 · El catálogo admite países.
alter table participacion.territorio drop constraint if exists territorio_nivel_check;
alter table participacion.territorio add constraint territorio_nivel_check
  check (nivel in ('pais','departamento','municipio','centro_poblado'));

-- La forma del código, que es lo que distingue un país ('ES') de un
-- departamento ('05') ahora que los dos miden dos caracteres.
alter table participacion.territorio drop constraint if exists largo_del_codigo;
alter table participacion.territorio drop constraint if exists forma_del_codigo;
alter table participacion.territorio add constraint forma_del_codigo check (
  (nivel = 'pais'           and codigo ~ '^[A-Z]{2}$') or
  (nivel = 'departamento'   and codigo ~ '^[0-9]{2}$') or
  (nivel = 'municipio'      and codigo ~ '^[0-9]{5}$') or
  (nivel = 'centro_poblado' and codigo ~ '^[0-9]{8}$')
);
alter table participacion.territorio drop constraint if exists el_pais_no_tiene_padre;
alter table participacion.territorio add constraint el_pais_no_tiene_padre
  check (nivel <> 'pais' or padre is null);

-- 2 · El aporte guarda desde dónde escribe la persona.
--
-- Las tres nacen nulas y así se quedan en todo lo que ya existe: **no se
-- rellenan**. Poner «nacional» en 831 aportes que nadie preguntó sería
-- inventar la respuesta de 831 personas, que es justo lo que `I2` prohíbe.
alter table participacion.aporte add column if not exists contacto_ambito  text;
alter table participacion.aporte add column if not exists contacto_codigo  text;
alter table participacion.aporte add column if not exists contacto_version text;

alter table participacion.aporte drop constraint if exists aporte_contacto_ambito_check;
alter table participacion.aporte add constraint aporte_contacto_ambito_check
  check (contacto_ambito in ('nacional','internacional'));

alter table participacion.aporte
  drop constraint if exists aporte_contacto_codigo_contacto_version_fkey;
alter table participacion.aporte
  add constraint aporte_contacto_codigo_contacto_version_fkey
  foreign key (contacto_codigo, contacto_version)
  references participacion.territorio (codigo, version);

alter table participacion.aporte drop constraint if exists el_contacto_cuadra_con_el_ambito;
alter table participacion.aporte add constraint el_contacto_cuadra_con_el_ambito check (
  contacto_codigo is null
  or (contacto_ambito = 'nacional'      and contacto_codigo ~ '^[0-9]{5}$')
  or (contacto_ambito = 'internacional' and contacto_codigo ~ '^[A-Z]{2}$')
);
alter table participacion.aporte drop constraint if exists el_contacto_trae_su_version;
alter table participacion.aporte add constraint el_contacto_trae_su_version
  check ((contacto_codigo is null) = (contacto_version is null));

-- 3 · El corte toma la versión de DIVIPOLA, no la de la tabla entera.
--
-- Desde que los países viven aquí hay dos catálogos con versiones distintas, y
-- un corte que anotara 'CLDR 48.0' como versión de catálogo dejaría de ser
-- reproducible por el campo que existe para que lo sea (`Q5`, `R2`).
create or replace function participacion.tomar_corte(
  p_proceso uuid,
  p_desde   timestamptz default null,
  p_hasta   timestamptz default null
) returns uuid
language plpgsql as $$
declare v_id uuid; v_cat text;
begin
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

commit;
FIN
)

if command -v psql >/dev/null 2>&1; then
  URL="${DB_URL:-postgresql://postgres:postgres@127.0.0.1:54822/postgres}"
  printf '%s' "$SQL" | psql "$URL" -v ON_ERROR_STOP=1 -q
else
  printf '%s' "$SQL" | docker exec -i "${DB_CONTENEDOR:-supabase_db_participacion}" \
    psql -U postgres -d postgres -v ON_ERROR_STOP=1 -q
fi

echo "  esquema al día · ahora siembra los países: ./scripts/sembrar.sh"
