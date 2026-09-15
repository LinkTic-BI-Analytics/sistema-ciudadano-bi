-- La voz de quien no escribe (ADR 0013).
--
-- **El audio es el original.** Una transcripción ya es la lectura de una
-- máquina, y no es fiel: en la primera prueba, «la vereda La Martinita» volvió
-- como «La Martinica». Si se guardara solo el texto, el original que `N03`
-- manda conservar sería el error de la máquina.
--
-- Va **antes** del aporte, y no es un capricho de orden: la grabación existe
-- primero porque es el original, y el aporte apunta a ella. Al revés —que la
-- grabación apuntara al aporte— la regla «un aporte por voz tiene grabación»
-- necesitaba un disparador diferido, y con PostgREST cada llamada es su propia
-- transacción: el aporte se confirmaba solo y la regla saltaba siempre.
-- Así es una comprobación normal que no se puede evitar.

create table participacion.grabacion (
  id           uuid primary key default gen_random_uuid(),
  proceso_id   uuid not null references participacion.proceso (id),

  -- Dónde está el archivo. No el archivo: la base no es un depósito de medios,
  -- y un `bytea` de un millón de minutos es una base que no se puede respaldar.
  ruta         text not null unique,
  tipo_mime    text not null,
  bytes        integer not null check (bytes > 0),
  segundos     numeric check (segundos is null or segundos > 0),

  recibida_en  timestamptz not null default now()
);

-- Las transcripciones de una grabación, en versiones.
--
-- **Una transcripción es una versión, no un hecho.** Lleva quién la hizo —el
-- modelo, con nombre— y cuándo. Eso es lo que permite volver a transcribir más
-- tarde con un proveedor mejor sin perder lo anterior, y saber qué cambió.
create table participacion.transcripcion (
  id            uuid primary key default gen_random_uuid(),
  proceso_id    uuid not null references participacion.proceso (id),
  grabacion_id  uuid not null references participacion.grabacion (id),
  version       integer not null check (version > 0),

  texto         text not null check (length(btrim(texto)) > 0),
  -- `modelo:google/gemini-3.8-flash` o `ciudadano`. Con el nombre del modelo,
  -- porque «lo transcribió una IA» no sirve para explicar por qué cambió algo.
  autor         text not null,
  motivo        text,
  creada_en     timestamptz not null default now(),

  unique (grabacion_id, version)
);

create index on participacion.transcripcion (grabacion_id, version desc);
