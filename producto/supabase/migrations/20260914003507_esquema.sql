-- GENERADO por scripts/esquema.sh desde supabase/schemas/.
-- No se edita a mano: se edita el esquema y se vuelve a correr.

-- ═══ 01_pertenencia.sql ═══
-- La unidad de pertenencia, y va primero porque es lo único que no se puede
-- agregar después (`metodo/frentes.md`).
--
-- No es una restricción sobre una tabla: es una columna en TODAS y una condición
-- en cada consulta que alguien escriba a partir de ahora. Por eso existe antes
-- que cualquier dato.
--
-- **Lo que sí se puede agregar después es la política sobre ella** (`Q9`/`Q18`).
-- Si los procesos resultan ser compartimentos estancos, o si la Nación ve lo de
-- todos y cada territorio solo lo suyo, eso se escribe como acceso a nivel de
-- fila sobre esta columna. Hoy hay un solo proceso sembrado y la política queda
-- abierta a propósito.

create schema if not exists participacion;

-- El contenedor. `definicion_producto_participacion_v1.md` §9 lo pone primero
-- entre las entidades centrales, y dice que «el proceso define fases y reglas».
--
-- Que el expediente le pertenezca al proceso y no a la convocatoria sale de una
-- frase del mismo documento: «el cierre de una convocatoria limita acciones de
-- esa fase, pero no elimina la consulta de comprobantes y decisiones», y «una
-- misma necesidad puede continuar en otro ciclo».
create table participacion.proceso (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null,

  -- Los tres niveles de la investigación §11.2, y no hay un cuarto. El propio
  -- documento advierte: «sin usar vinculante como promesa genérica» (`Q17`).
  compromiso      text not null
                  check (compromiso in ('consulta',
                                        'deliberacion_con_respuesta',
                                        'decision_presupuestal_autorizada')),

  -- Quién responde. Sin esto no se publica una promesa de respuesta (`N01`),
  -- y sin esto tampoco hay responsable de alertas por turno (`V13`).
  entidad         text,

  creado_en       timestamptz not null default now(),

  -- Borrado lógico en todas las tablas (`V11`, `V18`). La fila se queda y se
  -- marca; nunca `delete`.
  retirado_en     timestamptz,
  retirado_motivo text,
  constraint retiro_con_motivo
    check ((retirado_en is null) = (retirado_motivo is null))
);

comment on table participacion.proceso is
  'La unidad de pertenencia. Su columna va en todas las tablas; la política de acceso sobre ella está abierta (Q9/Q18).';
comment on column participacion.proceso.compromiso is
  'Qué se promete: consulta, deliberacion_con_respuesta o decision_presupuestal_autorizada. Nunca "vinculante" a secas.';

-- ═══ 02_territorio.sql ═══
-- El catálogo territorial: DIVIPOLA del DANE (`V10`).
--
-- **La versión va en cada fila, no en una tabla aparte** (`Q5`). DIVIPOLA
-- cambia: en 1997 los centros poblados pasaron de 2 dígitos a 3, y las notas al
-- pie de junio de 2026 mencionan un deslinde en curso entre Norte de Santander y
-- Boyacá. Un código histórico significa cosas distintas según la versión con que
-- se escribió, y `R2` exige que un corte exportado siga siendo reproducible.

create table participacion.territorio (
  -- El código compone: departamento 2, municipio 2+3, centro poblado 5+3.
  codigo        text not null,
  version       text not null,   -- 'junio 2026'

  nivel         text not null check (nivel in ('departamento','municipio','centro_poblado')),
  nombre        text not null,
  -- Solo en municipio: Municipio · Isla · Área no municipalizada.
  -- Solo en centro poblado: CM (cabecera) · CP.
  tipo          text,
  padre         text,            -- el código de arriba, dentro de la misma versión

  -- Del municipio o del centro poblado, NUNCA de una necesidad. `GEO-01`:
  -- «no presentar el centro de un municipio como coordenada exacta».
  latitud       numeric,
  longitud      numeric,

  primary key (codigo, version),
  foreign key (padre, version) references participacion.territorio (codigo, version),

  constraint codigo_compone_con_su_padre
    check (padre is null or codigo like padre || '%'),
  constraint largo_del_codigo check (
    (nivel = 'departamento'   and length(codigo) = 2) or
    (nivel = 'municipio'      and length(codigo) = 5) or
    (nivel = 'centro_poblado' and length(codigo) = 8)
  )
);

