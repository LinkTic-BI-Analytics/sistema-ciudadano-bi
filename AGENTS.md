# Reglas del repositorio

Fuente única. Si algo en otro archivo contradice esto, manda esto — salvo la especificación
del negocio, que manda sobre todo en lo que toca al dominio.

## §0 · Antes de escribir nada

Lee en este orden, y no te saltes el primero:

1. `negocio/dominio.md` — de qué se trata este negocio y cómo se llaman las cosas.
2. `negocio/especificacion.md` — las reglas. Es la fuente.
3. `negocio/vacios.md` — lo que ya se decidió construyendo. **No re-litigues lo que está ahí.**
4. `metodo/codigos.md` — cómo se escribe cada familia de código.
5. `metodo/como-se-escribe.md` — el estilo.

Si `negocio/` está vacío, el repositorio no ha arrancado: corre `/leer` si el cliente trajo
documentos, y `/descubrir` en cualquier caso. `/leer` no reemplaza la entrevista: produce las
preguntas con las que la entrevista arranca — y si no hay hora en vivo, `/preguntar` las manda
por escrito.

## §1 · La partición

> Si borrar este negocio lo dejaría sin sentido, va en `negocio/`.
> Si serviría igual para descubrir otro negocio, va en `metodo/` o `plantillas/`.
> Si es el instrumento que se construye para descubrir, va en `mvp/`.
> Si es la línea gráfica que el cliente entregó, va en `negocio/linea-grafica/`.
> Si es lo que recibe el equipo de desarrollo, va en `entregable/`.

`metodo/`, `plantillas/`, `decisiones/` y `ejemplo/` son **de solo lectura** durante un
descubrimiento. Si hace falta cambiarlos, es una cosecha (`metodo/cosecha.md`) y se hace a
propósito, no de paso.

`ejemplo/` no es de este negocio y nunca se cita desde `negocio/`. Un enlace de `negocio/`
a `ejemplo/` es un defecto: cuando alguien borre el ejemplo, ese enlace muere.

## §2 · El MVP es un instrumento, no un producto

Se construye para descubrir y para tirarse. Consecuencias que sí cambian lo que se hace:

- **No hay documento de salida a producción**, y no se escribe uno. Lo que hay es
  `plantillas/mostrar-el-mvp.md`: cómo se le enseña a la persona y qué se observa mientras
  lo usa. Ver [ADR 0001](decisiones/0001-el-mvp-es-instrumento-no-producto.md).
- **No se optimiza lo que no se va a mantener.** Rendimiento, escalabilidad y tolerancia a
  fallas no son criterios aquí. Claridad y velocidad de construcción, sí.
- **Sí se respetan las invariantes.** Un MVP que permite lo que la invariante prohíbe
  enseña un dominio falso, y las conclusiones que salgan de usarlo van a ser falsas.

## §3 · Cómo se escribe

- **Español de Colombia.** Como habla la gente, no como escribe el software.
- **Cada afirmación trae su porqué.** Una regla sin razón se racionaliza en la primera
  discusión.
- **Números concretos.** "Costó dos sábados" convence donde "puede generar inconvenientes"
  no convence.
- **Prohibido inventar.** Si un dato no salió de la entrevista, va a `vacios.md` como dato
  que falta, no a la especificación como si alguien lo hubiera dicho.
- **Dos excepciones, y solo dos:** los datos de la cuenta demo y las personas validadoras.
  No son datos del negocio — son un escenario para poder mirar y alguien para mirarlo — y
  viven fuera de `negocio/`. Todo lo demás que no se dijo, no se escribe.
- **Nunca dejes instrucciones de plantilla adentro de un documento del negocio.** Un
  documento a medio llenar con las instrucciones todavía puestas es un documento sin
  terminar, y se lee como si estuviera listo.
- Ver `metodo/como-se-escribe.md` para el detalle.

## §4 · Los comandos

