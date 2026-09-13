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

## Lo que llega con el stack

Estas secciones están reservadas y vacías a propósito. La siguiente pasada las rellena; no
anexa un contrato aparte.

### §8 · Dónde vive la lógica
*(pendiente)*

### §9 · Base de datos
*(pendiente)*

### §10 · Interfaz
*(pendiente)*

### §11 · Entornos y credenciales
*(pendiente)*

### §12 · Definición de terminado — el código
*(pendiente)*
