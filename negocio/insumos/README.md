# Insumos

Lo que el cliente trajo: reglamentos, manuales, formatos, contratos, hojas de cálculo,
reportes, capturas de pantalla del sistema viejo, fotos del cuaderno.

Aquí se ponen tal cual, sin renombrar y sin ordenar. `./scripts/leer-insumos.sh` los
prepara —texto con sus tablas, figuras aparte, OCR a lo escaneado— y `/leer` los analiza y
produce `negocio/lectura-documental.md`.

Un PDF escaneado o fotografiado **no tiene una sola letra que extraer**. El script lo
detecta y le pasa el OCR de macOS, que corre en esta máquina y no manda nada afuera.

## Qué se puede leer

| Sirve | Cómo |
|---|---|
| PDF | Directo |
| Fotos y capturas de pantalla | Directo. Una foto del cuaderno vale tanto como un manual |
| Word, texto, markdown | Directo |
| Excel y hojas de cálculo | **Guárdalas también como CSV**, una por pestaña. Es lo que se puede leer bien |
| Correos y chats | Pégalos en un archivo de texto. Las conversaciones sueltas suelen tener las excepciones que ningún manual menciona |

Si algo no se puede leer, `/leer` lo dice en vez de adivinar qué había adentro.

## Cuidado con lo que se pone aquí

Estos archivos son del cliente y casi siempre llevan nombres de personas, montos, datos de
contacto o información interna.

- Pide permiso antes de traerlos, y di para qué se van a usar.
- **Esta carpeta está fuera de git**, y lo que el script extrae de ella también.
- **Nada de aquí sale hacia un servicio de afuera sin autorización escrita** en
  `negocio/autorizacion-de-salida.md`. La lectura corre local por defecto justamente para
  que esa conversación no haya que tenerla casi nunca.
- No hace falta traer todo: con los dos o tres documentos que gobiernan de verdad el
  proceso alcanza. Veinte archivos producen una lectura larga y ninguna pregunta mejor.