Un comando **no sabe la forma de un documento: la lee de su plantilla en tiempo de
ejecución**. Si un comando trae adentro los encabezados que va a escribir, en tres meses la
plantilla y el comando dicen cosas distintas y nadie sabe cuál manda. Ver
[ADR 0003](decisiones/0003-el-proceso-va-en-comandos.md).

Un comando que va a escribir sobre algo que ya existe **pregunta antes**. El trabajo de un
descubrimiento son horas de conversación con una persona: no se pisa sin avisar.

## §5 · Los códigos

Corridos, para siempre, y nunca reciclados. Los códigos de un módulo entregado son los
mismos de la especificación — si `R3` en el entregable no es `R3` en la especificación, el
documento dejó de ser rastreable. Detalle en `metodo/codigos.md`.

## §6 · Cuándo parar y preguntar

Estas cuatro no se resuelven solo:

- **Una decisión de negocio que la especificación no responde.** Se anota en `vacios.md`
  como pregunta abierta, con qué bloquea. No se decide callado.
- **Una contradicción entre dos cosas que la persona dijo en momentos distintos.** Se
  muestra la contradicción, no se escoge una.
- **Una invariante que estorba para construir.** Es la señal de que el diseño está mal, no
  la invariante.
- **La especificación sin ninguna invariante.** El descubrimiento no terminó: falta
  preguntar qué no puede pasar nunca.

## §7 · Definición de terminado — un documento

- Ninguna sección quedó con las instrucciones de la plantilla adentro.
- Todo código que se cita existe; todo código que se define lo cita alguien.
- Toda regla tiene al menos un caso en la sección de verificación, **con el resultado
  calculado a mano**, nunca con lo que devolvió una implementación.
- Todos los enlaces resuelven.
- Lo que se decidió construyendo quedó en `vacios.md` con el artefacto donde vive.

Lo corre `/donde-voy`, que llama al escribano. Cuando llegue el stack, esto pasa a
`scripts/` — **un chequeo que hay que acordarse de correr no es un chequeo**.

---

## La capa de construcción

Las secciones que siguen gobiernan **el código del producto formal**, no el MVP. La frontera
entre las dos capas es el módulo entregable, y quién manda cuando chocan está en el
[ADR 0011](decisiones/0011-el-harness-y-superpowers.md).

**Una advertencia que no se puede saltar.** El [ADR 0006](decisiones/0006-stack-fijo.md) fija
el stack **del MVP**, y él mismo dice que *«el stack del MVP no compromete nada de lo que
venga después»*. Además, `negocio/especificacion-v0-2026-09-13/vacios.md` tiene abierto
**«motor de base de datos e infraestructura cloud: sin especificar»**. Para un servicio del
Estado colombiano eso arrastra preguntas de residencia de datos que nadie ha respondido.

Por eso estas cinco secciones están escritas **contra Postgres y un framework con servidor**,
no contra un proveedor. Las reglas se cumplen igual con Supabase gestionado que con Postgres
propio. **El proveedor es una `Q` abierta y se decide con el negocio, no de paso.**

### §8 · Dónde vive la lógica

Cuatro niveles, en este orden. **Nunca la misma regla en dos niveles** — el día que una
cambie, la otra se queda, y nadie va a saber cuál se estaba aplicando.

| # | Nivel | Cuándo es el nivel correcto |
|---|---|---|
| 1 | Acceso a nivel de fila (RLS) | La regla dice **quién puede ver o tocar qué fila**. Aislamiento, ámbito por territorio, superficie pública contra interna |
| 2 | Función en Postgres | La regla es una **cuenta o una restricción sobre datos**, y tiene que valer aunque el llamado venga por otra puerta |
| 3 | Acción de servidor | La regla **orquesta**: valida una forma, llama a 2, compone una respuesta |
| 4 | Función de borde | Solo lo que **no puede vivir en el ciclo de una petición**: trabajos programados, webhooks, cosas largas |

**Cómo se escoge, sin discutirlo cada vez.** La pregunta es *«¿qué pasa si alguien llama
esto por otra puerta?»*. Si la respuesta es «se rompe», el nivel está muy arriba y baja.

