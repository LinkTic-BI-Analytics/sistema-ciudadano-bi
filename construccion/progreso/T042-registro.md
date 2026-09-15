# Registro — T042 · De lo macro a lo micro, y quién habla

**Autoridad:** `GEO-01` · `V19` (el aporte es del colectivo, no del vocero) · `Q23`, que sigue
abierta y marca el límite de lo que se puede hacer hoy

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-14 | 13 recorridos del flujo de ubicación y vocería | `afinar.spec.ts` |
| 2026-09-14 | 3 pruebas de vocería, una contra la restricción de la base | `vocero.test.ts` |
| 2026-09-14 | Cascada departamento → municipio, con sus cuentas | `emparejar.test.ts` |

## Buscar por nombre enredaba

Escribir «RIO» devolvía **ocho municipios de ocho departamentos distintos** —Río de Oro en Cesar,
Río Iró en Chocó, Riohacha en La Guajira, Rionegro en Antioquia…— en botones azules idénticos.
Quien buscaba el suyo tenía que leerlos todos, y el que está de último se toca por error.

Ahora se escoge **departamento y después municipio**. La lista baja de 1.122 a 125 como mucho, y
**dentro de un departamento no hay dos con el mismo nombre**: escoger vuelve a ser escoger.

Y es el orden en que la gente sabe dónde vive: nadie duda de su departamento, y mucha gente sí
del nombre exacto de su municipio.

## El dato que nunca se capturaba

El requerimiento hablaba de voceros desde el principio. **`es_colectivo` existía en la tabla
desde el primer día y nadie lo escribía ni lo leía.**

Ahora, antes de terminar, se pregunta *«¿hablas por ti o por un grupo?»*. Si dice que por un
grupo, se guarda **el nombre del grupo**, no el suyo: `V19` dice que el aporte es del colectivo y
no del vocero, así que si mañana cambia quién lo representa, el aporte no se mueve.

**Declarado, nunca verificado.** La especificación es explícita —*«vocero exige verificar
representación y destinatario autorizado»*— y aquí no hay con qué verificar: `Q23` sigue abierta
y **el colectivo no existe como entidad en ninguno de los 24 documentos**. Así que la pantalla se
lo dice a la persona —*«quedará escrito que lo dices tú: no lo verificamos con nadie»*— y la
consola se lo dice al revisor. Callarlo invitaría a leerlo como probado.

La base añade la mitad que no depende de nadie: un nombre de grupo en un aporte que no está
marcado como colectivo **se rechaza**. Un dato así no lo sabría leer nadie.

## Los botones

«Sí, es eso» y «No es eso» estaban en cajas distintas —uno dentro del formulario, otro fuera— y
salían desalineados y de tamaños distintos. Van en `.pc-actions`, que es lo que el sistema de
diseño tiene para una decisión con dos salidas.

## Un reemplazo que no reemplazó nada

El efecto que carga los 33 departamentos **no se añadió**: mi sustitución buscaba un texto que no
existía y no hizo nada, en silencio. El `<select>` se renderizaba vacío.

No lo vio ni el compilador —era válido— ni el chequeo de clases. Lo vio una prueba, y el mensaje
fue exacto: *«did not find some options»*. Desde entonces las sustituciones llevan `assert`.

## Lo que queda abierto

**`Q23` es ahora la que más pesa.** Se está guardando el nombre de un grupo sin poder decir qué
es un grupo, quién lo compone ni quién valida que alguien hable por él. Es lo mínimo honesto, no
es suficiente: **sin eso no se puede notificar a un colectivo**, que es la mitad de para qué
sirve saberlo.

`P6` apunta a la salida: ya exige definir antes de cada encuentro quiénes pueden validar y con
qué mecanismo. Eso es un colectivo con nombre y miembros.
