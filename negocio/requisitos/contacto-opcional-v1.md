# Contacto opcional, al final

15 de septiembre de 2026. Ampliación decidida por Miguel Gómez durante la construcción.
Complementa `RF4`, `RF5`, `RF8`/`RES-01` y `M01`. **No declara una implementación existente.**

> *«Debemos organizar el flujo normal y un flujo validado, donde una persona quiera llenar la
> información de quién es y poner su correo para ver qué pasó con su propuesta. Valida en los
> requerimientos qué decíamos de esto, porque creo que podemos tener algo que no estamos
> ajustando. El flujo de validación creo que se puede hacer al final, para primero capturar las
> cosas importantes, y luego sería más el contacto.»*

## Lo que encontré al validarlo

**La intuición era correcta y el hueco es real.** Hay una tabla `identidad.contacto` —con
`valor`, `canal` y `acepta_avisos`— desde la primera migración, **y ninguna pantalla la escribe**.
Está el sitio y no está la puerta.

Lo que dicen los requisitos, textual:

| Dónde | Qué dice |
|---|---|
| `RF1` | *«contacto, evidencia y solución sugerida son opcionales según finalidad»* |
| `RF5` | *«no exige propuesta técnica, correo o ubicación exacta»* |
| `RF4` | consultar el estado *«usando un código o vía asistida, **sin obligarlo** a tener un correo»* |
| `RES-01` | el ciudadano consulta su historia con el comprobante, *«también sin correo»* |
| `N16` | *«separar identidad y contacto del contenido público… definir acceso, conservación y supresión según finalidad»* |
| `N18` | *«recordatorios requieren preferencia de contacto; participar no exige aceptar promoción»* |
| `I6`/`SEG-01` | no divulgar identidad a un rol no autorizado; Comunicaciones **no** descarga contactos |

Ninguno prohíbe el contacto. Todos prohíben **exigirlo**. La distancia entre «no obligatorio» y
«no existe» es la que hay que cerrar, y el orden que pidió el negocio —primero lo importante,
el contacto al final— es exactamente lo que `N02` y `DAT-01` ya exigen: *la recepción no depende
de nada más*.

## Una corrección al nombre, y no es cosmética

Lo llamamos aquí **contacto para seguimiento**, no «flujo validado».

Un correo que alguien escribe no valida nada: no prueba quién es, ni que viva donde dice, ni que
lo que contó sea cierto. `RF12` excluye explícitamente que el sistema invente *«identidad
verificada»*. Si la pantalla —o la consola— llama «validado» a un aporte con correo, quien revisa
lo va a pesar más que el de al lado, y habremos creado en silencio una participación de primera
y una de segunda: la de quien tiene correo y la de quien no. Es exactamente lo contrario del
objetivo.

Verificar identidad de verdad es otra cosa, cuesta, y depende de `P4`, que sigue abierta.

## CON-01 · El contacto se pide después del comprobante, nunca antes

**Quién:** la persona que ya contó.

**Con qué llega:** su aporte, ya guardado, y su código en pantalla.

**Qué queda:** un contacto declarado, o nada.

La pantalla final ya dice *«Listo. Quedó registrado con tus palabras»* y entrega el código. El
ofrecimiento va **ahí y después de eso**, con la forma de un ofrecimiento y no de un paso:

> **¿Quieres que te avisemos qué pasó?**
> Déjanos un correo o un número. Es opcional: tu aporte ya quedó registrado y con tu código
> puedes consultarlo cuando quieras, sin dar nada de esto.

**Qué NO hace:** aparecer antes del código; ser un paso de la barra «paso N de M»; llevar campos
obligatorios; llevar la casilla de avisos marcada de entrada (`N18`); bloquear la pantalla de
cierre.

**Aceptación:** una persona puede terminar sin ver un solo campo de contacto. Otra lo deja y
recibe la misma confirmación. El código funciona igual en los dos casos.

## CON-02 · Nada mejora por dejar contacto

**Qué queda:** nada distinto en la bandeja, en la prioridad ni en el orden.

