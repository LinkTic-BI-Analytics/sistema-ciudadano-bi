-- Prioridad de examen (`PRI-01`, `RF12`).
--
-- **Lo que define esta tabla es lo que no tiene.**
--
-- No hay columna de puntaje, ni de peso, ni de ranking. `PRI-01` es explícito:
-- *«los pesos o cuotas no acordados no se rellenan automáticamente»*, y
-- `vacios.md` confirma que no existen ni pesos ni cuotas ni desempate.
--
-- Un número plausible es indistinguible de uno real y nadie lo cuestiona
-- después. Aquí eso significaría decidir a quién se atiende primero con una
-- cuenta que nadie autorizó.
--
-- Y no hay **nada** de selección presupuestal. Ni apagado: `I5` la bloquea
-- detrás de ocho condiciones publicadas y ninguna está. Una bandera apagada es
-- una bandera que alguien enciende.

create table participacion.prioridad_examen (
  id            uuid primary key default gen_random_uuid(),
  proceso_id    uuid not null references participacion.proceso (id),
  expediente_id uuid not null references participacion.expediente (id),

  autor         text not null,
  motivo        text not null,
  registrada_en timestamptz not null default now(),

  -- Los cinco de `PRI-01`, **separados**. Separados porque son cosas distintas,
  -- y porque juntarlos en un número es exactamente la fórmula que no existe.
  -- Todos opcionales: registrar lo que se sabe, no rellenar lo que no.
  urgencia_reportada text check (urgencia_reportada in ('alta','media','baja','sin_declarar')),
  afectacion         text check (afectacion in ('alta','media','baja','sin_establecer')),
  recurrencia        text check (recurrencia in ('alta','media','baja','unica')),
  competencia        text check (competencia in ('clara','en_disputa','sin_establecer')),

  -- La incertidumbre se registra **como tal**, no como un valor bajo. La
  -- especificación pide «conservar la incertidumbre», y una afectación
  -- desconocida no es una afectación baja: confundirlas entierra el caso.
  incertidumbre      text,

  -- Reabrir el expediente (T029) deja la prioridad no vigente. No se borra: se
  -- señala, porque `NEC-01` pide reabrir *«sin heredar aprobación»*.
  vigente_hasta      timestamptz,
  no_vigente_motivo  text,
  constraint no_vigencia_con_motivo
    check ((vigente_hasta is null) = (no_vigente_motivo is null))
);

create index on participacion.prioridad_examen (expediente_id, registrada_en desc);
create index on participacion.prioridad_examen (proceso_id) where vigente_hasta is null;

comment on table participacion.prioridad_examen is
  'Qué examinar primero y por qué. Sin puntaje, sin pesos, sin ranking: PRI-01 prohíbe rellenar lo que nadie acordó.';
comment on column participacion.prioridad_examen.incertidumbre is
  'Se registra como tal. Una afectación desconocida NO es una afectación baja: confundirlas entierra el caso.';

-- Solo para pruebas: las columnas de una tabla. Existe para poder comprobar que
-- NO hay una columna de puntaje ni de selección presupuestal — una prueba que
-- afirme eso leyendo el código no prueba nada sobre la base.
create or replace function participacion.columnas_de_prueba(p_tabla text)
returns text[]
language sql stable as $$
  select array_agg(column_name::text)
  from information_schema.columns
  where table_schema = 'participacion' and table_name = p_tabla;
$$;
