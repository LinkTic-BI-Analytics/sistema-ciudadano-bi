-- Enlaces y QR por evento y por pieza (`QR-01` … `QR-04`).
--
-- La clave del requerimiento, dicha en su primera página:
--
--   > separar **de dónde vino el enlace**, **en qué evento dice participar la
--   > persona** y **dónde ocurre el problema que está reportando**. Estos datos
--   > pueden ser distintos y los tres son útiles.
--
-- Todo lo de abajo existe para que esos tres no se confundan nunca. El caso que
-- lo explica: alguien recibe reenviado el QR del evento A mientras está en el
-- evento B, y cuenta un problema de una vereda del municipio C. **Es un solo
-- aporte con tres contextos distintos**, y ninguno de ellos es asistencia.

create table participacion.enlace (
  -- Corto y estable: va impreso en un afiche y se teclea a mano cuando la
  -- cámara no lee. Por eso es `text` y no un uuid.
  id            text primary key check (id ~ '^[A-Z0-9]{6,12}$'),
  proceso_id    uuid not null references participacion.proceso (id),
  encuentro_id  uuid not null references participacion.encuentro (id),

  -- Afiche y publicación digital del mismo encuentro se distinguen **sin
  -- dividir el evento**: son piezas, no eventos distintos.
  pieza         text not null
                check (pieza in ('afiche','volante','publicacion','radio','otro')),

  -- Las UTMs describen difusión y **no otorgan permisos**. Se guardan las
  -- configuradas, que es distinto de las recibidas: las de abajo son lo que
  -- alguien puso en la dirección, y pueden venir manipuladas.
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,

  -- Retirar un enlace le quita el acceso, pero **no borra los aportes que
  -- entraron por él** ni su procedencia. Puede seguir explicando qué pasó.
  estado        text not null default 'activo' check (estado in ('activo','retirado')),
  creado_por    text not null,
  creado_en     timestamptz not null default now()
);

create index on participacion.enlace (encuentro_id);
