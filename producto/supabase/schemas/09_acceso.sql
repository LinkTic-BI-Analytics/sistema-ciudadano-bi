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