create index on participacion.territorio (version, nivel);
create index on participacion.territorio (padre, version);

comment on table participacion.territorio is
  'DIVIPOLA del DANE, del geoportal y no de una republicación. No llega al barrio: el nivel sub-municipal es rural (V21).';
comment on column participacion.territorio.version is
  'Va en la clave primaria a propósito: el mismo código puede significar otra cosa en otra versión (Q5).';

-- ═══ 03_aporte.sql ═══
-- El aporte: lo que una persona o un grupo expresa (`V12`, nivel 1 de 3).
--
-- Dos invariantes viven aquí y se hacen imposibles en este nivel, no en el
-- servidor (`AGENTS.md` §8):
--
--   I1  un reintento técnico no duplica  → restricción única sobre la clave de
--       envío. **No por similitud ni por IP**, que la propia I1 prohíbe.
--   I2  no inferir lo que falta          → la ubicación tiene tres estados y el
--       esquema no admite un cuarto implícito. Un NULL que se lee como
--       «desconocido» ya es una inferencia.

create table participacion.aporte (
  id                uuid primary key default gen_random_uuid(),
  proceso_id        uuid not null references participacion.proceso (id),

  -- I1. La genera el cliente antes de enviar; el reintento trae la misma.
  clave_envio       text not null,

  -- Obligatorio y nunca se sustituye por la síntesis (`N03`).
  relato_original   text not null,

  canal             text not null check (canal in ('web','asistida','voz_transcrita')),
  recibido_en       timestamptz not null default now(),
  convocatoria      text,

  -- **El lugar tal como la persona lo dijo. Se guarda SIEMPRE** (`GEO-01`), y es
  -- lo que hace reversible aplazar el barrio (`V21`, `Q26`): sin este texto, el
  -- día que llegue un catálogo urbano solo sirve para lo nuevo.
  lugar_declarado   text,

  -- Colectivo: el aporte es del colectivo, no del vocero (`V19`). El colectivo
  -- todavía no existe como entidad (`Q23`), así que por ahora solo se marca.
  es_colectivo      boolean not null default false,

  retirado_en       timestamptz,
  retirado_motivo   text,
  constraint retiro_con_motivo
    check ((retirado_en is null) = (retirado_motivo is null)),

  -- I1: dentro de un proceso, una clave de envío es un aporte. Dos personas en
  -- el mismo equipo traen claves distintas y crean dos aportes legítimos.
  constraint un_envio_un_aporte unique (proceso_id, clave_envio)
);

create index on participacion.aporte (proceso_id, recibido_en desc);

-- La síntesis es versionada y la persona tiene la última palabra sobre la suya
-- (`V14`). Las dos clases de corrección se distinguen porque tienen efectos
-- distintos sobre el registro histórico — cuáles, sigue abierto (`Q15`).
create table participacion.sintesis (
  id            uuid primary key default gen_random_uuid(),
  proceso_id    uuid not null references participacion.proceso (id),
  aporte_id     uuid not null references participacion.aporte (id),
  version       integer not null,
  texto         text not null,
  clase         text not null
                check (clase in ('propuesta','mal_interpretado','cambio_de_posicion')),
  autor         text not null,
  motivo        text,
  creada_en     timestamptz not null default now(),
  confirmada_en timestamptz,
  unique (aporte_id, version)
);