**Las invariantes bajan hasta donde se vuelven imposibles, no hasta donde se validan.**
Esto es lo que separa una invariante de una cualidad: una cualidad se puede cumplir mejor o
peor; una invariante se cumple o se rompe. Una invariante implementada solo en el nivel 3 es
una invariante que un `curl` rompe.

| Invariante de esta especificación | Dónde tiene que hacerse imposible |
|---|---|
| `I1` · un reintento técnico no duplica un aporte | Nivel 2: **restricción única sobre la clave de envío**. No un `if` en el servidor, y explícitamente **no** por similitud ni por IP — la propia `I1` lo prohíbe |
| `I2` · no inferir datos que faltan | Nivel 2: la ubicación tiene tres estados y el esquema no admite un cuarto implícito. Un `NULL` que se lee como «desconocido» ya es una inferencia |
| `I4` · agrupar es reversible | Nivel 2: el vínculo aporte→necesidad es una fila con autor, fecha y motivo. **Fusionar registros destruye la reversibilidad**: nunca se fusiona |
| `I6` · no divulgar identidad ni ubicación sensible | Nivel 1, y **también por URL directa**. Ocultar un botón no es un permiso; `backoffice-especificacion.md` ya lo dice con esas palabras |

**Lo que JavaScript no hace.** Formatea; no calcula. Las cuentas de `R1` y `R2` —no sumar
subtotales solapados, y los aportes sin ubicación que entran al total pero no al denominador
municipal— viven en el nivel 2 y se prueban ahí. Si el mapa, la lista y la exportación
hacen cada uno su propia cuenta, `I6` se rompe sola.

### §9 · Base de datos

**El esquema declarativo es la fuente de verdad.** Nunca se toca por un panel de
administración: un cambio que no está en un archivo es un cambio que el siguiente entorno no
tiene. `scripts/esquema.sh` genera la migración concatenando `supabase/schemas/*.sql`.

**Antes de escribir la primera migración hay que cerrar `[B2]`.** La pregunta es si un aporte
retirado por seguridad **se borra o se apaga**, y `vacios.md` la marca como *«la que bloquea
todo lo demás»* con razón: decide si el modelo es append-only con lápidas o admite borrado
físico, y eso **toca las diez tablas**. Escribir migraciones antes de esa respuesta es
garantizar reescribirlas.

Lo que sí está decidido y no se discute por tabla:

- **El dinero es `numeric`.** Las cuentas se hacen en Postgres.
- **La auditoría es append-only** y no se reescribe cuando se revoca un permiso. Una
  auditoría que se puede editar no es una auditoría.
- **Los catálogos son versionados**, y entre versiones hay **correspondencia explícita**. El
  catálogo geográfico cambia; un corte exportado en marzo tiene que seguir siendo
  reproducible en octubre.
- **La identidad y el contacto viven separados del dato analítico.** No es una vista: es una
  partición. Es lo que hace cumplible que Comunicaciones no pueda descargar contactos.
- **Seis entidades que la tentación junta y no se juntan:** aporte ≠ persona ≠ asistencia ≠
  apoyo ≠ necesidad ≠ decisión. Y en gestión, **recepción, respuesta, solución, financiación
  y ejecución son cinco eventos distintos**, nunca un campo `estado`.
- **Un aporte multiterritorial no se duplica por territorio.** `R1`: una necesidad en N
  municipios sigue siendo una necesidad.

Antes de crear una tabla se lee la skill `supabase-postgres-best-practices`.

### §10 · Interfaz

Las reglas de pantalla están en [`harness/interfaz.md`](harness/interfaz.md), cada una con el
hallazgo que la produjo. **Se leen antes de tocar una pantalla**, no después.

Lo que este negocio agrega:

- **La línea gráfica es del producto, nunca del harness** (`interfaz.md` I5). Las vistas
  `/modulos`, `/telemetria` y `/construccion` traen sus propios tokens y no leen los del
  producto: son internas y se ven igual en todos los proyectos.
