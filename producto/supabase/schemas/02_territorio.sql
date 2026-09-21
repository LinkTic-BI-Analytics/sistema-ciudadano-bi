-- El catálogo territorial: DIVIPOLA del DANE (`V10`), y los países.
--
-- **La versión va en cada fila, no en una tabla aparte** (`Q5`). DIVIPOLA
-- cambia: en 1997 los centros poblados pasaron de 2 dígitos a 3, y las notas al
-- pie de junio de 2026 mencionan un deslinde en curso entre Norte de Santander y
-- Boyacá. Un código histórico significa cosas distintas según la versión con que
-- se escribió, y `R2` exige que un corte exportado siga siendo reproducible.
--
-- **Dos catálogos en la misma tabla, y cada uno con su versión.** El nivel
-- `pais` no sale de DIVIPOLA —DIVIPOLA es la división político-administrativa
-- *de Colombia*— sino de ISO 3166-1, con los nombres del CLDR
-- (`producto/datos/paises/`). Están juntos porque son lo mismo para quien los
-- usa: un sitio del mundo con un código y una versión de catálogo, al que una
-- fila puede apuntar.
--
-- Lo que sí hay que saber: **la versión de los países no es la de DIVIPOLA**, y
-- por eso `participacion.tomar_corte` toma la versión de catálogo mirando solo
-- los tres niveles colombianos. Un `max(version)` sobre toda la tabla anotaría
-- en el corte una versión que no es la del catálogo con que se contó.

create table participacion.territorio (
  -- El código compone: departamento 2, municipio 2+3, centro poblado 5+3.
  -- El país no compone con nada: son las dos letras de ISO 3166-1.
  codigo        text not null,
  version       text not null,   -- 'junio 2026' · 'CLDR 48.0'

  nivel         text not null check (nivel in ('pais','departamento','municipio','centro_poblado')),
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
  -- **La forma del código dice de qué nivel es, y al revés.** Antes esto solo
  -- miraba el largo, y con los países en la misma tabla el largo ya no alcanza:
  -- un país y un departamento tienen los dos dos caracteres.
  --
  -- Distinguirlos por la forma —letras contra dígitos— no es un adorno: es lo
  -- que permite que la restricción del aporte compruebe **sin mirar esta
  -- tabla** que un contacto internacional no trae un código de municipio. Una
  -- comprobación entre tablas necesitaría un disparador; esta es declarativa.
  constraint forma_del_codigo check (
    (nivel = 'pais'           and codigo ~ '^[A-Z]{2}$') or
    (nivel = 'departamento'   and codigo ~ '^[0-9]{2}$') or
    (nivel = 'municipio'      and codigo ~ '^[0-9]{5}$') or
    (nivel = 'centro_poblado' and codigo ~ '^[0-9]{8}$')
  ),
  -- Un país no cuelga de nadie: es raíz, como el departamento.
  constraint el_pais_no_tiene_padre check (nivel <> 'pais' or padre is null)
);

create index on participacion.territorio (version, nivel);
create index on participacion.territorio (padre, version);

comment on table participacion.territorio is
  'DIVIPOLA del DANE, del geoportal y no de una republicación, más los países de ISO 3166-1. No llega al barrio: el nivel sub-municipal es rural (V21).';
comment on column participacion.territorio.version is
  'Va en la clave primaria a propósito: el mismo código puede significar otra cosa en otra versión (Q5). La de los países es la del CLDR, no la de DIVIPOLA.';
comment on column participacion.territorio.nivel is
  'pais solo se usa para «desde dónde nos contactas». Dónde ocurre un problema que este sistema pueda atender es siempre un municipio colombiano.';