-- La ubicación **no son columnas del aporte**: es una entidad con nivel y
-- versión de catálogo. Por eso agregar el nivel `barrio` más adelante (`V21`) es
-- una fila más y no una migración sobre datos que ya existen.
--
-- Un aporte puede tener varias: `GEO-01` permite vincular varios territorios.
create table participacion.ubicacion (
  id                uuid primary key default gen_random_uuid(),
  proceso_id        uuid not null references participacion.proceso (id),
  aporte_id         uuid not null references participacion.aporte (id),

  -- I2: tres estados, y no hay un cuarto implícito.
  estado            text not null check (estado in ('confirmada','por_aclarar','desconocida')),

  -- Solo cuando el estado es 'confirmada'. Si no, no hay código — y no se
  -- rellena con el municipio «más probable».
  territorio_codigo text,
  territorio_version text,

  autor             text,
  motivo            text,
  creada_en         timestamptz not null default now(),

  foreign key (territorio_codigo, territorio_version)
    references participacion.territorio (codigo, version),

  constraint solo_confirmada_lleva_codigo check (
    (estado = 'confirmada' and territorio_codigo is not null)
    or (estado <> 'confirmada' and territorio_codigo is null)
  )
);

create index on participacion.ubicacion (aporte_id);
create index on participacion.ubicacion (proceso_id, territorio_codigo, territorio_version);

comment on column participacion.aporte.clave_envio is
  'I1. Un reintento trae la misma clave y no crea otro aporte. Nunca se deduplica por similitud ni por IP.';
comment on column participacion.aporte.lugar_declarado is
  'GEO-01. Se guarda siempre: es lo único que permitirá re-normalizar al barrio cuando llegue su catálogo (Q26).';

-- ═══ 04_expediente.sql ═══
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

-- ═══ 05_auditoria.sql ═══
-- La auditoría es append-only y **no se reescribe cuando se revoca un permiso**.
-- Una auditoría que se puede editar no es una auditoría.
--
-- Cada evento conserva fecha, actor, acción, versión y motivo cuando
-- corresponda (`definicion_producto_participacion_v1.md` §9).

create table participacion.auditoria (
  id           bigserial primary key,
  proceso_id   uuid not null references participacion.proceso (id),
  ocurrido_en  timestamptz not null default now(),
  actor        text not null,
  accion       text not null,
  entidad      text not null,
  entidad_id   uuid,
  motivo       text,
  antes        jsonb,
  despues      jsonb
);

create index on participacion.auditoria (proceso_id, ocurrido_en desc);
create index on participacion.auditoria (entidad, entidad_id);

-- Sin `update` ni `delete`. Es la diferencia entre un registro y una bitácora
-- que alguien puede acomodar después.
create rule auditoria_sin_update as on update to participacion.auditoria do instead nothing;
create rule auditoria_sin_delete as on delete to participacion.auditoria do instead nothing;

comment on table participacion.auditoria is
  'Append-only por regla, no por costumbre. Una auditoría editable no es una auditoría.';

-- ═══ 06_identidad.sql ═══
-- **La identidad y el contacto viven separados del dato analítico.** No es una
-- vista: es una partición, y es lo que hace cumplible que Comunicaciones no
-- pueda descargar contactos (`SEG-01`, `I6`, `C2`).
--
-- Está en su propio esquema para que el permiso se dé o se niegue de una sola
-- vez, y para que un `select *` sobre lo analítico no la traiga por descuido.
--
-- **Y es lo que permite resolver `Q7`**: quien retira por seguridad tiene miedo
-- de que lo identifiquen, así que el borrado lógico del aporte no lo protege si
-- esto se queda. Aquí sí se puede borrar de verdad, sin tocar el registro
-- analítico. Falta confirmarlo con quien responda por la política de tratamiento.

create schema if not exists identidad;

create table identidad.contacto (
  id           uuid primary key default gen_random_uuid(),
  proceso_id   uuid not null references participacion.proceso (id),
  aporte_id    uuid not null references participacion.aporte (id),
  -- Opcional siempre: `N02` y `DAT-01` prohíben exigir contacto para recibir.
  valor        text,
  canal        text check (canal in ('correo','telefono','whatsapp')),
  -- Recordatorios solo si la persona los pidió (`N18`).
  acepta_avisos boolean not null default false,
  creado_en    timestamptz not null default now()
);

