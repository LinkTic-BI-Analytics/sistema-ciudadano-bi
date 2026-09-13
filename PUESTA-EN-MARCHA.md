# Puesta en marcha

Qué tiene que pasar para arrancar un negocio nuevo con esta plantilla, en orden, y **quién
puede hacer cada cosa**. Esa es la división que importa: hay pasos que ningún agente puede
dar porque crean cuentas, cuestan plata o son juicios de negocio.

**La línea base llegó** cuando alguien que nunca vio este repositorio lo abre, escribe
`/descubrir`, y sale de esa sesión con `negocio/dominio.md` lleno y sin secciones en blanco.
Todo lo que pide este documento existe para que ese minuto funcione.

---

## 0 · Dos decisiones antes de tocar nada

No son técnicas y no se pueden posponer.

**El MVP no va a producción, y eso se dice en voz alta el primer día.**
Lo que se construye aquí es un instrumento para descubrir qué quiere la persona, no el
producto que va a usar. Si el cliente lo va a lanzar, no es este repositorio: es un
desarrollo formal, y lo que este repositorio produce es su especificación.

Escribirlo en un README no basta. Hay que decírselo a la persona en la primera sesión,
mirándola. Si no se dice, pasa siempre lo mismo: el cliente se enamora del MVP, pide
lanzarlo, y termina en producción un sistema construido para tirarse — sin pruebas, sin
respaldos y sin nadie que lo mantenga. Y el requerimiento formal, que era el punto, nunca
se escribe.

**Quién construye el MVP: Claude, no tú.**
Vale la pena decirlo porque el documento no lo dice en ninguna otra parte y es la duda más
razonable que puede tener alguien que no programa. Tú conduces: haces la entrevista, decides
qué va primero, juzgas si lo que salió es lo que la persona quiso. Claude escribe el código,
levanta las pantallas y siembra los datos de prueba. Los comandos son la forma de pedírselo.

Si nunca has visto construir así, el frente 1 va a parecer magia y el 2 ya no. No hace falta
entender el código: hace falta poder mirar la pantalla y decir si eso era o no era.

**Un negocio, un repositorio.**
No se descubren dos productos en la misma copia. Los códigos se numeran corridos y dos
dominios en el mismo `especificacion.md` producen un grafo que no se puede navegar: `R7`
significa dos cosas y ninguna referencia cruzada sirve. Ver [ADR 0004](decisiones/0004-un-negocio-por-repositorio.md).

---

## 1 · Lo que solo puedes hacer tú

Ninguna la puede hacer un agente: crean cuentas, piden claves, o son decisiones de negocio.

- [ ] **Copiar esta plantilla** a una carpeta nueva con el nombre del negocio. Con el
      Finder o el explorador de archivos, copiar y pegar: no hace falta nada más.
- [ ] **Instalar Claude Code** y entrar con tu cuenta. Es lo único que se instala.
- [ ] **Comprobar que puedes abrir la carpeta y escribir un comando.** Es el paso que hay
      que haber hecho **antes** del lunes, porque es el único que puede fallar y dejarte
      parado delante del cliente:

      1. Abre Claude Code.
      2. Ábrelo **sobre la carpeta que copiaste** — si te pregunta por una carpeta, escoge
         esa; si ya está abierto en otra, ciérralo y vuelve a abrirlo desde ahí.
      3. Escribe `/` y espera un segundo. Tiene que aparecerte una lista con `descubrir`,
         `especificar`, `frente`, `vacios`, `validar`, `entregar` y `donde-voy`.
      4. Escribe `/donde-voy` y presiona Enter. Te tiene que contestar que el negocio está
         vacío y que lo que sigue es `/descubrir`.

      **Si esos siete comandos no aparecen en la lista, algo quedó mal copiado** — casi
      siempre es que Claude Code está abierto sobre la carpeta equivocada. Arréglalo el
      viernes, no el lunes.
