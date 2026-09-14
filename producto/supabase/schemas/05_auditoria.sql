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