-- El comprobante: cómo la persona vuelve a ver lo suyo **sin dar correo**
-- (`RF4`, `RF5`, `RES-01`).
--
-- Se guarda el hash, no el código. El código lo ve la persona una vez; si se
-- guardara en claro, quien lea la tabla puede consultar el aporte de cualquiera.
--
-- **El mecanismo completo sigue abierto** (`P4`): no hay nada escrito sobre
-- identidad en ninguno de los 24 documentos fuente. Esto es lo mínimo que no
-- prejuzga esa decisión.
create table identidad.comprobante (
  id            uuid primary key default gen_random_uuid(),
  proceso_id    uuid not null references participacion.proceso (id),
  aporte_id     uuid not null references participacion.aporte (id),
  codigo_hash   text not null unique,
  emitido_en    timestamptz not null default now(),
  revocado_en   timestamptz
);

comment on schema identidad is
  'Partición física, no una vista. Separar aquí es lo que hace cumplible I6 y C2, y lo que permite borrar de verdad sin tocar lo analítico (Q7).';
comment on column identidad.comprobante.codigo_hash is
  'El hash, nunca el código. Guardarlo en claro haría que leer la tabla permitiera consultar el aporte de cualquiera.';

-- ═══ 07_conteo.sql ═══
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
  select max(version) into v_cat from participacion.territorio;
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

-- ═══ 08_comprobante.sql ═══
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

-- ═══ 09_acceso.sql ═══
-- El acceso, en su versión mínima: **negar por defecto**.
--
-- La política de verdad —quién ve qué— es `T032`, y está bloqueada por `P4` (no
-- hay mecanismo de identidad escrito en ningún documento) y `Q18` (si la
-- visibilidad es aislamiento entre procesos o jerarquía por territorio). Las dos
-- se implementan distinto y no se convierte una en la otra después.
--
-- Entonces esto **no decide nada de eso**. Hace lo único que no prejuzga:
--
--   · el acceso a nivel de fila queda ENCENDIDO en todas las tablas
--   · sin ninguna política, que en Postgres significa: nadie ve nada
--   · el rol del servidor —el de la llave `secret`— lo salta, que es como
--     trabaja el servidor hoy
--   · `anon` y `authenticated` —las llaves que llegan al navegador— no reciben
--     ni un permiso
--
-- Cuando `T032` se desbloquee, agregar una política es escribir una regla sobre
-- una tabla que ya tiene el interruptor puesto. Arrancar al revés —permitir y
-- luego restringir— es cómo se filtran los datos: basta olvidar una tabla.

grant usage on schema participacion to service_role;
grant all on all tables in schema participacion to service_role;
grant all on all sequences in schema participacion to service_role;
grant execute on all functions in schema participacion to service_role;

-- Y explícito, para que se lea como decisión y no como olvido.
revoke all on schema participacion from anon, authenticated;
revoke all on all tables in schema participacion from anon, authenticated;

alter table participacion.proceso                     enable row level security;
alter table participacion.territorio                  enable row level security;
alter table participacion.aporte                      enable row level security;
alter table participacion.sintesis                    enable row level security;
alter table participacion.ubicacion                   enable row level security;
alter table participacion.expediente                  enable row level security;
alter table participacion.vinculo_aporte_expediente   enable row level security;
alter table participacion.expediente_territorio       enable row level security;
alter table participacion.auditoria                   enable row level security;
alter table participacion.corte                       enable row level security;

alter table identidad.contacto     enable row level security;
alter table identidad.comprobante  enable row level security;

-- Ni una política. Es el estado correcto mientras `P4` y `Q18` sigan abiertas:
-- una política escrita antes de saber contra qué identidad se comprueba es una
-- política equivocada escrita con confianza.

