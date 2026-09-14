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
