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
  -- todavía no existe como entidad (`Q23`), así que se guarda **lo que la
  -- persona dijo**, no una referencia a algo que no está modelado.
  --
  -- `colectivo_declarado` es exactamente eso: declarado. **Nadie verificó que
  -- quien escribe represente a ese grupo**, y la especificación es explícita —
  -- *«vocero exige verificar representación y destinatario autorizado»*—. Un
  -- campo que dijera «vocero» a secas se leería como verificado, y aquí no hay
  -- con qué verificar hasta que `Q23` se cierre.
  -- Lo que la persona precisó después de contar, en las vueltas de afinado
  -- (ADR 0012). Las dos son opcionales: vacío significa **no lo dijo**, y eso
  -- es una respuesta, no un hueco por llenar.
  --
  -- `desde_cuando` es TEXTO y nunca una fecha. «Hace tres meses» no es una
  -- fecha, y convertirlo en una sería exactamente la inferencia que `I2`
  -- prohíbe: nadie sabe si son noventa días o el invierno pasado.
  afectados         text,
  desde_cuando      text,

  -- **Desde dónde nos contacta la persona, que NO es dónde ocurre el problema.**
  -- Son dos preguntas distintas y juntarlas es el error que `GEO-01` ya nombra
  -- para la residencia: *«una dirección residencial no se usa como lugar del
  -- problema sin confirmación»*. Quien escribe desde Madrid sobre la vía de su
  -- vereda en Caldas está diciendo dos cosas, y el municipio afectado sigue
  -- siendo Caldas — eso vive en `participacion.ubicacion` y aquí no se toca.
  --
  -- Por qué aquí y no en `ubicacion`: `ubicacion` es de dónde ocurre, un aporte
  -- puede tener varias y es lo que cuentan `R1` y `R2`. Meter el contacto ahí
  -- sumaría a la persona en un territorio donde no pasa nada, y ese es
  -- exactamente el numerador que `R2` protege. Esto es un hecho declarado del
  -- aporte, como `afectados` o `desde_cuando`: vacío significa **no lo dijo**.
  --
  --   nacional       el código es un municipio de DIVIPOLA (5 dígitos)
  --   internacional  el código es un país de ISO 3166-1 (2 letras)
  contacto_ambito   text check (contacto_ambito in ('nacional','internacional')),
  contacto_codigo   text,
  contacto_version  text,
  foreign key (contacto_codigo, contacto_version)
    references participacion.territorio (codigo, version),

  -- **El ámbito y el código no se pueden contradecir, y lo impide la base.**
  -- Se apoya en `forma_del_codigo` de `participacion.territorio`: allí un país
  -- son dos letras y un municipio cinco dígitos, así que la forma del código ya
  -- dice de qué nivel es. Sin esto, «internacional · 05001» sería una fila
  -- válida que ninguna pantalla sabe leer.
  constraint el_contacto_cuadra_con_el_ambito check (
    contacto_codigo is null
    or (contacto_ambito = 'nacional'      and contacto_codigo ~ '^[0-9]{5}$')
    or (contacto_ambito = 'internacional' and contacto_codigo ~ '^[A-Z]{2}$')
  ),
  -- La clave foránea no lo exige —con una columna nula se salta la
  -- comprobación—, así que se exige aquí: un código sin versión de catálogo no
  -- se puede volver a leer dentro de un año (`Q5`).
  constraint el_contacto_trae_su_version
    check ((contacto_codigo is null) = (contacto_version is null)),

  -- La grabación, cuando la persona habló. **Es el original** (ADR 0013), y por
  -- eso el aporte apunta a ella y no al revés.
  --
  -- La comprobación es la regla entera: un aporte por voz **sin** grabación
  -- sería un aporte cuyo original se perdió, y uno escrito **con** grabación
  -- sería un archivo que nadie sabe de dónde salió.
  grabacion_id        uuid unique references participacion.grabacion (id),
  constraint la_voz_exige_grabacion
    check ((canal = 'voz_transcrita') = (grabacion_id is not null)),

  -- El contexto del enlace (`QR-03`), en columnas separadas a propósito.
  --
  -- `enlace_id` dice **de dónde vino**; `evento_confirmado_id`, **en qué evento
  -- dice la persona que participa**; y `lugar_declarado`, más arriba, **dónde
  -- ocurre el problema**. Los tres pueden ser distintos y juntarlos en uno solo
  -- es lo que haría creer que quien escaneó el afiche de A asistió a A.
  --
  -- El evento de origen no se guarda: sale del enlace. «El vínculo registrado
  -- del enlace determina su evento de origen», y duplicarlo abriría la puerta a
  -- que los dos dijeran cosas distintas.
  enlace_id           text references participacion.enlace (id),
  evento_confirmado_id uuid references participacion.encuentro (id),

  -- **Abrir un enlace no confirma contexto.** Nace sin resolver, y solo la
  -- persona lo mueve.
  estado_contexto     text not null default 'sin_resolver'
                      check (estado_contexto in ('confirmado','cambiado','sin_evento','sin_resolver')),
  constraint contexto_con_evento check (
    (estado_contexto in ('confirmado','cambiado')) = (evento_confirmado_id is not null)
  ),

  -- Lo que llegó en la dirección, tal cual y ya validado. Se guarda aparte de
  -- las UTMs configuradas del enlace porque **no son lo mismo**: estas pueden
  -- venir alteradas, y una alterada no cambia el evento registrado.
  utms_recibidas      jsonb,

  -- El tema (`CLA-01`). Es el eje que faltaba: sin él no se puede agrupar lo
  -- que se repite, ni saber a qué entidad compete, ni ver que veinte personas
  -- de un municipio están contando lo mismo.
  --
  -- **Son los sectores administrativos del Estado**, no las palabras con que la
  -- gente cuenta su problema: así el tema y la entidad que responde son el
  -- mismo dato. Lo que traduce «no llega el agua» a «Vivienda, Ciudad y
  -- Territorio» es `QUE_CUBRE`, en `src/captura/lectura.ts`.
  --
  -- **Se guarda el nombre del sector, no una clave corta.** Hubo un día en que
  -- el código guardaba `vivienda` y la base exigía el nombre largo: guardar un
  -- tema desde la consola reventaba, y los 831 aportes clasificados se veían
  -- «sin tema» porque el producto no reconocía lo que él mismo había escrito.
  -- Dos formas de escribir lo mismo son dos fuentes de verdad.
  --
  -- **La lista es provisional** y así se dice en pantalla: la especificación
  -- dejó las taxonomías sin cerrar (`T018`, `Q32`).
  --
  -- Dos columnas y no una: `tema_propuesto` es lo que leyó la máquina y `tema`
  -- lo que confirmó la persona. Juntarlas haría imposible saber cuánto se
  -- equivoca la lectura, que es lo único que dirá si la lista sirve.
  tema                text,
  tema_propuesto      text,
  -- **Esta lista y la de `src/captura/lectura.ts` son la misma, y hay un
  -- chequeo que lo comprueba.** Se ampliaron los temas en el código y aquí no:
  -- el `update` con «empleo» lo rechazaba la base, el error no se miraba, y el
  -- aporte quedaba sin tema mientras la pantalla decía «la lectura propuso
  -- Empleo e ingresos». Nadie se enteraba porque `tema_propuesto` no tiene esta
  -- restricción y sí se guardaba.
  --
  -- No hay «otra cosa»: son los veinticuatro sectores y nada más. Lo que la
  -- lectura no sepa clasificar queda en `null`, que ya es un estado con nombre
  -- en la pantalla —«sin tema»— y se puede filtrar.
  constraint tema_de_la_lista check (
    tema is null or tema in ('Salud y Protección Social',
                             'Vivienda, Ciudad y Territorio',
                             'Transporte',
                             'Educación',
                             'Ambiente y Desarrollo Sostenible',
                             'Defensa',
                             'Agricultura y Desarrollo Rural',
                             'Comercio, Industria y Turismo',
                             'Minas y Energía',
                             'Inclusión Social y Reconciliación',
                             'Presidencia de la República',
                             'Tecnologías de la Información y la Comunicación',
                             'Deporte y Recreación',
                             'Justicia',
                             'Culturas',
                             'Interior',
                             'Relaciones Exteriores',
                             'Función Pública',
                             'Hacienda',
                             'Ciencia, Tecnología e Innovación',
                             'Planeación',
                             'Trabajo',
                             'Estadística',
                             'Inteligencia')
  ),

  es_colectivo        boolean not null default false,
  colectivo_declarado text,
  constraint colectivo_con_nombre
    -- No se puede decir «hablo por un grupo» sin decir cuál. Un aporte marcado
    -- como colectivo y sin grupo no le sirve a nadie: ni se puede notificar ni
    -- se puede saber a quién representa.
    check (colectivo_declarado is null or es_colectivo),

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
comment on column participacion.aporte.contacto_ambito is
  'Desde dónde escribe la persona, no dónde ocurre el problema. Nulo significa que no lo dijo, y eso es una respuesta (N02).';
comment on column participacion.aporte.contacto_codigo is
  'Municipio de DIVIPOLA si el ámbito es nacional; país de ISO 3166-1 si es internacional. Nunca entra en el denominador de R2.';