Un aporte con contacto **no** se revisa antes, no se marca como más confiable y no aparece
distinto en la consola, salvo en un sitio: quien vaya a responderle necesita saber que hay por
dónde. Eso es una señal de gestión, no una calidad del aporte.

**Qué NO hace:** ordenar por tener contacto (`BI-02`); mostrarlo como «verificado»; usarlo en
ningún factor de prioridad (`PRI-01`); exportarlo (`SEG-01`, `I6` — la partición del esquema ya lo
impide, y el corte no lo lleva).

**Aceptación:** dos aportes idénticos, uno con contacto y otro sin él, salen en el mismo orden y
con el mismo aspecto en la bandeja.

## CON-03 · Qué se pide, y qué no

**Lo que se pide:** un dato de contacto —correo, teléfono o WhatsApp— y **cómo quiere que le
digamos**, que no es lo mismo que su nombre legal.

**Lo que NO se pide, nunca:** cédula, dirección, fecha de nacimiento, ni nada que no sirva para
avisarle. `C2` y `N16` son explícitos: una comunidad pequeña se identifica incluso sin nombre, y
cada dato de más es riesgo para la persona sin beneficio para nadie.

**Aceptación:** el formulario tiene dos campos y una casilla, y ninguno es obligatorio.

## CON-04 · Se puede quitar, y se borra de verdad

**Quién:** la persona, con su código.

**Qué queda:** nada. El contacto se **borra**, no se marca.

`V11` fijó el borrado lógico para lo analítico, y aquí no aplica: `Q7` dice que quien se retira
por miedo no queda protegido si la fila que lo identifica sigue ahí. El esquema ya separó
`identidad` del dato analítico justamente para que esto se pueda hacer sin tocar el registro.

**Qué NO hace:** borrar el aporte al borrar el contacto — son cosas distintas y la persona tiene
que poder hacer una sin la otra.

**Aceptación:** desde «Consultar mi aporte», con el código, se puede quitar el contacto; después
de hacerlo, la fila ya no está en la base.

## CON-05 · Avisar es un acto, no una consecuencia

**Qué queda:** un aviso queda registrado cuando alguien lo manda, con quién y cuándo.

Tener el correo no es haberle avisado, igual que mostrar un teléfono no es haber contactado
(`V13`) y remitir no es haber atendido (`GES-03`). Si la pantalla da a entender que «ya le
avisarán», promete algo que nadie se comprometió a hacer.

**Qué NO hace:** mandar correos automáticos en esta entrega; prometer un plazo de respuesta
(`Q20` sigue abierta); usar el contacto para nada que no sea lo que la persona aceptó (`N18`
prohíbe el uso publicitario y los perfiles).

## CON-06 · Sin aviso de privacidad no se enciende

**Esto es lo que hay que tener en el radar, y es lo que bloquea.**

Recoger un correo en Colombia es tratar un dato personal: la Ley 1581 de 2012 exige autorización
previa, una finalidad declarada, y **un responsable del tratamiento con nombre**. Hoy no hay
entidad operadora definida —la portada dice «Plan Nacional de Desarrollo», que es un documento—
y eso depende de `P4` y `Q18`, las dos abiertas.

Consecuencia práctica, y conviene que sea explícita: **el flujo se puede construir y probar en
local, y no se puede encender con gente real** hasta que existan (a) el nombre de la entidad
responsable, (b) el aviso de privacidad y la finalidad, (c) la decisión sobre conservación y
supresión que pide `Q7`.

Es el mismo tipo de bloqueo que `Q29` para el proveedor de IA: construir sí, encender no.

## Lo que queda abierto

| | |
|---|---|
| **Quién responde por el tratamiento** | Depende de `P4`/`Q18`. Sin eso no hay aviso de privacidad que escribir |
| **Cuánto se conserva y cuándo se suprime** | `Q7`, ya abierta; esto la vuelve urgente |
| **Quién manda los avisos y con qué medio** | No hay canal de comunicaciones decidido; `Q29` afecta si pasa por un tercero |
| **Si el facilitador puede escribir el contacto por la persona** | En una mesa lo va a intentar; hay que decidirlo antes del piloto, no durante |