- [ ] **Dejarle aire a la máquina antes de construir.**

      El MVP levanta una base de datos en Docker, y eso no cabe en cualquier parte. Si en esa
      máquina ya hay otros proyectos con su propio Docker levantado, el que llega de último
      es el que se cae — y el error nunca dice "no hay memoria": dice que un contenedor no
      pasó su chequeo de salud, o simplemente se cuelga.

      Pasó construyendo: cuatro proyectos de Supabase corriendo, más de cuarenta
      contenedores, y la máquina en 17 de carga con la máquina virtual de Docker al 394%.
      Tres reinicios perdidos antes de entender que el problema no era el código.

      Antes de `/frente 1`, mira qué hay levantado y apaga lo que no estés usando:

      ```
      docker ps --format '{{.Names}}' | wc -l      # cuántos contenedores hay
      uptime                                        # la carga de la máquina
      ```

      **Con la carga por encima de 8 en una máquina de escritorio, no arranques.** Y cuando
      pares de trabajar en un negocio, apaga su stack: `supabase stop`. Dejarlo prendido no
      cuesta nada hoy y cuesta el arranque del siguiente.

- [ ] **Conseguir a la persona que tiene la idea en la cabeza, y una hora seguida suya.**

      Es el requisito más caro de esta lista y el que más se subestima. Sin esa persona no
      hay `/descubrir` que valga: un modelo puede inventar un dominio plausible en cinco
      minutos, y un dominio plausible es exactamente lo que no queremos — se ve bien, se
      lee bien, y no describe el negocio de nadie.

      Una hora seguida, no seis pedazos de diez minutos. La entrevista funciona porque se
      encadena: la respuesta de la pregunta cuatro cambia la pregunta siete.
- [ ] **Pedirle al cliente los documentos que ya tenga**, si tiene: el reglamento, el
      manual, los formatos, la hoja de cálculo, una foto del cuaderno. Con los dos o tres
      que gobiernan de verdad el proceso alcanza — veinte archivos producen una lectura
      larga y ninguna pregunta mejor.

      Pide permiso y di para qué se van a usar. Van a `negocio/insumos/`, y de ahí sale
      `/leer` **antes** de la entrevista: no la reemplaza, la afila.
- [ ] **Decidir el nombre del negocio** y el nombre corto que van a llevar los archivos.
- [ ] **Borrar `ejemplo/`** cuando ya no lo necesites. Está para comparar, no para vivir en
      tu repositorio. `/descubrir` te lo ofrece una vez.

Las cuentas de Supabase, Vercel y GitHub Actions **no hacen falta todavía**. Se listan aquí
para que no sorprendan cuando lleguen: hacen falta cuando esta plantilla traiga el stack.

---

## 2 · Lo que hago yo, sin que me pidas nada

Todo esto es leer y escribir archivos. No necesita credenciales ni decisiones tuyas.

- [ ] Conducir la entrevista y escribir `negocio/dominio.md` con sus siete secciones.
- [ ] Guardar las frases textuales en `negocio/notas-de-descubrimiento.md`, crudas y sin
      editar. Se van a necesitar cuando una regla no cuadre y haya que volver a lo que la
      persona dijo de verdad.
- [ ] Sacar la especificación v0 con sus cinco familias de códigos y su §9.
- [ ] Partir el dominio en frentes y decir cuál no es negociable en su primer punto.
- [ ] Registrar en `negocio/vacios.md` cada cosa que quedó sin responder, con qué bloquea y
      cuándo se vuelve urgente.
- [ ] Auditar el grafo: códigos citados que no existen, códigos definidos que nadie cita,
      reglas sin caso de verificación, enlaces rotos.

---

## 3 · Lo que hacemos juntos

Ninguna la puedo hacer solo porque son juicios. Ninguna la haces sola porque son mucho texto.

- [ ] **Escoger la invariante suprema.** La única cuyo incumplimiento no se puede reparar.
      Yo puedo proponer candidatas de lo que se dijo en la entrevista; cuál es, lo decides
      tú, porque de eso depende el orden de construcción.
- [ ] **Escribir las personas validadoras.** Necesito de ti la vida de cada una: edad,
      ciudad, contexto, desde qué aparato entra, y sobre todo **la pregunta con la que abre
      la aplicación**. Una persona sin pregunta produce una lista de mejoras genéricas.
- [ ] **Revisar el recorrido mínimo antes de construir nada.** Te lo leo de vuelta y me
      dices sí o no. Es el punto más barato para descubrir que entendí mal.

---

## 4 · Cómo se sabe que la línea base quedó

Cinco pruebas. Ninguna es "el archivo existe".

