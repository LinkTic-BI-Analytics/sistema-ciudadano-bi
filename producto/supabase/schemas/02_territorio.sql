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
