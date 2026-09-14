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
