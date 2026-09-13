# Tu negocio

Aquí escribes tú. Arranca vacío a propósito.

Lo llenan los comandos, en este orden:

| Archivo | Lo escribe | Qué es |
|---|---|---|
| `insumos/` | tú, a mano | Los documentos que trajo el cliente, tal cual |
| `lectura-documental.md` | `/leer` | Qué dicen esos documentos, y qué hay que preguntarle a una persona por culpa de ellos |
| `dominio.md` | `/descubrir` | El mapa corto: qué es, quién lo usa, cómo se llaman las cosas |
| `notas-de-descubrimiento.md` | `/descubrir` | Las frases textuales de la persona, crudas |
| `especificacion.md` | `/especificar` | **La fuente.** Las reglas, las invariantes, el glosario |
| `preguntas/` | `/preguntar` | Un pliego por tema: lo que se le mandó a alguien para que lo contestara solo, y en qué va |
| `bitacora.md` | `/frente` | Cómo se construyó, frente por frente |
| `vacios.md` | `/vacios` | Lo que la construcción reveló y la especificación no respondía |
| `revision.md` | `/validar` | Qué se revisó, qué preguntaron las personas, y qué brechas quedaron cubiertas o no |

**Si algo choca entre dos de estos, manda la especificación.**

## Antes de empezar

Escribe aquí, en una línea, la regla que manda sobre todas — la única invariante cuyo
incumplimiento **no se puede reparar**. De ella depende el orden de construcción.

> **La regla que manda sobre todas:** <todavía sin definir. Sale de `/especificar`.>

Esa línea es lo único de este archivo que se llena a mano. El resto viene con la plantilla y
se queda como está.

## Nunca

- No cites `ejemplo/` desde aquí. Cuando alguien lo borre, ese enlace muere.
- No dejes líneas `> ➤` adentro de un documento. Son instrucciones de plantilla, y una sección
  con ellas puestas se lee como si estuviera lista.
