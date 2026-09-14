-- Los cuatro estados de `CAL-01`, **separados**.
--
-- La tentación es un campo `estado` con todos los valores. Es el error que
-- `CAL-01` existe para impedir: pide *«mantener estados separados para
-- ubicación, clasificación, confirmación del relato y revisión institucional»*
-- y que *«cada indicador declare qué estados incluye»* — con un campo no se
-- puede declarar nada.
--
-- El de ubicación ya vive en `participacion.ubicacion`, porque un aporte puede
-- tener varias. Estos tres son del aporte.

alter table participacion.aporte
  add column estado_clasificacion text not null default 'por_clasificar'
    check (estado_clasificacion in ('por_clasificar','clasificado')),
  -- Confirmación del RELATO por la persona, no de los hechos. `backoffice-especificacion.md`:
  -- *«validar una síntesis no equivale a verificar los hechos»*.
  add column estado_confirmacion text not null default 'sin_confirmar'
    check (estado_confirmacion in ('sin_confirmar','confirmado')),
  add column estado_revision text not null default 'sin_revisar'
    check (estado_revision in ('sin_revisar','en_revision','revisado'));

comment on column participacion.aporte.estado_confirmacion is
  'Que la persona confirmó su síntesis. NO que los hechos estén verificados: son cosas distintas.';