- **Los tokens salen de `negocio/linea-grafica/tokens/`** y se generan, no se escriben. El
  sistema v0.5 trae 319 tokens en formato DTCG y un generador que valida ciclos de alias.
  **Editar el CSS generado a mano lo desincroniza del JSON**, y el JSON es la fuente.
- **El contraste es una compuerta, no una recomendación.** El generador comprueba 41 pares
  con umbral 4.5:1 para texto y 3:1 para bordes y foco, y **falla si alguno baja**. Entra a
  `scripts/validar.sh`. La Resolución 1519 de 2020 de MinTIC obliga WCAG 2.1 AA a los
  sujetos obligados; el sistema de diseño apunta a 2.2 AA.
- **El estado nunca se comunica solo por color**, y una confirmación no es un aviso que se
  va solo.
- **Ocultar un botón no sustituye un permiso de servidor.** Un permiso que solo existe en la
  pantalla no existe.
- **Dos dimensiones de estado no se colapsan en una.** La demo del sistema de diseño usa
  `captureOpen` como simplificación y avisa que no debe sustituir a las cuatro reales:
  estado del encuentro, de la inscripción, de la ventana de aportes y de la publicación.

### §11 · Entornos y credenciales

- **Las llaves son `publishable` y `secret`**, no las viejas `anon` y `service_role`. La
  `secret` no aparece nunca en código que llegue al navegador.
- **El identificador del proyecto local lleva el nombre del negocio**, no `mvp`. Los
  contenedores se llaman `supabase_db_<id>`, y en una máquina con más de un proyecto un
  identificador genérico choca por prefijo: `docker exec` empieza a hablarle al contenedor
  equivocado, y el error no habla de eso.
- **El bloque de puertos también se escoge.** El `543xx` que trae `supabase init` lo usa el
  primer proyecto que se haya levantado en esa máquina. `lsof -nP -iTCP:<puerto> -sTCP:LISTEN`
  dice cuál está libre, y el que se escoja queda anotado.
- **`negocio/insumos/` no sale de la máquina.** El [ADR 0008](decisiones/0008-la-lectura-corre-local.md)
  lo sostiene, y `negocio/autorizacion-de-salida.md` es la compuerta cuando haga falta: no es
  un aviso, es un `return False`.
- **Ningún dato real de ciudadanía en entornos que no sean producción.** Un relato con el
  nombre de un municipio pequeño reidentifica a quien lo contó, y eso es exactamente lo que
  `C2` existe para impedir.

### §12 · Definición de terminado — el código

`AGENTS.md` §7 define cuándo un **documento** está terminado. Esto es lo mismo para código, y
**ninguna casilla se marca con una afirmación**: cada una se marca con algo que se corrió.

- [ ] Existe una prueba que **se vio fallar** por la ausencia del comportamiento, con el
      mensaje exacto registrado. *Un chequeo que no se ha visto fallar no es un chequeo.*
- [ ] La prueba pasa ahora, y el resultado está en el registro.
- [ ] Los códigos `RF` `C` `P` `R` `I` del contrato están cubiertos, y **no se agregó alcance**.
- [ ] Cada invariante que toca está implementada en el nivel de §8 que la hace imposible, no
      en uno que solo la valida.
- [ ] Los casos de verificación salen de la §9 de la especificación, **con el resultado
      calculado a mano** — nunca con lo que devolvió la implementación.
- [ ] No se modificó ninguna superficie ajena a la declarada en el contrato.
- [ ] Pasó revisión de cumplimiento **y** revisión técnica, en ese orden. El constructor no
      aprueba su propio trabajo.
- [ ] `scripts/validar.sh` devuelve 0.
- [ ] La hoja de ruta y el registro de progreso quedaron actualizados con la evidencia.

**Y una que no es una casilla:** si al construir apareció una decisión que la especificación
no responde, va a `negocio/vacios.md` como `Q` con qué bloquea y cuándo se vuelve urgente.
Eso es la mitad del valor del método (§6), y se pierde entero si se decide callado.