| # | Prueba | Cómo se corre |
|---|---|---|
| 1 | Se sale de `/descubrir` con `dominio.md` lleno, sin secciones en blanco y sin instrucciones de plantilla adentro | Con la persona de verdad |
| 2 | La especificación tiene **al menos una invariante**, y ningún código citado que no exista | Lo dice el escribano |
| 3 | Cada regla tiene al menos un caso en la §9, con el resultado calculado a mano | Lo dice el escribano |
| 4 | Le lees el recorrido mínimo a la persona y dice que sí | En voz alta, no por escrito |
| 5 | El primer frente está construido y se puede tocar en una pantalla | Abriéndola. **Esta espera al stack** — ver §5 |

La prueba 2 es la que más se falla. Una especificación sin invariantes no está terminada:
significa que nadie preguntó qué no puede pasar nunca, que es la pregunta que más destapa.

---

## 5 · Lo que todavía no trae esta plantilla

| Qué falta | Por qué no está |
|---|---|
| El stack y su configuración | Llega en la siguiente pasada. **Está decidido y es el mismo del proyecto donde nació el método** — Next 15, Supabase y Vercel, con versiones exactas en el [ADR 0006](decisiones/0006-stack-fijo.md) |
| Las reglas de interfaz y de base de datos (`harness/`) | Son reglas **sobre código**. Escribirlas sin código es escribir reglas que nada comprueba |
| Los chequeos automáticos (`scripts/`) | Un chequeo que no se ha visto fallar no es un chequeo, y hoy no hay contra qué verlos fallar |
| Las personas validadoras de pantalla | Se escriben cuando hay pantalla. Lo que sí viene son los dos revisores de documentos |

Mientras tanto, la auditoría del grafo la hace el escribano y la corre `/donde-voy`. Está
dicho aquí y no en un comentario porque **un chequeo que hay que acordarse de correr no es
un chequeo**: cuando llegue el stack, esto pasa a `scripts/`.

---

## Sobre las notas de la entrevista

`negocio/notas-de-descubrimiento.md` guarda las frases textuales de la persona. Van a llevar
nombres, montos, quejas sobre terceros y cosas que se dijeron en confianza.

- Dile que vas a tomar notas textuales, antes de empezar. No es un trámite: cambia lo que la
  gente cuenta, y es mejor saberlo desde el principio.
- Si el repositorio va a ser público o compartido, saca ese archivo. El `.gitignore` trae la
  línea lista para activarla.
- No lo pegues en un chat ni en un correo. Es el archivo con más información sensible de
  todo el proyecto y el que menos parece serlo.

---

## 6 · Los tres errores que hunden un arranque

**Entrevistar y no construir.** Se hacen tres sesiones, sale un documento de cuarenta
páginas, y nadie descubrió nada que la persona no supiera ya. El valor de este método está
en lo que la construcción obliga a decidir — cosas que ninguna entrevista destapa porque
nadie sabe que son preguntas hasta que hay que escribir el código. Construye el primer
frente aunque la especificación esté incompleta. Está pensada para estar incompleta.

**Construir y no escribir la §9.** Los casos de verificación se escriben con números
calculados a mano, **antes** de que exista el sistema. Escribirlos después es preguntarle
al sistema si está de acuerdo consigo mismo: siempre dice que sí.

**Dejar la invariante suprema para después.** Se construyen tres frentes y luego se intenta
agregar encima. No funciona: agregar una restricción sobre datos que ya existen es
exactamente como se producen las fugas que la invariante debía impedir. Va primero, antes
de la primera tabla.

---

## Lo que dejo dicho aunque no lo preguntes

- **El guion de la entrevista se va a quedar corto en el primer negocio de verdad.** Está
  bien: para eso está [metodo/cosecha.md](metodo/cosecha.md), que dice qué vuelve a la
  plantilla cuando un negocio termina. Una plantilla que no cosecha se muere en su primera
  versión.
- **El riesgo real no es que falte un documento: es descubrir bien y no entregar.** La
  parte divertida es el MVP. El único momento del ciclo que produce algo para alguien de
  afuera es `/entregar`, y es el que se pospone.
- **Nadie va a leer `metodo/` de corrido**, y está escrito sabiéndolo. Cada comando cita la
  sección exacta que hace falta en ese momento.
