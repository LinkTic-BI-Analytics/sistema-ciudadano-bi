# Gestión y escalamiento

15 de septiembre de 2026. Ampliación decidida por Miguel Gómez durante la construcción.
Complementa `RF2` (revisión), `M07` (gestión) y `CLA-01`..`CLA-05`. **No declara una
implementación existente.**

> *«Todo lo capturado debe ser coherente con la información que mostramos en la consola. La
> información acá debe venir ya con el municipio y demás, y acá lo que podemos hacer es corregir
> algunas cosas como esas que pueden estar por mejor ubicación. Pero realmente la información ya
> debe estar: acá es como una gestión que podría escalarla de una mejor forma a una mesa puntual
> o a un equipo que pueda desagregarla un poco mejor. Acá es ver esa estructura, ver si se
> escala o si se debe corregir algo, pero debe ser algo básico: no se debe permitir cambiar el
> sentido de lo que la persona transmitió.»*

## Propósito

La consola no es un segundo formulario. **Lo que llega tiene que llegar completo**, y lo que se
hace ahí es decidir: esto se escala, o esto tiene un error de ubicación que corrijo.

Eso obliga a dos cosas que hoy no se cumplen del todo. La primera es que la captura termine con
el municipio puesto —y no lo hacía: hasta hoy se preguntaba el lugar dos veces y ninguna de las
dos garantizaba llegar a un municipio—. La segunda es que la consola tenga **un techo explícito**
sobre lo que puede tocar. Sin ese techo, «corregir» y «reescribir» se parecen demasiado, y la
diferencia entre las dos es todo el valor de esto: si la consola puede cambiar el sentido de lo
que alguien contó, lo que sube al sistema nacional de planeación ya no es lo que la gente dijo.

## GES-01 · Quien completa la información es la captura, no la consola

**Quién:** la persona que cuenta.

**Con qué llega:** su relato.

**Qué queda:** un aporte con municipio aceptado, tema confirmado, lugar con sus palabras, a
quiénes afecta y desde cuándo — **todo dicho por ella**.

El lugar se pregunta **una sola vez**, en una sola pantalla: departamento, municipio y «con tus
palabras». Antes se preguntaba dos veces —texto libre en una vuelta y municipio en otra— y para
alguien de una vereda dispersa la segunda pregunta es la misma pregunta.

**Qué NO hace:** exigir el municipio para poder enviar (`N02` no lo permite); inferirlo de lo que
escribió (`I2`); dejar que la consola lo complete *por* la persona como si ella lo hubiera dicho.

**Aceptación:** un aporte que pasó por la captura completa llega a la bandeja **sin la palabra
«municipio» en la columna de lo que falta**. Si la persona decidió no decirlo, llega marcado
como lo que es: sin municipio, para que alguien lo aclare — no vacío y en silencio.

## GES-02 · En la consola se corrige, no se reinterpreta

**Quién:** quien revisa.

**Con qué llega:** un aporte ya completo.

**Qué queda:** a lo sumo, una corrección **de forma**, firmada y con motivo.

Se puede corregir:

| Qué | Por qué es corrección y no reinterpretación |
|---|---|
| el municipio aceptado | el código DANE es un hecho verificable: o la referencia queda ahí o no |
| el tema | es una etiqueta de enrutamiento nuestra, no una afirmación de la persona |
| volver la ubicación a «por aclarar» | es admitir que no se sabe, que es lo contrario de inventar |

No se puede tocar, desde ninguna pantalla:

- el **relato original** (`N03`);
- la **síntesis vigente que la persona confirmó** (`V14`: la última palabra sobre lo que quiso
  decir es suya);
- lo que declaró con sus palabras: el lugar, a quiénes, desde cuándo.

**Qué NO hace:** ofrecer un campo de texto para «mejorar la redacción»; permitir corregir sin
motivo; dejar rastro solo del valor nuevo. Corregir el municipio **reemplaza** el que la persona
confirmó, no agrega un segundo territorio: dos territorios significan que el problema cruza dos
municipios, y un error de dedo no es eso.

**Aceptación:** la ficha dice en pantalla qué se puede cambiar y qué no. Toda corrección queda en
auditoría con el valor anterior, el nuevo, quién y por qué.

## GES-03 · Escalar a una mesa o a un equipo

**Quién:** quien revisa.

**Con qué llega:** un expediente abierto (`R1`: uno por necesidad).

**Qué queda:** una **remisión**, con destinatario declarado, motivo y fecha, **pendiente de
aceptación**.

El destinatario se escribe como se llame —«mesa técnica de agua del Huila», «equipo de
infraestructura educativa»— y se marca de qué tipo es. El directorio real de entidades sigue
pendiente (`T016`, `Q…`): hasta que exista, el destinatario es texto declarado y así se muestra.

Motivos típicos, y el que el negocio pidió por su nombre: **esto necesita desagregarse**. Un
aporte puede describir una necesidad que no es una sola cosa, y quien puede partirla es el equipo
que conoce el territorio, no quien la recibió.

**Qué NO hace:** cerrar la remisión por silencio; dar por atendido lo remitido; mover el
expediente a un estado «resuelto» porque alguien lo mandó. La especificación es explícita:
*«remisión no aceptada sigue pendiente»* y *«entidad sin responder no cierra por silencio»*.

**Aceptación:** un expediente remitido aparece como **remitido y pendiente de aceptación**.
Aceptarlo es un acto aparte, de alguien, con fecha. Devolverlo también.

## GES-04 · La bandeja deja ver la estructura antes de abrir nada

**Quién:** quien revisa.

**Qué queda:** una lista donde se ve, por fila, **de qué habla, dónde, qué le falta y si ya se
escaló**.

Hoy se ve el territorio, lo que falta y quién lo tiene. Falta el tema —que es el eje para agrupar
y para escalar— y falta saber si algo ya salió hacia una mesa: sin eso, dos personas remiten lo
mismo dos veces.

**Qué NO hace:** ordenar por puntaje, por popularidad o por «gravedad» calculada (`BI-02`,
`PRI-01`). El orden sigue siendo por fecha, y se puede invertir.

**Aceptación:** la bandeja muestra el tema y el estado de escalamiento sin abrir el aporte, y
sigue sin existir ninguna columna de puntaje.
